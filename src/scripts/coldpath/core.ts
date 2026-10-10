/**
 * The Coldpath engine's matching and gate rules, as they run on the case
 * study page. The logic is ported unchanged from the engine:
 *
 *   resolve core  app/src/lib/resolve/{normalise,match}.ts
 *   gate core     the rules in INGESTION-GATES.md
 *   calc core     the whitespace estimator
 *
 * Only types were added. Change a threshold or a word list here and the page
 * no longer shows what the engine does, so do not.
 */

/* ------------------------------------------------------------ resolve core */

const JUNK = new Set(['na', 'n a', 'n/a', 'unknown', 'none', '-', '', 'test', 'tbd', 'xxx', 'not applicable']);
const LEGAL_SUFFIXES = /\b(incorporated|inc|llc|ltd|lp|llp|corp|corporation|company|co|plc|gmbh|sa|nv|bv|the|and)\b/gi;
const GENERIC = new Set([
  'logistics', 'logistic', 'cold', 'storage', 'stores', 'foods', 'food', 'group', 'holdings', 'holding', 'companies',
  'company', 'services', 'service', 'industries', 'industry', 'international', 'global', 'national', 'systems', 'system',
  'distribution', 'warehousing', 'warehouse', 'frozen', 'refrigerated', 'partners', 'partner', 'enterprise', 'enterprises',
  'wholesale', 'grocers', 'grocery', 'dairy', 'farms', 'farm', 'meats', 'meat', 'poultry', 'beef', 'pork', 'seafood',
  'terminal', 'transport', 'trucking', 'lines', 'line', 'provisions', 'provision', 'brands', 'brand', 'usa', 'american',
  'the', 'and', 'of', 'solutions', 'management', 'operating',
]);
const WEAK = new Set([
  'united', 'states', 'national', 'general', 'standard', 'premium', 'quality', 'first', 'great', 'pacific', 'atlantic',
  'central', 'western', 'eastern', 'northern', 'southern', 'america', 'north', 'south',
]);
export const TYPO_THRESHOLD = 0.84;
export const MATCH_MIN = 0.5;
export const SCORE_MIN = 0.62;
export const QUEUE_BAND = 0.7;

export interface DistMatch {
  ratio: number;
  strongShared: number;
  shared: number;
}

export type Verdict = 'SUPPRESSED' | 'HUMAN QUEUE' | 'CLEAR';

export interface SuppressionResult {
  verdict: Verdict;
  exact: boolean;
  score: number;
  dm: DistMatch;
  loose: number;
}

export function normName(s: unknown): string {
  return (s == null ? '' : String(s))
    .toLowerCase()
    .replace(/[^a-z0-9& ]/g, ' ')
    .replace(LEGAL_SUFFIXES, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokensOf(s: string): string[] {
  return [...new Set(normName(s).split(' ').filter((t) => t.length > 1))];
}

export function isJunkName(s: string): boolean {
  const n = normName(s);
  return n.length === 0 || JUNK.has(n);
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur.push(Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1)));
    }
    prev = cur;
  }
  return prev[n]!;
}

function typoSim(a: string, b: string): number {
  const na = normName(a);
  const nb = normName(b);
  if (!na.length || !nb.length) return 0;
  return 1 - levenshtein(na, nb) / Math.max(na.length, nb.length);
}

function tokenSim(a: string, b: string): number {
  if (a === b) return 1;
  const m = Math.max(a.length, b.length);
  return m ? 1 - levenshtein(a, b) / m : 0;
}

export function distinctive(s: string): string[] {
  return tokensOf(s).filter((t) => !GENERIC.has(t) && t.length > 2);
}

export function strongTokens(s: string): string[] {
  return distinctive(s).filter((t) => t.length >= 5 && !WEAK.has(t));
}

function distMatch(a: string, b: string): DistMatch {
  const A = distinctive(a);
  const B = distinctive(b);
  if (!A.length || !B.length) return { ratio: 0, strongShared: 0, shared: 0 };
  const Bset = new Set(B);
  let shared = 0;
  let typoShared = 0;
  for (const x of A) {
    if (Bset.has(x)) shared += 1;
    else if (x.length >= 5 && B.some((y) => y.length >= 5 && tokenSim(x, y) >= TYPO_THRESHOLD)) typoShared += 1;
  }
  const As = strongTokens(a);
  const Bs = strongTokens(b);
  const strongShared = As.filter((x) => Bs.includes(x) || Bs.some((y) => tokenSim(x, y) >= TYPO_THRESHOLD)).length;
  return { ratio: (shared + typoShared * 0.85) / Math.min(A.length, B.length), strongShared, shared: shared + typoShared };
}

function jaccard(a: string, b: string): number {
  const A = new Set(tokensOf(a));
  const B = new Set(tokensOf(b));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  return inter / (A.size + B.size - inter);
}

function looseSim(a: string, b: string): number {
  return Math.max(jaccard(a, b), typoSim(a, b));
}

function scoreCandidate(input: string, candidate: string): { score: number; dm: DistMatch } {
  const dm = distMatch(input, candidate);
  const score =
    dm.strongShared > 0
      ? Math.min(0.99, SCORE_MIN + dm.ratio * 0.37)
      : dm.shared > 0
        ? dm.ratio * 0.5
        : looseSim(input, candidate) * 0.4;
  return { score, dm };
}

export function isAcceptableMatch(score: number, dm: DistMatch): boolean {
  return dm.strongShared > 0 && dm.ratio >= MATCH_MIN && score >= SCORE_MIN;
}

export function suppressionVerdict(prospect: string, customer: string): SuppressionResult {
  const { score, dm } = scoreCandidate(prospect, customer);
  const loose = looseSim(prospect, customer);
  const na = normName(prospect);
  const nb = normName(customer);
  if (na.length > 0 && !JUNK.has(na) && na === nb) return { verdict: 'SUPPRESSED', exact: true, score: 1, dm, loose };
  if (isAcceptableMatch(score, dm)) return { verdict: 'SUPPRESSED', exact: false, score, dm, loose };
  if (loose >= QUEUE_BAND) return { verdict: 'HUMAN QUEUE', exact: false, score, dm, loose };
  return { verdict: 'CLEAR', exact: false, score, dm, loose };
}

/* --------------------------------------------------------------- gate core */

export const OUTLIER = { median: 20000, p99: 158000, mult: 10 };

export interface FacilityRecord {
  name: string;
  city: string;
  state: string;
  naics: string;
  ammonia_lb: number;
  months_since_activity: number;
}

export type GateResult = 'PASS' | 'WARN' | 'REFUSE' | 'REFUSE*';

export interface GateStep {
  id: string;
  name: string;
  v: GateResult;
  why: string;
}

const lb = (n: number) => n.toLocaleString('en-US');

/** The rules are the engine's; the reasons are worded for this page. */
export function runGates(rec: FacilityRecord, customers: string[]): { steps: GateStep[]; refused: string | null } {
  const steps: GateStep[] = [];
  let refused: string | null = null;
  if (isJunkName(rec.name)) {
    steps.push({
      id: 'G3/C4',
      name: 'Usable name',
      v: 'REFUSE',
      why: `No usable company name after normalisation. "${rec.name}" is a placeholder value, not a company.`,
    });
    refused = refused || 'unresolved_name';
  } else steps.push({ id: 'G3/C4', name: 'Usable name', v: 'PASS', why: `Normalises to "${normName(rec.name)}".` });
  if (!refused) {
    if (rec.ammonia_lb > OUTLIER.p99 * OUTLIER.mult) {
      steps.push({
        id: 'G-OUT',
        name: 'Numeric outlier',
        v: 'REFUSE',
        why: `${lb(rec.ammonia_lb)} lb is more than ten times the 99th percentile (${lb(OUTLIER.p99)} lb). The median is ${lb(OUTLIER.median)} lb. Probably a units error or a misclassified filing, so it is excluded from scoring until a person reviews it.`,
      });
      refused = 'numeric_outlier';
    } else
      steps.push({
        id: 'G-OUT',
        name: 'Numeric outlier',
        v: 'PASS',
        why: `${lb(rec.ammonia_lb)} lb is within the ${lb(OUTLIER.p99 * OUTLIER.mult)} lb threshold.`,
      });
  }
  if (!refused) {
    let worst: { r: SuppressionResult; c: string } | null = null;
    for (const c of customers) {
      const r = suppressionVerdict(rec.name, c);
      if (r.verdict === 'SUPPRESSED') {
        worst = { r, c };
        break;
      }
      if (r.verdict === 'HUMAN QUEUE' && !worst) worst = { r, c };
    }
    if (worst && worst.r.verdict === 'SUPPRESSED') {
      steps.push({
        id: 'C5',
        name: 'Customer suppression',
        v: 'REFUSE*',
        why: `Matches existing customer "${worst.c}" on a distinctive word (score ${worst.r.score.toFixed(2)}). Kept and listed with the matching alias, never silently deleted.`,
      });
      refused = 'suppressed_customer';
    } else if (worst) {
      steps.push({
        id: 'C5',
        name: 'Customer suppression',
        v: 'WARN',
        why: `Fuzzy similarity of ${worst.r.loose.toFixed(2)} with "${worst.c}". Fuzzy similarity alone never suppresses, so this goes to the review queue.`,
      });
    } else
      steps.push({
        id: 'C5',
        name: 'Customer suppression',
        v: 'PASS',
        why: 'No exact alias or distinctive-word match with any customer.',
      });
  }
  if (!refused) {
    if (rec.months_since_activity >= 12)
      steps.push({
        id: 'C8',
        name: 'Activity currency',
        v: 'WARN',
        why: `Untouched for ${rec.months_since_activity} months (12 or more). Flagged, not deleted: a stale record is still a real account.`,
      });
    else steps.push({ id: 'C8', name: 'Activity currency', v: 'PASS', why: 'Active within the last 12 months.' });
  }
  return { steps, refused };
}

/* --------------------------------------------------------------- calc core */

export function calcWhitespace(facilities: number, perAccount: number, coveragePct: number) {
  const resolved = Math.round(facilities / perAccount);
  const matched = Math.round((resolved * coveragePct) / 100);
  return { resolved, matched, whitespace: resolved - matched };
}

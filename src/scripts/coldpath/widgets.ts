/**
 * The interactive parts of the Coldpath case study: the freshness badge, the
 * suppression auditor, the gate visualiser, the whitespace calculator and the
 * demo's starting points. Each one finds its markup by id and does nothing if
 * it is missing. Without JavaScript the page shows a short note instead.
 */

import {
  MATCH_MIN,
  SCORE_MIN,
  calcWhitespace,
  distinctive,
  normName,
  runGates,
  strongTokens,
  suppressionVerdict,
  tokensOf,
} from './core';
import * as copy from './copy';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T | null;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children);
  return node;
}

/** Preset buttons that show which one is selected with aria-pressed. */
function presetButtons(host: HTMLElement, presets: { label: string }[], onPick: (i: number) => void): void {
  const buttons = presets.map((p, i) => {
    const b = el('button', 'cp-chip', p.label);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(i === 0));
    b.addEventListener('click', () => {
      buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      onPick(i);
    });
    return b;
  });
  host.replaceChildren(...buttons);
}

/* --------------------------------------------------------- freshness badge */

interface Freshness {
  pulled_at: string;
  facilities?: number;
  accounts: number;
  sites: number;
  states: number;
  static?: boolean;
  delta_accounts?: number | null;
}

async function freshnessBadge(): Promise<void> {
  const badges = document.querySelectorAll<HTMLElement>('[data-fresh]');
  if (badges.length === 0) return;
  let d: Freshness | null = null;
  try {
    const res = await fetch('/work/coldpath/data/freshness.json', { cache: 'no-store' });
    if (res.ok) d = (await res.json()) as Freshness;
  } catch {
    // Keep the snapshot text already in the page.
  }
  if (!d?.pulled_at) return;
  const pulled = new Date(`${d.pulled_at}T00:00:00Z`);
  const date = pulled.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const days = Math.max(0, Math.round((Date.now() - pulled.getTime()) / 86400000));
  const when = d.static ? copy.freshness.snapshot(date) : copy.freshness.live(days, date);
  const counts = copy.freshness.counts((d.facilities ?? 0).toLocaleString('en-US'), d.accounts, d.sites, d.states);
  const delta = typeof d.delta_accounts === 'number' ? `. ${copy.freshness.delta(d.delta_accounts)}` : '';
  for (const b of badges) {
    (b.querySelector('[data-fresh-text]') ?? b).textContent = `${when}: ${counts}${delta}`;
    b.dataset.state = d.static ? 'snapshot' : 'live';
  }
}

/* ------------------------------------------------------- suppression auditor */

function auditor(): void {
  const host = $('auditor');
  const a = $<HTMLInputElement>('audProspect');
  const b = $<HTMLInputElement>('audCustomer');
  const out = $('audOut');
  const chips = $('audPresets');
  if (!host || !a || !b || !out || !chips) return;
  const t = copy.auditor;
  host.dataset.ready = '';

  const fmt = (n: number) =>
    (Math.round(n * 1000) / 1000)
      .toFixed(3)
      .replace(/0+$/, '')
      .replace(/\.$/, '');

  const tokens = (name: string) => {
    const all = tokensOf(name);
    const dist = new Set(distinctive(name));
    const strong = new Set(strongTokens(name));
    if (all.length === 0) return [el('span', 'cp-tok cp-tok--gen', t.none)];
    return all.map((x) => el('span', `cp-tok cp-tok--${strong.has(x) ? 'strong' : dist.has(x) ? 'dist' : 'gen'}`, x));
  };

  const row = (term: string, ...detail: (Node | string)[]) => [el('dt', '', term), el('dd', '', ...detail)];

  const render = () => {
    const pa = a.value.trim();
    const pb = b.value.trim();
    if (!pa || !pb) {
      out.replaceChildren(el('p', 'cp-muted', t.empty));
      return;
    }
    const r = suppressionVerdict(pa, pb);
    const ok = r.dm.strongShared > 0 && r.dm.ratio >= MATCH_MIN && r.score >= SCORE_MIN;
    const verdict = el('span', `cp-verdict cp-verdict--${r.verdict === 'SUPPRESSED' ? 'refuse' : r.verdict === 'HUMAN QUEUE' ? 'warn' : 'pass'}`, t.verdicts[r.verdict]);
    const dl = el(
      'dl',
      'cp-rows',
      ...row(t.rows.normalised, `"${normName(pa)}" vs "${normName(pb)}"`),
      ...row(t.rows.prospect, ...tokens(pa)),
      ...row(t.rows.customer, ...tokens(pb)),
      ...row(t.rows.shared, t.shared(r.dm.shared, fmt(r.dm.ratio), r.dm.strongShared)),
      ...row(t.rows.oldMethod, el('span', 'cp-old', t.old(fmt(r.loose), r.loose >= SCORE_MIN))),
      ...(r.exact ? row(t.rows.exact, t.exactNote) : []),
      ...row(t.rows.newMethod, t.scored(fmt(r.score), SCORE_MIN, ok)),
      ...row(t.rows.verdict, verdict),
    );
    out.replaceChildren(dl, el('p', 'cp-explain', t.explain[r.verdict]));
    out.dataset.verdict = r.verdict;
  };

  presetButtons(chips, t.presets, (i) => {
    a.value = t.presets[i]!.a;
    b.value = t.presets[i]!.b;
    render();
  });
  a.addEventListener('input', render);
  b.addEventListener('input', render);
  render();
}

/* ----------------------------------------------------------- gate visualiser */

function gateVisualiser(): void {
  const host = $('gates');
  const chips = $('gatePresets');
  const recEl = $('gateRec');
  const outEl = $('gateOut');
  const finEl = $('gateFinal');
  if (!host || !chips || !recEl || !outEl || !finEl) return;
  const t = copy.gates;
  host.dataset.ready = '';
  const timers: number[] = [];

  const render = (i: number) => {
    timers.splice(0).forEach(clearTimeout);
    const rec = t.presets[i]!.rec;
    recEl.replaceChildren(
      el('span', 'cp-rec__label', t.record),
      ...(
        [
          ['name', rec.name],
          ['city', `${rec.city}, ${rec.state}`],
          ['naics', rec.naics],
          ['ammonia_lb', rec.ammonia_lb.toLocaleString('en-US')],
          ['months_since_activity', String(rec.months_since_activity)],
        ] as const
      ).map(([k, v]) => el('span', 'cp-rec__field', `${k}: `, el('b', '', v))),
    );

    const { steps, refused } = runGates(rec, t.customers);
    const rows = steps.map((s, k) => {
      const tone = s.v === 'PASS' ? 'pass' : s.v === 'WARN' ? 'warn' : 'refuse';
      const tr = el(
        'tr',
        'cp-gate',
        el('td', 'cp-gate__id', s.id),
        el('td', 'cp-gate__name', s.name),
        el('td', '', el('span', `cp-verdict cp-verdict--${tone}`, s.v)),
        el('td', 'cp-gate__why', s.why),
      );
      tr.dataset.gate = s.id;
      tr.dataset.result = s.v;
      if (!reduceMotion) timers.push(window.setTimeout(() => tr.classList.add('is-in'), 80 + k * 140));
      else tr.classList.add('is-in');
      return tr;
    });
    outEl.replaceChildren(...rows);

    const warned = steps.some((s) => s.v === 'WARN');
    const tone = refused ? 'refuse' : warned ? 'warn' : 'pass';
    const fin = el('p', `cp-final cp-final--${tone}`, refused ? t.final.refused(refused) : warned ? t.final.warn : t.final.pass);
    finEl.replaceChildren(fin);
    if (!reduceMotion) {
      fin.classList.add('is-waiting');
      timers.push(window.setTimeout(() => fin.classList.remove('is-waiting'), 150 + steps.length * 140));
    }
  };

  presetButtons(chips, t.presets, render);
  render(0);
}

/* ------------------------------------------------------ whitespace calculator */

function calculator(): void {
  const host = $('calc');
  const f = $<HTMLInputElement>('calcFac');
  const p = $<HTMLInputElement>('calcPer');
  const c = $<HTMLInputElement>('calcCov');
  if (!host || !f || !p || !c) return;
  host.dataset.ready = '';
  const set = (id: string, text: string) => {
    const node = $(id);
    if (node) node.textContent = text;
  };
  const render = () => {
    set('calcFacV', Number(f.value).toLocaleString('en-US'));
    set('calcPerV', Number(p.value).toFixed(1));
    set('calcCovV', `${Number(c.value).toFixed(1)}%`);
    const r = calcWhitespace(Number(f.value), Number(p.value), Number(c.value));
    set('calcResolved', r.resolved.toLocaleString('en-US'));
    set('calcMatched', r.matched.toLocaleString('en-US'));
    set('calcWhite', r.whitespace.toLocaleString('en-US'));
  };
  for (const input of [f, p, c]) input.addEventListener('input', render);
  render();
}

/* --------------------------------------------------------- demo deep links */

function demoMenu(): void {
  const menu = $('demoMenu');
  const frame = $<HTMLIFrameElement>('demoFrame');
  const caption = $('demoCaption');
  const open = $<HTMLAnchorElement>('demoOpen');
  if (!menu || !frame || !caption || !open) return;
  const buttons = Array.from(menu.querySelectorAll<HTMLButtonElement>('button[data-view]'));
  for (const b of buttons) {
    b.hidden = false;
    b.addEventListener('click', () => {
      const params = new URLSearchParams({ view: b.dataset.view ?? 'dash' });
      if (b.dataset.vert) params.set('vert', b.dataset.vert);
      const src = `${frame.dataset.base}?${params}`;
      frame.src = src;
      open.href = src;
      caption.textContent = b.dataset.caption ?? '';
      buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    });
  }
}

freshnessBadge();
auditor();
gateVisualiser();
calculator();
demoMenu();

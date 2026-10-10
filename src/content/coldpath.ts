/**
 * The Coldpath case study at /work/coldpath/. The client is real and is never
 * named; the demo replaces them with the fictional "Gridwell". The interactive
 * widgets live in src/scripts/coldpath/, and the prototype itself is a static
 * file in public/work/coldpath/demo/.
 */

import { CONTACT_EMAIL, LINKS } from './brand';

/** The 60-minute run has its own subject line, so David can tell it apart from a discovery call. */
export const WHITESPACE_RUN_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Whitespace run')}`;

export const DEMO_PATH = '/work/coldpath/demo/coldpath-sandbox.html';

export const coldpath = {
  title: 'Coldpath: anatomy of a whitespace engine',
  description:
    'How one public dataset revealed 112 accounts a sales team had never targeted, and the two defects that were caught before launch. Interactive case study with a live demo.',
  image: '/work/coldpath/og.png',
  imageAlt: 'Anatomy of a whitespace engine: 112 untapped accounts from one public register.',

  hero: {
    eyebrow: 'Case study: account intelligence from public data',
    heading: 'Anatomy of a whitespace engine',
    lede: 'How one public dataset revealed 112 accounts a sales team had never targeted, and the two defects that were caught before launch.',
    note: 'Client name withheld. Demo personas are fictional. The data and the code are real.',
    stats: [
      { value: '1,382', label: 'facilities read from the public EPA register' },
      { value: '126', label: 'accounts resolved through 49 specified gates' },
      { value: '779', label: 'sites across 43 states' },
      { value: '112', label: 'untapped accounts absent from the CRM', accent: true },
      { value: '128', label: 'automated tests behind the demo on this page' },
      { value: '2', label: 'industries running on one engine' },
    ],
    freshness: 'EPA RMP data, snapshot of 13 September 2026: 1,382 facilities, 126 accounts, 779 sites, 43 states',
    demoLink: 'Try the live demo',
    runLink: 'Book a 60-minute run on your market',
    contentsLabel: 'On this page',
  },

  /** Section ids double as the "On this page" links. */
  contents: [
    { id: 'outlier', label: 'The outlier' },
    { id: 'near-miss', label: 'The near-miss' },
    { id: 'brief', label: 'The brief' },
    { id: 'method', label: 'The method' },
    { id: 'outcomes', label: 'The outcomes' },
    { id: 'demo', label: 'Live demo' },
    { id: 'playbook', label: 'The playbook' },
    { id: 'how-i-work', label: 'How I work' },
    { id: 'book', label: 'The live run' },
  ],

  outlier: {
    eyebrow: 'The outlier',
    heading: 'One facility declared 89 million pounds of ammonia',
    lede: 'The median filer in the dataset holds 20,000 lb. This one, a marine terminal in Beaumont, Texas, declared 4,450 times the median. Scored without a check, it becomes the top "prospect" in America, and the first client call ends the engagement.',
    chartLabel:
      'Log-scale comparison: median filing 20,000 lb; 99th percentile 158,000 lb; gate threshold 1,580,000 lb; Neches Terminal 89,000,000 lb, refused.',
    bars: [
      { label: 'Median filing', value: '20,000 lb', width: 26 },
      { label: '99th percentile', value: '158,000 lb', width: 44 },
      { label: 'Gate threshold', detail: '99th percentile × 10', value: '1,580,000 lb', width: 64, kind: 'gate' },
      { label: 'Neches Terminal', value: '89,000,000 lb', width: 99, kind: 'refused' },
    ],
    ticks: ['1k', '10k', '100k', '1M', '10M', '100M'],
    scale: 'Log scale',
    defect: {
      title: 'Defect card 1: numeric outlier',
      rows: [
        { term: 'Symptom', text: 'A self-reported units error makes a marine terminal the highest-scoring cold-chain prospect in the country.' },
        {
          term: 'Root cause',
          text: 'EPA RMP data is self-reported, and the EPA itself warns it "may contain errors or omissions". Trusting a field simply because it exists was the defect.',
        },
        {
          term: 'Fix',
          text: 'A distribution gate. Anything above ten times the 99th percentile is excluded from scoring and sent for human review with its reason recorded. Nothing is silently dropped.',
        },
        { term: 'Now', text: 'Neches Terminal is a regression test. If the gate ever stops catching it, the build fails.' },
      ],
    },
    quote:
      'The hard part is not fetching the data. It is deciding what may be trusted, what must be reviewed by a person, and what must never reach outbound, and proving those decisions in code rather than describing them in a document.',
    quoteSource: 'From the Coldpath readme',
    aside: "Every purchased list hides a facility like this one. I'll find the one in your market, live on a call.",
  },

  nearMiss: {
    eyebrow: 'The near-miss',
    heading: 'Four characters between a customer and a prospect',
    lede: 'An early resolver matched company names by whole-string similarity. VersaCold Logistics, the cold-chain subsidiary of Loblaw and a genuine top-tier prospect, scored 0.79 against Americold Logistics, an existing customer. The edit distance between "versacold" and "americold" is four characters. The engine suppressed VersaCold as a customer, with no error and no queue item. The list was simply one account short.',
    defect: {
      title: 'Defect card 2: fuzzy suppression',
      rows: [
        { term: 'Symptom', text: "A real prospect quietly disappears from the list because its name looks like a customer's." },
        { term: 'Root cause', text: 'Whole-string similarity rewards shared generic words such as "logistics", and near-identical brand names.' },
        {
          term: 'Fix',
          text: 'A match now needs at least one shared distinctive word. Generic industry words and weak words such as "united", "national" and "premium" are removed first, and typo tolerance applies only to distinctive words, at a similarity of 0.84 or more.',
        },
        {
          term: 'Now',
          text: '"VersaCold" is a named regression test, and the rule is now policy: fuzzy similarity alone never suppresses a record. It goes to a person.',
        },
      ],
    },
    intro:
      "The widget below runs the engine's real resolution logic, ported line for line from its resolve module into your browser. Try the presets, or type any two company names.",
  },

  auditor: {
    title: 'Suppression auditor',
    badge: 'Live logic',
    source: 'Ported from app/src/lib/resolve/match.ts. Thresholds: typo 0.84, ratio 0.5, score 0.62.',
    presetsLabel: 'Preset name pairs',
    prospectLabel: 'Incoming prospect',
    customerLabel: 'Existing customer or alias',
    noscript: 'This widget needs JavaScript. The live demo further down the page runs the same logic.',
  },

  brief: {
    eyebrow: 'The brief',
    heading: 'A sales team, a purchased list and a better question',
    paragraphs: [
      "The client, an industrial energy optimisation company selling demand response services to cold-chain operators, worked the way most sales teams do. They bought contact lists, scraped directories and asked reps to find more. Lists like that tell you who exists. They never tell you who you are missing, they quietly include your existing customers under their subsidiaries' names, and they arrive with no evidence attached.",
      'So we reframed the question: "Which companies in our market are not in our CRM, and why would they take the call?"',
      'The answer was regulatory, not commercial. Any US facility holding more than 10,000 lb of anhydrous ammonia must file a Risk Management Plan with the EPA, and those filings are public: name, address, industry code, chemical quantity, accident history and grid region. That makes the register a near-complete, regularly updated census of the cold-chain market, free of charge.',
    ],
    playbookLead: 'Most industries have an equivalent register, and most sales teams have never looked for theirs.',
    playbookLink: 'The playbook maps nine of them',
  },

  method: {
    eyebrow: 'The method',
    heading: 'Prove it in code, not in documents',
    lede: 'One pipeline, with a gate at every step. Nothing reaches a person, let alone a prospect, without passing rules that are pure functions with tests. Nothing refused is deleted: refusals land in a review queue with their reasons attached.',
    pipelineLabel: 'The Coldpath pipeline, in order',
    pipeline: [
      { name: 'Public register', detail: '1,382 EPA filings pulled, raw records kept' },
      { name: 'Ingestion gates', detail: '49 specified: pass, warn or refuse with a reason', kind: 'gate' },
      { name: 'Entity resolution', detail: '272 aliases resolved to 126 accounts' },
      { name: 'Customer suppression', detail: 'Exact alias or distinctive word only' },
      { name: 'Whitespace', detail: 'Register minus CRM: the 112', kind: 'gate' },
      { name: 'Research', detail: 'Every claim cites a real source row, or it is dropped' },
      { name: 'Human gate', detail: 'AI ranks and drafts. People confirm.', kind: 'human' },
      { name: 'CRM', detail: 'Confirmed leads and briefs, daily and on demand' },
    ],
    principles: [
      {
        tag: 'Principle 1',
        title: 'Every rule is a pure function with a test',
        body: 'Each gate takes a record and its context and returns pass, warn or refuse, with a reason. There is no database, network or model inside, so every gate is unit-tested and the acceptance suite runs on every change.',
      },
      {
        tag: 'Principle 2',
        title: 'Refusals fail closed and stay visible',
        body: 'No role means no access. An unknown route is refused. Omitted personal fields are absent from the payload, not masked. A suppressed account is kept and listed with the alias that matched, so every decision can be audited.',
      },
      {
        tag: 'Principle 3',
        title: 'AI drafts, people confirm',
        body: "A generated claim must cite a source row that exists, or it is dropped. Model judgement may reorder the review queue, but it can never confirm a lead or clear a suppression. That was the client's own policy, built into the export filter rather than written in a guideline.",
      },
    ],
    intro:
      "Here is that approach running in your browser. Pick a record, including the two behind the defect cards above, and watch the gates respond. The rules and constants are the engine's own: a median of 20,000 lb and a 99th percentile of 158,000 lb, from the 13 September 2026 pull.",
  },

  gates: {
    title: 'Gate visualiser',
    badge: 'Live logic',
    source: 'Rules from INGESTION-GATES.md. Constants from the committed pull.',
    presetsLabel: 'Preset records',
    columns: ['Gate', 'Name', 'Result', 'Reason'],
    footnote:
      'A refusal is never a deletion. Every refused record lands in the review queue with its reason, where a person decides. Nothing in this pipeline reaches outbound on machine judgement alone.',
    noscript: 'This widget needs JavaScript. The live demo further down the page runs the same gates.',
  },

  outcomes: {
    eyebrow: 'The outcomes',
    heading: '112 accounts nobody was calling',
    lede: "Reconciling the resolved register against the CRM produced three lists: matched accounts to enrich straight away, CRM-only accounts the register cannot enrich, and register-only accounts, which are the whitespace. Against the demo's sample CRM, that is 112 prospects, led by names every rep in the industry knows and none had in their patch.",
    tableCaption: 'The largest untapped accounts',
    columns: ['Untapped account', 'Sites in the register', 'Why it ranks'],
    rows: [
      { name: 'Walmart', sites: '39', why: 'The largest private ammonia fleet in the country, with heavy distribution centre refrigeration load' },
      { name: 'JBS USA', sites: '19', why: 'Protein processing, with a large continuous refrigeration load' },
      { name: 'Tyson Foods', sites: '17', why: 'The same profile as JBS, and one of three accounts researched end to end in the demo' },
      { name: 'US Foods Holding', sites: '20', why: 'Broadline foodservice distribution, exposed to prices in several grid regions' },
    ],
    more: 'And 108 more, including Albertsons and Safeway, Dairy Farmers of America, Costco and DOT Foods, each with a site list, ammonia totals, accident history, grid region and a rank score.',
    howTitle: 'How the number is calculated',
    how: "From the committed 13 September 2026 pull and the demo's 14-row sample CRM, using the resolver on this page: 126 accounts, minus 11 matched by exact alias or distinctive word, minus 1 existing customer flagged in the registry, minus 2 waiting for a human decision (fuzzy matches never match automatically), leaves 112. A script in the repository recalculates the figure and fails if it ever drifts. Older documents quoting 111 or 106 predate two resolution fixes.",
    compare: [
      {
        title: 'What a purchased list gives you',
        tone: 'bought',
        items: [
          'Names that exist, not the names you are missing',
          'Your own customers, under subsidiary names you did not recognise',
          'Contact data of unknown age and unknown consent',
          "No evidence, only a vendor's accuracy claim",
          'The same list your competitors bought',
        ],
      },
      {
        title: 'What the engine gives you',
        tone: 'built',
        items: [
          'A census of the market, refreshed on schedule',
          'Customers suppressed, with the matching alias shown',
          'Every figure traceable to a public source row',
          'Ranking by physical load: size, price exposure and flexibility',
          'A list nobody else can buy, because it is assembled, not sold',
        ],
      },
    ],
    honestTitle: 'A note on the number',
    honest:
      "The 112 was measured against the demo's sample CRM export. Your number comes from running your own export through the same reconciliation, and it only means something then.",
    secondHeading: 'The same method works beyond cold chain',
    second:
      'The same engine (connector, gates, resolver and review queue) now runs a second industry: municipal water and wastewater, resolving 732 utility accounts from EPA chlorine filings. A calibrated judgement model ranks the review queue but never confirms it, under the same rule. A new industry needs one new connector, not a new product. Move the sliders to see how the method scales to any register.',
  },

  calc: {
    title: 'Whitespace calculator',
    badge: 'Estimator',
    source: 'Accounts = facilities ÷ facilities per account. Whitespace = accounts × (1 − CRM coverage).',
    facilities: 'Register size (facilities)',
    perAccount: 'Facilities per account',
    coverage: 'CRM coverage of resolved accounts',
    resolved: 'accounts resolved',
    matched: 'already known or pending',
    whitespace: 'untapped accounts',
    note: 'The defaults are the real figures: 1,382 facilities, 126 accounts, 14 already accounted for (matched, flagged or waiting for a person) and 112 untapped. The sliders give an estimate. The engine itself does this with entity resolution, suppression gates and an audit trail.',
    noscript: 'This calculator needs JavaScript.',
  },

  demo: {
    eyebrow: 'The live demo',
    heading: 'Try the working prototype',
    lede: 'Below is the working prototype: one self-contained file, 14 screens, no install and no backend. Nothing you do in it leaves your browser, and 39 of the 49 specified gates run live inside it. Pick a starting point.',
    menuLabel: 'Demo starting points',
    views: [
      {
        label: 'Guided tour',
        view: 'dash',
        caption: "Command dashboard, the marketing team's cockpit. A two-minute guided tour starts automatically in a fresh browser.",
      },
      {
        label: 'Market map',
        view: 'list',
        vert: 'cold',
        caption: "Build list: the EPA register resolved live into 125 accounts and 774 sites from the demo's September build, ranked by fit.",
      },
      {
        label: 'Poisoned import',
        view: 'crm',
        caption: 'CRM import: load a sample export with 11 planted faults and watch the gates respond, including two customers suppressed under different legal names.',
      },
      {
        label: 'Researched brief',
        view: 'intel',
        caption: 'Account intelligence: The Kroger Co., researched from public sources, with a citation on every figure.',
      },
      {
        label: 'Review queue',
        view: 'queue',
        caption: 'Review queue: every refusal and open question, with its reason. Nothing waits silently.',
      },
      {
        label: 'Sales view',
        view: 'library',
        caption: 'Rep library: the sales view, with briefs, one-pagers and email drafts. Sign in with code 5432.',
      },
      {
        label: 'Second industry',
        view: 'list',
        vert: 'water',
        caption: 'Water: the same engine on a different industry, with 732 municipal water accounts from chlorine filings.',
      },
    ],
    codes: [
      { label: 'Marketing (full engine)', code: '9876' },
      { label: 'Sales (rep library)', code: '5432' },
    ],
    codesNote: 'Demo codes are for convenience, not security. Production signs in through your own Google or Microsoft account.',
    frameTitle: 'Coldpath interactive prototype',
    open: 'Open full screen',
    remember: 'Enter the code once when prompted. The demo remembers it for the session.',
    compare: [
      {
        title: 'What is real in this demo',
        tone: 'built',
        items: [
          'The data: the EPA RMP pull of 13 September 2026 (CC BY-SA, attributed in the app)',
          'CSV parsing and the validation gates, running in your browser on the actual records',
          'Entity resolution and customer suppression, ported from the production module',
          'The research on Kroger, Tyson and NewCold, which is real, sourced and was written before the demo existed',
        ],
      },
      {
        title: 'What is pre-built, and why',
        tone: 'baked',
        items: [
          'AI responses are pre-generated, so the file works without an API key or a network',
          'Nothing saves to a database, so a refresh resets it. The production build keeps everything.',
          'Sign-in codes are visible in the source on purpose. Production uses your own single sign-on, with roles enforced on the server.',
          "The demo's registry was frozen at its September 2026 build, so its counts can differ by a record or two from this page, which is recalculated from the current pipeline.",
          'Known prototype defects are documented and scheduled. The production backlog is written from them.',
        ],
      },
    ],
    aside: 'That demo runs on public cold-chain data. Point it at your market instead, live on a call.',
  },

  playbook: {
    eyebrow: 'The playbook',
    heading: 'If a public register lists your market, this method finds your whitespace',
    lede: 'The engine is not a cold-chain product. It answers a two-part test, and that test passes in more industries than most people expect.',
    tests: [
      {
        tag: 'Test 1: coverage',
        title: 'Is there a public register that lists nearly everyone?',
        body: 'Permits, filings, registrations and inspections. Regulators publish them, competitors overlook them, and they update on their own.',
      },
      {
        tag: 'Test 2: signal',
        title: 'Does the register hold a field that predicts buying?',
        body: 'Ammonia volume predicts refrigeration load. Design flow predicts pump power. Permit value predicts the project pipeline. One good field is worth more than a thousand firmographics.',
      },
    ],
    tableCaption: 'Industries and the registers that list them',
    columns: ['Industry', 'The register that lists it', 'The ranking signal', 'Status'],
    rows: [
      { industry: 'Cold storage and food logistics', register: 'EPA RMP ammonia filings (over 10,000 lb)', signal: 'Ammonia volume, grid region and accident history', status: 'Built: 126 accounts', built: true },
      { industry: 'Municipal water and wastewater', register: 'EPA NPDES discharge permits and facility registry', signal: 'Design flow as a proxy for pump power, with elevated storage as a buffer', status: 'Built: 732 accounts', built: true },
      { industry: 'Cement and minerals', register: 'State air permits and mine registrations', signal: 'Clinker capacity and days of silo storage', status: 'Mapped, not built' },
      { industry: 'EV and truck depots', register: 'Utility interconnection filings and charger permits', signal: 'Charger count and power, with overnight dwell as flexibility', status: 'Mapped, not built' },
      { industry: 'Restaurants and quick service', register: 'City and county health inspection scores (open data)', signal: 'Repeat refrigeration violations point to equipment trouble', status: 'Register identified' },
      { industry: 'Hospitals and health systems', register: 'CMS cost reports and state licensing files', signal: 'Facility scale and capital spending cycles', status: 'Register identified' },
      { industry: 'Financial services', register: 'SEC and FINRA registrations and branch filings', signal: 'Office and data centre footprint, and growth filings', status: 'Register identified' },
      { industry: 'Construction and real estate', register: 'Municipal building permits', signal: 'Permit value and density show the project pipeline', status: 'Register identified' },
      { industry: 'Pharma and biotech', register: 'FDA establishment registrations', signal: 'Site count and reliance on cold chain', status: 'Register identified' },
    ],
    ruleTitle: 'The rule that protects your brand',
    rule: 'Some sites must never be targeted, and scoring them low is not enough. A cement kiln or a glass furnace cannot be curtailed without damaging the asset, so the engine excludes those categories outright, the same way it excludes existing customers. Knowing who not to call is half of knowing who to call.',
    aside: 'Found your industry? One register, 60 minutes, and your top 20 untapped accounts before we hang up.',
  },

  howIWork: {
    eyebrow: 'How I work',
    heading: 'Evidence, not adjectives',
    lede: 'The strongest artefact in this engagement is not the demo. It is the commit history. Every defect on this page became a named regression test, and every decision is written down with the measurement behind it. Here is a sample of real pull request titles, unedited.',
    logTitle: 'git log: real pull request titles, unedited',
    log: [
      { pr: '#2', title: 'Fix canonical name resolution over-matching and add Postgres integration tests', hash: '51738eb' },
      { pr: '#3', title: 'Close the parity drift hole: verify the reference reproduces from the Python', hash: '1e1f063' },
      { pr: '#4', title: 'Lower the pilot floor and queue what it still drops', hash: '6002ca1' },
      { pr: '#5', title: "Stop the operator field putting people's names in the registry", hash: '25a3714' },
      { pr: '#6', title: 'Consolidate numbered plants into the company that owns them', hash: '7caf45d' },
      { pr: '#7', title: 'Entity-resolution split fix, viewer tier, refresh-rotation race and migration idempotency', hash: '73e5d68' },
    ],
    merged: 'merged',
    stats: [
      { value: '128', label: 'unit tests, in strict TypeScript' },
      { value: '43/43', label: 'integration checks, run against two different Postgres engines' },
      { value: '19', label: 'tenant isolation checks, including a control test that fails if isolation is ever switched off' },
      { value: '2', label: 'parity checks: TypeScript output matches the committed CSV, which matches the Python reference' },
    ],
    checksHeading: 'Checks that proved their worth',
    checks: [
      'The production database uses row-level security, so tenant data stays separate even if a query forgets a WHERE clause. But FORCE ROW LEVEL SECURITY does not apply to superusers. Point the app at the wrong database role and isolation disappears, with no error and no failing query. So the test suite includes a control: it confirms that a superuser does see everything. If that check ever fails, every isolation test above it means nothing, and the build says so.',
      'The same thinking applies to the Python and TypeScript parity. The first parity check only compared the TypeScript with committed CSVs. The Python had drifted: two accounts had vanished from the reference output and nothing failed. The fix was a second check that the CSVs still reproduce from the Python, run first in CI so a stale reference is caught before the port is blamed.',
    ],
    workingHeading: 'What working with me looks like',
    working: [
      {
        title: 'How I run an engagement',
        items: [
          'Decisions recorded with the measurement behind them',
          'A weekly written status: done, next, risks and decisions needed',
          'Scope changes agreed in writing and scheduled, never slipped in',
          'Known limitations published, not buried',
        ],
      },
      {
        title: 'What you own',
        items: [
          'Your cloud, database, tokens and CRM keys, from day one',
          'Source code in your own GitHub organisation as we build',
          'A handover test: your IT team deploys the next version without needing me',
          'No proprietary runtime and no lock-in, with Postgres as the only stateful dependency',
        ],
      },
    ],
  },

  book: {
    eyebrow: 'The live run',
    heading: 'Your whitespace, live on a call, in 60 minutes',
    lede: 'This is a working session, not a sales pitch. I run the real engine against a public register for your market, live on screen, and you keep the output.',
    steps: [
      {
        title: 'Before the call',
        body: 'You bring one thing: your industry, or just your website. I find the register that covers it, usually within the first ten minutes. A CRM export is optional, under a mutual NDA that I will send you.',
      },
      {
        title: 'During the call',
        body: "A live pull, live gates and live resolution on your market's real data. You see every refusal and the reason for it. A fixed format: 60 minutes, one register, no upsell.",
      },
      {
        title: 'After the call',
        body: 'Your top 20 untapped accounts as a CSV, with sites, signal fields and sources, yours to keep (public data, with attribution). If it is useful, we can talk about a build. If not, you still keep the list.',
      },
    ],
    dataTitle: 'How your data is handled',
    data: 'Anything you share runs in a temporary sandbox and is deleted after the call. I never keep a client CRM export without a signed agreement. Contact details are treated as protected personal information throughout. The engine in the demo enforces all three rules in code, and the call runs the same way.',
    button: 'Email me to book the run',
    buttonNote: 'Opens an email with the subject "Whitespace run". You get a reply from me, not a booking widget.',
  },

  /** The inline calls to action between sections. */
  asideButton: 'Book the 60-minute run',

  notes: {
    heading: 'Data, licence and method notes',
    repo: { label: 'See the Coldpath repository on GitHub', href: LINKS.coldpath },
    items: [
      {
        title: 'Data and licence',
        body: 'Facility data comes from the U.S. EPA Risk Management Program, obtained under FOIA by the Data Liberation Project (rmpmap.org) and licensed CC BY-SA 4.0. Attribution is required and share-alike applies to derived datasets. The EPA states the data is self-reported and "may contain errors or omissions", which is exactly why the validation gates exist. The pull shown is from 13 September 2026; the badge at the top shows the latest available.',
      },
      {
        title: 'Anonymisation',
        body: 'The client is real. Their name is withheld and replaced in the demo by the fictional "Gridwell". All personas in the demo, such as "Marissa Bennett", are fictional. Executive names in research outputs are public figures cited from public sources such as investor relations pages and press releases. One contact email in the private build is redacted here, under the same rule the engine enforces for personal information. No customer lists or third-party contact data appear on this page or in the demo.',
      },
      {
        title: 'About this page',
        body: 'The widgets run real logic ported from the production codebase. The demo is the actual prototype, with the changes described above. Every number on this page can be reproduced from the committed repository, and anything pre-built is labelled as such.',
      },
      {
        title: 'Numbers',
        body: 'All counts were recalculated on 8 October 2026 from the committed reference CSVs of the 13 September 2026 pull. A recalculation script asserts the exact figures quoted here, and a separate test suite checks the page logic. Older documents quoting 125 accounts and 111 untapped predate two entity resolution fixes; this page quotes the current pipeline output.',
      },
    ],
  },
};

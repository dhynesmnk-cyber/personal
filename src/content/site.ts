/**
 * Every word and link on the site lives here, so copy and URLs change in one
 * place. Australian English throughout. `npm run check` lints this file for
 * banned jargon and em dashes.
 */

/* ------------------------------------------------------------------ links */

export const CONTACT_EMAIL = 'd.hynes.mnk@gmail.com';

/**
 * Every "Book a discovery call" button points here. To switch to a scheduler,
 * replace this with the Cal.com or Calendly URL; nothing else needs to change.
 */
export const BOOKING_URL =
  `mailto:${CONTACT_EMAIL}` +
  `?subject=${encodeURIComponent('Discovery call')}` +
  `&body=${encodeURIComponent("Hi David,\n\nI'd like to book a discovery call. Here's a little about the problem:\n\n")}`;

/** True while the CTA opens an email rather than a booking page. */
export const BOOKING_IS_EMAIL = BOOKING_URL.startsWith('mailto:');

export const LINKS = {
  github: 'https://github.com/dhynesmnk-cyber',
  observatory: 'https://github.com/dhynesmnk-cyber/weneedtotalkaboutdatacentres',
  coldpath: 'https://github.com/dhynesmnk-cyber/coldpath',
  beeFreeTools: 'https://beefreetools.com.au',
  /** Set once the committee publishes submissions on aph.gov.au. */
  submission: '',
} as const;

/* ------------------------------------------------------------------- meta */

export const meta = {
  name: 'David Hynes',
  title: 'David Hynes | AI strategy, evaluation and adoption',
  description:
    'AI strategy, evaluation design and adoption for executive teams. I translate complex technology into governed workflows that non-technical staff actually use. Based in Melbourne.',
  role: 'AI systems builder and adoption strategist',
  location: 'Melbourne, Victoria',
};

export const nav = [
  { label: 'Background', href: '#background' },
  { label: 'Client work', href: '#client-work' },
  { label: 'Builds', href: '#builds' },
  { label: 'Policy', href: '#policy' },
  { label: 'Engagement', href: '#engagement' },
];

export const cta = {
  label: 'Book a discovery call',
  short: 'Book a call',
};

/* ------------------------------------------------------------------- hero */

export const hero = {
  eyebrow: 'AI strategy and adoption',
  headline: 'I build AI tools that actually work in real business environments.',
  sub: 'AI strategy, evaluation design and adoption for executive teams. I translate complex technology into governed workflows that non-technical staff actually use.',
  secondary: { label: 'See the work', href: '#client-work' },
  proofLabel: 'Recent and current work',
  proof: [
    'Advising Wärtsilä (USA) on AI systems',
    'Enterprise advisory for a Tier 1 professional services firm',
    'Submission to the Australian Parliament on AI',
    'Ran a 20+ staff venue from opening night',
  ],
  zones: { from: 'Complex systems', to: 'Workflows people use' },
};

/* ------------------------------------------------------------- background */

export const background = {
  eyebrow: 'Background',
  heading: 'Before AI, I ran venues. That is why my systems hold up.',
  paragraphs: [
    "I opened my first restaurant at 21. Since then I've managed a bottleshop, taught wine, built a sustainable wine marketplace and launched a premium wine venue from nothing. At the Windsor Wine Room that meant leading more than 20 staff through opening, then putting in rostering, stock and service systems that held the margin.",
    "Hospitality teaches you quickly what a strategy document never will. Margins are thin and people are busy. A system that adds two minutes to a shift gets quietly ignored by Friday, and you find out when the month's numbers come in.",
    "I bring that to every AI engagement. I look at how the work actually gets done before automating any of it. I design for the person on a deadline, not the demo. And I treat commercial risk as the first constraint, not something to sort out after launch.",
  ],
  lessons: [
    {
      title: 'Constraints come first',
      body: 'Budgets, rosters and margins decide what is possible. I start there, not with the model.',
    },
    {
      title: 'People decide adoption',
      body: 'Busy staff route around tools that slow them down. If it does not make the shift easier, it will not last.',
    },
    {
      title: 'Risk is commercial',
      body: 'A wrong answer costs money and trust. Every system I build checks its work before anything reaches a client.',
    },
  ],
  timelineHeading: 'How I got here',
  ctaLead: "If your AI plans need to survive a busy Friday night, let's talk.",
  timeline: [
    {
      when: 'From age 21',
      org: 'Restaurant owner',
      role: 'Owner, then bottleshop manager, wine education and service',
      body: 'Ran my own restaurant and learned the trade from the floor up: service, stock, staff and cash flow.',
    },
    {
      when: '2018 to now',
      org: 'Chicken and Potatoes Consulting',
      role: 'Hospitality and AI Consultant',
      body: 'Advising small and medium businesses on operations and lean tech. I build free tools so teams can focus on their customers, and coach founders to adopt tools that solve a real problem.',
    },
    {
      when: '2020 to 2024',
      org: 'Sauced.shop',
      role: 'Founder and Director',
      body: "Built Australia's first sustainable wine marketplace and grew it to more than 50 producers using no-code tools, AI-assisted outreach and AI sales coaching.",
    },
    {
      when: 'May 2024 to Jan 2025',
      org: 'Windsor Wine Room',
      role: 'Venue Manager',
      body: 'Launched and ran a premium wine venue from inception. Led more than 20 staff through opening and put in lean rostering, stock and service systems that held margin.',
    },
    {
      when: 'Jan 2025 to Jul 2025',
      org: 'VAIDA.ai',
      role: 'Founder Assistant and Chief of Staff',
      body: 'Embedded AI into operations at an AI-native consulting startup in commercial real estate. Internal systems cut manual effort by 40 percent while preserving decision quality, aligned to compliance and auditability in a regulated space.',
    },
    {
      when: 'Sept 2026 to now',
      org: 'Wärtsilä (USA)',
      role: 'AI Systems and Strategy Advisor',
      body: 'Building AI systems for market intelligence and executive operations, working with the Head of Business Development.',
      current: true,
    },
  ],
};

/* ------------------------------------------------------------- client work */

export const clientWork = {
  eyebrow: 'Client work',
  heading: 'Inside large organisations, the hard part is the gap between the brief and the build.',
  intro:
    'Executives know what they want from AI. The people building it are often working from a different picture. Most of my advisory work is closing that gap, then making sure what gets built can be trusted.',

  caseStudy: {
    label: 'Enterprise advisory',
    client: 'Tier 1 professional services firm',
    note: 'Client not named',
    problem: {
      title: 'The problem',
      body: 'Executive requirements were disconnected from technical execution. Leadership had a clear view of what it wanted, the technical teams were building to a different brief, and internal staff needed AI tools that were governed from day one rather than patched up after an incident.',
    },
    solution: {
      title: 'What I did',
      body: 'I advised on enterprise AI tooling strategy, evaluation gates and governance guardrails, so every tool had an owner, a test it had to pass and a line it could not cross. I then designed an acquisition analysis engine that collates target data into structured executive breakdowns.',
    },
    result: {
      title: 'The result',
      body: 'Project leads now spend far less time reviewing acquisition analysis, and the evidentiary and compliance standards the firm works to were maintained throughout.',
      stat: '60%',
      statLabel: 'less project lead review time, with evidentiary and compliance standards maintained',
    },
    diagram: {
      title: 'How the acquisition analysis engine works',
      caption: 'Illustrative architecture. Client systems and data are not shown.',
      stages: [
        {
          name: 'Collate',
          body: 'Target data is pulled from approved sources into one case file, with the source kept on every item.',
        },
        {
          name: 'Structure',
          body: 'Facts are extracted into a fixed schema, so every breakdown reads the same way.',
        },
        {
          name: 'Evaluation gate',
          body: 'Checks source coverage, consistency and compliance rules before anything moves on.',
          gate: true,
        },
        {
          name: 'Executive breakdown',
          body: 'A structured summary covering the target, the numbers, the risks and the open questions.',
        },
        {
          name: 'Lead review',
          body: 'The project lead reviews and signs off, faster, because the evidence is already in order.',
        },
      ],
      fallback: {
        name: 'Human review',
        body: 'Anything that fails the gate goes to a person, gets fixed and is checked again.',
      },
      guardrailsTitle: 'Governance guardrails at every stage',
      guardrails: ['Role-based access', 'Audit trail', 'Evidence standards', 'Compliance rules', 'Human sign-off'],
    },
    outputTitle: "What lands on the project lead's desk",
    outputBody:
      'A breakdown in the same shape every time: the target, the numbers, the risks and the open questions, with the evidence attached and the gate result on the front page.',
    mockup: {
      title: 'Acquisition breakdown',
      caption: 'Illustrative mockup of an executive breakdown. Client details withheld.',
      sections: ['Summary', 'Financial position', 'Key risks', 'Open questions'],
      chips: ['Evaluation gate passed', 'Every claim sourced'],
    },
  },

  wartsila: {
    label: 'Current engagement',
    client: 'Wärtsilä (USA)',
    role: 'AI Systems and Strategy Advisor',
    when: 'September 2026 to present',
    intro:
      'Wärtsilä supplies utility-scale power plants and microgrids to meet the surging energy demands of data centre development in the United States. Their Head of Business Development engaged me to build AI systems that speed up market intelligence and executive operations.',
    blocks: [
      {
        title: 'Market intelligence',
        body: 'A multi-agent research pipeline that monitors, qualifies and tracks public energy proposals and grid interconnection requirements for US data centre developments. It turns unstructured public infrastructure data into a qualified pipeline of power opportunities, directly supporting the commercial strategy for large-scale engine power plants.',
        pipeline: [
          { name: 'Public energy proposals' },
          { name: 'Interconnection requirements' },
          { name: 'Monitor' },
          { name: 'Qualify', gate: true },
          { name: 'Track' },
          { name: 'Qualified power opportunities' },
        ],
      },
      {
        title: 'Executive triage',
        body: 'A triage toolset that brings together email, messaging platforms, video call transcripts and internal notes, then ranks what needs attention first.',
        stat: '65%',
        statLabel: 'less daily administrative overhead for the Head of Business Development',
        sources: ['Email', 'Messaging', 'Video transcripts', 'Internal notes'],
        output: 'One prioritised brief',
      },
      {
        title: 'Briefing assistant',
        body: 'An AI briefing assistant that turns technical and commercial data into conference materials for executive stakeholders.',
        inputs: ['Technical data', 'Commercial data'],
        output: 'Conference materials',
      },
    ],
    bridge: 'The physical limits of AI show up here first: power, grid connections and timing. It is the same story my data centre research tells.',
    bridgeLink: { label: 'Read about the research', href: '#policy' },
  },
};

/* ------------------------------------------------------------------ builds */

export type Project = {
  id: string;
  kicker: string;
  name: string;
  summary: string[];
  governance: string[];
  pipeline: { name: string; gate?: boolean }[];
  stack: string[];
  link: { href: string; label: string };
  image: { key: 'observatory' | 'coldpath' | 'bee'; alt: string; caption: string };
};

export const builds = {
  eyebrow: 'Selected technical work',
  heading: 'I build in public, with the checks written into the code.',
  intro:
    'These are my own builds. They carry the same discipline I bring to client work: every claim traceable, every output tested before it ships, and a clear rule for what happens when the system is not sure.',
  governanceTitle: 'How it is governed',
  pipelineLabel: 'Path to publication',
  projects: [
    {
      id: 'observatory',
      kicker: 'Independent research observatory',
      name: 'We Need To Talk About Data Centres',
      summary: [
        "A public record of Australian AI data centre development: the sites, the entities behind them, and what is and isn't known about each.",
        'The rule is simple. A missing value is a finding, not a blank. Every fact points to a source, and every gap says why it is a gap.',
      ],
      governance: [
        '93 sites and 138 entities, with every row graded and sourced',
        'SHA-256 verified sourcing, with primary documents archived',
        'Evidence grading on every row',
        'Privacy-gated data, with row-level security on every table',
        'Unit tests, accessibility browser checks and CI on every change',
      ],
      pipeline: [
        { name: 'Source' },
        { name: 'SHA-256 archive' },
        { name: 'Evidence grade', gate: true },
        { name: 'Privacy gate', gate: true },
        { name: 'Publish' },
      ],
      stack: ['Next.js', 'PostgreSQL', 'Leaflet'],
      link: { href: LINKS.observatory, label: 'View the observatory on GitHub' },
      image: {
        key: 'observatory',
        alt: 'The observatory dashboard: 93 sites mapped, 11,777 MW of pipeline capacity, A$60bn in public capex commitments and 63 open research gaps, above a table of the build-out by state and status.',
        caption: 'Observatory dashboard, generated from the research database.',
      },
    },
    {
      id: 'coldpath',
      kicker: 'AI-assisted infrastructure registry',
      name: 'Coldpath',
      summary: [
        'An AI-assisted registry of cold-chain infrastructure assets for B2B lead generation. It turns public regulatory filings into a researched, gated and attributable prospect list.',
        "The hard part isn't fetching the data. It's deciding what can be trusted, what needs a person to look at it, and what must never reach outbound.",
      ],
      governance: [
        '1,382 facilities from public EPA filings, resolved into accounts across 43 states',
        'Entity resolution that stops existing customers being contacted',
        'LLM judgement scoring with versioned rules',
        'Provenance hashes and an evaluation drift gate',
        '49 ingestion gates. Uncertain records are held for a person, and access refusals fail closed',
      ],
      pipeline: [
        { name: 'Public filings' },
        { name: 'Entity resolution' },
        { name: 'LLM scoring' },
        { name: 'Drift gate', gate: true },
        { name: 'Prospect list' },
      ],
      stack: ['Node', 'TypeScript', 'PostgreSQL'],
      link: { href: LINKS.coldpath, label: 'View Coldpath on GitHub' },
      image: {
        key: 'coldpath',
        alt: "Coldpath's target-list view: 1,382 facilities ingested from EPA filings, 117 accounts after entity resolution, 114 prospects with existing customers suppressed, and 3 records held for human judgement.",
        caption: 'Prototype target-list view. Client details cropped out.',
      },
    },
    {
      id: 'bee',
      kicker: 'Free AI tools for small business',
      name: 'Bee Free Tools',
      summary: [
        'Seven free AI tools for Australian small business, each built to solve one problem in under a minute. No sign-up required.',
        "They include an AI search visibility checker, a schema and JSON-LD fact structurer, and a plain-English knowledge base that answers staff questions from a business's own SOPs and policies.",
      ],
      governance: [
        'Knowledge base answers are grounded in the documents a business uploads',
        'Questions it cannot answer go to the owner rather than being guessed',
        'Rate-limited model calls and no account required',
        'Structured data audited field by field before corrected JSON-LD is handed back',
      ],
      pipeline: [
        { name: 'Upload SOPs' },
        { name: 'Index' },
        { name: 'Retrieve' },
        { name: 'Covered?', gate: true },
        { name: 'Plain-English answer' },
      ],
      stack: ['Astro', 'TypeScript', 'Netlify'],
      link: { href: LINKS.beeFreeTools, label: 'Visit beefreetools.com.au' },
      image: {
        key: 'bee',
        alt: 'The Bee Free Tools gallery, with cards for the Visibility Checker, AI Fact Structurer, Blog Writer, Product Shots Prompt Builder, Instagram Info Researcher and Leads Discovery.',
        caption: 'The tool gallery.',
      },
    },
  ] satisfies Project[],
};

/* ------------------------------------------------------------------ policy */

export const policy = {
  eyebrow: 'Policy and research',
  heading: 'AI policy is an infrastructure question. I have put that on the parliamentary record.',
  links: { submission: 'Read the submission', observatory: 'Explore the observatory' },
  paragraphs: [
    "I made a written submission to the Australian Parliament's Joint Select Committee on Artificial Intelligence, and I'll be giving oral evidence to the committee.",
    'The submission draws on my independent research observatory on Australian data centre development. It tracks the physical footprint of the build-out, the capital behind it, the rules that permit it, how much sovereign compute capacity the country actually has, and where the infrastructure risk sits.',
    'This matters for any executive team planning around AI. Every model runs on physical infrastructure that has to be powered, cooled, approved and governed. Knowing where those limits are is how you plan for what is actually possible.',
  ],
  record: [
    {
      label: 'Written submission',
      detail: 'Joint Select Committee on Artificial Intelligence, Parliament of Australia, 2026',
    },
    {
      label: 'Oral evidence',
      detail: 'Upcoming appearance before the committee',
    },
    {
      label: 'Independent observatory',
      detail: 'Release v2.2.0, September 2026',
    },
  ],
  stats: [
    { value: '93', label: 'data centre sites tracked' },
    { value: '138', label: 'entities behind them' },
    { value: '100%', label: 'of rows graded and sourced' },
  ],
  stackLabels: ['Sites', 'Power', 'Compute', 'Governance'],
};

/* -------------------------------------------------------------- engagement */

export const engagement = {
  eyebrow: 'Engagement model',
  heading: 'Three phases. Each one lowers the risk of the next.',
  intro:
    'Every phase ends with something your team can use, so the decision to go further is made on evidence rather than a pitch.',
  outputsLabel: 'What you get',
  removesLabel: 'Risk removed',
  phases: [
    {
      n: '1',
      name: 'Discovery and Audit',
      body: 'I map how the work actually gets done, where AI could help and where it would add risk, and review your current tools, data and policies against your obligations.',
      outputs: ['A map of the real workflow', 'A risk and opportunity register', 'A shortlist ranked by return on investment'],
      removes: 'Spending on the wrong problem.',
    },
    {
      n: '2',
      name: 'Strategy and Governance Design',
      body: 'We choose the few use cases worth doing and design how they will be governed: what gets tested, who signs off, and what the system must never do.',
      outputs: ['Tooling strategy and roadmap', 'Evaluation gates and acceptance tests', 'Guardrails and compliance documentation'],
      removes: 'Tools that cannot pass an audit, or that nobody trusts.',
    },
    {
      n: '3',
      name: 'Implementation and Handover',
      body: 'I build or oversee the build, then hand it over properly, with plain-English SOPs, role-specific training and a named owner for every tool.',
      outputs: ['Tested tools in production', 'SOPs, playbooks and training', 'Drift monitoring and a handover plan'],
      removes: 'Systems that launch, then quietly stop being used.',
    },
  ],
  capabilitiesTitle: 'What sits behind each phase',
  capabilities: [
    {
      title: 'Governance and responsible AI',
      items: [
        'Evaluation gates and drift detection',
        'Provenance and audit trails',
        'Evidence grading and privacy review',
        'Working knowledge of ISO, SOC 2 and HIPAA',
      ],
    },
    {
      title: 'Adoption and communication',
      items: [
        'Plain-English, role-specific workflows',
        'SOPs, playbooks and training',
        'Change management',
        'Commercial narrative and investor materials',
      ],
    },
    {
      title: 'AI and engineering',
      items: [
        'LLMs, RAG, agentic and API workflows',
        'Prompt and evaluation design',
        'TypeScript, Next.js, Node, Python, PostgreSQL',
        'CI/CD, testing and accessibility',
      ],
    },
    {
      title: 'Consulting and operations',
      items: [
        'Stakeholder discovery',
        'Process redesign before automation',
        'Return on investment prioritisation',
        'Zapier, Make, Notion, Airtable',
      ],
    },
  ],
  ctaLead: 'Most engagements start with a 30-minute conversation.',
};

/* --------------------------------------------------------------- final cta */

export const finalCta = {
  heading: "Let's build AI systems your team will actually adopt.",
  body: "A 30-minute conversation about where you are, what's in the way, and whether I'm the right person to help.",
  emailNote: 'Opens your email app. Or write to me directly at',
};

/* ------------------------------------------------------------------ footer */

export const footer = {
  credentialsTitle: 'Education and certification',
  credentials: [
    'LLM Academy, AI Consulting Certification (2024)',
    'The Operations Translator and AI Adoption School',
    'Advanced Diploma of Business Management',
    'Certificate III in Commercial Cookery',
  ],
};

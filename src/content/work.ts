/** Work: the index page, the two client case studies and three of our own builds. */

import { LINKS } from './brand';

export type Step = { name: string; gate?: boolean };
export type ImageKey = 'observatory' | 'coldpath' | 'bee';

export const work = {
  title: 'Work',
  description:
    'Client case studies and our own builds: enterprise AI advisory for a Tier 1 professional services firm, AI systems for Wärtsilä (USA), and three governed products.',
  hero: {
    eyebrow: 'Work',
    heading: 'Client work, and the systems we run ourselves.',
    lede: 'Two client engagements and three of our own builds. Every one follows the same rules: clear goals, clear owners, and checks before anything reaches a decision-maker.',
  },
  clientHeading: 'Client engagements',
  buildsEyebrow: 'Our own builds',
  buildsHeading: 'Transparent by design.',
  buildsIntro:
    'Every system we build shows its working: where each answer came from, what was checked, and who signs off. These three projects are our own, and they run on exactly the rules we set for clients.',
  readMore: 'Read the case study',
  viewProject: 'See the project',
  prev: 'Previous',
  next: 'Next',
  back: 'All work',
};

/* ------------------------------------------------------------- client cases */

export const tier1 = {
  slug: 'tier-1-advisory',
  kicker: 'Enterprise advisory',
  title: 'Tier 1 professional services firm',
  note: 'Client not named',
  summary: 'Turned executive AI goals into a governed tooling strategy, then designed an acquisition analysis engine.',
  description:
    "How we turned a Tier 1 professional services firm's AI goals into a governed tooling strategy and an acquisition analysis engine that cut project lead review time by 60 percent.",
  problem: {
    title: 'The challenge',
    body: 'Leadership had set clear goals for AI. What was missing was a plan the delivery teams could actually execute, and the governance that would let internal staff use AI tools safely from day one.',
  },
  solution: {
    title: 'What we did',
    body: 'We turned those goals into a workable strategy: which tools to use, the evaluation gates each one had to pass, and the guardrails around them, with an owner and a test for every tool. We then designed an acquisition analysis engine that collates target data into structured executive breakdowns.',
  },
  result: {
    title: 'The result',
    body: "Project leads now spend far less time reviewing acquisition analysis, and the firm's evidentiary and compliance standards were maintained throughout.",
    stat: '60%',
    statLabel: 'less project lead review time, with evidentiary and compliance standards maintained',
    statShort: 'less project lead review time',
  },
  diagram: {
    title: 'How the acquisition analysis engine works',
    caption: 'Illustrative architecture. Client systems and data are not shown.',
    stages: [
      { name: 'Collate', body: 'Target data is pulled from approved sources into one case file, with the source kept on every item.' },
      { name: 'Structure', body: 'Facts are extracted into a fixed format, so every breakdown reads the same way.' },
      {
        name: 'Evaluation gate',
        body: 'Checks source coverage, consistency and compliance rules before anything moves on.',
        gate: true,
      },
      { name: 'Executive breakdown', body: 'A structured summary covering the target, the numbers, the risks and the open questions.' },
      { name: 'Lead review', body: 'The project lead reviews and signs off, faster, because the evidence is already in order.' },
    ],
    fallback: { name: 'Human review', body: 'Anything that fails the gate goes to a person, gets fixed and is checked again.' },
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
};

export const wartsila = {
  slug: 'wartsila',
  kicker: 'Current engagement',
  title: 'Wärtsilä (USA)',
  note: 'AI systems and strategy advisory, since September 2026',
  summary: 'AI systems for market intelligence and executive operations, supporting power for US data centre development.',
  description:
    'AI systems for Wärtsilä (USA): a multi-agent market intelligence pipeline, an executive triage toolset that cut daily admin by 65 percent, and a briefing assistant.',
  stat: '65%',
  statShort: 'less daily admin for the Head of Business Development',
  intro:
    'Wärtsilä supplies utility-scale power plants and microgrids to meet the surging energy demands of data centre development in the United States. Their Head of Business Development engaged us to build AI systems that speed up market intelligence and executive operations.',
  intel: {
    title: 'Market intelligence',
    body: 'A multi-agent research pipeline that monitors, qualifies and tracks public energy proposals and grid interconnection requirements for US data centre developments. It turns unstructured public infrastructure data into a qualified pipeline of power opportunities, directly supporting the commercial strategy for large-scale engine power plants.',
    pipelineLabel: 'Market intelligence pipeline, in order',
    pipeline: [
      { name: 'Public energy proposals' },
      { name: 'Interconnection requirements' },
      { name: 'Monitor' },
      { name: 'Qualify', gate: true },
      { name: 'Track' },
      { name: 'Qualified power opportunities' },
    ] satisfies Step[],
  },
  triage: {
    title: 'Executive triage',
    body: 'A triage toolset that brings together email, messaging platforms, video call transcripts and internal notes, then ranks what needs attention first.',
    stat: '65%',
    statLabel: 'less daily administrative overhead for the Head of Business Development',
    sourcesLabel: 'Inputs to the triage toolset',
    sources: ['Email', 'Messaging', 'Video transcripts', 'Internal notes'],
    output: 'One prioritised brief',
  },
  briefing: {
    title: 'Briefing assistant',
    body: 'An AI briefing assistant that turns technical and commercial data into conference materials for executive stakeholders.',
    inputs: ['Technical data', 'Commercial data'],
    output: 'Conference materials',
  },
  bridge:
    'The physical limits of AI show up here first: power, grid connections and timing. It is the same story our data centre research tells.',
  bridgeLink: { label: 'Read our research', href: '/insights/' },
};

/* ------------------------------------------------------------------- builds */

export interface Build {
  slug: string;
  kicker: string;
  title: string;
  summary: string;
  description: string;
  body: string[];
  governanceTitle: string;
  governance: string[];
  pipelineLabel: string;
  pipeline: Step[];
  stack: string[];
  link: { href: string; label: string };
  image: { key: ImageKey; alt: string; caption: string };
}

export const builds: Build[] = [
  {
    slug: 'data-centre-observatory',
    kicker: 'Independent research observatory',
    title: 'We Need To Talk About Data Centres',
    summary: 'A public record of Australian AI data centre development, where every fact points to its source.',
    description:
      'An independent research observatory on Australian AI data centre development, where every fact points to a source and every gap is explained.',
    body: [
      "A public record of Australian AI data centre development: the sites, the organisations behind them, and what is and isn't known about each.",
      'The rule is simple. A missing value is a finding, not a blank. Every fact points to a source, and every gap says why it is a gap.',
    ],
    governanceTitle: 'How it stays trustworthy',
    governance: [
      '93 sites and 138 organisations, with every row checked and sourced',
      'Every source document archived and fingerprinted, so it cannot be quietly changed',
      'Each claim graded on how strong its evidence is',
      'Private information only visible to the people allowed to see it',
      'Automated checks, including accessibility, before any change goes live',
    ],
    pipelineLabel: 'From source to publication',
    pipeline: [
      { name: 'Source' },
      { name: 'Archived copy' },
      { name: 'Evidence graded', gate: true },
      { name: 'Privacy check', gate: true },
      { name: 'Published' },
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
    slug: 'coldpath',
    kicker: 'AI-assisted infrastructure registry',
    title: 'Coldpath',
    summary: 'Public regulatory filings turned into a researched prospect list, with a person in the loop for anything uncertain.',
    description:
      'Coldpath turns public regulatory filings into a researched, attributable prospect list for B2B lead generation in the cold chain.',
    body: [
      'An AI-assisted registry of cold-chain infrastructure assets for B2B lead generation. It turns public regulatory filings into a researched prospect list where every entry shows where it came from.',
      "The hard part isn't collecting the data. It's deciding what can be trusted, what needs a person to look at it, and what must never be used for outreach.",
    ],
    governanceTitle: 'How it stays trustworthy',
    governance: [
      '1,382 facilities from public EPA filings, matched into accounts across 43 states',
      'Existing customers are recognised and never contacted by mistake',
      'AI scoring that follows written, versioned rules',
      'A record of where every data point came from',
      'Automatic checks that pause scoring if its quality slips',
      'Anything uncertain is held for a person to review',
    ],
    pipelineLabel: 'From filing to prospect list',
    pipeline: [
      { name: 'Public filings' },
      { name: 'Matched to accounts' },
      { name: 'AI scoring' },
      { name: 'Quality check', gate: true },
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
    slug: 'bee-free-tools',
    kicker: 'Free AI tools for small business',
    title: 'Bee Free Tools',
    summary: 'Seven free AI tools for Australian small business, each solving one problem in under a minute.',
    description:
      'Seven free AI tools for Australian small business, including an AI search visibility checker and a plain-English knowledge base.',
    body: [
      'Seven free AI tools for Australian small business, each built to solve one problem in under a minute. No sign-up required.',
      "They include an AI search visibility checker, a tool that structures business facts so search engines read them correctly, and a plain-English knowledge base that answers staff questions from a business's own procedures and policies.",
    ],
    governanceTitle: 'How it stays trustworthy',
    governance: [
      'Answers come from the documents a business uploads',
      'Questions it cannot answer go to the owner instead of being guessed',
      'Usage limits keep costs predictable, and no account is needed',
      'Website data is checked field by field before it is handed back',
    ],
    pipelineLabel: 'From question to answer',
    pipeline: [
      { name: 'Upload procedures' },
      { name: 'Index' },
      { name: 'Find the answer' },
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
];

/* ------------------------------------------------------------ index and paths */

export interface WorkItem {
  slug: string;
  kind: 'client' | 'build';
  kicker: string;
  title: string;
  summary: string;
  description: string;
  stat?: string;
  statLabel?: string;
  image?: ImageKey;
}

/** Every work page in reading order. Drives the index, the detail routes and previous/next links. */
export const workItems: WorkItem[] = [
  {
    slug: wartsila.slug,
    kind: 'client',
    kicker: wartsila.kicker,
    title: wartsila.title,
    summary: wartsila.summary,
    description: wartsila.description,
    stat: wartsila.stat,
    statLabel: wartsila.statShort,
  },
  {
    slug: tier1.slug,
    kind: 'client',
    kicker: tier1.kicker,
    title: tier1.title,
    summary: tier1.summary,
    description: tier1.description,
    stat: tier1.result.stat,
    statLabel: tier1.result.statShort,
  },
  ...builds.map((b) => ({
    slug: b.slug,
    kind: 'build' as const,
    kicker: b.kicker,
    title: b.title,
    summary: b.summary,
    description: b.description,
    image: b.image.key,
  })),
];

export const workHref = (slug: string) => `/work/${slug}/`;

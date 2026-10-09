/** Work: the index page, the client case studies and my own builds. Coldpath's full case study is in coldpath.ts. */

import { LINKS } from './brand';

export type Step = { name: string; gate?: boolean };
export type ImageKey = 'observatory' | 'bee';

export const work = {
  title: 'Work',
  description:
    'Client case studies and my own builds: AI systems for Wärtsilä (USA), enterprise advisory for a Tier 1 professional services firm, the Coldpath account intelligence engine, and two governed public projects.',
  hero: {
    eyebrow: 'Work',
    heading: 'Client results, and the systems I run myself.',
    lede: 'Three client engagements and two of my own builds. Each one follows the same discipline: clear goals, named owners and agreed checks before anything reaches a decision-maker.',
  },
  clientHeading: 'Client engagements',
  buildsEyebrow: 'My own builds',
  buildsHeading: 'Transparent by design.',
  buildsIntro:
    'Every system I build shows its working: where each answer came from, what was checked and who signed it off. These two projects are my own, and they meet the same standards I set for clients.',
  transparency: [
    { title: 'Every answer is traceable', body: 'Each output links back to the source it came from.' },
    { title: 'Checks come before decisions', body: 'Nothing reaches a decision-maker until it passes the agreed tests.' },
    { title: 'A named person makes the hard calls', body: 'Anything uncertain goes to an accountable owner for a decision.' },
  ],
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
    "How I turned a Tier 1 professional services firm's AI goals into a governed tooling strategy and an acquisition analysis engine that cut project lead review time by 60 percent.",
  problem: {
    title: 'The starting point',
    body: 'Leadership had set clear goals for AI. The next step was a plan the delivery teams could carry out, and governance that let staff use AI tools with confidence from day one.',
  },
  solution: {
    title: 'What I did',
    body: 'I turned those goals into a working strategy: which tools to use, the evaluation gates each one had to pass and the guardrails around them, with an owner and a test for every tool. I then designed an acquisition analysis engine that gathers target data into structured executive breakdowns.',
  },
  result: {
    title: 'The result',
    body: 'Project leads now spend far less time reviewing acquisition analysis, and the firm kept its evidence and compliance standards throughout.',
    stat: '60%',
    statLabel: 'less review time for project leads, with evidence and compliance standards maintained',
    statShort: 'less review time for project leads',
  },
  diagram: {
    title: 'How the acquisition analysis engine works',
    caption: 'Illustrative architecture. Client systems and data are not shown.',
    stages: [
      { name: 'Gather', body: 'Target data comes from approved sources into one case file, and every item keeps its source.' },
      { name: 'Structure', body: 'Facts go into a fixed format, so every breakdown reads the same way.' },
      {
        name: 'Evaluation gate',
        body: 'Source coverage, consistency and compliance rules are checked before anything moves on.',
        gate: true,
      },
      { name: 'Executive breakdown', body: 'A structured summary covering the target, the numbers, the risks and the open questions.' },
      { name: 'Lead review', body: 'The project lead reviews and signs off quickly, because the evidence is already in order.' },
    ],
    fallback: { name: 'Human review', body: 'Anything that fails the gate goes to a person, is corrected and is checked again.' },
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
    'Wärtsilä supplies utility-scale power plants and microgrids to meet the fast-growing energy needs of data centre development in the United States. I work with their Head of Business Development, building AI systems that speed up market intelligence and executive operations.',
  intel: {
    title: 'Market intelligence',
    body: 'A multi-agent research pipeline that monitors, qualifies and tracks public energy proposals and grid interconnection requirements for US data centre developments. It turns unstructured public infrastructure data into a qualified pipeline of power opportunities, which feeds directly into the commercial strategy for large-scale engine power plants.',
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
    'The physical limits of AI show up here first: power, grid connections and timing. My data centre research tells the same story.',
  bridgeLink: { label: 'Read the research', href: '/insights/#research' },
};

export const coldpathCase = {
  slug: 'coldpath',
  kicker: 'Account intelligence',
  title: 'Coldpath',
  note: 'Client name withheld',
  summary: 'One public register turned into a ranked list of untapped accounts, with every decision checked by a rule or a person.',
  description:
    'How a public EPA register became 112 sales accounts nobody was calling, and the two defects that were caught before launch. Interactive case study with a live demo.',
  stat: '112',
  statShort: 'untapped accounts, absent from the CRM',
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
      '93 sites and 138 organisations, every row checked and sourced',
      'Every source document archived and fingerprinted, so it cannot be quietly changed',
      'Each claim graded on how strong its evidence is',
      'Private information visible only to the people allowed to see it',
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
    slug: 'bee-free-tools',
    kicker: 'Free AI tools for small business',
    title: 'Bee Free Tools',
    summary: 'Seven free AI tools for Australian small business, each solving one problem in under a minute.',
    description:
      'Seven free AI tools for Australian small business, including an AI search visibility checker and a plain-English knowledge base.',
    body: [
      'Seven free AI tools for Australian small business. Each one solves a single problem in under a minute, with no sign-up.',
      "They include an AI search visibility checker, a tool that structures business facts so search engines read them correctly, and a plain-English knowledge base that answers staff questions from a business's own procedures and policies.",
    ],
    governanceTitle: 'How it stays trustworthy',
    governance: [
      'Answers come only from the documents a business uploads',
      'Questions outside those documents go to the owner for an answer',
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
  /** A note shown under the title on the case page, such as "Client name withheld". */
  note?: string;
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
    note: wartsila.note,
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
    note: tier1.note,
    kicker: tier1.kicker,
    title: tier1.title,
    summary: tier1.summary,
    description: tier1.description,
    stat: tier1.result.stat,
    statLabel: tier1.result.statShort,
  },
  {
    slug: coldpathCase.slug,
    kind: 'client',
    note: coldpathCase.note,
    kicker: coldpathCase.kicker,
    title: coldpathCase.title,
    summary: coldpathCase.summary,
    description: coldpathCase.description,
    stat: coldpathCase.stat,
    statLabel: coldpathCase.statShort,
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

/** Case studies with a page of their own in src/pages/work/, so [slug].astro skips them. */
export const ownPages = new Set([coldpathCase.slug]);

/** The previous and next case, for the pager at the foot of each case page. */
export function neighbours(slug: string): { prev: WorkItem; next: WorkItem } {
  const i = workItems.findIndex((w) => w.slug === slug);
  const n = workItems.length;
  return { prev: workItems[(i - 1 + n) % n]!, next: workItems[(i + 1) % n]! };
}

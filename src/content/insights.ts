/** Insights: policy, research and (later) articles. */

import { LINKS } from './brand';

export interface Article {
  title: string;
  summary: string;
  href: string;
  date: string;
}

export const insights = {
  title: 'Insights',
  description:
    'Our submission to the Joint Select Committee on Artificial Intelligence and independent research on Australian data centre development, sovereign compute and infrastructure risk.',
  hero: {
    eyebrow: 'Insights',
    heading: 'AI policy is an infrastructure question.',
    lede: 'Our research and policy work looks at the physical side of AI: where the data centres are going, who is behind them, and what that means for anyone planning around AI.',
  },
  submission: {
    eyebrow: 'Policy',
    heading: 'On the parliamentary record',
    paragraphs: [
      "David Hynes made a written submission to the Australian Parliament's Joint Select Committee on Artificial Intelligence, and will be giving oral evidence to the committee.",
      'The submission draws on our independent research into Australian data centre development, sovereign compute capacity and infrastructure risk.',
    ],
    record: [
      { label: 'Written submission', detail: 'Joint Select Committee on Artificial Intelligence, Parliament of Australia, 2026' },
      { label: 'Oral evidence', detail: 'Upcoming appearance before the committee' },
    ],
    linkLabel: 'Read the submission',
  },
  research: {
    eyebrow: 'Research',
    heading: 'Independent research on Australian data centres',
    paragraphs: [
      'Our observatory tracks the physical footprint of the build-out, the capital behind it, the rules that permit it, how much sovereign compute capacity the country actually has, and where the infrastructure risk sits.',
      'Every fact points to a source and every gap is explained, so the findings can be checked by anyone who needs to rely on them.',
    ],
    stats: [
      { value: '93', label: 'data centre sites tracked' },
      { value: '138', label: 'organisations behind them' },
      { value: '100%', label: 'of rows graded and sourced' },
    ],
    stackLabels: ['Sites', 'Power', 'Compute', 'Governance'],
    release: 'Release v2.2.0, September 2026',
    links: {
      project: { label: 'How the observatory works', href: '/work/data-centre-observatory/' },
      repo: { label: 'Explore it on GitHub', href: LINKS.observatory },
    },
  },
  matters: {
    eyebrow: 'Why it matters',
    heading: 'Every AI plan runs on physical infrastructure.',
    paragraphs: [
      'Models run in data centres that have to be powered, cooled, approved and governed. Those limits shape cost, timing and risk for every organisation adopting AI, whether or not it ever sees a server.',
      'It is the same constraint our work with Wärtsilä deals with every day: power and grid connections for US data centre development. We bring that view to every strategy we write.',
    ],
  },
  articlesHeading: 'Articles',
  /** Add articles here as they are published. The section stays hidden while empty. */
  articles: [] as Article[],
};

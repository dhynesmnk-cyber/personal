/** Insights: articles, policy and research. The article text itself is in articles.ts. */

import { LINKS } from './brand';

export interface Article {
  title: string;
  summary: string;
  href: string;
  date: string;
  readingTime: string;
}

export const insights = {
  title: 'Insights',
  description:
    'Field notes on AI governance and adoption, a submission to the Joint Select Committee on Artificial Intelligence, and independent research on Australian data centre development.',
  hero: {
    eyebrow: 'Insights',
    heading: 'AI policy is an infrastructure question.',
    lede: 'My research and policy work looks at the physical side of AI: where the data centres are being built, who is behind them, and what that means for anyone planning around AI.',
  },
  articlesEyebrow: 'Field notes',
  articlesHeading: 'Articles',
  readArticle: 'Read the article',
  submission: {
    eyebrow: 'Policy',
    heading: 'On the parliamentary record',
    paragraphs: [
      "I made a written submission to the Australian Parliament's Joint Select Committee on Artificial Intelligence, and I will give oral evidence to the committee.",
      'The submission draws on my independent research into Australian data centre development, sovereign compute capacity and infrastructure risk.',
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
      'My observatory tracks the physical footprint of the build-out, the capital behind it, the rules that permit it, how much sovereign compute the country actually has, and where the infrastructure risk sits.',
      'Each finding is sourced and graded, so anyone who relies on it can check it for themselves.',
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
      'Models run in data centres that need power, cooling, approvals and oversight. Those limits shape the cost, timing and risk of every AI program, whether or not an organisation ever sees a server.',
      'My work with Wärtsilä deals with the same constraint every day: power and grid connections for US data centre development. I bring that view to every strategy I write.',
    ],
  },
  /** Newest first. Each one needs a page in src/pages/insights/. */
  articles: [
    {
      title: 'The gate is the product',
      summary:
        'Clients do not buy the model. They buy confidence that the system knows when it is wrong. A field note with six practical rules.',
      href: '/insights/the-gate-is-the-product/',
      date: 'October 2026',
      readingTime: '4 minute read',
    },
  ] satisfies Article[],
};

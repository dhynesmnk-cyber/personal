/** Home page: the pitch, the services summary (from services.ts) and the strongest results. */

export const home = {
  title: 'AI strategy, governance and adoption',
  hero: {
    eyebrow: 'AI strategy, governance and adoption',
    headline: 'I build AI tools that actually work in real business environments.',
    emphasis: 'actually work',
    sub: 'I work with executive teams to turn AI ambitions into governed workflows that non-technical staff use with confidence.',
    secondary: { label: 'See the results', href: '#results' },
    /** Labels inside the hero graphic. */
    sky: { goals: 'Your goals', work: 'Everyday work', checks: 'Checks' },
  },
  results: {
    eyebrow: 'Results',
    heading: 'Outcomes clients can measure.',
    link: 'All work',
    items: [
      {
        slug: 'wartsila',
        client: 'Wärtsilä (USA)',
        stat: '65%',
        label: 'reduction in daily admin for their Head of Business Development',
      },
      {
        slug: 'tier-1-advisory',
        client: 'Tier 1 professional services firm',
        stat: '60%',
        label: 'less time spent reviewing acquisition analysis',
      },
      {
        slug: 'coldpath',
        client: 'Energy services company, US',
        stat: '112',
        label: 'untapped sales accounts found in one public register',
      },
    ],
  },
  record: {
    label: 'Also on the record',
    items: ['A written submission to the Parliament of Australia on AI', 'Independent research on Australian data centres'],
    link: { label: 'Read the insights', href: '/insights/' },
  },
};

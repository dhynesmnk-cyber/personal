/** Home page. Services and the approach block come from services.ts; case cards from work.ts. */

export const home = {
  title: 'AI strategy, governance and adoption',
  hero: {
    eyebrow: 'AI strategy, governance and adoption',
    headline: 'AI tools that actually work in real business environments.',
    emphasis: 'actually work',
    sub: 'We help executive teams turn AI goals into a plan their people can deliver: governed workflows that non-technical staff actually use.',
    secondary: { label: 'See our work', href: '/work/' },
    zones: { from: 'Executive goals', to: 'Workflows people use' },
  },
  work: {
    eyebrow: 'Recent work',
    heading: 'Results that hold up under scrutiny.',
    link: 'All work',
  },
  transparency: {
    eyebrow: 'Transparent by design',
    heading: 'Clear rules, visible working, no black boxes.',
    body: 'Every system we build shows where each answer came from, what was checked, and who signs off. Your team can see why a tool said what it said, and so can your auditors.',
    points: [
      { title: 'Every answer is traceable', body: 'Each output links back to the source it came from.' },
      { title: 'Checks before decisions', body: 'Nothing reaches a decision-maker until it passes the agreed tests.' },
      { title: 'A person for the hard calls', body: 'Anything uncertain goes to a named owner, not a guess.' },
    ],
    link: { label: 'See how our own projects run', href: '/work/#builds' },
  },
  proof: {
    label: 'Recent and current work',
    items: [
      'AI systems for Wärtsilä (USA)',
      'Enterprise advisory for a Tier 1 professional services firm',
      'Submission to the Australian Parliament on AI',
      'Independent research on Australian data centres',
    ],
  },
  insights: {
    eyebrow: 'Insights',
    heading: 'AI policy is an infrastructure question.',
    body: 'Our research on Australian data centre development, sovereign compute capacity and infrastructure risk informs our submission to the Parliament of Australia, and every strategy we write.',
    link: { label: 'Read our insights', href: '/insights/' },
  },
};

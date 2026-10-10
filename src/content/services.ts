/** Services page: the approach, the three phases, who I work with. Home reuses the phase summaries. */

export const approach = {
  eyebrow: 'My approach',
  heading: 'Your goals are the north star.',
  paragraphs: [
    'Leadership sets the destination. My job is to chart the route: the priorities, the owners, the standards each tool must meet, and an order of work your teams can deliver.',
    'What gets built is what you asked for, and every stage moves the business closer to the goals you set.',
  ],
  points: [
    { title: 'Priorities worth funding', body: 'A short list of uses, ranked by return and effort, each tied to one of your goals.' },
    { title: 'Clear owners and standards', body: 'Every tool has a named owner and a clear standard it must meet before it goes live.' },
    { title: 'A sequence your teams can run', body: 'Work is staged so your people can deliver it, with a checkpoint before each stage begins.' },
  ],
};

export const services = {
  title: 'Services',
  description:
    'Structured AI engagements for executive teams in three phases: Discovery and Audit, Strategy and Governance Design, and Implementation and Handover.',
  hero: {
    eyebrow: 'Services',
    heading: 'Structured AI engagements, from first audit to handover.',
    lede: 'Every engagement runs in three phases. Each phase ends with something your team can use, so you decide on the next step with evidence in hand.',
  },
  /** The strip of service cards on the home page. */
  stripEyebrow: 'Services',
  stripHeading: 'Three phases, each building on the last.',
  stripLink: 'How each phase works',
  phasesHeading: 'The three phases',
  outputsLabel: 'What you get',
  strengthensLabel: 'What it strengthens',
  phases: [
    {
      n: '1',
      name: 'Discovery and Audit',
      summary: 'See how the work really gets done, and where AI will pay off.',
      body: 'I map how work actually flows through your business, find where AI will help most, and review your current tools, data and policies against your obligations.',
      outputs: ['A map of the real workflow', 'An opportunity and risk register', 'A shortlist ranked by return on investment'],
      strengthens: 'Confidence that your investment goes to the right problems.',
    },
    {
      n: '2',
      name: 'Strategy and Governance Design',
      summary: 'Turn your goals into a clear plan, with the standards every tool must meet.',
      body: 'Together we choose the few uses worth pursuing and design how each one is governed: how it is tested, who signs it off, and the limits it must always respect.',
      outputs: ['Tooling strategy and roadmap', 'Evaluation gates and acceptance tests', 'Guardrails and compliance documentation'],
      strengthens: 'Tools that your team and your auditors can trust.',
    },
    {
      n: '3',
      name: 'Implementation and Handover',
      summary: 'Build the tools, then hand them to the people who will use them.',
      body: 'I build the tools or oversee the build, then hand them over properly, with plain-English procedures, training for each role and a named owner for every tool.',
      outputs: ['Tested tools in production', 'Procedures, playbooks and training', 'Quality monitoring and a handover plan'],
      strengthens: 'Lasting adoption, owned by your people.',
    },
  ],
  audienceHeading: 'Who I work with',
  audience: [
    {
      title: 'Executive teams',
      body: 'CEOs, COOs and heads of strategy who want AI to deliver a measurable result, with governance in place from the start.',
    },
    {
      title: 'Consulting partners',
      body: "Firms that need a specialist to turn a client's AI goals into tools, testing and governance their delivery teams can run.",
    },
    {
      title: 'Operations leaders',
      body: 'Teams with real processes, real staff and real constraints, who need tools that fit the way they already work.',
    },
  ],
  capabilitiesHeading: 'What supports each phase',
  capabilities: [
    {
      title: 'Governance and responsible AI',
      items: [
        'Evaluation gates and quality monitoring',
        'Source records and audit trails',
        'Evidence grading and privacy review',
        'Working knowledge of ISO, SOC 2 and HIPAA',
      ],
    },
    {
      title: 'Adoption and communication',
      items: [
        'Plain-English, role-specific workflows',
        'Procedures, playbooks and training',
        'Change management',
        'Commercial narrative and investor materials',
      ],
    },
    {
      title: 'AI and engineering',
      items: [
        'Language models, retrieval and agent workflows',
        'Prompt and evaluation design',
        'TypeScript, Next.js, Node, Python, PostgreSQL',
        'Automated testing, deployment and accessibility',
      ],
    },
    {
      title: 'Consulting and operations',
      items: [
        'Stakeholder discovery',
        'Process redesign before automation',
        'Prioritising by return on investment',
        'Zapier, Make, Notion, Airtable',
      ],
    },
  ],
  ctaLead: 'Most engagements start with a 30-minute conversation.',
};

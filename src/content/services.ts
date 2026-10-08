/** Services page, plus the service summaries and approach block reused on Home. */

export const approach = {
  eyebrow: 'Our approach',
  heading: 'From executive goals to a plan your teams can deliver.',
  paragraphs: [
    'Leadership usually knows what it wants from AI. What is often missing is the path from that intent to something the delivery team can build and the rest of the business can safely use.',
    'We take your executive goals and turn them into a workable strategy: clear priorities, named owners, the tests every tool has to pass, and a sequence your teams can actually run with. What gets built is what was asked for.',
  ],
  points: [
    { title: 'Priorities you can fund', body: 'A short list of uses ranked by return, risk and effort, tied to the goals you set.' },
    { title: 'An owner and a test for every tool', body: 'Each system has someone accountable for it and a clear standard it must meet before it ships.' },
    { title: 'A sequence teams can deliver', body: 'Work broken into stages your people can run, with a checkpoint before each one starts.' },
  ],
};

export const services = {
  title: 'Services',
  description: 'Phased AI engagements for executive teams: discovery and audit, strategy and governance design, and implementation and handover.',
  hero: {
    eyebrow: 'Services',
    heading: 'Phased AI engagements, built around risk.',
    lede: 'Every engagement moves in three phases. Each one ends with something your team can use, so the decision to go further is made on evidence rather than a pitch.',
  },
  stripEyebrow: 'Services',
  stripHeading: 'Three phases. Each one lowers the risk of the next.',
  stripLink: 'How each phase works',
  outputsLabel: 'What you get',
  removesLabel: 'Risk removed',
  phases: [
    {
      n: '1',
      name: 'Discovery and Audit',
      summary: 'Map how the work really gets done, and where AI would help or add risk.',
      body: 'We map how the work actually gets done, where AI could help and where it would add risk, and review your current tools, data and policies against your obligations.',
      outputs: ['A map of the real workflow', 'A risk and opportunity register', 'A shortlist ranked by return on investment'],
      removes: 'Spending on the wrong problem.',
    },
    {
      n: '2',
      name: 'Strategy and Governance Design',
      summary: 'Turn executive goals into a workable plan, with the rules each tool must follow.',
      body: 'We choose the few uses worth doing and design how they will be governed: what gets tested, who signs off, and what the system must never do.',
      outputs: ['Tooling strategy and roadmap', 'Evaluation gates and acceptance tests', 'Guardrails and compliance documentation'],
      removes: 'Tools that cannot pass an audit, or that nobody trusts.',
    },
    {
      n: '3',
      name: 'Implementation and Handover',
      summary: 'Build or oversee the build, then hand over tools your people will use.',
      body: 'We build or oversee the build, then hand it over properly, with plain-English procedures, role-specific training and a named owner for every tool.',
      outputs: ['Tested tools in production', 'Procedures, playbooks and training', 'Quality monitoring and a handover plan'],
      removes: 'Systems that launch, then quietly stop being used.',
    },
  ],
  audienceHeading: 'Who we work with',
  audience: [
    {
      title: 'Executive teams',
      body: 'CEOs, COOs and heads of strategy who need AI to deliver a measurable result, with the risk understood up front.',
    },
    {
      title: 'Consulting partners',
      body: "Firms that need a specialist to turn a client's AI ambitions into tooling, evaluation and governance their delivery teams can run.",
    },
    {
      title: 'Operations leaders',
      body: 'Teams with real processes, real staff and real constraints, who need tools people will actually adopt.',
    },
  ],
  capabilitiesHeading: 'What sits behind each phase',
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
        'Return on investment prioritisation',
        'Zapier, Make, Notion, Airtable',
      ],
    },
  ],
  ctaLead: 'Most engagements start with a 30-minute conversation.',
};

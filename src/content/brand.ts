/**
 * Brand, contact details, navigation and the calls to action shared by every
 * page. Page copy lives in the other files in this folder.
 *
 * How the site speaks:
 *   - First person. "I" is David; the brand is David Hynes Consulting.
 *   - Plain, professional and short. Active voice, one idea per sentence.
 *   - Positive outcomes: what the client gains, not what they avoid.
 *   - Each idea lives on one page. The closing call to action is the only
 *     deliberate repeat.
 *   - Australian English. No em dashes, no jargon, no hype.
 *     `npm run check` enforces the last three, and flags any sentence of
 *     eight words or more that appears in two content files.
 */

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

export const brand = {
  name: 'David Hynes Consulting',
  founder: 'David Hynes',
  tagline: 'AI strategy, governance and adoption',
  description:
    'David Hynes Consulting works with executive teams to turn AI goals into governed tools that staff use with confidence. Strategy, governance and adoption, from first audit to handover.',
  location: 'Melbourne, Australia',
  reach: 'Working with clients in Australia and the United States.',
};

/** Top-level navigation. The dropdown contents for each item are in menus.ts. */
export const nav = [
  { label: 'Services', href: '/services/' },
  { label: 'Work', href: '/work/' },
  { label: 'Insights', href: '/insights/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

export const cta = {
  label: 'Book a discovery call',
  short: 'Book a call',
  menu: 'Menu',
};

/** The closing band at the foot of every page. */
export const ctaBand = {
  heading: "Let's build AI systems your team will actually adopt.",
  body: "Tell me about the goal and what's in the way. In 30 minutes you'll know whether I can help.",
  emailNote: 'Opens your email app. Or write to me directly at',
};

export const footer = {
  blurb: 'AI strategy, governance and adoption for executive teams.',
  pagesTitle: 'Pages',
  contactTitle: 'Contact',
  rights: 'No trackers, no third-party scripts.',
};

export const notFound = {
  title: 'Page not found',
  heading: 'This page has moved or never existed.',
  body: "Try one of these pages instead, or get in touch and I'll point you in the right direction.",
};

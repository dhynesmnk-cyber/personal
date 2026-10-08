/**
 * Brand, contact details, navigation and the calls to action shared by every
 * page. Page copy lives in the other files in this folder. Australian
 * English throughout; `npm run check` lints every file here for banned
 * jargon, em dashes and US spelling.
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
    'David Hynes Consulting helps executive teams turn AI goals into strategy their people can deliver: governed workflows that non-technical staff actually use. Based in Melbourne.',
  location: 'Melbourne, Australia',
  reach: 'Working with clients in Australia and the United States.',
};

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
  body: "A 30-minute conversation about where you are, what's in the way, and whether we're the right fit.",
  emailNote: 'Opens your email app. Or write to us directly at',
};

export const footer = {
  blurb: 'AI strategy, evaluation design and adoption for executive teams.',
  pagesTitle: 'Pages',
  contactTitle: 'Contact',
  rights: 'No trackers, no third-party scripts.',
};

export const notFound = {
  title: 'Page not found',
  heading: 'This page has moved or never existed.',
  body: 'Try one of these instead, or get in touch and we will point you in the right direction.',
};

/**
 * The dropdown under each top-level navigation item. Built from the page
 * content, so a new case study or article appears here on the next build.
 */

import { services } from './services';
import { workItems, workHref } from './work';
import { insights } from './insights';

export interface MenuLink {
  label: string;
  href: string;
  note?: string;
}

export const menus: Record<string, MenuLink[]> = {
  '/services/': [
    { label: 'My approach', href: '/services/#approach', note: 'Your goals are the north star' },
    ...services.phases.map((ph) => ({ label: ph.name, href: `/services/#phase-${ph.n}`, note: `Phase ${ph.n}` })),
  ],
  '/work/': workItems.map((w) => ({ label: w.title, href: workHref(w.slug), note: w.kicker })),
  '/insights/': [
    ...insights.articles.map((a) => ({ label: a.title, href: a.href, note: 'Field note' })),
    { label: 'Parliamentary submission', href: '/insights/#submission', note: 'Policy' },
    { label: 'Data centre research', href: '/insights/#research', note: 'Research' },
  ],
  '/about/': [
    { label: 'David Hynes', href: '/about/#founder', note: 'Founder and Principal' },
    { label: 'Principles I work by', href: '/about/#principles', note: 'How decisions get made' },
    { label: 'Experience', href: '/about/#experience', note: 'Clients and roles' },
  ],
};

/** Accessible name for the button that opens a menu. */
export const menuToggleLabel = (label: string) => `${label} menu`;

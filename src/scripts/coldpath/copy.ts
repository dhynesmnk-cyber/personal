/**
 * Words the Coldpath widgets write into the page. Kept apart from
 * src/content/coldpath.ts so the browser only downloads what the widgets
 * need. `npm run check` lints this file with the rest of the copy.
 */

import type { FacilityRecord } from './core';

export const freshness = {
  snapshot: (date: string) => `EPA RMP data, snapshot of ${date}`,
  live: (days: number, date: string) => `EPA RMP data, pulled ${days} day${days === 1 ? '' : 's'} ago (${date})`,
  counts: (facilities: string, accounts: number, sites: number, states: number) =>
    `${facilities} facilities, ${accounts} accounts, ${sites} sites, ${states} states`,
  delta: (n: number) => `${n >= 0 ? '+' : ''}${n} accounts since the last pull`,
};

export const auditor = {
  presets: [
    { label: 'VersaCold vs Americold: the four-character near-miss', a: 'VersaCold Logistics', b: 'Americold Logistics' },
    { label: 'Lineage LLC vs Lineage, Inc.: a true match', a: 'Lineage Logistics LLC', b: 'Lineage, Inc.' },
    { label: 'Americold alias vs parent: a true match', a: 'AmeriCold Logistics, LLC', b: 'Americold Realty Trust' },
    { label: 'Kroger vs The Kroger Co.: suffix noise', a: 'Kroger', b: 'The Kroger Co.' },
    { label: 'Sysco vs Kroger: unrelated', a: 'Sysco Corporation', b: 'The Kroger Co.' },
    { label: 'Perdue Farms Incorporated vs Perdue Farms, Inc.', a: 'Perdue Farms Incorporated', b: 'Perdue Farms, Inc.' },
  ],
  empty: 'Type two names above.',
  rows: {
    normalised: 'Normalised',
    prospect: 'Words in the prospect',
    customer: 'Words in the customer',
    shared: 'Shared distinctive words',
    oldMethod: 'Old method',
    exact: 'Exact match',
    newMethod: 'Distinctive-word match',
    verdict: 'Verdict (gate C5)',
  },
  none: '(none)',
  shared: (shared: number, ratio: string, strong: number) => `${shared} shared, ratio ${ratio}, ${strong} strong`,
  old: (sim: string, would: boolean) =>
    `Whole-string similarity ${sim}: ${would ? 'would have suppressed this silently' : 'no match'}`,
  exactNote: 'The normalised names are identical, so this is suppressed on an exact alias match. No fuzzy logic involved.',
  scored: (score: string, floor: number, ok: boolean) => `Score ${score} against a floor of ${floor}: ${ok ? 'an acceptable match' : 'not a match'}`,
  verdicts: { SUPPRESSED: 'Suppressed', 'HUMAN QUEUE': 'Sent to a person', CLEAR: 'Clear' },
  explain: {
    SUPPRESSED: 'Suppressed. The record is kept and listed with the matching alias, never deleted.',
    'HUMAN QUEUE':
      'Fuzzy similarity alone never suppresses. This pair goes to a person, who can see in seconds what a string metric got wrong.',
    CLEAR: 'Clear. The record moves on to research and scoring. In the full engine the name is checked against every known customer alias.',
  },
  legend: {
    strong: 'Strong word',
    dist: 'Distinctive word',
    gen: 'Generic or weak word, removed before comparison',
  },
};

export const gates = {
  presets: [
    {
      label: 'Neches Terminal: 89M lb units error',
      rec: { name: 'Neches Terminal', city: 'Beaumont', state: 'TX', naics: '49312', ammonia_lb: 89000000, months_since_activity: 1 },
    },
    {
      label: 'Clean facility: 30,000 lb',
      rec: { name: 'Great Lakes Cold Storage LLC', city: 'Cleveland', state: 'OH', naics: '49312', ammonia_lb: 30000, months_since_activity: 2 },
    },
    {
      label: 'Existing customer under an alias',
      rec: { name: 'AmeriCold Logistics, LLC', city: 'Chesapeake', state: 'VA', naics: '49312', ammonia_lb: 42000, months_since_activity: 0 },
    },
    {
      label: 'Reported parent is "NA"',
      rec: { name: 'NA', city: 'Brownsville', state: 'TX', naics: '49312', ammonia_lb: 15000, months_since_activity: 3 },
    },
    {
      label: 'Dormant: untouched for 14 months',
      rec: { name: 'Sunbelt Frozen Foods', city: 'Phoenix', state: 'AZ', naics: '49312', ammonia_lb: 25000, months_since_activity: 14 },
    },
    {
      label: 'VersaCold: close to a customer',
      rec: { name: 'VersaCold Logistics', city: 'Toronto', state: 'ON', naics: '49312', ammonia_lb: 60000, months_since_activity: 1 },
    },
  ] satisfies { label: string; rec: FacilityRecord }[],
  customers: [
    'Americold Realty Trust',
    'Americold Logistics',
    'Lineage, Inc.',
    'Lineage Logistics',
    'The Kroger Co.',
    'Kroger',
    'Tyson Foods, Inc.',
    'Tyson Foods',
    'NewCold',
  ],
  record: 'Record',
  final: {
    refused: (kind: string) =>
      `Refused (${kind}). Written to the review queue with its reason, for a person to decide. It is never deleted, scored or exported.`,
    warn: 'Queued with warnings. The record moves on, and its flags travel with it so a person sees them before anything is exported.',
    pass: 'Passed every gate. Eligible for research and scoring, but a person must still confirm it (gate C10) before it can reach an outbound list.',
  },
};

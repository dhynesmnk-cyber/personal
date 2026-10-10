#!/usr/bin/env node
/**
 * Copy lint. Fails the build if site copy uses banned jargon, em or en dashes
 * used as dashes, or common US spellings where Australian English is wanted.
 * Scans every content file, the words the Coldpath widgets write, and the
 * visible text of every component and page.
 *
 * It also keeps the copy from repeating itself: any sentence of eight words
 * or more that appears in two different files fails, as does "Melbourne"
 * anywhere on the home page (the location belongs on About and Contact).
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

// David's own banned list, plus a few AI-marketing tropes.
const banned = [
  'leverage',
  'synergy',
  'disrupt',
  'empower',
  'unlock',
  'supercharge',
  'revolutionise',
  'revolutionize',
  'ai powered',
  'ai-powered',
  'cutting edge',
  'cutting-edge',
  'state of the art',
  'state-of-the-art',
  'next generation',
  'next-generation',
  'solutions',
  'seamless',
  'frictionless',
  'at scale',
  'delve',
  'harness',
  'game-changer',
  'game changer',
  'unleash',
  'transformative',
  'in today',
  'robust',
];

const usSpellings = [
  /\borganiz/i,
  /\bprioritiz/i,
  /\banalyz/i,
  /\bcolor\b/i,
  /\bcenter\b/i,
  /\bbehavior/i,
  /\bmodeled\b/i,
  /\bcatalog\b/i,
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

/** Visible copy only: strings in content files, and text between tags in .astro files. */
function extractCopy(file, source) {
  if (file.endsWith('.ts')) {
    return [...source.matchAll(/(['"`])((?:\\.|(?!\1).)*)\1/g)].map((m) => m[2]);
  }
  const markup = source
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\{[^{}]*\}/g, ' ');
  return [...markup.matchAll(/>([^<>]+)</g)].map((m) => m[1].trim()).filter(Boolean);
}

const problems = [];
const files = [join(root, 'src/scripts/coldpath/copy.ts')];
for await (const f of walk(join(root, 'src/content'))) if (f.endsWith('.ts')) files.push(f);
for (const dir of ['src/components', 'src/layouts', 'src/pages']) {
  for await (const f of walk(join(root, dir))) if (f.endsWith('.astro')) files.push(f);
}

// Every sentence long enough to be a deliberate idea, and the files it is in.
const sentences = new Map();
const MIN_WORDS = 8;

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const rel = relative(root, file);
  if (/^src\/(content\/home\.ts|components\/HomeHero\.astro|pages\/index\.astro)$/.test(rel) && /Melbourne|brand\.location/.test(source)) {
    problems.push(`${rel}: the home page should not mention Melbourne`);
  }
  for (const text of extractCopy(file, source)) {
    for (const sentence of text.split(/(?<=[.!?:])\s+/)) {
      const key = sentence.toLowerCase().replace(/[^a-z0-9%' ]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (key.split(' ').length < MIN_WORDS) continue;
      if (!sentences.has(key)) sentences.set(key, new Set());
      sentences.get(key).add(rel);
    }
    const lower = text.toLowerCase();
    for (const word of banned) {
      const re = new RegExp(`\\b${word.replace(/[-\s]/g, '[-\\s]')}`, 'i');
      if (re.test(lower)) problems.push(`${relative(root, file)}: banned "${word}" in "${text.slice(0, 80)}"`);
    }
    if (/—|\s–\s/.test(text)) problems.push(`${relative(root, file)}: dash in "${text.slice(0, 80)}"`);
    for (const re of usSpellings) {
      if (re.test(text)) problems.push(`${relative(root, file)}: US spelling ${re} in "${text.slice(0, 80)}"`);
    }
  }
}

for (const [sentence, where] of sentences) {
  if (where.size > 1) problems.push(`repeated in ${[...where].join(' and ')}: "${sentence.slice(0, 80)}"`);
}

// Scripts can write copy into the page too, so no dashes there either.
for await (const f of walk(join(root, 'src/scripts'))) {
  if (/—|\s–\s/.test(await readFile(f, 'utf8'))) problems.push(`${relative(root, f)}: em or en dash`);
}

if (problems.length) {
  console.error(`Copy check failed (${problems.length}):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`Copy check passed: ${files.length} files.`);

#!/usr/bin/env node
/**
 * Copy lint. Fails the build if site copy uses banned jargon, em or en dashes
 * used as dashes, or common US spellings where Australian English is wanted.
 * Scans the copy file and the visible text of every component.
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

/** Visible copy only: strings in site.ts, and text between tags in .astro files. */
function extractCopy(file, source) {
  if (file.endsWith('site.ts')) {
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
const files = [join(root, 'src/content/site.ts')];
for await (const f of walk(join(root, 'src/components'))) if (f.endsWith('.astro')) files.push(f);
for await (const f of walk(join(root, 'src/layouts'))) if (f.endsWith('.astro')) files.push(f);

for (const file of files) {
  const source = await readFile(file, 'utf8');
  for (const text of extractCopy(file, source)) {
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

if (problems.length) {
  console.error(`Copy check failed (${problems.length}):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`Copy check passed: ${files.length} files.`);

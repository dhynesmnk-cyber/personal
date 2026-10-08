#!/usr/bin/env node
/**
 * Performance budget for the built site. Run after `npm run build`.
 * Sizes are gzip, which is what the browser downloads.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { extname, join, resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');

const BUDGET = {
  js: 5 * 1024, // all first-party JavaScript
  css: 25 * 1024, // all stylesheets
  html: 40 * 1024, // the largest single page
  sprite: 60 * 1024, // /logos.svg, cached once for the whole site
  fonts: 140 * 1024, // every font file (raw woff2, already compressed)
  imageEach: 260 * 1024, // largest single responsive image variant
};

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const totals = { js: 0, css: 0, html: 0, fonts: 0, sprite: 0 };
let pages = 0;
let largestImage = { path: '', size: 0 };

for await (const file of walk(dist)) {
  const ext = extname(file);
  if (ext === '.js') totals.js += gzipSync(await readFile(file)).length;
  else if (ext === '.css') totals.css += gzipSync(await readFile(file)).length;
  else if (ext === '.html') {
    pages++;
    totals.html = Math.max(totals.html, gzipSync(await readFile(file)).length);
  } else if (file.endsWith('logos.svg')) totals.sprite = gzipSync(await readFile(file)).length;
  else if (ext === '.woff2') totals.fonts += (await stat(file)).size;
  else if (['.avif', '.webp', '.png', '.jpg'].includes(ext) && file.includes('_astro')) {
    const size = (await stat(file)).size;
    if (size > largestImage.size) largestImage = { path: file, size };
  }
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const rows = [
  ['JavaScript (gzip)', totals.js, BUDGET.js],
  ['CSS (gzip)', totals.css, BUDGET.css],
  ['Largest page (gzip)', totals.html, BUDGET.html],
  ['Logo sprite (gzip)', totals.sprite, BUDGET.sprite],
  ['Fonts', totals.fonts, BUDGET.fonts],
  ['Largest image', largestImage.size, BUDGET.imageEach],
];

let failed = false;
for (const [label, actual, limit] of rows) {
  const ok = actual <= limit;
  failed ||= !ok;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(20)} ${kb(actual).padStart(9)} / ${kb(limit)}`);
}

console.log(`${pages} pages checked.`);

if (failed) {
  console.error('Performance budget exceeded.');
  process.exit(1);
}

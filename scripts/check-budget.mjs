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
  js: 5 * 1024, // JavaScript shared by every page
  caseJs: 8 * 1024, // the Coldpath case study's widgets, loaded on that page only
  css: 15 * 1024, // the largest page's CSS, inlined into its <head>
  html: 40 * 1024, // the largest single page
  demo: 150 * 1024, // the Coldpath prototype: one self-contained file, loaded only in its frame
  sprite: 60 * 1024, // /logos.svg, cached once for the whole site
  fonts: 140 * 1024, // every font file (raw woff2, already compressed)
  imageEach: 260 * 1024, // largest single responsive image variant
};

// Page-specific bundles are named after the page that loads them.
const isCaseScript = (file) => /[\\/]coldpath\.astro_[^\\/]*\.js$/.test(file);
const isDemo = (file) => file.includes(join('work', 'coldpath', 'demo'));

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const totals = { js: 0, caseJs: 0, css: 0, html: 0, demo: 0, fonts: 0, sprite: 0 };
let pages = 0;
let largestImage = { path: '', size: 0 };

for await (const file of walk(dist)) {
  const ext = extname(file);
  if (ext === '.js') totals[isCaseScript(file) ? 'caseJs' : 'js'] += gzipSync(await readFile(file)).length;
  else if (ext === '.css') totals.css += gzipSync(await readFile(file)).length;
  else if (ext === '.html' && isDemo(file)) totals.demo = Math.max(totals.demo, gzipSync(await readFile(file)).length);
  else if (ext === '.html') {
    pages++;
    const html = await readFile(file, 'utf8');
    totals.html = Math.max(totals.html, gzipSync(html).length);
    const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('');
    totals.css = Math.max(totals.css, gzipSync(styles).length);
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
  ['Case study JS (gzip)', totals.caseJs, BUDGET.caseJs],
  ['Page CSS (gzip)', totals.css, BUDGET.css],
  ['Largest page (gzip)', totals.html, BUDGET.html],
  ['Coldpath demo (gzip)', totals.demo, BUDGET.demo],
  ['Logo sprite (gzip)', totals.sprite, BUDGET.sprite],
  ['Fonts', totals.fonts, BUDGET.fonts],
  ['Largest image', largestImage.size, BUDGET.imageEach],
];

let failed = false;
for (const [label, actual, limit] of rows) {
  const ok = actual <= limit;
  failed ||= !ok;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(21)} ${kb(actual).padStart(9)} / ${kb(limit)}`);
}

console.log(`${pages} pages checked.`);

if (failed) {
  console.error('Performance budget exceeded.');
  process.exit(1);
}

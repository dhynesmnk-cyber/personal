#!/usr/bin/env node
/**
 * Dev-only: captures the project screenshots in src/assets/work/ from local
 * builds of each project, because the live sites are not reachable from every
 * build environment. Run with the three repos cloned next to this one, or
 * point the env vars at them:
 *
 *   OBSERVATORY_DIR  weneedtotalkaboutdatacentres checkout
 *   COLDPATH_DIR     coldpath checkout
 *   BEE_DIR          bee-free-tools checkout (needs its built dist/)
 *
 *   npm run capture
 *
 * Each source is served over HTTP on localhost, rendered in Chromium at
 * 1440x900 and saved as a 2x PNG. Astro converts them to AVIF/WebP at build.
 */
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'src/assets/work');
const home = resolve(root, '..');

/**
 * prepare: steps to reach the view worth showing.
 * clip:    crop in CSS pixels. Coldpath is cropped to the main panel so the
 *          prototype's sidebar (which names client staff) never appears.
 * css:     injected before capture, e.g. to pin a sticky table header that
 *          misplaces itself in headless Chromium.
 * allow:   off-box hosts the page may load (web fonts). Everything else is blocked.
 */
const sources = {
  observatory: {
    dir: process.env.OBSERVATORY_DIR ?? join(home, 'dhynesmnk-cyber/weneedtotalkaboutdatacentres'),
    serve: 'data-pipeline/viewer',
    path: '/',
    css: 'thead, thead th { position: static !important; }',
  },
  coldpath: {
    dir: process.env.COLDPATH_DIR ?? join(home, 'dhynesmnk-cyber/coldpath'),
    serve: 'prototype',
    path: '/coldpath-prototype.html',
    // The prototype's demo PIN sits in its own page source. Read it from there
    // rather than copying it into this repo.
    prepare: async (page, dir) => {
      const html = await readFile(join(dir, 'prototype/coldpath-prototype.html'), 'utf8');
      const pin = html.match(/PIN_MARKETING\s*=\s*['"](\d{4})['"]/)?.[1];
      if (!pin) throw new Error('Could not find the prototype demo PIN');
      await page.keyboard.type(pin);
      await page.getByRole('button', { name: 'Continue' }).click().catch(() => {});
      await page.waitForTimeout(800);
      await page.getByRole('button', { name: 'Skip tour' }).click().catch(() => {});
      await page.getByText('Build List', { exact: false }).first().click();
      await page.waitForTimeout(800);
    },
    clip: { x: 252, y: 72, width: 1172, height: 730 },
  },
  bee: {
    dir: process.env.BEE_DIR ?? join(home, 'bee-free-tools'),
    serve: 'dist',
    path: '/',
    allow: ['fonts.googleapis.com', 'fonts.gstatic.com'],
    // Frame the tool gallery rather than the mostly empty hero.
    prepare: async (page) => {
      const label = page.getByText(/seven tools/i).first();
      const box = await label.boundingBox();
      if (box) await page.evaluate((y) => window.scrollTo(0, y), box.y - 150);
      await page.waitForTimeout(1500);
    },
  },
};

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
};

/** Minimal static file server, bound to localhost only. */
function serve(dir) {
  const base = resolve(dir);
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://localhost');
      let file = normalize(join(base, decodeURIComponent(url.pathname)));
      if (!file.startsWith(base)) throw new Error('outside root');
      if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

const only = process.argv.slice(2);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();

try {
  for (const [key, src] of Object.entries(sources)) {
    if (only.length && !only.includes(key)) continue;
    const server = await serve(join(src.dir, src.serve));
    const { port } = server.address();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    // Block anything off-box except the listed font hosts.
    const allow = new Set(['127.0.0.1', ...(src.allow ?? [])]);
    await page.route('**/*', (route) => {
      const host = new URL(route.request().url()).hostname;
      return allow.has(host) ? route.continue() : route.abort();
    });
    await page.goto(`http://127.0.0.1:${port}${src.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    if (src.prepare) await src.prepare(page, src.dir);
    if (src.css) await page.addStyleTag({ content: src.css });
    await page.waitForTimeout(600);
    const file = join(out, `${key}.png`);
    await page.screenshot({ path: file, clip: src.clip });
    console.log(`captured ${key} -> ${file}`);
    await page.close();
    server.close();
  }
} finally {
  await browser.close();
}

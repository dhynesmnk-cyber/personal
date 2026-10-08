#!/usr/bin/env node
/**
 * Renders public/og.png (1200x630) from the built hero, so the share card
 * always matches the site. Run after `npm run build`, then build again.
 */
import { spawn } from 'node:child_process';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const root = resolve(import.meta.dirname, '..');
const port = 4398;
const server = spawn(process.execPath, [join(root, 'scripts/serve.mjs'), String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await page.addStyleTag({
    content: `
      .site-header, .proof, .hero__actions, .hero__sub, main > :not(.hero), footer { display: none !important; }
      .hero { padding-block: 96px 0 !important; }
      .hero h1 { font-size: 68px !important; }
    `,
  });
  // Lead with the name: a share card travels without the page around it.
  await page.evaluate(() => {
    const label = document.querySelector('.hero .eyebrow span:nth-of-type(2)');
    if (label) label.textContent = 'David Hynes';
  });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, 'public/og.png') });
  console.log('wrote public/og.png');
} finally {
  await browser.close();
  server.kill();
}

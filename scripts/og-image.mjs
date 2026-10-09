#!/usr/bin/env node
/**
 * Renders the 1200 by 630 share images from the built site, so they always
 * match it. Run after `npm run build`, then build again.
 *
 *   public/og.png                                 the home hero
 *   public/work/coldpath/og.png                   the Coldpath case study
 *   public/insights/the-gate-is-the-product/og.png the article
 *
 * The case study and article cards are drawn from a template in this file,
 * using the site's own fonts, colours and constellation.
 */
import { spawn } from 'node:child_process';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const root = resolve(import.meta.dirname, '..');
const port = 4398;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [join(root, 'scripts/serve.mjs'), String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));

const cards = [
  {
    out: 'public/work/coldpath/og.png',
    eyebrow: 'Case study: account intelligence',
    title: 'Anatomy of a whitespace engine',
    sub: 'How one public dataset revealed 112 accounts a sales team had never targeted.',
    stat: '112',
    statLabel: 'untapped accounts from one public register',
    pill: 'Live demo inside',
  },
  {
    out: 'public/insights/the-gate-is-the-product/og.png',
    eyebrow: 'Field note: AI governance and adoption',
    title: 'The gate is the product',
    sub: 'Clients do not buy the model. They buy confidence that the system knows when it is wrong.',
    stat: '6',
    statLabel: 'rules for putting gates in front of your AI',
    pill: '4 minute read',
  },
];

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });

  // Home: the hero itself.
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.addStyleTag({
    content: `
      .site-header, main > :not(.hero), footer, .hero__actions { display: none !important; }
      .hero { min-height: 630px !important; padding-block: 0 !important; align-content: center; }
      .hero h1 { font-size: 64px !important; }
      .hero__sub { font-size: 21px !important; }
    `,
  });
  await page.evaluate(() => {
    const label = document.querySelector('.hero .eyebrow span:nth-of-type(2)');
    if (label) label.textContent = 'David Hynes Consulting';
  });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, 'public/og.png') });
  console.log('wrote public/og.png');

  // Cards: drawn on the contact page, which has the fonts and a settled constellation.
  for (const card of cards) {
    await page.goto(`${base}/contact/`, { waitUntil: 'networkidle' });
    await page.evaluate(
      ({ card, html }) => {
        const sky = document.querySelector('.contact-sky')?.innerHTML ?? '';
        const mark = document.querySelector('.wordmark .mark')?.outerHTML ?? '';
        document.body.innerHTML = html.replace('%SKY%', sky).replace('%MARK%', mark);
      },
      {
        card,
        html: `
          <div class="og">
            <div class="og__brand">%MARK%<span><b>David Hynes</b><small>Consulting</small></span></div>
            <div class="og__sky">%SKY%</div>
            <div class="og__copy">
              <p class="og__eyebrow"><i></i>${escape(card.eyebrow)}</p>
              <h1>${escape(card.title)}</h1>
              <p class="og__sub">${escape(card.sub)}</p>
            </div>
            <div class="og__band">
              <span class="og__stat">${escape(card.stat)}</span>
              <span class="og__label">${escape(card.statLabel)}</span>
              <span class="og__pill">${escape(card.pill)}</span>
            </div>
          </div>`,
      },
    );
    await page.addStyleTag({
      content: `
        html, body { margin: 0; background: var(--forest-950); }
        .og { position: relative; width: 1200px; height: 630px; overflow: hidden; color: var(--paper);
              background: radial-gradient(ellipse 50% 70% at 80% 20%, var(--forest-900), transparent 70%), var(--forest-950); }
        .og__brand { position: absolute; left: 64px; top: 52px; display: flex; align-items: center; gap: 12px; }
        .og__brand .mark { width: 30px; height: 30px; --olive-400: var(--lime-200); --forest-700: var(--sage-300); --forest-900: var(--lime-200); --olive-600: var(--sage-300); }
        .og__brand span { display: grid; line-height: 1; }
        .og__brand b { font-family: var(--font-serif); font-weight: 480; font-size: 26px; }
        .og__brand small { margin-top: 5px; font-size: 11px; font-weight: 600; letter-spacing: .24em; text-transform: uppercase; color: var(--lime-200); }
        .og__sky { position: absolute; right: -10px; top: 0; width: 560px; height: 430px; opacity: .95; }
        .og__sky .ns { height: 100%; }
        .og__copy { position: absolute; left: 64px; top: 150px; width: 700px; display: grid; gap: 18px; }
        .og__eyebrow { display: flex; align-items: center; gap: 14px; margin: 0; font-size: 15px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--lime-200); }
        .og__eyebrow i { width: 32px; height: 1px; background: currentColor; }
        .og h1 { margin: 0; font-size: 76px; line-height: 1; letter-spacing: -.03em; color: var(--paper); }
        .og__sub { margin: 0; max-width: 620px; font-size: 22px; line-height: 1.45; color: var(--sage-200); }
        .og__band { position: absolute; left: 0; right: 0; bottom: 0; height: 128px; display: flex; align-items: center; gap: 28px;
                    padding: 0 64px; background: var(--paper); color: var(--ink); }
        .og__stat { font-family: var(--font-serif); font-size: 84px; font-weight: 360; line-height: 1; letter-spacing: -.04em; color: var(--forest-900); }
        .og__label { max-width: 420px; font-size: 21px; font-weight: 500; line-height: 1.35; }
        .og__pill { margin-left: auto; padding: 10px 20px; border: 1.5px solid var(--forest-900); border-radius: 999px;
                    font-size: 14px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--forest-900); }
      `,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(root, card.out) });
    console.log(`wrote ${card.out}`);
  }
} finally {
  await browser.close();
  server.kill();
}

import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { BOOKING_URL, LINKS, nav } from '../src/content/brand';
import { allLogos, logoWall } from '../src/content/logos';
import { workItems } from '../src/content/work';
import { insights } from '../src/content/insights';
import { coldpath } from '../src/content/coldpath';
import { menus } from '../src/content/menus';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const ROUTES = [
  '/',
  '/services/',
  '/work/',
  ...workItems.map((w) => `/work/${w.slug}/`),
  '/insights/',
  ...insights.articles.map((a) => a.href),
  '/about/',
  '/contact/',
];

/** Scroll top to bottom so every reveal and lazy image has fired. */
async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
}

async function axe(page: Page) {
  // The Coldpath prototype in its frame is a separate, self-contained
  // artefact; the page around it is tested like every other page.
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).exclude('#demoFrame').analyze();
  return results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target.join(' ')).slice(0, 5) }));
}

/* ------------------------------------------------------------- every page */

for (const route of ROUTES) {
  test.describe(`page ${route}`, () => {
    test('no WCAG 2.2 AA violations, with motion and with reduced motion', async ({ page, browser }) => {
      await page.goto(route);
      await scrollThrough(page);
      await page.waitForTimeout(600);
      expect(await axe(page)).toEqual([]);

      const context = await browser.newContext({ reducedMotion: 'reduce', viewport: page.viewportSize() ?? undefined });
      const reduced = await context.newPage();
      await reduced.goto(route);
      expect(await axe(reduced)).toEqual([]);
      await context.close();
    });

    test('one h1, no skipped heading levels, a booking CTA and the right nav item', async ({ page }) => {
      await page.goto(route);
      const levels = await page.$$eval('h1, h2, h3, h4, h5, h6', (hs) => hs.map((h) => Number(h.tagName[1])));
      expect(levels.filter((l) => l === 1)).toHaveLength(1);
      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i]!, `heading ${i} jumps from h${levels[i - 1]} to h${levels[i]}`).toBeLessThanOrEqual(levels[i - 1]! + 1);
      }

      const ctas = await page.locator('[data-cta]').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
      expect(ctas.length).toBeGreaterThanOrEqual(2);
      expect(ctas.every((href) => href === BOOKING_URL)).toBe(true);

      const current = await page.locator('nav[aria-label="Main"] [aria-current="page"]').evaluateAll((els) =>
        els.map((el) => el.getAttribute('href')),
      );
      const expected = nav.find((n) => route.startsWith(n.href))?.href;
      expect(current).toEqual(expected ? [expected] : []);
    });

    test('no horizontal scroll at 320px and 1280px', async ({ page }, info) => {
      test.skip(info.project.name === 'mobile', 'Widths are set explicitly; once is enough');
      for (const width of [320, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        await scrollThrough(page);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
      }
    });
  });
}

/* --------------------------------------------------------------- site-wide */

test.describe('site', () => {
  test('every internal link resolves', async ({ page, request }, info) => {
    test.skip(info.project.name === 'mobile', 'Same links on every viewport');
    const hrefs = new Set<string>();
    for (const route of ROUTES) {
      await page.goto(route);
      for (const href of await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')!))) {
        hrefs.add(href.split('#')[0]!);
      }
    }
    for (const href of hrefs) {
      const res = await request.get(href);
      expect(res.status(), href).toBe(200);
    }
    expect(hrefs.size).toBeGreaterThanOrEqual(ROUTES.length);
  });

  test('every in-page link and menu anchor has a target', async ({ page }) => {
    const anchored = new Map<string, Set<string>>();
    for (const links of Object.values(menus)) {
      for (const { href } of links) {
        const [path, id] = href.split('#');
        if (id) anchored.set(path!, (anchored.get(path!) ?? new Set()).add(id));
      }
    }
    anchored.set('/work/', new Set(['builds']));
    anchored.set('/', new Set(['results']));
    anchored.set('/work/coldpath/', new Set(coldpath.contents.map((c) => c.id)));
    for (const [path, ids] of anchored) {
      await page.goto(path);
      for (const id of ids) await expect(page.locator(`#${id}`), `${path}#${id}`).toHaveCount(1);
      for (const href of await page.$$eval('main a[href^="#"]', (as) => as.map((a) => a.getAttribute('href')!))) {
        await expect(page.locator(href), `${path}${href}`).toHaveCount(1);
      }
    }
  });

  test('unknown pages return a branded 404', async ({ page }) => {
    const res = await page.goto('/no-such-page/');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-cta]').first()).toHaveAttribute('href', BOOKING_URL);
  });

  test('without JavaScript every page still passes axe and shapes are in their final state', async ({ browser }) => {
    // axe needs to inject its own script, so emulate a visitor without
    // JavaScript by blocking every script the site ships instead.
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.route(/\/_astro\/.*\.js$/, (route) => route.abort());
    for (const route of ['/', '/services/', '/work/tier-1-advisory/', '/work/coldpath/']) {
      await page.goto(route);
      await expect(page.locator('html')).not.toHaveClass(/has-motion/);
      expect(await axe(page), route).toEqual([]);
      const floors = await page.$$eval('.ls-layer', (ls) => ls.map((l) => getComputedStyle(l).opacity));
      expect(floors.every((o) => o === '1'), route).toBe(true);
    }
    await context.close();
  });

  test('with scripting off, the whole nav is shown and needs no buttons', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('#site-nav')).toBeVisible();
    await expect(page.locator('[data-menu-btn]')).toBeHidden();
    await expect(page.locator('[data-nav-toggle]').first()).toBeHidden();
    for (const item of nav) await expect(page.locator('#site-nav').getByRole('link', { name: item.label, exact: true })).toBeVisible();
    await context.close();
  });

  test('project links point at the projects, and no link is insecure', async ({ page }) => {
    const found = new Set<string>();
    for (const slug of ['data-centre-observatory', 'coldpath', 'bee-free-tools']) {
      await page.goto(`/work/${slug}/`);
      for (const href of await page.$$eval('a[href^="https:"]', (as) => as.map((a) => a.getAttribute('href')!))) found.add(href);
      expect(await page.$$eval('a[href^="http:"]', (as) => as.length)).toBe(0);
    }
    for (const href of [LINKS.observatory, LINKS.coldpath, LINKS.beeFreeTools]) expect(found.has(href), href).toBe(true);
  });
});

/* -------------------------------------------------------------------- home */

test.describe('home', () => {
  test('services sit directly under the hero, near the fold', async ({ page }) => {
    await page.goto('/');
    const sections = page.locator('main > section');
    await expect(sections.nth(1)).toHaveAttribute('aria-labelledby', 'services-title');
    const top = await sections.nth(1).evaluate((el) => el.getBoundingClientRect().top);
    const vh = page.viewportSize()!.height;
    expect(top).toBeLessThan(vh * 1.25);
    await expect(sections.nth(1).locator('.svc__card')).toHaveCount(3);
  });

  test('the current client appears and renders in the web font', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toContainText('Wärtsilä (USA)');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.fonts.check('400 32px Newsreader', 'Wärtsilä'))).toBe(true);
  });

  test('the brand is David Hynes Consulting and hospitality is not the pitch', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/^David Hynes Consulting/);
    await expect(page.locator('header .wordmark')).toHaveAccessibleName(/David Hynes Consulting/);
    const text = (await page.locator('main').textContent()) ?? '';
    expect(text).not.toMatch(/friday night|venue|hospitality|build in public|melbourne/i);
  });

  test('only the strongest material: hero, services, results, then the call to action', async ({ page }) => {
    await page.goto('/');
    const sections = await page.locator('main > section').evaluateAll((els) => els.map((el) => el.getAttribute('aria-labelledby')));
    expect(sections).toEqual(['hero-title', 'services-title', 'results-title', 'cta-band-title']);
    await expect(page.locator('#results .result-card')).toHaveCount(3);
    for (const href of await page.locator('#results .result-card a').evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
      expect(href).toMatch(/^\/work\/[a-z0-9-]+\/$/);
    }
  });

  test('the constellation organises as the hero scrolls away', async ({ page }) => {
    await page.goto('/');
    const sky = page.locator('.hero .ns');
    await expect(sky.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect.poll(() => sky.evaluate((el) => Number(el.style.getPropertyValue('--p') || 0))).toBeLessThan(0.1);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => sky.evaluate((el) => Number(el.style.getPropertyValue('--p')))).toBeGreaterThan(0.5);
    const running = await page.evaluate(
      () => document.getAnimations().filter((a) => (a.effect as KeyframeEffect | null)?.target?.closest('.hero .ns')).length,
    );
    expect(running).toBeGreaterThan(10);
  });
});

/* -------------------------------------------------------------- logo wall */

test.describe('logo wall', () => {
  test('lists every logo with a visible name, from the sprite', async ({ page, request }) => {
    await page.goto('/');
    const wall = page.locator('[data-logo-wall]');
    const items = wall.locator('.lw__list:not(.lw__list--clone) .lw__item');
    expect(await items.count()).toBe(allLogos.length);
    expect(allLogos.length).toBeGreaterThanOrEqual(30);
    for (const name of await items.allTextContents()) expect(name.trim()).not.toBe('');
    await expect(wall.locator('.lw__list--clone').first()).toHaveAttribute('aria-hidden', 'true');
    await expect(wall).toContainText('not partnerships');

    const sprite = await (await request.get('/logos.svg')).text();
    for (const logo of allLogos) expect(sprite, logo.id).toContain(`id="logo-${logo.id}"`);
  });

  test('ranks frontier labs, then tools, then infrastructure, with marks getting smaller', async ({ page }) => {
    await page.goto('/');
    const tiers = page.locator('[data-logo-wall] .lw__tier');
    expect((await tiers.locator('.lw__label').allTextContents()).map((t) => t.trim())).toEqual(logoWall.rows.map((r) => r.label));
    const sizes = await tiers.evaluateAll((els) => els.map((el) => el.querySelector('.lw__mark')!.getBoundingClientRect().width));
    expect(sizes[0]).toBeGreaterThan(sizes[1]!);
    expect(sizes[1]).toBeGreaterThan(sizes[2]!);
    for (const name of ['Anthropic', 'OpenAI', 'Gemini']) await expect(tiers.first()).toContainText(name);
  });

  test('drifts slowly: each row takes at least 90 seconds to loop', async ({ page }) => {
    await page.goto('/');
    const durations = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => (a.effect as KeyframeEffect | null)?.target?.classList.contains('lw__track'))
        .map((a) => Number(a.effect!.getTiming().duration)),
    );
    expect(durations).toHaveLength(3);
    for (const d of durations) expect(d).toBeGreaterThanOrEqual(90_000);
  });

  test('scrolls with motion, and the Pause button stops it', async ({ page }) => {
    await page.goto('/');
    const tracks = () =>
      page.evaluate(() =>
        document.getAnimations().filter((a) => (a.effect as KeyframeEffect | null)?.target?.classList.contains('lw__track')).map((a) => a.playState),
      );
    await expect.poll(tracks).toEqual(['running', 'running', 'running']);
    const toggle = page.getByRole('button', { name: 'Pause logos' });
    await toggle.click();
    expect(await tracks()).toEqual(['paused', 'paused', 'paused']);
    await expect(page.getByRole('button', { name: 'Play logos' })).toBeVisible();
  });

  test('is a static grid with reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('[data-lw-toggle]')).toBeHidden();
    await expect(page.locator('.lw__list--clone').first()).toBeHidden();
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    await context.close();
  });
});

/* ------------------------------------------------------- keyboard and menu */

test.describe('keyboard', () => {
  test('mobile menu opens, closes with Escape and returns focus', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'The menu button only shows on small screens');
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Menu', exact: true });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#site-nav')).toBeHidden();
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#site-nav').getByRole('link', { name: 'Services', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
  });

  test('mobile menu groups expand to show their pages', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'The menu button only shows on small screens');
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const toggle = page.getByRole('button', { name: 'Work menu' });
    await expect(page.locator('#menu-work')).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#menu-work').getByRole('link', { name: 'Coldpath' })).toBeVisible();
  });

  test('dropdowns open on hover, toggle with the chevron and close with Escape', async ({ page }, info) => {
    test.skip(info.project.name === 'mobile', 'Hover dropdowns are a desktop pattern');
    await page.goto('/');
    const panel = page.locator('#menu-work');
    await expect(panel).toBeHidden();
    await page.locator('.nav-item', { has: page.locator('#menu-work') }).locator('.nav-link').hover();
    await expect(panel).toBeVisible();
    await expect(page.getByRole('button', { name: 'Work menu' })).toHaveAttribute('aria-expanded', 'true');
    for (const { label } of menus['/work/']!) await expect(panel.getByRole('link', { name: label })).toBeVisible();
    await page.mouse.move(10, 600);
    await expect(panel).toBeHidden();

    const toggle = page.getByRole('button', { name: 'Services menu' });
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#menu-services')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#menu-services a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#menu-services')).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('skip link is first and moves focus to main', async ({ page }, info) => {
    test.skip(info.project.name === 'mobile', 'Keyboard navigation is a desktop concern');
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });

  test('every tab stop shows a visible focus indicator', async ({ page }, info) => {
    test.skip(info.project.name === 'mobile', 'Keyboard navigation is a desktop concern');
    await page.goto('/');
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press('Tab');
      const style = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        return { tag: el.tagName, text: el.textContent?.trim().slice(0, 30), outline: cs.outlineStyle, width: parseFloat(cs.outlineWidth) };
      });
      expect(style, `tab stop ${i}`).not.toBeNull();
      expect(style!.outline, `tab stop ${i} (${style!.text})`).not.toBe('none');
      expect(style!.width).toBeGreaterThanOrEqual(2);
    }
  });

  test('interactive targets are at least 24px tall (WCAG 2.5.8)', async ({ page }) => {
    for (const route of ['/', '/work/coldpath/', '/contact/']) {
      await page.goto(route);
      const small = await page.$$eval('a, button', (els) =>
        els
          .filter((el) => el.getClientRects().length > 0)
          .filter((el) => !el.closest('p, dd'))
          .map((el) => {
            // A stretched link's target is its absolutely positioned ::after,
            // which covers the whole card it sits in.
            const stretched = getComputedStyle(el, '::after').position === 'absolute';
            const box = stretched ? el.closest('li, article') ?? el : el;
            return { text: (el.textContent ?? '').trim().slice(0, 40), h: box.getBoundingClientRect().height };
          })
          .filter((r) => r.h < 24),
      );
      expect(small, route).toEqual([]);
    }
  });
});

/* -------------------------------------------------- performance and policy */

test.describe('performance and policy', () => {
  for (const route of ['/', '/work/tier-1-advisory/', '/work/coldpath/']) {
    test(`${route}: CLS under 0.02, no errors, no inline script, first-party only`, async ({ page, baseURL }) => {
      const errors: string[] = [];
      const origins = new Set<string>();
      page.on('pageerror', (e) => errors.push(String(e)));
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
      });
      page.on('request', (r) => origins.add(new URL(r.url()).origin));
      await page.addInitScript(() => {
        (window as unknown as { __cls: number }).__cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
            if (!entry.hadRecentInput) (window as unknown as { __cls: number }).__cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto(route);
      await page.waitForTimeout(400);
      await scrollThrough(page);
      await page.waitForTimeout(400);

      expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(0.02);
      expect(errors).toEqual([]);
      const inline = await page.$$eval('script:not([src])', (ss) =>
        ss.filter((s) => s.getAttribute('type') !== 'application/ld+json').map((s) => s.outerHTML.slice(0, 80)),
      );
      expect(inline).toEqual([]);
      expect([...origins]).toEqual([new URL(baseURL!).origin]);
    });
  }

  test('every page carries a strict CSP, and only the site can frame it', async ({ page, request }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
      expect(csp, route).toContain("script-src 'self';");
      expect(csp, route).toContain("default-src 'self'");
      const res = await request.get(route);
      expect(res.headers()['content-security-policy'], route).toContain("frame-ancestors 'self'");
      expect(res.headers()['x-frame-options'], route).toBe('SAMEORIGIN');
    }
  });

  test('screenshots load as modern formats with alt text on project pages', async ({ page }) => {
    await page.goto('/work/data-centre-observatory/');
    const img = page.locator('.frame img');
    await expect(img).toHaveAttribute('alt', /\S/);
    await expect(img).toHaveAttribute('width', /\d+/);
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    expect(await img.evaluate((el: HTMLImageElement) => el.currentSrc)).toMatch(/\.(avif|webp)$/);
  });
});

/* ------------------------------------------------------------------ motion */

test.describe('motion', () => {
  test('reduced motion: nothing animates and shapes are final', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of ['/', '/services/']) {
      await page.goto(route);
      await expect(page.locator('html')).not.toHaveClass(/has-motion/);
      await scrollThrough(page);
      expect(await page.evaluate(() => document.getAnimations().length), route).toBe(0);
      const floors = await page.$$eval('.ls-layer', (ls) => ls.map((l) => getComputedStyle(l).opacity));
      expect(floors.every((o) => o === '1'), route).toBe(true);
    }
    await context.close();
  });

  test('with motion: the phase rail tracks scroll', async ({ page }) => {
    await page.goto('/services/');
    await expect(page.locator('html')).toHaveClass(/has-motion/);
    const rail = page.locator('.phases');
    await rail.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 300);
    await expect.poll(() => rail.evaluate((el) => el.style.getPropertyValue('--p'))).not.toBe('');
  });

  test('decorative shapes are hidden from assistive tech and never block clicks', async ({ page }) => {
    await page.goto('/');
    expect(await page.$$eval('.shape svg', (svgs) => svgs.filter((s) => s.getAttribute('aria-hidden') !== 'true').length)).toBe(0);
    const pointer = await page.$$eval('.shape', (els) => els.map((el) => getComputedStyle(el).pointerEvents));
    expect(pointer.every((p) => p === 'none')).toBe(true);
  });
});

/* ------------------------------------------------------ coldpath case study */

test.describe('coldpath case study', () => {
  test('the suppression auditor runs the real matching rules', async ({ page }) => {
    await page.goto('/work/coldpath/');
    const out = page.locator('#audOut');
    // VersaCold vs Americold: close enough to worry about, never suppressed on fuzzy similarity alone.
    await expect(out).toHaveAttribute('data-verdict', 'HUMAN QUEUE');
    await expect(out).toContainText('Sent to a person');
    await page.getByRole('button', { name: /Lineage LLC vs Lineage, Inc\./ }).click();
    await expect(out).toHaveAttribute('data-verdict', 'SUPPRESSED');
    await page.locator('#audProspect').fill('Sysco Corporation');
    await page.locator('#audCustomer').fill('The Kroger Co.');
    await expect(out).toHaveAttribute('data-verdict', 'CLEAR');
  });

  test('the gate visualiser refuses the 89 million pound outlier', async ({ page }) => {
    await page.goto('/work/coldpath/');
    await expect(page.locator('#gateOut tr[data-gate="G-OUT"]')).toHaveAttribute('data-result', 'REFUSE');
    await expect(page.locator('#gateFinal')).toContainText('numeric_outlier');
    await page.getByRole('button', { name: 'Clean facility: 30,000 lb' }).click();
    await expect(page.locator('#gateOut tr')).toHaveCount(4);
    await expect(page.locator('#gateOut tr[data-result="PASS"]')).toHaveCount(4);
  });

  test('the calculator starts at the real figures and responds', async ({ page }) => {
    await page.goto('/work/coldpath/');
    await expect(page.locator('#calcWhite')).toHaveText('112');
    await expect(page.locator('#calcResolved')).toHaveText('126');
    await page.locator('#calcCov').fill('0');
    await expect(page.locator('#calcWhite')).toHaveText('126');
  });

  test('the freshness badge reads the published snapshot', async ({ page }) => {
    await page.goto('/work/coldpath/');
    await expect(page.locator('[data-fresh]')).toHaveAttribute('data-state', /snapshot|live/);
    await expect(page.locator('[data-fresh]')).toContainText('13 September 2026');
  });

  test('the demo loads in its frame, runs, and follows the starting points', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    await page.goto('/work/coldpath/');
    const frame = page.locator('#demoFrame');
    await frame.scrollIntoViewIfNeeded();
    await expect.poll(() => page.frames().find((f) => f.url().includes('coldpath-sandbox'))?.title()).toMatch(/COLDPATH/);
    const demo = page.frameLocator('#demoFrame');
    await expect(demo.locator('body')).not.toBeEmpty();
    await page.locator('#demoMenu').getByRole('button', { name: /Researched brief/ }).click();
    await expect(frame).toHaveAttribute('src', /view=intel/);
    await expect(page.locator('#demoOpen')).toHaveAttribute('href', /view=intel/);
    await expect(page.locator('#demoCaption')).toContainText('Kroger');
    expect(errors).toEqual([]);
  });

  test('the prototype is served with its own policy and can only be framed by the site', async ({ request }) => {
    const res = await request.get('/work/coldpath/demo/coldpath-sandbox.html');
    expect(res.status()).toBe(200);
    const csp = res.headersArray().filter((h) => h.name.toLowerCase() === 'content-security-policy').map((h) => h.value).join(', ');
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).toContain("connect-src 'self'");
    expect(res.headers()['x-frame-options']).toBe('SAMEORIGIN');
  });
});

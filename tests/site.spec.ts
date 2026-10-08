import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { BOOKING_URL, LINKS, nav } from '../src/content/brand';
import { allLogos } from '../src/content/logos';
import { workItems } from '../src/content/work';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const ROUTES = [
  '/',
  '/services/',
  '/work/',
  ...workItems.map((w) => `/work/${w.slug}/`),
  '/insights/',
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
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
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

  test('anchors on other pages exist', async ({ page }) => {
    await page.goto('/services/');
    for (const n of ['1', '2', '3']) await expect(page.locator(`#phase-${n}`)).toHaveCount(1);
    await page.goto('/work/');
    await expect(page.locator('#builds')).toHaveCount(1);
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
    for (const route of ['/', '/services/', '/work/tier-1-advisory/']) {
      await page.goto(route);
      await expect(page.locator('html')).not.toHaveClass(/has-motion/);
      // The menu button needs the script; without it the nav is simply shown.
      await expect(page.locator('#site-nav')).toBeVisible();
      await expect(page.locator('[data-menu-btn]')).toBeHidden();
      expect(await axe(page), route).toEqual([]);
      const floors = await page.$$eval('.ls-layer', (ls) => ls.map((l) => getComputedStyle(l).opacity));
      expect(floors.every((o) => o === '1'), route).toBe(true);
    }
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
    expect(text).not.toMatch(/friday night|venue|hospitality|build in public/i);
  });
});

/* -------------------------------------------------------------- logo wall */

test.describe('logo wall', () => {
  test('lists every logo with a visible name, from the sprite', async ({ page, request }) => {
    await page.goto('/');
    const wall = page.locator('[data-logo-wall]');
    const items = wall.locator('.lw__list:not(.lw__list--clone) .lw__item');
    expect(await items.count()).toBe(allLogos.length);
    expect(allLogos.length).toBeGreaterThanOrEqual(40);
    for (const name of await items.allTextContents()) expect(name.trim()).not.toBe('');
    await expect(wall.locator('.lw__list--clone').first()).toHaveAttribute('aria-hidden', 'true');
    await expect(wall).toContainText('not partnerships');

    const sprite = await (await request.get('/logos.svg')).text();
    for (const logo of allLogos) expect(sprite, logo.id).toContain(`id="logo-${logo.id}"`);
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
    const button = page.getByRole('button', { name: 'Menu' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#site-nav')).toBeHidden();
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#site-nav').getByRole('link', { name: 'Services' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
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
  for (const route of ['/', '/work/tier-1-advisory/']) {
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

  test('screenshots load as modern formats with alt text on project pages', async ({ page }) => {
    await page.goto('/work/coldpath/');
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

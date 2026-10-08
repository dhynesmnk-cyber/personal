import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { BOOKING_URL, LINKS } from '../src/content/site';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** Scroll top to bottom so every reveal and lazy image has fired. */
async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
}

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

test.describe('accessibility', () => {
  test('no WCAG 2.2 AA violations with motion', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(400);
    const initial = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(initial.violations, JSON.stringify(initial.violations, null, 2)).toEqual([]);

    await scrollThrough(page);
    await page.waitForTimeout(1500);
    const settled = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(settled.violations, JSON.stringify(settled.violations, null, 2)).toEqual([]);
  });

  test('no WCAG 2.2 AA violations with reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    await context.close();
  });

  test('document language, title and landmarks', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-AU');
    await expect(page).toHaveTitle(/David Hynes/);
    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
  });

  test('one h1 and no skipped heading levels', async ({ page }) => {
    await page.goto('/');
    const levels = await page.$$eval('h1, h2, h3, h4, h5, h6', (hs) =>
      hs.filter((h) => h.getClientRects().length > 0 || h.closest('.visually-hidden')).map((h) => Number(h.tagName[1])),
    );
    expect(levels.filter((l) => l === 1)).toHaveLength(1);
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]!, `heading ${i} jumps from h${levels[i - 1]} to h${levels[i]}`).toBeLessThanOrEqual(levels[i - 1]! + 1);
    }
  });

  test('skip link is first in tab order and moves focus to main', async ({ page, browserName }, info) => {
    test.skip(info.project.name === 'mobile', 'Keyboard navigation is a desktop concern');
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    const outline = await skip.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe('none');
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    void browserName;
  });

  test('focused controls show a visible focus indicator', async ({ page }, info) => {
    test.skip(info.project.name === 'mobile', 'Keyboard navigation is a desktop concern');
    await page.goto('/');
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const style = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        return { tag: el.tagName, outline: cs.outlineStyle, width: parseFloat(cs.outlineWidth) };
      });
      expect(style, `tab stop ${i}`).not.toBeNull();
      expect(style!.outline, `tab stop ${i} (${style!.tag})`).not.toBe('none');
      expect(style!.width).toBeGreaterThanOrEqual(2);
    }
  });

  test('interactive targets are at least 24px tall (WCAG 2.5.8)', async ({ page }) => {
    await page.goto('/');
    const small = await page.$$eval('a, button', (els) =>
      els
        .filter((el) => el.getClientRects().length > 0)
        // Links inside running text are exempt under 2.5.8.
        .filter((el) => !el.closest('p'))
        .map((el) => ({ text: (el.textContent ?? '').trim().slice(0, 40), h: el.getBoundingClientRect().height }))
        .filter((r) => r.h < 24),
    );
    expect(small).toEqual([]);
  });

  test('images have alt text, intrinsic dimensions and load', async ({ page }) => {
    await page.goto('/');
    const imgs = page.locator('img');
    expect(await imgs.count()).toBeGreaterThanOrEqual(3);
    for (const img of await imgs.all()) {
      await expect(img).toHaveAttribute('alt', /\S/);
      await expect(img).toHaveAttribute('width', /\d+/);
      await expect(img).toHaveAttribute('height', /\d+/);
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      // Served as a modern format, not the PNG source.
      expect(await img.evaluate((el: HTMLImageElement) => el.currentSrc)).toMatch(/\.(avif|webp)$/);
    }
  });
});

test.describe('conversion', () => {
  test('every booking CTA points at the booking URL', async ({ page }) => {
    await page.goto('/');
    const ctas = page.locator('[data-cta]');
    expect(await ctas.count()).toBeGreaterThanOrEqual(4);
    for (const href of await ctas.evaluateAll((els) => els.map((el) => el.getAttribute('href')))) {
      expect(href).toBe(BOOKING_URL);
    }
    await expect(page.getByRole('link', { name: 'Book a discovery call' }).first()).toBeInViewport();
  });

  test('section navigation reaches every section', async ({ page }) => {
    await page.goto('/');
    for (const id of ['background', 'client-work', 'builds', 'policy', 'engagement', 'contact']) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
    const navTargets = await page.$$eval('nav[aria-label="Sections"] a', (as) => as.map((a) => a.getAttribute('href')));
    for (const href of navTargets) {
      await expect(page.locator(href!)).toHaveCount(1);
    }
  });

  test('project links go to the live projects', async ({ page }) => {
    await page.goto('/');
    for (const href of [LINKS.observatory, LINKS.coldpath, LINKS.beeFreeTools]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeAttached();
    }
    const insecure = await page.$$eval('a[href^="http:"]', (as) => as.map((a) => a.getAttribute('href')));
    expect(insecure).toEqual([]);
  });

  test('current client appears across the page and renders in the web font', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.proof')).toContainText('Wärtsilä (USA)');
    await expect(page.locator('#background')).toContainText('Wärtsilä (USA)');
    await expect(page.locator('#wartsila-title')).toHaveText('Wärtsilä (USA)');
    await page.evaluate(() => document.fonts.ready);
    const ok = await page.evaluate(() => document.fonts.check('400 32px Newsreader', 'Wärtsilä'));
    expect(ok).toBe(true);
  });
});

test.describe('layout and performance', () => {
  for (const width of [320, 375, 768, 1024, 1280, 1920]) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await scrollThrough(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('cumulative layout shift stays under 0.02', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
          if (!entry.hadRecentInput) (window as unknown as { __cls: number }).__cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto('/');
    await page.waitForTimeout(500);
    await scrollThrough(page);
    await page.waitForTimeout(500);
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.02);
  });

  test('no console errors and no inline executable scripts', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/');
    await scrollThrough(page);
    expect(errors).toEqual([]);
    const inline = await page.$$eval('script:not([src])', (ss) =>
      ss.filter((s) => s.getAttribute('type') !== 'application/ld+json').map((s) => s.outerHTML.slice(0, 80)),
    );
    expect(inline).toEqual([]);
  });

  test('only first-party requests', async ({ page, baseURL }) => {
    const origins = new Set<string>();
    page.on('request', (r) => origins.add(new URL(r.url()).origin));
    await page.goto('/');
    await scrollThrough(page);
    expect([...origins]).toEqual([new URL(baseURL!).origin]);
  });
});

test.describe('motion', () => {
  test('reduced motion: no animations run and shapes are in their final state', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/has-motion/);
    await scrollThrough(page);
    const running = await page.evaluate(() => document.getAnimations().length);
    expect(running).toBe(0);
    // Strands fully drawn, workflow bars full, every stack floor visible.
    const offsets = await page.$$eval('.bridge__strands path', (ps) => ps.map((p) => getComputedStyle(p).strokeDashoffset));
    expect(offsets.every((o) => parseFloat(o) === 0)).toBe(true);
    const floors = await page.$$eval('.ls-layer', (ls) => ls.map((l) => getComputedStyle(l).opacity));
    expect(floors.every((o) => o === '1')).toBe(true);
    await context.close();
  });

  test('with motion: shapes reveal and scroll-linked progress updates', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/has-motion/);
    const rail = page.locator('.phases');
    await rail.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 300);
    await expect.poll(async () => rail.evaluate((el) => el.style.getPropertyValue('--p'))).not.toBe('');
    const stack = page.locator('#policy .ls');
    await stack.scrollIntoViewIfNeeded();
    await expect(stack).toHaveClass(/is-in/);
  });

  test('without JavaScript every shape is in its final state', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/has-motion/);
    const floors = await page.$$eval('.ls-layer', (ls) => ls.map((l) => getComputedStyle(l).opacity));
    expect(floors.length).toBeGreaterThan(0);
    expect(floors.every((o) => o === '1')).toBe(true);
    const connectors = await page.$$eval('.gp__step:not(:last-child)', (els) =>
      els.map((el) => getComputedStyle(el, '::after').transform),
    );
    expect(connectors.every((t) => t === 'none')).toBe(true);
    await context.close();
  });

  test('decorative shapes are hidden from assistive tech and never block clicks', async ({ page }) => {
    await page.goto('/');
    const exposed = await page.$$eval('.shape svg', (svgs) => svgs.filter((s) => s.getAttribute('aria-hidden') !== 'true').length);
    expect(exposed).toBe(0);
    const pointer = await page.$$eval('.shape', (els) => els.map((el) => getComputedStyle(el).pointerEvents));
    expect(pointer.every((p) => p === 'none')).toBe(true);
  });
});

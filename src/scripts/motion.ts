/**
 * Scroll-linked motion. About 1.5 KB, no dependencies.
 *
 * - [data-reveal] gains .is-in once it scrolls into view (CSS does the rest).
 * - [data-fade] content fades up as it scrolls into view (.is-in). Anything
 *   on screen or already scrolled past when the script starts is marked
 *   .is-seen instead and never animates, so nothing flashes away and back.
 * - [data-count] numbers inside revealed content count up from zero.
 * - [data-scrub] gets a --p custom property from 0 to 1 as it moves through
 *   the viewport. "through" (default) runs while the element crosses the
 *   screen; "exit" runs from the top of the page until the element is
 *   partly scrolled away.
 * - [data-live] marks a shape with looping animation. It gains
 *   [data-paused] while off screen, so it costs nothing when out of view.
 *
 * Nothing here is needed to read or use the page. With reduced motion
 * requested, or without JavaScript, the script does nothing and every shape
 * renders in its final state.
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** On screen, or already scrolled past: either way the reader has reached it. */
function reached(el: Element): boolean {
  return el.getBoundingClientRect().top < window.innerHeight;
}

/** Counts a number like "112", "1,382" or "65%" up from zero, without moving anything around it. */
function countUp(el: HTMLElement): void {
  const text = el.textContent?.trim() ?? '';
  const match = /^(\d[\d,]*)(%?)$/.exec(text);
  if (!match) return;
  const target = Number(match[1]!.replace(/,/g, ''));
  const comma = match[1]!.includes(',');
  // Hold the final width so the shorter numbers on the way up never shift the layout.
  el.style.minWidth = `${el.getBoundingClientRect().width}px`;
  if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
  const start = performance.now();
  const duration = 1100;
  const step = (now: number): void => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 3;
    const n = Math.round(target * eased);
    el.textContent = (comma ? n.toLocaleString('en-AU') : String(n)) + match[2];
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = text;
  };
  requestAnimationFrame(step);
}

function initReveal(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal], [data-fade]'));
  const pending = new Set<HTMLElement>();

  const show = (el: HTMLElement, animate: boolean): void => {
    pending.delete(el);
    io.unobserve(el);
    // Content scrolled past without ever being seen (a fast fling on a slow
    // phone) is simply shown; only what the reader is looking at animates.
    el.classList.add(animate || el.hasAttribute('data-reveal') ? 'is-in' : 'is-seen');
    if (!animate) return;
    const counters = el.matches('[data-count]') ? [el] : el.querySelectorAll<HTMLElement>('[data-count]');
    for (const c of counters) countUp(c);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) show(entry.target as HTMLElement, true);
      }
    },
    // Any part of the element inside the lower edge counts, so tall blocks
    // on small screens reveal as reliably as short ones.
    { rootMargin: '0px 0px -8% 0px', threshold: 0 },
  );

  // Backstop for skipped frames: anything the reader has reached is revealed.
  let queued = false;
  const sweep = (): void => {
    queued = false;
    const vh = window.innerHeight;
    for (const el of pending) {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92) show(el, r.bottom > 0);
    }
    if (pending.size === 0) window.removeEventListener('scroll', onScroll);
  };
  const onScroll = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sweep);
  };

  // Anything on screen or already scrolled past when the script starts stays
  // as painted, so a reload part-way down the page (or a slow connection)
  // never flashes content away and back. Only what lies ahead fades in.
  for (const el of items) {
    if (reached(el)) {
      el.classList.add(el.hasAttribute('data-fade') ? 'is-seen' : 'is-in');
    } else {
      pending.add(el);
      io.observe(el);
    }
  }
  if (pending.size) window.addEventListener('scroll', onScroll, { passive: true });
}

function initScrub(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-scrub]'));
  if (items.length === 0) return;

  const active = new Set<HTMLElement>();
  const last = new WeakMap<HTMLElement, number>();
  let queued = false;

  const progress = (el: HTMLElement, vh: number): number => {
    const r = el.getBoundingClientRect();
    if (el.dataset.scrub === 'exit') {
      // Runs from the top of the page until a third of the element has
      // scrolled past, so the change happens while it is still in view.
      const docTop = r.top + window.scrollY;
      return clamp01(window.scrollY / Math.max(docTop + r.height * 0.35, 1));
    }
    return clamp01((vh * 0.85 - r.top) / (vh * 0.15 + r.height));
  };

  const update = (): void => {
    queued = false;
    const vh = window.innerHeight;
    for (const el of active) {
      const p = Math.round(progress(el, vh) * 1000) / 1000;
      if (last.get(el) === p) continue;
      last.set(el, p);
      el.style.setProperty('--p', String(p));
    }
  };

  const schedule = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) active.add(el);
        else active.delete(el);
      }
      schedule();
    },
    { rootMargin: '15% 0px 15% 0px' },
  );

  for (const el of items) {
    el.style.setProperty('--p', String(progress(el, window.innerHeight)));
    io.observe(el);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
}

function initLive(): void {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.target.toggleAttribute('data-paused', !entry.isIntersecting);
  });
  for (const el of document.querySelectorAll('[data-live]')) io.observe(el);
}

if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  initReveal();
  initScrub();
  initLive();
  document.documentElement.classList.add('has-motion');
}

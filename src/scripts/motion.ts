/**
 * Scroll-linked motion for the decorative shapes. About 1 KB, no dependencies.
 *
 * - [data-reveal] gains .is-in once it scrolls into view (CSS does the rest).
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

function inViewport(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

function initReveal(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

  // Anything already on screen stays as painted, so a reload part-way down
  // the page never flashes content away and back.
  for (const el of items) {
    if (inViewport(el)) el.classList.add('is-in');
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
  );

  for (const el of items) {
    if (!el.classList.contains('is-in')) io.observe(el);
  }
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

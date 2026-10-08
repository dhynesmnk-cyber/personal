# David Hynes: advisory site

Single-page site for David Hynes, built to do one job: get the right people to book a discovery call.

Static Astro build. No trackers, no third-party scripts, about 1 KB of JavaScript. WCAG 2.2 AA, tested on every change.

## Editing

**All copy and links live in `src/content/site.ts`.** Components only lay it out.

| To change | Edit |
| --- | --- |
| Where "Book a discovery call" goes | `BOOKING_URL` in `site.ts`. It is a `mailto:` today. Paste a Cal.com or Calendly URL to switch every CTA at once, and the email note under the final CTA hides itself. |
| Project links | `LINKS` in `site.ts`. The Observatory and Coldpath point at their GitHub repos until they have public domains. |
| Parliamentary submission link | `LINKS.submission`. The link appears on the page once it is set. |
| Oral evidence date | `policy.record` in `site.ts`. |
| Project screenshots | Replace the PNGs in `src/assets/work/` (16:10, at least 1440px wide), or rerun `npm run capture`. |
| Share image | `npm run build && npm run og && npm run build` regenerates `public/og.png` from the hero. |

Copy rules are enforced by `npm run check`: Australian English, no em dashes, and none of the banned jargon (leverage, seamless, unlock, solutions and so on; the list is in `scripts/check-copy.mjs`).

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build into `dist/` |
| `npm run serve` | Serves `dist/` with the production security headers from `netlify.toml` |
| `npm run check` | Type check and copy lint |
| `npm run budget` | Fails if JS, CSS, HTML, fonts or images exceed the budget |
| `npm test` | Playwright and axe: WCAG 2.2 AA, headings, focus, target size, overflow at 320 to 1920px, CLS, CSP, reduced motion, no-JS |
| `npm run verify` | All of the above, in order. CI runs this |
| `npm run capture` | Recaptures project screenshots from local checkouts (see the script header) |
| `npm run og` | Regenerates the Open Graph image |

## Structure

```
src/content/site.ts           every word and link
src/layouts/Base.astro        head, meta, JSON-LD, skip link
src/components/sections/      the seven page sections, in page order
src/components/shapes/        the abstract shapes and diagrams
src/scripts/motion.ts         scroll-linked motion (the only client JS)
src/styles/tokens.css         colours, type, spacing, fonts
scripts/                      copy lint, budget, test server, capture, OG image
tests/site.spec.ts            the test suite
```

## Design notes

- **Palette.** Olive and forest greens on a warm paper base. Every text pairing in `tokens.css` passes AA, and the ratios are noted in the file. Olive-400, sage and moss are for shapes and rules only, never text.
- **Type.** Newsreader for headings and Inter for body, both self-hosted. The italic is a 21 KB static instance, because it is only used for emphasis in the hero.
- **Two shape families.**
  - `BridgeField` is translation. A loose network passes through a translation layer into ordered workflow rows. It draws on load and organises as you scroll, and it appears again in the final CTA fully settled.
  - `LayerStack` is infrastructure. Isometric floors drop into place, and they spread apart when you hover a phase card.
  - The diagrams (`ArchitectureDiagram`, `GatePipeline`, `FanIn`) are real HTML lists, so they read correctly with a screen reader.
- **Motion policy.** Motion is opt-in. With reduced motion requested, or without JavaScript, every shape renders in its final state. Only `transform`, `opacity` and stroke offsets animate. Text is never hidden or dimmed before a reveal.
- **Security.** The CSP in `netlify.toml` forbids inline script and every third-party origin. Astro is configured never to inline scripts, so the policy holds.

## Deploying

Netlify reads `netlify.toml`: it builds with `npm run build` and publishes `dist/`. Set `SITE_URL` (for example `https://davidhynes.com.au`) in the site's environment variables so canonical and Open Graph URLs are absolute.

Any static host works. Copy the headers from `netlify.toml` if the host is not Netlify.

## Screenshots

The project screenshots were captured from local builds of each project, because the live sites were not reachable from the build environment:

- **Observatory:** the dashboard of the query viewer in `data-pipeline/viewer/`.
- **Coldpath:** the target-list view of the browser prototype. The sidebar, which names client staff, is cropped out.
- **Bee Free Tools:** the tool gallery from a fresh build of the repo.

If the live sites have changed since, recapture them or drop in new images.

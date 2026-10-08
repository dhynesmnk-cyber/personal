# David Hynes Consulting

The website for David Hynes Consulting, an AI strategy, governance and adoption practice. Every page is built to get the right people to book a discovery call.

Static Astro build. No trackers, no third-party scripts, about 1 KB of JavaScript. WCAG 2.2 AA, tested on every change.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero, services (directly under the fold), approach, recent work, transparency, insights teaser |
| `/services/` | The three phased engagements, the approach, who we work with, capabilities |
| `/work/` | Client case studies and our own builds |
| `/work/<slug>/` | One page per case study or build, generated from `src/content/work.ts` |
| `/insights/` | Parliamentary submission, data centre research, and articles once there are any |
| `/about/` | The practice, the founder, principles and experience |
| `/contact/` | Booking, what happens next, contact details |
| `/logos.svg` | The logo-wall sprite, built from `src/content/logos.ts` |

## Editing

**All copy and links live in `src/content/`**, one file per page plus `brand.ts` for things shared by every page. Components only lay them out.

| To change | Edit |
| --- | --- |
| Where "Book a discovery call" goes | `BOOKING_URL` in `brand.ts`. It is a `mailto:` today. Paste a Cal.com or Calendly URL to switch every CTA at once, and the email notes hide themselves. |
| Navigation | `nav` in `brand.ts` |
| Logo wall | `logos.ts`. Add or remove an entry and the sprite and footer update on the next build. Marks come from `simple-icons` (CC0) and `@lobehub/icons-static-svg` (MIT). Keep it to models and tools actually used. |
| Case studies and builds | `work.ts`. A new build needs a screenshot in `src/assets/work/` and an entry in `builds`. |
| Parliamentary submission link | `LINKS.submission` in `brand.ts`. The link appears once it is set. |
| Oral evidence date | `insights.submission.record` in `insights.ts` |
| Articles | `insights.articles`. The section stays hidden while it is empty. |
| Project screenshots | Replace the PNGs in `src/assets/work/` (16:10, at least 1440px wide), or rerun `npm run capture`. |
| Share image | `npm run build && npm run og && npm run build` regenerates `public/og.png` from the hero. |

`npm run check` enforces the copy rules: Australian English, no em dashes, and none of the banned jargon (leverage, seamless, unlock, solutions and so on; the list is in `scripts/check-copy.mjs`). It scans every content file and every page and component.

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build into `dist/` |
| `npm run serve` | Serves `dist/` with the production security headers from `netlify.toml` and the real 404 page |
| `npm run check` | Type check and copy lint |
| `npm run budget` | Fails if JS, CSS, the largest page, the logo sprite, fonts or images exceed the budget |
| `npm test` | Playwright and axe on every page, covering WCAG 2.2 AA (with motion, reduced motion and no JS), headings, nav state, link crawl, focus, target size, overflow, CLS, CSP, the logo wall and the mobile menu |
| `npm run verify` | All of the above, in order. CI runs this |
| `npm run capture` | Recaptures project screenshots from local checkouts (see the script header) |
| `npm run og` | Regenerates the Open Graph image |

## Structure

```
src/content/                  every word and link, one file per page
src/pages/                    one file per route; work/[slug].astro builds the case pages
src/layouts/Base.astro        head, meta, JSON-LD, skip link, header and footer
src/components/               header (with mobile menu), footer and logo wall, page blocks
src/components/shapes/        the abstract shapes and diagrams
src/scripts/motion.ts         scroll-linked motion
scripts/                      copy lint, budget, test server, capture, OG image
tests/site.spec.ts            the test suite
```

## Design notes

- **Palette.** Olive and forest greens on a warm paper base. Every text pairing in `tokens.css` passes AA, and the ratios are noted in the file.
- **Type.** Newsreader for headings and Inter for body, both self-hosted.
- **Shapes.**
  - `BridgeField` (translation) draws on load and organises as you scroll.
  - `LayerStack` (infrastructure) drops into place and spreads apart when you hover a card.
  - The diagrams are real HTML lists, so they read correctly with a screen reader.
- **Motion policy.** Motion is opt-in. With reduced motion requested, or without JavaScript, every shape renders in its final state, and the logo wall is a static grid. While the logo wall scrolls, a visible Pause button stops it (WCAG 2.2.2).
- **Security.** The CSP in `netlify.toml` forbids inline script and every third-party origin, and Astro is configured never to inline scripts.

## Deploying

Netlify reads `netlify.toml`: it builds with `npm run build` and publishes `dist/`. Netlify deploys whatever is on `main`, and pull requests get a deploy preview. Canonical and Open Graph URLs use the site's Netlify address automatically (Netlify's `URL` variable). If a custom domain is added later, Netlify updates `URL` itself; set `SITE_URL` only to override it.

## Screenshots

The project screenshots were captured from local builds of each project:

- **Observatory:** the query viewer's dashboard.
- **Coldpath:** the prototype's target-list view, with the sidebar that names client staff cropped out.
- **Bee Free Tools:** the tool gallery from a fresh build.

Recapture them if the projects change.

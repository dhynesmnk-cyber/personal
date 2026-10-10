# David Hynes Consulting

The website for David Hynes Consulting, an AI strategy, governance and adoption practice. Every page is built to get the right people to book a discovery call.

Static Astro build. No trackers, no third-party scripts, under 2 KB of shared JavaScript. WCAG 2.2 AA, tested on every change.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The north star hero, services (directly under the fold), three headline results, the call to action. Nothing else |
| `/services/` | The three phases, the approach, who I work with, capabilities |
| `/work/` | Client case studies and my own builds |
| `/work/<slug>/` | One page per case study or build, generated from `src/content/work.ts` |
| `/work/coldpath/` | The Coldpath case study: live widgets running the engine's real rules, and the prototype embedded from `public/work/coldpath/demo/` |
| `/insights/` | Articles, the parliamentary submission and the data centre research |
| `/insights/<article>/` | One page per article, in `src/pages/insights/` |
| `/about/` | The practice, the founder, principles and experience |
| `/contact/` | Booking, what happens next, contact details |
| `/logos.svg` | The logo-wall sprite, built from `src/content/logos.ts` |

## Editing

**All copy and links live in `src/content/`**, one file per page plus `brand.ts` for things shared by every page. Components only lay them out.

| To change | Edit |
| --- | --- |
| Where "Book a discovery call" goes | `BOOKING_URL` in `brand.ts`. It is a `mailto:` today. Paste a Cal.com or Calendly URL to switch every CTA at once, and the email notes hide themselves. |
| Voice | The rules are at the top of `brand.ts`: first person, plain, positive, each idea on one page. |
| Navigation | `nav` in `brand.ts`. The dropdowns are built in `menus.ts` from the services, work and articles, so new pages appear in them automatically. |
| Logo wall | `logos.ts`, in three tiers: frontier labs, tools, infrastructure. Add or remove an entry and the sprite and footer update on the next build. Marks come from `simple-icons` (CC0) and `@lobehub/icons-static-svg` (MIT). Keep it to well-known models and tools actually used. |
| Case studies and builds | `work.ts`. A new build needs a screenshot in `src/assets/work/` and an entry in `builds`. |
| Coldpath case study | Copy in `coldpath.ts`; the widgets' words in `src/scripts/coldpath/copy.ts`; the engine rules in `src/scripts/coldpath/core.ts` (ported unchanged; leave them alone). The prototype and its data snapshot are static files in `public/work/coldpath/`. The 60-minute run button emails with the subject "Whitespace run", separately from `BOOKING_URL`. |
| Coldpath data badge | `.github/workflows/coldpath-freshness-pull.yml` copies `website/data/freshness.json` from the coldpath repo every Monday, validates it and commits it. Until that repo publishes the file, the workflow fails and the page keeps showing the 13 September 2026 snapshot. |
| Parliamentary submission link | `LINKS.submission` in `brand.ts`. The link appears once it is set. |
| Oral evidence date | `insights.submission.record` in `insights.ts` |
| Articles | Add a page in `src/pages/insights/` using `src/layouts/Article.astro`, and list it in `insights.articles`. It then shows on Insights and in the Insights menu. |
| Project screenshots | Replace the PNGs in `src/assets/work/` (16:10, at least 1440px wide), or rerun `npm run capture`. |
| Share images | `npm run build && npm run og && npm run build` regenerates `public/og.png` from the hero, and the Coldpath and article cards. |

`npm run check` enforces the copy rules: Australian English, no em dashes, none of the banned jargon (leverage, seamless, unlock, solutions and so on; the list is in `scripts/check-copy.mjs`), no sentence of eight words or more repeated in two files, and no "Melbourne" on the home page. It scans every content file, every page and component, and the Coldpath widget copy.

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build into `dist/` |
| `npm run serve` | Serves `dist/` with the production security headers from `netlify.toml` and the real 404 page |
| `npm run check` | Type check and copy lint |
| `npm run budget` | Fails if shared JS, the Coldpath script, CSS, the largest page, the Coldpath prototype, the logo sprite, fonts or images exceed the budget |
| `npm test` | Playwright and axe on every page, covering WCAG 2.2 AA (with motion, reduced motion and no JS), headings, nav state and dropdowns, link crawl and anchors, focus, target size, overflow, CLS, CSP, the logo wall, the hero and the Coldpath widgets and demo |
| `npm run verify` | All of the above, in order. CI runs this |
| `npm run capture` | Recaptures project screenshots from local checkouts (see the script header) |
| `npm run og` | Regenerates the Open Graph image |

## Structure

```
src/content/                  every word and link, one file per page
src/pages/                    one file per route; work/[slug].astro builds the case pages
src/layouts/Base.astro        head, CSP, meta, JSON-LD, skip link, header and footer
src/layouts/Article.astro     long-form insights
src/components/               header (dropdowns and mobile menu), footer and logo wall, page blocks
src/components/shapes/        the abstract shapes and diagrams
src/scripts/motion.ts         scroll-linked motion
src/scripts/coldpath/         the Coldpath widgets and the engine rules they run
public/work/coldpath/         the Coldpath prototype, its data snapshot and share image
scripts/                      copy lint, budget, test server, capture, OG image
tests/site.spec.ts            the test suite
```

## Design notes

- **Palette.** Olive and forest greens on a warm paper base. Every text pairing in `tokens.css` passes AA, and the ratios are noted in the file.
- **Type.** Newsreader for headings and Inter for body, both self-hosted.
- **Shapes.**
  - `NorthStar` (the hero): the client's goals are the bright stars, everyday work is the field below, and work rises along streams towards the goals. The field organises as you scroll. A settled version closes every page.
  - `LayerStack` (infrastructure) drops into place and spreads apart when you hover a card.
  - The diagrams are real HTML lists, so they read correctly with a screen reader.
- **Motion policy.** Motion is opt-in. With reduced motion requested, or without JavaScript, every shape renders in its final state, and the logo wall is a static grid. While the logo wall scrolls, a visible Pause button stops it (WCAG 2.2.2).
- **Speed.** Each page's CSS is inlined into its head (about 6 to 10 KB gzipped), so nothing blocks the first paint. Fonts are preloaded with `font-display: optional`, and on small screens the header starts collapsed wherever scripting is on, so nothing shifts as the page loads.
- **Security.** Every page carries a strict Content-Security-Policy in a meta tag (`Base.astro`): no inline script and no third-party origins, and Astro is configured never to inline scripts. `netlify.toml` adds what a meta tag cannot: only the site may frame its pages. The Coldpath prototype is a single static file with an inline script, so it gets its own header policy that lets it run, makes no network calls, and can only be framed by the site. The prototype is excluded from the accessibility tests; the page around it is not.

## Deploying

Netlify reads `netlify.toml`: it builds with `npm run build` and publishes `dist/`. Netlify deploys whatever is on `main`, and pull requests get a deploy preview. Canonical and Open Graph URLs use the site's Netlify address automatically (Netlify's `URL` variable). If a custom domain is added later, Netlify updates `URL` itself; set `SITE_URL` only to override it.

## Screenshots

The project screenshots were captured from local builds of each project:

- **Observatory:** the query viewer's dashboard.
- **Bee Free Tools:** the tool gallery from a fresh build.

Coldpath has no screenshot: its case study embeds the working prototype.

Recapture them if the projects change.

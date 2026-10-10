// @ts-check
import { defineConfig } from 'astro/config';

// Absolute canonical and Open Graph URLs. Netlify sets URL to the site's
// primary address on every build; SITE_URL overrides it (for a custom domain
// on another host, say). Without either, canonical is omitted.
const site = process.env.SITE_URL || process.env.URL || undefined;

export default defineConfig({
  site,
  output: 'static',
  compressHTML: true,
  devToolbar: { enabled: false },
  build: {
    // Inline each page's CSS (about 6 to 10 KB gzipped) so nothing blocks
    // the first paint. The Content-Security-Policy already allows inline
    // styles (style-src 'unsafe-inline'); it is scripts that must stay external.
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      // Never inline scripts or assets into the HTML, so the CSP can forbid
      // inline script outright (script-src 'self').
      assetsInlineLimit: 0,
      // Keep CSS readable by older phones: without this the minifier rewrites
      // media queries into range syntax (width >= 64rem), which Safari only
      // understands from 16.4, and older iPhones would lose every layout rule.
      cssTarget: ['chrome100', 'firefox100', 'safari14'],
    },
  },
});

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
    // Keep CSS in files so the Content-Security-Policy can stay strict and
    // the browser can cache styles across visits.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Never inline scripts or assets into the HTML, so the CSP can forbid
      // inline script outright (script-src 'self').
      assetsInlineLimit: 0,
    },
  },
});

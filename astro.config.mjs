// @ts-check
import { defineConfig } from 'astro/config';

// Set SITE_URL in the host's environment (e.g. https://davidhynes.com.au) so
// canonical and Open Graph URLs are absolute. Without it they are omitted.
const site = process.env.SITE_URL || undefined;

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

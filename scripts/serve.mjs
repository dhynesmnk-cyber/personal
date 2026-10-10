#!/usr/bin/env node
/**
 * Serves dist/ the way production does, including the headers from
 * netlify.toml, so tests catch anything a Content-Security-Policy would
 * block. Dev and test only.
 *
 *   node scripts/serve.mjs [port]
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const port = Number(process.argv[2] ?? 4322);

// Read every [[headers]] rule from netlify.toml so there is one source of
// truth. A path gets the headers of every rule that matches it. When two rules
// both set a Content-Security-Policy, both are sent and the browser enforces
// both, which is the stricter reading of how Netlify combines rules.
const toml = await readFile(join(root, 'netlify.toml'), 'utf8');
const rules = toml
  .split('[[headers]]')
  .slice(1)
  .map((block) => {
    const pattern = block.match(/for\s*=\s*"([^"]+)"/)?.[1] ?? '';
    const values = [...block.matchAll(/^\s*([A-Za-z-]+)\s*=\s*"([^"]*)"\s*$/gm)]
      .filter(([, k]) => k !== 'for')
      .map(([, k, v]) => [k, v]);
    const re = new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
    return { re, values };
  });

function headersFor(path) {
  const out = {};
  for (const { re, values } of rules) {
    if (!re.test(path)) continue;
    for (const [k, v] of values) {
      if (k === 'Strict-Transport-Security') continue;
      if (k === 'Content-Security-Policy' && out[k]) out[k] = [out[k]].flat().concat(v);
      else out[k] = v;
    }
  }
  return out;
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let file = normalize(join(dist, decodeURIComponent(url.pathname)));
    if (!file.startsWith(dist)) throw new Error('outside root');
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { ...headersFor(url.pathname), 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    // Like Netlify: unknown paths get the site's own 404 page.
    const page = await readFile(join(dist, '404.html')).catch(() => 'Not found');
    res.writeHead(404, { ...headersFor('/404.html'), 'content-type': types['.html'] }).end(page);
  }
}).listen(port, '127.0.0.1', () => console.log(`Serving dist on http://localhost:${port}`));

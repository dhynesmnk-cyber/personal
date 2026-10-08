import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { allLogos, type LogoSource } from '../content/logos';

/**
 * Builds /logos.svg: one SVG sprite holding every mark on the logo wall as a
 * <symbol>. Pages reference marks with <use href="/logos.svg#logo-id">, so the
 * browser downloads and caches the set once for the whole site.
 */

const dirs: Record<LogoSource, string> = {
  lobehub: 'node_modules/@lobehub/icons-static-svg/icons',
  simpleicons: 'node_modules/simple-icons/icons',
};

async function symbol(id: string, source: LogoSource, file: string): Promise<string> {
  const svg = await readFile(join(process.cwd(), dirs[source], `${file}.svg`), 'utf8');
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
  const evenodd = /<svg[^>]*fill-rule="evenodd"/.test(svg);
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .trim();
  if (/\sid="/.test(inner) || /fill="(?!none|currentColor)[^"]+"/.test(inner)) {
    throw new Error(`logos: ${source}/${file}.svg is not a plain single-colour mark`);
  }
  return `<symbol id="logo-${id}" viewBox="${viewBox}" fill="currentColor"${evenodd ? ' fill-rule="evenodd"' : ''}>${inner}</symbol>`;
}

export const GET: APIRoute = async () => {
  const symbols = await Promise.all(allLogos.map((l) => symbol(l.id, l.source, l.file)));
  const body = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor">${symbols.join('')}</svg>`;
  return new Response(body, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
};

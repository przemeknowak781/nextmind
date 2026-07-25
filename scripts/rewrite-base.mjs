// Postbuild script — rewrites hardcoded absolute paths in HTML to include base prefix.
// Astro auto-prefixes its own assets (CSS/JS bundles) but does NOT prefix
// hand-written href="/path/" or src="/path/" or action="/path/" — this fixes that.
//
// Idempotent: skips paths that already start with the base, anchors, external links,
// protocol-relative URLs, mailto:, tel:, data:, etc.

import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.SITE_BASE || '/nextmind';
const DIST = process.env.DIST_DIR || './dist';

const EXTERNAL_PREFIXES = ['//', 'http://', 'https://', 'mailto:', 'tel:', 'data:', '#', 'javascript:'];
const ATTRS = ['href', 'src', 'action', 'content'];

function shouldRewrite(url) {
  if (!url || !url.startsWith('/')) return false;
  if (url.startsWith(BASE + '/') || url === BASE) return false;
  if (EXTERNAL_PREFIXES.some((p) => url.startsWith(p))) return false;
  return true;
}

function rewriteHtml(file) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = 0;

  for (const attr of ATTRS) {
    const regex = new RegExp(`\\s${attr}="(\\/[^"]*)"`, 'g');
    html = html.replace(regex, (match, url) => {
      if (!shouldRewrite(url)) return match;
      changed++;
      return ` ${attr}="${BASE}${url}"`;
    });
  }

  // Strony przekierowań generowane przez Astro (`redirects` w astro.config)
  // zawierają adres w `content="0;url=/sciezka/"`, którego pętla wyżej nie łapie,
  // bo wartość atrybutu nie zaczyna się od "/". Bez tego meta refresh i canonical
  // prowadzą poza katalog bazowy i kończą się 404 na GitHub Pages.
  html = html.replace(/content="(\d+\s*;\s*url=)(\/[^"]*)"/gi, (match, prefix, url) => {
    if (!shouldRewrite(url)) return match;
    changed++;
    return `content="${prefix}${BASE}${url}"`;
  });

  // Canonical na stronie przekierowania budowany jest z origin bez bazy.
  html = html.replace(
    /(<link\s+rel="canonical"\s+href="https?:\/\/[^/"]+)(\/[^"]*)"/gi,
    (match, origin, pathname) => {
      if (!shouldRewrite(pathname)) return match;
      changed++;
      return `${origin}${BASE}${pathname}"`;
    }
  );

  fs.writeFileSync(file, html);
  return changed;
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fp, files);
    else if (entry.name.endsWith('.html')) files.push(fp);
  }
  return files;
}

if (BASE === '/' || !BASE) {
  console.log('SITE_BASE is "/" — no rewrite needed.');
  process.exit(0);
}

if (!fs.existsSync(DIST)) {
  console.error(`Dist dir not found: ${DIST}`);
  process.exit(1);
}

console.log(`Rewriting absolute paths to prefix "${BASE}" in ${DIST}…`);
const files = walk(DIST);
let totalChanges = 0;
for (const file of files) {
  totalChanges += rewriteHtml(file);
}
console.log(`Done. Rewrote ${totalChanges} attribute(s) across ${files.length} HTML file(s).`);

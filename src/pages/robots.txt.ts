import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

// robots.txt generujemy, a nie trzymamy w public/, bo ścieżki zależą od celu
// wdrożenia: na GitHub Pages strona stoi w /nextmind/, a na własnej domenie
// w katalogu głównym. Wersja statyczna miała /nextmind wpisane na sztywno
// i po wysyłce na hosting blokowałaby nieistniejące adresy, a właściwych nie.
const BASE = SITE.url.slice(SITE.origin.length).replace(/\/$/, '');

const BODY = `User-agent: *
Allow: /
Disallow: ${BASE}/api/
Disallow: ${BASE}/thank-you/
Disallow: ${BASE}/materialy/

Sitemap: ${SITE.url}/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(BODY, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

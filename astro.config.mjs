// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Adres i katalog bazowy pochodzą ze środowiska, bo ta sama treść jedzie na dwa
// różne cele: GitHub Pages serwuje ją z podkatalogu /nextmind, a hosting FTP
// z katalogu głównego domeny. Domyślne wartości to konfiguracja GitHub Pages,
// żeby lokalny `npm run build` zachowywał się jak dotąd.
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://przemeknowak781.github.io';
const SITE_BASE = process.env.SITE_BASE ?? '/nextmind';

export default defineConfig({
  site: SITE_ORIGIN,
  base: SITE_BASE,
  trailingSlash: 'always',
  // Podstrona "PSF" została zastąpiona podziałem na województwa. Przekierowanie
  // utrzymuje działanie starych linków (Astro generuje statyczną stronę z meta refresh).
  redirects: {
    '/dofinansowanie/psf-podmiotowy-system-finansowania/': '/dofinansowanie/wojewodztwa/',
    // Ręcznie opisywane kursy zastąpił katalog generowany z Bazy Usług Rozwojowych.
    '/szkolenia/ai-w-pracy-biurowej-podstawy/': '/szkolenia/',
    '/szkolenia/ai-w-pracy-biurowej-level-2/': '/szkolenia/',
    '/szkolenia/ai-w-pracy-biurowej-program-100h/': '/szkolenia/',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/thank-you/') &&
        !page.includes('/api/') &&
        !page.includes('/materialy/'),
      i18n: {
        defaultLocale: 'pl',
        locales: { pl: 'pl-PL' },
      },
    }),
  ],
  vite: {
    // @ts-expect-error — tailwindcss/vite plugin type is overly strict in Astro 5
    plugins: [tailwindcss()],
  },
});

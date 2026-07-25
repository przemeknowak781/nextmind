// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://przemeknowak781.github.io',
  base: '/nextmind',
  trailingSlash: 'always',
  // Podstrona "PSF" została zastąpiona podziałem na województwa. Przekierowanie
  // utrzymuje działanie starych linków (Astro generuje statyczną stronę z meta refresh).
  redirects: {
    '/dofinansowanie/psf-podmiotowy-system-finansowania/': '/dofinansowanie/wojewodztwa/',
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

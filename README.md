# Next Mind Academy — strona internetowa

Witryna marketingowa marki **Next Mind Academy** (akademia AI dla pracowników biurowych spoza IT, sprzedawana z dofinansowaniem przez BUR).

Operator: **Expert-Sales sp. z o.o.** · KRS 0000549030 · NIP 9282081467 · REGON 361035409

---

## Stack

- **Astro 5** (SSG, content collections, View Transitions, MDX)
- **Tailwind CSS 4** (CSS-first `@theme` config)
- **TypeScript 5** (strict mode)
- **Zero React/Vue/Svelte** — czysta Astro + vanilla TS dla interaktywności (kalkulator, formularze, akordeon, mobile menu, cookie banner)

Stack jest dobrany pod **Lighthouse 100 / 100 / 100 / 95+** i&nbsp;niski koszt hostingu (Cloudflare Pages).

## Aesthetic direction

System projektowy „**Editorial Intelligence**" — celowo NIE wpada w&nbsp;generyczny look „AI startupu":

- **Typografia:** *Instrument Serif* (display, italic-driven) × **Geist** (body) × **Geist Mono** (numerics).
- **Paleta:** ciepły kremowy papier (`#F2EEE3`) + atramentowy ink (`#15110D`) + spalona sjena (`#D2522D`) jako jedyny wyraźny akcent. Bez gradientów neonowych, bez fioletów AI, bez „corporate blue".
- **Layout:** edytorska, nieregularna siatka 12-kolumnowa; wyraziste numery sekcji (`01 / 02 / 03`); marker-podświetlenia w&nbsp;tekście; dotted dividers.
- **Mikro-detal:** SVG paper grain (overlay), efekty hover na linkach (z&nbsp;animacją grubości), staggered reveal-on-load.

System tokenów żyje w&nbsp;[`src/styles/global.css`](src/styles/global.css) — wszystkie kolory, fonty, spacing przez CSS custom properties. Zmiana tokenu = zmiana całej strony.

## Struktura projektu

```
src/
├── components/
│   ├── courses/          # CourseCard
│   ├── layout/           # Header, Footer, Logo, CookieBanner, FormHandler
│   └── ui/               # Button, Section, Breadcrumbs, Accordion
├── content/
│   ├── articles/         # 3 pillarowe artykuły (MDX)
│   ├── courses/          # 2 kursy (MDX, pełen frontmatter zgodny z BUR SUZ-1)
│   ├── editions/         # 4 najbliższe terminy (JSON)
│   ├── faqs/             # 20 pytań (JSON)
│   ├── trainers/         # Profil trenera (MDX)
│   └── validators/       # Profil walidatora (JSON)
├── layouts/
│   └── BaseLayout.astro  # Wszystkie meta-tagi, schema.org, OG, Plausible
├── lib/
│   ├── format.ts         # Polish-locale formatPrice, formatDate
│   ├── funding-calculator.ts  # Logika kalkulatora (czysta, czystej-pamięci-funkcyjna)
│   ├── schema-org.ts     # Buildery JSON-LD per typ strony
│   └── site.ts           # SITE, OPERATOR, NAV — single source of truth
├── pages/
│   ├── index.astro                       # Strona główna (9 sekcji editorial)
│   ├── szkolenia/
│   │   ├── index.astro                   # Katalog + tabela porównawcza + quiz
│   │   ├── [slug].astro                  # Pełna long-form strona kursu (~3000 słów)
│   │   └── ai-w-pracy-biurowej-program-100h.astro
│   ├── terminy/
│   │   ├── index.astro                   # Kalendarz wszystkich edycji
│   │   └── [slug].astro                  # Szczegóły konkretnej edycji
│   ├── dofinansowanie/
│   │   ├── index.astro                   # Hub + tabela porównawcza KFS/PSF/FERS
│   │   ├── kalkulator.astro              # Interaktywny kalkulator
│   │   ├── bur-jak-zapisac.astro
│   │   ├── kfs-priorytet-3.astro
│   │   ├── psf-podmiotowy-system-finansowania.astro
│   │   └── fers-akademia-hr.astro
│   ├── blog/
│   │   ├── index.astro                   # Katalog + featured artykuł
│   │   └── [slug].astro                  # Pojedynczy artykuł (prose-editorial)
│   ├── materialy/                        # Lead magnety (gated, noindex)
│   ├── thank-you/                        # Strony potwierdzeń (noindex)
│   ├── firmy.astro                       # B2B landing + form ofertowy
│   ├── trener.astro                      # Profil Przemka + Schema.org Person
│   ├── o-akademii.astro                  # Misja + Operator + Standardy + Zespół
│   ├── faq.astro                         # 20 pytań w 4 kategoriach + Schema.org FAQPage
│   ├── kontakt.astro                     # Form + dane operatora
│   ├── regulamin.astro
│   ├── polityka-prywatnosci.astro        # Pełny RODO art. 13
│   ├── polityka-cookies.astro
│   ├── deklaracja-dostepnosci.astro      # Wymóg ustawy z 4 kwietnia 2019 r.
│   └── 404.astro
├── styles/
│   └── global.css        # Tailwind 4 @theme + design system
└── content.config.ts     # Zod schemas dla wszystkich kolekcji
```

**34 stron statycznych** generowanych przy buildzie (potwierdzone).

## Co jest, co nie

### ✅ Zaimplementowane
- Wszystkie strony z&nbsp;sitemapy spec sekcja 5.1
- Pełny system projektowy (tokeny, komponenty, prose-editorial)
- Content Collections z&nbsp;Zod (kursy, terminy, trenerzy, walidatorzy, artykuły, FAQ)
- Interaktywny kalkulator dofinansowania (vanilla TS, czysta logika)
- Schema.org JSON-LD: Organization, WebSite, Course, Event, Person, Article, FAQPage, BreadcrumbList
- Sitemap (`@astrojs/sitemap`), robots.txt
- Cookie banner (opt-in, RODO compliant)
- Form-handler script (validation, loading state, redirect to thank-you)
- Skip-link, focus rings, `prefers-reduced-motion` — pełna ścieżka WCAG 2.1 AA
- Plausible analytics (preload, opt-in)

### ⏳ Wymaga uzupełnienia przed launchem
- **Karty BUR** — placeholders w&nbsp;`burCardUrl` / `burEditionUrl`. Po publikacji — wpisać prawdziwe ID.
- **Liczby trenera** — `hoursDelivered`, `participantsTrained`, `certifications` w&nbsp;[`src/content/trainers/przemek-nowak.mdx`](src/content/trainers/przemek-nowak.mdx) — placeholder, do uzupełnienia z&nbsp;CV.
- **Treść regulaminu i&nbsp;polityki prywatności** — wersje bazowe są kompletne; finalne brzmienie powinien zatwierdzić prawnik.
- **API endpoints** (`/api/newsletter`, `/api/kontakt`, `/api/firma`, `/api/material`) — w&nbsp;MVP formularze obsługuje [`FormHandler.astro`](src/components/layout/FormHandler.astro) z&nbsp;client-side fake submission + redirect do `/thank-you/`. Aby podłączyć Resend → dodać Cloudflare Pages adapter (`@astrojs/cloudflare`), zmienić `output: 'server'` w&nbsp;`astro.config.mjs` i&nbsp;dodać endpointy w&nbsp;`src/pages/api/*.ts`.
- **Cloudflare Turnstile** — placeholder w&nbsp;`.env.example`, integrację dodać razem z&nbsp;API endpointami.
- **Generowanie OG images per strona** (Satori) — w&nbsp;MVP używamy jednego statycznego SVG (`/og/default.svg`). To akceptowalne na start.
- **DNS, domena, hosting** — przygotowane pod Cloudflare Pages (zob. spec sekcja 9.4).

### ❌ Świadomie poza scope
- LMS / system rezerwacji online (zapis przez BUR)
- Logowanie uczestnika (BUR przez login.gov.pl)
- Sklep e-commerce
- Dark mode (po MVP)

## Komendy

```bash
npm install         # 433 pakiety, ~1 min na czystej instalacji
npm run dev         # http://localhost:4321/nextmind/
npm run build       # static build do dist/ + postbuild rewriter (34 strony, ~4s)
npm run preview     # podgląd zbudowanej wersji
npm run check       # astro check (TS + JSX validation)
```

## Deployment — GitHub Pages

Strona jest skonfigurowana do automatycznego deploya na **GitHub Pages** pod adresem
`https://przemeknowak781.github.io/nextmind/`.

### Mechanika

1. **`base: '/nextmind'`** w [astro.config.mjs](astro.config.mjs) — Astro auto-prefixuje wszystkie własne assety (`_astro/*`).
2. **Postbuild rewriter** [scripts/rewrite-base.mjs](scripts/rewrite-base.mjs) — przepisuje wszystkie hardcoded `href`, `src`, `action`, `content` z absolutnych ścieżek (`/szkolenia/`) do prefixowanych (`/nextmind/szkolenia/`). Idempotentny, omija zewnętrzne i już prefixowane.
3. **GitHub Actions** [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — na każdy push do `main`: build + upload + deploy do Pages.

### Aktywacja w GitHub

1. Wejdź w **Settings → Pages** repozytorium.
2. **Source**: wybierz „GitHub Actions" (nie „Deploy from a branch").
3. Pierwszy push do `main` uruchomi workflow — po ~2–3 min strona będzie pod `https://przemeknowak781.github.io/nextmind/`.

### Migracja na własną domenę (np. nextmindacademy.pl)

Gdy domena będzie kupiona:

1. Zmień w [astro.config.mjs](astro.config.mjs):
   ```js
   site: 'https://nextmindacademy.pl',
   base: '/',  // lub usuń całkowicie
   ```
2. Zmień w [src/lib/site.ts](src/lib/site.ts):
   ```ts
   origin: 'https://nextmindacademy.pl',
   url: 'https://nextmindacademy.pl',
   ```
3. Zmień w [public/robots.txt](public/robots.txt) ścieżki `/nextmind/...` na `/...`.
4. Dodaj plik `public/CNAME` z zawartością `nextmindacademy.pl`.
5. W GitHub Settings → Pages skonfiguruj custom domain.
6. Zaktualizuj plik [scripts/rewrite-base.mjs](scripts/rewrite-base.mjs) lub usuń rewriter z `npm run build`.

## Plan dalszych prac (post-MVP)

Zgodnie z&nbsp;[`SPECYFIKACJA_NEXT_MIND_ACADEMY.md`](SPECYFIKACJA_NEXT_MIND_ACADEMY.md) Załącznik D:

- **Faza 2 (m-c 1–3):** 6 nowych artykułów blogu, 2 nowe lead-magnety, /historie-sukcesu, newsletter automation.
- **Faza 3 (m-c 4–6):** A/B test hero, heatmapy Microsoft Clarity, exit-intent pop-up, /partner.
- **Faza 4 (m-c 7–12):** /szkolenia/program-100h pełny, warianty branżowe (księgowi/HR/sprzedaż/admin), wersja angielska.

## Licencja

Treść strony — © {ROK} Next Mind Academy / Expert-Sales sp. z o.o.
Kod źródłowy — wewnętrzny, niepubliczny.

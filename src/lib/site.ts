// Single source of truth for site-wide constants

export const SITE = {
  name: 'Next Mind Academy',
  shortName: 'NMA',
  // Root origin (for canonical URLs — Astro.url.pathname already includes base)
  origin: 'https://przemeknowak781.github.io',
  // Full base URL (for schema.org content URLs and absolute references like og:image)
  url: 'https://przemeknowak781.github.io/nextmind',
  defaultLocale: 'pl-PL',
  description:
    'Praktyczne szkolenia z ChatGPT, Gemini, Claude i NotebookLM dla pracowników biurowych spoza IT. Online live, kameralna grupa 4–10 osób, certyfikat zgodny z DigComp 2.2. Dofinansowanie KFS, PSF, BUR.',
  email: 'kontakt@nextmindacademy.pl',
  phone: '+48 000 000 000',
  ogImage: '/og/default.svg',
} as const;

export const OPERATOR = {
  legalName: 'Expert-Sales sp. z o.o.',
  street: 'ul. Słoneczna 6',
  postal: '68-200',
  city: 'Żary',
  country: 'PL',
  krs: '0000549030',
  nip: '9282081467',
  vatID: 'PL9282081467',
  regon: '361035409',
  burProviderUrl:
    'https://uslugirozwojowe.parp.gov.pl/wyszukiwarka/dostawca-uslug/podglad?id=199788',
} as const;

interface NavChild {
  label: string;
  href: string;
  summary?: string;
}
interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV: {
  primary: NavItem[];
  secondary: NavItem[];
  legal: NavItem[];
} = {
  primary: [
    {
      label: 'Szkolenia',
      href: '/szkolenia/',
      children: [
        { label: 'Basic 1-day', href: '/szkolenia/ai-w-pracy-biurowej-podstawy/', summary: 'Dla osób bez doświadczenia z AI' },
        { label: 'Level 2 1-day', href: '/szkolenia/ai-w-pracy-biurowej-level-2/', summary: 'Custom GPT, AI Studio, Zapier' },
        { label: 'Program 100h', href: '/szkolenia/ai-w-pracy-biurowej-program-100h/', summary: 'Pełna transformacja Q3 2026' },
        { label: 'Wszystkie terminy', href: '/terminy/', summary: 'Kalendarz najbliższych edycji' },
      ],
    },
    {
      label: 'Dofinansowanie',
      href: '/dofinansowanie/',
      children: [
        { label: 'BUR krok po kroku', href: '/dofinansowanie/bur-jak-zapisac/', summary: 'Jak zapisać się przez BUR' },
        { label: 'KFS Priorytet 3', href: '/dofinansowanie/kfs-priorytet-3/', summary: 'Dofinansowanie do 90%' },
        { label: 'PSF — operatorzy regionalni', href: '/dofinansowanie/psf-podmiotowy-system-finansowania/', summary: 'Lista per województwo' },
        { label: 'Kalkulator', href: '/dofinansowanie/kalkulator/', summary: 'Sprawdź, ile zapłacisz' },
      ],
    },
    { label: 'Dla firm', href: '/firmy/' },
    { label: 'Trener', href: '/trener/' },
    { label: 'Blog', href: '/blog/' },
  ],
  secondary: [
    { label: 'O akademii', href: '/o-akademii/' },
    { label: 'FAQ', href: '/faq/' },
    { label: 'Kontakt', href: '/kontakt/' },
  ] as NavItem[],
  legal: [
    { label: 'Regulamin', href: '/regulamin/' },
    { label: 'Polityka prywatności', href: '/polityka-prywatnosci/' },
    { label: 'Polityka cookies', href: '/polityka-cookies/' },
    { label: 'Deklaracja dostępności', href: '/deklaracja-dostepnosci/' },
  ],
};

export const TRUST_SIGNALS = [
  { label: 'Dostawca BUR', detail: 'Expert-Sales sp. z o.o.' },
  { label: 'DigComp 2.2', detail: 'Mapowanie efektów uczenia się' },
  { label: 'Walidacja dwumetodowa', detail: 'Test wiedzy + zadanie praktyczne' },
  { label: 'Kameralna grupa', detail: '4–10 osób — uwaga dla każdego' },
  { label: 'Polski', detail: 'Trener mówi po polsku' },
  { label: 'Online live', detail: 'Bez nagrań na YouTube' },
] as const;

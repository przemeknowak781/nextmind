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
    'Praktyczne szkolenia z ChatGPT, Gemini, Claude i NotebookLM dla pracowników biurowych spoza IT. Online live, zaświadczenie z mapowaniem na DigComp 2.2. Dofinansowanie z KFS i programów regionalnych.',
  email: 'kontakt@nextmindacademy.pl',
  ogImage: '/og/default.png',
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
        { label: 'Katalog szkoleń', href: '/szkolenia/', summary: 'Wszystkie tematy z terminami' },
        { label: 'Wszystkie terminy', href: '/terminy/', summary: 'Kalendarz najbliższych edycji' },
      ],
    },
    {
      label: 'Dofinansowanie',
      href: '/dofinansowanie/',
      children: [
        { label: 'BUR krok po kroku', href: '/dofinansowanie/bur-jak-zapisac/', summary: 'Jak zapisać się przez BUR' },
        { label: 'KFS Priorytet 3', href: '/dofinansowanie/kfs-priorytet-3/', summary: 'Do 90% dla firm do 9 osób, do 70% dla większych' },
        { label: 'Dofinansowanie wg województw', href: '/dofinansowanie/wojewodztwa/', summary: 'Operator i warunki w Twoim regionie' },
        { label: 'Analizator', href: '/dofinansowanie/kalkulator/', summary: 'Sprawdź, gdzie złożyć wniosek' },
        { label: 'Pomoc z wnioskiem', href: '/pomoc-z-wnioskiem/', summary: 'Przygotujemy dokumenty razem z Tobą' },
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
  { label: 'Małe grupy', detail: 'Wielkość zależna od szkolenia' },
  { label: 'Polski', detail: 'Trener mówi po polsku' },
  { label: 'Online live', detail: 'Bez nagrań na YouTube' },
] as const;

/**
 * Adres, pod który formularze wysyłają dane (POST, multipart/form-data).
 *
 * Serwis jest statyczny i NIE MA własnego backendu — dopóki ta stała jest
 * pusta, formularze otwierają wiadomość w programie pocztowym użytkownika
 * zamiast udawać wysyłkę. Wcześniej przechwytywały submit i przekierowywały
 * na stronę „dziękujemy", nie wysyłając niczego.
 *
 * Żeby je uruchomić, wpisz tu adres usługi przyjmującej formularze
 * (np. Formspree, Web3Forms, własna funkcja) i zweryfikuj odbiór wiadomości.
 */
export const FORM_ENDPOINT = '';

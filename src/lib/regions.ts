// Regionalne ścieżki finansowania szkoleń — dane źródłowe.
//
// ZASADY UTRZYMANIA (ważne przy każdej aktualizacji):
// 1. Wpisujemy wyłącznie dane potwierdzone na stronie operatora lub instytucji
//    zarządzającej. Brak potwierdzenia => status 'do-sprawdzenia', bez liczb.
// 2. Każdy wpis ma `url` (źródło) i `verified` (data weryfikacji). Bez tego nie
//    publikujemy pułapów ani limitów.
// 3. Pułapy i limity zmieniają się między naborami — interfejs zawsze pokazuje
//    datę weryfikacji i kieruje do regulaminu operatora jako źródła wiążącego.
// 4. Nie uogólniamy danych subregionalnych na całe województwo. Od tego jest
//    flaga `scope`.

export type RegionStatus =
  | 'aktywny' // nabory dla osób dorosłych prowadzone cyklicznie
  | 'wstrzymany' // program istnieje, ale nabór zawieszony
  | 'w-przygotowaniu' // operatorzy dopiero wybierani
  | 'do-sprawdzenia'; // brak potwierdzenia w źródłach urzędowych

export interface Region {
  slug: string;
  name: string;
  /** Nazwa programu dla osób dorosłych, jeśli potwierdzona */
  program?: string;
  /** Instytucja prowadząca nabór */
  operator?: string;
  /** Zakres terytorialny — gdy program nie obejmuje całego województwa */
  scope?: string;
  /** Poziom dofinansowania, dokładnie jak w źródle */
  coverage?: string;
  /** Limit kwotowy na uczestnika, dokładnie jak w źródle */
  limit?: string;
  status: RegionStatus;
  note?: string;
  url?: string;
  verified?: string;
}

/** Zbiorczy wykaz operatorów PARP — źródło nadrzędne, gdy brak danych regionalnych. */
export const PARP_OPERATORS_URL =
  'https://serwis-uslugirozwojowe.parp.gov.pl/component/site/site/dofinansowania-bur/';

export const BUR_URL = 'https://uslugirozwojowe.parp.gov.pl';

export const REGIONS: Region[] = [
  {
    slug: 'zachodniopomorskie',
    name: 'zachodniopomorskie',
    program: 'Zachodniopomorskie Bony Szkoleniowe',
    operator: 'Wojewódzki Urząd Pracy w Szczecinie',
    coverage: '70% podstawowo, 75% przy usłudze kończącej się kwalifikacją, 85% dla grup preferowanych, 90% przy obu warunkach',
    limit: 'do 6 300 zł wartości usługi, dofinansowanie do 5 670 zł',
    status: 'aktywny',
    note: 'Nabory cykliczne. Wniosek składa się elektronicznie bezpośrednio do WUP.',
    url: 'https://www.wup.pl/pl/projekty_wlasne/zachodniopomorskie-bony-szkoleniowe/',
    verified: '2026-07-25',
  },
  {
    slug: 'lodzkie',
    name: 'łódzkie',
    program: 'Łódzkie Bony Rozwojowe',
    operator: 'Sześciu operatorów regionalnych',
    coverage: '93% dofinansowania, 7% wkładu własnego',
    limit: 'do 11 000 zł wsparcia',
    status: 'aktywny',
    note: 'Wiele rund w ciągu roku u różnych operatorów — wniosek składa się u wybranego.',
    url: 'https://lodzkiebony.com/operatorzy/',
    verified: '2026-07-25',
  },
  {
    slug: 'slaskie',
    name: 'śląskie',
    program: 'Przepis na Rozwój',
    operator: 'HRP Grants',
    scope: 'Subregion Centralny (bytomski, gliwicki, katowicki, sosnowiecki, tyski)',
    coverage: '95% kosztów, 5% wkładu własnego',
    limit: '5 000 zł na szkolenia, 10 000 zł na studia podyplomowe',
    status: 'aktywny',
    note: 'Pozostałe subregiony śląskie mają odrębnych operatorów — sprawdź w wykazie PARP.',
    url: 'https://hrpgrants.com.pl/projekty/przepis-na-rozwoj-wsparcie-doroslych-subregion-centralny/',
    verified: '2026-07-25',
  },
  {
    slug: 'podlaskie',
    name: 'podlaskie',
    program: 'Podlaskie Bony na szkolenia',
    operator: 'Operatorzy subregionalni',
    coverage: '90% wartości szkolenia, 10% wkładu własnego',
    limit: 'do 7 350 zł w subregionie białostockim, do 6 000 zł w suwalskim i łomżyńskim',
    status: 'aktywny',
    note: 'Nabory otwierane na konkretną godzinę, decyduje kolejność zgłoszeń.',
    url: 'https://www.podlaskiebony.pl/',
    verified: '2026-07-25',
  },
  {
    slug: 'opolskie',
    name: 'opolskie',
    program: 'Program bonów na kwalifikacje',
    operator: 'Opolskie Centrum Rozwoju Gospodarki',
    coverage: '85% kosztów, 15% wkładu własnego',
    limit: 'do 9 500 zł na osobę',
    status: 'aktywny',
    url: 'https://ocrg.opolskie.pl/podnies-kwalifikacje-z-unijnym-wsparciem/',
    verified: '2026-07-25',
  },
  {
    slug: 'dolnoslaskie',
    name: 'dolnośląskie',
    program: 'Nowoczesne Kadry Dolnego Śląska',
    operator: 'AGROREG S.A. z Regionalnym Centrum Rozwoju i Edukacji',
    scope: 'Subregion wałbrzyski (dzierżoniowski, kłodzki, świdnicki, wałbrzyski, ząbkowicki, m. Wałbrzych)',
    coverage: '80%, z możliwością zwiększenia do 90% dla grup defaworyzowanych',
    limit: 'do 10 000 zł brutto na osobę',
    status: 'aktywny',
    note: 'Nabory w rundach. Pozostałe subregiony — sprawdź w wykazie PARP.',
    url: 'https://rcrie.pl/p,64,uslugi-rozwojowe-dla-osob-doroslych',
    verified: '2026-07-25',
  },
  {
    slug: 'lubelskie',
    name: 'lubelskie',
    program: 'Kompetencje przyszłości',
    operator: 'Lubelska Fundacja Rozwoju',
    scope: 'Podregion lubelski (lubartowski, lubelski, łęczyński, świdnicki, m. Lublin)',
    coverage: '80% kosztów netto, z możliwością podwyższenia dla grup w niekorzystnej sytuacji i usług prowadzących do kwalifikacji',
    limit: 'do 5 000 zł netto na uczestnika',
    status: 'aktywny',
    note: 'Sprawdź aktualne ogłoszenia operatora — terminy naborów są cykliczne.',
    url: 'https://www.lfr.lublin.pl/projekty/bur/',
    verified: '2026-07-25',
  },
  {
    slug: 'warminsko-mazurskie',
    name: 'warmińsko-mazurskie',
    program: 'Edukacja dla przyszłości',
    operator: 'Krajowa Agencja Informacyjna INFO',
    limit: 'do 5 450 zł dofinansowania na osobę',
    status: 'aktywny',
    note: 'Nabory w krótkich rundach — bywają zamykane w ciągu doby. W regionie działa też drugi operator.',
    url: 'https://operator.kai-info.eu/',
    verified: '2026-07-25',
  },
  {
    slug: 'kujawsko-pomorskie',
    name: 'kujawsko-pomorskie',
    program: 'Kierunek — Rozwój',
    operator: 'Wojewódzki Urząd Pracy w Toruniu',
    status: 'aktywny',
    note: 'Nabory cykliczne, wiele rund w roku. Pułap i limit potwierdź w regulaminie bieżącego naboru.',
    url: 'https://funduszeue.kujawsko-pomorskie.pl/kujawsko-pomorski-fundusz-szkoleniowy/',
    verified: '2026-07-25',
  },
  {
    slug: 'malopolskie',
    name: 'małopolskie',
    program: 'Małopolski pociąg do kariery',
    operator: 'Wojewódzki Urząd Pracy w Krakowie',
    status: 'aktywny',
    note: 'Nabory prowadzone turami dla wyodrębnionych grup uczestników. Pułap i limit potwierdź u operatora.',
    url: 'https://projekt.pociagdokariery.pl/cms/',
    verified: '2026-07-25',
  },
  {
    slug: 'wielkopolskie',
    name: 'wielkopolskie',
    program: 'Wsparcie w kształceniu osób dorosłych',
    operator: 'Agencja Rozwoju Regionalnego S.A. w Koninie',
    scope: 'Podregion koniński',
    coverage: '90% refundacji',
    limit: 'do 3 000 zł na uczestnika',
    status: 'wstrzymany',
    note: 'Nabór wniosków wstrzymany. Wsparcie w Wielkopolsce prowadzone jest per podregion — dla pozostałych sprawdź wykaz PARP.',
    url: 'https://arrkonin.org.pl/oferta/uslugi-rozwojowe/6-09-dla-osob-doroslych/',
    verified: '2026-07-25',
  },
  {
    slug: 'mazowieckie',
    name: 'mazowieckie',
    operator: 'Wojewódzki Urząd Pracy w Warszawie',
    status: 'w-przygotowaniu',
    note: 'Wsparcie dla osób dorosłych jest na etapie wyłaniania operatorów — bon dla mieszkańca nie jest jeszcze dostępny. Działające nabory adresowane są do pracodawców.',
    url: 'https://wupwarszawa.praca.gov.pl/',
    verified: '2026-07-25',
  },
  {
    slug: 'lubuskie',
    name: 'lubuskie',
    program: 'Lubuskie Bony Rozwojowe',
    status: 'do-sprawdzenia',
    note: 'Program adresowany przede wszystkim do pracodawców. Istnienia odrębnej ścieżki dla osób dorosłych nie udało się potwierdzić — skontaktuj się z operatorem.',
    url: 'https://www.lubuskiebony.pl/',
    verified: '2026-07-25',
  },
  { slug: 'pomorskie', name: 'pomorskie', status: 'do-sprawdzenia', verified: '2026-07-25' },
  { slug: 'podkarpackie', name: 'podkarpackie', status: 'do-sprawdzenia', verified: '2026-07-25' },
  { slug: 'swietokrzyskie', name: 'świętokrzyskie', status: 'do-sprawdzenia', verified: '2026-07-25' },
];

export const STATUS_LABELS: Record<RegionStatus, { label: string; tone: 'ok' | 'warn' | 'muted' }> = {
  aktywny: { label: 'Nabory prowadzone', tone: 'ok' },
  wstrzymany: { label: 'Nabór wstrzymany', tone: 'warn' },
  'w-przygotowaniu': { label: 'W przygotowaniu', tone: 'warn' },
  'do-sprawdzenia': { label: 'Sprawdź u operatora', tone: 'muted' },
};

export function getRegion(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export const REGIONS_SORTED = [...REGIONS].sort((a, b) => a.name.localeCompare(b.name, 'pl'));

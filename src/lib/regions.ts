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
    verified: '2026-07-27',
  },
  {
    slug: 'lodzkie',
    name: 'łódzkie',
    program: 'Łódzkie Bony Rozwojowe',
    operator: 'Sześciu operatorów dla osób dorosłych',
    coverage: '93% dofinansowania, 7% wkładu własnego',
    limit: 'do 6 800 zł wsparcia; do 11 000 zł na Obszarze Transformacji',
    status: 'aktywny',
    note: 'Wiele rund w ciągu roku u różnych operatorów — wniosek składa się u wybranego. Wyższy limit dotyczy wyłącznie mieszkańców Obszaru Transformacji (odrębne nabory).',
    url: 'https://lodzkiebony.com/operatorzy/',
    verified: '2026-07-27',
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
    note: 'Pozostałe subregiony śląskie mają odrębnych operatorów — sprawdź w wykazie PARP. Projekt trwa do 31 grudnia 2026 r.',
    url: 'https://hrpgrants.com.pl/projekty/przepis-na-rozwoj-wsparcie-doroslych-subregion-centralny/',
    verified: '2026-07-27',
  },
  {
    slug: 'podlaskie',
    name: 'podlaskie',
    program: 'Podlaskie Bony na szkolenia',
    operator: 'Operatorzy subregionalni',
    coverage: '90% wartości szkolenia, 10% wkładu własnego',
    limit: 'do 7 350 zł w subregionie białostockim, do 6 000 zł w suwalskim i łomżyńskim',
    status: 'aktywny',
    note: 'Nabory otwierane na konkretną godzinę, decyduje kolejność zgłoszeń. Dla kursów językowych i podstawowych kompetencji cyfrowych limit wynosi 3 500 zł. Projekt w subregionie łomżyńskim kończy się 30 września 2026 r.',
    url: 'https://www.podlaskiebony.pl/',
    verified: '2026-07-27',
  },
  {
    slug: 'opolskie',
    name: 'opolskie',
    program: 'Opolskie stawia na rozwój (działanie 5.11 Kształcenie ustawiczne)',
    operator: 'Opolskie Centrum Rozwoju Gospodarki',
    coverage: 'do 85% kwoty netto usługi',
    limit: 'do 9 500 zł na osobę',
    status: 'aktywny',
    note: 'Nabory ogłaszane cyklicznie, wnioski wyłącznie przez formularz OCRG. Ostatni nabór: 13–24 lipca 2026 r.',
    url: 'https://formularze.ocrg.opolskie.pl/',
    verified: '2026-07-27',
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
    note: 'Nabory w rundach: 31.08–02.09.2026 i 26–28.10.2026. Projekt trwa do 31 grudnia 2026 r. Pozostałe subregiony — sprawdź w wykazie PARP.',
    url: 'https://rcrie.pl/p,64,uslugi-rozwojowe-dla-osob-doroslych',
    verified: '2026-07-27',
  },
  {
    slug: 'lubelskie',
    name: 'lubelskie',
    program: 'Kompetencje przyszłości',
    operator: 'Lubelska Fundacja Rozwoju',
    scope: 'Podregion lubelski (lubartowski, lubelski, łęczyński, świdnicki, m. Lublin)',
    coverage: '80% kosztów netto, +5 p.p. dla osób w niekorzystnej sytuacji i usług prowadzących do kwalifikacji',
    limit: 'do 5 000 zł netto na uczestnika w całym projekcie',
    status: 'aktywny',
    note: 'Sprawdź aktualne ogłoszenia operatora — terminy naborów są cykliczne.',
    url: 'https://www.lfr.lublin.pl/projekty/bur/',
    verified: '2026-07-27',
  },
  {
    slug: 'warminsko-mazurskie',
    name: 'warmińsko-mazurskie',
    status: 'do-sprawdzenia',
    note: 'Dwa projekty dla osób dorosłych dobiegły końca: „EDUKACJA dla przyszłości" (Krajowa Agencja Informacyjna INFO) zakończył się 30 czerwca 2026 r., a „BUR w działaniu. Edukacja przez całe życie." (Warmińsko-Mazurski Związek Pracodawców Prywatnych) jest w końcowej fazie realizacji. Nowego naboru dla osób dorosłych nie potwierdziliśmy — sprawdź wykaz operatorów PARP.',
    url: 'https://operator.wmzpp.org/',
    verified: '2026-07-27',
  },
  {
    slug: 'kujawsko-pomorskie',
    name: 'kujawsko-pomorskie',
    program: 'Kierunek — Rozwój',
    operator: 'Wojewódzki Urząd Pracy w Toruniu',
    coverage: '90% wartości bonu, 10% wkładu własnego',
    limit: 'bon do 6 400 zł, z czego do 5 760 zł dofinansowania',
    status: 'aktywny',
    note: 'Nabory cykliczne, wiele rund w roku. Projekt przedłużony do 31 grudnia 2028 r., budżet zwiększony do 78 mln zł.',
    url: 'https://wuptorun.praca.gov.pl/projekty-unijne',
    verified: '2026-07-27',
  },
  {
    slug: 'malopolskie',
    name: 'małopolskie',
    program: 'Małopolski pociąg do kariery',
    operator: 'Wojewódzki Urząd Pracy w Krakowie',
    status: 'aktywny',
    note: 'Nabory prowadzone turami dla wyodrębnionych grup (kobiety, osoby z niepełnosprawnościami, 50+, 41+). Pułap i limit potwierdź u operatora — nie publikuje ich w jednym miejscu.',
    url: 'https://www.pociagdokariery.pl/',
    verified: '2026-07-27',
  },
  {
    slug: 'wielkopolskie',
    name: 'wielkopolskie',
    program: 'Transformacja w kształceniu osób dorosłych z Wielkopolski Wschodniej',
    operator: 'Agencja Rozwoju Regionalnego S.A. w Koninie',
    scope: 'Wielkopolska Wschodnia (powiaty słupecki, kolski, turecki, koniński i m. Konin)',
    coverage: '88% refundacji, wyższy poziom dla grupy preferowanej (50+, osoby bezrobotne, mieszkańcy obszarów wiejskich)',
    limit: 'do 8 800 zł na uczestnika, do 4 400 zł na pojedynczą usługę',
    status: 'wstrzymany',
    note: 'Nabór wniosków wstrzymany od 3 czerwca 2026 r. Projekt trwa do 31 grudnia 2028 r. Wsparcie w Wielkopolsce prowadzone jest per podregion — dla pozostałych sprawdź wykaz PARP.',
    url: 'https://arrkonin.org.pl/oferta/uslugi-rozwojowe/10-01-dla-osob-doroslych/',
    verified: '2026-07-27',
  },
  {
    slug: 'mazowieckie',
    name: 'mazowieckie',
    program: 'Działanie 7.4 Edukacja osób dorosłych (Fundusze Europejskie dla Mazowsza 2021–2027)',
    operator: 'Operatorzy wybrani dla poszczególnych podregionów; wykaz prowadzi Wojewódzki Urząd Pracy w Warszawie',
    coverage: 'do 100% kosztów przy wsparciu kompleksowym',
    limit: 'do 14 900 zł na uczestnika',
    status: 'aktywny',
    note: 'Mazowsze jest podzielone na dwa regiony z odrębnymi projektami: w Regionie Mazowieckim Regionalnym działa sześciu operatorów (podregiony radomski, płocki, siedlecki, ostrołęcki, żyrardowski, ciechanowski), w Regionie Warszawskim Stołecznym trzech (m.st. Warszawa oraz powiaty grodziski, nowodworski, piaseczyński, pruszkowski i warszawski zachodni). Zgłaszasz się do operatora właściwego dla miejsca zamieszkania — WUP prowadzi wykaz, ale sam nie przyjmuje wniosków od mieszkańców.',
    url: 'https://wupwarszawa.praca.gov.pl/-/25294201-zdobadz-dofinansowanie-z-bazy-uslug-rozwojowych',
    verified: '2026-07-27',
  },
  {
    slug: 'lubuskie',
    name: 'lubuskie',
    program: 'Usługi rozwojowe dla mieszkańców województwa lubuskiego (działanie FELB.06.08 Edukacja dorosłych)',
    operator: 'Instytut ADN i ADN Akademia Biznesu',
    coverage: '95% wartości usługi, 5% wkładu własnego',
    limit: 'do 4 500 zł łącznie na uczestnika, także przy kilku usługach',
    status: 'aktywny',
    note: 'Nabory rundami — w 2026 r. w marcu, maju, lipcu, wrześniu i grudniu; termin każdej rundy operator ogłasza co najmniej 14 dni wcześniej. Preferencje dla mieszkańców obszarów wiejskich, osób 50+, o niskich kwalifikacjach i z niepełnosprawnościami. Projekt trwa do 31 grudnia 2027 r. Osobny program „Lubuskie Bony Rozwojowe" jest przeznaczony dla przedsiębiorców — to nie ta sama ścieżka.',
    url: 'https://urlubuskie.pl/',
    verified: '2026-07-27',
  },
  {
    slug: 'pomorskie',
    name: 'pomorskie',
    program: 'WEKTOR. Metropolitalny System Finansowania Kształcenia',
    operator: 'Agencja Rozwoju Pomorza S.A. z Wojewódzkim Urzędem Pracy w Gdańsku',
    scope: 'Subregion metropolitalny (Gdańsk, Gdynia, Sopot oraz powiaty gdański, kartuski, pucki, wejherowski, nowodworski)',
    coverage: '95% wartości usługi, 5% wkładu własnego',
    limit: 'do 9 500 zł wsparcia przy koszcie usługi do 10 000 zł',
    status: 'aktywny',
    note: 'Nabory turami — III tura odbyła się 9 lipca 2026 r. Pozostałe subregiony (chojnicki, nadwiślański, słupski) mają odrębnych operatorów.',
    url: 'https://www.arp.gda.pl/',
    verified: '2026-07-27',
  },
  {
    slug: 'podkarpackie',
    name: 'podkarpackie',
    program: 'Nowe kwalifikacje i kompetencje drogą do kariery',
    operator: 'Caritas Diecezji Rzeszowskiej z PEXON sp. z o.o.',
    scope: 'Powiaty jasielski i krośnieński oraz miasto Krosno',
    status: 'aktywny',
    note: 'Nabory turami — VI nabór odbył się 28–29 maja 2026 r. Pułapu i limitu nie podajemy, bo operator ustala je odrębnie dla każdego naboru. Pozostałe subregiony mają własnych operatorów.',
    url: 'https://szkolenia.caritas.rzeszow.pl/',
    verified: '2026-07-27',
  },
  {
    slug: 'swietokrzyskie',
    name: 'świętokrzyskie',
    program: 'BUduj swój Rozwój — Baza Usług Rozwojowych',
    operator: 'Wojewódzki Urząd Pracy w Kielcach',
    coverage: '85% kosztów kwalifikowanych; 90% dla zawodów deficytowych z Barometru Zawodów',
    limit: 'do 8 500 zł na uczestnika, także przy kilku usługach',
    status: 'aktywny',
    note: 'Nabory cykliczne, ogłaszane przez WUP w Kielcach. Nabór dedykowany zawodom deficytowym prowadzono 2–13 lutego 2026 r.',
    url: 'https://wupkielce.praca.gov.pl/baza-uslug-rozwojowych/dla-osob-indywidualnych/ogloszenia-o-naborach',
    verified: '2026-07-27',
  },
];

/**
 * Data ostatniej weryfikacji danych regionalnych — najnowsza z pól `verified`.
 * Liczymy ją, zamiast wpisywać w treści stron, bo wpisana ręcznie rozjeżdżała
 * się z danymi po każdej aktualizacji.
 */
export const REGIONS_VERIFIED: string =
  REGIONS.map((r) => r.verified ?? '').sort().at(-1) ?? '';

/** np. „27.07.2026" */
export function formatVerified(iso: string = REGIONS_VERIFIED): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}

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

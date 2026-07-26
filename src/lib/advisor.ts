// Analizator ścieżki finansowania — logika doboru instrumentu i instytucji.
//
// Zasada: podajemy procenty wyłącznie tam, gdzie wynikają z przepisu (KFS).
// Dla ścieżki regionalnej kierujemy do operatora, bo pułapy ustala regulamin
// naboru i zmieniają się między rundami.

import { REGIONS, getRegion, PARP_OPERATORS_URL, BUR_URL, type Region } from './regions';

export type Audience = 'pracodawca' | 'jdg' | 'pracownik' | 'osoba-prywatna';

/** Progi zatrudnienia rozstrzygające o pułapie KFS (ustawa o rynku pracy i służbach zatrudnienia). */
export type Headcount = 'do-9' | 'od-10';

export interface AudienceDef {
  value: Audience;
  label: string;
  hint: string;
  /** Czy pytamy o liczbę zatrudnionych (wpływa na pułap KFS) */
  asksHeadcount: boolean;
}

export const AUDIENCES: AudienceDef[] = [
  {
    value: 'pracodawca',
    label: 'Firma zatrudniająca pracowników',
    hint: 'Chcesz przeszkolić swój zespół',
    asksHeadcount: true,
  },
  {
    value: 'jdg',
    label: 'JDG lub firma bez pracowników',
    hint: 'Chcesz przeszkolić siebie',
    asksHeadcount: false,
  },
  {
    value: 'pracownik',
    label: 'Pracownik',
    hint: 'Jesteś zatrudniony i chcesz się przeszkolić',
    asksHeadcount: false,
  },
  {
    value: 'osoba-prywatna',
    label: 'Osoba prywatna',
    hint: 'Uczysz się z własnej inicjatywy, nie prowadzisz firmy',
    asksHeadcount: false,
  },
];

export interface Path {
  /** Nazwa ścieżki */
  name: string;
  /** Gdzie fizycznie składa się wniosek */
  where: string;
  /** Pułap — tylko gdy wynika z przepisu */
  coverage?: string;
  /** Link do właściwej instytucji */
  url: string;
  urlLabel: string;
  steps: string[];
  /** Ostrzeżenie / warunek brzegowy */
  caveat?: string;
  /** Czy to ścieżka główna dla tej grupy */
  primary: boolean;
}

export interface AdvisorResult {
  headline: string;
  summary: string;
  paths: Path[];
  region?: Region;
  /** Pułap KFS jako ułamek — tylko dla grup uprawnionych */
  kfsRate?: number;
}

const KFS_URL = 'https://www.praca.gov.pl';
const PSZ_KFS_URL =
  'https://psz.praca.gov.pl/dla-pracodawcow-i-przedsiebiorcow/podnoszenie-kompetencji-i-kwalifikacji-pracownikow-i-kandydatow-do-pracy/krajowy-fundusz-szkoleniowy';
/** Wyszukiwarka właściwego urzędu pracy wg miejsca zamieszkania lub siedziby. */
const PUP_FINDER_URL = 'https://psz.praca.gov.pl/wybor-urzedu';

/**
 * Ścieżka indywidualna w urzędzie pracy — ustawa z 20 marca 2025 r. o rynku pracy
 * i służbach zatrudnienia. Instrumenty z art. 99–111 przysługują bezrobotnemu
 * ORAZ poszukującemu pracy, a poszukującym pracy może być również osoba pracująca
 * (art. 2 pkt 24 — brak wymogu pozostawania bez zatrudnienia).
 */
function pupIndividualPath(primary: boolean): Path {
  return {
    name: 'Bon na kształcenie ustawiczne — wniosek własny',
    where: 'Powiatowy urząd pracy właściwy dla miejsca zamieszkania',
    coverage: 'do 100% przeciętnego wynagrodzenia (decyzja uznaniowa)',
    url: PUP_FINDER_URL,
    urlLabel: 'Znajdź swój urząd pracy',
    primary,
    steps: [
      'Zarejestruj się w urzędzie pracy jako osoba poszukująca pracy — nie musisz być bezrobotny.',
      'Utrzymuj kontakt z urzędem co najmniej raz na 90 dni, inaczej stracisz status.',
      'Złóż wniosek o bon na kształcenie ustawiczne, wskazując konkretne szkolenie.',
      'Szkolenie musi pochodzić od instytucji wpisanej do Bazy Usług Rozwojowych.',
      'Rozpocznij kształcenie w terminie wskazanym w decyzji urzędu.',
    ],
    caveat:
      'Bon nie przysługuje z mocy prawa — starosta MOŻE go przyznać, więc decyzja jest uznaniowa i zależy też od budżetu urzędu. Pokrywa koszty do wysokości przeciętnego wynagrodzenia, nadwyżkę dopłacasz sam. Obowiązuje limit zbiorczy 450% przeciętnego wynagrodzenia na osobę w okresie 3 lat.',
  };
}

function kfsPath(rate: number): Path {
  return {
    name: 'KFS — Krajowy Fundusz Szkoleniowy',
    where: 'Powiatowy urząd pracy właściwy dla siedziby — wniosek przez indywidualne konto',
    coverage: `do ${Math.round(rate * 100)}% kosztów szkolenia`,
    url: KFS_URL,
    urlLabel: 'praca.gov.pl — złóż wniosek',
    primary: true,
    steps: [
      'Sprawdź termin naboru na stronie swojego powiatowego urzędu pracy.',
      'Załóż indywidualne konto w systemie urzędów pracy — do podpisu użyjesz podpisu kwalifikowanego, zaufanego albo osobistego z e-dowodu.',
      'Wypełnij wniosek i uzasadnij, jak szkolenie wiąże się ze stanowiskiem.',
      'Dołącz dokumenty dotyczące pomocy de minimis.',
      'Podpisz umowę z urzędem — dopiero potem możesz zacząć szkolenie.',
    ],
    caveat:
      'Warunek wstępny: przez co najmniej 6 miesięcy przed złożeniem wniosku opłacałeś składki na Fundusz Pracy albo jesteś z nich zwolniony z mocy prawa. Szkolenie musi zrealizować podmiot wpisany do rejestru PARP, a wsparcie stanowi pomoc de minimis. Pracodawca i osoba prowadząca działalność nie mogą przez 3 miesiące od ukończenia zawiesić ani zakończyć działalności — poza przypadkiem upadłości.',
  };
}

function regionalPath(region: Region | undefined, primary: boolean): Path {
  const hasOperator = Boolean(region?.program || region?.operator);
  return {
    name: 'Ścieżka regionalna — bon lub refundacja',
    where: region?.operator
      ? `${region.operator}${region.scope ? ` (${region.scope})` : ''}`
      : 'Operator wybrany dla Twojego województwa',
    url: region?.url && hasOperator ? region.url : PARP_OPERATORS_URL,
    urlLabel: region?.url && hasOperator ? 'Strona operatora' : 'Wykaz operatorów PARP',
    primary,
    steps: [
      'Załóż konto w Bazie Usług Rozwojowych przez login.gov.pl.',
      'Sprawdź termin najbliższego naboru u operatora — bywają zamykane w ciągu godzin.',
      'Złóż wniosek u operatora, nie w BUR. BUR to katalog usług, nie system wniosków.',
      'Po podpisaniu umowy odbierz ID wsparcia.',
      'Zapisz się na szkolenie w BUR, wpisując ID wsparcia.',
    ],
    caveat:
      'Pułap, limit kwotowy i model rozliczenia określa regulamin konkretnego naboru — to on jest wiążący.',
  };
}

export function analyze(audience: Audience, regionSlug: string, headcount?: Headcount): AdvisorResult {
  const region = getRegion(regionSlug);

  if (audience === 'pracodawca') {
    const rate = headcount === 'do-9' ? 0.9 : 0.7;
    return {
      headline: 'Wnioskujesz jako pracodawca',
      summary:
        'Masz dwie niezależne ścieżki. KFS prowadzi powiatowy urząd pracy i to jedyna, w której pułap wynika wprost z ustawy. Ścieżka regionalna działa równolegle, na zasadach ustalanych przez operatora.',
      kfsRate: rate,
      paths: [kfsPath(rate), regionalPath(region, false)],
      region,
    };
  }

  if (audience === 'jdg') {
    return {
      headline: 'Wnioskujesz na własne kształcenie',
      summary:
        'Od 2026 r. o środki z KFS mogą ubiegać się również podmioty niezatrudniające pracowników — na kształcenie własne. Obejmuje Cię wyższy pułap. Liczbę zatrudnionych liczy się w przeliczeniu na pełne etaty.',
      kfsRate: 0.9,
      paths: [kfsPath(0.9), regionalPath(region, false)],
      region,
    };
  }

  if (audience === 'pracownik') {
    return {
      headline: 'Masz dwie drogi — przez firmę i własną',
      summary:
        'W KFS wnioskodawcą jest pracodawca, więc o te środki sam nie wystąpisz. Ale wbrew powszechnemu przekonaniu nie jesteś od niego zależny: jako osoba pracująca możesz zarejestrować się w urzędzie pracy jako poszukująca pracy i złożyć własny wniosek o bon na kształcenie ustawiczne.',
      paths: [
        {
          name: 'Przez pracodawcę',
          where: 'Twój pracodawca składa wniosek do powiatowego urzędu pracy lub do operatora regionalnego',
          url: PSZ_KFS_URL,
          urlLabel: 'Zasady KFS — do pokazania przełożonemu',
          primary: true,
          steps: [
            'Wybierz konkretne szkolenie i sprawdź, czy dostawca jest wpisany do BUR.',
            'Przygotuj uzasadnienie: jak szkolenie przekłada się na Twoje obowiązki.',
            'Przekaż pracodawcy — to on składa wniosek i podpisuje umowę.',
          ],
          caveat: 'Dla firmy do 9 osób pułap KFS wynosi do 90%, dla większych do 70%.',
        },
        pupIndividualPath(false),
        {
          ...regionalPath(region, false),
          name: 'Samodzielnie — program regionalny',
          caveat:
            'W części województw działają programy dla osób dorosłych uczących się z własnej inicjatywy, niezależne od pracodawcy. Dostępność i warunki sprawdź u operatora.',
        },
      ],
      region,
    };
  }

  // osoba-prywatna
  return {
    headline: 'Wnioskujesz we własnym imieniu',
    summary:
      'KFS nie jest dla Ciebie — to instrument dla pracodawców i osób prowadzących działalność. Masz natomiast dwie własne ścieżki: program regionalny dla osób dorosłych oraz bon na kształcenie ustawiczne w urzędzie pracy. Można sprawdzić obie.',
    paths: [regionalPath(region, true), pupIndividualPath(false)],
    region,
  };
}

export { REGIONS, PARP_OPERATORS_URL, BUR_URL };

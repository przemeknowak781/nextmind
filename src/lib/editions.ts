// Wspólne wyliczanie najbliższej edycji.
//
// Powód istnienia: data najbliższej edycji była zaszyta w kilku miejscach
// (pasek nad nagłówkiem, stopka, hero, sekcje CTA). Gdy termin minął, serwis
// nadal reklamował go jako nadchodzący, razem z liczbą wolnych miejsc.
// Teraz wszystkie te miejsca czytają z jednego źródła i mają zdefiniowane
// zachowanie na wypadek braku przyszłych terminów.

import { getCollection, type CollectionEntry } from 'astro:content';

export type Edition = CollectionEntry<'editions'>;

/** Statusy, przy których edycja nie przyjmuje już zapisów. */
const CLOSED_STATUSES = new Set(['completed', 'cancelled']);

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Edycje z datą dzisiejszą lub późniejszą, posortowane rosnąco.
 * Odfiltrowuje zakończone i odwołane.
 */
export async function getUpcomingEditions(): Promise<Edition[]> {
  const today = startOfToday();
  return (await getCollection('editions'))
    .filter((e) => !CLOSED_STATUSES.has(e.data.status))
    .filter((e) => new Date(e.data.date) >= today)
    .sort((a, b) => +new Date(a.data.date) - +new Date(b.data.date));
}

/**
 * Najbliższa nadchodząca edycja albo `null`, gdy żadnej nie ma.
 *
 * Świadomie NIE ma tu fallbacku na termin z przeszłości — to on odpowiadał
 * za reklamowanie nieaktualnych dat.
 */
export async function getNearestEdition(): Promise<Edition | null> {
  const upcoming = await getUpcomingEditions();
  return upcoming[0] ?? null;
}

/** Najbliższa nadchodząca edycja dla wskazanego szkolenia. */
export async function getNearestEditionForCourse(courseSlug: string): Promise<Edition | null> {
  const upcoming = await getUpcomingEditions();
  return upcoming.find((e) => e.data.courseSlug === courseSlug) ?? null;
}

/** Mapa: slug szkolenia -> najbliższa nadchodząca edycja. */
export async function getUpcomingByCourse(): Promise<Record<string, Edition | undefined>> {
  const map: Record<string, Edition | undefined> = {};
  for (const e of await getUpcomingEditions()) {
    if (!map[e.data.courseSlug]) map[e.data.courseSlug] = e;
  }
  return map;
}

const DNI = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const MIESIACE = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

/** np. "środa, 10 czerwca 2026" */
export function formatEditionLong(date: Date): string {
  const d = new Date(date);
  return `${DNI[d.getDay()]}, ${d.getDate()} ${MIESIACE[d.getMonth()]} ${d.getFullYear()}`;
}

/** np. "10.06.2026" */
export function formatEditionNumeric(date: Date): string {
  const d = new Date(date);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/** Dzień i miesiąc rozdzielone — dla kafla w hero. */
export function splitEditionDate(date: Date) {
  const d = new Date(date);
  const p = (n: number) => String(n).padStart(2, '0');
  return {
    day: p(d.getDate()),
    month: p(d.getMonth() + 1),
    year: d.getFullYear(),
    weekday: DNI[d.getDay()],
  };
}

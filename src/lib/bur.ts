// Dostęp do danych pobranych z Bazy Usług Rozwojowych.
//
// Plik src/data/bur-services.json powstaje przed buildem w scripts/fetch-bur.mjs.
// Jest wersjonowany w repozytorium, żeby build działał także wtedy, gdy API BUR
// jest chwilowo niedostępne albo gdy brakuje danych dostępowych.

import raw from '../data/bur-services.json';

export interface BurScheduleEntry {
  date: string | null;
  from: string | null;
  to: string | null;
  topic: string | null;
  /** ZAJECIA | PRZERWA | WALIDACJA … */
  type: string | null;
}

export interface BurService {
  id: string;
  numer: string | null;
  title: string | null;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  recruitmentEnd: string | null;
  funded: boolean;
  priceNetPerParticipant: number | null;
  priceGrossPerParticipant: number | null;
  hoursTotal: number | null;
  seatsMin: number | null;
  seatsMax: number | null;
  url: string;
  schedule: BurScheduleEntry[];
}

interface BurData {
  fetchedAt: string | null;
  providerId: string;
  services: BurService[];
}

const data = raw as unknown as BurData;

export const BUR_FETCHED_AT = data.fetchedAt;
export const BUR_PROVIDER_ID = data.providerId;

/**
 * Zamienia znacznik czasu z API na „gołą" datę kalendarzową.
 *
 * API zwraca daty w czasie warszawskim (np. 2026-07-04T00:00:00+02:00). Build
 * działa w UTC, więc zwykłe new Date(...) po sformatowaniu cofa dzień o dwie
 * godziny i pokazuje 3 lipca zamiast 4. Bierzemy więc samą część RRRR-MM-DD
 * i kotwiczymy ją w południe UTC, co jest odporne na strefę builda.
 */
export function plainDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12));
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Usługi, które jeszcze się nie zakończyły, posortowane wg daty rozpoczęcia. */
export function getUpcomingServices(): BurService[] {
  const today = startOfToday();
  return data.services
    .filter((s) => {
      const end = s.endDate ? new Date(s.endDate) : null;
      return !end || end >= today;
    })
    .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
}

/** Najbliższa usługa albo null, gdy żadnej nie ma. */
export function getNearestService(): BurService | null {
  return getUpcomingServices()[0] ?? null;
}

/**
 * Najbliższa usługa, na którą wciąż można się zapisać.
 * Do zajawek w nagłówku i stopce — reklamowanie terminu z zamkniętą
 * rekrutacją tylko frustruje odwiedzającego.
 */
export function getNearestOpenService(): BurService | null {
  return getUpcomingServices().find((s) => isRecruitmentOpen(s)) ?? null;
}

/** Czy rekrutacja jest jeszcze otwarta. */
export function isRecruitmentOpen(s: BurService): boolean {
  if (!s.recruitmentEnd) return true;
  return new Date(s.recruitmentEnd) >= startOfToday();
}

/** Liczba dni zajęć — po unikalnych datach w harmonogramie. */
export function countDays(s: BurService): number {
  const days = new Set(s.schedule.map((h) => h.date?.slice(0, 10)).filter(Boolean));
  return days.size;
}

/** Godziny pierwszego i ostatniego wpisu danego dnia. */
export function dayHours(s: BurService): { from: string; to: string } | null {
  const entries = s.schedule.filter((h) => h.from && h.to);
  if (entries.length === 0) return null;
  const from = entries.reduce((m, h) => (h.from! < m ? h.from! : m), entries[0].from!);
  const to = entries.reduce((m, h) => (h.to! > m ? h.to! : m), entries[0].to!);
  return { from: from.slice(0, 5), to: to.slice(0, 5) };
}

export interface MonthGroup {
  key: string;
  label: string;
  services: BurService[];
}

const MIESIACE = [
  'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
  'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',
];

/** Grupuje nadchodzące usługi po miesiącu rozpoczęcia. */
export function groupByMonth(services: BurService[]): MonthGroup[] {
  const map = new Map<string, BurService[]>();
  for (const s of services) {
    const d = plainDate(s.startDate);
    if (!d) continue;
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, list]) => {
      const [y, m] = key.split('-');
      return { key, label: `${MIESIACE[Number(m) - 1]} ${y}`, services: list };
    });
}

/* ------------------------------------------------------------------ *
 *  KATALOG OFERT
 *
 *  W BUR jedna oferta występuje wielokrotnie — raz na każdy termin.
 *  Na stronie chcemy pokazać ofertę raz, z listą jej terminów, dlatego
 *  grupujemy usługi po tytule.
 * ------------------------------------------------------------------ */

export interface Offering {
  slug: string;
  title: string;
  priceNet: number | null;
  priceGross: number | null;
  seatsMin: number | null;
  seatsMax: number | null;
  /** Liczba dni zajęć wg harmonogramu. */
  days: number;
  /** Deklarowana liczba godzin, jeśli podana w BUR. */
  hours: number | null;
  /** Wszystkie nadchodzące terminy tej oferty. */
  terms: BurService[];
}

const PL_MAP: Record<string, string> = {
  ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
};

export function slugify(text: string, maxWords = 8): string {
  const base = text
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (c) => PL_MAP[c] ?? c)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, maxWords)
    .join('-');
  return base || 'szkolenie';
}

/** Oferty posortowane wg najbliższego terminu. */
export function getCatalog(): Offering[] {
  const groups = new Map<string, BurService[]>();
  for (const s of getUpcomingServices()) {
    const key = (s.title ?? '').trim();
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  }

  const used = new Set<string>();
  const out: Offering[] = [];

  for (const [title, terms] of groups) {
    let slug = slugify(title);
    // Tytuły bywają bardzo podobne — pilnujemy unikalności adresu.
    if (used.has(slug)) {
      let i = 2;
      while (used.has(`${slug}-${i}`)) i++;
      slug = `${slug}-${i}`;
    }
    used.add(slug);

    const first = terms[0];
    out.push({
      slug,
      title,
      priceNet: first.priceNetPerParticipant,
      priceGross: first.priceGrossPerParticipant,
      seatsMin: first.seatsMin,
      seatsMax: first.seatsMax,
      days: countDays(first),
      hours: first.hoursTotal,
      terms,
    });
  }

  return out.sort((a, b) =>
    String(a.terms[0]?.startDate).localeCompare(String(b.terms[0]?.startDate))
  );
}

export function getOffering(slug: string): Offering | undefined {
  return getCatalog().find((o) => o.slug === slug);
}

/** Zakres liczby uczestników w całym katalogu — do uczciwych deklaracji na stronie. */
export function seatsRange(): { min: number; max: number } | null {
  const cat = getCatalog();
  const mins = cat.map((o) => o.seatsMin).filter((n): n is number => typeof n === 'number');
  const maxs = cat.map((o) => o.seatsMax).filter((n): n is number => typeof n === 'number');
  if (mins.length === 0 || maxs.length === 0) return null;
  return { min: Math.min(...mins), max: Math.max(...maxs) };
}

/** Najniższa cena netto w katalogu — do komunikatów typu „już od…". */
export function lowestPrice(): number | null {
  const p = getCatalog().map((o) => o.priceNet).filter((n): n is number => typeof n === 'number');
  return p.length ? Math.min(...p) : null;
}

/* ------------------------------------------------------------------ *
 *  FORMATOWANIE DAT
 *  Wszystkie daty pochodzą z API i są kotwiczone przez plainDate(),
 *  dlatego formatujemy je w UTC — inaczej strefa builda przesunęłaby dzień.
 * ------------------------------------------------------------------ */

const OPTS = { timeZone: 'UTC' } as const;

/** np. „środa, 4 lipca 2026" */
export function formatLong(d: Date): string {
  return d.toLocaleDateString('pl-PL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', ...OPTS,
  });
}

/** np. „04.07.2026" */
export function formatNumeric(d: Date): string {
  return d.toLocaleDateString('pl-PL', {
    day: '2-digit', month: '2-digit', year: 'numeric', ...OPTS,
  });
}

/** Dzień, miesiąc, rok i dzień tygodnia — dla kafla w hero. */
export function dateParts(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return {
    day: p(d.getUTCDate()),
    month: p(d.getUTCMonth() + 1),
    year: d.getUTCFullYear(),
    weekday: d.toLocaleDateString('pl-PL', { weekday: 'long', ...OPTS }),
  };
}

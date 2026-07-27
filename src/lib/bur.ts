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

// Formatting helpers — dates, prices, numbers in Polish locale

const PLN = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const PLN_INT = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formatuje kwotę w złotych.
 *
 * Grosze pokazujemy zawsze, gdy występują — ceny w Bazie Usług Rozwojowych
 * bywają niecałkowite (np. 894,31 zł), a zaokrąglanie ich w dół rozjeżdżałoby
 * stronę z kartą usługi. `decimals: true` wymusza grosze także dla kwot
 * całkowitych, `decimals: false` je ucina.
 */
export function formatPrice(amount: number, opts: { decimals?: boolean } = {}): string {
  if (opts.decimals === true) return PLN.format(amount);
  if (opts.decimals === false) return PLN_INT.format(amount);
  return Number.isInteger(amount) ? PLN_INT.format(amount) : PLN.format(amount);
}

const DATE_LONG = new Intl.DateTimeFormat('pl-PL', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const DATE_SHORT = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const DATE_DAY = new Intl.DateTimeFormat('pl-PL', {
  day: '2-digit',
  month: '2-digit',
});

const MONTH_SHORT = new Intl.DateTimeFormat('pl-PL', { month: 'short' });
const WEEKDAY = new Intl.DateTimeFormat('pl-PL', { weekday: 'long' });

export function formatDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return DATE_LONG.format(d);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return DATE_SHORT.format(d);
}

export function formatDateDay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return DATE_DAY.format(d);
}

export function formatMonthShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return MONTH_SHORT.format(d).replace('.', '');
}

export function formatWeekday(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return WEEKDAY.format(d);
}

export function formatDayNumber(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getDate();
}

export function durationToISO8601(hours: number): string {
  return `PT${hours}H`;
}

export function pluralizePl(n: number, singular: string, plural2to4: string, plural5plus: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return singular;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return plural2to4;
  return plural5plus;
}

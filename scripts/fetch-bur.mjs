// Synchronizacja usług i terminów z Bazy Usług Rozwojowych (API Publiczne BUR).
//
// UWIERZYTELNIANIE
// API wymaga tokenu JWT. Token uzyskujemy przez POST /autoryzacja/logowanie,
// wysyłając nazwę użytkownika BUR i klucz autoryzacyjny generowany w profilu
// („Dostęp do API"). Oba przekazujemy przez zmienne środowiskowe:
//   BUR_API_USER  — nazwa użytkownika BUR
//   BUR_API_KEY   — klucz autoryzacyjny
// W GitHub Actions trzymamy je w repository secrets. Klucz działa wyłącznie
// po stronie builda i nie trafia do przeglądarki ani do repozytorium.
//
// ZACHOWANIE PRZY BŁĘDZIE
// Brak danych dostępowych albo błąd API NIE przerywa builda — zostają ostatnie
// pobrane dane, a w interfejsie działa fallback „Zapytaj o termin".
//
// TRYB PODGLĄDU
//   node scripts/fetch-bur.mjs --probe
// pobiera dane i wypisuje surową odpowiedź bez zapisywania pliku.

import fs from 'node:fs';
import path from 'node:path';

const API = process.env.BUR_API_BASE || 'https://uslugirozwojowe.parp.gov.pl/api';
const USER = process.env.BUR_API_USER;
const KEY = process.env.BUR_API_KEY;
const PROVIDER_ID = process.env.BUR_PROVIDER_ID || '199788';
const OUT_FILE = path.resolve('src/data/bur-services.json');
const PROBE = process.argv.includes('--probe');
const TIMEOUT_MS = 30000;

/** Odstęp między zapytaniami — API zwraca 429 przy zbyt szybkim odpytywaniu. */
const THROTTLE_MS = Number(process.env.BUR_THROTTLE_MS || 350);
const MAX_RETRIES = 4;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Statusy usług, których nie pokazujemy. API zwraca je wersalikami. */
const VISIBLE_STATUSES = ['OPUBLIKOWANA'];

/** Ile dni wstecz jeszcze pokazujemy usługę (bufor na rozliczenia). */
const KEEP_PAST_DAYS = 1;

function readExisting() {
  try {
    return JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function writeOut(data) {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

/** Kończy pracę bez błędu, zostawiając ostatnie znane dane. */
function bail(reason) {
  console.warn(`[bur] ${reason}`);
  const existing = readExisting();
  if (existing?.services?.length) {
    console.warn(`[bur] Zostawiam poprzednie dane: ${existing.services.length} usług(i).`);
  } else {
    console.warn('[bur] Brak danych — w UI zadziała fallback "Zapytaj o termin".');
    if (!existing) writeOut({ fetchedAt: null, providerId: PROVIDER_ID, services: [] });
  }
  process.exit(0);
}

async function request(pathname, opts = {}) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const r = await rawRequest(pathname, opts);
    // 429 = przekroczony limit zapytań, 5xx = chwilowy błąd po stronie API
    if (r.status !== 429 && r.status < 500) return r;
    if (attempt === MAX_RETRIES) return r;
    const wait = THROTTLE_MS * Math.pow(2, attempt + 1);
    console.warn(`[bur] HTTP ${r.status} na ${pathname} — ponawiam za ${wait} ms`);
    await sleep(wait);
  }
  return rawRequest(pathname, opts);
}

async function rawRequest(pathname, { method = 'GET', body, token } = {}) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API}${pathname}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: ac.signal,
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* odpowiedź nie jest JSON-em */
    }
    return { ok: res.ok, status: res.status, json, text };
  } finally {
    clearTimeout(timer);
  }
}

async function login() {
  const r = await request('/autoryzacja/logowanie', {
    method: 'POST',
    body: { nazwaUzytkownika: USER, kluczAutoryzacyjny: KEY },
  });
  if (!r.ok || !r.json?.token) {
    // Nie logujemy treści odpowiedzi w całości — mogłaby zawierać dane wrażliwe.
    bail(`Logowanie do API nie powiodło się (HTTP ${r.status}). Sprawdź BUR_API_USER i BUR_API_KEY.`);
  }
  return r.json.token;
}

/** Pobiera wszystkie strony z endpointu zwracającego {lista, wszystkieElementy}. */
async function fetchAllPages(pathname, token, label) {
  const out = [];
  for (let page = 1; page <= 50; page++) {
    const sep = pathname.includes('?') ? '&' : '?';
    await sleep(THROTTLE_MS);
    const r = await request(`${pathname}${sep}strona=${page}`, { token });
    if (!r.ok) {
      console.warn(`[bur] ${label}: HTTP ${r.status} na stronie ${page} — przerywam pobieranie.`);
      break;
    }
    const list = r.json?.lista ?? [];
    out.push(...list);
    const total = r.json?.wszystkieElementy ?? out.length;
    if (out.length >= total || list.length === 0) break;
  }
  return out;
}

/** Kwoty w API są liczbami całkowitymi w groszach. */
function money(v) {
  return typeof v === 'number' ? v / 100 : null;
}

function serviceUrl(id) {
  return `https://uslugirozwojowe.parp.gov.pl/wyszukiwarka/uslugi/podglad?id=${id}`;
}

async function main() {
  if (!USER || !KEY) {
    bail('Brak BUR_API_USER lub BUR_API_KEY — pomijam synchronizację z BUR.');
  }

  const token = await login();
  console.log('[bur] Zalogowano, pobieram usługi dostawcy…');

  const raw = await fetchAllPages(`/dostawca-uslug/${PROVIDER_ID}/usluga`, token, 'usługi');
  if (raw.length === 0) bail('API nie zwróciło żadnej usługi dla tego dostawcy.');
  console.log(`[bur] Pobrano ${raw.length} usług(i).`);

  if (PROBE) {
    console.log('[bur] Przykładowy rekord:');
    console.log(JSON.stringify(raw[0], null, 2).slice(0, 2500));
    const statuses = [...new Set(raw.map((s) => s.status))];
    console.log('[bur] Statusy w danych:', statuses.join(', '));
    console.log('\n[bur] Tryb --probe: nie zapisuję pliku.');
    return;
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - KEEP_PAST_DAYS);
  cutoff.setHours(0, 0, 0, 0);

  const visible = raw
    .filter((s) => VISIBLE_STATUSES.includes(String(s.status).toUpperCase()))
    .filter((s) => {
      const end = s.dataZakonczeniaUslugi ? new Date(s.dataZakonczeniaUslugi) : null;
      return !end || end >= cutoff;
    })
    .sort((a, b) => String(a.dataRozpoczeciaUslugi).localeCompare(String(b.dataRozpoczeciaUslugi)));

  console.log(`[bur] Aktualnych (opublikowane, niezakończone): ${visible.length}.`);

  // Harmonogram pobieramy tylko dla usług aktualnych — to on daje realne terminy.
  const services = [];
  let done = 0;
  for (const s of visible) {
    if (++done % 20 === 0) console.log(`[bur]   …${done}/${visible.length}`);
    let schedule = [];
    try {
      schedule = await fetchAllPages(`/usluga/${s.id}/harmonogram`, token, `harmonogram ${s.id}`);
    } catch {
      /* brak harmonogramu nie dyskwalifikuje usługi */
    }
    services.push({
      id: String(s.id),
      numer: s.numer ?? null,
      title: s.tytul ?? null,
      status: s.status ?? null,
      startDate: s.dataRozpoczeciaUslugi ?? null,
      endDate: s.dataZakonczeniaUslugi ?? null,
      recruitmentEnd: s.dataZakonczeniaRekrutacji ?? null,
      funded: Boolean(s.czyUslugaDofinansowana),
      priceNetPerParticipant: money(s.cenaNettoZaUczestnika),
      priceGrossPerParticipant: money(s.cenaBruttoZaUczestnika),
      hoursTotal: s.liczbaGodzin ?? null,
      seatsMin: s.minimalnaLiczbaUczestnikow ?? null,
      seatsMax: s.maksymalnaLiczbaUczestnikow ?? null,
      url: serviceUrl(s.id),
      schedule: schedule.map((h) => ({
        date: h.data ?? null,
        from: h.godzinaRozpoczecia ?? null,
        to: h.godzinaZakonczenia ?? null,
        topic: h.temat ?? null,
        type: h.typAktywnosci ?? null,
      })),
    });
  }

  writeOut({
    fetchedAt: new Date().toISOString(),
    providerId: PROVIDER_ID,
    services,
  });

  const withSchedule = services.filter((s) => s.schedule.length > 0).length;
  console.log(
    `[bur] Zapisano ${services.length} usług(i) (${withSchedule} z harmonogramem) do ${path.relative(process.cwd(), OUT_FILE)}`
  );
}

main().catch((e) => bail(`Nieoczekiwany błąd: ${e.message}`));

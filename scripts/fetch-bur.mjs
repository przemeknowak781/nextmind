// Synchronizacja terminów z Bazy Usług Rozwojowych (BUR).
//
// Uruchamiane przed buildem. Pobiera usługi naszego profilu dostawcy z API BUR
// i zapisuje je do src/data/bur-services.json, skąd czytają je strony Astro.
//
// KLUCZ API
// ---------
// API BUR jest read-only i wymaga klucza autoryzacyjnego, który generuje się
// w profilu użytkownika BUR (sekcja "Dostęp do API"). Klucz przekazujemy przez
// zmienną środowiskową BUR_API_KEY — w GitHub Actions jako repository secret.
// Klucz NIGDY nie trafia do repozytorium ani do kodu wysyłanego do przeglądarki:
// skrypt działa wyłącznie po stronie builda.
//
// ZACHOWANIE BEZ KLUCZA
// ---------------------
// Brak klucza lub błąd API NIE przerywa builda. Skrypt zostawia wtedy ostatnie
// znane dane (albo pusty zestaw) i kończy się kodem 0. Dzięki temu strona
// zawsze się zbuduje, a w UI zadziała fallback "Zapytaj o termin".
//
// TRYB ROZPOZNANIA SCHEMATU
// -------------------------
// Pola odpowiedzi API mapujemy przez FIELD_CANDIDATES — listę możliwych nazw.
// Po dodaniu klucza uruchom `node scripts/fetch-bur.mjs --probe`, żeby zobaczyć
// surową odpowiedź i potwierdzić mapowanie bez zapisywania pliku.

import fs from 'node:fs';
import path from 'node:path';

const API_BASE = process.env.BUR_API_BASE || 'https://uslugirozwojowe.parp.gov.pl/api';
const API_KEY = process.env.BUR_API_KEY;
const PROVIDER_ID = process.env.BUR_PROVIDER_ID || '199788';
const OUT_FILE = path.resolve('src/data/bur-services.json');
const PROBE = process.argv.includes('--probe');
const TIMEOUT_MS = 20000;

/** Możliwe nazwy pól w odpowiedzi API — bierzemy pierwszą, która istnieje. */
const FIELD_CANDIDATES = {
  id: ['id', 'idUslugi', 'serviceId', 'uslugaId'],
  title: ['tytul', 'title', 'nazwa', 'nazwaUslugi'],
  startDate: ['dataRozpoczecia', 'startDate', 'dataOd', 'terminRozpoczecia'],
  endDate: ['dataZakonczenia', 'endDate', 'dataDo'],
  price: ['cena', 'price', 'cenaNetto'],
  seats: ['liczbaMiejsc', 'seats', 'liczbaUczestnikow'],
};

function pick(obj, candidates) {
  for (const key of candidates) {
    if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function serviceUrl(id) {
  return `https://uslugirozwojowe.parp.gov.pl/wyszukiwarka/uslugi/podglad?id=${id}`;
}

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
  const existing = readExisting();
  console.warn(`[bur] ${reason}`);
  if (existing?.services?.length) {
    console.warn(`[bur] Zostawiam poprzednie dane: ${existing.services.length} usług(i).`);
  } else {
    console.warn('[bur] Brak danych — w UI zadziała fallback "Zapytaj o termin".');
    if (!existing) writeOut({ fetchedAt: null, source: 'brak', services: [] });
  }
  process.exit(0);
}

async function request(pathname) {
  const url = `${API_BASE}${pathname}`;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'X-API-KEY': API_KEY,
      },
      signal: ac.signal,
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text, url };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  if (!API_KEY) {
    bail('Brak zmiennej BUR_API_KEY — pomijam synchronizację z BUR.');
  }

  // Ścieżkę listy usług potwierdzamy przy pierwszym uruchomieniu z kluczem
  // (dokumentacja API: https://uslugirozwojowe.parp.gov.pl/api/).
  const candidates = [
    `/uslugi?dostawcaId=${PROVIDER_ID}`,
    `/uslugi?idDostawcy=${PROVIDER_ID}`,
    `/services?providerId=${PROVIDER_ID}`,
  ];

  let payload = null;
  let usedUrl = null;

  for (const c of candidates) {
    let r;
    try {
      r = await request(c);
    } catch (e) {
      console.warn(`[bur] ${c} — błąd sieci: ${e.message}`);
      continue;
    }
    if (!r.ok) {
      console.warn(`[bur] ${c} — HTTP ${r.status}`);
      continue;
    }
    try {
      payload = JSON.parse(r.text);
      usedUrl = r.url;
      break;
    } catch {
      console.warn(`[bur] ${c} — odpowiedź nie jest JSON-em`);
    }
  }

  if (!payload) {
    bail('Żaden ze znanych endpointów nie zwrócił poprawnych danych.');
  }

  if (PROBE) {
    console.log('[bur] Endpoint:', usedUrl);
    console.log('[bur] Surowa odpowiedź (pierwsze 4000 znaków):');
    console.log(JSON.stringify(payload, null, 2).slice(0, 4000));
    console.log('\n[bur] Tryb --probe: nie zapisuję pliku.');
    return;
  }

  const rows = Array.isArray(payload)
    ? payload
    : payload.items || payload.content || payload.data || payload.uslugi || [];

  if (!Array.isArray(rows) || rows.length === 0) {
    bail('API odpowiedziało, ale nie znalazłem listy usług w odpowiedzi.');
  }

  const services = rows
    .map((row) => {
      const id = pick(row, FIELD_CANDIDATES.id);
      if (id === undefined) return null;
      return {
        id: String(id),
        title: pick(row, FIELD_CANDIDATES.title) ?? null,
        startDate: pick(row, FIELD_CANDIDATES.startDate) ?? null,
        endDate: pick(row, FIELD_CANDIDATES.endDate) ?? null,
        price: pick(row, FIELD_CANDIDATES.price) ?? null,
        seats: pick(row, FIELD_CANDIDATES.seats) ?? null,
        url: serviceUrl(id),
      };
    })
    .filter(Boolean);

  if (services.length === 0) {
    bail('Nie udało się zmapować żadnej usługi — sprawdź FIELD_CANDIDATES przez --probe.');
  }

  writeOut({
    fetchedAt: new Date().toISOString(),
    source: usedUrl,
    providerId: PROVIDER_ID,
    services,
  });

  console.log(`[bur] Zapisano ${services.length} usług(i) do ${path.relative(process.cwd(), OUT_FILE)}`);
}

main().catch((e) => bail(`Nieoczekiwany błąd: ${e.message}`));

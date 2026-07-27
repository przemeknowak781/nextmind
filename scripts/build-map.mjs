#!/usr/bin/env node
// Wyciąga kontury województw z mapy SVG do pliku danych używanego przez
// komponent PolandMap.astro.
//
// Źródło: POL_location_map.svg — mapa konturowa Polski z 16 ścieżkami, po jednej
// na województwo. Ścieżki w pliku nie mają nazw (id="path1312" itd.), więc
// przypisanie do województw wynika z kolejności w pliku; kolejność potwierdzono,
// renderując mapę z podpisami i porównując z podziałem administracyjnym.
//
// Skrypt uruchamiamy ręcznie po podmianie mapy:  node scripts/build-map.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'POL_location_map.svg';
const OUT = 'src/data/poland-map.json';

/** Kolejność ścieżek w pliku źródłowym — od południowego wschodu ku północy. */
const ORDER = [
  'podkarpackie',
  'malopolskie',
  'slaskie',
  'opolskie',
  'dolnoslaskie',
  'swietokrzyskie',
  'lubelskie',
  'lodzkie',
  'mazowieckie',
  'wielkopolskie',
  'lubuskie',
  'kujawsko-pomorskie',
  'podlaskie',
  'zachodniopomorskie',
  'warminsko-mazurskie',
  'pomorskie',
];

const svg = readFileSync(SRC, 'utf8');

const viewBox = (() => {
  const w = /\bwidth="(\d+)"/.exec(svg);
  const h = /\bheight="(\d+)"/.exec(svg);
  return { width: Number(w?.[1] ?? 497), height: Number(h?.[1] ?? 463) };
})();

const paths = svg.match(/<path\b[\s\S]*?\/>/g) ?? [];
if (paths.length !== ORDER.length) {
  throw new Error(`Oczekiwano ${ORDER.length} ścieżek, znaleziono ${paths.length}.`);
}

const regions = {};
paths.forEach((tag, i) => {
  const d = /\sd="([^"]+)"/.exec(tag)?.[1];
  if (!d) throw new Error(`Ścieżka ${i} nie ma atrybutu d.`);
  const nums = d.match(/-?\d+\.?\d*/g).map(Number);
  const xs = nums.filter((_, k) => k % 2 === 0);
  const ys = nums.filter((_, k) => k % 2 === 1);
  regions[ORDER[i]] = {
    // Kontur w jednej linii — bez łamania, żeby nie puchł HTML.
    d: d.replace(/\s+/g, ' ').trim(),
    // Środek chmury punktów — punkt zaczepienia etykiety. Dla wszystkich
    // szesnastu województw wypada wewnątrz konturu (sprawdzone wizualnie).
    cx: Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10,
    cy: Math.round((ys.reduce((a, b) => a + b, 0) / ys.length) * 10) / 10,
  };
});

writeFileSync(OUT, `${JSON.stringify({ viewBox, regions }, null, 2)}\n`);
console.log(`✓ ${OUT} — ${Object.keys(regions).length} województw.`);

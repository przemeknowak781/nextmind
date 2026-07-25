// Strażnik treści — przerywa build, jeśli w źródłach zostały placeholdery.
//
// Powód: link "Zapisz się przez BUR" trafił na produkcję z adresem
// ?id=DO_UZUPELNIENIA, a numer telefonu widniał jako +48 000 000 000.
// Takie rzeczy trudno wychwycić wzrokiem, więc pilnuje ich build.
//
// Uruchamiane w `npm run build` przed `astro build`.
// Świadomy wyjątek oznaczamy komentarzem `placeholder-ok` w tej samej linii.

import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['src', 'public'];
const EXTS = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.json', '.mdx', '.md', '.svg', '.html']);

const RULES = [
  // Tylko forma tokenu (wersaliki / podkreślnik) — żeby nie łapać zwykłych
  // polskich zwrotów w rodzaju "zwrot do uzupełnienia".
  { re: /DO_UZUPELNIENIA|DO[_ ]UZUPEŁNIENIA|\bUZUPELNIJ\b/, msg: 'znacznik do uzupełnienia' },
  { re: /\+48[\s-]?0{3}[\s-]?0{3}[\s-]?0{3}/, msg: 'zastępczy numer telefonu' },
  { re: /\blorem ipsum\b/i, msg: 'tekst zastępczy lorem ipsum' },
  { re: /\b(TODO|FIXME|HACK)\b/, msg: 'znacznik roboczy' },
  { re: /\bTBD\b|\bTBA\b/, msg: 'znacznik "do ustalenia"' },
  { re: /example\.(com|org)|foo@bar|test@test/i, msg: 'przykładowy adres' },
  { re: /\bXXX+\b/, msg: 'znacznik XXX' },
];

/** Wzorce, które wyglądają jak placeholder, ale są poprawną treścią. */
const ALLOW = [
  /placeholder=/, // atrybut HTML w formularzach
  /placeholder-white/, // klasa Tailwind
  /placeholder:/, // wariant Tailwind
  /placeholder-ok/, // świadomy wyjątek
  /::placeholder/, // selektor CSS
];

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.astro'].includes(e.name)) continue;
      walk(fp, out);
    } else if (EXTS.has(path.extname(e.name))) {
      out.push(fp);
    }
  }
  return out;
}

const findings = [];

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (ALLOW.some((a) => a.test(line))) return;
      for (const rule of RULES) {
        if (rule.re.test(line)) {
          findings.push({ file, line: i + 1, msg: rule.msg, text: line.trim().slice(0, 120) });
          break;
        }
      }
    });
  }
}

if (findings.length > 0) {
  console.error(`\n✖ Znaleziono ${findings.length} placeholder(ów) w treści:\n`);
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line} — ${f.msg}`);
    console.error(`    ${f.text}\n`);
  }
  console.error('Uzupełnij treść albo oznacz świadomy wyjątek komentarzem "placeholder-ok".\n');
  process.exit(1);
}

console.log('✓ Brak placeholderów w treści.');

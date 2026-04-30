// Funding calculator — pure logic, used by client component

export type EntityType =
  | 'mikro-jdg' // mikroprzedsiębiorca, JDG
  | 'mikro' // mikro firma 2-9
  | 'male' // małe MŚP 10-49
  | 'srednie' // średnie MŚP 50-249
  | 'duze' // duże 250+
  | 'pracownik'; // pracownik MŚP

export type Mechanism = 'kfs-prio-3' | 'kfs-inny' | 'psf' | 'fers';

export interface CalcInput {
  entity: EntityType;
  mechanism: Mechanism;
  voivodeship: string;
  basePrice: number;
}

export interface CalcResult {
  base: number;
  coverage: number; // 0-1
  subsidy: number;
  outOfPocket: number;
  vatExempt: boolean;
  notes: string[];
  mechanismLabel: string;
}

const COVERAGE_MATRIX: Record<EntityType, Partial<Record<Mechanism, number>>> = {
  'mikro-jdg': { 'kfs-prio-3': 1.0, 'kfs-inny': 1.0, psf: 0.85, fers: 0.8 },
  mikro:       { 'kfs-prio-3': 0.9, 'kfs-inny': 0.8, psf: 0.85, fers: 0.8 },
  male:        { 'kfs-prio-3': 0.8, 'kfs-inny': 0.8, psf: 0.8, fers: 0.8 },
  srednie:     { 'kfs-prio-3': 0.8, 'kfs-inny': 0.8, psf: 0.8, fers: 0.8 },
  duze:        { 'kfs-prio-3': 0.8, 'kfs-inny': 0.8, psf: 0.5, fers: 0.5 },
  pracownik:   { psf: 0.8, fers: 0.8 },
};

const VOIV_BONUSES: Record<string, Partial<Record<Mechanism, number>>> = {
  malopolskie: { psf: 0.1, fers: 0.05 }, // up to +10pp for PSF in Małopolska
  dolnoslaskie: { psf: 0.0 }, // standard
  // others — default
};

const MECHANISM_LABELS: Record<Mechanism, string> = {
  'kfs-prio-3': 'KFS Priorytet 3 (umiejętności cyfrowe + AI)',
  'kfs-inny': 'KFS — inny priorytet',
  'psf': 'PSF — operator regionalny',
  'fers': 'FERS — Akademia HR (PARP)',
};

export const VOIVODESHIPS = [
  'dolnoslaskie',
  'kujawsko-pomorskie',
  'lubelskie',
  'lubuskie',
  'lodzkie',
  'malopolskie',
  'mazowieckie',
  'opolskie',
  'podkarpackie',
  'podlaskie',
  'pomorskie',
  'slaskie',
  'swietokrzyskie',
  'warminsko-mazurskie',
  'wielkopolskie',
  'zachodniopomorskie',
] as const;

export const VOIV_LABELS: Record<typeof VOIVODESHIPS[number], string> = {
  dolnoslaskie: 'dolnośląskie',
  'kujawsko-pomorskie': 'kujawsko-pomorskie',
  lubelskie: 'lubelskie',
  lubuskie: 'lubuskie',
  lodzkie: 'łódzkie',
  malopolskie: 'małopolskie',
  mazowieckie: 'mazowieckie',
  opolskie: 'opolskie',
  podkarpackie: 'podkarpackie',
  podlaskie: 'podlaskie',
  pomorskie: 'pomorskie',
  slaskie: 'śląskie',
  swietokrzyskie: 'świętokrzyskie',
  'warminsko-mazurskie': 'warmińsko-mazurskie',
  wielkopolskie: 'wielkopolskie',
  zachodniopomorskie: 'zachodniopomorskie',
};

export const ENTITIES: { value: EntityType; label: string; hint: string }[] = [
  { value: 'mikro-jdg', label: 'JDG / Mikroprzedsiębiorca', hint: 'Działalność gospodarcza, do 9 osób' },
  { value: 'mikro', label: 'Mikro firma (2–9 osób)', hint: 'Spółka mikro' },
  { value: 'male', label: 'Mała firma (10–49 osób)', hint: 'MŚP' },
  { value: 'srednie', label: 'Średnia firma (50–249 osób)', hint: 'MŚP' },
  { value: 'duze', label: 'Duża firma (250+ osób)', hint: 'Spoza MŚP' },
  { value: 'pracownik', label: 'Pracownik MŚP', hint: 'Wniosek przez pracodawcę' },
];

export const MECHANISMS_FOR_ENTITY: Record<EntityType, Mechanism[]> = {
  'mikro-jdg': ['kfs-prio-3', 'kfs-inny', 'psf'],
  mikro:       ['kfs-prio-3', 'kfs-inny', 'psf'],
  male:        ['kfs-prio-3', 'kfs-inny', 'psf', 'fers'],
  srednie:     ['kfs-prio-3', 'kfs-inny', 'psf', 'fers'],
  duze:        ['kfs-prio-3', 'kfs-inny'],
  pracownik:   ['psf', 'fers'],
};

export function calculateFunding(input: CalcInput): CalcResult {
  const matrix = COVERAGE_MATRIX[input.entity];
  let coverage = matrix[input.mechanism] ?? 0;
  const voivBonus = VOIV_BONUSES[input.voivodeship]?.[input.mechanism] ?? 0;
  coverage = Math.min(1, coverage + voivBonus);

  const subsidy = Math.round(input.basePrice * coverage);
  const outOfPocket = input.basePrice - subsidy;
  const vatExempt = coverage >= 0.7;

  const notes: string[] = [];
  if (coverage === 0) {
    notes.push('Ten mechanizm nie jest dostępny dla wybranego podmiotu — wybierz inny.');
  }
  if (vatExempt) {
    notes.push('Pokrycie ≥70% — szkolenie zwolnione z VAT (art. 43 ust. 1 pkt 29 ustawy o VAT).');
  } else if (coverage > 0) {
    notes.push('Pokrycie <70% — VAT 23% naliczany standardowo.');
  }
  if (input.mechanism === 'kfs-prio-3' && input.entity === 'mikro-jdg') {
    notes.push('Mikroprzedsiębiorca w Priorytecie 3 — możliwe pokrycie do 100% w wybranych PUP.');
  }
  if (voivBonus > 0) {
    notes.push(`Bonus regionalny: +${Math.round(voivBonus * 100)} p.p. dla wybranego województwa.`);
  }

  return {
    base: input.basePrice,
    coverage,
    subsidy,
    outOfPocket,
    vatExempt,
    notes,
    mechanismLabel: MECHANISM_LABELS[input.mechanism],
  };
}

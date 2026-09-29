// src/lib/projectDisclosure.ts
// What a project may show wherever it appears
// (docs/superpowers/specs/2026-09-29-project-page-design.md, "Consent and rand amounts").
// Clients may not want their costs published, so no rand amount, or price in
// cents, shows unless "Show rand amounts" records that the client agreed. The
// project queries leave out the client's name and the project value while
// their switches are off (src/lib/queries.ts). While "Show rand amounts" is
// off, discloseProject() drops any results figure, System row or calculation
// input that looks like a rand amount or a price in cents, whole. The Studio's
// warnings use isRandAmount() too (sanity/schemaTypes/projectRules.ts), so this
// module keeps to type-only imports.
import type { ProjectMetric, ProjectResult } from '@/types/sanity';

// An R straight before a number, with or without spaces ("R1.5M", "R 450 000",
// "R7/kWh"). A letter before the R means it ends a word ("PR2"), so that doesn't count.
const R_BEFORE_NUMBER = /(^|[^A-Za-z])R\s*\d/;
// R as the unit in brackets: "(R)", "(R/kWh)", "(R'000)", "(R m)", "(R, excl. VAT)",
// and the short forms "(Rm)", "(Rbn)" and "(Rk)". Only a space, "/", an apostrophe,
// a comma or the closing bracket may follow, so "(R&D)" doesn't count.
const R_UNIT_IN_BRACKETS = /\(R(?:k|m|bn)?[\s/'\u2019,)]/;
// R per unit: "R/kWh", "2.10 R/kWh", "R / year". A letter before the R means it ends
// a word, so that doesn't count.
const R_PER_UNIT = /(^|[^A-Za-z])R\s*\/\s*[A-Za-z]/;
// Thousands of rands, "R'000", with a straight or a curly apostrophe.
const R_THOUSANDS = /(^|[^A-Za-z])R['\u2019]\d/;
// An R straight after a number, or after k, m or bn: "450 000 R", "1.2m R", "1.5 bn R".
// A letter or "&" after the R means it starts a word ("3 Rooftops", "12 R&D projects"),
// so that doesn't count.
const R_AFTER_NUMBER = /\d\s*(?:[kKmM]|[bB][nN])?\s*R(?![A-Za-z&])/;
// "ZAR" on its own or straight before a number ("ZAR1.5m").
const ZAR = /\bZAR(?![A-Za-z])/i;
// The currency's name: "1.5 million rand", "2 million Rands".
const RAND_WORD = /\brands?\b/i;
// Cents per kWh, straight after a number, with or without a space, written as
// a slash or "per": "180c/kWh", "180 c/kWh", "95c per kWh", "1.5c/kWh". A
// capital "C" is Celsius or a battery C-rating ("25°C", "5C rating"), not
// cents, and "Class 3c" and "c-Si" have no "/kWh" or "per kWh" to follow, so
// the lower-case "c" alone never counts.
const CENTS_PER_UNIT = /\d\s*c\s*(?:\/\s*kWh|per\s+kWh)/;
// Cents as a label's unit, no number attached: "Tariff (c/kWh)", "Energy charge (c/kWh)".
const CENTS_UNIT_IN_BRACKETS = /\(c\s*\/\s*kWh\)/;
// Cents per unit without brackets, as a label with no number attached:
// "Tariff c/kWh", "Rate c/kWh", "c/kWh". A letter before the "c" means it
// ends a word, so that doesn't count, matching R_PER_UNIT's rule for "R".
const CENTS_PER_UNIT_LABEL = /(^|[^A-Za-z])c\s*\/\s*kWh/;
// The word "cents" spelled out, after a number: "95 cents a unit", "12 cents".
const CENTS_WORD = /\d\s*cents\b/i;
// R or cents written out as "per" a unit, with no number and no slash:
// "R per kWh", "Rate: c per kWh". A letter before the R or the c means it ends
// a word ("Solar per kWh"), and a capital C is never cents, so neither counts.
const PER_UNIT_WORDS = /(^|[^A-Za-z])[Rc]\s+per\s+kWh/;

const RAND_PATTERNS = [
  R_BEFORE_NUMBER, R_UNIT_IN_BRACKETS, R_PER_UNIT, R_THOUSANDS, R_AFTER_NUMBER, ZAR, RAND_WORD,
  CENTS_PER_UNIT, CENTS_UNIT_IN_BRACKETS, CENTS_PER_UNIT_LABEL, CENTS_WORD, PER_UNIT_WORDS,
];

/** True when the text looks like a rand amount, names rands as its unit, or is a price in cents (what the client pays, such as a tariff in c/kWh). */
export function isRandAmount(text: string | null | undefined): boolean {
  if (!text) return false;
  return RAND_PATTERNS.some((pattern) => pattern.test(text));
}

type Row = ProjectMetric & { note?: string | null };

/** The rows with both a label and a value. GROQ gives null for a field that isn't set. */
export function completeRows<R extends Row>(rows: readonly R[] | null | undefined): R[] {
  return (rows ?? []).filter((row) => Boolean(row?.label?.trim() && row?.value?.trim()));
}

/**
 * The rows that may show while "Show rand amounts" is off: complete ones whose
 * label, value and note (a results figure's) don't look like a rand amount. A
 * row is dropped whole, so a label never shows without its value.
 */
export function withoutRandAmounts<R extends Row>(rows: readonly R[] | null | undefined): R[] {
  return completeRows(rows).filter((row) => !isRandAmount(row.label) && !isRandAmount(row.value) && !isRandAmount(row.note));
}

type WithFigures = {
  showRandAmounts?: boolean | null;
  results?: ProjectResult[] | null;
  metrics?: ProjectMetric[] | null;
  resultsInputs?: ProjectMetric[] | null;
};

/**
 * A project, or a card, as it may show. With "Show rand amounts" on, its figures
 * show as written, empty rows aside. With it off, or unset, any results figure,
 * System row or calculation input that looks like a rand amount is dropped. A
 * card has no calculation inputs and gets none.
 */
export function discloseProject<T extends WithFigures>(item: T): T {
  const randsAllowed = item.showRandAmounts === true;
  const keep = <R extends Row>(rows: readonly R[] | null | undefined): R[] => (randsAllowed ? completeRows(rows) : withoutRandAmounts(rows));
  // Only the lists change, and they keep their element types, so this is still a T.
  return {
    ...item,
    results: keep(item.results),
    metrics: keep(item.metrics),
    ...('resultsInputs' in item ? { resultsInputs: keep(item.resultsInputs) } : {}),
  } as T;
}

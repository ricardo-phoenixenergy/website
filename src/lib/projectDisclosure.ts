// src/lib/projectDisclosure.ts
// What a project may show wherever it appears
// (docs/superpowers/specs/2026-09-29-project-page-design.md, "Consent and rand amounts").
// Clients may not want their costs published, so no rand amount shows until the
// CMS records that the client agreed. That switch ("Show rand amounts") comes
// with the step 2 CMS fields; until then it counts as off. The project queries
// already leave out the client's name and the project value (src/lib/queries.ts).
// This drops any results figure or System row that looks like a rand amount,
// label and value together.
import type { ProjectMetric } from '@/types/sanity';

// An R straight before a number, with or without spaces ("R1.5M", "R 450 000",
// "R7/kWh"). A letter before the R means it ends a word ("PR2"), so that doesn't count.
const R_BEFORE_NUMBER = /(^|[^A-Za-z])R\s*\d/;
// "(R)" as a unit, as in "Annual savings (R)".
const R_UNIT = /\(R\)/;
// "ZAR" on its own or straight before a number ("ZAR1.5m").
const ZAR = /\bZAR(?![A-Za-z])/i;
// The currency's name: "1.5 million rand", "2 million Rands".
const RAND_WORD = /\brands?\b/i;

/** True when the text looks like a rand amount, or names rands as its unit. */
export function isRandAmount(text: string | null | undefined): boolean {
  if (!text) return false;
  return R_BEFORE_NUMBER.test(text) || R_UNIT.test(text) || ZAR.test(text) || RAND_WORD.test(text);
}

/** The rows that may show: none empty, and none whose label or value looks like a rand amount. */
export function withoutRandAmounts(rows: readonly ProjectMetric[] | null | undefined): ProjectMetric[] {
  return (rows ?? []).filter(
    (row) =>
      Boolean(row?.label?.trim() && row?.value?.trim()) && !isRandAmount(row.label) && !isRandAmount(row.value),
  );
}

type WithFigures = { results?: ProjectMetric[] | null; metrics?: ProjectMetric[] | null };

/** A project, or a card, with rand amounts cleared from its results and System rows. */
export function discloseProject<T extends WithFigures>(item: T): T {
  // Only the two lists change, and they keep their element type, so this is still a T.
  return { ...item, results: withoutRandAmounts(item.results), metrics: withoutRandAmounts(item.metrics) } as T;
}

// src/lib/projectResults.ts
// How a project's results are labelled. Figures count as measured only when an
// editor marks them so in Sanity; anything else is a projection, because the
// numbers on today's case studies come from the financial model.
import type { ResultsBasis } from '@/types/sanity';

/** The note under projected results when the editor hasn't written their own. */
export const PROJECTED_RESULTS_NOTE =
  'Projections from our financial model for this site, not measured results. Actual figures depend on energy use, weather and future tariffs.';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function isMeasured(basis: ResultsBasis | null | undefined): boolean {
  return basis === 'measured';
}

/** "30 June 2026" from a Sanity date (YYYY-MM-DD); null for anything else. No locale data needed. */
export function formatAsOf(iso: string | null | undefined): string | null {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${day} ${MONTHS[month - 1]} ${m[1]}`;
}

export interface ResultsLabelling {
  heading: 'Projected results' | 'Measured results';
  /** Formatted as-of date, when one is set. */
  asOf: string | null;
  /** The editor's note, else the default note for projections; none for measured results without one. */
  note: string | null;
}

export function describeResults(project: {
  resultsBasis?: ResultsBasis | null;
  resultsAsOf?: string | null;
  resultsAssumptions?: string | null;
}): ResultsLabelling {
  const measured = isMeasured(project.resultsBasis);
  const own = project.resultsAssumptions?.trim();
  return {
    heading: measured ? 'Measured results' : 'Projected results',
    asOf: formatAsOf(project.resultsAsOf),
    note: own || (measured ? null : PROJECTED_RESULTS_NOTE),
  };
}

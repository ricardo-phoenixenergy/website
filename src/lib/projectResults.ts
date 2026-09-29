// src/lib/projectResults.ts
// How a project's results are labelled. Figures count as measured only when an
// editor marks them so in Sanity and the project is completed: a project still
// being built or planned has nothing to measure yet. Anything else is a
// projection, because the numbers on today's project pages come from the
// financial model.
import type { ProjectStatus, ResultsBasis } from '@/types/sanity';

/** The note under projected results when the editor hasn't written their own. */
export const PROJECTED_RESULTS_NOTE =
  'Projections from our financial model for this site, not measured results. Actual figures depend on energy use, weather and future tariffs.';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function isMeasured(basis: ResultsBasis | null | undefined, status: ProjectStatus | null | undefined): boolean {
  return basis === 'measured' && status === 'completed';
}

/** A Sanity date (YYYY-MM-DD) as its parts, or null for anything else. */
function parseSanityDate(iso: string | null | undefined): { year: string; month: number; day: number } | null {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year: m[1], month, day };
}

/** "30 June 2026" from a Sanity date (YYYY-MM-DD); null for anything else. No locale data needed. */
export function formatAsOf(iso: string | null | undefined): string | null {
  const date = parseSanityDate(iso);
  return date ? `${date.day} ${MONTHS[date.month - 1]} ${date.year}` : null;
}

/** "June 2026" from a Sanity date (YYYY-MM-DD), as the commissioning date shows; null for anything else. */
export function formatMonthYear(iso: string | null | undefined): string | null {
  const date = parseSanityDate(iso);
  return date ? `${MONTHS[date.month - 1]} ${date.year}` : null;
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
  status?: ProjectStatus | null;
}): ResultsLabelling {
  const measured = isMeasured(project.resultsBasis, project.status);
  const own = project.resultsAssumptions?.trim();
  return {
    heading: measured ? 'Measured results' : 'Projected results',
    asOf: formatAsOf(project.resultsAsOf),
    note: own || (measured ? null : PROJECTED_RESULTS_NOTE),
  };
}

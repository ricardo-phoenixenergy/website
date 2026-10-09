// sanity/schemaTypes/projectRules.ts
// The checks behind the project schema's Studio warnings (project.ts). Not a
// schema type: plain functions, so vitest can test them. Each returns what a
// Sanity custom validator returns, true when all is well or the message to show.

/** The document being edited, as a custom validator's context gives it. */
type ProjectDocument = Record<string, unknown> | undefined;

export const HERO_WIDTH_WARNING = 'Photos under 2400px wide look soft on large screens.';
export const RESULTS_COUNT_WARNING = 'Only the first four results show. Remove the rows after the fourth.';
export const SYSTEM_ROWS_WARNING = 'Use 2 to 4 rows. Phones show the first two before the rest of the facts.';
export const COMMISSIONED_FUTURE_WARNING =
  'This date is still to come, but the status is Completed. Check the date, or set the status to In progress or Planned.';

/** Photos narrower than this look soft across a large screen. */
export const MIN_HERO_WIDTH = 2400;

/** The width in an image asset's id ("image-<hash>-4000x2250-jpg"), or null. */
export function widthFromAssetRef(ref: unknown): number | null {
  if (typeof ref !== 'string') return null;
  const match = ref.match(/^image-[A-Za-z0-9]+-(\d+)x\d+-[A-Za-z0-9]+$/);
  return match ? Number(match[1]) : null;
}

/** A warning for a hero photo under 2400px wide. No photo, or a size that can't be read, passes. */
export function heroWidthWarning(value: unknown): true | string {
  const ref = (value as { asset?: { _ref?: unknown } } | null | undefined)?.asset?._ref;
  const width = widthFromAssetRef(ref);
  return width !== null && width < MIN_HERO_WIDTH ? HERO_WIDTH_WARNING : true;
}

const count = (value: unknown): number => (Array.isArray(value) ? value.length : 0);

/** A warning above four results: the card shows four. */
export function resultsCountWarning(value: unknown): true | string {
  return count(value) > 4 ? RESULTS_COUNT_WARNING : true;
}

/** A warning outside two to four System rows. */
export function systemRowsWarning(value: unknown): true | string {
  const rows = count(value);
  return rows < 2 || rows > 4 ? SYSTEM_ROWS_WARNING : true;
}

/** A date as the Studio's date field writes it, "2026-06-12", for the day given, in the editor's own time zone. */
function studioDate(day: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;
}

/**
 * The completion date (stored as commissionedOn): a warning only for a date
 * after today on a completed project. A planned or in-progress project's date
 * is the day it's due, so any date passes there, and no date passes anywhere.
 * Dates in the Studio's form compare as strings.
 */
export function commissionedWarning(value: unknown, document: ProjectDocument, today: Date = new Date()): true | string {
  if (document?.status !== 'completed' || typeof value !== 'string') return true;
  return value > studioDate(today) ? COMMISSIONED_FUTURE_WARNING : true;
}

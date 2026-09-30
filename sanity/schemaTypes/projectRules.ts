// sanity/schemaTypes/projectRules.ts
// The checks behind the project schema's Studio warnings (project.ts). Not a
// schema type: plain functions, so vitest can test them. Each returns what a
// Sanity custom validator returns, true when all is well or the message to show.
// The rand-amount rule is the site's own (src/lib/projectDisclosure.ts),
// imported by a relative path: Next bundles the embedded Studio and would
// resolve "@/", but the Sanity CLI reads no tsconfig paths, and a relative path
// works for both. That module's only other import is a type.
import { isRandAmount, isRandRow } from '../../src/lib/projectDisclosure';

/** The document being edited, as a custom validator's context gives it. */
type ProjectDocument = Record<string, unknown> | undefined;

export const RAND_WARNING =
  "This looks like a rand amount, but 'Show rand amounts' is off. Remove it, or turn the switch on once the client agrees.";
export const CLIENT_NAME_WARNING =
  "This names the client, but 'Show client name' is off or has no consent date. Remove the name, or record the client's written consent.";
export const ROW_DROPPED_WARNING = "This row looks like a rand amount, so it won't show while 'Show rand amounts' is off. Reword it, or turn the switch on once the client agrees.";
export const HERO_WIDTH_WARNING = 'Photos under 2400px wide look soft on large screens.';
export const RESULTS_COUNT_WARNING = 'Only the first four results show. Remove the rows after the fourth.';
export const SYSTEM_ROWS_WARNING = 'Use 2 to 4 rows. Phones show the first two before the rest of the facts.';
export const MEASURED_WARNING = 'Results read as measured only on a completed project. Until then the page labels them projected.';
export const AS_OF_WARNING = 'Add the date of the model, or the end of the measured period.';
export const INPUTS_WARNING = "Add the inputs behind the figures. Without them the page has no 'How we calculated this'.";
export const COMMISSIONED_WARNING =
  'Add the commissioning date. Without it the page shows the completion date text, and the project is listed by the date it was added here.';
export const CONSENT_DATE_ERROR = "Add the date of the client's written consent.";

/** Photos narrower than this look soft across a large screen. */
export const MIN_HERO_WIDTH = 2400;

/** The words of a string, or of Portable Text's text blocks, one block per line. Anything else has none. */
export function proseText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (!Array.isArray(value)) return '';
  return value
    .map((block: unknown) => {
      const { _type, children } = (block ?? {}) as { _type?: unknown; children?: unknown };
      if (_type !== 'block' || !Array.isArray(children)) return '';
      return children
        .map((child: unknown) => {
          const text = (child as { text?: unknown } | null)?.text;
          return typeof text === 'string' ? text : '';
        })
        .join('');
    })
    .filter(Boolean)
    .join('\n');
}

/** True when the text holds the client's name, in any case. A name under three letters never matches, so a stray initial can't. */
function namesClient(text: string, clientName: unknown): boolean {
  if (typeof clientName !== 'string') return false;
  const name = clientName.trim().toLowerCase();
  return name.length >= 3 && text.toLowerCase().includes(name);
}

/** A date as the Studio's date field writes it and the project queries read it: "2026-06-12". */
const STUDIO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isStudioDate = (value: unknown): boolean => typeof value === 'string' && STUDIO_DATE.test(value);

/**
 * True only when the client's name may show: "Show client name" on, and a
 * consent date in the form the Studio writes (2026-06-12). That is the test
 * the queries apply (src/lib/queries.ts, CLIENT_NAME_WITH_CONSENT), so an
 * import or API write of "" or "TBC" keeps the name hidden on the site and
 * keeps the Studio's warnings on.
 */
export function nameMayShow(document: ProjectDocument): boolean {
  return document?.showClientName === true && isStudioDate(document?.clientConsentOn);
}

/**
 * Text the site shows as written: the title, the site type, the location, the
 * completion date, the summary, the story, the headlines, the results note and
 * figure notes, each approval, each equipment brand and model, alt text,
 * captions and the search description. A warning while it holds a rand amount
 * and "Show rand amounts" is off, or the client's name before the name may show.
 */
export function proseWarning(value: unknown, document: ProjectDocument): true | string {
  const text = proseText(value);
  if (!text.trim()) return true;
  if (document?.showRandAmounts !== true && isRandAmount(text)) return RAND_WARNING;
  if (!nameMayShow(document) && namesClient(text, document?.clientName)) return CLIENT_NAME_WARNING;
  return true;
}

/**
 * The slug, which every link to the page shows: a warning when it names the
 * client before the name may show, its hyphens read as spaces, so
 * "example-client-warehouse" names "Example Client". A slug can't hold a rand
 * amount, so only the name is checked.
 */
export function slugWarning(value: unknown, document: ProjectDocument): true | string {
  const current = (value as { current?: unknown } | null | undefined)?.current;
  if (typeof current !== 'string' || !current.trim()) return true;
  return !nameMayShow(document) && namesClient(current.replace(/-/g, ' '), document?.clientName) ? CLIENT_NAME_WARNING : true;
}

/** A row's label, value and note, each only when it's a string, as the page reads them. */
function rowText(value: unknown): { label?: string; value?: string; note?: string } {
  const row = (value ?? {}) as { label?: unknown; value?: unknown; note?: unknown };
  const text = (field: unknown): string | undefined => (typeof field === 'string' ? field : undefined);
  return { label: text(row.label), value: text(row.value), note: text(row.note) };
}

/**
 * A results figure, System row or calculation input. The page drops a row
 * whose label, value or note looks like a rand amount while "Show rand
 * amounts" is off (isRandRow(), the page's own test), so the row warns that it
 * won't show. Otherwise it warns when the row names the client before the name
 * may show.
 */
export function rowWarning(value: unknown, document: ProjectDocument): true | string {
  const row = rowText(value);
  if (document?.showRandAmounts !== true && isRandRow(row)) return ROW_DROPPED_WARNING;
  const texts = [row.label, row.value, row.note].filter((text): text is string => Boolean(text));
  if (!nameMayShow(document) && texts.some((text) => namesClient(text, document?.clientName))) return CLIENT_NAME_WARNING;
  return true;
}

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

/** A warning for "Measured" on a project that isn't completed: the page would call them projected. */
export function measuredWarning(value: unknown, document: ProjectDocument): true | string {
  return value === 'measured' && document?.status !== 'completed' ? MEASURED_WARNING : true;
}

/** A warning for results without an as-of date. */
export function asOfWarning(value: unknown, document: ProjectDocument): true | string {
  return count(document?.results) > 0 && !value ? AS_OF_WARNING : true;
}

/** A warning for results without calculation inputs. */
export function inputsWarning(value: unknown, document: ProjectDocument): true | string {
  return count(document?.results) > 0 && count(value) === 0 ? INPUTS_WARNING : true;
}

/** A warning for a completed project without a commissioning date. */
export function commissionedWarning(value: unknown, document: ProjectDocument): true | string {
  return document?.status === 'completed' && !value ? COMMISSIONED_WARNING : true;
}

/**
 * An error, which stops publishing, for "Show client name" on without a
 * consent date the query can read: empty, or written through the API or an
 * import as "TBC" or "12 June 2026" rather than the Studio's 2026-06-12.
 */
export function consentDateError(value: unknown, document: ProjectDocument): true | string {
  return document?.showClientName === true && !isStudioDate(value) ? CONSENT_DATE_ERROR : true;
}

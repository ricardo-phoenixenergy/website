// sanity/schemaTypes/projectRules.ts
// The checks behind the project schema's Studio warnings (project.ts). Not a
// schema type: plain functions, so vitest can test them. Each returns what a
// Sanity custom validator returns, true when all is well or the message to show.
// The rand-amount rule is the site's own (src/lib/projectDisclosure.ts),
// imported by a relative path: Next bundles the embedded Studio and would
// resolve "@/", but the Sanity CLI reads no tsconfig paths, and a relative path
// works for both. That module's only other import is a type.
import { isRandAmount } from '../../src/lib/projectDisclosure';

/** The document being edited, as a custom validator's context gives it. */
type ProjectDocument = Record<string, unknown> | undefined;

export const RAND_WARNING =
  "This looks like a rand amount, but 'Show rand amounts' is off. Remove it, or turn the switch on once the client agrees.";
export const CLIENT_NAME_WARNING =
  "This names the client, but 'Show client name' is off or has no consent date. Remove the name, or record the client's written consent.";
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

/**
 * Prose the site shows as written (the summary, the story, the headlines, the
 * results note and figure notes, alt text, captions and the search
 * description): a warning while it holds a rand amount and "Show rand amounts"
 * is off, or the client's name before the name may show, which takes both
 * "Show client name" and the consent date.
 */
export function proseWarning(value: unknown, document: ProjectDocument): true | string {
  const text = proseText(value);
  if (!text.trim()) return true;
  if (document?.showRandAmounts !== true && isRandAmount(text)) return RAND_WARNING;
  const nameMayShow = document?.showClientName === true && Boolean(document?.clientConsentOn);
  if (!nameMayShow && namesClient(text, document?.clientName)) return CLIENT_NAME_WARNING;
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

/** An error, which stops publishing, for "Show client name" on without the consent date. */
export function consentDateError(value: unknown, document: ProjectDocument): true | string {
  return document?.showClientName === true && !value ? CONSENT_DATE_ERROR : true;
}

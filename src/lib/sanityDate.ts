// src/lib/sanityDate.ts
// A Sanity date field's value ("2026-06-12") in words, without locale data:
// "12 June 2026" for a company stat's "As at" line, "June 2026" for a
// project's completion date.

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** A Sanity date (YYYY-MM-DD) as its parts, or null for anything else. */
function parseSanityDate(iso: string | null | undefined): { year: string; month: number; day: number } | null {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year: m[1], month, day };
}

/** "30 June 2026" from a Sanity date (YYYY-MM-DD); null for anything else. */
export function formatAsOf(iso: string | null | undefined): string | null {
  const date = parseSanityDate(iso);
  return date ? `${date.day} ${MONTHS[date.month - 1]} ${date.year}` : null;
}

/** "June 2026" from a Sanity date (YYYY-MM-DD), as a project's completion date shows; null for anything else. */
export function formatMonthYear(iso: string | null | undefined): string | null {
  const date = parseSanityDate(iso);
  return date ? `${MONTHS[date.month - 1]} ${date.year}` : null;
}

// src/lib/parseAmount.ts

/**
 * Why typed text isn't a usable amount, so the message can name the actual
 * problem instead of one catch-all:
 * - `empty`: nothing typed;
 * - `negative`: a minus sign in front of a number;
 * - `units`: a number followed by letters, such as "250 kWp";
 * - `decimals`: more decimal places than the field takes, such as "10.24" for kWp;
 * - `format`: anything else that doesn't read as a number ("abc", "1.2.3", "1e5").
 */
export type AmountIssue = 'empty' | 'negative' | 'units' | 'decimals' | 'format';

export type AmountReading = { ok: true; value: number } | { ok: false; issue: AmountIssue };

/**
 * Reads what people actually type: "82.8", "82,8" (decimal comma), "10 000"
 * or "10,000" (thousands). Anything else is refused with its reason, so a typo
 * never silently becomes a different number.
 */
export function readAmount(raw: string, decimals = 2): AmountReading {
  let s = raw.trim().replace(/\s/g, '');
  if (s === '') return { ok: false, issue: 'empty' };

  // A unit after the number ("250kWp", "12kw"): the field already shows the unit.
  const withUnit = /^([\d.,]*\d[\d.,]*)[a-z]+$/i.exec(s);
  if (withUnit) return { ok: false, issue: readAmount(withUnit[1], Infinity).ok ? 'units' : 'format' };

  const negative = s.startsWith('-');
  if (negative) s = s.slice(1);

  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma > -1 && lastDot > -1) {
    // Both present: the later one is the decimal separator.
    s = lastComma > lastDot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else if (lastComma > -1) {
    // "10,000" is thousands; "10,24" is a decimal comma.
    s = /^\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.');
  }

  const number = /^\d+(?:\.(\d+))?$/.exec(s);
  if (!number) return { ok: false, issue: 'format' };
  if (negative) return { ok: false, issue: 'negative' };
  if ((number[1]?.length ?? 0) > decimals) return { ok: false, issue: 'decimals' };
  return { ok: true, value: Number(s) };
}

/** The number, or NaN when the text isn't one (see `readAmount` for why). */
export function parseAmount(raw: string, decimals = 2): number {
  const reading = readAmount(raw, decimals);
  return reading.ok ? reading.value : NaN;
}

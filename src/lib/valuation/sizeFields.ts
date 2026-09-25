// src/lib/valuation/sizeFields.ts
// The valuation request's three size fields, and what each says when its value
// can't be used: one message per actual problem, never a catch-all that tells
// someone who typed "10.24" to enter a number above 0.
import type { AmountIssue } from '@/lib/parseAmount';

export type SizeField = 'kw' | 'inverterKw' | 'kWh';

interface SizeSpec {
  unit: string;
  /** Decimal places accepted. */
  decimals: 1 | 2;
  max: number;
  /** A whole number, for the "number only" message. */
  whole: string;
  /** Values the field accepts, for the other messages. */
  examples: string;
}

export const SIZE_FIELDS: Record<SizeField, SizeSpec> = {
  kw: { unit: 'kWp', decimals: 1, max: 10000, whole: '250', examples: '250 or 82.8' }, // 10 MW
  inverterKw: { unit: 'kW', decimals: 1, max: 10000, whole: '100', examples: '100' },
  kWh: { unit: 'kWh', decimals: 2, max: 20000, whole: '120', examples: '120 or 10.24' }, // 20 MWh
};

const DECIMALS_RULE: Record<SizeSpec['decimals'], string> = {
  1: 'Use up to one decimal place, for example 82.8.',
  2: 'Use up to two decimal places, for example 10.24.',
};

/**
 * The message for a size field, or undefined when its value is usable. `issue`
 * is why the typed text didn't read as a number (null when it did); empty and
 * negative entries, like zero, get "above 0".
 */
export function sizeMessage(field: SizeField, value: number, issue: AmountIssue | null): string | undefined {
  const spec = SIZE_FIELDS[field];
  if (issue === 'units') return `Enter the number only, without the unit, for example ${spec.whole}.`;
  if (issue === 'decimals') return DECIMALS_RULE[spec.decimals];
  if (issue === 'format') return `Enter a number, for example ${spec.examples}.`;
  if (issue || !Number.isFinite(value) || value <= 0) return `Enter a number above 0, for example ${spec.examples}.`;
  if (value > spec.max) return `That's above ${spec.max.toLocaleString('en-ZA')} ${spec.unit}. For larger portfolios, contact us directly.`;
  return undefined;
}

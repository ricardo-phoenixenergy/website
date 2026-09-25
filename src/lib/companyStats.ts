import type { CompanyStat } from '@/types/sanity';
import { formatAsOf } from '@/lib/projectResults';

/**
 * Fallback stats — used when the `companyStats` singleton is empty or Sanity
 * is unreachable. Kept here (no server imports) so client components can use
 * it as a default prop without pulling the Sanity client into their bundle.
 * These differ from the figures in Sanity; the claims register
 * (docs/content/claims-register.md) lists the differences for the business.
 */
export const DEFAULT_COMPANY_STATS: CompanyStat[] = [
  { value: '10 MWp + 8 MWh', label: 'Installed & under development' },
  { value: '6', label: 'Ecosystem partners' },
  { value: '40', label: 'Projects completed' },
  { value: '10', label: 'Projects under development' },
];

/** "As at 30 June 2026" when an editor has dated the stat in Sanity; null otherwise. */
export function statAsOfCaption(stat: CompanyStat): string | null {
  const date = formatAsOf(stat.asOf);
  return date ? `As at ${date}` : null;
}

/** Drops malformed entries and falls back to defaults when nothing usable remains. */
export function resolveCompanyStats(stats?: CompanyStat[] | null): CompanyStat[] {
  const clean = (stats ?? []).filter((s) => s?.value && s?.label);
  return clean.length > 0 ? clean : DEFAULT_COMPANY_STATS;
}

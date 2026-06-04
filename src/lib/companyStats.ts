import type { CompanyStat } from '@/types/sanity';

/**
 * Fallback stats — used when the `companyStats` singleton is empty or Sanity
 * is unreachable. Kept here (no server imports) so client components can use
 * it as a default prop without pulling the Sanity client into their bundle.
 */
export const DEFAULT_COMPANY_STATS: CompanyStat[] = [
  { value: '10 MWp + 8 MWh', label: 'Installed & under development' },
  { value: '6', label: 'Ecosystem partners' },
  { value: '40', label: 'Projects completed' },
  { value: '10', label: 'Projects under development' },
];

/** Drops malformed entries and falls back to defaults when nothing usable remains. */
export function resolveCompanyStats(stats?: CompanyStat[] | null): CompanyStat[] {
  const clean = (stats ?? []).filter((s) => s?.value && s?.label);
  return clean.length > 0 ? clean : DEFAULT_COMPANY_STATS;
}

import { sanityServerClient } from '@/lib/sanity.server';
import { COMPANY_STATS_QUERY } from '@/lib/queries';
import { resolveCompanyStats } from '@/lib/companyStats';
import type { CompanyStat } from '@/types/sanity';

/**
 * Server-side fetch for the `companyStats` singleton. Always returns 1+ stats —
 * falls back to DEFAULT_COMPANY_STATS when the doc is empty or Sanity errors.
 */
export async function getCompanyStats(): Promise<CompanyStat[]> {
  try {
    const result = await sanityServerClient.fetch<{ stats?: CompanyStat[] }>(COMPANY_STATS_QUERY);
    return resolveCompanyStats(result?.stats);
  } catch {
    return resolveCompanyStats(null);
  }
}

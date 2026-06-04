import { sanityServerClient } from '@/lib/sanity.server';
import { HOW_IT_WORKS_QUERY } from '@/lib/queries';
import type { HowItWorksContent } from '@/types/sanity';

/**
 * Fetches the How It Works content for a page (key = 'home' or a solution
 * vertical slug). Returns null when the document is missing, has no title, or
 * has no steps - the page then hides the section. Never throws.
 */
export async function getHowItWorks(pageKey: string): Promise<HowItWorksContent | null> {
  try {
    const data = await sanityServerClient.fetch<HowItWorksContent | null>(
      HOW_IT_WORKS_QUERY,
      { id: `howItWorks.${pageKey}` },
    );
    if (!data || !data.title || !Array.isArray(data.steps) || data.steps.length === 0) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

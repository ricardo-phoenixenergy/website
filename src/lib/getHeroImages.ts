import { sanityServerClient } from '@/lib/sanity.server';
import { HERO_IMAGES_QUERY } from '@/lib/queries';
import type { HeroImages } from '@/types/sanity';

/**
 * Fetches the per-vertical hero images. Returns a map keyed by vertical slug
 * ({ url, lqip } or null per vertical), or {} on error — callers then fall back
 * to the page gradient. Never throws.
 */
export async function getHeroImages(): Promise<HeroImages> {
  try {
    const data = await sanityServerClient.fetch<HeroImages | null>(HERO_IMAGES_QUERY);
    return data ?? {};
  } catch {
    return {};
  }
}

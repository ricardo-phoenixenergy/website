// src/lib/partnerData.ts
// A partner's logo from the CMS, for the partner bands. Null when the partner,
// its logo or the CMS is missing: the band then shows its words without it.
import { sanityServerClient } from '@/lib/sanity.server';
import { PARTNER_BY_NAME_QUERY } from '@/lib/queries';

interface PartnerRow {
  name: string;
  logo: { asset: { url: string; metadata?: { dimensions?: { width: number; height: number } } } } | null;
}

export interface PartnerLogo {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export async function getPartnerLogo(name: string): Promise<PartnerLogo | null> {
  try {
    const row = await sanityServerClient.fetch<PartnerRow | null>(PARTNER_BY_NAME_QUERY, { name });
    const asset = row?.logo?.asset;
    if (!asset?.url) return null;
    const dims = asset.metadata?.dimensions;
    return { url: asset.url, alt: `${name} logo`, width: dims?.width ?? 512, height: dims?.height ?? 512 };
  } catch {
    return null;
  }
}

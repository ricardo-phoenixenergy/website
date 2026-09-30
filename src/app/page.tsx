import type { Metadata } from 'next';
import { JsonLd } from '@/components/layout/JsonLd';
import { HeroAccordion } from '@/components/sections/HeroAccordion';
import { AboutTrust } from '@/components/sections/AboutTrust';
import { CompanyStats } from '@/components/sections/CompanyStats';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { LatestPosts } from '@/components/sections/LatestPosts';
import { PageFooter } from '@/components/layout/PageFooter';
import { sanityServerClient } from '@/lib/sanity.server';
import { PARTNERS_QUERY, PUBLISHED_POSTS_COUNT_QUERY } from '@/lib/queries';
import { getCompanyStats } from '@/lib/getCompanyStats';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { pageMetadata, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/seo';
import { websiteJsonLd } from '@/lib/structuredData';
import type { Partner } from '@/types/sanity';

// Safety-net ISR: refresh hourly even if the Sanity revalidate webhook isn't
// wired up, so partner/featured changes eventually appear without a redeploy.
export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  // 57 characters, inside the roughly 60 Google shows.
  title: SITE_TITLE,
  absoluteTitle: true,
  description: SITE_DESCRIPTION,
  path: '/',
  shareTitle: 'Phoenix Energy: Save, Earn & Grow with Renewable Energy',
  shareDescription: 'Six clean energy verticals. One partner. End-to-end solutions for Southern African businesses.',
});

export default async function HomePage() {
  let partners: Partner[] = [];
  try {
    partners = await sanityServerClient.fetch<Partner[]>(PARTNERS_QUERY);
  } catch {
    // Graceful fallback — renders empty
  }

  let hasPosts = false;
  try {
    hasPosts = (await sanityServerClient.fetch<number>(PUBLISHED_POSTS_COUNT_QUERY)) > 0;
  } catch {
    // Unknown: leave the search out rather than advertise an empty one
  }

  const companyStats = await getCompanyStats();
  const homeHowItWorks = await getHowItWorks('home');
  const heroImages = await getHeroImages();

  return (
    <>
      <JsonLd data={websiteJsonLd({ searchable: hasPosts })} />
      <div>
        <HeroAccordion heroImages={heroImages} />
        <CompanyStats stats={companyStats} />
        <AboutTrust partners={partners} showTabs={false} justify="center" flushTop />
        <FeaturedProjects flushTop />
        {/* How It Works and the footer both use the company-level CTA (src/config/ctas.ts) */}
        {homeHowItWorks && <HowItWorks {...homeHowItWorks} autoAdvanceInterval={2600} />}
        <LatestPosts flushTop />
        <PageFooter ctaVariant="centered" />
      </div>
    </>
  );
}

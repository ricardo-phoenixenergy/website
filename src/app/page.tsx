import type { Metadata } from 'next';
import { HeroAccordion } from '@/components/sections/HeroAccordion';
import { AboutTrust } from '@/components/sections/AboutTrust';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { LatestPosts } from '@/components/sections/LatestPosts';
import { StatsStrip } from '@/components/ui/StatsStrip';
import { PageFooter } from '@/components/layout/PageFooter';
import { sanityServerClient } from '@/lib/sanity.server';
import { PARTNERS_QUERY } from '@/lib/queries';
import { getCompanyStats } from '@/lib/getCompanyStats';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import type { Partner } from '@/types/sanity';

// Safety-net ISR: refresh hourly even if the Sanity revalidate webhook isn't
// wired up, so partner/featured changes eventually appear without a redeploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Phoenix Energy — Integrated Clean Energy Solutions for SA Businesses',
  description:
    'C&I solar, wheeling, carbon credits, EV fleets and more. Get a free energy assessment from Phoenix Energy today.',
  alternates: { canonical: 'https://phoenixenergy.solutions' },
  openGraph: {
    title: 'Phoenix Energy — Save, Earn & Grow with Renewable Energy',
    description:
      'Six clean energy verticals. One partner. End-to-end solutions for Southern African businesses.',
    url: 'https://phoenixenergy.solutions',
    siteName: 'Phoenix Energy',
    images: [
      {
        url: 'https://phoenixenergy.solutions/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Phoenix Energy — Clean Energy Solutions for Southern Africa',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phoenix Energy — Save, Earn & Grow with Renewable Energy',
    description:
      'Six clean energy verticals. One partner. End-to-end solutions for Southern African businesses.',
    images: ['https://phoenixenergy.solutions/og-default.png'],
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Phoenix Energy',
  url: 'https://phoenixenergy.solutions',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://phoenixenergy.solutions/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default async function HomePage() {
  let partners: Partner[] = [];
  try {
    partners = await sanityServerClient.fetch<Partner[]>(PARTNERS_QUERY);
  } catch {
    // Graceful fallback — renders empty
  }

  const companyStats = await getCompanyStats();
  const homeHowItWorks = await getHowItWorks('home');
  const heroImages = await getHeroImages();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <main>
        <HeroAccordion heroImages={heroImages} />
        <AboutTrust partners={partners} showTabs={false} justify="center" />
        <StatsStrip stats={companyStats} responsive />
        <FeaturedProjects />
        {homeHowItWorks && <HowItWorks {...homeHowItWorks} autoAdvanceInterval={2600} />}
        <LatestPosts />
        <PageFooter ctaVariant="centered" />
      </main>
    </>
  );
}

import type { Metadata } from 'next';
import { HeroAccordion } from '@/components/sections/HeroAccordion';
import { AboutTrust } from '@/components/sections/AboutTrust';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { LatestPosts } from '@/components/sections/LatestPosts';
import { PageFooter } from '@/components/layout/PageFooter';
import { sanityClient } from '@/lib/sanity';
import { PARTNERS_QUERY } from '@/lib/queries';
import type { Partner } from '@/types/sanity';

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

const HOME_HIW_STEPS = [
  {
    label: 'Free assessment',
    description: 'We visit your site and model three solution scenarios at no cost, no obligation.',
    tag: 'No cost · No obligation',
  },
  {
    label: 'Proposal & financing',
    description: 'Full ROI model, payback period, and financing options delivered in 5 business days.',
    tag: 'Delivered in 5 days',
  },
  {
    label: 'Installation & beyond',
    description: 'Certified install in 8–12 weeks, then 24/7 monitoring with a 25-year warranty.',
    tag: '8–12 week commissioning',
  },
];

export default async function HomePage() {
  let partners: Partner[] = [];
  try {
    partners = await sanityClient.fetch<Partner[]>(PARTNERS_QUERY);
  } catch {
    // Graceful fallback — renders empty
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <main>
        <HeroAccordion />
        <AboutTrust partners={partners} showTabs={false} justify="center" />
        <HowItWorks
          title="Your path to energy <em>independence</em>"
          steps={HOME_HIW_STEPS}
          autoAdvanceInterval={2600}
          showCTA={false}
        />
        <FeaturedProjects />
        <LatestPosts />
        <PageFooter />
      </main>
    </>
  );
}

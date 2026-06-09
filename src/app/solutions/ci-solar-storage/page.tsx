// src/app/solutions/ci-solar-storage/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { StrategyFinder } from '@/components/sections/StrategyFinder';
import { FinancingBand } from '@/components/sections/FinancingBand';
import { strategyTabs } from '@/config/strategies';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';

const vertical = 'ci-solar-storage' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}`, images: [{ url: 'https://phoenixenergy.solutions/og-solutions-ci-solar.png', width: 1200, height: 630 }] },
};

export const revalidate = 3600;


export default async function CiSolarStoragePage() {
  const howItWorks = await getHowItWorks(vertical);
  const hero = (await getHeroImages())[vertical];
  const tabs = strategyTabs();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: meta.label,
    provider: { '@type': 'Organization', name: 'Phoenix Energy' },
    description: cfg.seoDescription,
    url: `https://phoenixenergy.solutions/solutions/${vertical}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SolutionHero
        title="Cut your electricity bill by <em>up to 60%</em>"
        subtitle="Commercial and industrial solar and battery storage — zero upfront capital with our PPA model."
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1a3a3f 50%, #2d5c63 100%)"
        primaryCta={{ label: 'Get a Free Assessment', href: '/contact' }}
        secondaryLink={{ label: 'Not sure what you need? Find your strategy ↓', href: '#strategy-finder' }}
      />
      <StrategyFinder vertical={vertical} />
      <SolutionTabs tabs={tabs} accent={meta.accent} vertical="ci-solar-storage" />
      <FinancingBand />
      {howItWorks && <HowItWorks {...howItWorks} />}
      <FeaturedProjects vertical={vertical} />
      <RelatedArticles vertical={vertical} />
      <PageFooter
        eyebrow="Start saving"
        heading="Cut your electricity bill — permanently"
        body="Get a free site assessment and energy yield simulation from our certified engineers. No commitment required — results delivered within 48 hours."
        primaryCta={{ label: 'Get a Free Assessment', href: '/contact' }}
        stats={[
          { value: '80+',   label: 'Solar installations' },
          { value: '48 MW', label: 'Peak capacity' },
          { value: '60%',   label: 'Avg bill reduction' },
          { value: 'R280M', label: 'Client savings' },
        ]}
      />
    </>
  );
}

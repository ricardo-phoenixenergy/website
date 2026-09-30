// src/app/solutions/ci-solar-storage/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageFooter } from '@/components/layout/PageFooter';
import { StrategyFinder } from '@/components/sections/StrategyFinder';
import { FinancingBand } from '@/components/sections/FinancingBand';
import { strategyTabs } from '@/config/strategies';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import { SERVICE_CTA } from '@/config/ctas';
import { pageMetadata } from '@/lib/seo';
import { serviceJsonLd, breadcrumbJsonLd, HOME_CRUMB } from '@/lib/structuredData';

const vertical = 'ci-solar-storage' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];
const cta = SERVICE_CTA[vertical];

export const metadata: Metadata = pageMetadata({
  title: cfg.seoTitle,
  absoluteTitle: true,
  description: cfg.seoDescription,
  path: meta.slug,
  image: cfg.shareImage,
});

export const revalidate = 3600;


export default async function CiSolarStoragePage() {
  const howItWorks = await getHowItWorks(vertical);
  const hero = (await getHeroImages())[vertical];
  const tabs = strategyTabs();

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: meta.label, description: cfg.seoDescription, path: meta.slug })} />
      <JsonLd data={breadcrumbJsonLd([HOME_CRUMB, { name: 'Solutions', path: '/solutions' }, { name: meta.label, path: meta.slug }])} />
      <SolutionHero
        title="Go solar with <em>zero upfront cost</em>"
        subtitle="We fund, install and maintain your commercial solar and battery system. You simply buy cleaner power at a lower rate from day one."
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1a3a3f 50%, #2d5c63 100%)"
        primaryCta={cta}
        wideRight
      >
        <StrategyFinder vertical={vertical} />
      </SolutionHero>
      <SolutionTabs
        tabs={tabs}
        accent={meta.accent}
        vertical="ci-solar-storage"
        eyebrow="The strategies"
        heading="Every strategy, <em>explained</em>"
        subtitle="Explore the ways to deploy solar and storage. Each is matched to a different goal, from pure savings to full energy independence."
      />
      <FinancingBand />
      {howItWorks && <HowItWorks {...howItWorks} cta={cta} accent={meta.accent} accentText={meta.accentText} flushTop />}
      <FeaturedProjects vertical={vertical} />
      <RelatedArticles vertical={vertical} />
      <PageFooter
        ctaVariant="centered"
        eyebrow="Start today"
        heading="Find your optimal energy strategy"
        body="Work with our engineers to identify the best energy strategy for your business. You'll receive a clear, data-driven roadmap to reduce costs and improve energy performance."
        primaryCta={cta}
      />
    </>
  );
}

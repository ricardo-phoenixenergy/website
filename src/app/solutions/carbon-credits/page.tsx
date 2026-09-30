// src/app/solutions/carbon-credits/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { ExplainerCards } from '@/components/sections/ExplainerCards';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageFooter } from '@/components/layout/PageFooter';
import { CarbonRevenueEstimator } from '@/components/sections/calculators/CarbonRevenueEstimator';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import { CARBON_CREDITS } from '@/config/carbonCreditsContent';
import { SERVICE_CTA } from '@/config/ctas';
import { pageMetadata } from '@/lib/seo';
import { serviceJsonLd, breadcrumbJsonLd, HOME_CRUMB } from '@/lib/structuredData';

const vertical = 'carbon-credits' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];
// "Check my eligibility": nothing is registered until we've checked the system.
const cta = SERVICE_CTA[vertical];

export const metadata: Metadata = pageMetadata({
  title: cfg.seoTitle,
  absoluteTitle: true,
  description: cfg.seoDescription,
  path: meta.slug,
  image: cfg.shareImage,
});

export const revalidate = 3600;

export default async function CarbonCreditsPage() {
  const howItWorks = await getHowItWorks(vertical);
  const hero = (await getHeroImages())[vertical];

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: meta.label, description: cfg.seoDescription, path: meta.slug })} />
      <JsonLd data={breadcrumbJsonLd([HOME_CRUMB, { name: 'Solutions', path: '/solutions' }, { name: meta.label, path: meta.slug }])} />

      {/* §1 — Hero + revenue estimator */}
      <SolutionHero
        title={CARBON_CREDITS.hero.title}
        subtitle={CARBON_CREDITS.hero.subtitle}
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #182a1a 50%, #2a4a28 100%)"
        primaryCta={cta}
      >
        <CarbonRevenueEstimator />
      </SolutionHero>

      {/* §2 — How carbon becomes revenue */}
      <ExplainerCards
        id="how-it-earns"
        background="white"
        eyebrow={CARBON_CREDITS.becomes.eyebrow}
        heading={CARBON_CREDITS.becomes.heading}
        subtitle={CARBON_CREDITS.becomes.subtitle}
        accent={meta.accent}
        columns={3}
        cards={CARBON_CREDITS.becomes.cards}
      />

      {/* §3 — Why your solar could be earning more */}
      <ExplainerCards
        id="opportunity"
        background="gray"
        eyebrow={CARBON_CREDITS.opportunity.eyebrow}
        heading={CARBON_CREDITS.opportunity.heading}
        subtitle={CARBON_CREDITS.opportunity.subtitle}
        accent={meta.accent}
        columns={3}
        cards={CARBON_CREDITS.opportunity.cards}
      />

      {/* §5 — From generation to payout (Sanity-driven) */}
      {howItWorks && <HowItWorks {...howItWorks} cta={cta} accent={meta.accent} accentText={meta.accentText} flushTop />}

      {/* §7 — FAQ */}
      <FaqAccordion
        id="faq"
        eyebrow="FAQ"
        heading={CARBON_CREDITS.faq.heading}
        items={CARBON_CREDITS.faq.items}
        accent={meta.accent}
      />

      {/* §8 — Proof + insights */}
      <FeaturedProjects vertical={vertical} flushTop />
      <RelatedArticles vertical={vertical} />

      {/* §9 — Final CTA */}
      <PageFooter
        ctaVariant="centered"
        eyebrow={CARBON_CREDITS.cta.eyebrow}
        heading={CARBON_CREDITS.cta.heading}
        body={CARBON_CREDITS.cta.body}
        primaryCta={cta}
      />
    </>
  );
}

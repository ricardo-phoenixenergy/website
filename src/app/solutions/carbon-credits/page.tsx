// src/app/solutions/carbon-credits/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { ExplainerCards } from '@/components/sections/ExplainerCards';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { CarbonRevenueEstimator } from '@/components/sections/calculators/CarbonRevenueEstimator';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import { CARBON_CREDITS } from '@/config/carbonCreditsContent';

const vertical = 'carbon-credits' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}`, images: [{ url: 'https://phoenixenergy.solutions/og-solutions-carbon-credits.png', width: 1200, height: 630 }] },
};

export const revalidate = 3600;

export default async function CarbonCreditsPage() {
  const howItWorks = await getHowItWorks(vertical);
  const hero = (await getHeroImages())[vertical];

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

      {/* §1 — Hero + revenue estimator */}
      <SolutionHero
        title={CARBON_CREDITS.hero.title}
        subtitle={CARBON_CREDITS.hero.subtitle}
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #182a1a 50%, #2a4a28 100%)"
        primaryCta={{ label: 'Book a Carbon Assessment', href: '/contact' }}
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

      {/* §4 — Why Phoenix */}
      <ExplainerCards
        id="why-phoenix"
        background="white"
        eyebrow={CARBON_CREDITS.whyPhoenix.eyebrow}
        heading={CARBON_CREDITS.whyPhoenix.heading}
        subtitle={CARBON_CREDITS.whyPhoenix.subtitle}
        accent={meta.accent}
        columns={3}
        cards={CARBON_CREDITS.whyPhoenix.cards}
      />

      {/* §5 — From generation to payout (Sanity-driven) */}
      {howItWorks && <HowItWorks {...howItWorks} accent={meta.accent} accentText={meta.accentText} />}

      {/* §7 — FAQ */}
      <FaqAccordion
        id="faq"
        eyebrow="FAQ"
        heading={CARBON_CREDITS.faq.heading}
        items={CARBON_CREDITS.faq.items}
        accent={meta.accent}
      />

      {/* §8 — Proof + insights */}
      <FeaturedProjects vertical={vertical} />
      <RelatedArticles vertical={vertical} />

      {/* §9 — Final CTA */}
      <PageFooter
        ctaVariant="centered"
        eyebrow={CARBON_CREDITS.cta.eyebrow}
        heading={CARBON_CREDITS.cta.heading}
        body={CARBON_CREDITS.cta.body}
        primaryCta={{ label: 'Book a Carbon Assessment', href: '/contact' }}
      />
    </>
  );
}

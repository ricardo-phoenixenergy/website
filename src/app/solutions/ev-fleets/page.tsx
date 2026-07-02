// src/app/solutions/ev-fleets/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { ExplainerCards } from '@/components/sections/ExplainerCards';
import { SolutionTabs, type TabItem } from '@/components/sections/SolutionTabs';
import { IndustryProofCard } from '@/components/sections/IndustryProofCard';
import { FinancingBand } from '@/components/sections/FinancingBand';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { FleetSavingsEstimator } from '@/components/sections/calculators/FleetSavingsEstimator';
import { CostPerKmBars } from '@/components/sections/CostPerKmBars';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import { EV_FLEETS } from '@/config/evFleetsContent';

const vertical = 'ev-fleets' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}`, images: [{ url: 'https://phoenixenergy.solutions/og-solutions-ev-fleets.png', width: 1200, height: 630 }] },
};

export const revalidate = 3600;

export default async function EvFleetsPage() {
  const howItWorks = await getHowItWorks(vertical);
  const hero = (await getHeroImages())[vertical];

  const industryTabs: TabItem[] = EV_FLEETS.industries.tabs.map((t) => ({
    key: t.key,
    label: t.label,
    icon: t.icon,
    iconBg: 'rgba(169,214,203,0.20)',
    title: t.title,
    body: t.body,
    bulletsLabel: 'Best suited for',
    bullets: t.bullets,
    imageBg: '',
    imageEmoji: '',
    diagram: t.proof
      ? <IndustryProofCard {...t.proof} accent={meta.accent} accentText={meta.accentText} />
      : undefined,
  }));

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

      {/* §1 — Hero + fleet savings estimator */}
      <SolutionHero
        title={EV_FLEETS.hero.title}
        subtitle={EV_FLEETS.hero.subtitle}
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #0f2a28 50%, #1a4040 100%)"
        primaryCta={{ label: 'Book a Fleet Assessment', href: '/contact' }}
      >
        <FleetSavingsEstimator />
      </SolutionHero>

      {/* §2 — Why now (SA) */}
      <ExplainerCards
        id="why-now"
        background="white"
        eyebrow={EV_FLEETS.whyNow.eyebrow}
        heading={EV_FLEETS.whyNow.heading}
        subtitle={EV_FLEETS.whyNow.subtitle}
        accent={meta.accent}
        columns={3}
        cards={EV_FLEETS.whyNow.cards}
      />

      {/* §3 — Four pillars */}
      <ExplainerCards
        id="the-package"
        background="gray"
        eyebrow={EV_FLEETS.pillars.eyebrow}
        heading={EV_FLEETS.pillars.heading}
        accent={meta.accent}
        columns={4}
        cards={EV_FLEETS.pillars.cards}
      />

      {/* §4 — Financing (centrepiece) */}
      <FinancingBand
        eyebrow={EV_FLEETS.financing.eyebrow}
        heading={EV_FLEETS.financing.heading}
        options={EV_FLEETS.financing.options}
        accent={meta.accent}
        accentText={meta.accentText}
      />
      <div className="bg-[#F5F5F5] pb-12 md:pb-[52px] -mt-2">
        <p className="page-container font-body text-[11px] text-[#6B7280]">{EV_FLEETS.financing.note}</p>
      </div>

      {/* §5 — Industries (tabs) + vehicles */}
      <SolutionTabs
        id="who-its-for"
        tabs={industryTabs}
        accent={meta.accent}
        vertical="ev-fleets"
        eyebrow={EV_FLEETS.industries.eyebrow}
        heading={EV_FLEETS.industries.heading}
        subtitle={EV_FLEETS.industries.subtitle}
      />

      {/* §6 — Cost per km */}
      <section className="bg-[#F5F5F5] py-16 md:py-24">
        <div className="page-container max-w-3xl">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: meta.accent }}>
            {EV_FLEETS.costPerKm.eyebrow}
          </p>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2] mb-8">
            {EV_FLEETS.costPerKm.heading}
          </h2>
          <CostPerKmBars accent={meta.accent} />
          <div className="mt-8 flex items-center gap-3">
            <span className="font-display font-extrabold text-3xl whitespace-nowrap" style={{ color: meta.accentText }}>
              {EV_FLEETS.costPerKm.statValue}
            </span>
            <span className="font-body text-sm text-[#6B7280] leading-snug">{EV_FLEETS.costPerKm.statLabel}</span>
          </div>
          <p className="font-body text-[11px] text-[#9CA3AF] mt-5 leading-relaxed">{EV_FLEETS.costPerKm.note}</p>
        </div>
      </section>

      {/* §7 — How it works (Sanity-driven) */}
      {howItWorks && <HowItWorks {...howItWorks} accent={meta.accent} accentText={meta.accentText} />}

      {/* §8 — Proof + FAQ */}
      <FeaturedProjects vertical={vertical} />
      <FaqAccordion
        id="faq"
        eyebrow="FAQ"
        heading={EV_FLEETS.faq.heading}
        items={EV_FLEETS.faq.items}
        accent={meta.accent}
      />
      <RelatedArticles vertical={vertical} />

      {/* §9 — Final CTA */}
      <PageFooter
        ctaVariant="centered"
        eyebrow={EV_FLEETS.cta.eyebrow}
        heading={EV_FLEETS.cta.heading}
        body={EV_FLEETS.cta.body}
        primaryCta={{ label: 'Book a Fleet Assessment', href: '/contact' }}
      />
    </>
  );
}

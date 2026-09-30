// src/app/solutions/webuysolar/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { ExplainerCards } from '@/components/sections/ExplainerCards';
import { ComparisonTable } from '@/components/sections/ComparisonTable';
import { PullQuote } from '@/components/sections/PullQuote';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageFooter } from '@/components/layout/PageFooter';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import { WEBUYSOLAR } from '@/config/webuysolarContent';
import { WEBUYSOLAR_OFFER } from '@/config/webuysolarOffer';
import { SERVICE_CTA, VALUATION_CTA } from '@/config/ctas';
import { pageMetadata } from '@/lib/seo';
import { serviceJsonLd, breadcrumbJsonLd, HOME_CRUMB } from '@/lib/structuredData';

const vertical = 'webuysolar' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];
// "Book a free WeBuySolar audit", prefilled; the valuation request is the tool (VALUATION_CTA).
const AUDIT_CTA = SERVICE_CTA[vertical];

export const metadata: Metadata = pageMetadata({
  title: cfg.seoTitle,
  absoluteTitle: true,
  description: cfg.seoDescription,
  path: meta.slug,
  image: cfg.shareImage,
});

export const revalidate = 3600;

export default async function WeBuySolarPage() {
  const hero = (await getHeroImages())[vertical];

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: 'Solar Asset Acquisition & Energy-as-a-Service', description: cfg.seoDescription, path: meta.slug })} />
      <JsonLd data={breadcrumbJsonLd([HOME_CRUMB, { name: 'Solutions', path: '/solutions' }, { name: meta.label, path: meta.slug }])} />

      {/* §1 — Hero */}
      <SolutionHero
        title={WEBUYSOLAR.hero.title}
        subtitle={WEBUYSOLAR.hero.subtitle}
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #1a0f00 0%, #3a2000 50%, #5a3a10 100%)"
        imagePosition="top"
        primaryCta={AUDIT_CTA}
        secondaryCta={VALUATION_CTA}
        ctaNote={WEBUYSOLAR_OFFER.eligibility}
      />

      {/* §3 — Why now */}
      <ExplainerCards
        id="why-now"
        background="white"
        eyebrow={WEBUYSOLAR.whyNow.eyebrow}
        heading={WEBUYSOLAR.whyNow.heading}
        subtitle={WEBUYSOLAR.whyNow.intro}
        accent={meta.accent}
        columns={3}
        cards={WEBUYSOLAR.whyNow.cards}
      />

      {/* §5 — Old vs new */}
      <ComparisonTable
        id="old-vs-new"
        heading={WEBUYSOLAR.comparison.heading}
        columns={WEBUYSOLAR.comparison.columns}
        rows={WEBUYSOLAR.comparison.rows}
        accent={meta.accent}
      />

      {/* §4 — Where value is lost */}
      <ExplainerCards
        id="value-lost"
        background="white"
        heading={WEBUYSOLAR.valueLost.heading}
        subtitle={WEBUYSOLAR.valueLost.intro}
        accent={meta.accent}
        columns={3}
        cards={WEBUYSOLAR.valueLost.cards}
        footer={<PullQuote accent={meta.accent}>{WEBUYSOLAR.valueLost.pullQuote}</PullQuote>}
      />

      {/* How it works — differentiator framing + 6-step process */}
      <HowItWorks
        eyebrow={WEBUYSOLAR.howItWorks.eyebrow}
        title={WEBUYSOLAR.howItWorks.title}
        accent={meta.accent}
        accentText={meta.accentText}
        steps={WEBUYSOLAR.howItWorks.steps}
        showCTA={false}
      />

      {/* Proof */}
      <FeaturedProjects vertical={vertical} />

      {/* Topical links */}
      <RelatedArticles vertical={vertical} />

      {/* FAQ (emits FAQPage JSON-LD) */}
      <FaqAccordion
        id="faq"
        eyebrow="FAQ"
        heading={WEBUYSOLAR.faq.heading}
        items={WEBUYSOLAR.faq.items}
        accent={meta.accent}
      />

      {/* Final CTA — audit deliverables + booking (dark band, matches other solutions pages) */}
      <PageFooter
        ctaVariant="deliverables"
        eyebrow="Start today"
        heading={WEBUYSOLAR.audit.heading}
        body={WEBUYSOLAR.audit.subtitle}
        primaryCta={AUDIT_CTA}
        deliverables={WEBUYSOLAR.audit.deliverables}
      />
    </>
  );
}

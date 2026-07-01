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
import { PageFooter } from '@/components/layout/PageFooter';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import { WEBUYSOLAR } from '@/config/webuysolarContent';

const vertical = 'webuysolar' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: {
    title: cfg.seoTitle,
    description: cfg.seoDescription,
    url: `https://phoenixenergy.solutions/solutions/${vertical}`,
    images: [{ url: 'https://phoenixenergy.solutions/og-solutions-webuysolar.png', width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;

const AUDIT_HREF = `/contact?intent=client&message=${encodeURIComponent(WEBUYSOLAR.auditPrefill)}`;

export default async function WeBuySolarPage() {
  const hero = (await getHeroImages())[vertical];
  const base = `https://phoenixenergy.solutions/solutions/${vertical}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://phoenixenergy.solutions/' },
        { '@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://phoenixenergy.solutions/solutions' },
        { '@type': 'ListItem', position: 3, name: meta.label, item: base },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Solar Asset Acquisition & Energy-as-a-Service',
      provider: { '@type': 'Organization', name: 'Phoenix Energy' },
      description: cfg.seoDescription,
      areaServed: 'ZA',
      url: base,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Phoenix Energy',
      url: 'https://phoenixenergy.solutions',
      logo: 'https://phoenixenergy.solutions/inverted-logo.svg',
      contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'info@phoenixenergy.solutions' },
    },
  ];

  return (
    <>
      {jsonLd.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}

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
        primaryCta={{ label: 'Book your free audit', href: AUDIT_HREF }}
        secondaryCta={{ label: "What's my system worth?", href: 'https://phoenixenergy.solutions/tools/solar-valuation' }}
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
        primaryCta={{ label: 'Arrange your free audit', href: AUDIT_HREF }}
        deliverables={WEBUYSOLAR.audit.deliverables}
      />
    </>
  );
}

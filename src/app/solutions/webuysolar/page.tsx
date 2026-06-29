// src/app/solutions/webuysolar/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { DealExchange } from '@/components/sections/DealExchange';
import { ExplainerCards } from '@/components/sections/ExplainerCards';
import { ComparisonTable } from '@/components/sections/ComparisonTable';
import { PullQuote } from '@/components/sections/PullQuote';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { IconCheck, IconArrowRight } from '@/components/ui/Icons';
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
        primaryCta={{ label: 'Book your free audit', href: AUDIT_HREF }}
        secondaryCta={{ label: 'See how the deal works', href: '#how-the-deal-works' }}
      >
        <DealExchange variant="compact" />
      </SolutionHero>

      {/* §1b — How the deal works */}
      <ExplainerCards
        id="how-the-deal-works"
        background="white"
        heading={WEBUYSOLAR.deal.heading}
        subtitle={WEBUYSOLAR.deal.intro}
        accent={meta.accent}
        columns={3}
        cards={WEBUYSOLAR.deal.winCards}
        lead={
          <div className="max-w-2xl mb-12">
            <DealExchange variant="full" />
          </div>
        }
      />

      {/* §3 — Why now */}
      <ExplainerCards
        id="why-now"
        background="gray"
        eyebrow={WEBUYSOLAR.whyNow.eyebrow}
        heading={WEBUYSOLAR.whyNow.heading}
        subtitle={WEBUYSOLAR.whyNow.intro}
        accent={meta.accent}
        columns={3}
        cards={WEBUYSOLAR.whyNow.cards}
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

      {/* §5 — Old vs new */}
      <ComparisonTable
        id="old-vs-new"
        heading={WEBUYSOLAR.comparison.heading}
        columns={WEBUYSOLAR.comparison.columns}
        rows={WEBUYSOLAR.comparison.rows}
        accent={meta.accent}
      />

      {/* §6 — What Phoenix does differently */}
      <ExplainerCards
        id="difference"
        background="white"
        heading={WEBUYSOLAR.difference.heading}
        subtitle={WEBUYSOLAR.difference.intro}
        accent={meta.accent}
        columns={4}
        cards={WEBUYSOLAR.difference.cards}
      />

      {/* §7 — Process */}
      <HowItWorks
        eyebrow="The process"
        title={WEBUYSOLAR.process.title}
        steps={WEBUYSOLAR.process.steps}
        showCTA={false}
      />

      {/* Proof */}
      <FeaturedProjects vertical={vertical} />

      {/* §8 — Audit deliverables + CTA */}
      <section id="audit" className="bg-white py-16 md:py-24">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2] mb-3">
                {WEBUYSOLAR.audit.heading}
              </h2>
              <p className="font-body text-sm md:text-base leading-[1.75] text-[#6B7280] mb-6">
                {WEBUYSOLAR.audit.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button variant="primary" href={AUDIT_HREF}>
                  Arrange your free audit <IconArrowRight size={14} />
                </Button>
                <Link
                  href="/tools/solar-asset-valuation"
                  className="font-body text-sm font-semibold inline-flex items-center gap-1.5 text-[#39575C] hover:text-[#2a4045] transition-colors"
                >
                  Try the solar asset valuation tool <IconArrowRight size={13} />
                </Link>
              </div>
            </div>

            <Card variant="light" pattern={3}>
              <div className="h-[3px]" style={{ background: meta.accent }} />
              <CardBody padding="lg">
                <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-3">
                  What you receive
                </p>
                <ul className="space-y-2.5">
                  {WEBUYSOLAR.audit.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 font-body text-sm font-semibold text-[#1A1A1A]">
                      <span className="mt-0.5 flex-shrink-0" style={{ color: '#39575C' }}>
                        <IconCheck size={16} />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Topical links */}
      <RelatedArticles vertical={vertical} />

      {/* §9 — FAQ (emits FAQPage JSON-LD) */}
      <FaqAccordion
        id="faq"
        eyebrow="FAQ"
        heading={WEBUYSOLAR.faq.heading}
        items={WEBUYSOLAR.faq.items}
        accent={meta.accent}
      />

      {/* §10 — Final CTA */}
      <PageFooter
        ctaVariant="centered"
        eyebrow={WEBUYSOLAR.finalCta.eyebrow}
        heading={WEBUYSOLAR.finalCta.heading}
        body={WEBUYSOLAR.finalCta.body}
        primaryCta={{ label: 'Book your free audit', href: AUDIT_HREF }}
      />
    </>
  );
}

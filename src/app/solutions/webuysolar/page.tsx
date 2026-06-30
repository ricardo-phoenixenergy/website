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
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { IconCheck, IconArrowRight, IconDollarSign } from '@/components/ui/Icons';
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
      >
        {/* Valuation-tool card */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{ background: `${meta.accent}1F`, color: meta.accent }}
          >
            <IconDollarSign size={20} />
          </div>
          <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-2" style={{ color: meta.accent }}>
            {WEBUYSOLAR.heroTool.eyebrow}
          </p>
          <p className="font-display font-extrabold text-xl text-[#1A1A1A] mb-2 leading-tight">
            {WEBUYSOLAR.heroTool.heading}
          </p>
          <p className="font-body text-sm text-[#374151] leading-[1.7] mb-5">
            {WEBUYSOLAR.heroTool.body}
          </p>
          <Button variant="primary" href="https://phoenixenergy.solutions/tools/solar-valuation" className="w-full">
            {WEBUYSOLAR.heroTool.ctaLabel} <IconArrowRight size={14} />
          </Button>
        </div>
      </SolutionHero>

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

      {/* How it works — differentiator framing + 6-step process */}
      <HowItWorks
        eyebrow={WEBUYSOLAR.howItWorks.eyebrow}
        title={WEBUYSOLAR.howItWorks.title}
        subtitle={WEBUYSOLAR.howItWorks.subtitle}
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

      {/* Final CTA — audit deliverables + booking */}
      <section id="audit" className="bg-[#F5F5F5] py-16 md:py-24">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2] mb-3">
                {WEBUYSOLAR.audit.heading}
              </h2>
              <p className="font-body text-sm md:text-base leading-[1.75] text-[#6B7280] mb-6">
                {WEBUYSOLAR.audit.subtitle}
              </p>
              <Button variant="primary" href={AUDIT_HREF}>
                Arrange your free audit <IconArrowRight size={14} />
              </Button>
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

      {/* Footer chrome (no CTA band — the audit section above is the final CTA) */}
      <PageFooter showCta={false} />
    </>
  );
}

// src/app/tools/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { PageFooter } from '@/components/layout/PageFooter';
import { IconArrowRight } from '@/components/ui/Icons';
import { SOLUTION_META } from '@/types/solutions';
import { VALUATION_CTA } from '@/config/ctas';

const DESCRIPTION =
  'Free resources for smarter energy decisions, including a valuation request for existing solar systems, prepared by our WeBuySolar team.';

export const metadata: Metadata = {
  title: 'Tools & Resources',
  description: DESCRIPTION,
  alternates: { canonical: 'https://phoenixenergy.solutions/tools' },
  openGraph: {
    title: 'Tools & Resources | Phoenix Energy',
    description: DESCRIPTION,
    url: 'https://phoenixenergy.solutions/tools',
    images: [{ url: 'https://phoenixenergy.solutions/og-default.png', width: 1200, height: 630 }],
  },
};

const TOOLS = [
  {
    href: VALUATION_CTA.href,
    meta: SOLUTION_META.webuysolar,
    label: 'Solar Valuation Request',
    description:
      'Request a valuation of your existing solar system, with or without battery storage. Share a few details and our WeBuySolar team prepares your valuation after a free on-site audit.',
    badge: 'WeBuySolar',
    features: ['Solar & battery', 'Team-reviewed', 'No obligation'],
    cta: VALUATION_CTA.label,
  },
] as const;

export default function ToolsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Phoenix Energy Tools & Resources',
    description: 'Free energy tools for South African businesses',
    url: 'https://phoenixenergy.solutions/tools',
    itemListElement: TOOLS.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.label,
      url: `https://phoenixenergy.solutions${tool.href}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-pe-bg min-h-screen">
        <div className="page-container pt-24 pb-16">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-body text-sm text-pe-muted mb-6">
            <Link href="/" className="hover:text-pe-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-pe-primary">Tools</span>
          </nav>

          {/* Page header */}
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-2">
            Tools &amp; Resources
          </p>
          <h1 className="font-display font-extrabold text-4xl text-pe-text leading-[1.2] mb-3">
            Make smarter{' '}
            <em className="not-italic text-pe-secondary-ink">energy decisions</em>
          </h1>
          <p className="font-body text-base text-pe-muted leading-[1.7] mb-10 max-w-lg">
            Free resources to help you plan your next energy decision, with no obligation.
          </p>

          {/* Tool cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map((tool, i) => (
              <AnimatedSection key={tool.href} delay={i * 0.06}>
                <Link href={tool.href} className="group block h-full">
                  <div
                    className="rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-200 group-hover:-translate-y-[5px] group-hover:shadow group-hover:border-[#cccccc]"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    {/* Dark gradient header */}
                    <div
                      className="px-6 pt-5 pb-7"
                      style={{ background: 'linear-gradient(135deg, #1a3a3e 0%, #0d1f22 100%)' }}
                    >
                      {/* A solid badge, as on the project cards: the light-surface ink
                          fails on this dark header (1.8:1), the "on" ink passes on the fill (4.7:1). */}
                      <span
                        className="inline-flex items-center font-body font-bold text-xs uppercase tracking-[0.1em] rounded-full px-2.5 py-1 mb-3"
                        style={{ background: tool.meta.accent, color: tool.meta.accentText }}
                      >
                        {tool.badge}
                      </span>
                      <h2 className="font-display font-extrabold text-xl text-white leading-tight">
                        {tool.label}
                      </h2>
                    </div>

                    {/* White body */}
                    <div className="bg-white px-6 pt-5 pb-6 flex flex-col flex-1">
                      <p className="font-body text-sm text-pe-muted leading-[1.75] flex-1 mb-5">
                        {tool.description}
                      </p>

                      {/* Feature chips */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tool.features.map((feat) => (
                          <span
                            key={feat}
                            className="font-body text-xs px-2.5 py-1 rounded-full"
                            style={{
                              color: tool.meta.accentInk,
                              border: `1px solid ${tool.meta.accent}40`,
                              background: `${tool.meta.accent}0D`,
                            }}
                          >
                            {feat}
                          </span>
                        ))}
                      </div>

                      <p className="flex items-center gap-2 justify-end font-body text-sm font-semibold text-pe-primary transition-colors group-hover:text-pe-primary-hover">
                        {tool.cta} <IconArrowRight />
                      </p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

        </div>
      </div>

      <PageFooter ctaVariant="centered" />
    </>
  );
}

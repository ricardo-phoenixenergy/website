// src/app/tools/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { CTABanner } from '@/components/sections/CTABanner';
import { IconArrowRight } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Tools & Resources | Phoenix Energy',
  description:
    'Free tools to help you make smarter energy decisions. Calculate the value of your solar system, model energy savings, and more.',
  alternates: { canonical: 'https://phoenixenergy.solutions/tools' },
  openGraph: {
    title: 'Tools & Resources | Phoenix Energy',
    description:
      'Free tools to help you make smarter energy decisions. Calculate the value of your solar system, model energy savings, and more.',
    url: 'https://phoenixenergy.solutions/tools',
  },
};

const TOOLS = [
  {
    href: '/tools/solar-valuation',
    accent: '#C97A40',
    label: 'Solar Asset Valuation',
    description:
      'Find out what your existing solar PV system — with or without battery storage — is worth on the open market. Our three-method model (DCF, depreciated cost, market comps) gives you a credible indicative value in under two minutes.',
    badge: 'WeBuySolar',
    features: ['DCF + cost + market comps', 'BESS support', 'Instant estimate'],
    cta: 'Try it',
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

      <main className="bg-[#F5F5F5] min-h-screen">
        <div className="page-container pt-24 pb-16">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 font-body text-sm text-[#6B7280] mb-6">
            <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-[#39575C]">Tools</span>
          </nav>

          {/* Page header */}
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
            Tools &amp; Resources
          </p>
          <h1 className="font-display font-extrabold text-4xl text-[#1A1A1A] leading-[1.2] mb-3">
            Make smarter{' '}
            <em style={{ color: '#709DA9', fontStyle: 'normal' }}>energy decisions</em>
          </h1>
          <p className="font-body text-base text-[#6B7280] leading-[1.7] mb-10 max-w-lg">
            Free tools built on real market data — so you know exactly where you stand before making any energy commitment.
          </p>

          {/* Tool cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map((tool, i) => (
              <AnimatedSection key={tool.href} delay={i * 0.06}>
                <Link href={tool.href} className="group block h-full">
                  <div
                    className="rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-200 group-hover:-translate-y-[5px] group-hover:shadow-[0_16px_40px_rgba(57,87,92,0.12)] group-hover:border-[#cccccc]"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    {/* Dark gradient header */}
                    <div
                      className="px-6 pt-5 pb-7"
                      style={{ background: 'linear-gradient(135deg, #1a3a3e 0%, #0d1f22 100%)' }}
                    >
                      <span
                        className="inline-flex items-center font-body font-bold text-[10px] uppercase tracking-[0.1em] rounded-full px-2.5 py-1 mb-3"
                        style={{
                          background: `${tool.accent}25`,
                          color: tool.accent,
                          border: `1px solid ${tool.accent}50`,
                        }}
                      >
                        {tool.badge}
                      </span>
                      <h2 className="font-display font-extrabold text-xl text-white leading-tight">
                        {tool.label}
                      </h2>
                    </div>

                    {/* White body */}
                    <div className="bg-white px-6 pt-5 pb-6 flex flex-col flex-1">
                      <p className="font-body text-sm text-[#6B7280] leading-[1.75] flex-1 mb-5">
                        {tool.description}
                      </p>

                      {/* Feature chips */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tool.features.map((feat) => (
                          <span
                            key={feat}
                            className="font-body text-xs px-2.5 py-1 rounded-full"
                            style={{
                              color: tool.accent,
                              border: `1px solid ${tool.accent}40`,
                              background: `${tool.accent}0D`,
                            }}
                          >
                            {feat}
                          </span>
                        ))}
                      </div>

                      <p className="flex items-center gap-2 justify-end font-body text-sm font-semibold text-[#39575C] transition-colors group-hover:text-[#2a4045]">
                        {tool.cta} <IconArrowRight />
                      </p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

        </div>
      </main>

      <CTABanner />
    </>
  );
}

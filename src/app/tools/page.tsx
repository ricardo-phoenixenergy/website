// src/app/tools/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { CTABanner } from '@/components/sections/CTABanner';

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
    cta: 'Try it →',
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

      {/* Hero */}
      <section className="bg-[#0d1f22] px-5 py-16 md:py-24 text-center">
        <AnimatedSection>
          <p
            className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3"
            style={{ color: 'rgba(255,255,255,0.50)' }}
          >
            Tools &amp; Resources
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-[1.1] max-w-[620px] mx-auto">
            Make smarter{' '}
            <em style={{ color: '#709DA9', fontStyle: 'normal' }}>energy decisions</em>
          </h1>
          <p
            className="font-body text-base leading-[1.75] mt-5 max-w-[460px] mx-auto"
            style={{ color: 'rgba(255,255,255,0.60)' }}
          >
            Free tools built on real market data — so you know exactly where you stand before making any energy commitment.
          </p>
        </AnimatedSection>
      </section>

      {/* Tool cards */}
      <section className="bg-[#F5F5F5] px-5 py-12 md:py-16">
        <div className="max-w-[960px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool, i) => (
            <AnimatedSection key={tool.href} delay={i * 0.06}>
              <Link href={tool.href} className="group block h-full">
                <div
                  className="bg-white rounded-2xl p-6 h-full flex flex-col transition-shadow duration-200 group-hover:shadow-lg"
                  style={{ border: '1px solid #E5E7EB', borderTop: `3px solid ${tool.accent}` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-display font-extrabold text-xl text-[#1A1A1A] leading-tight">
                      {tool.label}
                    </h2>
                    <span
                      className="font-body font-semibold text-[10px] rounded-full px-2 py-0.5 flex-shrink-0"
                      style={{ background: `${tool.accent}20`, color: tool.accent }}
                    >
                      {tool.badge}
                    </span>
                  </div>
                  <p className="font-body text-sm text-[#6B7280] leading-[1.75] flex-1 mb-5">
                    {tool.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {tool.features.map((feat) => (
                      <div
                        key={feat}
                        className="rounded-xl p-3"
                        style={{ background: `${tool.accent}15` }}
                      >
                        <p className="font-body text-[11px] text-[#6B7280] leading-[1.4]">{feat}</p>
                      </div>
                    ))}
                  </div>
                  <p className="font-body text-sm font-semibold text-[#39575C] transition-colors group-hover:text-[#2a4045]">
                    {tool.cta}
                  </p>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}

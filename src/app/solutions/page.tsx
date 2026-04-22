// src/app/solutions/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SOLUTION_META, SOLUTION_VERTICALS } from '@/types/solutions';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { CTABanner } from '@/components/sections/CTABanner';

export const metadata: Metadata = {
  title: 'Energy Solutions | Phoenix Energy',
  description:
    'Commercial solar, wheeling, energy optimisation, carbon credits, WeBuySolar, and EV fleet solutions. Phoenix Energy delivers measurable savings across every energy challenge.',
  alternates: { canonical: 'https://phoenixenergy.solutions/solutions' },
  openGraph: {
    title: 'Energy Solutions | Phoenix Energy',
    description:
      'Commercial solar, wheeling, energy optimisation, carbon credits, WeBuySolar, and EV fleet solutions. Phoenix Energy delivers measurable savings across every energy challenge.',
    url: 'https://phoenixenergy.solutions/solutions',
  },
};

export default function SolutionsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Phoenix Energy Solutions',
    description: 'Commercial energy solutions for South African businesses',
    url: 'https://phoenixenergy.solutions/solutions',
    itemListElement: SOLUTION_VERTICALS.map((vertical, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: SOLUTION_META[vertical].label,
      url: `https://phoenixenergy.solutions${SOLUTION_META[vertical].slug}`,
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
            Our Solutions
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-[1.1] max-w-[620px] mx-auto">
            Every energy challenge,{' '}
            <em style={{ color: '#709DA9', fontStyle: 'normal' }}>solved</em>
          </h1>
          <p
            className="font-body text-base leading-[1.75] mt-5 max-w-[460px] mx-auto"
            style={{ color: 'rgba(255,255,255,0.60)' }}
          >
            Six specialist solutions that cut costs, generate revenue, and future-proof your commercial energy operations.
          </p>
        </AnimatedSection>
      </section>

      {/* Solution cards grid */}
      <section className="bg-[#F5F5F5] px-5 py-12 md:py-16">
        <div className="max-w-[960px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTION_VERTICALS.map((vertical, i) => {
            const meta = SOLUTION_META[vertical];
            const cfg = VERTICAL_CONFIG[vertical];
            return (
              <AnimatedSection key={vertical} delay={i * 0.06}>
                <Link href={meta.slug} className="group block h-full">
                  <div
                    className="bg-white rounded-2xl p-6 h-full flex flex-col transition-shadow duration-200 group-hover:shadow-lg"
                    style={{ border: '1px solid #E5E7EB', borderTop: `3px solid ${meta.accent}` }}
                  >
                    <h2 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-2 leading-tight">
                      {meta.label}
                    </h2>
                    <p className="font-body text-sm text-[#6B7280] leading-[1.75] flex-1 mb-5">
                      {cfg.seoDescription}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {cfg.stats.slice(0, 2).map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl p-3"
                          style={{ background: `${meta.accent}20` }}
                        >
                          <p className="font-display font-extrabold text-base text-[#1A1A1A]">{stat.value}</p>
                          <p className="font-body text-xs text-[#6B7280]">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <p className="font-body text-sm font-semibold text-[#39575C] transition-colors group-hover:text-[#2a4045]">
                      Learn more →
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      <CTABanner />
    </>
  );
}

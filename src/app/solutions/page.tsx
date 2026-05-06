import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';
import { SOLUTION_META, SOLUTION_VERTICALS } from '@/types/solutions';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { CTABanner } from '@/components/sections/CTABanner';
import { IconArrowRight } from '@/components/ui/Icons';
import type { SolutionVertical } from '@/types/solutions';

const VERTICAL_IMAGE: Record<SolutionVertical, string> = {
  'ci-solar-storage':    '/hero-solar.png',
  'wheeling':            '/hero-wheeling.png',
  'energy-optimisation': '/hero-optimisation.png',
  'carbon-credits':      '/hero-carbon.png',
  'webuysolar':          '/hero-webuysolar.png',
  'ev-fleets':           '/hero-ev.png',
};

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

      {/* Hero — full-bleed FloatingOrbs behind left-aligned headline */}
      <section className="relative overflow-hidden" style={{ background: '#0d1f22', minHeight: 480 }}>
        <FloatingOrbs />
        <div className="page-container relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
          <AnimatedSection>
            <p
              className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3"
              style={{ color: 'rgba(255,255,255,0.50)' }}
            >
              Our Solutions
            </p>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-[1.1] mb-5 max-w-[580px]">
              Every energy challenge,{' '}
              <em style={{ color: '#709DA9', fontStyle: 'normal' }}>solved</em>
            </h1>
            <p
              className="font-body text-base leading-[1.75] mb-8 max-w-[440px]"
              style={{ color: 'rgba(255,255,255,0.60)' }}
            >
              Six specialist solutions that cut costs, generate revenue, and future-proof your commercial energy operations.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold rounded-full px-5 py-2.5 transition-colors duration-200 hover:bg-white"
                style={{ background: '#F5F5F5', color: '#0d1f22' }}
              >
                Get a free assessment <IconArrowRight size={13} />
              </Link>
              <a
                href="#solutions"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold rounded-full px-5 py-2.5"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.80)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Explore solutions <IconArrowRight size={13} />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Solution cards grid */}
      <section id="solutions" className="bg-[#F5F5F5] py-12 md:py-16">
        <div className="page-container grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTION_VERTICALS.map((vertical, i) => {
            const meta = SOLUTION_META[vertical];
            const cfg = VERTICAL_CONFIG[vertical];
            const stat0 = cfg.stats[0];
            const stat1 = cfg.stats[1];

            return (
              <AnimatedSection key={vertical} delay={i * 0.06}>
                <Link href={meta.slug} className="group block h-full">
                  <div
                    className="rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 group-hover:-translate-y-[5px] group-hover:shadow"
                    style={{ background: '#0d1f22', border: '1px solid #1a3a3f' }}
                  >
                    {/* Photo zone */}
                    <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 180 }}>
                      <Image
                        src={VERTICAL_IMAGE[vertical]}
                        alt={meta.label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1">
                      <p
                        className="font-body text-sm leading-[1.75] flex-1 mb-5 line-clamp-3"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                      >
                        {cfg.seoDescription}
                      </p>

                      {/* Stat pair */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {[stat0, stat1].map((s) => (
                          <div
                            key={s.label}
                            className="rounded-xl p-3"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                          >
                            <p className="font-display font-bold text-sm" style={{ color: meta.accent }}>{s.value}</p>
                            <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <span
                          className="inline-flex items-center gap-2 font-body text-sm font-semibold rounded-full px-4 py-2"
                          style={{
                            background: `${meta.accent}18`,
                            color: meta.accent,
                            border: `1px solid ${meta.accent}35`,
                          }}
                        >
                          Explore {meta.label}
                          <IconArrowRight size={13} />
                        </span>
                      </div>
                    </div>
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

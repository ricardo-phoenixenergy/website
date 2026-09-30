import type { Metadata } from 'next';
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';
import { JsonLd } from '@/components/layout/JsonLd';
import { SOLUTION_META, SOLUTION_VERTICALS } from '@/types/solutions';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { DISCOVERY_CTA } from '@/config/ctas';
import { IconArrowRight } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { SolutionCard } from '@/components/sections/SolutionCard';
import { getHeroImages } from '@/lib/getHeroImages';
import { pageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, HOME_CRUMB } from '@/lib/structuredData';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: 'Energy Solutions',
  description:
    'Commercial solar, wheeling, energy optimisation, carbon credits, WeBuySolar and EV fleet solutions, with measurable savings across every energy challenge.',
  path: '/solutions',
});

export default async function SolutionsPage() {
  const heroImages = await getHeroImages();

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
      <JsonLd data={breadcrumbJsonLd([HOME_CRUMB, { name: 'Solutions', path: '/solutions' }])} />
      <JsonLd data={jsonLd} />

      {/* Hero — full-bleed FloatingOrbs behind left-aligned headline */}
      <section className="focus-on-dark relative overflow-hidden" style={{ background: '#0d1f22', minHeight: 480 }}>
        <FloatingOrbs />
        <div className="page-container relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-body text-sm mb-8" style={{ color: 'var(--color-on-dark-subtle)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-white">Solutions</span>
          </nav>
          <AnimatedSection>
            <p
              className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3"
              style={{ color: 'var(--color-on-dark-subtle)' }}
            >
              Our Solutions
            </p>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-[1.1] mb-5 max-w-[580px]">
              Every energy challenge,{' '}
              <em className="not-italic text-pe-secondary">solved</em>
            </h1>
            <p
              className="font-body text-base leading-[1.75] mb-8 max-w-[440px]"
              style={{ color: 'rgba(255,255,255,0.60)' }}
            >
              Six specialist solutions that cut costs, generate revenue, and future-proof your commercial energy operations.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="light" href={DISCOVERY_CTA.href}>
                {DISCOVERY_CTA.label} <IconArrowRight />
              </Button>
              {/* A plain anchor, not a Link: the browser's own jump also moves the
                  keyboard's starting point to the cards. */}
              <a href="#solutions" className={buttonClasses({ variant: 'ghost' })}>
                Explore solutions <IconArrowRight />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Solution cards: light, like the project cards, each headed by the service's name */}
      <section id="solutions" className="bg-pe-bg py-16 md:py-24">
        <div className="page-container grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTION_VERTICALS.map((vertical, i) => (
            <AnimatedSection key={vertical} delay={i * 0.06} className="h-full">
              <SolutionCard meta={SOLUTION_META[vertical]} line={VERTICAL_CONFIG[vertical].cardLine} image={heroImages[vertical]} />
            </AnimatedSection>
          ))}
        </div>
      </section>

    </>
  );
}

'use client';

import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Button } from '@/components/ui/Button';
import { IconArrowRight, IconCheck } from '@/components/ui/Icons';
import { DEFAULT_COMPANY_STATS, statAsOfCaption } from '@/lib/companyStats';
import { DISCOVERY_BAND, DISCOVERY_CTA, type Cta } from '@/config/ctas';
import type { CompanyStat } from '@/types/sanity';

export type CTAStat = CompanyStat;

export interface PageFooterProps {
  ctaVariant?: 'stats' | 'centered' | 'deliverables';
  eyebrow?: string;
  heading?: string;
  body?: string;
  /** Defaults to the company-level "Book a discovery meeting" (src/config/ctas.ts). */
  primaryCta?: Cta;
  stats?: CTAStat[];
  /** Accent for the deliverables card top bar + check icons. */
  accent?: string;
  /** Bullet list shown in the right-hand card of the `deliverables` variant. */
  deliverables?: string[];
  deliverablesLabel?: string;
}

// The defaults are the company-level band: pages that pass nothing (Tools, the
// blog) get the same copy, CTA and reply promise as home and About.
export function PageFooter({
  ctaVariant = 'stats',
  eyebrow    = DISCOVERY_BAND.eyebrow,
  heading    = DISCOVERY_BAND.heading,
  body       = DISCOVERY_BAND.body,
  primaryCta = DISCOVERY_CTA,
  stats      = DEFAULT_COMPANY_STATS,
  accent     = '#709DA9',
  deliverables = [],
  deliverablesLabel = 'What you receive',
}: PageFooterProps = {}) {
  return (
    /* Single wrapper — overflow:clip clips without creating a scroll container,
       so the watermark can't push the page height beyond the footer bottom.
       isolation:isolate contains the inner z-index:0/1 layers in their own
       stacking context, so they don't paint over the fixed reCAPTCHA badge. */
    <div className="focus-on-dark relative" style={{ overflow: 'clip', background: 'var(--color-pe-nav-dark)', isolation: 'isolate' }}>

      {/* Watermark */}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark */}
      <img
        src="/inverted-logo.png"
        alt=""
        aria-hidden
        className="absolute pointer-events-none select-none"
        style={{
          width: 'clamp(320px, 38vw, 520px)',
          right: '-3%',
          bottom: 0,
          opacity: 0.07,
          zIndex: 0,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%)',
        }}
      />

      {/* CTA section */}
      <section
        className="py-16 md:py-24 relative"
        style={{ borderTop: '3px solid #709DA9', zIndex: 1 }}
      >
        {ctaVariant === 'centered' ? (
          <AnimatedSection className="page-container text-center max-w-2xl mx-auto">
            <p
              className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3"
              style={{ color: '#709DA9' }}
            >
              {eyebrow}
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white leading-[1.2] mb-4">
              {heading}
            </h2>
            <p
              className="font-body text-base leading-[1.75] mb-8"
              style={{ color: 'var(--color-on-dark-subtle)' }}
            >
              {body}
            </p>
            <Button variant="light" href={primaryCta.href}>
              {primaryCta.label} <IconArrowRight />
            </Button>
          </AnimatedSection>
        ) : ctaVariant === 'deliverables' ? (
          <div className="page-container grid gap-10 md:grid-cols-2 md:items-center">
            <AnimatedSection delay={0}>
              <p
                className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3"
                style={{ color: '#709DA9' }}
              >
                {eyebrow}
              </p>
              <h2 className="font-display font-extrabold text-3xl text-white leading-[1.2] mb-4">
                {heading}
              </h2>
              <p
                className="font-body text-base leading-[1.75] mb-6"
                style={{ color: 'var(--color-on-dark-subtle)' }}
              >
                {body}
              </p>
              <Button variant="light" href={primaryCta.href}>
                {primaryCta.label} <IconArrowRight />
              </Button>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="h-[3px]" style={{ background: accent }} />
                <div className="p-6">
                  <p className="font-body text-xs font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--color-on-dark-subtle)' }}>
                    {deliverablesLabel}
                  </p>
                  <ul className="space-y-3">
                    {deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 font-body text-sm font-semibold text-white">
                        <span className="mt-0.5 flex-shrink-0" style={{ color: accent }}>
                          <IconCheck size={16} />
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        ) : (
          <div className="page-container grid gap-10 md:grid-cols-2 md:items-center">
            <AnimatedSection delay={0}>
              <p
                className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3"
                style={{ color: '#709DA9' }}
              >
                {eyebrow}
              </p>
              <h2 className="font-display font-extrabold text-3xl text-white leading-[1.2] mb-4">
                {heading}
              </h2>
              <p
                className="font-body text-base leading-[1.75] mb-6"
                style={{ color: 'var(--color-on-dark-subtle)' }}
              >
                {body}
              </p>
              <Button variant="light" href={primaryCta.href}>
                {primaryCta.label} <IconArrowRight />
              </Button>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="grid grid-cols-2 gap-2.5">
                {stats.map((stat) => {
                  const asOf = statAsOfCaption(stat);
                  return (
                    <div
                      key={stat.label}
                      className="rounded-xl p-3.5 flex flex-col gap-1"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <span className="font-display font-extrabold text-2xl text-white leading-none">
                        {stat.value}
                      </span>
                      <span
                        className="font-body text-xs font-normal uppercase tracking-[0.08em]"
                        style={{ color: 'var(--color-on-dark-subtle)' }}
                      >
                        {stat.label}
                      </span>
                      {asOf && (
                        <span className="font-body text-xs" style={{ color: 'var(--color-on-dark-subtle)' }}>
                          {asOf}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        )}
      </section>
    </div>
  );
}

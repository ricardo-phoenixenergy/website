'use client';

import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Button } from '@/components/ui/Button';
import { IconArrowRight } from '@/components/ui/Icons';
import { DEFAULT_COMPANY_STATS } from '@/lib/companyStats';
import type { CompanyStat } from '@/types/sanity';

export type CTAStat = CompanyStat;

export interface PageFooterProps {
  showCta?: boolean;
  ctaVariant?: 'stats' | 'centered';
  eyebrow?: string;
  heading?: string;
  body?: string;
  primaryCta?: { label: string; href: string };
  stats?: CTAStat[];
}

export function PageFooter({
  showCta    = true,
  ctaVariant = 'stats',
  eyebrow    = 'Start today',
  heading    = "Ignite what's possible for your business",
  body       = "Get a free energy assessment from Phoenix Energy's certified engineers — no commitment, no cost, results delivered in 48 hours.",
  primaryCta = { label: 'Get a Free Quote', href: '/contact' },
  stats      = DEFAULT_COMPANY_STATS,
}: PageFooterProps = {}) {
  const year = new Date().getFullYear();

  return (
    /* Single wrapper — overflow:clip clips without creating a scroll container,
       so the watermark can't push the page height beyond the footer bottom.
       isolation:isolate contains the inner z-index:0/1 layers in their own
       stacking context, so they don't paint over the fixed reCAPTCHA badge. */
    <div className="relative" style={{ overflow: 'clip', background: '#0d1f22', isolation: 'isolate' }}>

      {/* Watermark — only shown alongside the CTA */}
      {showCta && (
        <img
          src="/inverted-logo.svg"
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
      )}

      {/* CTA section — conditionally rendered */}
      {showCta && (
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
                className="font-body text-sm leading-[1.75] mb-8"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {body}
              </p>
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-2 font-body font-semibold text-sm rounded-full px-5 py-2.5 bg-white text-[#0d1f22] hover:bg-[#F5F5F5] transition-colors duration-150"
              >
                {primaryCta.label} <IconArrowRight size={13} />
              </Link>
            </AnimatedSection>
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
                  className="font-body text-sm leading-[1.75] mb-6"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  {body}
                </p>
                <Button variant="light" href={primaryCta.href}>
                  {primaryCta.label}
                </Button>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="grid grid-cols-2 gap-2.5">
                  {stats.map((stat) => (
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
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                      >
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          )}
        </section>
      )}

      {/* Footer strip */}
      <footer
        className="relative"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', zIndex: 1 }}
      >
        {/* Desktop */}
        <div className="page-container hidden md:flex items-center justify-between py-4">
          <Link
            href="/"
            className="font-display font-[800] text-xl flex-shrink-0 flex items-center gap-1.5"
          >
            <img src="/inverted-logo.svg" alt="Phoenix Energy" className="flex-shrink-0 size-7" />
            <span style={{ color: '#F5F5F5' }}>Phoenix</span>
            <span style={{ color: '#F5F5F5' }}>Energy</span>
          </Link>
          <p className="font-body text-xs font-normal" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {year} Phoenix Energy. All rights reserved.
          </p>
          <div className="flex items-center gap-3.5">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Use',   href: '/terms-of-use' },
              { label: 'Disclaimer',     href: '/disclaimer' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col items-center gap-2 py-3.5 px-4 text-center">
          <Link href="/" className="font-display font-[800] text-xl flex-shrink-0 flex items-center gap-1.5">
            <img src="/inverted-logo.svg" alt="Phoenix Energy" className="flex-shrink-0 size-7" />
            <span style={{ color: '#F5F5F5' }}>Phoenix</span>
            <span style={{ color: '#F5F5F5' }}>Energy</span>
          </Link>
          <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {year} Phoenix Energy. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Use',   href: '/terms-of-use' },
              { label: 'Disclaimer',     href: '/disclaimer' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

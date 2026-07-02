import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { IconArrowRight } from '@/components/ui/Icons';

interface CtaLink {
  label: string;
  href: string;
}

export interface SolutionHeroProps {
  title: string;       // HTML string — <em> renders in accent colour
  subtitle: string;
  accent: string;      // hex — badge border + em colour
  badge: string;       // current page label — shown as the final breadcrumb crumb, e.g. 'C&I Solar & Storage'
  heroImage?: string;  // photo URL (Sanity) — falls back to heroBg gradient
  heroBlur?: string;   // LQIP blur placeholder for heroImage
  heroBg: string;      // CSS gradient fallback when no photo
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;   // optional text link beside the primary button
  children?: ReactNode;  // calculator / interactive slot
  wideRight?: boolean;   // 40/60 split — give the right column 60% instead of the fixed 440px
  imagePosition?: 'center' | 'top' | 'bottom';  // object-position of the hero photo (default center)
  primaryCtaArrow?: boolean;  // append a right-arrow icon to the primary CTA (default true; pass false to omit)
  copyOnly?: boolean;  // no right column — copy spans ~2/3 of the container (use when there are no children)
}

const HERO_OBJECT_POSITION: Record<NonNullable<SolutionHeroProps['imagePosition']>, string> = {
  center: 'object-center',
  top: 'object-top',
  bottom: 'object-bottom',
};

function renderTitle(raw: string, accent: string) {
  const parts = raw.split(/(<em>.*?<\/em>|<br\s*\/?>)/g);
  return parts.map((part, i) => {
    if (/^<br\s*\/?>$/.test(part)) {
      return <br key={i} />;
    }
    const match = part.match(/^<em>(.*)<\/em>$/);
    if (match) {
      return (
        <em key={i} style={{ color: accent, fontStyle: 'normal' }}>
          {match[1]}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function SolutionHero({
  title,
  subtitle,
  accent,
  badge,
  heroImage,
  heroBlur,
  heroBg,
  primaryCta,
  secondaryCta,
  children,
  wideRight = false,
  imagePosition = 'center',
  primaryCtaArrow = true,
  copyOnly = false,
}: SolutionHeroProps) {
  return (
    <section className="relative" style={{ minHeight: 'clamp(580px, 75vw, 760px)' }}>
      {/* Background */}
      {heroImage ? (
        <Image
          src={heroImage}
          alt={badge}
          fill
          priority
          className={`object-cover ${HERO_OBJECT_POSITION[imagePosition]}`}
          sizes="100vw"
          {...(heroBlur ? { placeholder: 'blur' as const, blurDataURL: heroBlur } : {})}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: heroBg }} />
      )}

      {/* Overlay — darker on left (text), softer on right (calculator has its own card) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(13,31,34,0.92) 0%, rgba(13,31,34,0.84) 45%, rgba(13,31,34,0.64) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="page-container relative z-10 flex items-center"
        style={{ minHeight: 'inherit', paddingTop: 96, paddingBottom: 72 }}
      >
        <div
          className={
            copyOnly
              ? 'w-full'
              : `grid grid-cols-1 gap-10 xl:gap-16 items-center w-full ${
                  wideRight ? 'lg:grid-cols-[2fr_3fr]' : 'lg:grid-cols-[1fr_440px]'
                }`
          }
        >

          {/* Left: copy */}
          <div className={copyOnly ? 'lg:max-w-[66%]' : undefined}>
            {/* Breadcrumb — matches the dark-hero style used across the site */}
            <nav
              className="flex items-center gap-1.5 font-body text-sm mb-5"
              style={{ color: 'rgba(255,255,255,0.45)' }}
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span aria-hidden>/</span>
              <Link href="/solutions" className="hover:text-white transition-colors">Solutions</Link>
              <span aria-hidden>/</span>
              <span className="font-semibold text-white">{badge}</span>
            </nav>

            <h1 className={`font-display font-extrabold text-[1.875rem] md:text-[2.625rem] text-white leading-[1.18] mb-4 ${copyOnly ? '' : 'max-w-[560px]'}`}>
              {renderTitle(title, accent)}
            </h1>

            <p
              className={`font-body text-sm md:text-base leading-[1.75] mb-6 whitespace-normal lg:whitespace-pre-line ${copyOnly ? 'max-w-[640px]' : 'max-w-[460px]'}`}
              style={{ color: 'rgba(255,255,255,0.70)' }}
            >
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
              <Button variant="light" href={primaryCta.href}>
                {primaryCta.label}
                {primaryCtaArrow && <IconArrowRight size={14} />}
              </Button>
              {secondaryCta && (
                <Button variant="ghost" href={secondaryCta.href}>
                  {secondaryCta.label} <IconArrowRight size={14} />
                </Button>
              )}
            </div>
          </div>

          {/* Right: calculator slot */}
          {children && (
            <div className="w-full">{children}</div>
          )}
        </div>
      </div>
    </section>
  );
}

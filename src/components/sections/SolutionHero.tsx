import Image from 'next/image';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface CtaLink {
  label: string;
  href: string;
}

export interface SolutionHeroProps {
  title: string;       // HTML string — <em> renders in accent colour
  subtitle: string;
  accent: string;      // hex — badge border + em colour
  badge: string;       // e.g. 'C&I Solar & Storage'
  heroImage?: string;  // photo URL (Sanity) — falls back to heroBg gradient
  heroBlur?: string;   // LQIP blur placeholder for heroImage
  heroBg: string;      // CSS gradient fallback when no photo
  primaryCta: CtaLink;
  children?: ReactNode;  // calculator / interactive slot
  wideRight?: boolean;   // 40/60 split — give the right column 60% instead of the fixed 440px
}

function renderTitle(raw: string, accent: string) {
  const parts = raw.split(/(<em>.*?<\/em>)/g);
  return parts.map((part, i) => {
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
  children,
  wideRight = false,
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
          className="object-cover"
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
            'linear-gradient(105deg, rgba(13,31,34,0.97) 0%, rgba(13,31,34,0.92) 45%, rgba(13,31,34,0.78) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="page-container relative z-10 flex items-center"
        style={{ minHeight: 'inherit', paddingTop: 96, paddingBottom: 72 }}
      >
        <div
          className={`grid grid-cols-1 gap-10 xl:gap-16 items-center w-full ${
            wideRight ? 'lg:grid-cols-[2fr_3fr]' : 'lg:grid-cols-[1fr_440px]'
          }`}
        >

          {/* Left: copy */}
          <div>
            <span
              className="inline-block font-body text-xs font-semibold px-3 py-1 rounded-full mb-5"
              style={{
                border: `1px solid ${accent}`,
                color: accent,
                background: `${accent}1a`,
              }}
            >
              {badge}
            </span>

            <h1 className="font-display font-extrabold text-[1.875rem] md:text-[2.625rem] text-white leading-[1.18] mb-4 max-w-[560px]">
              {renderTitle(title, accent)}
            </h1>

            <p
              className="font-body text-sm md:text-base leading-[1.75] mb-6 max-w-[460px]"
              style={{ color: 'rgba(255,255,255,0.70)' }}
            >
              {subtitle}
            </p>

            <Button variant="light" href={primaryCta.href}>
              {primaryCta.label}
            </Button>
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

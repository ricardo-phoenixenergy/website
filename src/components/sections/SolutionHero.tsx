// src/components/sections/SolutionHero.tsx
import { Button } from '@/components/ui/Button';

interface CtaLink {
  label: string;
  href: string;
}

export interface SolutionHeroProps {
  title: string;       // HTML string — <em> tags render at opacity 0.45
  subtitle: string;
  accent: string;      // hex, used for badge border
  badge: string;       // e.g. 'C&I Solar & Storage'
  heroBg: string;      // CSS gradient placeholder until real photo supplied
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

function renderTitle(raw: string) {
  const parts = raw.split(/(<em>.*?<\/em>)/g);
  return parts.map((part, i) => {
    const match = part.match(/^<em>(.*)<\/em>$/);
    if (match) {
      return (
        <em key={i} style={{ opacity: 0.45, fontStyle: 'normal' }}>
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
  heroBg,
  primaryCta,
  secondaryCta,
}: SolutionHeroProps) {
  return (
    <section
      className="relative flex items-end"
      style={{
        minHeight: 'clamp(260px, 36vw, 340px)',
        background: heroBg,
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(13,31,34,0.15) 0%, rgba(13,31,34,0.92) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[960px] mx-auto px-5 pb-10 pt-16 w-full">
        {/* Vertical badge */}
        <span
          className="inline-block font-body text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={{
            border: `1px solid ${accent}`,
            color: accent,
            background: `${accent}1a`,
          }}
        >
          {badge}
        </span>

        {/* Headline */}
        <h1 className="font-display font-extrabold text-[1.625rem] md:text-[2rem] text-white leading-[1.2] mb-3 max-w-[640px]">
          {renderTitle(title)}
        </h1>

        {/* Subtitle */}
        <p
          className="font-body text-sm md:text-base leading-[1.75] mb-7 max-w-[520px]"
          style={{ color: 'rgba(255,255,255,0.70)' }}
        >
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Button variant="light" href={primaryCta.href}>
            {primaryCta.label}
          </Button>
          <Button variant="ghost" href={secondaryCta.href}>
            {secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}

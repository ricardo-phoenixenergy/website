// src/components/ui/ClosingBand.tsx
// The rounded dark band at the foot of a project or a post. It holds the
// booking button, which sends cta_click, and a ghost link back to the index.
// The copy sits left and the buttons right from 768px; below that they stack.
// With no section above it (no next project, no more articles), it keeps the
// gap between parts itself.
import { Button } from '@/components/ui/Button';
import { TrackedButton } from '@/components/ui/TrackedButton';
import { IconArrowRight } from '@/components/ui/Icons';
import type { Cta } from '@/config/ctas';
import { cn } from '@/lib/utils';

interface ClosingBandProps {
  eyebrow: string;
  heading: string;
  body: string;
  primary: Cta;
  /** cta_click's cta_location, for example "project_band:31-sacks-circle". */
  primaryLocation: string;
  secondary: Cta;
  /** No section sits between the content and the band, so it keeps the gap itself. */
  afterContent?: boolean;
}

export function ClosingBand({ eyebrow, heading, body, primary, primaryLocation, secondary, afterContent = false }: ClosingBandProps) {
  return (
    <div className={cn('page-container py-5', afterContent && 'mt-5 md:mt-7 lg:mt-11')}>
      <div
        className="focus-on-dark rounded-2xl border border-white/10 px-7 py-8 md:px-10 md:py-10"
        style={{ background: 'linear-gradient(135deg, var(--color-pe-band-from) 0%, var(--color-pe-nav-dark) 100%)' }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="md:max-w-sm">
            <p className="mb-2 font-body text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--color-on-dark-subtle)' }}>
              {eyebrow}
            </p>
            <h2 className="mb-2.5 font-display text-xl font-extrabold leading-[1.2] text-white md:text-2xl">{heading}</h2>
            <p className="font-body text-sm leading-[1.7]" style={{ color: 'var(--color-on-dark-subtle)' }}>
              {body}
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <TrackedButton variant="light" href={primary.href} ctaLabel={primary.label} ctaLocation={primaryLocation}>
              {primary.label} <IconArrowRight />
            </TrackedButton>
            <Button variant="ghost" href={secondary.href}>
              {secondary.label} <IconArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

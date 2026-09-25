import { AnimatedSection } from './AnimatedSection';
import { ArrowLink } from './ArrowLink';

interface SectionCarouselProps {
  label: string;
  title: React.ReactNode;
  viewAllHref: string;
  viewAllLabel: string;
  bg?: 'white' | 'gray';
  /** When true, sits flush under a same-background section: no top padding. Default: false */
  flushTop?: boolean;
  /** Lay the items out as a static grid of this many columns instead of a scroller (few items). */
  gridColumns?: 2 | 3;
  children: React.ReactNode;
}

export function SectionCarousel({
  label,
  title,
  viewAllHref,
  viewAllLabel,
  bg = 'white',
  flushTop = false,
  gridColumns,
  children,
}: SectionCarouselProps) {
  return (
    <section
      className={`${bg === 'gray' ? 'bg-pe-bg' : 'bg-white'} pb-16 md:pb-24 ${flushTop ? '' : 'pt-16 md:pt-24'}`}
    >
      <AnimatedSection>
        {/* The link sits beside the heading, and drops under it when both don't
            fit (at 320px, "View published projects" beside "Projects"). */}
        <div className="page-container flex flex-wrap items-end justify-between gap-x-4 gap-y-2 mb-6">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-2">
              {label}
            </p>
            <h2 className="font-display font-extrabold text-3xl text-pe-text leading-[1.2]">
              {title}
            </h2>
          </div>
          <ArrowLink href={viewAllHref} className="shrink-0">
            {viewAllLabel}
          </ArrowLink>
        </div>
      </AnimatedSection>

      <div className="page-container">
        {gridColumns ? (
          <div className={`grid grid-cols-1 gap-4 ${gridColumns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
            {children}
          </div>
        ) : (
          <div className="flex gap-3.5 overflow-x-auto scrollbar-none pt-3 -mt-3 pb-4">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

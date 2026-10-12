// src/components/sections/ServiceAreaList.tsx
// "Areas we work in" on a location page: the towns and industrial areas by
// municipality. White, because it follows the grey FinancingBand.
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { inkFor } from '@/types/solutions';
import type { PlaceGroup } from '@/types/locations';

export interface ServiceAreaListProps {
  eyebrow: string;
  heading: string;
  groups: PlaceGroup[];
  accent: string;
}

export function ServiceAreaList({ eyebrow, heading, groups, accent }: ServiceAreaListProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="page-container">
        <AnimatedSection className="max-w-2xl mb-9">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: inkFor(accent) }}>
            {eyebrow}
          </p>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-pe-text leading-[1.2]">{heading}</h2>
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <AnimatedSection key={group.name} as="div">
              <h3 className="font-display font-bold text-base text-pe-text mb-2">{group.name}</h3>
              <p className="font-body text-sm leading-[1.7] text-pe-muted">{group.places.join(', ')}.</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

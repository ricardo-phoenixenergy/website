'use client';

import type { CompanyStat } from '@/types/sanity';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedStatValue } from '@/components/ui/AnimatedStatValue';
import { statAsOfCaption } from '@/lib/companyStats';

interface Props {
  stats: CompanyStat[];
}

/** Standalone "By the numbers" track-record strip with symmetric vertical padding. */
export function CompanyStats({ stats }: Props) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-24" style={{ borderTop: '1px solid #E5E7EB' }}>
      <div className="page-container">
        <AnimatedSection>
          <p className="text-center font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-8 md:mb-10">
            By the numbers
          </p>
          <div className="flex flex-col md:flex-row gap-8 md:gap-4">
            {stats.map((stat, i) => {
              const asOf = statAsOfCaption(stat);
              return (
                <div key={stat.label} className="flex-1 flex flex-col items-center text-center">
                  <span className="font-display font-extrabold text-3xl md:text-4xl text-pe-text leading-none whitespace-nowrap">
                    <AnimatedStatValue value={stat.value} delay={i * 0.12} />
                  </span>
                  <span className="mt-3 h-[3px] w-6 rounded-full" style={{ background: 'var(--color-pe-secondary)' }} />
                  <span className="mt-3 font-body text-xs font-semibold uppercase tracking-[0.08em] text-pe-muted">
                    {stat.label}
                  </span>
                  {asOf && <span className="mt-1 font-body text-xs text-pe-muted">{asOf}</span>}
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

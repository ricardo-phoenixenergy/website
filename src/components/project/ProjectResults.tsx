// src/components/project/ProjectResults.tsx
// The Impact card: up to four figures, each with its note on the period and
// baseline when set. It's white, overlaps the hero's foot by 60px from 768px,
// and on phones sits 24px under the hero text with a border instead of a
// shadow. The heading keeps the id `results-heading`. The card ends after the
// figures.
import type { ProjectResult } from '@/types/sanity';

interface ProjectResultsProps {
  results: ProjectResult[];
}

export function ProjectResults({ results }: ProjectResultsProps) {
  const figures = results.slice(0, 4);
  if (figures.length === 0) return null;

  return (
    <section aria-labelledby="results-heading" className="page-container relative z-10 mt-6 md:-mt-[60px]">
      <div className="rounded-card border border-pe-border bg-white p-5 md:border-transparent md:px-7 md:pb-6 md:pt-6 md:shadow-[0_12px_32px_color-mix(in_srgb,var(--color-pe-nav-dark)_12%,transparent)]">
        <h2 id="results-heading" className="font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted">
          Impact
        </h2>

        {/* The value leads, then the label and the note; the list keeps label, value, note, the order a screen reader wants. */}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4 lg:gap-x-6">
          {figures.map((figure, i) => (
            <div key={`${figure.label}-${i}`} className="flex flex-col gap-2">
              <dt className="order-2 font-body text-sm leading-snug text-pe-text-soft">{figure.label}</dt>
              <dd className="order-1 font-display text-[28px] font-extrabold leading-none text-pe-nav-dark lg:text-4xl">{figure.value}</dd>
              {figure.note?.trim() && <dd className="order-3 -mt-1 font-body text-xs leading-snug text-pe-muted">{figure.note.trim()}</dd>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

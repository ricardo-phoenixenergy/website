// src/components/project/ProjectResults.tsx
// The results card: up to four figures under "Projected results" or "Measured
// results" (src/lib/projectResults.ts), with the date of the model, the basis
// sentence and a link to the disclaimer. It's white, overlaps the hero's foot by
// 60px from 768px, and on phones sits 24px under the hero text with a border
// instead of a shadow. The heading keeps the id `results-heading`. Step 2 adds a
// note under each figure and "How we calculated this".
import { ArrowLink } from '@/components/ui/ArrowLink';
import type { ProjectMetric } from '@/types/sanity';
import type { ResultsLabelling } from '@/lib/projectResults';

interface ProjectResultsProps {
  results: ProjectMetric[];
  labelling: ResultsLabelling;
}

export function ProjectResults({ results, labelling }: ProjectResultsProps) {
  const figures = results.slice(0, 4);
  if (figures.length === 0) return null;

  return (
    <section aria-labelledby="results-heading" className="page-container relative z-10 mt-6 md:-mt-[60px]">
      <div className="rounded-card border border-pe-border bg-white p-5 md:border-transparent md:px-7 md:pb-5 md:pt-6 md:shadow-[0_12px_32px_color-mix(in_srgb,var(--color-pe-nav-dark)_12%,transparent)]">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 id="results-heading" className="font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted">
            {labelling.heading}
          </h2>
          {labelling.asOf && <p className="font-body text-sm text-pe-muted">as of {labelling.asOf}</p>}
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4 lg:gap-x-6">
          {figures.map((figure, i) => (
            <div key={`${figure.label}-${i}`} className="flex flex-col-reverse justify-end gap-2">
              <dt className="font-body text-sm leading-snug text-pe-text-soft">{figure.label}</dt>
              <dd className="font-display text-[28px] font-extrabold leading-none text-pe-nav-dark lg:text-4xl">{figure.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-col gap-2 border-t border-pe-border pt-4 md:flex-row md:items-center md:justify-between md:gap-6">
          {labelling.note && <p className="max-w-[70ch] font-body text-sm leading-relaxed text-pe-muted">{labelling.note}</p>}
          <ArrowLink href="/disclaimer" className="min-h-11 shrink-0">
            Read the disclaimer
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}

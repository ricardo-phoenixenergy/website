// src/components/project/ProjectResults.tsx
// The results card: up to four figures under "Projected results" or "Measured
// results" (src/lib/projectResults.ts), each with its note on the period and
// baseline when set, and the date of the model. It's white, overlaps the hero's
// foot by 60px from 768px, and on phones sits 24px under the hero text with a
// border instead of a shadow. The heading keeps the id `results-heading`.
// The foot holds the basis sentence, then "How we calculated this", a native
// <details> listing the calculation inputs and ending with "Read the
// disclaimer". Without inputs there's no disclosure, and the link follows the
// sentence. A <details> shows its content inside its own box, so the disclosure
// sits under the sentence rather than beside it, and opens across the card.
import { ArrowLink } from '@/components/ui/ArrowLink';
import { IconChevronDown } from '@/components/ui/Icons';
import type { ProjectMetric, ProjectResult } from '@/types/sanity';
import type { ResultsLabelling } from '@/lib/projectResults';

interface ProjectResultsProps {
  results: ProjectResult[];
  labelling: ResultsLabelling;
  /** "How we calculated this": the inputs behind the figures. */
  inputs?: ProjectMetric[];
}

export function ProjectResults({ results, labelling, inputs = [] }: ProjectResultsProps) {
  const figures = results.slice(0, 4);
  if (figures.length === 0) return null;
  const note = labelling.note && <p className="max-w-[70ch] font-body text-sm leading-relaxed text-pe-muted">{labelling.note}</p>;
  const disclaimer = (
    <ArrowLink href="/disclaimer" className="min-h-11 shrink-0">
      Read the disclaimer
    </ArrowLink>
  );

  return (
    <section aria-labelledby="results-heading" className="page-container relative z-10 mt-6 md:-mt-[60px]">
      <div className="rounded-card border border-pe-border bg-white p-5 md:border-transparent md:px-7 md:pb-5 md:pt-6 md:shadow-[0_12px_32px_color-mix(in_srgb,var(--color-pe-nav-dark)_12%,transparent)]">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 id="results-heading" className="font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted">
            {labelling.heading}
          </h2>
          {labelling.asOf && <p className="font-body text-sm text-pe-muted">as of {labelling.asOf}</p>}
        </div>

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

        {inputs.length > 0 ? (
          <div className="mt-5 border-t border-pe-border pt-4">
            {note}
            <details className="group mt-1">
              <summary className="flex min-h-11 w-fit list-none items-center gap-1.5 font-body text-sm font-semibold text-pe-primary [&::-webkit-details-marker]:hidden">
                How we calculated this
                <IconChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
              </summary>
              {/* The label takes the row's free space and wraps first, as in the facts rows, so a
                  short value such as "0.5% a year" stays whole in a 280px column. */}
              <dl className="mt-1 grid grid-cols-1 gap-x-8 lg:grid-cols-3">
                {inputs.map((input, i) => (
                  <div key={`${input.label}-${i}`} className="flex items-baseline justify-between gap-3.5 border-b border-pe-border py-2">
                    <dt className="flex-1 font-body text-sm text-pe-muted">{input.label}</dt>
                    <dd className="min-w-0 break-words text-right font-body text-sm text-pe-text">{input.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-2">{disclaimer}</div>
            </details>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-2 border-t border-pe-border pt-4 md:flex-row md:items-center md:justify-between md:gap-6">
            {note}
            {disclaimer}
          </div>
        )}
      </div>
    </section>
  );
}

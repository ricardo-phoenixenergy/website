// src/components/project/ProjectFacts.tsx
// "Project facts" in its three versions:
// - panel: beside the story from 1024px, with every group;
// - compact: below 1024px, with the main rows open and the rest under
//   "All project facts";
// - columns: full width from 1024px when there's no story, with the booking
//   row at its foot.
// Each version ends with the service's booking button and the reply promise.
// Each has its own heading id (project-facts-{variant}), so a page can render
// two versions and hide one. A row with more than one line (Financing,
// Approvals) puts each line on its own.
import Link from 'next/link';
import { TrackedButton } from '@/components/ui/TrackedButton';
import { IconArrowRight, IconChevronDown } from '@/components/ui/Icons';
import { REPLY_PROMISE } from '@/config/contact';
import type { Cta } from '@/config/ctas';
import { factColumnsClass, splitMainRows, type FactGroup, type FactLine, type FactRow } from '@/lib/projectFacts';
import { cn } from '@/lib/utils';

export type FactsVariant = 'panel' | 'compact' | 'columns';

interface ProjectFactsProps {
  groups: FactGroup[];
  variant: FactsVariant;
  cta: Cta;
  /** cta_click's cta_location, for example "project_facts:31-sacks-circle". */
  ctaLocation: string;
  className?: string;
}

function Line({ line }: { line: FactLine }) {
  return line.href ? (
    <Link href={line.href} className="font-semibold text-pe-primary underline-offset-2 hover:underline">
      {line.text}
    </Link>
  ) : (
    <>{line.text}</>
  );
}

// The label takes the row's free space and wraps first, so a short value such as
// "80 kWh" keeps its own width on a 320px phone rather than splitting over two lines.
// A long unbroken value (a model number or a URL) still wraps inside the panel: the
// value has min-w-0 and break-words, and the label keeps at least its longest word.
function Rows({ rows }: { rows: FactRow[] }) {
  return (
    <dl>
      {rows.map((row) => (
        <div key={row.key} className="flex items-baseline justify-between gap-3.5 border-b border-pe-border py-2 last:border-b-0">
          <dt className="flex-1 font-body text-sm text-pe-muted">{row.label}</dt>
          <dd className="min-w-0 break-words text-right font-body text-sm text-pe-text">
            {row.lines.length === 1 ? (
              <Line line={row.lines[0]} />
            ) : (
              row.lines.map((line, i) => (
                <span key={`${row.key}-${i}`} className="block">
                  <Line line={line} />
                </span>
              ))
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Group({ group }: { group: FactGroup }) {
  return (
    <div>
      <h3 className="font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted">{group.title}</h3>
      <div className="mt-1">
        <Rows rows={group.rows} />
      </div>
    </div>
  );
}

function Booking({ cta, ctaLocation, fullWidth }: { cta: Cta; ctaLocation: string; fullWidth: boolean }) {
  return (
    <TrackedButton href={cta.href} ctaLabel={cta.label} ctaLocation={ctaLocation} className={fullWidth ? 'w-full' : 'shrink-0'}>
      {cta.label} <IconArrowRight />
    </TrackedButton>
  );
}

export function ProjectFacts({ groups, variant, cta, ctaLocation, className }: ProjectFactsProps) {
  const headingId = `project-facts-${variant}`;

  if (variant === 'compact') {
    const { main, rest } = splitMainRows(groups);
    return (
      <section aria-labelledby={headingId} className={cn('rounded-card border border-pe-border bg-white p-5 sm:p-6', className)}>
        <h2 id={headingId} className="font-display text-lg font-extrabold text-pe-text">
          Project facts
        </h2>
        {main.length > 0 && (
          <div className="mt-2">
            <Rows rows={main} />
          </div>
        )}
        {rest.length > 0 && (
          <details className="group mt-2 border-t border-pe-border">
            <summary className="flex min-h-11 list-none items-center justify-between font-body text-sm font-semibold text-pe-primary [&::-webkit-details-marker]:hidden">
              All project facts
              <IconChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
            </summary>
            <div className="flex flex-col gap-4 pb-2">
              {rest.map((group) => (
                <Group key={group.key} group={group} />
              ))}
            </div>
          </details>
        )}
        <div className="mt-4">
          <Booking cta={cta} ctaLocation={ctaLocation} fullWidth />
          <p className="mt-2 text-center font-body text-xs text-pe-muted">{REPLY_PROMISE.sentence}</p>
        </div>
      </section>
    );
  }

  if (variant === 'columns') {
    return (
      <section aria-labelledby={headingId} className={cn('rounded-card border border-pe-border bg-white p-6', className)}>
        <h2 id={headingId} className="font-display text-lg font-extrabold text-pe-text">
          Project facts
        </h2>
        <div className={cn('mt-3 grid gap-x-8 gap-y-4', factColumnsClass(groups.length))}>
          {groups.map((group) => (
            <Group key={group.key} group={group} />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-6 border-t border-pe-border pt-5">
          <p className="font-body text-sm text-pe-muted">Planning something similar? {REPLY_PROMISE.sentence}</p>
          <Booking cta={cta} ctaLocation={ctaLocation} fullWidth={false} />
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={headingId} className={cn('rounded-card border border-pe-border bg-white p-6', className)}>
      <h2 id={headingId} className="font-display text-lg font-extrabold text-pe-text">
        Project facts
      </h2>
      <div className="mt-2 flex flex-col gap-4">
        {groups.map((group) => (
          <Group key={group.key} group={group} />
        ))}
      </div>
      <div className="mt-5">
        <Booking cta={cta} ctaLocation={ctaLocation} fullWidth />
        <p className="mt-2 text-center font-body text-xs text-pe-muted">{REPLY_PROMISE.sentence}</p>
      </div>
    </section>
  );
}

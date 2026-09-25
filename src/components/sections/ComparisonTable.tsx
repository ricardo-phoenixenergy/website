// src/components/sections/ComparisonTable.tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { inkFor } from '@/types/solutions';

export interface ComparisonRow {
  dimension: string;
  oldModel: string;
  newModel: string;
}

export interface ComparisonTableProps {
  eyebrow?: string;
  heading?: string;   // supports <em>
  columns: [string, string, string];
  rows: ComparisonRow[];
  accent?: string;
  id?: string;
}

function renderHeading(raw: string, accent: string) {
  return raw.split(/(<em>.*?<\/em>)/g).map((part, i) => {
    const m = part.match(/^<em>(.*)<\/em>$/);
    return m
      ? <em key={i} style={{ color: inkFor(accent), fontStyle: 'normal' }}>{m[1]}</em>
      : <span key={i}>{part}</span>;
  });
}

export function ComparisonTable({
  eyebrow,
  heading,
  columns,
  rows,
  accent = '#C97A40',
  id,
}: ComparisonTableProps) {
  const headingId = heading && id ? `${id}-heading` : undefined;
  return (
    <section id={id} className="bg-pe-bg py-16 md:py-24">
      <div className="page-container">
        {(eyebrow || heading) && (
          <AnimatedSection className="max-w-2xl mb-9">
            {eyebrow && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: inkFor(accent) }}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 id={headingId} className="font-display font-extrabold text-2xl md:text-3xl text-pe-text leading-[1.2]">
                {renderHeading(heading, accent)}
              </h2>
            )}
          </AnimatedSection>
        )}

        {/* The table scrolls sideways on phones, so its box is a named, focusable
            region: keyboard users can scroll it with the arrow keys. */}
        <AnimatedSection>
          <div
            role="region"
            aria-labelledby={headingId}
            aria-label={headingId ? undefined : columns.filter(Boolean).join(' and ')}
            tabIndex={0}
            className="overflow-x-auto rounded-2xl border border-pe-border bg-white"
          >
            <table className="w-full border-collapse min-w-[680px]">
              <thead>
                <tr>
                  <th className="text-left font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted py-4 px-5 w-[20%]">
                    {columns[0]}
                  </th>
                  <th className="text-left font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted py-4 px-5">
                    {columns[1]}
                  </th>
                  <th className="text-left font-body text-xs font-bold uppercase tracking-[0.1em] py-4 px-5" style={{ color: inkFor(accent) }}>
                    {columns[2]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.dimension} className="border-t border-pe-border">
                    <td className="align-top py-4 px-5 font-display font-bold text-sm text-pe-text">
                      {r.dimension}
                    </td>
                    <td className="align-top py-4 px-5 font-body text-sm text-pe-muted leading-[1.6]">
                      {r.oldModel}
                    </td>
                    <td className="align-top py-4 px-5 font-body text-sm text-pe-text leading-[1.6]" style={{ background: `${accent}0D` }}>
                      {r.newModel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

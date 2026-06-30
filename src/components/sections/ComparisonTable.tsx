// src/components/sections/ComparisonTable.tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection';

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
      ? <em key={i} style={{ color: accent, fontStyle: 'normal' }}>{m[1]}</em>
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
  return (
    <section id={id} className="bg-[#F5F5F5] py-16 md:py-24">
      <div className="page-container">
        {(eyebrow || heading) && (
          <AnimatedSection className="max-w-2xl mb-9">
            {eyebrow && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: accent }}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2]">
                {renderHeading(heading, accent)}
              </h2>
            )}
          </AnimatedSection>
        )}

        <AnimatedSection className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white">
          <table className="w-full border-collapse min-w-[680px]">
            <thead>
              <tr>
                <th className="text-left font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] py-4 px-5 w-[20%]">
                  {columns[0]}
                </th>
                <th className="text-left font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] py-4 px-5">
                  {columns[1]}
                </th>
                <th className="text-left font-body text-xs font-bold uppercase tracking-[0.1em] py-4 px-5" style={{ color: accent }}>
                  {columns[2]}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.dimension} className="border-t border-[#E5E7EB]">
                  <td className="align-top py-4 px-5 font-display font-bold text-sm text-[#1A1A1A]">
                    {r.dimension}
                  </td>
                  <td className="align-top py-4 px-5 font-body text-sm text-[#6B7280] leading-[1.6]">
                    {r.oldModel}
                  </td>
                  <td className="align-top py-4 px-5 font-body text-sm text-[#1A1A1A] leading-[1.6]" style={{ background: `${accent}0D` }}>
                    {r.newModel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AnimatedSection>
      </div>
    </section>
  );
}

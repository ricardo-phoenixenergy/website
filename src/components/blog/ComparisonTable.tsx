// src/components/blog/ComparisonTable.tsx
// A comparison table inside the article (for example Tariff C against Tariff
// E), in the site's white panel. It is a real <table>, so search engines can lift
// it and screen readers announce each value with its row and column:
// - the caption names what is compared, in the panel's 16px title style;
// - the column headings use the facts panel's 12px uppercase labels;
// - each row starts with its label as a row heading, then one value per column,
//   on the facts rows' pe-border rules, with tabular figures.
// A short row gets empty cells, so every row is as wide as the header. Up to
// three value columns fit a phone by wrapping; a wider table keeps its columns
// and scrolls sideways inside a named, focusable region instead of widening
// the page.

export interface ComparisonRow {
  _key?: string;
  label: string;
  values?: string[];
}

interface ComparisonTableProps {
  caption?: string;
  /** Heading of the label column; read by screen readers only when empty. */
  labelHeader?: string;
  columns?: string[];
  rows?: ComparisonRow[];
}

const CELL = 'px-2 py-3 align-top first:pl-4 last:pr-4 sm:px-3 sm:first:pl-5 sm:last:pr-5 md:first:pl-6 md:last:pr-6';

export function ComparisonTable({ caption, labelHeader, columns = [], rows = [] }: ComparisonTableProps) {
  const heads = columns.map((column) => column?.trim() ?? '');
  const body = rows.filter((row) => row.label?.trim());
  if (heads.length === 0 || body.length === 0) return null;
  const wide = heads.length > 3;
  const title = caption?.trim();

  const table = (
    <table className={`w-full border-collapse text-left tabular-nums ${wide ? 'min-w-[40rem]' : ''}`}>
      {title && (
        <caption className="px-4 pb-3 pt-5 text-left font-display text-base font-bold leading-6 text-pe-text sm:px-5 md:px-6">{title}</caption>
      )}
      <thead>
        <tr className="border-b border-pe-border">
          <th scope="col" className={`${CELL} w-[30%] font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted`}>
            {labelHeader?.trim() || <span className="sr-only">Item</span>}
          </th>
          {heads.map((head, i) => (
            <th key={`${head}-${i}`} scope="col" className={`${CELL} font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted`}>
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, r) => (
          <tr key={row._key ?? `${row.label}-${r}`} className="border-b border-pe-border last:border-b-0">
            <th scope="row" className={`${CELL} font-body text-sm font-semibold leading-snug text-pe-text`}>
              {row.label.trim()}
            </th>
            {heads.map((_, c) => (
              <td key={c} className={`${CELL} font-body text-sm leading-snug text-pe-text-soft`}>
                {row.values?.[c]?.trim() ?? ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <figure className="my-8 overflow-hidden rounded-card border border-pe-border bg-white">
      {wide ? (
        <div role="region" aria-label={title || 'Comparison table'} tabIndex={0} className="overflow-x-auto">
          {table}
        </div>
      ) : (
        table
      )}
    </figure>
  );
}

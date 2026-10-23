// src/components/blog/BarChart.tsx
// A horizontal bar chart inside the article (for example the yearly saving by
// what runs a pump today), in the same white panel as the comparison table.
// It is drawn in HTML, so it renders on the server and needs no chart script:
// - the title names what is plotted, in the table caption's 16px style;
// - each bar sits under its label, grows from one hairline baseline, is 20px
//   thick with a 4px rounded end, and carries its value at the tip in text ink;
// - a bar with an upper figure (a range) continues past a 2px gap in a lighter
//   tint of the same teal, and a key under the chart says what the tint means;
// - the footnote holds the basis, the dates and the sources.
// One series, so one colour and no legend. Every value is labelled, so there is
// no axis. The drawing is hidden from screen readers, which get the same
// figures as a table instead.

export interface BarChartBar {
  _key?: string;
  label: string;
  value: number;
  /** The upper end, when the figure is a range. */
  upTo?: number;
  /** The figure as read, for example "R114k to R190k". */
  valueLabel: string;
}

interface BarChartProps {
  title?: string;
  bars?: BarChartBar[];
  note?: string;
}

// The value label at the tip needs room at the end of the longest bar.
const LABEL_ROOM = '8.5rem';
const width = (fraction: number) => `calc((100% - ${LABEL_ROOM}) * ${fraction})`;

export function BarChart({ title, bars = [], note }: BarChartProps) {
  const shown = bars.filter((bar) => bar.label?.trim() && Number.isFinite(bar.value) && bar.value > 0);
  if (shown.length === 0) return null;
  const max = Math.max(...shown.map((bar) => Math.max(bar.value, bar.upTo ?? 0)));
  const ranged = shown.some((bar) => (bar.upTo ?? 0) > bar.value);
  const heading = title?.trim();

  return (
    <figure className="my-8 rounded-card border border-pe-border bg-white px-4 py-5 sm:px-5 md:px-6">
      {heading && <figcaption className="pb-4 font-display text-base font-bold leading-6 text-pe-text">{heading}</figcaption>}
      <div aria-hidden="true" className="flex flex-col gap-4 border-l border-pe-border">
        {shown.map((bar, i) => {
          const range = (bar.upTo ?? 0) > bar.value ? (bar.upTo as number) - bar.value : 0;
          return (
            <div key={bar._key ?? `${bar.label}-${i}`} className="flex flex-col gap-1.5">
              <span className="pl-3 font-body text-sm font-semibold leading-snug text-pe-text">{bar.label.trim()}</span>
              <div className="flex items-center gap-[2px]">
                <span className={`h-5 bg-pe-secondary-ink ${range ? '' : 'rounded-r-[4px]'}`} style={{ width: width(bar.value / max) }} />
                {range > 0 && <span className="h-5 rounded-r-[4px] bg-pe-secondary-ink/45" style={{ width: width(range / max) }} />}
                <span className="pl-2 font-body text-sm leading-snug text-pe-text-soft tabular-nums whitespace-nowrap">{bar.valueLabel?.trim()}</span>
              </div>
            </div>
          );
        })}
      </div>
      {ranged && (
        <p aria-hidden="true" className="mt-4 flex items-center gap-2 font-body text-xs leading-5 text-pe-muted">
          <span className="inline-block h-2.5 w-4 rounded-[2px] bg-pe-secondary-ink/45" />
          Range, from the low to the high estimate
        </p>
      )}
      <table className="sr-only">
        {heading && <caption>{heading}</caption>}
        <tbody>
          {shown.map((bar, i) => (
            <tr key={bar._key ?? `${bar.label}-${i}`}>
              <th scope="row">{bar.label.trim()}</th>
              <td>{bar.valueLabel?.trim()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {note?.trim() && <p className="mt-4 border-t border-pe-border pt-3 font-body text-xs leading-5 text-pe-muted">{note.trim()}</p>}
    </figure>
  );
}

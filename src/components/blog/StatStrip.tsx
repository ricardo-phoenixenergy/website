// src/components/blog/StatStrip.tsx
// Up to four figures, drawn as the project page's Impact card: a white panel,
// each value in Plus Jakarta Sans 800 Night Teal (28px) over its label (14px,
// sentence case as the editor wrote it). Figures stack on phones and share a
// row from 640px. As a list of terms and values, a screen reader reads each
// label with its figure.
interface Stat {
  value: string;
  label: string;
}

interface StatStripProps {
  stats: Stat[];
}

const COLUMNS = ['', 'sm:grid-cols-1', 'sm:grid-cols-2', 'sm:grid-cols-3', 'sm:grid-cols-4'] as const;

export function StatStrip({ stats }: StatStripProps) {
  const shown = stats.filter((stat) => stat.value?.trim()).slice(0, 4);
  if (shown.length === 0) return null;
  return (
    <dl className={`my-8 grid grid-cols-1 gap-x-6 gap-y-5 rounded-card border border-pe-border bg-white px-5 py-5 md:px-6 md:py-6 ${COLUMNS[shown.length]}`}>
      {shown.map((stat, i) => (
        <div key={`${stat.label}-${i}`} className="flex flex-col gap-2">
          <dt className="order-2 font-body text-sm leading-snug text-pe-text-soft">{stat.label}</dt>
          <dd className="order-1 font-display text-[28px] font-extrabold leading-none text-pe-nav-dark tabular-nums">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

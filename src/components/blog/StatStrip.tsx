// src/components/blog/StatStrip.tsx
// Up to four figures in a Night Teal strip: the value at the scale's stat size
// (24px) and its label in on-dark-muted, which keeps 12px text above 4.5:1.
// On phones the figures stack, one per row; from 640px they share a row.
interface Stat {
  value: string;
  label: string;
}

interface StatStripProps {
  stats: Stat[];
}

const COLUMNS = ['', 'sm:grid-cols-1', 'sm:grid-cols-2', 'sm:grid-cols-3', 'sm:grid-cols-4'] as const;

export function StatStrip({ stats }: StatStripProps) {
  const shown = stats.slice(0, 4);
  if (shown.length === 0) return null;
  return (
    <div className={`my-6 grid grid-cols-1 overflow-hidden rounded-xl bg-pe-nav-dark ${COLUMNS[shown.length]}`}>
      {shown.map((stat, i) => (
        <div
          key={i}
          className="border-b border-white/10 px-4 py-4 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
        >
          <p className="font-display text-2xl font-extrabold leading-none text-white">{stat.value}</p>
          <p className="mt-2 font-body text-xs uppercase leading-[1.4] tracking-[0.08em] text-on-dark-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

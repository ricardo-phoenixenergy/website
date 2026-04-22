interface Stat {
  value: string;
  label: string;
}

interface StatStripProps {
  stats: Stat[];
}

export function StatStrip({ stats }: StatStripProps) {
  const cols = Math.min(stats.length, 4);
  return (
    <div
      className="my-5 rounded-xl overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        background: '#39575C',
      }}
    >
      {stats.slice(0, 4).map((stat, i) => (
        <div
          key={i}
          className="py-3.5 px-3 text-center"
          style={{
            borderRight: i < cols - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
          }}
        >
          <p className="font-display font-extrabold text-lg text-white leading-none mb-1">
            {stat.value}
          </p>
          <p
            className="font-body uppercase tracking-[0.08em]"
            style={{ fontSize: 9, color: 'rgba(255,255,255,0.50)' }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

import { cn } from '@/lib/utils';

interface Stat {
  value: string;
  label: string;
}

interface StatsStripProps {
  stats: Stat[];
  className?: string;
  responsive?: boolean;
}

export function StatsStrip({ stats, className, responsive = false }: StatsStripProps) {
  return (
    <div className={cn('bg-[#39575C]', className)}>
      <div
        className={cn(
          'max-w-[960px] mx-auto px-5 py-3.5',
          responsive
            ? 'grid grid-cols-2 md:grid-cols-4 gap-y-3'
            : 'grid',
        )}
        style={
          responsive
            ? undefined
            : { gridTemplateColumns: `repeat(${stats.length}, 1fr)` }
        }
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center relative"
            style={
              !responsive && i < stats.length - 1
                ? { borderRight: '1px solid rgba(255,255,255,0.15)' }
                : undefined
            }
          >
            <span className="font-display font-extrabold text-xl md:text-2xl text-white leading-none">
              {stat.value}
            </span>
            <span
              className="font-body text-xs font-normal uppercase tracking-[0.07em] mt-1"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

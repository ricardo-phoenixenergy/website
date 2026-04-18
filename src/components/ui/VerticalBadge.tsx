import { SOLUTION_META } from '@/types/solutions';
import type { SolutionVertical } from '@/types/solutions';
import { cn } from '@/lib/utils';

interface VerticalBadgeProps {
  vertical: SolutionVertical;
  size?: 'sm' | 'md';
  className?: string;
  /** Use on dark backgrounds — adds opacity overlay instead of solid bg */
  dark?: boolean;
}

export function VerticalBadge({ vertical, size = 'sm', className, dark = false }: VerticalBadgeProps) {
  const meta = SOLUTION_META[vertical];
  const dotSize = size === 'md' ? 7 : 5;
  const textSize = size === 'md' ? 'text-xs' : 'text-xs';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-body font-bold uppercase tracking-[0.12em] px-2.5 py-1',
        textSize,
        className,
      )}
      style={{
        background: dark
          ? `rgba(${hexToRgb(meta.accent)}, 0.18)`
          : `${meta.accent}1a`,
        color: dark ? meta.accent : meta.accentText,
      }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{
          width: dotSize,
          height: dotSize,
          background: meta.accent,
        }}
      />
      {meta.label}
    </span>
  );
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

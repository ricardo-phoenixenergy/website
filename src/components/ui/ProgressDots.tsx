'use client';

interface ProgressDotsProps {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  /** Accessible name for each dot, e.g. (i) => `Go to step ${i + 1}`. */
  labelFor: (index: number) => string;
  activeColor: string;
  inactiveColor?: string;
  /** Colour for dots before the active one (progress already made). Defaults to inactiveColor. */
  doneColor?: string;
  /** Visible dot height in px; the active dot stretches to a pill. */
  dotSize?: number;
  activeWidth?: number;
  className?: string;
}

/**
 * Small visible dots with 24px hit areas (WCAG 2.5.8), for steppers and carousels.
 */
export function ProgressDots({
  count,
  active,
  onSelect,
  labelFor,
  activeColor,
  inactiveColor = '#E5E7EB',
  doneColor,
  dotSize = 8,
  activeWidth = 24,
  className = '',
}: ProgressDotsProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const isActive = i === active;
        const background = isActive ? activeColor : i < active && doneColor ? doneColor : inactiveColor;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={labelFor(i)}
            aria-current={isActive ? 'step' : undefined}
            className="flex h-6 min-w-6 items-center justify-center rounded-full px-1"
          >
            <span
              aria-hidden="true"
              className="block rounded-full transition-all duration-300"
              style={{ width: isActive ? activeWidth : dotSize, height: dotSize, background }}
            />
          </button>
        );
      })}
    </div>
  );
}

// src/components/tools/RangeSlider.tsx
'use client';

import { useId } from 'react';

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  hint?: string;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
}

export function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  hint,
  onChange,
  formatValue,
}: RangeSliderProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const pct = ((value - min) / (max - min)) * 100;
  const display = formatValue ? formatValue(value) : `${value} ${unit}`;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <label htmlFor={id} className="font-body font-semibold text-xs text-pe-text">{label}</label>
        <span aria-hidden="true" className="font-display font-bold text-sm text-pe-primary">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        aria-describedby={hintId}
        onChange={e => onChange(Number(e.target.value))}
        className="range-slider w-full"
        style={{
          background: `linear-gradient(to right, var(--color-pe-primary) ${pct}%, var(--color-pe-border) ${pct}%)`,
        }}
      />
      {hint && (
        <p id={hintId} className="font-body text-xs text-pe-muted mt-1.5">{hint}</p>
      )}
    </div>
  );
}

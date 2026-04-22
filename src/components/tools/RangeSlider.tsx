// src/components/tools/RangeSlider.tsx
'use client';

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
  const pct = ((value - min) / (max - min)) * 100;
  const display = formatValue ? formatValue(value) : `${value} ${unit}`;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <label className="font-body font-semibold text-xs text-[#1A1A1A]">{label}</label>
        <span className="font-display font-bold text-sm text-[#39575C]">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="range-slider w-full"
        style={{
          background: `linear-gradient(to right, #39575C ${pct}%, #E5E7EB ${pct}%)`,
        }}
      />
      {hint && (
        <p className="font-body text-[10px] text-[#9CA3AF] mt-1.5">{hint}</p>
      )}
    </div>
  );
}

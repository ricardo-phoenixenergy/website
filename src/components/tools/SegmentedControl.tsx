// src/components/tools/SegmentedControl.tsx
'use client';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: Option<T>[];
  value: T;
  hint?: string;
  onChange: (v: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  hint,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="mb-5">
      <label className="font-body font-semibold text-xs text-[#1A1A1A] block mb-2">
        {label}
      </label>
      <div
        className="flex rounded-xl overflow-hidden"
        style={{ border: '1px solid #E5E7EB' }}
      >
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex-1 py-2 px-1 font-body text-xs font-medium transition-colors leading-tight"
            style={{
              background: value === opt.value ? '#39575C' : 'white',
              color: value === opt.value ? 'white' : '#6B7280',
              borderRight: i < options.length - 1 ? '1px solid #E5E7EB' : 'none',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {hint && (
        <p className="font-body text-[10px] text-[#9CA3AF] mt-1.5">{hint}</p>
      )}
    </div>
  );
}

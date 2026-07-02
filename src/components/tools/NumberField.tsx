// src/components/tools/NumberField.tsx
'use client';

interface NumberFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  hint?: string;
  onChange: (v: number) => void;
}

export function NumberField({ label, value, min = 0, max, unit, hint, onChange }: NumberFieldProps) {
  const clamp = (n: number) => {
    let v = Number.isNaN(n) ? min : n;
    v = Math.max(min, v);
    if (max != null) v = Math.min(max, v);
    return v;
  };

  return (
    <div className="mb-5">
      <label className="font-body font-semibold text-xs text-[#1A1A1A] block mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^\d]/g, '');
            onChange(clamp(digits === '' ? min : parseInt(digits, 10)));
          }}
          className={`w-full font-body text-sm text-[#1A1A1A] rounded-xl px-4 py-2.5 outline-none bg-white transition-shadow focus:shadow-[0_0_0_3px_rgba(57,87,92,0.08)] ${unit ? 'pr-14' : ''}`}
          style={{ border: '1px solid #E5E7EB' }}
        />
        {unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-body text-xs font-medium text-[#9CA3AF]">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="font-body text-[10px] text-[#9CA3AF] mt-1.5">{hint}</p>}
    </div>
  );
}

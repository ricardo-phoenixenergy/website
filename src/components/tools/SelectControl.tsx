// src/components/tools/SelectControl.tsx
'use client';

const OTHER = '__other__';

interface Option {
  value: string;
  label: string;
}

interface SelectControlProps {
  label: string;
  options: Option[];
  value: string;
  hint?: string;
  /** When true, appends an "Other" entry that reveals a free-text field. */
  allowOther?: boolean;
  otherPlaceholder?: string;
  onChange: (v: string) => void;
}

export function SelectControl({
  label,
  options,
  value,
  hint,
  allowOther = false,
  otherPlaceholder = 'Type the brand name',
  onChange,
}: SelectControlProps) {
  const inOptions = options.some((o) => o.value === value);
  // "Other" mode: allowOther is on and the current value isn't a listed option
  // (covers an empty value as well as a typed-in custom brand).
  const isOther = allowOther && !inOptions;
  const selectValue = inOptions ? value : allowOther ? OTHER : (options[0]?.value ?? '');

  const fieldClass =
    'w-full font-body text-sm text-[#1A1A1A] rounded-xl px-4 py-2.5 outline-none bg-white transition-shadow focus:shadow-[0_0_0_3px_rgba(57,87,92,0.08)]';

  return (
    <div className="mb-5">
      <label className="font-body font-semibold text-xs text-[#1A1A1A] block mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={selectValue}
          onChange={(e) => onChange(e.target.value === OTHER ? '' : e.target.value)}
          className={`${fieldClass} appearance-none pr-10`}
          style={{ border: '1px solid #E5E7EB' }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
          {allowOther && <option value={OTHER}>Other</option>}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {isOther && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={otherPlaceholder}
          className={`${fieldClass} mt-2`}
          style={{ border: '1px solid #E5E7EB' }}
        />
      )}

      {hint && <p className="font-body text-[10px] text-[#9CA3AF] mt-1.5">{hint}</p>}
    </div>
  );
}

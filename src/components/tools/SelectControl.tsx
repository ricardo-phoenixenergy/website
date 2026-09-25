// src/components/tools/SelectControl.tsx
'use client';

import { useId } from 'react';

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
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const inOptions = options.some((o) => o.value === value);
  // "Other" mode: allowOther is on and the current value isn't a listed option
  // (covers an empty value as well as a typed-in custom brand).
  const isOther = allowOther && !inOptions;
  const selectValue = inOptions ? value : allowOther ? OTHER : (options[0]?.value ?? '');

  const fieldClass =
    'w-full font-body text-sm text-pe-text rounded-xl px-4 py-2.5 bg-white border border-pe-control-border transition-colors focus:border-pe-primary';

  return (
    <div className="mb-5">
      <label htmlFor={id} className="font-body font-semibold text-xs text-pe-text block mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={selectValue}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value === OTHER ? '' : e.target.value)}
          className={`${fieldClass} appearance-none pr-10`}
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
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-pe-muted"
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
          aria-label={`${label}: other`}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value)}
          placeholder={otherPlaceholder}
          className={`${fieldClass} mt-2`}
        />
      )}

      {hint && <p id={hintId} className="font-body text-xs text-pe-muted mt-1.5">{hint}</p>}
    </div>
  );
}

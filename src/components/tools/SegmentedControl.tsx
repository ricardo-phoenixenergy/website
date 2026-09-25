// src/components/tools/SegmentedControl.tsx
'use client';

import { useId } from 'react';

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

/** A single-choice group: native radios styled as a segmented strip. */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  hint,
  onChange,
}: SegmentedControlProps<T>) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <fieldset className="mb-5" aria-describedby={hintId}>
      <legend className="font-body font-semibold text-xs text-pe-text block mb-2">
        {label}
      </legend>
      {/* The strip's edge and dividers mark where each option starts, so they
          take the control token rather than the decorative border. */}
      <div
        className="flex rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--color-pe-control-border)' }}
      >
        {options.map((opt, i) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className="choice-segment flex-1 flex items-center justify-center text-center py-2 px-1 font-body text-xs font-medium transition-colors leading-tight cursor-pointer"
              style={{
                background: selected ? 'var(--color-pe-primary)' : 'white',
                color: selected ? 'white' : 'var(--color-pe-muted)',
                borderRight: i < options.length - 1 ? '1px solid var(--color-pe-control-border)' : 'none',
              }}
            >
              <input
                type="radio"
                name={id}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      {hint && (
        <p id={hintId} className="font-body text-xs text-pe-muted mt-1.5">{hint}</p>
      )}
    </fieldset>
  );
}

// src/components/tools/NumberField.tsx
'use client';

import { useId, useState } from 'react';
import { readAmount, type AmountIssue } from '@/lib/parseAmount';

interface NumberFieldProps {
  label: string;
  /** The parsed value; NaN while the typed text is not a number. */
  value: number;
  unit?: string;
  hint?: string;
  /** Validation message from the parent; shown under the field when set. */
  error?: string;
  /** Maximum decimal places accepted (e.g. 2 for 10.24 kWh). */
  decimals?: number;
  /** Lets the parent focus this field when it fails validation. */
  id?: string;
  /** The parsed value (NaN when the text isn't a number) and, if so, why not. */
  onChange: (v: number, issue: AmountIssue | null) => void;
}

export function NumberField({ label, value, unit, hint, error, decimals = 2, id: idProp, onChange }: NumberFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [text, setText] = useState(() => (Number.isFinite(value) ? String(value) : ''));
  const unitId = unit ? `${id}-unit` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [unitId, errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="mb-5">
      <label htmlFor={id} className="font-body font-semibold text-xs text-pe-text block mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => {
            setText(e.target.value);
            const reading = readAmount(e.target.value, decimals);
            onChange(reading.ok ? reading.value : NaN, reading.ok ? null : reading.issue);
          }}
          onBlur={() => {
            const reading = readAmount(text, decimals);
            if (reading.ok) setText(String(reading.value));
          }}
          className={`w-full font-body text-sm text-pe-text rounded-xl px-4 py-2.5 bg-white transition-colors ${
            error ? 'border-2 border-pe-error' : 'border border-pe-control-border focus:border-pe-primary'
          } ${unit ? 'pr-14' : ''}`}
        />
        {unit && (
          <span id={unitId} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-body text-xs font-medium text-pe-muted">
            {unit}
          </span>
        )}
      </div>
      {error && <p id={errorId} className="font-body text-xs text-pe-error mt-1.5">{error}</p>}
      {hint && <p id={hintId} className="font-body text-xs text-pe-muted mt-1.5">{hint}</p>}
    </div>
  );
}

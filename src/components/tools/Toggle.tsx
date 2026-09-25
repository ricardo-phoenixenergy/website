// src/components/tools/Toggle.tsx
'use client';

import { useId } from 'react';

interface ToggleProps {
  label: string;
  subLabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ label, subLabel, checked, onChange }: ToggleProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const subLabelId = subLabel ? `${id}-sub` : undefined;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelId}
      aria-describedby={subLabelId}
      onClick={() => onChange(!checked)}
      className="w-full flex items-start gap-3 text-left mb-5 rounded-xl"
    >
      {/* Off, the track takes the control token so the switch and its white knob
          stand out from the white card (3.4:1); on, Deep Teal. */}
      <span
        aria-hidden="true"
        className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors mt-0.5"
        style={{ background: checked ? 'var(--color-pe-primary)' : 'var(--color-pe-control-border)' }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </span>
      <span className="block">
        <span id={labelId} className="block font-body font-semibold text-sm text-pe-text">{label}</span>
        {subLabel && (
          <span id={subLabelId} className="block font-body text-xs text-pe-muted mt-0.5 leading-[1.5]">
            {subLabel}
          </span>
        )}
      </span>
    </button>
  );
}

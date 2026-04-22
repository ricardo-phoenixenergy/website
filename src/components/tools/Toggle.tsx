// src/components/tools/Toggle.tsx
'use client';

interface ToggleProps {
  label: string;
  subLabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ label, subLabel, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-start gap-3 text-left mb-5"
    >
      <div
        className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors mt-0.5"
        style={{ background: checked ? '#39575C' : '#E5E7EB' }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </div>
      <div>
        <p className="font-body font-semibold text-sm text-[#1A1A1A]">{label}</p>
        {subLabel && (
          <p className="font-body text-[11px] text-[#6B7280] mt-0.5 leading-[1.5]">
            {subLabel}
          </p>
        )}
      </div>
    </button>
  );
}

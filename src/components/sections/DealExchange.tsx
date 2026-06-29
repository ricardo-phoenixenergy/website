// src/components/sections/DealExchange.tsx
import type { ReactNode } from 'react';
import {
  IconArrowRight, IconSun, IconDollarSign, IconZap, IconClipboardCheck,
} from '@/components/ui/Icons';

const ACCENT = '#C97A40';

interface FlowRow {
  from: string;
  to: string;
  label: string;
  icon: (s: number) => ReactNode;
}

const ONE_TIME: FlowRow[] = [
  { from: 'You', to: 'Phoenix', label: 'Your solar / battery system.', icon: (s) => <IconSun size={s} /> },
  { from: 'Phoenix', to: 'You', label: 'A fair-market cash sum.', icon: (s) => <IconDollarSign size={s} /> },
];

const ONGOING: FlowRow[] = [
  { from: 'System', to: 'You', label: 'Clean power, exactly as before.', icon: (s) => <IconZap size={s} /> },
  { from: 'You', to: 'Phoenix', label: 'A PPA payment below your grid tariff.', icon: (s) => <IconDollarSign size={s} /> },
  { from: 'Phoenix', to: 'System', label: 'Active management, optimisation, dispatch & trading.', icon: (s) => <IconClipboardCheck size={s} /> },
];

export interface DealExchangeProps {
  variant: 'compact' | 'full';
}

export function DealExchange({ variant }: DealExchangeProps) {
  const dark = variant === 'compact';
  return (
    <div
      className="rounded-2xl p-5 md:p-6"
      style={
        dark
          ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }
          : { background: '#ffffff', border: '1px solid #E5E7EB' }
      }
    >
      <FlowBlock kicker="One-time exchange" rows={ONE_TIME} dark={dark} />
      <div
        className="my-4 border-t border-dashed"
        style={{ borderColor: dark ? 'rgba(255,255,255,0.14)' : '#E5E7EB' }}
      />
      <FlowBlock kicker="Then, ongoing" rows={ONGOING} dark={dark} />
    </div>
  );
}

function FlowBlock({ kicker, rows, dark }: { kicker: string; rows: FlowRow[]; dark: boolean }) {
  const muted = dark ? 'rgba(255,255,255,0.55)' : '#6B7280';
  const text = dark ? '#ffffff' : '#1A1A1A';
  return (
    <div>
      <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ACCENT }}>
        {kicker}
      </p>
      <ul className="flex flex-col gap-3">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start gap-3">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: dark ? 'rgba(201,122,64,0.18)' : 'rgba(201,122,64,0.12)', color: ACCENT }}
            >
              {r.icon(16)}
            </span>
            <span className="flex flex-col">
              <span className="flex items-center gap-1.5 font-body text-xs font-semibold" style={{ color: muted }}>
                {r.from}
                <IconArrowRight size={12} className="opacity-70" />
                <span style={{ color: text }}>{r.to}</span>
              </span>
              <span className="font-body text-xs leading-[1.5]" style={{ color: muted }}>
                {r.label}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// src/components/sections/calculators/WeBuySolarCalculator.tsx
'use client';

import { useState } from 'react';

const ACCENT = '#C97A40';
const ACCENT_TEXT = '#ffffff';

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${(n / 1_000).toFixed(0)}k`;
  return `R${n.toLocaleString()}`;
}

export function WeBuySolarCalculator() {
  const [bill, setBill] = useState(20000);

  // Est. system size in kWp; indicative buyback
  const systemKwp = Math.round((bill / 3500) * 10) / 10;
  // Formula from spec: (bill/3500) × 1680 × 20000 × 0.4 / 12
  const buybackValue = Math.round((bill / 3500) * 1680 * 20000 * 0.4 / 12);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your buyback value
      </p>

      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Pre-solar monthly bill</span>
        <span className="font-display font-extrabold text-sm text-white">{formatRand(bill)}</span>
      </div>

      <input
        type="range"
        min={5000}
        max={200000}
        step={5000}
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
        aria-label="Pre-solar monthly electricity bill"
      />

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Est. system size</p>
          <p className="font-display font-extrabold text-xl text-white">{systemKwp} kWp</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.70)' }}>Indicative buyback value</p>
          <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
            {formatRand(buybackValue)}
          </p>
        </div>
      </div>

      <p className="font-body text-[10px] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Subject to physical inspection and system condition. Indicative only.
      </p>
    </div>
  );
}

// src/components/sections/calculators/SolarCalculator.tsx
'use client';

import { useState } from 'react';

const ACCENT = '#E3C58D';
const ACCENT_TEXT = '#6b4e10';
const ESCALATION = [1, 1.15, 1.3225, 1.5209, 1.749]; // 15%/yr compounded

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${(n / 1_000).toFixed(0)}k`;
  return `R${n.toLocaleString()}`;
}

export function SolarCalculator() {
  const [bill, setBill] = useState(30000);

  const fiveYrEskomCost = bill * 12 * ESCALATION.reduce((a, b) => a + b, 0);
  const fiveYrSaving = Math.round(fiveYrEskomCost * 0.48);
  const monthlySaving = Math.round(bill * 0.48);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your saving
      </p>

      {/* Slider label */}
      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Monthly electricity bill</span>
        <span className="font-display font-extrabold text-sm text-white">{formatRand(bill)}</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={5000}
        max={500000}
        step={5000}
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
        aria-label="Monthly electricity bill"
      />

      {/* Results */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Est. monthly saving</p>
          <p className="font-display font-extrabold text-xl text-white">{formatRand(monthlySaving)}</p>
        </div>
        {/* Highlighted */}
        <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
          <p className="font-body text-xs mb-1" style={{ color: `${ACCENT_TEXT}99` }}>5-yr potential saving</p>
          <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
            {formatRand(fiveYrSaving)}
          </p>
        </div>
      </div>

      <p className="font-body text-[10px] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Estimates based on 15% annual Eskom escalation. Indicative only.
      </p>
    </div>
  );
}

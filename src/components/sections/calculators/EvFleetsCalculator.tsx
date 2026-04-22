// src/components/sections/calculators/EvFleetsCalculator.tsx
'use client';

import { useState } from 'react';

const ACCENT = '#A9D6CB';
const ACCENT_TEXT = '#1a5a48';
const DIESEL_ESCALATION = [1, 1.12, 1.2544, 1.4049, 1.5735]; // 12%/yr

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${(n / 1_000).toFixed(0)}k`;
  return `R${n.toLocaleString()}`;
}

export function EvFleetsCalculator() {
  const [fuel, setFuel] = useState(40000);

  const monthlySaving = Math.round(fuel * 0.60);
  const fiveYrFuelCost = fuel * 12 * DIESEL_ESCALATION.reduce((a, b) => a + b, 0);
  const fiveYrSaving = Math.round(fiveYrFuelCost * 0.60);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your fuel saving
      </p>

      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Monthly fleet fuel spend</span>
        <span className="font-display font-extrabold text-sm text-white">{formatRand(fuel)}</span>
      </div>

      <input
        type="range"
        min={10000}
        max={500000}
        step={10000}
        value={fuel}
        onChange={(e) => setFuel(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
        aria-label="Monthly fleet fuel spend"
      />

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Est. monthly saving</p>
          <p className="font-display font-extrabold text-xl text-white">{formatRand(monthlySaving)}</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
          <p className="font-body text-xs mb-1" style={{ color: `${ACCENT_TEXT}99` }}>Est. 5-yr fuel saving</p>
          <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
            {formatRand(fiveYrSaving)}
          </p>
        </div>
      </div>

      <p className="font-body text-[10px] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Based on 60% saving vs diesel at 12% annual escalation. Indicative only.
      </p>
    </div>
  );
}

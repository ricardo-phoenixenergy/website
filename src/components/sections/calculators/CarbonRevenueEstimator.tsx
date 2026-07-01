// src/components/sections/calculators/CarbonRevenueEstimator.tsx
'use client';

import { useState } from 'react';
import { dlPush } from '@/lib/analytics';
import { estimateCarbon } from '@/lib/carbon/estimate';

const ACCENT = '#9CAF88';
const ACCENT_TEXT = '#2a4a18';

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${Math.round(n / 1_000)}k`;
  return `R${n.toLocaleString()}`;
}

function formatSize(kwp: number): string {
  return kwp >= 1000 ? `${(kwp / 1000).toFixed(1)} MWp` : `${kwp} kWp`;
}

export function CarbonRevenueEstimator() {
  const [sizeKwp, setSizeKwp] = useState(1000);
  const [used, setUsed] = useState(false);

  const est = estimateCarbon(sizeKwp);

  function handleChange(v: number) {
    setSizeKwp(v);
    if (!used) {
      setUsed(true);
      dlPush({ event: 'carbon_estimate_used', vertical: 'carbon-credits', size_kwp: v });
    }
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your annual carbon revenue
      </p>

      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">System size</span>
        <span className="font-display font-extrabold text-sm text-white">{formatSize(sizeKwp)}</span>
      </div>

      <input
        type="range"
        min={100}
        max={10000}
        step={100}
        value={sizeKwp}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
        aria-label="System size in kWp"
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>tCO₂ avoided / year</p>
          <p className="font-display font-extrabold text-xl text-white">~{est.tonnesPerYear.toLocaleString()}</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Verified credits / year</p>
          <p className="font-display font-extrabold text-xl text-white">~{est.creditsPerYear.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
        <p className="font-body text-xs mb-1" style={{ color: `${ACCENT_TEXT}99` }}>Est. annual carbon revenue</p>
        <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
          {formatRand(est.revenueLow)} – {formatRand(est.revenueHigh)}
        </p>
      </div>

      <p className="font-body text-[10px] mt-3 text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Based on typical South African solar yields (~1,600 kWh/kWp) and the current grid emissions factor (~0.95 tCO₂/MWh). Revenue estimates are indicative only and will vary with project performance and market pricing.
      </p>
    </div>
  );
}

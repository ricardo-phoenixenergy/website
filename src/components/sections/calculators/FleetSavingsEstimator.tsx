// src/components/sections/calculators/FleetSavingsEstimator.tsx
'use client';

import { useState } from 'react';
import { dlPush } from '@/lib/analytics';
import {
  estimateFleet,
  type FleetVehicleType, type ChargingSource,
} from '@/lib/evfleet/estimate';

const ACCENT = '#A9D6CB';
const ACCENT_TEXT = '#1a5a48';

const TYPES: FleetVehicleType[] = ['van', 'car', 'minibus', 'truck'];
const TYPE_LABEL: Record<FleetVehicleType, string> = {
  van: 'Van', car: 'Car', minibus: 'Minibus', truck: 'Truck',
};

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${Math.round(n / 1_000)}k`;
  return `R${Math.round(n)}`;
}

export function FleetSavingsEstimator() {
  const [vehicles, setVehicles] = useState(10);
  const [type, setType] = useState<FleetVehicleType>('van');
  const [kmPerMonth, setKmPerMonth] = useState(2500);
  const [charging, setCharging] = useState<ChargingSource>('grid');
  const [used, setUsed] = useState(false);

  const est = estimateFleet({ vehicles, type, kmPerMonth, charging });
  const co2 = Math.max(0, est.co2AvoidedTonnesYear);

  function touch() {
    if (used) return;
    setUsed(true);
    dlPush({ event: 'fleet_estimate_used', vertical: 'ev-fleets', vehicles, charging });
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your fleet savings
      </p>

      {/* Vehicles */}
      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Number of vehicles</span>
        <span className="font-display font-extrabold text-sm text-white">{vehicles}</span>
      </div>
      <input
        type="range" min={1} max={100} step={1} value={vehicles}
        onChange={(e) => { setVehicles(Number(e.target.value)); touch(); }}
        className="w-full mb-5" style={{ accentColor: ACCENT }} aria-label="Number of vehicles"
      />

      {/* Vehicle type */}
      <p className="font-body text-sm text-white/70 mb-2">Vehicle type</p>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {TYPES.map((t) => {
          const sel = type === t;
          return (
            <button
              key={t} type="button"
              onClick={() => { setType(t); touch(); }}
              className="rounded-lg py-2 font-body text-xs font-semibold transition-colors"
              style={sel
                ? { background: ACCENT, color: ACCENT_TEXT }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {TYPE_LABEL[t]}
            </button>
          );
        })}
      </div>

      {/* Distance */}
      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Distance per vehicle</span>
        <span className="font-display font-extrabold text-sm text-white">{kmPerMonth.toLocaleString('en-ZA')} km/mo</span>
      </div>
      <input
        type="range" min={500} max={8000} step={500} value={kmPerMonth}
        onChange={(e) => { setKmPerMonth(Number(e.target.value)); touch(); }}
        className="w-full mb-5" style={{ accentColor: ACCENT }} aria-label="Distance per vehicle per month"
      />

      {/* Charging source */}
      <p className="font-body text-sm text-white/70 mb-2">Charging source</p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {(['grid', 'solar'] as ChargingSource[]).map((c) => {
          const sel = charging === c;
          return (
            <button
              key={c} type="button"
              onClick={() => { setCharging(c); touch(); }}
              className="rounded-lg py-2.5 font-body text-sm font-semibold transition-colors"
              style={sel
                ? { background: ACCENT, color: ACCENT_TEXT }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {c === 'grid' ? 'Grid' : 'Solar + battery'}
            </button>
          );
        })}
      </div>

      {/* Outputs */}
      <div className="rounded-xl p-4 text-center mb-3" style={{ background: ACCENT }}>
        <p className="font-body text-xs mb-1" style={{ color: `${ACCENT_TEXT}99` }}>Est. monthly fleet saving</p>
        <p className="font-display font-extrabold text-2xl" style={{ color: ACCENT_TEXT }}>{formatRand(est.monthlySaving)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-body text-[11px] mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Annual saving</p>
          <p className="font-display font-extrabold text-base text-white">{formatRand(est.annualSaving)}</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-body text-[11px] mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>5-year saving</p>
          <p className="font-display font-extrabold text-base text-white">{formatRand(est.fiveYearSaving)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl p-3 mb-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="font-body text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Cost per km: diesel vs electric</span>
        <span className="font-display font-bold text-sm text-white">
          R{est.dieselCostPerKm.toFixed(2)} <span style={{ color: ACCENT }}>&rarr;</span> R{est.evCostPerKm.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="font-body text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
          CO&#8322; avoided / year{charging === 'grid' ? ' — charge from solar for more' : ''}
        </span>
        <span className="font-display font-bold text-sm text-white">~{co2.toLocaleString('en-ZA')} t</span>
      </div>

      <p className="font-body text-[10px] mt-3 text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Indicative only. Assumes diesel ~R24/L, depot charging R2.60/kWh (solar R1.50/kWh) and typical efficiency. Actual savings depend on your routes and tariffs; CO&#8322; depends on charging from grid vs solar.
      </p>
    </div>
  );
}

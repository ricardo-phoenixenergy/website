// src/components/sections/calculators/FleetSavingsEstimator.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { dlPush } from '@/lib/analytics';
import {
  estimateFleet, vehicleCostPerKm, FLEET_VEHICLES,
  type FleetVehicleType, type ChargingSource, type FuelType,
} from '@/lib/evfleet/estimate';
import type { ResolvedEnergyPrices } from '@/lib/getEnergyPrices';
import { CostPerKmBars } from '@/components/sections/CostPerKmBars';

const ACCENT = '#A9D6CB';
const ACCENT_TEXT = '#1a5a48';

const TYPES: FleetVehicleType[] = ['car', 'van', 'minibus', 'truck', 'heavytruck'];
const TYPE_LABEL: Record<FleetVehicleType, string> = {
  car: 'Car', van: 'Van', minibus: 'Minibus', truck: 'Truck', heavytruck: 'Heavy',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STEP_COUNT = 2;

const UNSELECTED_BTN = {
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(255,255,255,0.12)',
} as const;

const NAV_BTN = 'rounded-lg py-2.5 px-5 font-body text-sm font-semibold transition-colors';

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${Math.round(n / 1_000)}k`;
  return `R${Math.round(n)}`;
}

// Deterministic 'Jul 2026' from an ISO date (avoids locale-dependent hydration mismatch).
function formatMonthYear(iso: string | null): string | null {
  if (!iso) return null;
  const m = iso.match(/^(\d{4})-(\d{2})/);
  if (!m) return null;
  const monthIdx = Number(m[2]) - 1;
  if (monthIdx < 0 || monthIdx > 11) return null;
  return `${MONTHS[monthIdx]} ${m[1]}`;
}

export function FleetSavingsEstimator({ prices }: { prices: ResolvedEnergyPrices }) {
  const [step, setStep] = useState(0);
  const [vehicles, setVehicles] = useState(10);
  const [type, setType] = useState<FleetVehicleType>('van');
  const [fuel, setFuel] = useState<FuelType>('diesel');
  const [kmPerMonth, setKmPerMonth] = useState(2500);
  const [charging, setCharging] = useState<ChargingSource>('grid');
  const [used, setUsed] = useState(false);

  const petrolOk = FLEET_VEHICLES[type].petrolLPer100 !== undefined;
  const effectiveFuel: FuelType = petrolOk ? fuel : 'diesel';

  const est = estimateFleet({ vehicles, type, kmPerMonth, charging, fuel: effectiveFuel }, prices);
  const costs = vehicleCostPerKm(type, prices, effectiveFuel);
  const co2 = Math.max(0, est.co2AvoidedTonnesYear);

  const fuelLabel = effectiveFuel === 'petrol' ? 'Petrol 93' : 'Diesel';
  const fuelPrice = effectiveFuel === 'petrol' ? prices.petrol93PricePerL : prices.dieselPricePerL;
  const monthYear = formatMonthYear(prices.effectiveDate);
  const priceCaption = `${fuelLabel} R${fuelPrice.toFixed(2)}/L · ${prices.isLive && monthYear ? monthYear : 'estimated'}`;

  function touch() {
    if (used) return;
    setUsed(true);
    dlPush({ event: 'fleet_estimate_used', vertical: 'ev-fleets', vehicles, charging });
  }

  // Reset fuel here (event handler, never during render) when moving to a diesel-only vehicle.
  function selectType(t: FleetVehicleType) {
    setType(t);
    if (FLEET_VEHICLES[t].petrolLPer100 === undefined) setFuel('diesel');
    touch();
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your fleet savings
      </p>

      {/* Progress */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1].map((i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === step ? 20 : 6, background: i <= step ? ACCENT : 'rgba(255,255,255,0.15)' }}
            />
          ))}
        </div>
        <span className="font-body text-[10px]" style={{ color: 'rgba(255,255,255,0.40)' }}>
          Step {step + 1} of {STEP_COUNT}
        </span>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        aria-label={`Step ${step + 1} of ${STEP_COUNT}`}
      >
        {/* Step 0 — All inputs */}
        {step === 0 && (
          <>
            <div className="flex justify-between mb-2">
              <span className="font-body text-sm text-white/70">Number of vehicles</span>
              <span className="font-display font-extrabold text-sm text-white">{vehicles}</span>
            </div>
            <input
              type="range" min={1} max={100} step={1} value={vehicles}
              onChange={(e) => { setVehicles(Number(e.target.value)); touch(); }}
              className="w-full mb-5" style={{ accentColor: ACCENT }} aria-label="Number of vehicles"
            />

            <p className="font-body text-sm text-white/70 mb-2">Vehicle type</p>
            <div className="grid grid-cols-5 gap-1.5 mb-5">
              {TYPES.map((t) => {
                const sel = type === t;
                return (
                  <button
                    key={t} type="button"
                    onClick={() => selectType(t)}
                    className="rounded-lg py-2 font-body text-[11px] font-semibold transition-colors"
                    style={sel ? { background: ACCENT, color: ACCENT_TEXT } : UNSELECTED_BTN}
                  >
                    {TYPE_LABEL[t]}
                  </button>
                );
              })}
            </div>

            <p className="font-body text-sm text-white/70 mb-2">Current fuel</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {(['diesel', 'petrol'] as FuelType[]).map((f) => {
                const sel = effectiveFuel === f;
                const disabled = f === 'petrol' && !petrolOk;
                return (
                  <button
                    key={f} type="button" disabled={disabled}
                    onClick={() => { setFuel(f); touch(); }}
                    className="rounded-lg py-2.5 font-body text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={sel ? { background: ACCENT, color: ACCENT_TEXT } : UNSELECTED_BTN}
                  >
                    {f === 'diesel' ? 'Diesel' : 'Petrol 93'}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mb-2">
              <span className="font-body text-sm text-white/70">Distance per vehicle</span>
              <span className="font-display font-extrabold text-sm text-white">{kmPerMonth.toLocaleString('en-ZA')} km/mo</span>
            </div>
            <input
              type="range" min={500} max={8000} step={500} value={kmPerMonth}
              onChange={(e) => { setKmPerMonth(Number(e.target.value)); touch(); }}
              className="w-full mb-5" style={{ accentColor: ACCENT }} aria-label="Distance per vehicle per month"
            />

            <p className="font-body text-sm text-white/70 mb-2">Charging source</p>
            <div className="grid grid-cols-2 gap-2">
              {(['grid', 'solar'] as ChargingSource[]).map((c) => {
                const sel = charging === c;
                return (
                  <button
                    key={c} type="button"
                    onClick={() => { setCharging(c); touch(); }}
                    className="rounded-lg py-2.5 font-body text-sm font-semibold transition-colors"
                    style={sel ? { background: ACCENT, color: ACCENT_TEXT } : UNSELECTED_BTN}
                  >
                    {c === 'grid' ? 'Grid' : 'Solar + battery'}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Step 1 — Your savings */}
        {step === 1 && (
          <>
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

            <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Cost per km</span>
                <span className="font-body text-[11px]" style={{ color: 'rgba(255,255,255,0.40)' }}>{priceCaption}</span>
              </div>
              <CostPerKmBars fuelLabel={fuelLabel} costs={costs} accent={ACCENT} />
            </div>

            <div className="flex items-center justify-between rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="font-body text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                CO&#8322; avoided / year{charging === 'grid' ? ' — charge from solar for more' : ''}
              </span>
              <span className="font-display font-bold text-sm text-white">~{co2.toLocaleString('en-ZA')} t</span>
            </div>

            <p className="font-body text-[10px] mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.30)' }}>
              Indicative only. Based on {fuelLabel.toLowerCase()} R{fuelPrice.toFixed(2)}/L, grid R{prices.gridPricePerKwh.toFixed(2)}/kWh and solar R{prices.solarPricePerKwh.toFixed(2)}/kWh. Actual savings depend on your routes, tariffs and duty cycle; CO&#8322; depends on charging from grid vs solar.
            </p>
          </>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2 mt-6">
        {step === 0 ? (
          <>
            <span />
            <button
              type="button"
              onClick={() => setStep(1)}
              className={NAV_BTN}
              style={{ background: ACCENT, color: ACCENT_TEXT }}
            >
              See savings &rarr;
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setStep(0)}
            className={NAV_BTN}
            style={UNSELECTED_BTN}
          >
            &larr; Edit inputs
          </button>
        )}
      </div>
    </div>
  );
}

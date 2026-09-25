// src/components/sections/calculators/FleetSavingsEstimator.tsx
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { contactHref } from '@/lib/contactLink';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { dlPush } from '@/lib/analytics';
import {
  estimateFleet, vehicleCostPerKm, FLEET_VEHICLES,
  type FleetVehicleType, type ChargingSource, type FuelType,
} from '@/lib/evfleet/estimate';
import type { ResolvedEnergyPrices } from '@/lib/getEnergyPrices';
import { CostPerKmBars } from '@/components/sections/CostPerKmBars';
import { IconArrowRight, IconArrowLeft } from '@/components/ui/Icons';
import { SOLUTION_META } from '@/types/solutions';

const ACCENT = SOLUTION_META['ev-fleets'].accent;
const ACCENT_TEXT = SOLUTION_META['ev-fleets'].accentText;

const TYPES: FleetVehicleType[] = ['car', 'van', 'minibus', 'truck', 'heavytruck'];
const TYPE_LABEL: Record<FleetVehicleType, string> = {
  car: 'Car', van: 'Van', minibus: 'Minibus', truck: 'Truck', heavytruck: 'Heavy',
};
/** The vehicle in a sentence: the assumptions line and the enquiry message. */
const VEHICLE_NOUN: Record<FleetVehicleType, { one: string; many: string }> = {
  car: { one: 'car', many: 'cars' },
  van: { one: 'van', many: 'vans' },
  minibus: { one: 'minibus', many: 'minibuses' },
  truck: { one: 'medium truck', many: 'medium trucks' },
  heavytruck: { one: 'heavy truck', many: 'heavy trucks' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STEP_COUNT = 2;
const STEP_TITLES = ['Your fleet', 'Your estimated energy cost savings'] as const;

// What the model leaves out: it compares fuel with electricity per km, holds
// today's prices for five years (five years = one year × 5), and nothing else.
const EXCLUSIONS =
  'Indicative energy costs only: fuel against electricity, with prices held flat for five years. Excludes the vehicle price premium, chargers and installation, extra demand charges, finance and maintenance.';

// getEnergyPrices() falls back to this label when the Sanity document has none.
const NO_SOURCE_LABEL = 'Estimated';

const TILE = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' } as const;

const UNSELECTED_BTN = {
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(255,255,255,0.12)',
} as const;

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${Math.round(n / 1_000)}k`;
  return `R${Math.round(n)}`;
}

// Tonnes with a decimal point (like the rand figures beside them), one decimal
// under 10 t; deterministic, so server and browser agree.
function formatTonnes(t: number): string {
  const abs = Math.abs(t);
  if (abs < 10) return abs.toFixed(1);
  return Math.round(abs).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

interface PillOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

/** A single-choice group of pills: native radios, so arrow keys and screen readers work. */
function PillGroup<T extends string>({
  legend, name, options, value, onChange, columns, pillClass,
}: {
  legend: string;
  name: string;
  options: PillOption<T>[];
  value: T;
  onChange: (v: T) => void;
  columns: string;
  pillClass: string;
}) {
  return (
    <fieldset className="mb-5">
      <legend className="font-body text-sm text-white/70 mb-2">{legend}</legend>
      <div className={`grid ${columns}`}>
        {options.map((opt) => {
          const sel = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`choice-card ${pillClass} rounded-full text-center font-body font-semibold transition-colors ${
                opt.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
              style={sel ? { background: ACCENT, color: ACCENT_TEXT } : UNSELECTED_BTN}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={sel}
                disabled={opt.disabled}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FleetSavingsEstimator({ prices }: { prices: ResolvedEnergyPrices }) {
  const [step, setStep] = useState(0);
  const [vehicles, setVehicles] = useState(10);
  const [type, setType] = useState<FleetVehicleType>('van');
  const [fuel, setFuel] = useState<FuelType>('diesel');
  const [kmPerMonth, setKmPerMonth] = useState(2500);
  const [charging, setCharging] = useState<ChargingSource>('grid');
  const [used, setUsed] = useState(false);
  // The first step renders visible on the server; only later step changes animate in.
  const [stepChanged, setStepChanged] = useState(false);
  const uid = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Only a step change the visitor makes moves focus; the first render doesn't.
  const moveFocusRef = useRef(false);

  useEffect(() => {
    if (!moveFocusRef.current) return;
    moveFocusRef.current = false;
    headingRef.current?.focus();
  }, [step]);

  const goTo = (next: number) => {
    moveFocusRef.current = true;
    setStepChanged(true);
    setStep(next);
  };

  const petrolOk = FLEET_VEHICLES[type].petrolLPer100 !== undefined;
  const effectiveFuel: FuelType = petrolOk ? fuel : 'diesel';

  const input = { vehicles, type, kmPerMonth, charging, fuel: effectiveFuel };
  const est = estimateFleet(input, prices);
  const costs = vehicleCostPerKm(type, prices, effectiveFuel);

  const fuelLabel = effectiveFuel === 'petrol' ? 'Petrol 93' : 'Diesel';
  const fuelPrice = effectiveFuel === 'petrol' ? prices.petrol93PricePerL : prices.dieselPricePerL;
  const monthYear = formatMonthYear(prices.effectiveDate);

  // The rates the estimate uses, with the source and date when Sanity has them.
  const vehicle = FLEET_VEHICLES[type];
  const litresPer100 = (effectiveFuel === 'petrol' ? vehicle.petrolLPer100 : undefined) ?? vehicle.dieselLPer100;
  const fuelRate = `${fuelLabel} R${fuelPrice.toFixed(2)}/L`;
  const powerRates = `grid R${prices.gridPricePerKwh.toFixed(2)}/kWh and solar R${prices.solarPricePerKwh.toFixed(2)}/kWh`;
  const source = prices.sourceLabel !== NO_SOURCE_LABEL ? `source: ${prices.sourceLabel}` : null;
  const dated = [source, monthYear && `effective ${monthYear}`].filter(Boolean).join(', ');
  const ratesLine = prices.isLive
    ? `${fuelRate}${dated ? ` (${dated})` : ''}. Electricity: ${powerRates}, average rates.`
    : `${fuelRate}, ${powerRates} are estimates, not live prices.`;
  const usageLine = `Assumes a ${effectiveFuel} ${VEHICLE_NOUN[type].one} uses ${litresPer100} L per 100 km and an electric one ${vehicle.evKwhPer100} kWh.`;

  // CO2 as the model gives it, including an increase (grid-charged trucks), never clamped to zero.
  const co2 = est.co2AvoidedTonnesYear;
  const solarCo2 = estimateFleet({ ...input, charging: 'solar' }, prices).co2AvoidedTonnesYear;
  const co2Rises = co2 < 0;
  const co2Label = co2Rises ? 'Extra CO₂ a year from grid charging' : 'CO₂ avoided a year';
  const co2Value = co2Rises ? `+${formatTonnes(co2)} t` : `~${formatTonnes(co2)} t`;
  const co2Hint =
    charging === 'grid' && solarCo2 > Math.max(co2, 0)
      ? co2Rises ? 'Charging from solar avoids CO₂ instead.' : 'Charging from solar avoids more.'
      : null;

  // Fires once, on the visitor's first change. The handler passes the value it
  // has just set, because state read here still holds the value before the change.
  function touch(changed: { vehicles?: number; charging?: ChargingSource } = {}) {
    if (used) return;
    setUsed(true);
    dlPush({
      event: 'fleet_estimate_used',
      vertical: 'ev-fleets',
      vehicles: changed.vehicles ?? vehicles,
      charging: changed.charging ?? charging,
    });
  }

  // Reset fuel here (event handler, never during render) when moving to a diesel-only vehicle.
  function selectType(t: FleetVehicleType) {
    setType(t);
    if (FLEET_VEHICLES[t].petrolLPer100 === undefined) setFuel('diesel');
    touch();
  }

  const vehiclesId = `${uid}-vehicles`;
  const distanceId = `${uid}-distance`;
  const distanceText = `${kmPerMonth.toLocaleString('en-ZA')} km/mo`;

  return (
    // A 55% Night Teal card, like the other hero tools: over the brightest part of
    // the hero photo, a 6% white card left its labels at 2.4 to 3.8:1.
    <div
      className="rounded-2xl p-6 bg-pe-nav-dark/55"
      style={{ border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--color-on-dark-muted)' }}>
        Estimate your fleet&rsquo;s energy cost savings
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
        <span aria-hidden="true" className="font-body text-xs" style={{ color: 'var(--color-on-dark-subtle)' }}>
          Step {step + 1} of {STEP_COUNT}
        </span>
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="sr-only">
        Step {step + 1} of {STEP_COUNT}: {STEP_TITLES[step]}
      </h2>

      <motion.div
        key={step}
        initial={stepChanged ? { opacity: 0, y: 6 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        {/* Step 0 — All inputs */}
        {step === 0 && (
          <>
            <div className="flex justify-between mb-2">
              <label htmlFor={vehiclesId} className="font-body text-sm text-white/70">Number of vehicles</label>
              <span aria-hidden="true" className="font-display font-extrabold text-sm text-white">{vehicles}</span>
            </div>
            <input
              id={vehiclesId}
              type="range" min={1} max={100} step={1} value={vehicles}
              onChange={(e) => { const n = Number(e.target.value); setVehicles(n); touch({ vehicles: n }); }}
              className="w-full mb-5" style={{ accentColor: ACCENT }}
            />

            <PillGroup
              legend="Vehicle type"
              name={`${uid}-type`}
              options={TYPES.map((t) => ({ value: t, label: TYPE_LABEL[t] }))}
              value={type}
              onChange={selectType}
              columns="grid-cols-5 gap-1.5"
              pillClass="py-2 text-xs"
            />

            <PillGroup<FuelType>
              legend="Current fuel"
              name={`${uid}-fuel`}
              options={[
                { value: 'diesel', label: 'Diesel' },
                { value: 'petrol', label: 'Petrol 93', disabled: !petrolOk },
              ]}
              value={effectiveFuel}
              onChange={(f) => { setFuel(f); touch(); }}
              columns="grid-cols-2 gap-2"
              pillClass="py-2.5 text-sm"
            />

            <div className="flex justify-between mb-2">
              <label htmlFor={distanceId} className="font-body text-sm text-white/70">Distance per vehicle</label>
              <span aria-hidden="true" className="font-display font-extrabold text-sm text-white">{distanceText}</span>
            </div>
            <input
              id={distanceId}
              type="range" min={500} max={8000} step={500} value={kmPerMonth}
              aria-valuetext={`${distanceText.replace('km/mo', 'km a month')}`}
              onChange={(e) => { setKmPerMonth(Number(e.target.value)); touch(); }}
              className="w-full mb-5" style={{ accentColor: ACCENT }}
            />

            <PillGroup<ChargingSource>
              legend="Charging source"
              name={`${uid}-charging`}
              options={[
                { value: 'grid', label: 'Grid' },
                { value: 'solar', label: 'Solar + battery' },
              ]}
              value={charging}
              onChange={(c) => { setCharging(c); touch({ charging: c }); }}
              columns="grid-cols-2 gap-2"
              pillClass="py-2.5 text-sm"
            />
          </>
        )}

        {/* Step 1: your energy cost savings */}
        {step === 1 && (
          <>
            <div className="rounded-xl p-4 text-center mb-3" style={{ background: ACCENT }}>
              <p className="font-body text-xs mb-1" style={{ color: ACCENT_TEXT }}>Estimated energy cost saving a month</p>
              <p className="font-display font-extrabold text-2xl" style={{ color: ACCENT_TEXT }}>{formatRand(est.monthlySaving)}</p>
            </div>

            {/* Values sit on one baseline even when a label wraps. */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* on-dark-muted: the tiles' lighter fill left on-dark-subtle at 4.0:1 */}
              <div className="rounded-xl p-3 text-center flex flex-col justify-between gap-1" style={TILE}>
                <p className="font-body text-xs text-balance" style={{ color: 'var(--color-on-dark-muted)' }}>Energy cost saving a year</p>
                <p className="font-display font-extrabold text-base text-white">{formatRand(est.annualSaving)}</p>
              </div>
              <div className="rounded-xl p-3 text-center flex flex-col justify-between gap-1" style={TILE}>
                <p className="font-body text-xs text-balance" style={{ color: 'var(--color-on-dark-muted)' }}>Energy cost saving over 5 years</p>
                <p className="font-display font-extrabold text-base text-white">{formatRand(est.fiveYearSaving)}</p>
              </div>
            </div>

            <p className="font-body text-xs leading-relaxed mb-3" style={{ color: 'var(--color-on-dark-muted)' }}>
              {EXCLUSIONS}
            </p>

            <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-body text-xs mb-3" style={{ color: 'var(--color-on-dark-subtle)' }}>Cost per km</p>
              <CostPerKmBars fuelLabel={fuelLabel} costs={costs} accent={ACCENT} />
              <p className="font-body text-xs leading-relaxed mt-3" style={{ color: 'var(--color-on-dark-muted)' }}>
                {ratesLine} {usageLine}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p className="font-body text-xs" style={{ color: 'var(--color-on-dark-subtle)' }}>{co2Label}</p>
                {co2Hint && (
                  <p className="font-body text-xs mt-0.5" style={{ color: 'var(--color-on-dark-subtle)' }}>{co2Hint}</p>
                )}
              </div>
              <span className="font-display font-bold text-sm text-white whitespace-nowrap">{co2Value}</span>
            </div>
          </>
        )}
      </motion.div>

      {/* Navigation. On the result step the two buttons stack full width below
          640px, where their labels would otherwise wrap onto two lines each. */}
      <div className={`mt-6 flex gap-2 ${step === 0 ? 'justify-end' : 'flex-col sm:flex-row sm:items-center sm:justify-between'}`}>
        {step === 0 ? (
          <Button variant="accent" vertical="ev-fleets" onClick={() => goTo(1)}>
            See savings <IconArrowRight />
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={() => goTo(0)}>
              <IconArrowLeft /> Edit inputs
            </Button>
            <Button
              variant="accent"
              vertical="ev-fleets"
              href={contactHref(
                `Our fleet: ${vehicles} ${vehicles === 1 ? VEHICLE_NOUN[type].one : VEHICLE_NOUN[type].many} on ${fuelLabel.toLowerCase()}, about ${kmPerMonth.toLocaleString('en-ZA')} km a month each, charging from ${charging === 'grid' ? 'the grid' : 'solar and battery'}. Your estimator showed an energy cost saving of about ${formatRand(est.monthlySaving)} a month (fuel against electricity only). I'd like a fleet assessment.`,
              )}
              onClick={() => dlPush({ event: 'cta_click', cta_label: 'Get a fleet assessment', cta_location: 'fleet_estimator_result' })}
            >
              Get a fleet assessment <IconArrowRight />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

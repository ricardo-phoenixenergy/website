'use client';

import type { SolarInputs, BessInputs } from '@/lib/valuation/types';
import { RangeSlider } from './RangeSlider';
import { SegmentedControl } from './SegmentedControl';
import { Toggle } from './Toggle';

interface Step1SystemDetailsProps {
  solar: SolarInputs;
  bess: BessInputs;
  onSolarChange: (patch: Partial<SolarInputs>) => void;
  onBessChange: (patch: Partial<BessInputs>) => void;
  onNext: () => void;
}

const TIER_OPTIONS: { value: SolarInputs['tier']; label: string }[] = [
  { value: 'T1', label: 'Tier 1' },
  { value: 'T2', label: 'Tier 2' },
  { value: 'T3', label: 'Tier 3 / unknown' },
];

const INVERTER_OPTIONS: { value: SolarInputs['inverterType']; label: string }[] = [
  { value: 'string', label: 'String' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'micro', label: 'Micro' },
  { value: 'offgrid', label: 'Off-grid' },
];

const CHEM_OPTIONS: { value: BessInputs['chemistry']; label: string }[] = [
  { value: 'lfp', label: 'LFP / LiFePO₄' },
  { value: 'nmc', label: 'Li-NMC' },
  { value: 'lead', label: 'Lead-acid' },
];

const SOH_OPTIONS: { value: BessInputs['soh']; label: string }[] = [
  { value: 'high', label: '90%+ (like new)' },
  { value: 'mid', label: '70–90% (good)' },
  { value: 'low', label: 'Below 70% (degraded)' },
];

const BRAND_OPTIONS: { value: BessInputs['brand']; label: string }[] = [
  { value: 'premium', label: 'Premium (Pylontech, BYD, CATL)' },
  { value: 'mid', label: 'Mid-range' },
  { value: 'generic', label: 'Generic' },
];

export function Step1SystemDetails({
  solar,
  bess,
  onSolarChange,
  onBessChange,
  onNext,
}: Step1SystemDetailsProps) {
  return (
    <div>
      <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-4">
        Solar array
      </p>

      <RangeSlider
        label="Installed solar capacity"
        value={solar.kw}
        min={3}
        max={500}
        step={1}
        unit="kWp"
        hint="Residential: 5–30 kWp · Small C&I: 30–100 kWp · Large C&I: 100 kWp+"
        onChange={v => onSolarChange({ kw: v })}
      />

      <RangeSlider
        label="Year of installation"
        value={solar.installYear}
        min={2015}
        max={2025}
        step={1}
        unit=""
        hint="Age determines panel degradation rate and remaining warranty value"
        onChange={v => onSolarChange({ installYear: v })}
        formatValue={v => String(v)}
      />

      <SegmentedControl
        label="Panel brand tier"
        options={TIER_OPTIONS}
        value={solar.tier}
        hint="Tier 1: JA Solar, Canadian Solar, LONGi, Trina · Tier 3: unbranded / Chinese no-name"
        onChange={v => onSolarChange({ tier: v })}
      />

      <SegmentedControl
        label="Inverter type"
        options={INVERTER_OPTIONS}
        value={solar.inverterType}
        hint="Hybrid inverters command a significant premium as they support BESS"
        onChange={v => onSolarChange({ inverterType: v })}
      />

      <div
        className="mt-6 pt-6"
        style={{ borderTop: '1px solid #E5E7EB' }}
      >
        <Toggle
          label="Does your system include battery storage?"
          subLabel="BESS is valued separately and can significantly increase total buyback value"
          checked={bess.enabled}
          onChange={v => onBessChange({ enabled: v })}
        />

        {bess.enabled && (
          <div className="mt-2">
            <RangeSlider
              label="Battery capacity"
              value={bess.kWh}
              min={5}
              max={500}
              step={5}
              unit="kWh"
              hint="Total usable capacity installed"
              onChange={v => onBessChange({ kWh: v })}
            />

            <SegmentedControl
              label="Battery chemistry"
              options={CHEM_OPTIONS}
              value={bess.chemistry}
              hint="LFP retains value significantly better — 3,000+ cycle life vs 300–500 for lead-acid"
              onChange={v => onBessChange({ chemistry: v })}
            />

            <SegmentedControl
              label="Estimated battery health (SoH)"
              options={SOH_OPTIONS}
              value={bess.soh}
              hint="State of Health — most LFP systems remain above 80% SoH for 8–10 years"
              onChange={v => onBessChange({ soh: v })}
            />

            <SegmentedControl
              label="Battery brand"
              options={BRAND_OPTIONS}
              value={bess.brand}
              onChange={v => onBessChange({ brand: v })}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-6 w-full font-body font-semibold text-sm text-white rounded-xl py-3 transition-opacity hover:opacity-90"
        style={{ background: '#39575C' }}
      >
        Next: System condition →
      </button>
    </div>
  );
}

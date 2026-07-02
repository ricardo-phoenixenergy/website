'use client';

import type { SolarInputs, BessInputs } from '@/lib/valuation/types';
import { RangeSlider } from './RangeSlider';
import { NumberField } from './NumberField';
import { SegmentedControl } from './SegmentedControl';
import { SelectControl } from './SelectControl';
import { Toggle } from './Toggle';
import { IconArrowRight } from '@/components/ui/Icons';

interface Step1SystemDetailsProps {
  solar: SolarInputs;
  bess: BessInputs;
  onSolarChange: (patch: Partial<SolarInputs>) => void;
  onBessChange: (patch: Partial<BessInputs>) => void;
  onNext: () => void;
}

const toOptions = (brands: string[]) =>
  [...brands].sort((a, b) => a.localeCompare(b)).map((b) => ({ value: b, label: b }));

const PANEL_BRANDS = toOptions([
  'JA Solar', 'Canadian Solar', 'LONGi', 'Trina Solar', 'JinkoSolar', 'Yingli', 'SunPower',
  'Tongwei', 'Chint / Astronergy', 'AIKO Solar', 'Risen Energy', 'GCL System', 'TCL',
]);

// Shared across the inverter and battery brand dropdowns — many manufacturers
// (Sungrow, Sigenergy, Huawei, WEG, BYD …) make both, so we list them together.
const INVERTER_BATTERY_BRANDS = toOptions([
  'Sunsynk', 'Deye', 'Sungrow', 'Solis', 'Goodwe', 'Victron', 'SolarEdge',
  'Fronius', 'Huawei', 'SMA', 'Sigenergy', 'WEG',
  'Pylontech', 'BYD', 'Freedom Won', 'Hubble', 'Dyness', 'Shoto',
  'CATL', 'EVE Energy', 'ATESS',
]);

const INVERTER_OPTIONS: { value: SolarInputs['inverterType']; label: string }[] = [
  { value: 'string', label: 'Grid-Tied / String' },
  { value: 'hybrid', label: 'Hybrid' },
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

const SOLAR_MAX = 10000; // 10 MW
const INVERTER_MAX = 10000; // 10 MW
const BESS_MAX = 20000; // 20 MWh

const NEXT_BTN =
  'mt-6 w-full inline-flex items-center justify-center gap-2 font-body font-semibold text-sm text-white rounded-xl py-3 transition-opacity hover:opacity-90';

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

      <NumberField
        label="Installed solar capacity"
        value={solar.kw}
        min={0}
        max={SOLAR_MAX}
        unit="kWp"
        hint="Total installed panel capacity — up to 10,000 kWp (10 MW)"
        onChange={v => onSolarChange({ kw: v })}
      />

      <RangeSlider
        label="Year of installation"
        value={solar.installYear}
        min={2015}
        max={2025}
        step={1}
        unit=""
        hint="Age determines panel degradation and remaining useful life"
        onChange={v => onSolarChange({ installYear: v })}
        formatValue={v => String(v)}
      />

      <SelectControl
        label="Panel brand"
        options={PANEL_BRANDS}
        value={solar.panelBrand}
        allowOther
        otherPlaceholder="Type your panel brand"
        onChange={v => onSolarChange({ panelBrand: v })}
      />

      <SegmentedControl
        label="Inverter type"
        options={INVERTER_OPTIONS}
        value={solar.inverterType}
        hint="Hybrid inverters command a premium as they support battery storage"
        onChange={v => onSolarChange({ inverterType: v })}
      />

      <NumberField
        label="Inverter capacity"
        value={solar.inverterKw}
        min={0}
        max={INVERTER_MAX}
        unit="kW"
        hint="Combined rating of your inverter(s)"
        onChange={v => onSolarChange({ inverterKw: v })}
      />

      <SelectControl
        label="Inverter brand"
        options={INVERTER_BATTERY_BRANDS}
        value={solar.inverterBrand}
        allowOther
        otherPlaceholder="Type your inverter brand"
        onChange={v => onSolarChange({ inverterBrand: v })}
      />

      <div
        className="mt-6 pt-6"
        style={{ borderTop: '1px solid #E5E7EB' }}
      >
        <Toggle
          label="Does your system include battery storage?"
          subLabel="Battery storage is valued separately and can significantly increase total buyback value"
          checked={bess.enabled}
          onChange={v => onBessChange({ enabled: v })}
        />

        {bess.enabled && (
          <div className="mt-2">
            <NumberField
              label="Battery capacity"
              value={bess.kWh}
              min={0}
              max={BESS_MAX}
              unit="kWh"
              hint="Total usable capacity — up to 20,000 kWh (20 MWh)"
              onChange={v => onBessChange({ kWh: v })}
            />

            <SelectControl
              label="Battery brand"
              options={INVERTER_BATTERY_BRANDS}
              value={bess.brand}
              allowOther
              otherPlaceholder="Type your battery brand"
              onChange={v => onBessChange({ brand: v })}
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
          </div>
        )}
      </div>

      <button type="button" onClick={onNext} className={NEXT_BTN} style={{ background: '#39575C' }}>
        Next: System condition <IconArrowRight size={14} />
      </button>
    </div>
  );
}

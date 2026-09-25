'use client';

import { useId, useState } from 'react';
import type { SolarInputs, BessInputs } from '@/lib/valuation/types';
import { CHEMISTRY_LABEL, INVERTER_TYPE_LABEL, SOH_LABEL, optionsFrom } from '@/lib/valuation/labels';
import { SIZE_FIELDS, sizeMessage, type SizeField } from '@/lib/valuation/sizeFields';
import type { AmountIssue } from '@/lib/parseAmount';
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

const INVERTER_OPTIONS = optionsFrom(INVERTER_TYPE_LABEL);
const CHEM_OPTIONS = optionsFrom(CHEMISTRY_LABEL);
const SOH_OPTIONS = optionsFrom(SOH_LABEL);

// Commissioning years offered: this year back to 2010.
const THIS_YEAR = new Date().getFullYear();
const FIRST_YEAR = 2010;

type SizeIssues = Partial<Record<SizeField, AmountIssue>>;

/** A message per size field, naming its actual problem, or nothing when the value is usable. */
function sizeErrors(solar: SolarInputs, bess: BessInputs, issues: SizeIssues): Partial<Record<SizeField, string>> {
  const errors: Partial<Record<SizeField, string>> = {};
  const check = (key: SizeField, value: number) => {
    const message = sizeMessage(key, value, issues[key] ?? null);
    if (message) errors[key] = message;
  };
  check('kw', solar.kw);
  check('inverterKw', solar.inverterKw);
  if (bess.enabled) check('kWh', bess.kWh);
  return errors;
}

const NEXT_BTN =
  'mt-6 w-full inline-flex items-center justify-center gap-2 font-body font-semibold text-sm text-white rounded-xl py-3 transition-opacity hover:opacity-90';

export function Step1SystemDetails({
  solar,
  bess,
  onSolarChange,
  onBessChange,
  onNext,
}: Step1SystemDetailsProps) {
  const uid = useId();
  const fieldId = (k: SizeField) => `${uid}-${k}`;
  // Errors show once the visitor tries to continue, then update as they type.
  const [attempted, setAttempted] = useState(false);
  // Why each field's text isn't a number, if it isn't (the values alone can't say).
  const [issues, setIssues] = useState<SizeIssues>({});
  const errors = attempted ? sizeErrors(solar, bess, issues) : {};

  const noteIssue = (key: SizeField, issue: AmountIssue | null) =>
    setIssues((prev) => {
      if ((prev[key] ?? null) === issue) return prev;
      const next = { ...prev };
      if (issue) next[key] = issue;
      else delete next[key];
      return next;
    });

  const handleNext = () => {
    const found = sizeErrors(solar, bess, issues);
    const first = (['kw', 'inverterKw', 'kWh'] as SizeField[]).find((k) => found[k]);
    if (first) {
      setAttempted(true);
      document.getElementById(fieldId(first))?.focus();
      return;
    }
    onNext();
  };

  return (
    <div>
      <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-4">
        Solar array
      </p>

      <NumberField
        id={fieldId('kw')}
        label="Installed solar capacity"
        value={solar.kw}
        unit={SIZE_FIELDS.kw.unit}
        decimals={SIZE_FIELDS.kw.decimals}
        error={errors.kw}
        hint="Total installed panel capacity, up to 10,000 kWp (10 MW)."
        onChange={(v, issue) => { onSolarChange({ kw: v }); noteIssue('kw', issue); }}
      />

      <RangeSlider
        label="Year of installation"
        value={solar.installYear}
        min={FIRST_YEAR}
        max={THIS_YEAR}
        step={1}
        unit=""
        hint="Age determines panel degradation and remaining useful life."
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
        hint="Hybrid inverters command a premium as they support battery storage."
        onChange={v => onSolarChange({ inverterType: v })}
      />

      <NumberField
        id={fieldId('inverterKw')}
        label="Inverter capacity"
        value={solar.inverterKw}
        unit={SIZE_FIELDS.inverterKw.unit}
        decimals={SIZE_FIELDS.inverterKw.decimals}
        error={errors.inverterKw}
        hint="Combined rating of your inverter(s)."
        onChange={(v, issue) => { onSolarChange({ inverterKw: v }); noteIssue('inverterKw', issue); }}
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
        style={{ borderTop: '1px solid var(--color-pe-border)' }}
      >
        <Toggle
          label="Does your system include battery storage?"
          subLabel="Include batteries so our team can value them with the rest of your system."
          checked={bess.enabled}
          // The battery field remounts from its value, so a reason from before goes with it.
          onChange={v => { onBessChange({ enabled: v }); noteIssue('kWh', null); }}
        />

        {bess.enabled && (
          <div className="mt-2">
            <NumberField
              id={fieldId('kWh')}
              label="Battery capacity"
              value={bess.kWh}
              unit={SIZE_FIELDS.kWh.unit}
              decimals={SIZE_FIELDS.kWh.decimals}
              error={errors.kWh}
              hint="Total usable capacity, up to 20,000 kWh (20 MWh)."
              onChange={(v, issue) => { onBessChange({ kWh: v }); noteIssue('kWh', issue); }}
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
              hint="LFP retains value significantly better, with a cycle life of 3,000+ against 300 to 500 for lead-acid."
              onChange={v => onBessChange({ chemistry: v })}
            />

            <SegmentedControl
              label="Estimated battery health (SoH)"
              options={SOH_OPTIONS}
              value={bess.soh}
              hint="SoH is State of Health. Most LFP systems remain above 80% SoH for 8 to 10 years."
              onChange={v => onBessChange({ soh: v })}
            />
          </div>
        )}
      </div>

      <button type="button" onClick={handleNext} className={NEXT_BTN} style={{ background: 'var(--color-pe-primary)' }}>
        Next: System condition <IconArrowRight size={14} />
      </button>
    </div>
  );
}

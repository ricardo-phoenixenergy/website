'use client';

import type { ConditionInputs } from '@/lib/valuation/types';
import { SegmentedControl } from './SegmentedControl';

interface Step2ConditionProps {
  cond: ConditionInputs;
  onChange: (patch: Partial<ConditionInputs>) => void;
  onBack: () => void;
  onNext: () => void;
}

const CONDITION_OPTIONS: { value: ConditionInputs['condition']; label: string }[] = [
  { value: 'exc', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

const WARRANTY_OPTIONS: { value: ConditionInputs['warrantyYears']; label: string }[] = [
  { value: 'full', label: '15+ years' },
  { value: 'mid', label: '5–15 years' },
  { value: 'low', label: 'Under 5 years' },
  { value: 'none', label: 'Expired' },
];

const PROVINCE_OPTIONS: { value: ConditionInputs['province']; label: string }[] = [
  { value: 'gp', label: 'Gauteng' },
  { value: 'wc', label: 'Western Cape' },
  { value: 'kzn', label: 'KZN' },
  { value: 'other', label: 'Other' },
];

const REASON_OPTIONS: { value: ConditionInputs['reason']; label: string }[] = [
  { value: 'upgrade', label: 'Upgrading' },
  { value: 'relocate', label: 'Relocating' },
  { value: 'finance', label: 'Refinancing' },
  { value: 'other', label: 'Other' },
];

export function Step2Condition({ cond, onChange, onBack, onNext }: Step2ConditionProps) {
  return (
    <div>
      <SegmentedControl
        label="Overall system condition"
        options={CONDITION_OPTIONS}
        value={cond.condition}
        hint="Excellent: no faults, recently serviced · Poor: inverter faults or physical damage"
        onChange={v => onChange({ condition: v })}
      />

      <SegmentedControl<'yes' | 'no'>
        label="Monitoring system"
        options={[
          { value: 'yes', label: 'Yes — remote monitoring' },
          { value: 'no', label: 'No monitoring' },
        ]}
        value={cond.monitoring ? 'yes' : 'no'}
        hint="Verified production data substantially increases buyer confidence"
        onChange={v => onChange({ monitoring: v === 'yes' })}
      />

      <SegmentedControl
        label="Panel warranty remaining"
        options={WARRANTY_OPTIONS}
        value={cond.warrantyYears}
        onChange={v => onChange({ warrantyYears: v })}
      />

      <SegmentedControl<'yes' | 'no'>
        label="COC / electrical compliance cert"
        options={[
          { value: 'yes', label: 'Yes — in hand' },
          { value: 'no', label: 'No / not sure' },
        ]}
        value={cond.hasCoc ? 'yes' : 'no'}
        hint="Required for resale — absence discounted from value"
        onChange={v => onChange({ hasCoc: v === 'yes' })}
      />

      <SegmentedControl
        label="Province / region"
        options={PROVINCE_OPTIONS}
        value={cond.province}
        hint="Affects regional solar yield used in DCF"
        onChange={v => onChange({ province: v })}
      />

      <SegmentedControl
        label="Reason for selling"
        options={REASON_OPTIONS}
        value={cond.reason}
        hint="Informational only — routed to WeBuySolar team"
        onChange={v => onChange({ reason: v })}
      />

      {/* Methodology callout */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{ background: 'rgba(57,87,92,0.06)', border: '1px solid rgba(57,87,92,0.15)' }}
      >
        <p className="font-body font-semibold text-xs text-[#39575C] mb-1.5">
          How we value your system
        </p>
        <p className="font-body text-[11px] text-[#6B7280] leading-[1.75]">
          Phoenix Energy uses a weighted three-method approach — DCF analysis (present value
          of future displaced tariff savings calculated from actual system capacity, not your
          net bill), depreciated replacement cost (current SA market rate adjusted for age,
          condition and component quality), and market comparables from recent WeBuySolar
          transactions. Solar and BESS are valued independently and then combined.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="font-body font-semibold text-sm text-[#6B7280] rounded-xl py-3 px-6 transition-colors hover:text-[#39575C]"
          style={{ border: '1px solid #E5E7EB', background: 'white' }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 font-body font-semibold text-sm text-white rounded-xl py-3 transition-opacity hover:opacity-90"
          style={{ background: '#39575C' }}
        >
          View my valuation →
        </button>
      </div>
    </div>
  );
}

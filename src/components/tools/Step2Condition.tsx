'use client';

import type { ConditionInputs } from '@/lib/valuation/types';
import { PROVINCE_OPTIONS } from '@/lib/valuation/provinces';
import { SegmentedControl } from './SegmentedControl';
import { SelectControl } from './SelectControl';
import { IconArrowLeft, IconArrowRight } from '@/components/ui/Icons';

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

const BACK_BTN =
  'inline-flex items-center justify-center gap-2 font-body font-semibold text-sm text-[#6B7280] rounded-xl py-3 px-6 transition-colors hover:text-[#39575C]';
const NEXT_BTN =
  'flex-1 inline-flex items-center justify-center gap-2 font-body font-semibold text-sm text-white rounded-xl py-3 transition-opacity hover:opacity-90';

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

      <SelectControl
        label="Province / region"
        options={PROVINCE_OPTIONS}
        value={cond.province}
        hint="Used to reflect regional solar performance"
        onChange={v => onChange({ province: v as ConditionInputs['province'] })}
      />

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onBack} className={BACK_BTN} style={{ border: '1px solid #E5E7EB', background: 'white' }}>
          <IconArrowLeft size={14} /> Back
        </button>
        <button type="button" onClick={onNext} className={NEXT_BTN} style={{ background: '#39575C' }}>
          View my valuation <IconArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

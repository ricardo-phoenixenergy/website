'use client';

import type { ConditionInputs } from '@/lib/valuation/types';
import { PROVINCE_OPTIONS } from '@/lib/valuation/provinces';
import { CONDITION_LABEL, DOCS_SHORT_LABEL, MONITORING_LABEL, optionsFrom } from '@/lib/valuation/labels';
import { SegmentedControl } from './SegmentedControl';
import { SelectControl } from './SelectControl';
import { IconArrowLeft, IconArrowRight } from '@/components/ui/Icons';

interface Step2ConditionProps {
  cond: ConditionInputs;
  onChange: (patch: Partial<ConditionInputs>) => void;
  onBack: () => void;
  onNext: () => void;
}

const CONDITION_OPTIONS = optionsFrom(CONDITION_LABEL);
const DOCS_OPTIONS = optionsFrom(DOCS_SHORT_LABEL);
const MONITORING_OPTIONS = optionsFrom(MONITORING_LABEL);

const BACK_BTN =
  'inline-flex items-center justify-center gap-2 font-body font-semibold text-sm text-pe-muted rounded-xl py-3 px-6 transition-colors hover:text-pe-primary';
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
        options={MONITORING_OPTIONS}
        value={cond.monitoring ? 'yes' : 'no'}
        hint="Verified production data substantially increases buyer confidence."
        onChange={v => onChange({ monitoring: v === 'yes' })}
      />

      <SegmentedControl
        label="Documentation & compliance"
        options={DOCS_OPTIONS}
        value={cond.docs}
        hint="Full pack = Certificate of Compliance (COC), single-line diagrams (SLDs) and the system handover documents. Complete paperwork de-risks resale and improves value."
        onChange={v => onChange({ docs: v })}
      />

      <SelectControl
        label="Province / region"
        options={PROVINCE_OPTIONS}
        value={cond.province}
        hint="Used to reflect regional solar performance."
        onChange={v => onChange({ province: v as ConditionInputs['province'] })}
      />

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onBack} className={BACK_BTN} style={{ border: '1px solid var(--color-pe-border)', background: 'white' }}>
          <IconArrowLeft size={14} /> Back
        </button>
        <button type="button" onClick={onNext} className={NEXT_BTN} style={{ background: 'var(--color-pe-primary)' }}>
          Next: your contact details <IconArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// src/components/tools/SolarValuationTool.tsx
'use client';
import { useState, useRef } from 'react';
import type { SolarInputs, BessInputs, ConditionInputs } from '@/lib/valuation/types';
import { dlPush } from '@/lib/analytics';
import { StepIndicator } from './StepIndicator';
import { Step1SystemDetails } from './Step1SystemDetails';
import { Step2Condition } from './Step2Condition';
import { Step3Capture } from './Step3Capture';

const DEFAULT_SOLAR: SolarInputs = {
  kw: 250,
  installYear: 2021,
  inverterType: 'string',
  inverterKw: 250,
  panelBrand: 'JA Solar',
  inverterBrand: 'Sunsynk',
};

const DEFAULT_BESS: BessInputs = {
  enabled: false,
  kWh: 250,
  chemistry: 'lfp',
  soh: 'high',
  brand: 'Pylontech',
};

const DEFAULT_COND: ConditionInputs = {
  condition: 'exc',
  monitoring: true,
  docs: 'full',
  province: 'gp',
};

export function SolarValuationTool() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [solar, setSolar] = useState<SolarInputs>(DEFAULT_SOLAR);
  const [bess, setBess] = useState<BessInputs>(DEFAULT_BESS);
  const [cond, setCond] = useState<ConditionInputs>(DEFAULT_COND);
  const reachedCaptureRef = useRef(false);

  const goToCapture = () => {
    setStep(3);
    if (!reachedCaptureRef.current) {
      reachedCaptureRef.current = true;
      dlPush({
        event: 'valuation_complete',
        kw: solar.kw,
        bess_kwh: bess.enabled ? bess.kWh : 0,
        install_year: solar.installYear,
      });
    }
  };

  return (
    <div
      className="bg-white rounded-2xl p-6 md:p-8 mx-auto"
      style={{
        border: '1px solid #E5E7EB',
        maxWidth: 680,
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      }}
    >
      <StepIndicator current={step} />

      {step === 1 && (
        <Step1SystemDetails
          solar={solar}
          bess={bess}
          onSolarChange={patch => setSolar(prev => ({ ...prev, ...patch }))}
          onBessChange={patch => setBess(prev => ({ ...prev, ...patch }))}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step2Condition
          cond={cond}
          onChange={patch => setCond(prev => ({ ...prev, ...patch }))}
          onBack={() => setStep(1)}
          onNext={goToCapture}
        />
      )}

      {step === 3 && (
        <Step3Capture
          solar={solar}
          bess={bess}
          cond={cond}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}

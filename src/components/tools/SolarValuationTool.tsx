// src/components/tools/SolarValuationTool.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import type { SolarInputs, BessInputs, ConditionInputs } from '@/lib/valuation/types';
import { dlPush } from '@/lib/analytics';
import { StepIndicator } from './StepIndicator';
import { Step1SystemDetails } from './Step1SystemDetails';
import { Step2Condition } from './Step2Condition';
import { Step3Capture } from './Step3Capture';
import { RecaptchaScript } from '@/components/ui/RecaptchaScript';

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

const STEP_TITLES: Record<1 | 2 | 3, string> = {
  1: 'System details',
  2: 'Condition',
  3: 'Your details',
};

export function SolarValuationTool() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [solar, setSolar] = useState<SolarInputs>(DEFAULT_SOLAR);
  const [bess, setBess] = useState<BessInputs>(DEFAULT_BESS);
  const [cond, setCond] = useState<ConditionInputs>(DEFAULT_COND);
  const reachedCaptureRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Only a step change the visitor makes moves focus; the first render doesn't.
  const moveFocusRef = useRef(false);

  useEffect(() => {
    if (!moveFocusRef.current) return;
    moveFocusRef.current = false;
    headingRef.current?.focus();
  }, [step]);

  const goTo = (next: 1 | 2 | 3) => {
    moveFocusRef.current = true;
    setStep(next);
  };

  const goToCapture = () => {
    goTo(3);
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
        border: '1px solid var(--color-pe-border)',
        maxWidth: 680,
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      }}
    >
      <RecaptchaScript />
      <StepIndicator current={step} />

      <h2 ref={headingRef} tabIndex={-1} className="sr-only">
        Step {step} of 3: {STEP_TITLES[step]}
      </h2>

      {step === 1 && (
        <Step1SystemDetails
          solar={solar}
          bess={bess}
          onSolarChange={patch => setSolar(prev => ({ ...prev, ...patch }))}
          onBessChange={patch => setBess(prev => ({ ...prev, ...patch }))}
          onNext={() => goTo(2)}
        />
      )}

      {step === 2 && (
        <Step2Condition
          cond={cond}
          onChange={patch => setCond(prev => ({ ...prev, ...patch }))}
          onBack={() => goTo(1)}
          onNext={goToCapture}
        />
      )}

      {step === 3 && (
        <Step3Capture
          solar={solar}
          bess={bess}
          cond={cond}
          onBack={() => goTo(2)}
        />
      )}
    </div>
  );
}

// src/components/tools/Step3Results.tsx
'use client';
import type { SolarInputs, BessInputs, ConditionInputs, ValuationResult } from '@/lib/valuation/types';
import { ResultsGrid } from './ResultsGrid';
import { DCFBarChart } from './DCFBarChart';
import { BreakdownRows } from './BreakdownRows';
import { SoftPaywall } from './SoftPaywall';

interface Step3ResultsProps {
  solar: SolarInputs;
  bess: BessInputs;
  cond: ConditionInputs;
  result: ValuationResult;
  unlocked: boolean;
  onUnlock: () => void;
  onBack: () => void;
}

function WhatHappensNext() {
  const steps = [
    {
      n: 1,
      text: 'WeBuySolar specialist reviews valuation and contacts you within 1 business day',
    },
    {
      n: 2,
      text: 'Free on-site verification arranged to confirm system condition and production data',
    },
    {
      n: 3,
      text: 'Formal written offer within 5 business days — no obligation to accept',
    },
  ];
  return (
    <div
      className="rounded-xl p-5 mt-6"
      style={{ background: 'rgba(57,87,92,0.06)', border: '1px solid rgba(57,87,92,0.15)' }}
    >
      <p className="font-display font-bold text-[13px] text-[#39575C] mb-3">
        What happens next
      </p>
      <div className="flex flex-col gap-3">
        {steps.map(s => (
          <div key={s.n} className="flex items-start gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: '#39575C' }}
            >
              <span className="font-display font-bold text-[10px] text-white">{s.n}</span>
            </div>
            <p className="font-body text-xs text-[#6B7280] leading-[1.65]">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Step3Results({
  solar,
  bess,
  cond,
  result,
  unlocked,
  onUnlock,
  onBack,
}: Step3ResultsProps) {
  return (
    <div>
      {/* Blurred results layer */}
      <div className="relative">
        <div
          aria-hidden={!unlocked}
          aria-live={unlocked ? 'polite' : undefined}
          style={{
            filter: unlocked ? 'none' : 'blur(7px)',
            userSelect: unlocked ? 'auto' : 'none',
            pointerEvents: unlocked ? 'auto' : 'none',
            transition: 'filter 0.4s',
          }}
        >
          <ResultsGrid result={result} hasBess={bess.enabled} />
          <DCFBarChart yrCashFlows={result.yrCashFlows} />
          <BreakdownRows solar={solar} bess={bess} cond={cond} result={result} />
        </div>

        {/* Soft paywall overlay */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center py-8">
            <SoftPaywall
              result={result}
              solar={solar}
              bess={bess}
              cond={cond}
              onUnlock={onUnlock}
            />
          </div>
        )}
      </div>

      {/* Post-unlock: what happens next */}
      {unlocked && <WhatHappensNext />}

      <button
        type="button"
        onClick={onBack}
        className="mt-5 font-body text-xs text-[#6B7280] hover:text-[#39575C] transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}

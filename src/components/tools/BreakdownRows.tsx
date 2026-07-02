'use client';
import type { SolarInputs, BessInputs, ConditionInputs, ValuationResult } from '@/lib/valuation/types';

function fmtRand(n: number) {
  return `R ${Math.round(n).toLocaleString('en-ZA')}`;
}

const PROVINCE_LABEL: Record<ConditionInputs['province'], string> = {
  gp: 'Gauteng',
  wc: 'Western Cape',
  kzn: 'KwaZulu-Natal',
  other: 'Other',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex justify-between items-baseline py-2.5"
      style={{ borderBottom: '1px solid #E5E7EB' }}
    >
      <span className="font-body text-xs text-[#6B7280]">{label}</span>
      <span className="font-body font-semibold text-xs text-[#1A1A1A] text-right ml-4">
        {value}
      </span>
    </div>
  );
}

interface BreakdownRowsProps {
  solar: SolarInputs;
  bess: BessInputs;
  cond: ConditionInputs;
  result: ValuationResult;
}

export function BreakdownRows({ solar, bess, cond, result }: BreakdownRowsProps) {
  const age = new Date().getFullYear() - solar.installYear;

  return (
    <div className="mb-6">
      <p className="font-display font-bold text-sm text-[#1A1A1A] mb-1">
        Your system
      </p>
      <div>
        <Row label="Solar capacity" value={`${solar.kw} kWp`} />
        {bess.enabled && (
          <Row label="Battery storage" value={`${bess.kWh} kWh`} />
        )}
        <Row
          label="System age"
          value={`${age} year${age !== 1 ? 's' : ''} (installed ${solar.installYear})`}
        />
        <Row label="Province" value={PROVINCE_LABEL[cond.province]} />
        <Row label="Solar array value" value={fmtRand(result.solarFinal)} />
        {bess.enabled && (
          <Row label="Battery value" value={fmtRand(result.bessVal)} />
        )}
        <Row
          label="Indicative buyback range"
          value={`${fmtRand(result.rangeLow)} – ${fmtRand(result.rangeHigh)}`}
        />
      </div>
      <p className="font-body text-[10px] text-[#9CA3AF] leading-[1.65] mt-3">
        Based on current South African market rates. This is an indicative estimate only —
        a formal offer requires on-site verification.
      </p>
    </div>
  );
}

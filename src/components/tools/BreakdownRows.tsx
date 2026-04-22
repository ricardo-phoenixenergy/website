'use client';
import { CONSTANTS } from '@/lib/valuation/constants';
import type { SolarInputs, BessInputs, ConditionInputs, ValuationResult } from '@/lib/valuation/types';

function fmtRand(n: number) {
  return `R ${Math.round(n).toLocaleString('en-ZA')}`;
}

const PROVINCE_LABEL: Record<ConditionInputs['province'], string> = {
  gp: 'Gauteng',
  wc: 'Western Cape',
  kzn: 'KZN',
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
  const yield_ = CONSTANTS.SA_YIELD_KWH_PER_KWP[cond.province];
  const yr1Saving = result.yrCashFlows[0] ?? 0;

  return (
    <div className="mb-6">
      <p className="font-display font-bold text-[13px] text-[#1A1A1A] mb-1">
        Calculation breakdown
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
        <Row
          label="Regional solar yield"
          value={`${yield_} kWh/kWp/yr (${PROVINCE_LABEL[cond.province]})`}
        />
        <Row label="Yr 1 displaced electricity saving" value={fmtRand(yr1Saving)} />
        <Row label="10-yr DCF value" value={fmtRand(result.solarDcf)} />
        <Row
          label="Solar array depreciated cost value"
          value={fmtRand(result.solarCostVal)}
        />
        {bess.enabled && (
          <Row label="BESS depreciated value" value={fmtRand(result.bessVal)} />
        )}
        <Row label="Blended solar valuation" value={fmtRand(result.solarFinal)} />
        <Row
          label="Indicative buyback range"
          value={`${fmtRand(result.rangeLow)} – ${fmtRand(result.rangeHigh)}`}
        />
      </div>
      <p
        className="font-body text-[10px] text-[#9CA3AF] leading-[1.65] mt-3"
      >
        Based on April 2026 SA market rates. Sources: EnergyBee, LZY Energy, SA PV
        Know-How, NERSA tariff ruling, Standard Bank energy report Feb 2025.
        Self-consumption ratio: 80% (industry standard). WACC: 12% (SA risk-adjusted).
        Tariff escalation: 12.7% (NERSA approved 2025/26).{' '}
        <strong>This is an indicative estimate only — a formal offer requires on-site verification.</strong>
      </p>
    </div>
  );
}

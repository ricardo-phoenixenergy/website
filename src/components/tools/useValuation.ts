'use client';
// src/components/tools/useValuation.ts
import { useMemo } from 'react';
import type { SolarInputs, BessInputs, ConditionInputs, ValuationResult } from '@/lib/valuation/types';
import { computeDCF, computeSolarCostVal, computeSolarFinal } from '@/lib/valuation/solarModel';
import { computeBessVal } from '@/lib/valuation/bessModel';

export function useValuation(
  solar: SolarInputs,
  bess: BessInputs,
  cond: ConditionInputs,
): ValuationResult {
  return useMemo(() => {
    const { dcfTotal, yrCashFlows } = computeDCF(solar, cond);
    const { solarCostVal, solarReplacement } = computeSolarCostVal(solar, cond);
    const { solarFinal, solarMktAdj } = computeSolarFinal(dcfTotal, solarCostVal, solar.tier);
    const { bessVal, bessReplacement } = computeBessVal(bess, cond, solar.installYear);

    const total = solarFinal + bessVal;
    const replacementTotal = solarReplacement + bessReplacement;
    const retained = replacementTotal > 0 ? (total / replacementTotal) * 100 : 0;

    return {
      solarDcf: dcfTotal,
      solarCostVal,
      solarMktAdj,
      solarFinal,
      bessVal,
      total,
      rangeLow: total * 0.88,
      rangeHigh: total * 1.12,
      solarReplacement,
      bessReplacement,
      retained,
      yrCashFlows,
    };
  }, [solar, bess, cond]);
}

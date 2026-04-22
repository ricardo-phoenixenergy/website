// src/lib/valuation/bessModel.ts
import { CONSTANTS } from './constants';
import type { BessInputs, ConditionInputs } from './types';

const BRAND_MULT: Record<BessInputs['brand'], number> = {
  premium: 1.00,
  mid: 0.85,
  generic: 0.65,
};

const SOH_MULT: Record<BessInputs['soh'], number> = {
  high: 1.00,
  mid: 0.80,
  low: 0.55,
};

const CONDITION_MULT: Record<ConditionInputs['condition'], number> = {
  exc: 1.00,
  good: 0.88,
  fair: 0.72,
  poor: 0.52,
};

export function computeBessVal(
  bess: BessInputs,
  cond: ConditionInputs,
  installYear: number,
): { bessVal: number; bessReplacement: number } {
  if (!bess.enabled) return { bessVal: 0, bessReplacement: 0 };

  const age = new Date().getFullYear() - installYear;
  const bessReplacement = bess.kWh * CONSTANTS.BESS_RATE_PER_KWH[bess.chemistry];
  const bessAgeFactor = Math.max(
    0,
    1 - age / CONSTANTS.BESS_LIFE_YEARS[bess.chemistry],
  );
  const bessVal =
    bessReplacement *
    bessAgeFactor *
    SOH_MULT[bess.soh] *
    BRAND_MULT[bess.brand] *
    CONDITION_MULT[cond.condition];

  return { bessVal, bessReplacement };
}

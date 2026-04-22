// src/lib/valuation/solarModel.ts
import { CONSTANTS } from './constants';
import type { SolarInputs, ConditionInputs } from './types';

const CONDITION_MULT: Record<ConditionInputs['condition'], number> = {
  exc: 1.00,
  good: 0.88,
  fair: 0.72,
  poor: 0.52,
};

const WARRANTY_MULT: Record<ConditionInputs['warrantyYears'], number> = {
  full: 1.05,
  mid: 1.00,
  low: 0.93,
  none: 0.85,
};

const TIER_MULT: Record<SolarInputs['tier'], number> = {
  T1: 1.00,
  T2: 0.88,
  T3: 0.72,
};

const DEG_KEY_MAP: Record<SolarInputs['tier'], keyof typeof CONSTANTS.DEGRADATION_RATE> = {
  T1: 't1',
  T2: 't2',
  T3: 't3',
};

export function computeDCF(
  solar: SolarInputs,
  cond: ConditionInputs,
): { dcfTotal: number; yrCashFlows: number[] } {
  const yield_ = CONSTANTS.SA_YIELD_KWH_PER_KWP[cond.province];
  const degRate = CONSTANTS.DEGRADATION_RATE[DEG_KEY_MAP[solar.tier]];
  const yrCashFlows: number[] = [];
  let dcfTotal = 0;

  for (let i = 1; i <= CONSTANTS.DCF_YEARS; i++) {
    const tariff =
      CONSTANTS.TARIFF_2025_RAND_PER_KWH *
      Math.pow(1 + CONSTANTS.TARIFF_ESCALATION_ANNUAL, i - 1);
    const perfFactor = Math.max(
      1 - CONSTANTS.MAX_DEGRADATION,
      1 - degRate * (i - 1),
    );
    const gen = solar.kw * yield_ * perfFactor * CONSTANTS.SELF_CONSUMPTION_RATIO;
    const saving = gen * tariff;
    yrCashFlows.push(saving);
    dcfTotal += saving / Math.pow(1 + CONSTANTS.WACC, i);
  }

  return { dcfTotal, yrCashFlows };
}

export function computeSolarCostVal(
  solar: SolarInputs,
  cond: ConditionInputs,
): { solarCostVal: number; solarReplacement: number } {
  const age = new Date().getFullYear() - solar.installYear;
  const solarReplacement = solar.kw * CONSTANTS.INVERTER_RATE_PER_KWP[solar.inverterType];
  const ageFactor = Math.max(0, 1 - age / CONSTANTS.PANEL_LIFESPAN_YEARS);
  const condM = CONDITION_MULT[cond.condition];
  const monM = cond.monitoring ? 1.04 : 0.97;
  const warrM = WARRANTY_MULT[cond.warrantyYears];
  const cocM = cond.hasCoc ? 1.00 : 0.93;
  const solarCostVal = solarReplacement * ageFactor * condM * monM * warrM * cocM;
  return { solarCostVal, solarReplacement };
}

export function computeSolarFinal(
  dcfTotal: number,
  solarCostVal: number,
  tier: SolarInputs['tier'],
): { solarFinal: number; solarMktAdj: number } {
  const solarMktAdj = solarCostVal * CONSTANTS.MKT_COMPS_DISCOUNT;
  const blended =
    dcfTotal * CONSTANTS.DCF_WEIGHT +
    solarCostVal * CONSTANTS.COST_WEIGHT +
    solarMktAdj * CONSTANTS.MKT_WEIGHT;
  const solarFinal = blended * TIER_MULT[tier];
  return { solarFinal, solarMktAdj };
}

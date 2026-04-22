// src/lib/valuation/types.ts

export interface SolarInputs {
  kw: number;
  installYear: number;
  tier: 'T1' | 'T2' | 'T3';
  inverterType: 'string' | 'hybrid' | 'micro' | 'offgrid';
}

export interface BessInputs {
  enabled: boolean;
  kWh: number;
  chemistry: 'lfp' | 'nmc' | 'lead';
  soh: 'high' | 'mid' | 'low';
  brand: 'premium' | 'mid' | 'generic';
}

export interface ConditionInputs {
  condition: 'exc' | 'good' | 'fair' | 'poor';
  monitoring: boolean;
  warrantyYears: 'full' | 'mid' | 'low' | 'none';
  hasCoc: boolean;
  province: 'gp' | 'wc' | 'kzn' | 'other';
  reason: 'upgrade' | 'relocate' | 'finance' | 'other';
}

export interface ValuationResult {
  solarDcf: number;
  solarCostVal: number;
  solarMktAdj: number;
  solarFinal: number;
  bessVal: number;
  total: number;
  rangeLow: number;
  rangeHigh: number;
  solarReplacement: number;
  bessReplacement: number;
  retained: number;
  yrCashFlows: number[];
}

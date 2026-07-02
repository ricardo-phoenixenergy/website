// src/lib/valuation/types.ts

export interface SolarInputs {
  kw: number;
  installYear: number;
  inverterType: 'string' | 'hybrid';
  /** Combined inverter rating (kW). Recorded for the team — does not affect the valuation. */
  inverterKw: number;
  /** Recorded for the WeBuySolar team — does not affect the valuation. */
  panelBrand: string;
  /** Recorded for the WeBuySolar team — does not affect the valuation. */
  inverterBrand: string;
}

export interface BessInputs {
  enabled: boolean;
  kWh: number;
  chemistry: 'lfp' | 'nmc' | 'lead';
  soh: 'high' | 'mid' | 'low';
  /** Recorded for the WeBuySolar team — does not affect the valuation. */
  brand: string;
}

export type Province = 'ec' | 'fs' | 'gp' | 'kzn' | 'lp' | 'mp' | 'nw' | 'nc' | 'wc';

export interface ConditionInputs {
  condition: 'exc' | 'good' | 'fair' | 'poor';
  monitoring: boolean;
  hasCoc: boolean;
  province: Province;
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

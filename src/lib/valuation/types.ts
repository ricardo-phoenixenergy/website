// src/lib/valuation/types.ts
// The Solar Asset Valuation tool is a lead-capture form: these describe the
// system details we collect and email to the WeBuySolar team, who prepare the
// valuation themselves. There is no on-site valuation calculation.

export interface SolarInputs {
  kw: number;
  installYear: number;
  inverterType: 'string' | 'hybrid';
  /** Combined inverter rating (kW). */
  inverterKw: number;
  panelBrand: string;
  inverterBrand: string;
}

export interface BessInputs {
  enabled: boolean;
  kWh: number;
  chemistry: 'lfp' | 'nmc' | 'lead';
  soh: 'high' | 'mid' | 'low';
  brand: string;
}

export type Province = 'ec' | 'fs' | 'gp' | 'kzn' | 'lp' | 'mp' | 'nw' | 'nc' | 'wc';

export interface ConditionInputs {
  condition: 'exc' | 'good' | 'fair' | 'poor';
  monitoring: boolean;
  /** Documentation held: full handover pack (COC + SLDs + docs), COC only, or none. */
  docs: 'full' | 'coc' | 'none';
  province: Province;
}

// src/lib/valuation/constants.ts
// Last updated: April 2026
// Sources: EnergyBee, LZY Energy, SA PV Know-How, NERSA, Standard Bank

export const CONSTANTS = {
  SA_YIELD_KWH_PER_KWP: { gp: 1680, wc: 1900, kzn: 1750, other: 1680 },
  SELF_CONSUMPTION_RATIO: 0.80,
  TARIFF_2025_RAND_PER_KWH: 3.50,
  TARIFF_ESCALATION_ANNUAL: 0.127,
  WACC: 0.12,
  DCF_YEARS: 10,
  PANEL_LIFESPAN_YEARS: 25,
  DEGRADATION_RATE: { t1: 0.005, t2: 0.007, t3: 0.010 },
  MAX_DEGRADATION: 0.30,
  INVERTER_RATE_PER_KWP: { string: 20000, hybrid: 25000, micro: 27000, offgrid: 30000 },
  BESS_RATE_PER_KWH: { lfp: 12000, nmc: 10500, lead: 4000 },
  BESS_LIFE_YEARS: { lfp: 12, nmc: 8, lead: 4 },
  DCF_WEIGHT: 0.45,
  COST_WEIGHT: 0.35,
  MKT_WEIGHT: 0.20,
  MKT_COMPS_DISCOUNT: 0.92,
} as const;

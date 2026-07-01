// Pure carbon-credit estimator for the Carbon Credits page.
// 1 credit = 1 tonne CO₂ avoided.

/** Specific yield assumption for SA C&I solar, kWh per kWp per year. */
export const CARBON_YIELD_KWH_PER_KWP = 1600;
/** Grid emission factor displaced by solar generation, tCO₂ per MWh. */
export const GRID_FACTOR_T_PER_MWH = 0.95;
/** Credit price band, ZAR per credit. */
export const CREDIT_PRICE_LOW = 50;
export const CREDIT_PRICE_HIGH = 150;

export interface CarbonEstimate {
  sizeKwp: number;
  /** Avoided CO₂ per year in tonnes; equals creditsPerYear (1:1). */
  tonnesPerYear: number;
  creditsPerYear: number;
  /** Estimated annual revenue in ZAR at the low price. */
  revenueLow: number;
  /** Estimated annual revenue in ZAR at the high price. */
  revenueHigh: number;
}

export function estimateCarbon(sizeKwp: number): CarbonEstimate {
  const credits = Math.round(
    (sizeKwp * CARBON_YIELD_KWH_PER_KWP * GRID_FACTOR_T_PER_MWH) / 1000,
  );
  return {
    sizeKwp,
    tonnesPerYear: credits,
    creditsPerYear: credits,
    revenueLow: credits * CREDIT_PRICE_LOW,
    revenueHigh: credits * CREDIT_PRICE_HIGH,
  };
}

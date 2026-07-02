import { ENERGY_PRICES_QUERY } from '@/lib/queries';
import { DEFAULT_ENERGY_PRICES, type EnergyPrices } from '@/lib/evfleet/estimate';
import type { EnergyPricesContent } from '@/types/sanity';

export interface ResolvedEnergyPrices extends EnergyPrices {
  effectiveDate: string | null;
  sourceLabel: string;
  isLive: boolean; // true only when every price came from a valid doc value
}

function validPrice(n: number | undefined): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n > 0;
}

/**
 * Turns a raw (possibly missing/partial/invalid) Sanity document into a fully
 * resolved, always-valid price set. Each invalid or missing price falls back to
 * its constant; isLive is true only when all four prices were valid. Pure.
 */
export function resolveEnergyPrices(raw: EnergyPricesContent | null): ResolvedEnergyPrices {
  const dieselOk = validPrice(raw?.dieselPricePerL);
  const petrolOk = validPrice(raw?.petrol93PricePerL);
  const gridOk = validPrice(raw?.gridPricePerKwh);
  const solarOk = validPrice(raw?.solarPricePerKwh);

  const effectiveDate =
    typeof raw?.effectiveDate === 'string' && raw.effectiveDate ? raw.effectiveDate : null;
  const sourceLabel =
    typeof raw?.sourceLabel === 'string' && raw.sourceLabel ? raw.sourceLabel : 'Estimated';

  return {
    dieselPricePerL: dieselOk ? (raw!.dieselPricePerL as number) : DEFAULT_ENERGY_PRICES.dieselPricePerL,
    petrol93PricePerL: petrolOk ? (raw!.petrol93PricePerL as number) : DEFAULT_ENERGY_PRICES.petrol93PricePerL,
    gridPricePerKwh: gridOk ? (raw!.gridPricePerKwh as number) : DEFAULT_ENERGY_PRICES.gridPricePerKwh,
    solarPricePerKwh: solarOk ? (raw!.solarPricePerKwh as number) : DEFAULT_ENERGY_PRICES.solarPricePerKwh,
    effectiveDate,
    sourceLabel,
    isLive: dieselOk && petrolOk && gridOk && solarOk,
  };
}

/**
 * Fetches the Sanity energyPrices singleton and resolves it. Never throws;
 * returns fully-fallback prices (isLive: false) on any error or missing doc.
 */
export async function getEnergyPrices(): Promise<ResolvedEnergyPrices> {
  try {
    // Import here to avoid server-only constraint in tests
    const { sanityServerClient } = await import('@/lib/sanity.server');
    const raw = await sanityServerClient.fetch<EnergyPricesContent | null>(ENERGY_PRICES_QUERY);
    return resolveEnergyPrices(raw);
  } catch {
    return resolveEnergyPrices(null);
  }
}

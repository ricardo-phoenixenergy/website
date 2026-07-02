// Pure EV-fleet vs diesel/petrol savings estimator for the EV Fleets page.
// All prices ZAR; energy costs are per km; CO2 in kg unless noted.

export const DIESEL_PRICE_PER_L = 24.0;
export const PETROL93_PRICE_PER_L = 24.5;
export const GRID_RATE_PER_KWH = 2.6;
export const SOLAR_RATE_PER_KWH = 1.5;
export const CO2_DIESEL_PER_L = 2.68;
export const CO2_PETROL_PER_L = 2.31;
export const CO2_GRID_PER_KWH = 0.95;
export const CO2_SOLAR_PER_KWH = 0.05;

export type FleetVehicleType = 'car' | 'van' | 'minibus' | 'truck' | 'heavytruck';
export type ChargingSource = 'grid' | 'solar';
export type FuelType = 'diesel' | 'petrol';

export interface VehicleProfile {
  label: string;
  dieselLPer100: number;
  petrolLPer100?: number; // omitted where petrol is not realistic (trucks)
  evKwhPer100: number;
}

export const FLEET_VEHICLES: Record<FleetVehicleType, VehicleProfile> = {
  car:        { label: 'Passenger / car',      dieselLPer100: 7.0,  petrolLPer100: 8.0,  evKwhPer100: 17 },
  van:        { label: 'Light delivery van',   dieselLPer100: 9.0,  petrolLPer100: 11.0, evKwhPer100: 22 },
  minibus:    { label: 'Minibus / shuttle',    dieselLPer100: 11.0, petrolLPer100: 13.0, evKwhPer100: 28 },
  truck:      { label: 'Medium truck (~4–8t)', dieselLPer100: 18.0, evKwhPer100: 60 },
  heavytruck: { label: 'Heavy truck (~26t+)',  dieselLPer100: 33.0, evKwhPer100: 130 },
};

export interface EnergyPrices {
  dieselPricePerL: number;
  petrol93PricePerL: number;
  gridPricePerKwh: number;
  solarPricePerKwh: number;
}

export const DEFAULT_ENERGY_PRICES: EnergyPrices = {
  dieselPricePerL: DIESEL_PRICE_PER_L,
  petrol93PricePerL: PETROL93_PRICE_PER_L,
  gridPricePerKwh: GRID_RATE_PER_KWH,
  solarPricePerKwh: SOLAR_RATE_PER_KWH,
};

export interface CostPerKm {
  fuel: number;
  grid: number;
  solar: number;
}

// Petrol is used only when the vehicle offers it AND the caller asked for it.
function usesPetrol(v: VehicleProfile, fuel: FuelType): boolean {
  return fuel === 'petrol' && v.petrolLPer100 !== undefined;
}

export function vehicleCostPerKm(
  type: FleetVehicleType,
  prices: EnergyPrices,
  fuel: FuelType = 'diesel',
): CostPerKm {
  const v = FLEET_VEHICLES[type];
  const petrol = usesPetrol(v, fuel);
  const lPer100 = petrol ? (v.petrolLPer100 as number) : v.dieselLPer100;
  const pricePerL = petrol ? prices.petrol93PricePerL : prices.dieselPricePerL;
  return {
    fuel: (lPer100 * pricePerL) / 100,
    grid: (v.evKwhPer100 * prices.gridPricePerKwh) / 100,
    solar: (v.evKwhPer100 * prices.solarPricePerKwh) / 100,
  };
}

export interface FleetInput {
  vehicles: number;
  type: FleetVehicleType;
  kmPerMonth: number; // per vehicle
  charging: ChargingSource;
  fuel?: FuelType;    // defaults to diesel
}

export interface FleetEstimate {
  iceCostPerKm: number; // diesel or petrol per the selected fuel
  evCostPerKm: number;
  monthlySaving: number;        // ZAR, whole fleet
  annualSaving: number;
  fiveYearSaving: number;
  co2AvoidedTonnesYear: number; // tonnes/yr, whole fleet; can be <= 0 on grid for heavy EVs
}

export function estimateFleet(
  input: FleetInput,
  prices: EnergyPrices = DEFAULT_ENERGY_PRICES,
): FleetEstimate {
  const v = FLEET_VEHICLES[input.type];
  const fuel = input.fuel ?? 'diesel';
  const petrol = usesPetrol(v, fuel);

  const rate = input.charging === 'solar' ? prices.solarPricePerKwh : prices.gridPricePerKwh;
  const co2Rate = input.charging === 'solar' ? CO2_SOLAR_PER_KWH : CO2_GRID_PER_KWH;

  const lPer100 = petrol ? (v.petrolLPer100 as number) : v.dieselLPer100;
  const fuelPricePerL = petrol ? prices.petrol93PricePerL : prices.dieselPricePerL;
  const co2FuelPerL = petrol ? CO2_PETROL_PER_L : CO2_DIESEL_PER_L;

  // Multiply-then-divide keeps the doubles clean (e.g. 9*24/100 === 2.16).
  const iceCostPerKm = (lPer100 * fuelPricePerL) / 100;
  const evCostPerKm = (v.evKwhPer100 * rate) / 100;

  const fleetKmMonth = input.vehicles * input.kmPerMonth;
  const monthlySaving = Math.round(fleetKmMonth * (iceCostPerKm - evCostPerKm));
  const annualSaving = monthlySaving * 12;
  const fiveYearSaving = annualSaving * 5;

  const co2IcePerKm = (lPer100 * co2FuelPerL) / 100;
  const co2EvPerKm = (v.evKwhPer100 * co2Rate) / 100;
  const co2AvoidedTonnesYear =
    Math.round(((fleetKmMonth * 12 * (co2IcePerKm - co2EvPerKm)) / 1000) * 10) / 10;

  return { iceCostPerKm, evCostPerKm, monthlySaving, annualSaving, fiveYearSaving, co2AvoidedTonnesYear };
}

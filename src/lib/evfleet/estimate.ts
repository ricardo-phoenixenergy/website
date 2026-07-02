// Pure EV-fleet vs diesel savings estimator for the EV Fleets page.
// All prices ZAR; energy costs are per km; CO2 in kg unless noted.

export const DIESEL_PRICE_PER_L = 24.0;
export const GRID_RATE_PER_KWH = 2.60;
export const SOLAR_RATE_PER_KWH = 1.50;
export const CO2_DIESEL_PER_L = 2.68;
export const CO2_GRID_PER_KWH = 0.95;
export const CO2_SOLAR_PER_KWH = 0.05;

export type FleetVehicleType = 'van' | 'car' | 'minibus' | 'truck';
export type ChargingSource = 'grid' | 'solar';

export interface VehicleProfile {
  label: string;
  dieselLPer100: number;
  evKwhPer100: number;
}

export const FLEET_VEHICLES: Record<FleetVehicleType, VehicleProfile> = {
  van:     { label: 'Light delivery van', dieselLPer100: 9.0,  evKwhPer100: 22 },
  car:     { label: 'Passenger / car',    dieselLPer100: 7.0,  evKwhPer100: 17 },
  minibus: { label: 'Minibus / shuttle',  dieselLPer100: 11.0, evKwhPer100: 28 },
  truck:   { label: 'Medium truck (~4t)', dieselLPer100: 18.0, evKwhPer100: 60 },
};

export interface FleetInput {
  vehicles: number;
  type: FleetVehicleType;
  kmPerMonth: number; // per vehicle
  charging: ChargingSource;
}

export interface FleetEstimate {
  dieselCostPerKm: number;
  evCostPerKm: number;
  monthlySaving: number;        // ZAR, whole fleet
  annualSaving: number;
  fiveYearSaving: number;
  co2AvoidedTonnesYear: number; // tonnes/yr, whole fleet; can be <= 0 on grid for heavy EVs
}

export function estimateFleet(input: FleetInput): FleetEstimate {
  const v = FLEET_VEHICLES[input.type];
  const rate = input.charging === 'solar' ? SOLAR_RATE_PER_KWH : GRID_RATE_PER_KWH;
  const co2Rate = input.charging === 'solar' ? CO2_SOLAR_PER_KWH : CO2_GRID_PER_KWH;

  // Multiply-then-divide keeps the doubles clean (e.g. 9*24/100 === 2.16).
  const dieselCostPerKm = (v.dieselLPer100 * DIESEL_PRICE_PER_L) / 100;
  const evCostPerKm = (v.evKwhPer100 * rate) / 100;

  const fleetKmMonth = input.vehicles * input.kmPerMonth;
  const monthlySaving = Math.round(fleetKmMonth * (dieselCostPerKm - evCostPerKm));
  const annualSaving = monthlySaving * 12;
  const fiveYearSaving = annualSaving * 5;

  const co2DieselPerKm = (v.dieselLPer100 * CO2_DIESEL_PER_L) / 100;
  const co2EvPerKm = (v.evKwhPer100 * co2Rate) / 100;
  const co2AvoidedTonnesYear =
    Math.round((fleetKmMonth * 12 * (co2DieselPerKm - co2EvPerKm)) / 1000 * 10) / 10;

  return { dieselCostPerKm, evCostPerKm, monthlySaving, annualSaving, fiveYearSaving, co2AvoidedTonnesYear };
}

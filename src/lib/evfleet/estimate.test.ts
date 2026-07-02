import { describe, it, expect } from 'vitest';
import {
  estimateFleet, vehicleCostPerKm, DEFAULT_ENERGY_PRICES, type EnergyPrices,
} from './estimate';

describe('estimateFleet', () => {
  it('10 vans, 2500 km/mo, grid, diesel', () => {
    const e = estimateFleet({ vehicles: 10, type: 'van', kmPerMonth: 2500, charging: 'grid' });
    expect(e.iceCostPerKm).toBeCloseTo(2.16, 2);
    expect(e.evCostPerKm).toBeCloseTo(0.572, 3);
    expect(e.monthlySaving).toBe(39700);
    expect(e.annualSaving).toBe(476400);
    expect(e.fiveYearSaving).toBe(2382000);
    expect(e.co2AvoidedTonnesYear).toBe(9.7);
  });

  it('10 vans, 2500 km/mo, solar — cheaper per km and far more CO2 avoided', () => {
    const e = estimateFleet({ vehicles: 10, type: 'van', kmPerMonth: 2500, charging: 'solar' });
    expect(e.evCostPerKm).toBeCloseTo(0.33, 2);
    expect(e.monthlySaving).toBe(45750);
    expect(e.co2AvoidedTonnesYear).toBe(69.1);
  });

  it('medium trucks still save money on grid', () => {
    const e = estimateFleet({ vehicles: 5, type: 'truck', kmPerMonth: 4000, charging: 'grid' });
    expect(e.iceCostPerKm).toBeCloseTo(4.32, 2);
    expect(e.evCostPerKm).toBeCloseTo(1.56, 2);
    expect(e.monthlySaving).toBe(55200);
  });

  it('heavy EV on the coal grid can avoid negative CO2 (honest behaviour)', () => {
    const e = estimateFleet({ vehicles: 5, type: 'truck', kmPerMonth: 4000, charging: 'grid' });
    expect(e.co2AvoidedTonnesYear).toBeLessThan(0);
  });

  it('petrol car uses petrol consumption + price', () => {
    const e = estimateFleet({ vehicles: 10, type: 'car', kmPerMonth: 2000, charging: 'grid', fuel: 'petrol' });
    // 8 L/100km * R24.50 / 100 = 1.96
    expect(e.iceCostPerKm).toBeCloseTo(1.96, 2);
  });

  it('custom prices override the defaults', () => {
    const prices: EnergyPrices = { dieselPricePerL: 30, petrol93PricePerL: 30, gridPricePerKwh: 2.6, solarPricePerKwh: 1.5 };
    const e = estimateFleet({ vehicles: 10, type: 'van', kmPerMonth: 2500, charging: 'grid' }, prices);
    expect(e.iceCostPerKm).toBeCloseTo(2.7, 2); // 9 * 30 / 100
  });

  it('zero vehicles → zero savings', () => {
    const e = estimateFleet({ vehicles: 0, type: 'van', kmPerMonth: 2500, charging: 'grid' });
    expect(e.monthlySaving).toBe(0);
    expect(e.annualSaving).toBe(0);
  });
});

describe('vehicleCostPerKm', () => {
  it('van diesel at default prices', () => {
    const c = vehicleCostPerKm('van', DEFAULT_ENERGY_PRICES, 'diesel');
    expect(c.fuel).toBeCloseTo(2.16, 2);
    expect(c.grid).toBeCloseTo(0.572, 3);
    expect(c.solar).toBeCloseTo(0.33, 2);
  });

  it('car petrol uses petrol figures', () => {
    const c = vehicleCostPerKm('car', DEFAULT_ENERGY_PRICES, 'petrol');
    expect(c.fuel).toBeCloseTo(1.96, 2); // 8 * 24.5 / 100
  });

  it('heavy truck has no petrol → falls back to diesel', () => {
    const c = vehicleCostPerKm('heavytruck', DEFAULT_ENERGY_PRICES, 'petrol');
    expect(c.fuel).toBeCloseTo(7.92, 2); // 33 * 24 / 100 (diesel)
  });
});

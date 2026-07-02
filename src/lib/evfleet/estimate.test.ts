import { describe, it, expect } from 'vitest';
import { estimateFleet } from './estimate';

describe('estimateFleet', () => {
  it('10 vans, 2500 km/mo, grid', () => {
    const e = estimateFleet({ vehicles: 10, type: 'van', kmPerMonth: 2500, charging: 'grid' });
    expect(e.dieselCostPerKm).toBeCloseTo(2.16, 2);
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

  it('heavy trucks still save money on grid', () => {
    const e = estimateFleet({ vehicles: 5, type: 'truck', kmPerMonth: 4000, charging: 'grid' });
    expect(e.dieselCostPerKm).toBeCloseTo(4.32, 2);
    expect(e.evCostPerKm).toBeCloseTo(1.56, 2);
    expect(e.monthlySaving).toBe(55200);
  });

  it('heavy EV on the coal grid can avoid negative CO2 (honest behaviour)', () => {
    const e = estimateFleet({ vehicles: 5, type: 'truck', kmPerMonth: 4000, charging: 'grid' });
    expect(e.co2AvoidedTonnesYear).toBeLessThan(0);
  });

  it('zero vehicles → zero savings', () => {
    const e = estimateFleet({ vehicles: 0, type: 'van', kmPerMonth: 2500, charging: 'grid' });
    expect(e.monthlySaving).toBe(0);
    expect(e.annualSaving).toBe(0);
  });
});

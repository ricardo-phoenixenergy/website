import { describe, it, expect } from 'vitest';
import { resolveEnergyPrices } from './getEnergyPrices';

describe('resolveEnergyPrices', () => {
  it('null → all fallbacks, not live', () => {
    const r = resolveEnergyPrices(null);
    expect(r.dieselPricePerL).toBe(24.0);
    expect(r.petrol93PricePerL).toBe(24.5);
    expect(r.gridPricePerKwh).toBe(2.6);
    expect(r.solarPricePerKwh).toBe(1.5);
    expect(r.effectiveDate).toBeNull();
    expect(r.sourceLabel).toBe('Estimated');
    expect(r.isLive).toBe(false);
  });

  it('full valid doc → those values, live', () => {
    const r = resolveEnergyPrices({
      dieselPricePerL: 25.1, petrol93PricePerL: 24.9,
      gridPricePerKwh: 2.8, solarPricePerKwh: 1.4,
      effectiveDate: '2026-07-01', sourceLabel: 'DMRE',
    });
    expect(r.dieselPricePerL).toBe(25.1);
    expect(r.solarPricePerKwh).toBe(1.4);
    expect(r.effectiveDate).toBe('2026-07-01');
    expect(r.sourceLabel).toBe('DMRE');
    expect(r.isLive).toBe(true);
  });

  it('one invalid price → that field falls back, not live', () => {
    const r = resolveEnergyPrices({
      dieselPricePerL: 25, petrol93PricePerL: 24,
      gridPricePerKwh: 0, solarPricePerKwh: 1.4,
    });
    expect(r.gridPricePerKwh).toBe(2.6); // fallback
    expect(r.dieselPricePerL).toBe(25);  // preserved
    expect(r.isLive).toBe(false);
  });

  it('negative / NaN price falls back', () => {
    const r = resolveEnergyPrices({
      dieselPricePerL: -3, petrol93PricePerL: Number.NaN,
      gridPricePerKwh: 2.6, solarPricePerKwh: 1.5,
    });
    expect(r.dieselPricePerL).toBe(24.0);
    expect(r.petrol93PricePerL).toBe(24.5);
    expect(r.isLive).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { evaluateWheeling } from './eligibility';

describe('evaluateWheeling — ToU gate', () => {
  it('tou=no short-circuits to not-eligible-tou (supply point ignored)', () => {
    const r = evaluateWheeling({ tou: 'no', supplyPointId: 'eskom' });
    expect(r.status).toBe('not-eligible-tou');
    expect(r.verifyTariff).toBe(false);
  });
});

describe('evaluateWheeling — supply-point routing', () => {
  it('eskom → direct', () => {
    const r = evaluateWheeling({ tou: 'yes', supplyPointId: 'eskom' });
    expect(r.status).toBe('direct');
    expect(r.verifyTariff).toBe(false);
  });

  it('each supported metro → virtual with the correct city label', () => {
    const expected: Record<string, string> = {
      joburg: 'Johannesburg',
      'cape-town': 'Cape Town',
      tshwane: 'Tshwane',
      ekurhuleni: 'Ekurhuleni',
      ethekwini: 'eThekwini',
      nmb: 'Nelson Mandela Bay',
    };
    for (const [id, city] of Object.entries(expected)) {
      const r = evaluateWheeling({ tou: 'yes', supplyPointId: id });
      expect(r.status).toBe('virtual');
      expect(r.supplyPointLabel).toContain(city);
    }
  });

  it('other → not-available', () => {
    expect(evaluateWheeling({ tou: 'yes', supplyPointId: 'other' }).status).toBe('not-available');
  });

  it('missing/unknown supply point → not-available', () => {
    expect(evaluateWheeling({ tou: 'yes' }).status).toBe('not-available');
    expect(evaluateWheeling({ tou: 'yes', supplyPointId: 'nope' }).status).toBe('not-available');
  });
});

describe('evaluateWheeling — unsure tariff', () => {
  it('tou=unsure sets verifyTariff on direct', () => {
    const r = evaluateWheeling({ tou: 'unsure', supplyPointId: 'eskom' });
    expect(r.status).toBe('direct');
    expect(r.verifyTariff).toBe(true);
  });

  it('tou=unsure sets verifyTariff on virtual', () => {
    const r = evaluateWheeling({ tou: 'unsure', supplyPointId: 'joburg' });
    expect(r.status).toBe('virtual');
    expect(r.verifyTariff).toBe(true);
  });

  it('tou=unsure + other → not-available, still carries verifyTariff', () => {
    const r = evaluateWheeling({ tou: 'unsure', supplyPointId: 'other' });
    expect(r.status).toBe('not-available');
    expect(r.verifyTariff).toBe(true);
  });
});

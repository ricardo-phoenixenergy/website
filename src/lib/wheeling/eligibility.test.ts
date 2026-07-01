import { describe, it, expect } from 'vitest';
import { evaluateWheeling } from './eligibility';

describe('evaluateWheeling — supply-point routing', () => {
  it('unsupported (other) → not-available', () => {
    expect(evaluateWheeling({ supplyPointId: 'other' }).status).toBe('not-available');
  });

  it('missing/unknown supply point → not-available', () => {
    expect(evaluateWheeling({ supplyPointId: '' }).status).toBe('not-available');
    expect(evaluateWheeling({ supplyPointId: 'nope' }).status).toBe('not-available');
  });

  it('each supported metro → virtual with the correct city label (no ToU needed)', () => {
    const expected: Record<string, string> = {
      joburg: 'Johannesburg',
      'cape-town': 'Cape Town',
      tshwane: 'Tshwane',
      ekurhuleni: 'Ekurhuleni',
      ethekwini: 'eThekwini',
      nmb: 'Nelson Mandela Bay',
    };
    for (const [id, city] of Object.entries(expected)) {
      const r = evaluateWheeling({ supplyPointId: id });
      expect(r.status).toBe('virtual');
      expect(r.supplyPointLabel).toContain(city);
    }
  });
});

describe('evaluateWheeling — Eskom Time-of-Use gate', () => {
  it('eskom + ToU yes → direct', () => {
    expect(evaluateWheeling({ supplyPointId: 'eskom', tou: 'yes' }).status).toBe('direct');
  });

  it('eskom + ToU no → not-eligible-tou', () => {
    expect(evaluateWheeling({ supplyPointId: 'eskom', tou: 'no' }).status).toBe('not-eligible-tou');
  });

  it('eskom + ToU unsure → not-eligible-tou', () => {
    expect(evaluateWheeling({ supplyPointId: 'eskom', tou: 'unsure' }).status).toBe('not-eligible-tou');
  });

  it('eskom with no ToU answer → not-eligible-tou', () => {
    expect(evaluateWheeling({ supplyPointId: 'eskom' }).status).toBe('not-eligible-tou');
  });
});

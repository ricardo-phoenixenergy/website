import { describe, it, expect } from 'vitest';
import { evaluateWheeling } from './eligibility';

describe('evaluateWheeling — unsupported supplier', () => {
  it('other → not-available (regardless of ToU)', () => {
    expect(evaluateWheeling({ supplyPointId: 'other' }).status).toBe('not-available');
    expect(evaluateWheeling({ supplyPointId: 'other', tou: 'yes' }).status).toBe('not-available');
  });

  it('missing/unknown supplier → not-available', () => {
    expect(evaluateWheeling({ supplyPointId: '' }).status).toBe('not-available');
    expect(evaluateWheeling({ supplyPointId: 'nope' }).status).toBe('not-available');
  });
});

describe('evaluateWheeling — Time-of-Use gate (Eskom + municipalities)', () => {
  it('eskom + ToU yes → eskom (Direct or Micro)', () => {
    expect(evaluateWheeling({ supplyPointId: 'eskom', tou: 'yes' }).status).toBe('eskom');
  });

  it('each metro + ToU yes → virtual with the correct city label', () => {
    const expected: Record<string, string> = {
      joburg: 'Johannesburg',
      'cape-town': 'Cape Town',
      tshwane: 'Tshwane',
      ekurhuleni: 'Ekurhuleni',
      ethekwini: 'eThekwini',
      nmb: 'Nelson Mandela Bay',
    };
    for (const [id, city] of Object.entries(expected)) {
      const r = evaluateWheeling({ supplyPointId: id, tou: 'yes' });
      expect(r.status).toBe('virtual');
      expect(r.supplyPointLabel).toContain(city);
    }
  });

  it('eskom + ToU no / unsure / absent → not-eligible-tou', () => {
    expect(evaluateWheeling({ supplyPointId: 'eskom', tou: 'no' }).status).toBe('not-eligible-tou');
    expect(evaluateWheeling({ supplyPointId: 'eskom', tou: 'unsure' }).status).toBe('not-eligible-tou');
    expect(evaluateWheeling({ supplyPointId: 'eskom' }).status).toBe('not-eligible-tou');
  });

  it('metro + ToU no / unsure → not-eligible-tou', () => {
    expect(evaluateWheeling({ supplyPointId: 'cape-town', tou: 'no' }).status).toBe('not-eligible-tou');
    expect(evaluateWheeling({ supplyPointId: 'cape-town', tou: 'unsure' }).status).toBe('not-eligible-tou');
  });
});

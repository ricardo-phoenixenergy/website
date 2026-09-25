import { describe, it, expect } from 'vitest';
import { evaluateWheeling } from './eligibility';
import { wheelingEnquiry, wheelingSituation } from './enquiry';
import { WHEELING_SUPPLY_POINTS } from '@/config/wheelingSupplyPoints';

describe('evaluateWheeling: supplier not listed or not known', () => {
  it('other → needs-check, never a definitive no (Time-of-Use is not asked)', () => {
    expect(evaluateWheeling({ supplyPointId: 'other' }).status).toBe('needs-check');
    expect(evaluateWheeling({ supplyPointId: 'other', tou: 'yes' }).status).toBe('needs-check');
  });

  it('missing/unknown supplier → needs-check', () => {
    expect(evaluateWheeling({ supplyPointId: '' }).status).toBe('needs-check');
    expect(evaluateWheeling({ supplyPointId: 'nope' }).status).toBe('needs-check');
  });

  it('no listed supplier is marked as unable to wheel until the business confirms one', () => {
    expect(WHEELING_SUPPLY_POINTS.filter((s) => s.model === 'none')).toEqual([]);
  });
});

describe('evaluateWheeling: Time-of-Use gate (Eskom + municipalities)', () => {
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

  it('eskom or metro + ToU no → not-eligible-tou', () => {
    expect(evaluateWheeling({ supplyPointId: 'eskom', tou: 'no' }).status).toBe('not-eligible-tou');
    expect(evaluateWheeling({ supplyPointId: 'cape-town', tou: 'no' }).status).toBe('not-eligible-tou');
  });

  it('eskom or metro + ToU unsure (or no answer) → needs-check, not a no', () => {
    expect(evaluateWheeling({ supplyPointId: 'eskom', tou: 'unsure' }).status).toBe('needs-check');
    expect(evaluateWheeling({ supplyPointId: 'cape-town', tou: 'unsure' }).status).toBe('needs-check');
    expect(evaluateWheeling({ supplyPointId: 'eskom' }).status).toBe('needs-check');
  });
});

describe('the prefilled enquiry says only what the visitor said', () => {
  const enquiry = (supplyPointId: string, tou: 'yes' | 'no' | 'unsure' | null) =>
    wheelingEnquiry(evaluateWheeling({ supplyPointId, tou: tou ?? undefined }), supplyPointId, tou);

  it('eligible paths are unchanged', () => {
    expect(enquiry('eskom', 'yes')).toBe(
      "I checked wheeling eligibility on your site. We're billed by Eskom (direct) and are on a Time-of-Use tariff. It said we're eligible for Direct Wheeling or Micro-Wheeling. I'd like to book a free wheeling assessment.",
    );
    expect(enquiry('joburg', 'yes')).toBe(
      "I checked wheeling eligibility on your site. We're billed by City of Johannesburg and are on a Time-of-Use tariff. It said we're eligible for Virtual Wheeling. I'd like to book a free wheeling assessment.",
    );
  });

  it('"No" on Time-of-Use keeps its message', () => {
    expect(enquiry('eskom', 'no')).toBe(
      "I checked wheeling eligibility on your site. We're billed by Eskom (direct) and are not on a Time-of-Use tariff. It said wheeling isn't an option for us yet. I'd like to talk about what we can do instead.",
    );
  });

  it('"I\'m not sure" asks for a check from a bill, and never says wheeling is not an option', () => {
    const msg = enquiry('eskom', 'unsure');
    expect(msg).toBe(
      "I checked wheeling eligibility on your site. We're billed by Eskom (direct) and are not sure whether we are on a Time-of-Use tariff. It said one of our electricity bills will show whether we can wheel. I'd like to book a free wheeling assessment.",
    );
    expect(msg).not.toMatch(/isn't an option/);
  });

  it('an unlisted supplier gets a sentence of its own, not "billed by My supplier isn\'t listed"', () => {
    expect(wheelingSituation('other', null)).toBe("Our supplier isn't on your list, or we're not sure who it is.");
    const msg = enquiry('other', null);
    expect(msg).toBe(
      "I checked wheeling eligibility on your site. Our supplier isn't on your list, or we're not sure who it is. It said one of our electricity bills will show whether we can wheel. I'd like to book a free wheeling assessment.",
    );
    expect(msg).not.toMatch(/billed by/);
    expect(msg).not.toMatch(/isn't an option/);
  });
});

import { describe, expect, it } from 'vitest';
import { allClaims, claimValue } from '@/config/claims';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { REPLY_PROMISE } from '@/config/contact';
import { AUDIT_REPORT_TIME, WEBUYSOLAR_OFFER } from '@/config/webuysolarOffer';
import { CREDIT_PRICE_HIGH, CREDIT_PRICE_LOW } from '@/lib/carbon/estimate';
import { SOLUTION_VERTICALS } from '@/types/solutions';

const DASH = /[\u2013\u2014]/;

describe('claims register', () => {
  it('fills every field of every claim', () => {
    for (const c of allClaims()) {
      for (const field of ['value', 'label', 'definition', 'basis', 'source'] as const) {
        expect(c[field].trim(), `${c.id}.${field}`).not.toBe('');
      }
      expect(['confirmed', 'unconfirmed']).toContain(c.status);
      expect(c.usedOn.length, `${c.id}.usedOn`).toBeGreaterThan(0);
      expect(c.asOf === null || /^\d{4}-\d{2}-\d{2}$/.test(c.asOf), `${c.id}.asOf`).toBe(true);
    }
  });

  it('marks nothing confirmed without a source and a date', () => {
    for (const c of allClaims().filter((x) => x.status === 'confirmed')) {
      expect(c.source, c.id).not.toBe('Not recorded.');
      expect(c.asOf, c.id).not.toBeNull();
    }
  });

  it('uses no en or em dashes in values or labels', () => {
    for (const c of allClaims()) {
      expect(DASH.test(c.value) || DASH.test(c.label), c.id).toBe(false);
    }
  });

  it('draws every vertical stat from the register', () => {
    const values = new Set(allClaims().map((c) => `${c.value}|${c.label}`));
    for (const v of SOLUTION_VERTICALS) {
      for (const stat of VERTICAL_CONFIG[v].stats) {
        // The EV stat adds its "+" qualifier to the register's figure.
        const figure = stat.value.replace(/\+$/, '');
        const known = values.has(`${stat.value}|${stat.label}`) || values.has(`${figure}|${stat.label}`);
        expect(known, `${v}: ${stat.value} ${stat.label}`).toBe(true);
      }
    }
  });

  it('keeps the WeBuySolar stats in line with the offer', () => {
    const labels = VERTICAL_CONFIG.webuysolar.stats.map((s) => `${s.value} ${s.label}`).join(' | ');
    expect(labels).not.toMatch(/buyback|any brand/i);
    expect(WEBUYSOLAR_OFFER.eligibility).toContain(claimValue('webuysolar-eligibility'));
  });

  it('reads the promises and the estimator band from the modules that use them', () => {
    expect(claimValue('reply-time')).toBe(REPLY_PROMISE.window);
    expect(claimValue('webuysolar-audit-report-time')).toBe(AUDIT_REPORT_TIME);
    expect(WEBUYSOLAR_OFFER.steps[0].description).toContain(AUDIT_REPORT_TIME);
    expect(WEBUYSOLAR_OFFER.firstContact).toContain(REPLY_PROMISE.window);
    expect(claimValue('carbon-credit-price-band')).toBe(`R${CREDIT_PRICE_LOW} to R${CREDIT_PRICE_HIGH}`);
  });
});

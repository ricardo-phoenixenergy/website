import { describe, expect, it, vi } from 'vitest';
import {
  MIN_SCORE, REFUSAL, SUBJECT_FLAG, checkRecaptcha, missingRecaptchaKeys,
  type SiteVerifyAnswer, type SpamCheck,
} from './recaptchaCheck';
import { contactSchema, webBuySolarSchema } from './validators/contact';

const BOTH = { secretKey: 'test-secret', siteKey: 'test-site-key' };
const answer = (a: SiteVerifyAnswer) => vi.fn(async () => a);
const unreachable = () => vi.fn(async (): Promise<SiteVerifyAnswer> => { throw new Error('ECONNRESET'); });

/** Accepted enquiries are sent; refused ones get a 400 with a code the form turns into email and phone. */
const accepted = (check: SpamCheck) => REFUSAL[check] === undefined;

describe('reCAPTCHA fully configured: a real browser sends a token', () => {
  it('refuses an enquiry with no token, without asking Google', async () => {
    for (const token of [undefined, '', 'no-key', 123, null]) {
      const verify = answer({ success: true, score: 0.9 });
      const check = await checkRecaptcha(BOTH, token, verify);
      expect(check, String(token)).toBe('missing');
      expect(accepted(check)).toBe(false);
      expect(REFUSAL[check]).toBe('recaptcha-missing');
      expect(verify).not.toHaveBeenCalled();
    }
  });

  it('accepts a person, and accepts but marks a low score', async () => {
    expect(await checkRecaptcha(BOTH, 'tok', answer({ success: true, score: 0.9 }))).toBe('verified');
    expect(await checkRecaptcha(BOTH, 'tok', answer({ success: true, score: MIN_SCORE }))).toBe('verified');
    const low = await checkRecaptcha(BOTH, 'tok', answer({ success: true, score: 0.3 }));
    expect(low).toBe('low-score');
    expect(accepted(low)).toBe(true);
    expect(SUBJECT_FLAG[low]).toBe('[Check: low reCAPTCHA score] ');
  });

  it('refuses a token Google rejects', async () => {
    const check = await checkRecaptcha(BOTH, 'tok', answer({ success: false, 'error-codes': ['invalid-input-response'] }));
    expect(check).toBe('failed');
    expect(REFUSAL[check]).toBe('recaptcha-failed');
  });

  it('passes the secret and the token to Google', async () => {
    const verify = answer({ success: true, score: 0.9 });
    await checkRecaptcha(BOTH, 'tok', verify);
    expect(verify).toHaveBeenCalledWith('test-secret', 'tok');
  });

  it('accepts and marks the enquiry when Google cannot be reached', async () => {
    const check = await checkRecaptcha(BOTH, 'tok', unreachable());
    expect(check).toBe('unverified');
    expect(accepted(check)).toBe(true);
    expect(SUBJECT_FLAG[check]).toMatch(/^\[Check: /);
  });
});

describe('reCAPTCHA not fully configured: never lose a lead', () => {
  const cases: [string, { secretKey?: string; siteKey?: string }, unknown][] = [
    ['no secret on the server, token sent', { siteKey: 'test-site-key' }, 'tok'],
    ['no site key, so the browser sent an empty token', { secretKey: 'test-secret' }, ''],
    ['no site key and no token field at all', { secretKey: 'test-secret' }, undefined],
    ['neither key', {}, ''],
    ['keys that are only whitespace', { secretKey: '  ', siteKey: ' ' }, ''],
  ];
  for (const [name, setup, token] of cases) {
    it(`accepts and marks: ${name}`, async () => {
      const verify = answer({ success: false });
      const check = await checkRecaptcha(setup, token, verify);
      expect(check).toBe('unconfigured');
      expect(accepted(check)).toBe(true);
      expect(SUBJECT_FLAG[check]).toBe('[Check: reCAPTCHA not configured] ');
      expect(verify).not.toHaveBeenCalled();
    });
  }

  it('treats a secret Google rejects as a configuration mistake, not a bot', async () => {
    for (const code of ['invalid-input-secret', 'missing-input-secret']) {
      const check = await checkRecaptcha(BOTH, 'tok', answer({ success: false, 'error-codes': [code] }));
      expect(check, code).toBe('unconfigured');
      expect(accepted(check)).toBe(true);
    }
  });

  it('names the missing keys for the server log, never their values', () => {
    expect(missingRecaptchaKeys({})).toEqual(['RECAPTCHA_SECRET_KEY', 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY']);
    expect(missingRecaptchaKeys({ siteKey: 'test-site-key' })).toEqual(['RECAPTCHA_SECRET_KEY']);
    expect(missingRecaptchaKeys({ secretKey: 'test-secret' })).toEqual(['NEXT_PUBLIC_RECAPTCHA_SITE_KEY']);
    expect(missingRecaptchaKeys(BOTH)).toEqual([]);
  });
});

describe('subject marks', () => {
  it('only a verified enquiry goes unmarked among the accepted ones', () => {
    expect(SUBJECT_FLAG.verified).toBe('');
    for (const check of ['low-score', 'unverified', 'unconfigured'] as const) {
      expect(SUBJECT_FLAG[check], check).toMatch(/^\[Check: .+\] $/);
    }
  });
});

describe('the schemas leave the token decision to the route', () => {
  const contact = {
    intent: 'client', firstName: 'Audit', lastName: 'Check', email: 'audit@example.com',
    phone: '+27 21 000 0000', company: 'Audit Co', location: 'Cape Town',
  };
  it('the contact form is valid with an empty or absent token (JRN-38)', () => {
    expect(contactSchema.safeParse({ ...contact, recaptchaToken: '' }).success).toBe(true);
    expect(contactSchema.safeParse(contact).success).toBe(true);
    expect(contactSchema.safeParse({ ...contact, recaptchaToken: 'tok' }).success).toBe(true);
  });

  it('the valuation request is valid with an empty token too', () => {
    const valuation = {
      intent: 'webuysolar', firstName: 'Audit', email: 'audit@example.com',
      valuation: { kw: 82.8, bessKwh: 0, installYear: 2020, province: 'Western Cape' },
    };
    expect(webBuySolarSchema.safeParse({ ...valuation, recaptchaToken: '' }).success).toBe(true);
  });
});

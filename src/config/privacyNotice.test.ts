import { describe, expect, it } from 'vitest';
import { FORM_PRIVACY_NOTICE } from '@/config/privacyNotice';

describe('form privacy notice', () => {
  it('links exactly one phrase to the privacy policy', () => {
    expect(FORM_PRIVACY_NOTICE.policy.match(/\[[^\]]+\]/g)).toHaveLength(1);
    expect(FORM_PRIVACY_NOTICE.policyHref).toBe('/privacy-policy');
  });

  it('states the purpose on both forms without asking for agreement', () => {
    for (const text of Object.values(FORM_PRIVACY_NOTICE.purpose)) {
      expect(text).toMatch(/only to reply to your/);
      expect(text).not.toMatch(/agree/i);
      expect(text).not.toMatch(/shared or sold/i);
    }
  });
});

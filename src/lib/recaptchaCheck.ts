// src/lib/recaptchaCheck.ts
// How /api/contact treats reCAPTCHA for both forms (the contact form and the
// valuation request). Server-only: src/lib/recaptcha.ts is the browser half.
// The keys and Google's answer come in as arguments, so the decision is tested
// without either (recaptchaCheck.test.ts).
import type { RecaptchaErrorCode } from '@/lib/recaptcha';

/** What the check concluded about one enquiry. */
export type SpamCheck =
  /** Google scored it as a person. */
  | 'verified'
  /** Google scored it as a likely bot: accepted, and marked for a look. */
  | 'low-score'
  /** Google couldn't be reached: accepted, and marked. */
  | 'unverified'
  /** A key is missing, or Google rejected the secret, so nothing could be checked: accepted, marked and logged. */
  | 'unconfigured'
  /** Both keys are set, so a real browser sends a token, and none came: refused. */
  | 'missing'
  /** Google rejected the token: refused. */
  | 'failed';

export interface RecaptchaSetup {
  /** RECAPTCHA_SECRET_KEY, read on the server. */
  secretKey?: string;
  /** NEXT_PUBLIC_RECAPTCHA_SITE_KEY, inlined into the browser bundle at build time. */
  siteKey?: string;
}

/** The part of Google's siteverify answer the check reads. */
export interface SiteVerifyAnswer {
  success: boolean;
  score?: number;
  'error-codes'?: string[];
}

/** The v3 score from which an enquiry counts as a person's. */
export const MIN_SCORE = 0.5;

/** Google's codes for a bad secret: our configuration is wrong, not the visitor's token. */
const SECRET_ERRORS = ['missing-input-secret', 'invalid-input-secret'];

/** The environment variables still to set, by name (never their values), for the server log. */
export function missingRecaptchaKeys(setup: RecaptchaSetup): string[] {
  const missing: string[] = [];
  if (!setup.secretKey?.trim()) missing.push('RECAPTCHA_SECRET_KEY');
  if (!setup.siteKey?.trim()) missing.push('NEXT_PUBLIC_RECAPTCHA_SITE_KEY');
  return missing;
}

/**
 * reCAPTCHA decides how much to trust an enquiry, never whether a person may
 * reach us. With both keys set, a real browser always sends a token, so a
 * missing or rejected one is refused and the form offers email and phone
 * instead. With either key missing, or a secret Google won't accept, the check
 * can't run, so the enquiry goes through, marked: a configuration mistake must
 * never cost a lead.
 */
export async function checkRecaptcha(
  setup: RecaptchaSetup,
  token: unknown,
  verify: (secret: string, token: string) => Promise<SiteVerifyAnswer>,
): Promise<SpamCheck> {
  if (missingRecaptchaKeys(setup).length > 0) return 'unconfigured';
  // 'no-key' is a placeholder an older build of the forms sent; it is not a token.
  if (typeof token !== 'string' || token === '' || token === 'no-key') return 'missing';
  try {
    const answer = await verify(setup.secretKey as string, token);
    if (answer.success) return (answer.score ?? 0) >= MIN_SCORE ? 'verified' : 'low-score';
    const codes = answer['error-codes'] ?? [];
    return codes.some((c) => SECRET_ERRORS.includes(c)) ? 'unconfigured' : 'failed';
  } catch {
    return 'unverified';
  }
}

/** Refusals, with the code the forms turn into a notice that offers email and phone. */
export const REFUSAL: Partial<Record<SpamCheck, RecaptchaErrorCode>> = {
  missing: 'recaptcha-missing',
  failed: 'recaptcha-failed',
};

/** The mark at the start of the email subject, so the team can check an accepted enquiry by eye. */
export const SUBJECT_FLAG: Record<SpamCheck, string> = {
  verified: '',
  'low-score': '[Check: low reCAPTCHA score] ',
  unverified: '[Check: reCAPTCHA not verified] ',
  unconfigured: '[Check: reCAPTCHA not configured] ',
  missing: '',
  failed: '',
};

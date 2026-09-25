// src/lib/recaptcha.ts
// reCAPTCHA v3, loaded only on the two forms (see RecaptchaScript).

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

export const RECAPTCHA_ENABLED = SITE_KEY !== '';
export const RECAPTCHA_SRC = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;

/** API error codes the forms turn into a message with a way out (email, phone). */
export type RecaptchaErrorCode = 'recaptcha-missing' | 'recaptcha-failed';

/**
 * A token for `action`, waiting briefly for the script if the visitor submits
 * before it has loaded. Returns '' when there is no key or the script never
 * arrives (blocked by an extension, offline); the server then decides.
 */
export async function getRecaptchaToken(action: string, timeoutMs = 4000): Promise<string> {
  if (!SITE_KEY || typeof window === 'undefined') return '';
  const started = Date.now();
  while (!window.grecaptcha?.execute) {
    if (Date.now() - started > timeoutMs) return '';
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  try {
    await new Promise<void>((resolve) => window.grecaptcha.ready(resolve));
    return await window.grecaptcha.execute(SITE_KEY, { action });
  } catch {
    return '';
  }
}

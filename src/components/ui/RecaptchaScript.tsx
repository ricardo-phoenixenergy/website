import Script from 'next/script';
import { RECAPTCHA_ENABLED, RECAPTCHA_SRC } from '@/lib/recaptcha';

/**
 * Loads reCAPTCHA v3 on the page that renders it. Only the contact form and the
 * valuation tool do, so the other pages don't carry its ~350 KB.
 */
export function RecaptchaScript() {
  if (!RECAPTCHA_ENABLED) return null;
  return <Script id="recaptcha-v3" src={RECAPTCHA_SRC} strategy="afterInteractive" />;
}

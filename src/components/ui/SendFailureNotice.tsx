import { CONTACT } from '@/config/contact';
import type { RecaptchaErrorCode } from '@/lib/recaptcha';

export type SendFailure = RecaptchaErrorCode | 'send-failed';

const LEAD: Record<SendFailure, string> = {
  'recaptcha-missing':
    "We couldn't run our spam check, which some browser extensions block. Nothing was sent.",
  'recaptcha-failed': "Our spam check didn't go through, so nothing was sent. Please try again.",
  'send-failed': "Your message didn't send. Your details are still here, so you can try again.",
};

/**
 * Why a form didn't send, and a way to reach the team anyway. Rendered in a
 * role="alert" region so screen readers announce it.
 */
export function SendFailureNotice({ reason, className = '' }: { reason: SendFailure; className?: string }) {
  return (
    <div
      role="alert"
      className={`rounded-xl px-4 py-3 font-body text-sm leading-relaxed ${className}`}
      style={{
        background: 'rgba(227,197,141,0.12)',
        border: '1px solid rgba(227,197,141,0.3)',
        color: 'var(--color-accent-solar-on)',
      }}
    >
      {LEAD[reason]} You can also email{' '}
      <a href={`mailto:${CONTACT.email}`} className="font-semibold underline underline-offset-2">
        {CONTACT.email}
      </a>{' '}
      or call{' '}
      <a href={CONTACT.phoneHref} className="font-semibold underline underline-offset-2 whitespace-nowrap">
        {CONTACT.phone}
      </a>
      .
    </div>
  );
}

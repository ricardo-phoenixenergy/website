interface RecaptchaNoticeProps {
  /** Extra classes for the wrapping <p> (colour / size / alignment). */
  className?: string;
}

/**
 * Google-required attribution shown in place of the hidden reCAPTCHA badge.
 * The badge is hidden site-wide (see globals.css), which reCAPTCHA's terms
 * permit only when this exact disclosure is displayed near the form.
 */
export function RecaptchaNotice({ className = '' }: RecaptchaNoticeProps) {
  return (
    <p className={className}>
      This site is protected by reCAPTCHA and the Google{' '}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[#39575C]"
      >
        Privacy Policy
      </a>{' '}
      and{' '}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[#39575C]"
      >
        Terms of Service
      </a>{' '}
      apply.
    </p>
  );
}

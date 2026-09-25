import Link from 'next/link';
import { RecaptchaNotice } from '@/components/ui/RecaptchaNotice';
import { FORM_PRIVACY_NOTICE, type PrivacyNoticeForm } from '@/config/privacyNotice';

interface FormPrivacyNoticeProps {
  form: PrivacyNoticeForm;
  /** Centred under the contact form's full-width button; start-aligned on the valuation tool. */
  align?: 'center' | 'start';
  /** Spacing from the form above. */
  className?: string;
}

/** "Our [Privacy Policy] explains…" split into the text before, the link text and the text after. */
function splitPolicySentence(sentence: string): { before: string; link: string; after: string } {
  const m = sentence.match(/^(.*)\[(.+)\](.*)$/);
  // Without brackets the sentence stays as written and the link follows it.
  return m ? { before: m[1], link: m[2], after: m[3] } : { before: `${sentence} `, link: 'Privacy Policy', after: '' };
}

/**
 * The privacy notice at the point of collection, shared by the contact form and
 * the valuation request. The approved wording lives in src/config/privacyNotice.ts.
 * Google's reCAPTCHA disclosure sits underneath, because
 * the badge is hidden site-wide.
 */
export function FormPrivacyNotice({ form, align = 'start', className = '' }: FormPrivacyNoticeProps) {
  const { before, link, after } = splitPolicySentence(FORM_PRIVACY_NOTICE.policy);
  const text = `font-body text-xs text-pe-muted leading-relaxed${align === 'center' ? ' text-center' : ''}`;
  return (
    <div className={className}>
      <p className={text}>
        {FORM_PRIVACY_NOTICE.purpose[form]} {before}
        <Link href={FORM_PRIVACY_NOTICE.policyHref} className="underline hover:text-pe-primary">
          {link}
        </Link>
        {after}
      </p>
      <RecaptchaNotice className={`${text} mt-2`} />
    </div>
  );
}

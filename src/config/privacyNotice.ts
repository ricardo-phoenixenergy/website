// src/config/privacyNotice.ts
//
// Approved by the business owner on 25 September 2026 (the short notice in
// docs/legal/privacy-review-draft.md, section 1). That document still lists
// the privacy policy gaps that are open for counsel. Both forms (the contact form and the solar valuation
// request) render this notice, so legal edits the words here and nowhere else.
//
// It is a notice, not an agreement: it says who uses the details and why, and
// where the full policy is. The old "By submitting this form you agree to our
// Privacy Policy" bundled the two and has been removed. Google's reCAPTCHA
// disclosure is rendered with it (RecaptchaNotice), because the badge is hidden.

export type PrivacyNoticeForm = 'contact' | 'valuation';

export const FORM_PRIVACY_NOTICE = {
  /** Who uses the details and for what, per form. */
  purpose: {
    contact: 'Phoenix Energy Solutions (Pty) Ltd uses these details only to reply to your enquiry.',
    valuation: 'Phoenix Energy Solutions (Pty) Ltd uses these details only to reply to your valuation request.',
  },
  /** The sentence that links to the policy. The words in [brackets] become the link. */
  policy: 'Our [Privacy Policy] explains how we handle personal information and your rights.',
  policyHref: '/privacy-policy',
} as const satisfies {
  purpose: Record<PrivacyNoticeForm, string>;
  policy: string;
  policyHref: string;
};

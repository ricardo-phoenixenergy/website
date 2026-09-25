// src/config/contact.ts
// Phoenix Energy's direct contact details, for fallbacks and links, and the one
// response time the site promises.

export const CONTACT = {
  email: 'info@phoenixenergy.solutions',
  phone: '+27 79 892 8197',
  /** E.164 form for tel: links. */
  phoneHref: 'tel:+27798928197',
  /** Office hours for the phone line. */
  phoneHours: 'Mon to Fri, 08:00 to 17:00 SAST',
} as const;

/**
 * How fast we reply to an enquiry or a valuation request. Every page that
 * promises a reply uses these words, so the site never makes two promises.
 * Changing the window here changes it everywhere (claims register id: reply-time).
 * No-break spaces hold "1 business day" together, so a narrow line never ends on the "1".
 */
export const REPLY_PROMISE = {
  /** The window itself, for sentences that need their own verb. */
  window: 'within 1 business day',
  /** The standing promise, before anything is sent. */
  sentence: 'We reply within 1 business day.',
  /** After an enquiry is sent. */
  afterSend: 'We’ll reply within 1 business day.',
} as const;

/**
 * "What happens next" beside the contact form (specs/09-CONTACT.md). Only steps
 * the site already supports: the page's promise to connect you with the right
 * person, the reply window, and the free, no-obligation first step each
 * solution's process starts with. The spec's fourth step ("free site assessment
 * within 5 days") is left out: nothing else on the site promises it.
 */
export const CONTACT_NEXT_STEPS: ReadonlyArray<{ key: string; text: string }> = [
  { key: 'route', text: 'We pass your enquiry to the right specialist.' },
  { key: 'reply', text: REPLY_PROMISE.sentence },
  { key: 'first-step', text: 'For clients, the first meeting or assessment is free, with no obligation.' },
];

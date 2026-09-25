'use client';

import { useState, useEffect, useId, useRef } from 'react';
import { contactSchema } from '@/lib/validators/contact';
import { dlPush } from '@/lib/analytics';
import { contactMessageForStrategy } from '@/config/strategies';
import {
  IconZap,
  IconUsers,
  IconTrendingUp,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
} from '@/components/ui/Icons';
import { FormPrivacyNotice } from '@/components/ui/FormPrivacyNotice';
import { RecaptchaScript } from '@/components/ui/RecaptchaScript';
import { SendFailureNotice, type SendFailure } from '@/components/ui/SendFailureNotice';
import { getRecaptchaToken, type RecaptchaErrorCode } from '@/lib/recaptcha';
import { REPLY_PROMISE } from '@/config/contact';

type Intent = 'client' | 'partner' | 'investor';
type Status = 'idle' | 'submitting' | 'success' | 'error';

interface IntentOption {
  value: Intent;
  icon: React.ReactNode;
  label: string;
  description: string;
  accent: string;
  accentRgb: string;
  step2Title: string;
  hint: string;
  submitLabel: string;
}

const INTENTS: IntentOption[] = [
  {
    value: 'client',
    icon: <IconZap size={18} />,
    label: "I'm a potential client",
    description: "I want clean energy solutions for my business: solar, storage, wheeling, EV fleets or more.",
    accent: '#45727E', // --color-pe-secondary-ink
    accentRgb: '112,157,169',
    step2Title: 'Tell us about your business',
    hint: "For potential clients: Tell us about your business so we can recommend the most relevant solutions and connect you with the right specialist.",
    submitLabel: 'Send enquiry',
  },
  {
    value: 'partner',
    icon: <IconUsers size={18} />,
    label: 'I want to partner up',
    description: "I represent a company that wants to collaborate, integrate, or distribute with Phoenix Energy.",
    accent: '#45727E', // --color-pe-secondary-ink
    accentRgb: '112,157,169',
    step2Title: 'Tell us about your company',
    hint: "For partners: Tell us about your company and the type of collaboration you have in mind. Our partnerships team will be in touch.",
    submitLabel: 'Send partnership enquiry',
  },
  {
    value: 'investor',
    icon: <IconTrendingUp size={18} />,
    label: "I'm an investor",
    description: "I'm interested in Phoenix Energy's growth story and want to explore investment opportunities.",
    accent: '#45727E', // --color-pe-secondary-ink
    accentRgb: '112,157,169',
    step2Title: 'Tell us about yourself',
    hint: "For investors: Share your details and we'll connect you with our leadership team to discuss Phoenix Energy's growth trajectory.",
    submitLabel: 'Send investor enquiry',
  },
];

type FieldKey = 'firstName' | 'lastName' | 'email' | 'phone' | 'company' | 'location' | 'message';

interface FieldConfig {
  key: Exclude<FieldKey, 'message'>;
  label: string;
  type: 'text' | 'email' | 'tel';
  placeholder: string;
  autoComplete: string;
}

// Display order: validation focuses the first field in this order that has an error.
const FIELDS: FieldConfig[] = [
  { key: 'firstName', label: 'First name',    type: 'text',  placeholder: 'e.g. Sarah',            autoComplete: 'given-name' },
  { key: 'lastName',  label: 'Last name',     type: 'text',  placeholder: 'e.g. Johnson',          autoComplete: 'family-name' },
  { key: 'email',     label: 'Email address', type: 'email', placeholder: 'sarah@company.co.za',   autoComplete: 'email' },
  { key: 'phone',     label: 'Phone number',  type: 'tel',   placeholder: '+27 __ ___ ____',       autoComplete: 'tel' },
  { key: 'company',   label: 'Company name',  type: 'text',  placeholder: 'e.g. Acme Holdings',    autoComplete: 'organization' },
  { key: 'location',  label: 'Location',      type: 'text',  placeholder: 'e.g. Johannesburg, GP', autoComplete: 'address-level2' },
];

// Prefill from deep links: /contact?intent=client&strategy=<key>[&source=finder] or &message=…
function getQueryParams(): { intent: Intent | null; message: string } {
  if (typeof window === 'undefined') return { intent: null, message: '' };
  const params = new URLSearchParams(window.location.search);
  const qsIntent = params.get('intent');
  const qsStrategy = params.get('strategy');
  const qsMessage = params.get('message');
  const fromFinder = params.get('source') === 'finder';
  const validIntent = INTENTS.find((i) => i.value === qsIntent);
  const message = qsMessage
    ? qsMessage
    : qsStrategy
      ? (contactMessageForStrategy(qsStrategy, fromFinder) ?? '')
      : '';
  return { intent: validIntent ? validIntent.value : null, message };
}

export function ContactForm() {
  const uid = useId();
  const [step, setStep] = useState<1 | 2>(1);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [intentError, setIntentError] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [failure, setFailure] = useState<SendFailure | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const [fields, setFields] = useState<Record<FieldKey, string>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    message: '',
  });

  const step1HeadingRef = useRef<HTMLHeadingElement>(null);
  const step2HeadingRef = useRef<HTMLHeadingElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  // Set when the visitor moves between steps, so the new step's heading takes
  // focus. The deep-link prefill also changes the step but must not move focus.
  const focusStepRef = useRef(false);
  const focusFieldRef = useRef<FieldKey | null>(null);
  // What a deep link wrote in, so a change of intent can take its message back
  // out: an investor who arrived on a client link shouldn't send the client's words.
  const linkPrefillRef = useRef<{ intent: Intent | null; message: string } | null>(null);

  const fieldId = (k: FieldKey) => `${uid}-${k}`;
  const errorId = (k: FieldKey) => `${uid}-${k}-error`;

  // Prefill once on mount (post-hydration, so no SSR mismatch) from the deep-link params.
  useEffect(() => {
    const { intent: qsIntent, message } = getQueryParams();
    if (message) linkPrefillRef.current = { intent: qsIntent, message };
    /* eslint-disable react-hooks/set-state-in-effect */
    if (qsIntent) {
      setIntent(qsIntent);
      setStep(2);
    }
    if (message) setFields((prev) => ({ ...prev, message }));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!focusStepRef.current) return;
    focusStepRef.current = false;
    (step === 1 ? step1HeadingRef : step2HeadingRef).current?.focus();
  }, [step]);

  useEffect(() => {
    const key = focusFieldRef.current;
    if (!key) return;
    focusFieldRef.current = null;
    document.getElementById(`${uid}-${key}`)?.focus();
  }, [fieldErrors, uid]);

  useEffect(() => {
    if (status === 'success') successHeadingRef.current?.focus();
  }, [status]);

  const config = INTENTS.find((i) => i.value === intent) ?? INTENTS[0];

  const set = (k: FieldKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [k]: e.target.value }));
    if (fieldErrors[k]) setFieldErrors((prev) => { const n = { ...prev }; delete n[k]; return n; });
  };

  const goToStep = (next: 1 | 2) => {
    focusStepRef.current = true;
    setStep(next);
  };

  // A link's message belongs to the intent it came with. Choosing another intent
  // clears it, unless the visitor has edited it; coming back restores it.
  const chooseIntent = (next: Intent) => {
    const link = linkPrefillRef.current;
    if (link?.intent && next !== intent) {
      if (next !== link.intent && fields.message === link.message) {
        setFields((prev) => ({ ...prev, message: '' }));
      } else if (next === link.intent && fields.message === '') {
        setFields((prev) => ({ ...prev, message: link.message }));
      }
    }
    setIntent(next);
    setIntentError(false);
  };

  const handleContinue = () => {
    if (!intent) {
      setIntentError(true);
      return;
    }
    goToStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intent) return;

    setFieldErrors({});
    setFailure(null);

    const result = contactSchema.safeParse({ intent, ...fields, recaptchaToken: 'validating' });
    if (!result.success) {
      const errs: Partial<Record<FieldKey, string>> = {};
      result.error.issues.forEach((iss) => {
        const key = iss.path[0] as FieldKey;
        if (!errs[key]) errs[key] = iss.message;
      });
      focusFieldRef.current = FIELDS.find((f) => errs[f.key])?.key ?? null;
      setFieldErrors(errs);
      return;
    }

    setStatus('submitting');

    try {
      const recaptchaToken = await getRecaptchaToken('contact_submit');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent, ...fields, recaptchaToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        const code = data.error as RecaptchaErrorCode | undefined;
        setFailure(code === 'recaptcha-missing' || code === 'recaptcha-failed' ? code : 'send-failed');
        setStatus('error');
        return;
      }

      dlPush({ event: 'form_submit', form_name: 'contact', service_interest: intent ?? '' });
      setStatus('success');
    } catch {
      setFailure('send-failed');
      setStatus('error');
    }
  };

  // A field's border is the control's own edge, so it takes the 3:1 control token.
  const inputCls = (key: FieldKey) =>
    `w-full font-body text-base px-3.5 py-2.5 rounded-xl outline-none transition-all duration-150 ${
      fieldErrors[key]
        ? 'border-2 border-pe-error'
        : 'border border-pe-control-border focus:border-pe-primary'
    }`;

  // ─── Success state ───────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="bg-white rounded-2xl border border-pe-border shadow-sm px-6 py-16 sm:px-10 sm:py-20 text-center">
        <div
          aria-hidden="true"
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(57,87,92,0.08)', color: 'var(--color-pe-primary)' }}
        >
          <IconCheck size={28} />
        </div>
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="font-display font-extrabold text-2xl text-pe-text mb-2 focus:outline-none"
        >
          Message sent!
        </h2>
        <p className="font-body text-base text-pe-muted leading-[1.7]">
          Thank you for reaching out. {REPLY_PROMISE.afterSend}
        </p>
      </div>
    );
  }

  const step1TitleId = `${uid}-step1-title`;
  const intentErrorId = `${uid}-intent-error`;

  return (
    <div className="bg-white rounded-2xl border border-pe-border shadow-sm p-6 sm:p-8">
      <RecaptchaScript />

      {/* ─── Step 1 ─────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div>
          <p className="font-body font-bold text-xs uppercase tracking-[0.14em] text-pe-muted mb-3">
            Step 1 of 2
          </p>
          <h2
            ref={step1HeadingRef}
            id={step1TitleId}
            tabIndex={-1}
            className="font-display font-bold text-xl text-pe-text mb-5 focus:outline-none"
          >
            How would you like to work with us?
          </h2>

          <div
            role="radiogroup"
            aria-labelledby={step1TitleId}
            aria-describedby={intentError ? intentErrorId : undefined}
            className="flex flex-col gap-3 mb-6"
          >
            {INTENTS.map((opt) => {
              const isSelected = intent === opt.value;
              const nameId = `${uid}-intent-${opt.value}`;
              const descId = `${nameId}-desc`;
              return (
                <label
                  key={opt.value}
                  className="choice-card flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 cursor-pointer"
                  style={{
                    border: `2px solid ${isSelected ? opt.accent : 'var(--color-pe-border)'}`,
                    background: isSelected ? `rgba(${opt.accentRgb},0.05)` : '#fff',
                  }}
                >
                  <input
                    type="radio"
                    name={`${uid}-intent`}
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => chooseIntent(opt.value)}
                    aria-labelledby={nameId}
                    aria-describedby={descId}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                    style={{
                      background: isSelected ? opt.accent : `rgba(${opt.accentRgb},0.12)`,
                      color: isSelected ? '#fff' : opt.accent,
                    }}
                  >
                    {opt.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span
                      id={nameId}
                      className="block font-display font-bold text-base leading-tight mb-0.5 transition-colors duration-200"
                      style={{ color: isSelected ? opt.accent : 'var(--color-pe-text)' }}
                    >
                      {opt.label}
                    </span>
                    <span id={descId} className="block font-body text-sm text-pe-muted leading-normal">
                      {opt.description}
                    </span>
                  </span>
                  {/* The radio's ring: the card border is decoration, this is the control. */}
                  <span
                    aria-hidden="true"
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200"
                    style={{
                      background: isSelected ? opt.accent : 'transparent',
                      border: `2px solid ${isSelected ? opt.accent : 'var(--color-pe-control-border)'}`,
                    }}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </label>
              );
            })}
          </div>

          {intentError && (
            <p id={intentErrorId} role="alert" className="font-body text-sm text-pe-error -mt-3 mb-4">
              Choose how you&apos;d like to work with us to continue.
            </p>
          )}

          <button
            type="button"
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-display font-bold text-base text-white transition-all duration-200 hover:-translate-y-px"
            style={{ background: 'var(--color-pe-primary)' }}
          >
            Continue
            <IconArrowRight size={16} />
          </button>
        </div>
      )}

      {/* ─── Step 2 ─────────────────────────────────────────────────────────── */}
      {step === 2 && intent && (
        <form onSubmit={handleSubmit} noValidate>

          {/* Header row with back button */}
          <div className="flex items-center gap-3 mb-5">
            <button
              type="button"
              aria-label="Back to step 1"
              onClick={() => { goToStep(1); setFieldErrors({}); setFailure(null); setStatus('idle'); }}
              className="w-10 h-10 rounded-full border border-pe-border flex items-center justify-center text-pe-muted hover:bg-pe-bg transition-colors flex-shrink-0"
            >
              <IconArrowLeft size={14} />
            </button>
            <div>
              <p className="font-body font-bold text-xs uppercase tracking-[0.14em] text-pe-muted">
                Step 2 of 2
              </p>
              <h2
                ref={step2HeadingRef}
                tabIndex={-1}
                className="font-display font-bold text-xl text-pe-text focus:outline-none"
              >
                {config.step2Title}
              </h2>
            </div>
          </div>

          {/* Context hint */}
          <div
            className="rounded-xl px-4 py-3 mb-5 text-sm font-body text-pe-muted leading-relaxed"
            style={{
              background: 'rgba(57,87,92,0.05)',
              border: '1px solid rgba(57,87,92,0.1)',
            }}
          >
            {config.hint}
          </div>

          {/* Fields grid — 1 col mobile, 2 col sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {FIELDS.map(({ key, label, type, placeholder, autoComplete }) => {
              const error = fieldErrors[key];
              return (
                <div key={key}>
                  <label htmlFor={fieldId(key)} className="block font-body font-semibold text-sm text-pe-text mb-1">
                    {label}
                  </label>
                  <input
                    id={fieldId(key)}
                    name={key}
                    type={type}
                    value={fields[key]}
                    onChange={set(key)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId(key) : undefined}
                    className={inputCls(key)}
                  />
                  {error && (
                    <p id={errorId(key)} className="font-body text-sm text-pe-error mt-1">{error}</p>
                  )}
                </div>
              );
            })}

            {/* Message — full width */}
            <div className="col-span-full">
              <label htmlFor={fieldId('message')} className="block font-body font-semibold text-sm text-pe-text mb-1">
                Tell us more <span className="font-normal text-pe-muted">(optional)</span>
              </label>
              <textarea
                id={fieldId('message')}
                name="message"
                value={fields.message}
                onChange={set('message')}
                placeholder="A brief description of what you're looking for..."
                rows={4}
                className={`${inputCls('message')} resize-none leading-relaxed`}
              />
            </div>
          </div>

          {/* Why it didn't send, with email and phone as a way out */}
          {failure && <SendFailureNotice reason={failure} className="mb-4" />}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-display font-bold text-base text-white transition-all duration-200 hover:brightness-90 disabled:opacity-60"
            style={{ background: 'var(--color-pe-primary)' }}
          >
            {status === 'submitting' ? 'Sending…' : config.submitLabel} <IconArrowRight size={16} />
          </button>
          <p role="status" className="sr-only">
            {status === 'submitting' ? 'Sending your enquiry' : ''}
          </p>

          {/* Privacy notice (approved wording, src/config/privacyNotice.ts) and the reCAPTCHA disclosure */}
          <FormPrivacyNotice form="contact" align="center" className="mt-4" />
        </form>
      )}
    </div>
  );
}

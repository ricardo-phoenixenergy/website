'use client';

import { useState } from 'react';
import { contactSchema } from '@/lib/validators/contact';
import {
  IconZap,
  IconUsers,
  IconTrendingUp,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
} from '@/components/ui/Icons';

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
    description: "I want clean energy solutions for my business — solar, storage, wheeling, EV fleets or more.",
    accent: '#709DA9',
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
    accent: '#709DA9',
    accentRgb: '112,157,169',
    step2Title: 'Tell us about your company',
    hint: "For partners: Tell us about your company and the type of collaboration you have in mind. Our partnerships team will be in touch.",
    submitLabel: 'Send partnership enquiry →',
  },
  {
    value: 'investor',
    icon: <IconTrendingUp size={18} />,
    label: "I'm an investor",
    description: "I'm interested in Phoenix Energy's growth story and want to explore investment opportunities.",
    accent: '#709DA9',
    accentRgb: '112,157,169',
    step2Title: 'Tell us about yourself',
    hint: "For investors: Share your details and we'll connect you with our leadership team to discuss Phoenix Energy's growth trajectory.",
    submitLabel: 'Send investor enquiry →',
  },
];

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

async function getRecaptchaToken(): Promise<string> {
  if (!SITE_KEY) return 'no-key';
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.grecaptcha) {
      resolve('no-key');
      return;
    }
    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(SITE_KEY, { action: 'contact_submit' });
        resolve(token);
      } catch {
        reject(new Error('reCAPTCHA failed'));
      }
    });
  });
}

export function ContactForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    message: '',
  });

  const config = INTENTS.find((i) => i.value === intent) ?? INTENTS[0];

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [k]: e.target.value }));
    if (fieldErrors[k]) setFieldErrors((prev) => { const n = { ...prev }; delete n[k]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intent) return;

    setFieldErrors({});
    setErrorMessage(null);

    const result = contactSchema.safeParse({ intent, ...fields, recaptchaToken: 'validating' });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((iss) => {
        const key = iss.path[0] as string;
        errs[key] = iss.message;
      });
      setFieldErrors(errs);
      return;
    }

    setStatus('submitting');

    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent, ...fields, recaptchaToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        if (res.status === 400 && data?.error === 'Verification failed') {
          setErrorMessage("We couldn't verify you're not a robot. Please try again.");
        } else {
          setErrorMessage("Something went wrong sending your message. Please try again or email us at info@phoenixenergy.solutions.");
        }
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMessage("Something went wrong sending your message. Please try again or email us directly at info@phoenixenergy.solutions.");
      setStatus('error');
    }
  };

  const inputCls = (key: string) =>
    `w-full font-body text-base px-3.5 py-2.5 rounded-xl outline-none transition-all duration-150 ${
      fieldErrors[key]
        ? 'border-2 border-[#E05C5C]'
        : 'border border-[#E5E7EB] focus:border-[#39575C] focus:shadow-[0_0_0_3px_rgba(57,87,92,0.08)]'
    }`;

  // ─── Success state ───────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm px-6 py-16 sm:px-10 sm:py-20 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(57,87,92,0.08)', color: '#39575C' }}
        >
          <IconCheck size={28} />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-[#1A1A1A] mb-2">Message sent!</h2>
        <p className="font-body text-base text-[#6B7280] leading-[1.7]">
          Thank you for reaching out. We&apos;ll be in touch within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8">

      {/* ─── Step 1 ─────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div>
          <p className="font-body font-bold text-xs uppercase tracking-[0.14em] text-[#6B7280] mb-3">
            Step 1 of 2
          </p>
          <h2 className="font-display font-bold text-xl text-[#1A1A1A] mb-5">
            How would you like to work with us?
          </h2>

          <div className="flex flex-col gap-3 mb-6">
            {INTENTS.map((opt) => {
              const isSelected = intent === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setIntent(opt.value)}
                  className="flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200"
                  style={{
                    border: `2px solid ${isSelected ? opt.accent : '#E5E7EB'}`,
                    background: isSelected ? `rgba(${opt.accentRgb},0.05)` : '#fff',
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                    style={{
                      background: isSelected ? opt.accent : `rgba(${opt.accentRgb},0.12)`,
                      color: isSelected ? '#fff' : opt.accent,
                    }}
                  >
                    {opt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-display font-bold text-base leading-tight mb-0.5 transition-colors duration-200"
                      style={{ color: isSelected ? opt.accent : '#1A1A1A' }}
                    >
                      {opt.label}
                    </p>
                    <p className="font-body text-sm text-[#6B7280] leading-normal">
                      {opt.description}
                    </p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white transition-all duration-200"
                    style={{
                      background: isSelected ? opt.accent : 'transparent',
                      border: `2px solid ${isSelected ? opt.accent : '#E5E7EB'}`,
                    }}
                  >
                    {isSelected}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!intent}
            onClick={() => setStep(2)}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-display font-bold text-base transition-all duration-200 hover:-translate-y-px disabled:cursor-not-allowed"
            style={{
              background: intent ? '#39575C' : '#D1D5DB',
              color: '#fff',
            }}
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
              onClick={() => { setStep(1); setFieldErrors({}); setErrorMessage(null); setStatus('idle'); }}
              className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-[#F5F5F5] transition-colors flex-shrink-0"
            >
              <IconArrowLeft size={14} />
            </button>
            <div>
              <p className="font-body font-bold text-xs uppercase tracking-[0.14em] text-[#6B7280]">
                Step 2 of 2
              </p>
              <h2 className="font-display font-bold text-xl text-[#1A1A1A]">
                {config.step2Title}
              </h2>
            </div>
          </div>

          {/* Context hint */}
          <div
            className="rounded-xl px-4 py-3 mb-5 text-sm font-body text-[#6B7280] leading-relaxed"
            style={{
              background: 'rgba(57,87,92,0.05)',
              border: '1px solid rgba(57,87,92,0.1)',
            }}
          >
            {config.hint}
          </div>

          {/* Fields grid — 1 col mobile, 2 col sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {(
              [
                { key: 'firstName', label: 'First name',    type: 'text',  placeholder: 'e.g. Sarah',             required: true },
                { key: 'lastName',  label: 'Last name',     type: 'text',  placeholder: 'e.g. Johnson',           required: true },
                { key: 'email',     label: 'Email address', type: 'email', placeholder: 'sarah@company.co.za',    required: true },
                { key: 'phone',     label: 'Phone number',  type: 'tel',   placeholder: '+27 __ ___ ____',        required: true },
                { key: 'company',   label: 'Company name',  type: 'text',  placeholder: 'e.g. Acme Holdings',     required: true },
                { key: 'location',  label: 'Location',      type: 'text',  placeholder: 'e.g. Johannesburg, GP',  required: true },
              ] as { key: keyof typeof fields; label: string; type: string; placeholder: string; required: boolean }[]
            ).map(({ key, label, type, placeholder, required }) => (
              <div key={key}>
                <label className="block font-body font-semibold text-sm text-[#1A1A1A] mb-1">
                  {label}
                  {!required && <span className="font-normal text-[#6B7280] ml-1">(optional)</span>}
                </label>
                <input
                  type={type}
                  value={fields[key]}
                  onChange={set(key)}
                  placeholder={placeholder}
                  required={required}
                  className={inputCls(key)}
                />
                {fieldErrors[key] && (
                  <p className="font-body text-sm text-[#E05C5C] mt-1">{fieldErrors[key]}</p>
                )}
              </div>
            ))}

            {/* Message — full width */}
            <div className="col-span-full">
              <label className="block font-body font-semibold text-sm text-[#1A1A1A] mb-1">
                Tell us more <span className="font-normal text-[#6B7280]">(optional)</span>
              </label>
              <textarea
                value={fields.message}
                onChange={set('message')}
                placeholder="A brief description of what you're looking for..."
                rows={4}
                className={`${inputCls('message')} resize-none leading-relaxed`}
              />
            </div>
          </div>

          {/* Error banner */}
          {(status === 'error' || errorMessage) && (
            <div
              className="rounded-xl px-4 py-3 mb-4 font-body text-sm leading-relaxed"
              style={{
                background: 'rgba(227,197,141,0.12)',
                border: '1px solid rgba(227,197,141,0.3)',
                color: '#7a5c1a',
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-display font-bold text-base text-white transition-all duration-200 hover:brightness-90 disabled:opacity-60"
            style={{ background: '#39575C' }}
          >
            {status === 'submitting' ? 'Sending…' : config.submitLabel} <IconArrowRight size={16} />
          </button>

          {/* Privacy note */}
          <p className="font-body text-xs text-[#6B7280] text-center mt-4 leading-relaxed">
            By submitting this form you agree to our{' '}
            <a href="/privacy-policy" className="underline hover:text-[#39575C]">Privacy Policy</a>.
            {' '}Your information will only be used to respond to your enquiry.
          </p>
        </form>
      )}
    </div>
  );
}

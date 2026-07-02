// src/components/tools/Step3Capture.tsx
'use client';
import { useState } from 'react';
import type { SolarInputs, BessInputs, ConditionInputs, ValuationResult } from '@/lib/valuation/types';
import { dlPush } from '@/lib/analytics';
import { IconArrowLeft, IconArrowRight, IconZap, IconCheck } from '@/components/ui/Icons';
import { PROVINCE_LABELS } from '@/lib/valuation/provinces';
import { RecaptchaNotice } from '@/components/ui/RecaptchaNotice';

const DOCS_LABEL: Record<ConditionInputs['docs'], string> = {
  full: 'Full handover pack (COC, SLDs & docs)',
  coc: 'COC only',
  none: 'None / not sure',
};

interface Step3CaptureProps {
  solar: SolarInputs;
  bess: BessInputs;
  cond: ConditionInputs;
  /** Internal auto-estimate — sent to the WeBuySolar team only, never shown to the user. */
  result: ValuationResult;
  onBack: () => void;
}

interface LeadForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

function WhatHappensNext() {
  const steps = [
    'A WeBuySolar specialist reviews your system details and prepares your indicative valuation.',
    'We contact you within 1 business day to talk through it and arrange a free on-site verification.',
    'You receive a formal written offer within 5 business days — no obligation to accept.',
  ];
  return (
    <div
      className="rounded-xl p-5 mt-6 text-left"
      style={{ background: 'rgba(57,87,92,0.06)', border: '1px solid rgba(57,87,92,0.15)' }}
    >
      <p className="font-display font-bold text-sm text-[#39575C] mb-3">What happens next</p>
      <div className="flex flex-col gap-3">
        {steps.map((text, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: '#39575C' }}
            >
              <span className="font-display font-bold text-[10px] text-white">{i + 1}</span>
            </div>
            <p className="font-body text-xs text-[#6B7280] leading-[1.65]">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Step3Capture({ solar, bess, cond, result, onBack }: Step3CaptureProps) {
  const [form, setForm] = useState<LeadForm>({ firstName: '', lastName: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid =
    form.firstName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  function patch(field: keyof LeadForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      let recaptchaToken = '';
      if (siteKey && typeof window !== 'undefined' && window.grecaptcha) {
        recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'valuation_submit' });
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'webuysolar',
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim() || undefined,
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          valuation: {
            kw: solar.kw,
            bessKwh: bess.enabled ? bess.kWh : 0,
            installYear: solar.installYear,
            inverterKw: solar.inverterKw,
            panelBrand: solar.panelBrand || undefined,
            inverterBrand: solar.inverterBrand || undefined,
            batteryBrand: bess.enabled ? (bess.brand || undefined) : undefined,
            documentation: DOCS_LABEL[cond.docs],
            province: PROVINCE_LABELS[cond.province],
            indicativeValue: result.total,
            rangeLow: result.rangeLow,
            rangeHigh: result.rangeHigh,
            dcfValue: result.solarDcf,
          },
          recaptchaToken,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      const band = result.rangeLow >= 1_000_000
        ? `R${Math.round(result.rangeLow / 1_000_000)}M–R${Math.round(result.rangeHigh / 1_000_000)}M`
        : `R${Math.round(result.rangeLow / 1_000)}k–R${Math.round(result.rangeHigh / 1_000)}k`;
      dlPush({ event: 'valuation_lead', estimated_value_band: band });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full font-body text-sm text-[#1A1A1A] rounded-xl px-4 py-2.5 outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(57,87,92,0.08)]';
  const inputStyle = { border: '1px solid #E5E7EB', background: 'white' };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
          style={{ background: '#39575C' }}
        >
          <IconCheck size={26} />
        </div>
        <h2 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-2">
          Thank you — we&rsquo;ve got your details
        </h2>
        <p className="font-body text-sm text-[#6B7280] leading-[1.7] max-w-[420px] mx-auto">
          Our WeBuySolar team will review your system and be in touch with your indicative
          buyback valuation.
        </p>
        <WhatHappensNext />
      </div>
    );
  }

  return (
    <div>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white"
        style={{ background: '#39575C' }}
      >
        <IconZap size={22} />
      </div>

      <h2 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-2">
        Get your buyback valuation
      </h2>
      <p className="font-body text-sm text-[#6B7280] leading-[1.7] mb-6">
        Enter your details and our WeBuySolar team will review your system and send you an
        indicative buyback valuation.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input type="text" placeholder="First name *" value={form.firstName} onChange={patch('firstName')} required className={inputClass} style={inputStyle} />
          <input type="text" placeholder="Last name" value={form.lastName} onChange={patch('lastName')} className={inputClass} style={inputStyle} />
        </div>
        <input type="email" placeholder="Email address *" value={form.email} onChange={patch('email')} required className={`${inputClass} mb-3`} style={inputStyle} />
        <input type="tel" placeholder="Phone number" value={form.phone} onChange={patch('phone')} className={`${inputClass} mb-4`} style={inputStyle} />

        {error && <p className="font-body text-xs text-red-600 mb-3">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm text-[#6B7280] rounded-xl py-3 px-6 transition-colors hover:text-[#39575C]"
            style={{ border: '1px solid #E5E7EB', background: 'white' }}
          >
            <IconArrowLeft size={14} /> Back
          </button>
          <button
            type="submit"
            disabled={!valid || submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 font-body font-semibold text-sm text-white rounded-xl py-3 transition-opacity"
            style={{ background: '#39575C', opacity: valid && !submitting ? 1 : 0.5 }}
          >
            {submitting ? 'Sending…' : <>Send my details <IconArrowRight size={14} /></>}
          </button>
        </div>
      </form>

      <p className="font-body text-[11px] text-[#9CA3AF] mt-4 leading-[1.6]">
        Used only to prepare your valuation and for a WeBuySolar specialist to follow up.
        Never shared or sold.
      </p>
      <RecaptchaNotice className="font-body text-[11px] text-[#9CA3AF] mt-2 leading-[1.6]" />
    </div>
  );
}

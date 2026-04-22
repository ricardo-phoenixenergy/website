// src/components/tools/SoftPaywall.tsx
'use client';
import { useState } from 'react';
import type { SolarInputs, BessInputs, ConditionInputs, ValuationResult } from '@/lib/valuation/types';

interface SoftPaywallProps {
  result: ValuationResult;
  solar: SolarInputs;
  bess: BessInputs;
  cond: ConditionInputs;
  onUnlock: () => void;
}

interface LeadForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function SoftPaywall({ result, solar, bess, cond, onUnlock }: SoftPaywallProps) {
  const [form, setForm] = useState<LeadForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
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
      if (
        siteKey &&
        typeof window !== 'undefined' &&
        window.grecaptcha
      ) {
        recaptchaToken = await window.grecaptcha.execute(siteKey, {
          action: 'valuation_submit',
        });
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
            tier: solar.tier,
            province: cond.province,
            indicativeValue: result.total,
            rangeLow: result.rangeLow,
            rangeHigh: result.rangeHigh,
            dcfValue: result.solarDcf,
          },
          recaptchaToken,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      onUnlock();
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full font-body text-sm text-[#1A1A1A] rounded-xl px-4 py-2.5 outline-none transition-shadow';
  const inputStyle = { border: '1px solid #E5E7EB', background: 'white' };

  return (
    <div
      className="rounded-2xl p-6 w-full max-w-[420px] mx-auto text-center"
      style={{ background: 'white', border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: '#39575C' }}
      >
        <span className="text-xl" aria-hidden="true">⚡</span>
      </div>

      <h2 className="font-display font-extrabold text-lg text-[#1A1A1A] mb-2">
        Your valuation is ready
      </h2>
      <p className="font-body text-xs text-[#6B7280] leading-[1.7] mb-5 max-w-[320px] mx-auto">
        Enter your details to unlock your full report — including the year-by-year DCF
        breakdown and your personalised WeBuySolar buyback offer.
      </p>

      <form onSubmit={handleSubmit} className="text-left">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="First name *"
            value={form.firstName}
            onChange={patch('firstName')}
            required
            className={inputClass}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Last name"
            value={form.lastName}
            onChange={patch('lastName')}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <input
          type="email"
          placeholder="Email address *"
          value={form.email}
          onChange={patch('email')}
          required
          className={`${inputClass} mb-3`}
          style={inputStyle}
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={patch('phone')}
          className={`${inputClass} mb-4`}
          style={inputStyle}
        />

        {error && (
          <p className="font-body text-xs text-red-600 mb-3 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={!valid || submitting}
          className="w-full font-body font-semibold text-sm text-white rounded-xl py-3 transition-opacity"
          style={{
            background: '#39575C',
            opacity: valid && !submitting ? 1 : 0.5,
          }}
        >
          {submitting ? 'Sending…' : 'Unlock my full valuation →'}
        </button>
      </form>

      <p className="font-body text-[10px] text-[#9CA3AF] mt-3 leading-[1.6]">
        Used only to send your report and for a WeBuySolar specialist to follow up.
        Never shared or sold.
      </p>
    </div>
  );
}

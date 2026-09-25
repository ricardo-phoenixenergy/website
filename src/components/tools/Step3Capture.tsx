// src/components/tools/Step3Capture.tsx
'use client';
import { useEffect, useId, useRef, useState } from 'react';
import type { SolarInputs, BessInputs, ConditionInputs } from '@/lib/valuation/types';
import { dlPush } from '@/lib/analytics';
import { IconArrowLeft, IconArrowRight, IconZap, IconCheck } from '@/components/ui/Icons';
import { PROVINCE_LABELS } from '@/lib/valuation/provinces';
import {
  CHEMISTRY_LABEL, CONDITION_LABEL, DOCS_LABEL, INVERTER_TYPE_LABEL, MONITORING_LABEL, SOH_LABEL,
} from '@/lib/valuation/labels';
import { getRecaptchaToken, type RecaptchaErrorCode } from '@/lib/recaptcha';
import { FormPrivacyNotice } from '@/components/ui/FormPrivacyNotice';
import { NextSteps, type NextStep } from '@/components/ui/NextSteps';
import { SendFailureNotice, type SendFailure } from '@/components/ui/SendFailureNotice';
import { WEBUYSOLAR_OFFER } from '@/config/webuysolarOffer';

interface Step3CaptureProps {
  solar: SolarInputs;
  bess: BessInputs;
  cond: ConditionInputs;
  onBack: () => void;
}

interface LeadForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

type LeadField = keyof LeadForm;

const FIELD_ORDER: LeadField[] = ['firstName', 'lastName', 'email', 'phone'];

function validate(form: LeadForm): Partial<Record<LeadField, string>> {
  const errors: Partial<Record<LeadField, string>> = {};
  if (form.firstName.trim().length < 2) errors.firstName = 'Enter your first name (at least 2 letters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter an email address like name@company.co.za.';
  }
  return errors;
}

/**
 * The steps a request leads to, worded exactly as the WeBuySolar page words
 * them (shared config): first contact, the free audit, then the preliminary
 * offer that carries the valuation.
 */
const [AUDIT_STEP, OFFER_STEP] = WEBUYSOLAR_OFFER.steps;
const NEXT_STEPS: NextStep[] = [
  { key: 'contact', text: WEBUYSOLAR_OFFER.firstContact },
  { key: 'audit', label: AUDIT_STEP.label, text: AUDIT_STEP.description },
  { key: 'offer', label: OFFER_STEP.label, text: OFFER_STEP.description },
];

export function Step3Capture({ solar, bess, cond, onBack }: Step3CaptureProps) {
  const uid = useId();
  const [form, setForm] = useState<LeadForm>({ firstName: '', lastName: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<Record<LeadField, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [failure, setFailure] = useState<SendFailure | null>(null);
  const focusFieldRef = useRef<LeadField | null>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  const fieldId = (k: LeadField) => `${uid}-${k}`;
  const errorId = (k: LeadField) => `${uid}-${k}-error`;

  useEffect(() => {
    const key = focusFieldRef.current;
    if (!key) return;
    focusFieldRef.current = null;
    document.getElementById(`${uid}-${key}`)?.focus();
  }, [errors, uid]);

  useEffect(() => {
    if (submitted) successHeadingRef.current?.focus();
  }, [submitted]);

  function patch(field: LeadField) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const found = validate(form);
    if (Object.keys(found).length > 0) {
      focusFieldRef.current = FIELD_ORDER.find((k) => found[k]) ?? null;
      setErrors(found);
      return;
    }

    setSubmitting(true);
    setFailure(null);

    try {
      const recaptchaToken = await getRecaptchaToken('valuation_submit');

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'webuysolar',
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim() || undefined,
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          // Every answer the owner gave, in the words they chose from.
          valuation: {
            kw: solar.kw,
            bessKwh: bess.enabled ? bess.kWh : 0,
            installYear: solar.installYear,
            inverterType: INVERTER_TYPE_LABEL[solar.inverterType],
            inverterKw: solar.inverterKw,
            panelBrand: solar.panelBrand || undefined,
            inverterBrand: solar.inverterBrand || undefined,
            batteryBrand: bess.enabled ? (bess.brand || undefined) : undefined,
            batteryChemistry: bess.enabled ? CHEMISTRY_LABEL[bess.chemistry] : undefined,
            batteryHealth: bess.enabled ? SOH_LABEL[bess.soh] : undefined,
            condition: CONDITION_LABEL[cond.condition],
            monitoring: cond.monitoring ? MONITORING_LABEL.yes : MONITORING_LABEL.no,
            documentation: DOCS_LABEL[cond.docs],
            province: PROVINCE_LABELS[cond.province],
          },
          recaptchaToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        const code = data.error as RecaptchaErrorCode | undefined;
        setFailure(code === 'recaptcha-missing' || code === 'recaptcha-failed' ? code : 'send-failed');
        setSubmitting(false);
        return;
      }
      dlPush({ event: 'valuation_lead', kw: solar.kw, has_battery: bess.enabled });
      setSubmitted(true);
    } catch {
      setFailure('send-failed');
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full font-body text-sm text-pe-text rounded-xl px-4 py-2.5 bg-white transition-colors';
  const borderFor = (k: LeadField) =>
    errors[k] ? 'border-2 border-pe-error' : 'border border-pe-control-border focus:border-pe-primary';
  const labelClass = 'font-body font-semibold text-xs text-pe-text block mb-2';

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div
          aria-hidden="true"
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
          style={{ background: 'var(--color-pe-primary)' }}
        >
          <IconCheck size={26} />
        </div>
        <h3
          ref={successHeadingRef}
          tabIndex={-1}
          className="font-display font-extrabold text-xl text-pe-text mb-2 focus:outline-none"
        >
          Thank you. We&rsquo;ve got your request.
        </h3>
        <NextSteps steps={NEXT_STEPS} className="mt-6" />
      </div>
    );
  }

  const renderField = (
    key: LeadField,
    label: string,
    type: 'text' | 'email' | 'tel',
    autoComplete: string,
    required: boolean,
  ) => (
    <div>
      <label htmlFor={fieldId(key)} className={labelClass}>
        {label}
        {!required && <span className="font-normal text-pe-muted ml-1">(optional)</span>}
      </label>
      <input
        id={fieldId(key)}
        name={key}
        type={type}
        value={form[key]}
        onChange={patch(key)}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={errors[key] ? errorId(key) : undefined}
        className={`${inputClass} ${borderFor(key)}`}
      />
      {errors[key] && (
        <p id={errorId(key)} className="font-body text-xs text-pe-error mt-1.5">{errors[key]}</p>
      )}
    </div>
  );

  return (
    <div>
      <div
        aria-hidden="true"
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white"
        style={{ background: 'var(--color-pe-primary)' }}
      >
        <IconZap size={22} />
      </div>

      <h3 className="font-display font-extrabold text-xl text-pe-text mb-2">
        Your contact details
      </h3>
      <p className="font-body text-sm text-pe-muted leading-[1.7] mb-5">
        There&rsquo;s no cost, and no obligation to sell.
      </p>

      <NextSteps steps={NEXT_STEPS} className="mb-6" />

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4 mb-4">
          {renderField('firstName', 'First name', 'text', 'given-name', true)}
          {renderField('lastName', 'Last name', 'text', 'family-name', false)}
          <div className="sm:col-span-2">{renderField('email', 'Email address', 'email', 'email', true)}</div>
          <div className="sm:col-span-2">{renderField('phone', 'Phone number', 'tel', 'tel', false)}</div>
        </div>

        {failure && <SendFailureNotice reason={failure} className="mb-4" />}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm text-pe-muted rounded-xl py-3 px-6 transition-colors hover:text-pe-primary"
            style={{ border: '1px solid var(--color-pe-border)', background: 'white' }}
          >
            <IconArrowLeft size={14} /> Back
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 font-body font-semibold text-sm text-white rounded-xl py-3 transition-opacity disabled:opacity-60"
            style={{ background: 'var(--color-pe-primary)' }}
          >
            {submitting ? 'Sending…' : <>Request my valuation <IconArrowRight size={14} /></>}
          </button>
        </div>
        <p role="status" className="sr-only">{submitting ? 'Sending your request' : ''}</p>
      </form>

      <FormPrivacyNotice form="valuation" className="mt-4" />
    </div>
  );
}

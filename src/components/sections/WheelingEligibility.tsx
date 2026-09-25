'use client';

import { useState, useEffect, useId, useRef } from 'react';
import Link from 'next/link';
import { dlPush } from '@/lib/analytics';
import { evaluateWheeling } from '@/lib/wheeling/eligibility';
import { ELIGIBLE_MODELS, wheelingEnquiry } from '@/lib/wheeling/enquiry';
import { WHEELING_SUPPLY_POINTS, supplyPointById } from '@/config/wheelingSupplyPoints';
import { contactHref } from '@/lib/contactLink';
import type { WheelingTou, WheelingOutcome } from '@/lib/wheeling/types';
import {
  IconCheck, IconX, IconHelpCircle, IconArrowLeft, IconArrowRight, IconZap, IconGlobe,
} from '@/components/ui/Icons';
import { SOLUTION_META } from '@/types/solutions';

const ACCENT = SOLUTION_META.wheeling.accent;
const ACCENT_ON = SOLUTION_META.wheeling.accentText;
// Secondary result links: the coral outline carries the accent; coral text on the
// dark card measured 2.3 to 3.9:1, so the label is on-dark-muted.
const OUTLINE_LINK = {
  border: `1.5px solid ${ACCENT}66`,
  color: 'var(--color-on-dark-muted)',
  background: 'rgba(217,124,118,0.06)',
} as const;
const ICON = 18;
const VERTICAL = 'wheeling';

type Step = 'supply' | 'tou' | 'reveal';

const TOU_OPTIONS: { value: WheelingTou; label: string; icon: React.ReactNode }[] = [
  { value: 'yes',    label: 'Yes',          icon: <IconCheck size={ICON} /> },
  { value: 'no',     label: 'No',           icon: <IconX size={ICON} /> },
  { value: 'unsure', label: "I'm not sure", icon: <IconHelpCircle size={ICON} /> },
];

// Eskom-direct and municipal supplies both need the Time-of-Use step; an unlisted supplier skips it.
function needsTou(id: string) {
  const m = supplyPointById(id)?.model;
  return m === 'direct' || m === 'virtual';
}

export function WheelingEligibility() {
  const [step, setStep] = useState<Step>('supply');
  const [supplyPointId, setSupplyPointId] = useState<string>('');
  const [tou, setTou] = useState<WheelingTou | null>(null);
  const [started, setStarted] = useState(false);
  // The select only stages a choice; Continue commits it. On Windows the arrow
  // keys change a closed select's value, so committing on change skipped a step.
  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState(false);
  const uid = useId();
  const selectId = `${uid}-supplier`;
  const touHeadingId = `${uid}-tou`;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  // Only a step change the visitor makes moves focus; the first render doesn't.
  const moveFocusRef = useRef(false);
  // Set when Continue finds no supplier: focus waits until the error is on the
  // page, so the select is announced as invalid, with the reason, when it lands.
  const focusSelectRef = useRef(false);

  useEffect(() => {
    if (!moveFocusRef.current) return;
    moveFocusRef.current = false;
    if (step === 'supply') selectRef.current?.focus();
    else headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (!draftError || !focusSelectRef.current) return;
    focusSelectRef.current = false;
    selectRef.current?.focus();
  }, [draftError]);

  function goTo(next: Step) {
    moveFocusRef.current = true;
    setStep(next);
  }

  function continueFromSupply() {
    if (!draft) {
      // Already showing: the select is described by it, so focus it now.
      if (draftError) selectRef.current?.focus();
      else {
        focusSelectRef.current = true;
        setDraftError(true);
      }
      return;
    }
    pickSupply(draft);
  }

  function pickSupply(id: string) {
    if (!id) return;
    if (!started) {
      setStarted(true);
      dlPush({ event: 'wheeling_eligibility_start', vertical: VERTICAL });
    }
    setSupplyPointId(id);
    setTou(null);
    goTo(needsTou(id) ? 'tou' : 'reveal');
  }

  function pickTou(v: WheelingTou) {
    setTou(v);
    goTo('reveal');
  }

  function restart() {
    goTo('supply');
    setSupplyPointId('');
    setDraft('');
    setDraftError(false);
    setTou(null);
    setStarted(false);
  }

  const outcome =
    step === 'reveal' && supplyPointId
      ? evaluateWheeling({ supplyPointId, tou: tou ?? undefined })
      : null;

  useEffect(() => {
    if (step !== 'reveal' || !supplyPointId) return;
    const o = evaluateWheeling({ supplyPointId, tou: tou ?? undefined });
    dlPush({
      event: 'wheeling_eligibility_complete',
      vertical: VERTICAL,
      tou: tou ?? 'n/a',
      supply_point: supplyPointId,
      status: o.status,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div
      id="wheeling-eligibility"
      // 55% Night Teal, like the other hero tools, so text contrast doesn't depend on the hero photo.
      className="w-full rounded-2xl p-6 bg-pe-nav-dark/55"
      style={{ border: '1px solid rgba(255,255,255,0.10)' }}
    >
      {/* The card sits on the hero photo: labels use on-dark-muted, as coral text
          measured 3.1:1 and 60% white 4.2:1 over its lighter parts. */}
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--color-on-dark-muted)' }}>
        Check eligibility
      </p>
      <h2 className="font-display font-extrabold text-xl text-white mb-1">
        Are you eligible for wheeling?
      </h2>
      <p className="font-body text-xs mb-5" style={{ color: 'var(--color-on-dark-muted)' }}>
        A quick check to see which wheeling model fits your business.
      </p>

      {step === 'supply' && (
        <div>
          <label htmlFor={selectId} className="block font-display font-extrabold text-base text-white mb-3">
            How is your business billed for electricity?
          </label>
          <select
            ref={selectRef}
            id={selectId}
            value={draft}
            onChange={(e) => { setDraft(e.target.value); setDraftError(false); }}
            aria-invalid={draftError ? true : undefined}
            aria-describedby={draftError ? `${selectId}-error` : undefined}
            className="w-full rounded-xl px-4 py-3.5 font-body text-sm"
            // The field's edge takes the control token, which passes on this dark card
            // too; the 18% white it replaces measured 2.0:1.
            style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid var(--color-pe-control-border)', color: '#fff' }}
          >
            <option value="" disabled style={{ color: 'var(--color-pe-nav-dark)' }}>
              Select your supplier…
            </option>
            {WHEELING_SUPPLY_POINTS.map((sp) => (
              <option key={sp.id} value={sp.id} style={{ color: 'var(--color-pe-nav-dark)' }}>
                {sp.label}
              </option>
            ))}
          </select>
          {draftError && (
            <p id={`${selectId}-error`} className="font-body text-xs mt-2" style={{ color: 'var(--color-on-dark-error)' }}>
              Choose your supplier to continue.
            </p>
          )}
          <button
            type="button"
            onClick={continueFromSupply}
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full rounded-full px-5 py-2.5 font-display font-bold text-sm"
            style={{ background: 'var(--color-pe-bg)', color: 'var(--color-pe-nav-dark)' }}
          >
            Continue <IconArrowRight size={14} />
          </button>
        </div>
      )}

      {step === 'tou' && (
        <div>
          <div className="flex items-start gap-3 mb-4">
            <button
              type="button"
              onClick={() => goTo('supply')}
              aria-label="Back to your supplier"
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
            >
              <IconArrowLeft size={14} />
            </button>
            <h3
              ref={headingRef}
              id={touHeadingId}
              tabIndex={-1}
              className="font-display font-extrabold text-base text-white focus:outline-none"
            >
              Are you on a Time-of-Use tariff?
            </h3>
          </div>
          <p className="font-body text-xs mb-4 leading-relaxed" style={{ color: 'var(--color-on-dark-subtle)' }}>
            A tariff where the unit price changes by time of day, with peak, standard and off-peak rates. On Eskom, that&apos;s tariffs like Megaflex, Miniflex or Ruraflex.
          </p>
          {/* Plain buttons: a choice moves straight to the result. */}
          <div className="flex flex-col gap-3" role="group" aria-labelledby={touHeadingId}>
            {TOU_OPTIONS.map((opt) => {
              const isSel = tou === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => pickTou(opt.value)}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-all duration-200"
                  style={{
                    border: `1.5px solid ${isSel ? ACCENT : 'rgba(255,255,255,0.14)'}`,
                    background: isSel ? 'rgba(217,124,118,0.10)' : 'rgba(255,255,255,0.04)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: isSel ? ACCENT : 'rgba(217,124,118,0.14)', color: isSel ? 'var(--color-pe-nav-dark)' : ACCENT }}
                  >
                    {opt.icon}
                  </span>
                  <span className="font-display font-bold text-sm" style={{ color: isSel ? ACCENT : '#fff' }}>
                    {opt.label}
                  </span>
                  {isSel && <span className="sr-only">(your current answer)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 'reveal' && outcome && (
        <Reveal
          outcome={outcome}
          enquiry={wheelingEnquiry(outcome, supplyPointId, tou)}
          tou={tou}
          headingRef={headingRef}
          onBack={() => goTo(needsTou(supplyPointId) ? 'tou' : 'supply')}
          onRestart={restart}
        />
      )}
    </div>
  );
}

const NEGATIVE: Record<'not-eligible-tou' | 'not-available', {
  heading: string;
  body: string;
  links: { label: string; href: string }[];
}> = {
  'not-eligible-tou': {
    heading: 'Let’s get you wheel-ready',
    body: 'Wheeling needs a Time-of-Use tariff. Tariff Optimisation can move you onto the right tariff and get you wheel-ready. You could also generate on-site.',
    links: [
      { label: 'Explore Tariff Optimisation', href: '/solutions/energy-optimisation#lever-tariff' },
      { label: 'Explore C&I Solar & Storage', href: '/solutions/ci-solar-storage' },
    ],
  },
  'not-available': {
    heading: 'Not available in your area yet',
    body: 'Wheeling isn’t available with your supplier yet. Our other solutions can still cut your energy costs today.',
    links: [
      { label: 'Explore C&I Solar & Storage', href: '/solutions/ci-solar-storage' },
      { label: 'Explore Energy Optimisation', href: '/solutions/energy-optimisation' },
    ],
  },
};

// When the answers can't settle it, the honest result: a bill can.
const NEEDS_CHECK = {
  heading: 'We can tell from one electricity bill',
  // Not sure of the tariff: the supplier can wheel, so the tariff decides it.
  unsureTariff: 'Wheeling needs a Time-of-Use tariff, and your bill names the tariff you’re on. Have a recent one to hand and we’ll check it with you.',
  // Supplier not listed, or not known: the bill shows both.
  unlistedSupplier: 'Your bill shows who supplies your electricity and on which tariff, and those decide whether you can wheel. Have a recent one to hand and we’ll check it with you.',
} as const;

const ASSESSMENT_LABEL = 'Book a free wheeling assessment';

function Reveal({
  outcome, enquiry, tou, headingRef, onBack, onRestart,
}: {
  outcome: WheelingOutcome;
  /** The message the result writes into the contact form. */
  enquiry: string;
  tou: WheelingTou | null;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onRestart: () => void;
}) {
  const eligible = outcome.status === 'eskom' || outcome.status === 'virtual';
  const models = eligible ? ELIGIBLE_MODELS[outcome.status as 'eskom' | 'virtual'] : [];
  const neg = outcome.status === 'not-eligible-tou' ? NEGATIVE['not-eligible-tou'] : NEGATIVE['not-available'];
  const assessmentHref = contactHref(enquiry);
  const trackAssessment = (label: string) =>
    dlPush({ event: 'cta_click', cta_label: label, cta_location: `wheeling_eligibility_result:${outcome.status}` });

  return (
    <div
      className="rounded-xl p-5"
      style={{ border: `1px solid ${ACCENT}66`, background: 'rgba(217,124,118,0.06)' }}
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 font-body text-xs mb-3"
        style={{ color: 'var(--color-on-dark-subtle)' }}
      >
        <IconArrowLeft size={13} /> Back
      </button>

      {eligible ? (
        <>
          <div aria-hidden="true" className="flex items-center justify-center mb-3" style={{ color: ACCENT }}>
            {outcome.status === 'eskom' ? <IconZap size={28} /> : <IconGlobe size={28} />}
          </div>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="font-body text-xs uppercase tracking-[0.12em] text-center mb-2 focus:outline-none"
            style={{ color: 'var(--color-on-dark-subtle)' }}
          >
            You&apos;re eligible
          </h3>
          <p className="font-body text-sm text-center leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {outcome.status === 'eskom'
              ? 'As an Eskom direct-billed business on a Time-of-Use tariff, you can buy wheeled power with Direct Wheeling or own a dedicated plant with Micro-Wheeling.'
              : `${outcome.supplyPointLabel} supports virtual wheeling. Here’s how the Virtual Wheeling model works.`}
          </p>

          <div className="flex flex-col gap-2.5">
            <Link
              href={assessmentHref}
              onClick={() => trackAssessment(ASSESSMENT_LABEL)}
              className="flex items-center justify-center gap-1.5 w-full rounded-full px-5 py-3 font-display font-bold text-sm"
              style={{ background: ACCENT, color: ACCENT_ON }}
            >
              {ASSESSMENT_LABEL} <IconArrowRight size={14} />
            </Link>
            {models.map((m) => (
              <button
                key={m.anchor}
                type="button"
                onClick={() => window.location.assign(`#${m.anchor}`)}
                className="flex items-center justify-center gap-1.5 w-full rounded-full px-5 py-2.5 font-display font-bold text-sm"
                style={OUTLINE_LINK}
              >
                How {m.label} works <IconArrowRight size={14} />
              </button>
            ))}
          </div>
        </>
      ) : outcome.status === 'needs-check' ? (
        <>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="font-display font-extrabold text-xl text-center mb-3 text-white focus:outline-none"
          >
            {NEEDS_CHECK.heading}
          </h3>
          <p className="font-body text-sm text-center leading-relaxed mb-5" style={{ color: 'var(--color-on-dark-muted)' }}>
            {tou === 'unsure' ? NEEDS_CHECK.unsureTariff : NEEDS_CHECK.unlistedSupplier}
          </p>
          <Link
            href={assessmentHref}
            onClick={() => trackAssessment(ASSESSMENT_LABEL)}
            className="flex items-center justify-center gap-1.5 w-full rounded-full px-5 py-3 font-display font-bold text-sm"
            style={{ background: ACCENT, color: ACCENT_ON }}
          >
            {ASSESSMENT_LABEL} <IconArrowRight size={14} />
          </Link>
        </>
      ) : (
        <>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="font-display font-extrabold text-xl text-center mb-3 text-white focus:outline-none"
          >
            {neg.heading}
          </h3>
          <p className="font-body text-sm text-center leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {neg.body}
          </p>

          <div className="flex flex-col gap-2.5">
            {neg.links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-center gap-1.5 w-full rounded-full px-5 py-2.5 font-display font-bold text-sm"
                style={i === 0 ? { background: ACCENT, color: ACCENT_ON } : OUTLINE_LINK}
              >
                {link.label} <IconArrowRight size={14} />
              </Link>
            ))}
            <Link
              href={assessmentHref}
              onClick={() => trackAssessment('Or talk to us about your site')}
              className="text-center font-body text-sm font-semibold underline underline-offset-4 mt-1"
              style={{ color: 'var(--color-on-dark-muted)' }}
            >
              Or talk to us about your site
            </Link>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="block w-full text-center font-body text-xs mt-4"
        style={{ color: 'var(--color-on-dark-subtle)' }}
      >
        Start over
      </button>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dlPush } from '@/lib/analytics';
import { evaluateWheeling } from '@/lib/wheeling/eligibility';
import { WHEELING_SUPPLY_POINTS } from '@/config/wheelingSupplyPoints';
import type { WheelingTou, WheelingOutcome } from '@/lib/wheeling/types';
import {
  IconCheck, IconX, IconHelpCircle, IconArrowLeft, IconArrowRight, IconZap, IconGlobe,
} from '@/components/ui/Icons';

const ACCENT = '#D97C76';
const ICON = 18;
const VERTICAL = 'wheeling';

type Step = 'tou' | 'supply' | 'reveal';

const TOU_OPTIONS: { value: WheelingTou; label: string; icon: React.ReactNode }[] = [
  { value: 'yes',    label: 'Yes',          icon: <IconCheck size={ICON} /> },
  { value: 'no',     label: 'No',           icon: <IconX size={ICON} /> },
  { value: 'unsure', label: "I'm not sure", icon: <IconHelpCircle size={ICON} /> },
];

const contactHref = (message: string) =>
  `/contact?intent=client&message=${encodeURIComponent(message)}`;

export function WheelingEligibility() {
  const [step, setStep] = useState<Step>('tou');
  const [tou, setTou] = useState<WheelingTou | null>(null);
  const [supplyPointId, setSupplyPointId] = useState<string>('');
  const [started, setStarted] = useState(false);

  function pickTou(v: WheelingTou) {
    if (!started) {
      setStarted(true);
      dlPush({ event: 'wheeling_eligibility_start', vertical: VERTICAL });
    }
    setTou(v);
    setSupplyPointId('');
    setStep(v === 'no' ? 'reveal' : 'supply');
  }

  function pickSupply(id: string) {
    setSupplyPointId(id);
    if (id) setStep('reveal');
  }

  function restart() {
    setStep('tou');
    setTou(null);
    setSupplyPointId('');
    setStarted(false);
  }

  const outcome =
    step === 'reveal' && tou
      ? evaluateWheeling({ tou, supplyPointId: supplyPointId || undefined })
      : null;

  useEffect(() => {
    if (step !== 'reveal' || !tou) return;
    const o = evaluateWheeling({ tou, supplyPointId: supplyPointId || undefined });
    dlPush({
      event: 'wheeling_eligibility_complete',
      vertical: VERTICAL,
      tou,
      supply_point: supplyPointId || 'n/a',
      status: o.status,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div
      id="wheeling-eligibility"
      className="w-full rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-2" style={{ color: ACCENT }}>
        Check eligibility
      </p>
      <h3 className="font-display font-extrabold text-xl text-white mb-1">
        Are you eligible for wheeling?
      </h3>
      <p className="font-body text-xs mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Two quick questions to see which wheeling model fits your business.
      </p>

      {step === 'tou' && (
        <div>
          <h4 className="font-display font-extrabold text-base text-white mb-1.5">
            Are you on a Time-of-Use tariff?
          </h4>
          <p className="font-body text-xs mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            A tariff where the unit price changes by time of day — peak, standard and off-peak. Common for larger commercial and industrial supplies.
          </p>
          <div className="flex flex-col gap-3" role="radiogroup">
            {TOU_OPTIONS.map((opt) => {
              const isSel = tou === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={isSel}
                  onClick={() => pickTou(opt.value)}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-all duration-200"
                  style={{
                    border: `1.5px solid ${isSel ? ACCENT : 'rgba(255,255,255,0.14)'}`,
                    background: isSel ? 'rgba(217,124,118,0.10)' : 'rgba(255,255,255,0.04)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: isSel ? ACCENT : 'rgba(217,124,118,0.14)', color: isSel ? '#0d1f22' : ACCENT }}
                  >
                    {opt.icon}
                  </div>
                  <span className="font-display font-bold text-sm" style={{ color: isSel ? ACCENT : '#fff' }}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 'supply' && (
        <div>
          <div className="flex items-start gap-3 mb-4">
            <button
              type="button"
              onClick={() => setStep('tou')}
              aria-label="Back"
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
            >
              <IconArrowLeft size={14} />
            </button>
            <h4 className="font-display font-extrabold text-base text-white">
              Who supplies your electricity?
            </h4>
          </div>
          <select
            value={supplyPointId}
            onChange={(e) => pickSupply(e.target.value)}
            aria-label="Electricity supplier"
            className="w-full rounded-xl px-4 py-3.5 font-body text-sm"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.18)', color: '#fff' }}
          >
            <option value="" disabled style={{ color: '#0d1f22' }}>
              Select your supplier…
            </option>
            {WHEELING_SUPPLY_POINTS.map((sp) => (
              <option key={sp.id} value={sp.id} style={{ color: '#0d1f22' }}>
                {sp.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {step === 'reveal' && outcome && (
        <Reveal outcome={outcome} onBack={() => setStep(tou === 'no' ? 'tou' : 'supply')} onRestart={restart} />
      )}
    </div>
  );
}

function Reveal({
  outcome, onBack, onRestart,
}: {
  outcome: WheelingOutcome;
  onBack: () => void;
  onRestart: () => void;
}) {
  const eligible = outcome.status === 'direct' || outcome.status === 'virtual';
  const modelLabel = outcome.status === 'direct' ? 'Direct Wheeling' : 'Virtual Wheeling';
  const modelAnchor = outcome.status === 'direct' ? 'model-direct' : 'model-virtual';

  return (
    <div
      className="rounded-xl p-5"
      style={{ border: `1px solid ${ACCENT}66`, background: 'rgba(217,124,118,0.06)' }}
      aria-live="polite"
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 font-body text-xs mb-3"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        <IconArrowLeft size={13} /> Back
      </button>

      {eligible ? (
        <>
          <div className="flex items-center justify-center mb-3" style={{ color: ACCENT }}>
            {outcome.status === 'direct' ? <IconZap size={28} /> : <IconGlobe size={28} />}
          </div>
          <p className="font-body text-xs uppercase tracking-[0.12em] text-center mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
            You&apos;re eligible
          </p>
          <h3 className="font-display font-extrabold text-2xl text-center mb-3" style={{ color: ACCENT }}>
            {modelLabel}
          </h3>
          <p className="font-body text-sm text-center leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {outcome.status === 'direct'
              ? 'Because Eskom supplies you directly, we can wheel renewable power to you across the Eskom grid.'
              : `${outcome.supplyPointLabel} supports virtual wheeling — we can wheel renewable power to you and have it netted against your municipal bill.`}
            {outcome.verifyTariff && ' We’ll confirm your tariff type during the quote.'}
          </p>

          <Link
            href={contactHref(
              outcome.status === 'direct'
                ? 'I’d like a wheeling quote. Eskom supplies me directly (Direct Wheeling).'
                : `I’d like a wheeling quote. My supplier is ${outcome.supplyPointLabel} (Virtual Wheeling).`,
            )}
            className="flex items-center justify-center gap-2 w-full rounded-full px-5 py-3 font-display font-bold text-sm mb-2.5"
            style={{ background: ACCENT, color: '#fff' }}
          >
            Get a wheeling quote <IconArrowRight size={14} />
          </Link>

          <button
            type="button"
            onClick={() => window.location.assign(`#${modelAnchor}`)}
            className="flex items-center justify-center gap-1.5 w-full rounded-full px-4 py-2.5 font-display font-bold text-xs"
            style={{ border: `1.5px solid ${ACCENT}66`, color: ACCENT, background: 'rgba(217,124,118,0.06)' }}
          >
            Learn about {modelLabel} <IconArrowRight size={13} />
          </button>
        </>
      ) : (
        <>
          <h3 className="font-display font-extrabold text-xl text-center mb-3 text-white">
            {outcome.status === 'not-eligible-tou' ? 'Let’s get you wheel-ready' : 'Not available in your area yet'}
          </h3>
          <p className="font-body text-sm text-center leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {outcome.status === 'not-eligible-tou'
              ? 'Wheeling needs a Time-of-Use / large-power-user tariff. Two routes can help — optimise your tariff, or generate on-site.'
              : 'Wheeling isn’t live with your supplier yet. On-site solar and storage can cut your costs today.'}
          </p>

          <div className="flex flex-col gap-2.5">
            {outcome.status === 'not-eligible-tou' && (
              <Link
                href="/solutions/energy-optimisation#lever-tariff"
                className="flex items-center justify-center gap-1.5 w-full rounded-full px-5 py-3 font-display font-bold text-sm"
                style={{ background: ACCENT, color: '#fff' }}
              >
                Explore Tariff Optimisation <IconArrowRight size={14} />
              </Link>
            )}
            <Link
              href="/solutions/ci-solar-storage"
              className="flex items-center justify-center gap-1.5 w-full rounded-full px-5 py-3 font-display font-bold text-sm"
              style={
                outcome.status === 'not-eligible-tou'
                  ? { border: `1.5px solid ${ACCENT}66`, color: ACCENT, background: 'rgba(217,124,118,0.06)' }
                  : { background: ACCENT, color: '#fff' }
              }
            >
              Explore C&amp;I Solar &amp; Storage <IconArrowRight size={14} />
            </Link>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="block w-full text-center font-body text-xs mt-4"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        Start over
      </button>
    </div>
  );
}

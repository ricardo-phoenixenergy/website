'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dlPush } from '@/lib/analytics';
import { recommendStrategy } from '@/lib/strategy/recommendStrategy';
import { buildRationale } from '@/lib/strategy/rationale';
import { STRATEGIES } from '@/config/strategies';
import type {
  Goal, EnergyRate, DemandCharge, Usage, StrategyAnswers,
} from '@/lib/strategy/types';

const ACCENT = '#E3C58D';

type Step = 'goal' | 'energyRate' | 'demandCharge' | 'usage' | 'reveal';

interface Option<T> {
  value: T;
  label: string;
  hint?: string;
}

const GOAL_OPTIONS: Option<Goal>[] = [
  { value: 'cut-bill', label: '💰 Cut my electricity bill', hint: 'Lowest running cost is the priority.' },
  { value: 'backup', label: '🔋 Reliable backup', hint: 'Stay running through loadshedding and outages.' },
  { value: 'independence', label: '🔌 Energy independence', hint: 'Reduce or remove reliance on the grid entirely.' },
];

const ENERGY_OPTIONS: Option<EnergyRate>[] = [
  { value: 'flat', label: 'Flat rate, all year', hint: 'The same price per unit (c/kWh) at all times.' },
  { value: 'tou', label: 'Time-of-Use', hint: 'Price changes by time: peak, standard & off-peak.' },
  { value: 'block', label: 'Block / tiered', hint: 'Price per unit rises the more you use in a month.' },
  { value: 'unknown', label: "I don't know", hint: "No problem — we'll work it out together." },
];

const DEMAND_OPTIONS: Option<DemandCharge>[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: "I don't know" },
];

const USAGE_OPTIONS: Option<Usage>[] = [
  { value: 'daytime', label: '☀️ Mostly daytime', hint: 'Office or factory, roughly 8am–5pm.' },
  { value: 'around-clock', label: '🔁 Round the clock', hint: '24/7 operations, cold storage, plant.' },
  { value: 'evenings', label: '🌙 Evenings & nights', hint: 'Retail, hospitality, security.' },
];

function stepsFor(goal: Goal | null): Step[] {
  if (goal === 'backup' || goal === 'independence') return ['goal', 'usage', 'reveal'];
  if (goal === 'cut-bill') return ['goal', 'energyRate', 'demandCharge', 'usage', 'reveal'];
  return ['goal'];
}

function OptionList<T extends string>({
  options, selected, onSelect,
}: {
  options: Option<T>[];
  selected: T | undefined;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5" role="radiogroup">
      {options.map((opt) => {
        const isSel = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSel}
            onClick={() => onSelect(opt.value)}
            className="text-left rounded-xl px-4 py-3 transition-all duration-150"
            style={{
              border: `1px solid ${isSel ? ACCENT : 'rgba(255,255,255,0.14)'}`,
              background: isSel ? 'rgba(227,197,141,0.10)' : 'rgba(255,255,255,0.05)',
            }}
          >
            <span className="block font-body text-sm font-bold text-white">{opt.label}</span>
            {opt.hint && (
              <span className="block font-body text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {opt.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface StrategyFinderProps {
  vertical: string;
}

export function StrategyFinder({ vertical }: StrategyFinderProps) {
  const [answers, setAnswers] = useState<Partial<StrategyAnswers>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const steps = stepsFor(answers.goal ?? null);
  const current = steps[stepIndex];

  function advance() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function pickGoal(goal: Goal) {
    if (!started) {
      setStarted(true);
      dlPush({ event: 'strategy_finder_start', vertical });
    }
    // Changing goal resets downstream answers (the branch may change).
    setAnswers({ goal });
    setStepIndex(1);
  }

  function pickEnergy(energyRate: EnergyRate) {
    setAnswers((a) => ({ ...a, energyRate }));
    advance();
  }

  function pickDemand(demandCharge: DemandCharge) {
    setAnswers((a) => ({ ...a, demandCharge }));
    advance();
  }

  function pickUsage(usage: Usage) {
    setAnswers((a) => ({ ...a, usage }));
    advance();
  }

  const total = steps.length - 1; // exclude reveal from the progress count
  const progress = current === 'reveal' ? total : stepIndex;

  const isComplete = current === 'reveal' && answers.goal && answers.usage;
  const result = isComplete ? recommendStrategy(answers as StrategyAnswers) : null;

  // Fire the completion event when we land on the reveal step.
  useEffect(() => {
    if (current !== 'reveal' || !answers.goal || !answers.usage) return;
    const r = recommendStrategy(answers as StrategyAnswers);
    dlPush({
      event: 'strategy_finder_complete',
      vertical,
      goal: answers.goal,
      energy_rate: answers.energyRate ?? 'n/a',
      demand_charge: answers.demandCharge ?? 'n/a',
      usage: answers.usage,
      strategy: r.primary,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function onLearnMore(anchor: string, strategy: string) {
    dlPush({ event: 'strategy_learn_more', vertical, strategy });
    window.location.hash = anchor;
  }

  function restart() {
    setAnswers({});
    setStepIndex(0);
    setStarted(false);
  }

  return (
    <div
      id="strategy-finder"
      className="w-full rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
        <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-2" style={{ color: ACCENT }}>
          Find my strategy
        </p>
        <h3 className="font-display font-extrabold text-xl text-white mb-1">
          Which approach fits you?
        </h3>
        <p className="font-body text-xs mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
          A few quick questions — no bill needed. We&apos;ll point you to the strategy that suits you best.
        </p>

        {/* Progress bar */}
        {current !== 'reveal' && (
          <div className="flex gap-1.5 mb-6">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{ background: i <= progress ? ACCENT : 'rgba(255,255,255,0.14)' }}
              />
            ))}
          </div>
        )}

        {/* Steps */}
        {current === 'goal' && (
          <Question title="What matters most to you?">
            <OptionList options={GOAL_OPTIONS} selected={answers.goal} onSelect={pickGoal} />
          </Question>
        )}

        {current === 'energyRate' && (
          <Question title="How are you billed for the energy you use?" onBack={back}>
            <OptionList options={ENERGY_OPTIONS} selected={answers.energyRate} onSelect={pickEnergy} />
          </Question>
        )}

        {current === 'demandCharge' && (
          <Question
            title="Do you pay a demand (kVA) charge?"
            caption='A separate line billed on your highest power draw — often labelled "demand", "kVA" or "maximum demand".'
            onBack={back}
          >
            <OptionList options={DEMAND_OPTIONS} selected={answers.demandCharge} onSelect={pickDemand} />
          </Question>
        )}

        {current === 'usage' && (
          <Question title="When does your business use the most power?" onBack={back}>
            <OptionList options={USAGE_OPTIONS} selected={answers.usage} onSelect={pickUsage} />
          </Question>
        )}

        {/* Reveal */}
        {current === 'reveal' && result && (
          <div
            className="rounded-xl p-5"
            style={{ border: `1px solid ${ACCENT}66`, background: 'rgba(227,197,141,0.06)' }}
            aria-live="polite"
          >
            <button
              type="button"
              onClick={back}
              className="font-body text-xs mb-3"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              ← Back
            </button>
            <p className="font-body text-xs uppercase tracking-[0.12em] text-center mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Your recommended strategy
            </p>
            <p className="text-3xl text-center mb-2">
              {result.topology === 'off-grid' ? '🔌' : result.topology === 'solar-only' ? '☀️' : '☀️ + 🔋'}
            </p>
            <h3 className="font-display font-extrabold text-2xl text-center mb-3" style={{ color: ACCENT }}>
              {STRATEGIES[result.primary].label}
              {result.secondary.map((s) => ` & ${STRATEGIES[s].label}`).join('')}
            </h3>
            <p className="font-body text-sm text-center leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {buildRationale(answers as StrategyAnswers, result)}
            </p>

            <button
              type="button"
              onClick={() => onLearnMore(result.tabAnchor, result.primary)}
              className="block w-full rounded-full py-3 font-display font-bold text-sm mb-2"
              style={{ background: ACCENT, color: '#3a2c08' }}
            >
              Read about {STRATEGIES[result.primary].label} →
            </button>

            {result.secondary.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onLearnMore(`strategy-${s}`, s)}
                className="block w-full text-center font-body text-xs underline mb-2"
                style={{ color: ACCENT }}
              >
                Also relevant: {STRATEGIES[s].label} →
              </button>
            ))}

            <Link
              href={`/contact?intent=client&strategy=${result.primary}`}
              className="block w-full rounded-full py-3 font-display font-bold text-sm text-center mt-3"
              style={{ background: '#F5F5F5', color: '#0d1f22' }}
            >
              Get my free assessment →
            </Link>

            <button
              type="button"
              onClick={restart}
              className="block w-full text-center font-body text-xs mt-4"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              ↺ Start over
            </button>
          </div>
        )}
    </div>
  );
}

function Question({
  title, caption, onBack, children,
}: {
  title: string;
  caption?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
          >
            ←
          </button>
        )}
        <h3 className="font-display font-extrabold text-xl text-white">{title}</h3>
      </div>
      {caption && (
        <p className="font-body text-xs mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {caption}
        </p>
      )}
      {children}
    </div>
  );
}

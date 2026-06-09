'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dlPush } from '@/lib/analytics';
import { recommendStrategy } from '@/lib/strategy/recommendStrategy';
import { buildRationale } from '@/lib/strategy/rationale';
import { STRATEGIES } from '@/config/strategies';
import {
  IconDollarSign, IconZap, IconGlobe, IconMinus, IconClock, IconLayers,
  IconHelpCircle, IconCheck, IconX, IconSun, IconMoon, IconBattery,
  IconArrowLeft, IconArrowRight,
} from '@/components/ui/Icons';
import type {
  Goal, EnergyRate, DemandCharge, Usage, StrategyAnswers,
} from '@/lib/strategy/types';

const ACCENT = '#E3C58D';
const ICON = 18;

type Step = 'goal' | 'energyRate' | 'demandCharge' | 'usage' | 'reveal';

interface Option<T> {
  value: T;
  label: string;
  hint?: string;
  icon: React.ReactNode;
}

const GOAL_OPTIONS: Option<Goal>[] = [
  { value: 'cut-bill', label: 'Cut my electricity bill', hint: 'Lowest running cost is the priority.', icon: <IconDollarSign size={ICON} /> },
  { value: 'backup', label: 'Reliable backup', hint: 'Stay running through loadshedding and outages.', icon: <IconZap size={ICON} /> },
  { value: 'independence', label: 'Energy independence', hint: 'Reduce or remove reliance on the grid entirely.', icon: <IconGlobe size={ICON} /> },
];

const ENERGY_OPTIONS: Option<EnergyRate>[] = [
  { value: 'flat', label: 'Flat rate, all year', hint: 'The same price per unit (c/kWh) at all times.', icon: <IconMinus size={ICON} /> },
  { value: 'tou', label: 'Time-of-Use', hint: 'Price changes by time: peak, standard & off-peak.', icon: <IconClock size={ICON} /> },
  { value: 'block', label: 'Block / tiered', hint: 'Price per unit rises the more you use in a month.', icon: <IconLayers size={ICON} /> },
  { value: 'unknown', label: "I don't know", hint: "No problem — we'll work it out together.", icon: <IconHelpCircle size={ICON} /> },
];

const DEMAND_OPTIONS: Option<DemandCharge>[] = [
  { value: 'yes', label: 'Yes', icon: <IconCheck size={ICON} /> },
  { value: 'no', label: 'No', icon: <IconX size={ICON} /> },
  { value: 'unknown', label: "I don't know", icon: <IconHelpCircle size={ICON} /> },
];

const USAGE_OPTIONS: Option<Usage>[] = [
  { value: 'daytime', label: 'Mostly daytime', hint: 'Office or factory, roughly 8am–5pm.', icon: <IconSun size={ICON} /> },
  { value: 'around-clock', label: 'Round the clock', hint: '24/7 operations, cold storage, plant.', icon: <IconClock size={ICON} /> },
  { value: 'evenings', label: 'Evenings & nights', hint: 'Retail, hospitality, security.', icon: <IconMoon size={ICON} /> },
];

function stepsFor(goal: Goal | null): Step[] {
  // Backup / independence don't depend on tariff or usage — jump straight to the reveal.
  if (goal === 'backup' || goal === 'independence') return ['goal', 'reveal'];
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
    <div className="flex flex-col gap-3" role="radiogroup">
      {options.map((opt) => {
        const isSel = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSel}
            onClick={() => onSelect(opt.value)}
            className="flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-all duration-200"
            style={{
              border: `1.5px solid ${isSel ? ACCENT : 'rgba(255,255,255,0.14)'}`,
              background: isSel ? 'rgba(227,197,141,0.10)' : 'rgba(255,255,255,0.04)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
              style={{
                background: isSel ? ACCENT : 'rgba(227,197,141,0.14)',
                color: isSel ? '#0d1f22' : ACCENT,
              }}
            >
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="font-display font-bold text-sm leading-tight"
                style={{ color: isSel ? ACCENT : '#fff' }}
              >
                {opt.label}
              </p>
              {opt.hint && (
                <p className="font-body text-xs mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {opt.hint}
                </p>
              )}
            </div>
            <div
              className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200"
              style={{
                background: isSel ? ACCENT : 'transparent',
                border: `2px solid ${isSel ? ACCENT : 'rgba(255,255,255,0.25)'}`,
                color: '#0d1f22',
              }}
            >
              {isSel && <IconCheck size={12} />}
            </div>
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

  // Cut-bill needs the full set; backup/independence are complete with just the goal.
  const ready =
    !!answers.goal &&
    (answers.goal !== 'cut-bill' || (!!answers.energyRate && !!answers.demandCharge && !!answers.usage));
  const isComplete = current === 'reveal' && ready;
  const result = isComplete ? recommendStrategy(answers as StrategyAnswers) : null;

  // Fire the completion event when we land on the reveal step.
  useEffect(() => {
    if (current !== 'reveal' || !ready) return;
    const r = recommendStrategy(answers as StrategyAnswers);
    dlPush({
      event: 'strategy_finder_complete',
      vertical,
      goal: answers.goal ?? '',
      energy_rate: answers.energyRate ?? 'n/a',
      demand_charge: answers.demandCharge ?? 'n/a',
      usage: answers.usage ?? 'n/a',
      strategy: r.primary,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function onLearnMore(anchor: string, strategy: string) {
    dlPush({ event: 'strategy_learn_more', vertical, strategy });
    // Hash navigation (fires `hashchange`, which SolutionTabs listens for to open + scroll).
    window.location.assign(`#${anchor}`);
  }

  function restart() {
    setAnswers({});
    setStepIndex(0);
    setStarted(false);
  }

  return (
    <div
      id="strategy-finder"
      className="w-full rounded-2xl p-6 lg:h-[480px] lg:overflow-y-auto"
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

        {/* Progress bar (only on the multi-step cut-bill path) */}
        {current !== 'reveal' && total > 1 && (
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
              className="inline-flex items-center gap-1 font-body text-xs mb-3"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <IconArrowLeft size={13} /> Back
            </button>
            <p className="font-body text-xs uppercase tracking-[0.12em] text-center mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Your recommended strategy
            </p>
            <div className="flex items-center justify-center gap-2 mb-3" style={{ color: ACCENT }}>
              {result.topology === 'off-grid' ? (
                <IconGlobe size={28} />
              ) : result.topology === 'solar-only' ? (
                <IconSun size={28} />
              ) : (
                <>
                  <IconSun size={26} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>+</span>
                  <IconBattery size={26} />
                </>
              )}
            </div>
            <h3 className="font-display font-extrabold text-2xl text-center mb-3" style={{ color: ACCENT }}>
              {STRATEGIES[result.primary].label}
              {result.secondary.map((s) => ` & ${STRATEGIES[s].label}`).join('')}
            </h3>
            <p className="font-body text-sm text-center leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {buildRationale(answers as StrategyAnswers, result)}
            </p>

            {[result.primary, ...result.secondary].map((s, idx) => (
              <button
                key={s}
                type="button"
                onClick={() => onLearnMore(`strategy-${s}`, s)}
                className="flex w-full items-center justify-center gap-2 rounded-full py-3 font-display font-bold text-sm mb-2"
                style={
                  idx === 0
                    ? { background: ACCENT, color: '#3a2c08' }
                    : { background: 'transparent', color: ACCENT, border: `1.5px solid ${ACCENT}66` }
                }
              >
                Read about {STRATEGIES[s].label}
                <IconArrowRight size={15} />
              </button>
            ))}

            <Link
              href={`/contact?intent=client&strategy=${result.primary}`}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 font-display font-bold text-sm text-center mt-3"
              style={{ background: '#F5F5F5', color: '#0d1f22' }}
            >
              Get my free assessment
              <IconArrowRight size={15} />
            </Link>

            <button
              type="button"
              onClick={restart}
              className="block w-full text-center font-body text-xs mt-4"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Start over
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
            <IconArrowLeft size={14} />
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

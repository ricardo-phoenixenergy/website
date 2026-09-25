'use client';

import { useState, useEffect, useId, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { TextButton } from '@/components/ui/TextButton';
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
import { SOLUTION_META } from '@/types/solutions';

const ACCENT = SOLUTION_META['ci-solar-storage'].accent;
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
  { value: 'backup', label: 'Reliable backup', hint: 'Stay running through load-shedding and outages.', icon: <IconZap size={ICON} /> },
  { value: 'independence', label: 'Energy independence', hint: 'Reduce or remove reliance on the grid entirely.', icon: <IconGlobe size={ICON} /> },
];

const ENERGY_OPTIONS: Option<EnergyRate>[] = [
  { value: 'flat', label: 'Flat rate, all year', hint: 'The same price per unit (c/kWh) at all times.', icon: <IconMinus size={ICON} /> },
  { value: 'tou', label: 'Time-of-Use', hint: 'Price changes by time: peak, standard & off-peak.', icon: <IconClock size={ICON} /> },
  { value: 'block', label: 'Block / tiered', hint: 'Price per unit rises the more you use in a month.', icon: <IconLayers size={ICON} /> },
  { value: 'unknown', label: "I don't know", hint: "No problem. We'll work it out together.", icon: <IconHelpCircle size={ICON} /> },
];

const DEMAND_OPTIONS: Option<DemandCharge>[] = [
  { value: 'yes', label: 'Yes', icon: <IconCheck size={ICON} /> },
  { value: 'no', label: 'No', icon: <IconX size={ICON} /> },
  { value: 'unknown', label: "I don't know", icon: <IconHelpCircle size={ICON} /> },
];

const USAGE_OPTIONS: Option<Usage>[] = [
  { value: 'daytime', label: 'Mostly daytime', hint: 'Office or factory, roughly 8am to 5pm.', icon: <IconSun size={ICON} /> },
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
  options, selected, onSelect, labelledBy,
}: {
  options: Option<T>[];
  selected: T | undefined;
  onSelect: (v: T) => void;
  labelledBy: string;
}) {
  // Plain buttons, not radios: choosing an option moves straight to the next
  // question, so arrow keys must not change the answer.
  return (
    <div className="flex flex-col gap-3" role="group" aria-labelledby={labelledBy}>
      {options.map((opt) => {
        const isSel = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className="flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-all duration-200"
            style={{
              border: `1.5px solid ${isSel ? ACCENT : 'rgba(255,255,255,0.14)'}`,
              background: isSel ? 'rgba(227,197,141,0.10)' : 'rgba(255,255,255,0.04)',
            }}
          >
            <span
              aria-hidden="true"
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
              style={{
                background: isSel ? ACCENT : 'rgba(227,197,141,0.14)',
                color: isSel ? 'var(--color-pe-nav-dark)' : ACCENT,
              }}
            >
              {opt.icon}
            </span>
            <span className="flex-1 min-w-0">
              <span
                className="block font-display font-bold text-sm leading-tight"
                style={{ color: isSel ? ACCENT : '#fff' }}
              >
                {opt.label}
              </span>
              {opt.hint && (
                <span className="block font-body text-xs mt-0.5 leading-snug" style={{ color: 'var(--color-on-dark-muted)' }}>
                  {opt.hint}
                </span>
              )}
            </span>
            <span
              aria-hidden="true"
              className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200"
              style={{
                background: isSel ? ACCENT : 'transparent',
                border: `2px solid ${isSel ? ACCENT : 'rgba(255,255,255,0.25)'}`,
                color: 'var(--color-pe-nav-dark)',
              }}
            >
              {isSel && <IconCheck size={12} />}
            </span>
            {isSel && <span className="sr-only">(your current answer)</span>}
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
  const uid = useId();
  const headingId = `${uid}-question`;
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Set by every step change the visitor makes; the new step's heading then
  // takes focus so keyboard and screen reader users know the question changed.
  const moveFocusRef = useRef(false);

  const steps = stepsFor(answers.goal ?? null);
  const current = steps[stepIndex];

  useEffect(() => {
    if (!moveFocusRef.current) return;
    moveFocusRef.current = false;
    headingRef.current?.focus();
  }, [current]);

  function advance() {
    moveFocusRef.current = true;
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    moveFocusRef.current = true;
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function pickGoal(goal: Goal) {
    if (!started) {
      setStarted(true);
      dlPush({ event: 'strategy_finder_start', vertical });
    }
    // Changing goal resets downstream answers (the branch may change).
    moveFocusRef.current = true;
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
    moveFocusRef.current = true;
    setAnswers({});
    setStepIndex(0);
    setStarted(false);
  }

  return (
    <div
      id="strategy-finder"
      // 55% Night Teal, like the other hero tools, so text contrast doesn't depend on the hero photo.
      className="w-full rounded-2xl p-6 bg-pe-nav-dark/55"
      style={{ border: '1px solid rgba(255,255,255,0.10)' }}
    >
        <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-2" style={{ color: ACCENT }}>
          Find my strategy
        </p>
        <h2 className="font-display font-extrabold text-xl text-white mb-1">
          Which approach fits you?
        </h2>
        {/* On the hero photo, on-dark-muted keeps small text at 4.5:1 or more; 60% white fell to 4.2:1. */}
        <p className="font-body text-xs mb-5" style={{ color: 'var(--color-on-dark-muted)' }}>
          A few quick questions, and you won&apos;t need a bill. We&apos;ll point you to the strategy that suits you best.
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
          <Question id={headingId} headingRef={headingRef} title="What matters most to you?">
            <OptionList options={GOAL_OPTIONS} selected={answers.goal} onSelect={pickGoal} labelledBy={headingId} />
          </Question>
        )}

        {current === 'energyRate' && (
          <Question id={headingId} headingRef={headingRef} title="How are you billed for the energy you use?" onBack={back}>
            <OptionList options={ENERGY_OPTIONS} selected={answers.energyRate} onSelect={pickEnergy} labelledBy={headingId} />
          </Question>
        )}

        {current === 'demandCharge' && (
          <Question
            id={headingId}
            headingRef={headingRef}
            title="Do you pay a demand (kVA) charge?"
            caption={`A separate line billed on your highest power draw. It's often labelled "demand", "kVA" or "maximum demand".`}
            onBack={back}
          >
            <OptionList options={DEMAND_OPTIONS} selected={answers.demandCharge} onSelect={pickDemand} labelledBy={headingId} />
          </Question>
        )}

        {current === 'usage' && (
          <Question id={headingId} headingRef={headingRef} title="When does your business use the most power?" onBack={back}>
            <OptionList options={USAGE_OPTIONS} selected={answers.usage} onSelect={pickUsage} labelledBy={headingId} />
          </Question>
        )}

        {/* Reveal */}
        {current === 'reveal' && result && (
          <div
            className="rounded-xl p-5"
            style={{ border: `1px solid ${ACCENT}66`, background: 'rgba(227,197,141,0.06)' }}
          >
            {/* The same back control as the questions', in the same corner */}
            <IconButton variant="ghost" label="Back to the previous question" onClick={back} className="mb-3">
              <IconArrowLeft />
            </IconButton>
            <p aria-hidden="true" className="font-body text-xs uppercase tracking-[0.12em] text-center mb-3" style={{ color: 'var(--color-on-dark-subtle)' }}>
              Your recommended strategy
            </p>
            <div aria-hidden="true" className="flex items-center justify-center gap-2 mb-3" style={{ color: ACCENT }}>
              {result.topology === 'off-grid' ? (
                <IconGlobe size={28} />
              ) : result.topology === 'solar-only' ? (
                <IconSun size={28} />
              ) : (
                <>
                  <IconSun size={26} />
                  <span className="text-sm" style={{ color: 'var(--color-on-dark-subtle)' }}>+</span>
                  <IconBattery size={26} />
                </>
              )}
            </div>
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="font-display font-extrabold text-2xl text-center mb-3 focus:outline-none"
              style={{ color: ACCENT }}
            >
              <span className="sr-only">Your recommended strategy: </span>
              {STRATEGIES[result.primary].label}
              {result.secondary.map((s) => ` & ${STRATEGIES[s].label}`).join('')}
            </h3>
            <p className="font-body text-sm text-center leading-relaxed mb-6" style={{ color: 'var(--color-on-dark-muted)' }}>
              {buildRationale(answers as StrategyAnswers, result)}
            </p>

            {/* The next step, carrying the answer into the contact form */}
            <Button
              variant="accent"
              vertical="ci-solar-storage"
              href={`/contact?intent=client&strategy=${result.primary}&source=finder`}
              onClick={() => dlPush({ event: 'cta_click', cta_label: 'Book a discovery meeting about this', cta_location: `strategy_finder_result:${result.primary}` })}
              className="mb-6 w-full"
            >
              Book a discovery meeting about this <IconArrowRight />
            </Button>

            {/* Learn-more buttons: compact and auto-width, so they don't compete with the CTA */}
            <p
              className="font-body text-xs uppercase tracking-[0.12em] text-center mb-2.5"
              style={{ color: 'var(--color-on-dark-subtle)' }}
            >
              Learn more
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {[result.primary, ...result.secondary].map((s) => (
                <Button
                  key={s}
                  variant="ghost"
                  vertical="ci-solar-storage"
                  size="compact"
                  onClick={() => onLearnMore(`strategy-${s}`, s)}
                >
                  {STRATEGIES[s].label}
                  <IconArrowRight />
                </Button>
              ))}
            </div>

            {/* The 44px target reaches 14px past the text each way; the margins keep the text where it sat. */}
            <TextButton onClick={restart} className="flex w-full -mt-3.5 -mb-3.5">
              Start over
            </TextButton>
          </div>
        )}
    </div>
  );
}

function Question({
  id, headingRef, title, caption, onBack, children,
}: {
  id: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  title: string;
  caption?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-4">
        {/* Centred on the heading's first line (28px); the margins keep the row that tall. */}
        {onBack && (
          <IconButton variant="ghost" label="Back to the previous question" onClick={onBack} className="-my-2">
            <IconArrowLeft />
          </IconButton>
        )}
        <h3
          ref={headingRef}
          id={id}
          tabIndex={-1}
          className="font-display font-extrabold text-xl text-white focus:outline-none"
        >
          {title}
        </h3>
      </div>
      {caption && (
        <p className="font-body text-xs mb-4 leading-relaxed" style={{ color: 'var(--color-on-dark-subtle)' }}>
          {caption}
        </p>
      )}
      {children}
    </div>
  );
}

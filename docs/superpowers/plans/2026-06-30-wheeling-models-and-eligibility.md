# Wheeling Models + Eligibility Estimator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the Wheeling page into three model tabs (Direct / Virtual / Micro) and replace the bill-slider calculator with a two-question eligibility estimator that routes visitors to the right model — or to an alternative solution.

**Architecture:** Mirror the tested `strategy/` pattern — a static supply-point config, a pure unit-tested `evaluateWheeling` function, and a `'use client'` `WheelingEligibility` wizard (same dark-card visual language as `StrategyFinder`). The page swaps the calculator for the estimator, replaces its tabs, and deep-links results into the model tabs via the existing `SolutionTabs` `hashchange` mechanism.

**Tech Stack:** Next.js App Router, TypeScript (strict), Tailwind (arbitrary hex tokens), Vitest.

## Global Constraints

- TypeScript strict — no `any`. Named exports only (no default exports from component/lib files).
- Tailwind arbitrary hex tokens are the house convention (`text-[#1A1A1A]`, `bg-[#F5F5F5]`).
- Wheeling accent (coral) is `#D97C76`; on-card ink for accent fills is `#fff`. Dark hero card chrome: `bg rgba(255,255,255,0.06)`, `border rgba(255,255,255,0.10)`.
- Test runner is Vitest (`npx vitest run <file>`). Pure logic is TDD'd; client components are verified by `tsc`/`lint`/`build` (no component-test harness — consistent with `StrategyFinder`/calculators).
- Supported metros (Virtual Wheeling): Johannesburg, Cape Town, Tshwane, Ekurhuleni, eThekwini, Nelson Mandela Bay. Eskom direct → Direct Wheeling. Other → not-available.
- ToU gate: `no` → not-eligible-tou (short-circuits); `unsure` → proceed with `verifyTariff: true`.
- Commit messages end with: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

### Task 1: Supply-point config + pure eligibility evaluator (TDD)

**Files:**
- Create: `src/config/wheelingSupplyPoints.ts`
- Create: `src/lib/wheeling/types.ts`
- Create: `src/lib/wheeling/eligibility.ts`
- Test: `src/lib/wheeling/eligibility.test.ts`

**Interfaces:**
- Produces:
  - `WheelingModel = 'direct' | 'virtual' | 'none'`
  - `WheelingSupplyPoint { id: string; label: string; model: WheelingModel }`
  - `WHEELING_SUPPLY_POINTS: WheelingSupplyPoint[]`, `supplyPointById(id: string): WheelingSupplyPoint | undefined`
  - `WheelingTou = 'yes' | 'no' | 'unsure'`
  - `WheelingStatus = 'direct' | 'virtual' | 'not-available' | 'not-eligible-tou'`
  - `WheelingAnswers { tou: WheelingTou; supplyPointId?: string }`
  - `WheelingOutcome { status: WheelingStatus; supplyPointLabel?: string; verifyTariff: boolean }`
  - `evaluateWheeling(a: WheelingAnswers): WheelingOutcome`

- [ ] **Step 1: Create the supply-point config**

`src/config/wheelingSupplyPoints.ts`:
```ts
export type WheelingModel = 'direct' | 'virtual' | 'none';

export interface WheelingSupplyPoint {
  id: string;
  label: string;
  model: WheelingModel;
}

export const WHEELING_SUPPLY_POINTS: WheelingSupplyPoint[] = [
  { id: 'eskom',      label: 'Eskom (direct)',                model: 'direct'  },
  { id: 'joburg',     label: 'City of Johannesburg',          model: 'virtual' },
  { id: 'cape-town',  label: 'City of Cape Town',             model: 'virtual' },
  { id: 'tshwane',    label: 'City of Tshwane',               model: 'virtual' },
  { id: 'ekurhuleni', label: 'City of Ekurhuleni',            model: 'virtual' },
  { id: 'ethekwini',  label: 'eThekwini (Durban)',            model: 'virtual' },
  { id: 'nmb',        label: 'Nelson Mandela Bay (Gqeberha)', model: 'virtual' },
  { id: 'other',      label: "My area isn't listed / other",  model: 'none'    },
];

export function supplyPointById(id: string): WheelingSupplyPoint | undefined {
  return WHEELING_SUPPLY_POINTS.find((s) => s.id === id);
}
```

- [ ] **Step 2: Create the types**

`src/lib/wheeling/types.ts`:
```ts
export type WheelingTou = 'yes' | 'no' | 'unsure';

export type WheelingStatus = 'direct' | 'virtual' | 'not-available' | 'not-eligible-tou';

export interface WheelingAnswers {
  tou: WheelingTou;
  supplyPointId?: string; // absent when tou === 'no' (gate short-circuits)
}

export interface WheelingOutcome {
  status: WheelingStatus;
  supplyPointLabel?: string; // present for 'virtual' — the metro name
  verifyTariff: boolean;     // true when tou === 'unsure'
}
```

- [ ] **Step 3: Write the failing test**

`src/lib/wheeling/eligibility.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { evaluateWheeling } from './eligibility';

describe('evaluateWheeling — ToU gate', () => {
  it('tou=no short-circuits to not-eligible-tou (supply point ignored)', () => {
    const r = evaluateWheeling({ tou: 'no', supplyPointId: 'eskom' });
    expect(r.status).toBe('not-eligible-tou');
    expect(r.verifyTariff).toBe(false);
  });
});

describe('evaluateWheeling — supply-point routing', () => {
  it('eskom → direct', () => {
    const r = evaluateWheeling({ tou: 'yes', supplyPointId: 'eskom' });
    expect(r.status).toBe('direct');
    expect(r.verifyTariff).toBe(false);
  });

  it('each supported metro → virtual with its label', () => {
    for (const id of ['joburg', 'cape-town', 'tshwane', 'ekurhuleni', 'ethekwini', 'nmb']) {
      const r = evaluateWheeling({ tou: 'yes', supplyPointId: id });
      expect(r.status).toBe('virtual');
      expect(r.supplyPointLabel).toBeTruthy();
    }
  });

  it('other → not-available', () => {
    expect(evaluateWheeling({ tou: 'yes', supplyPointId: 'other' }).status).toBe('not-available');
  });

  it('missing/unknown supply point → not-available', () => {
    expect(evaluateWheeling({ tou: 'yes' }).status).toBe('not-available');
    expect(evaluateWheeling({ tou: 'yes', supplyPointId: 'nope' }).status).toBe('not-available');
  });
});

describe('evaluateWheeling — unsure tariff', () => {
  it('tou=unsure sets verifyTariff on direct', () => {
    const r = evaluateWheeling({ tou: 'unsure', supplyPointId: 'eskom' });
    expect(r.status).toBe('direct');
    expect(r.verifyTariff).toBe(true);
  });

  it('tou=unsure sets verifyTariff on virtual', () => {
    const r = evaluateWheeling({ tou: 'unsure', supplyPointId: 'joburg' });
    expect(r.status).toBe('virtual');
    expect(r.verifyTariff).toBe(true);
  });

  it('tou=unsure + other → not-available', () => {
    expect(evaluateWheeling({ tou: 'unsure', supplyPointId: 'other' }).status).toBe('not-available');
  });
});
```

- [ ] **Step 4: Run the test, verify it fails**

Run: `npx vitest run src/lib/wheeling/eligibility.test.ts`
Expected: FAIL — cannot resolve `./eligibility` (module not found).

- [ ] **Step 5: Implement the evaluator**

`src/lib/wheeling/eligibility.ts`:
```ts
import { supplyPointById } from '@/config/wheelingSupplyPoints';
import type { WheelingAnswers, WheelingOutcome } from './types';

export function evaluateWheeling(answers: WheelingAnswers): WheelingOutcome {
  // ToU gate: 'no' short-circuits regardless of supply point.
  if (answers.tou === 'no') {
    return { status: 'not-eligible-tou', verifyTariff: false };
  }

  const verifyTariff = answers.tou === 'unsure';
  const sp = answers.supplyPointId ? supplyPointById(answers.supplyPointId) : undefined;

  if (!sp || sp.model === 'none') {
    return { status: 'not-available', verifyTariff };
  }
  if (sp.model === 'direct') {
    return { status: 'direct', verifyTariff };
  }
  return { status: 'virtual', supplyPointLabel: sp.label, verifyTariff };
}
```

- [ ] **Step 6: Run the test, verify it passes**

Run: `npx vitest run src/lib/wheeling/eligibility.test.ts`
Expected: PASS (all cases).

- [ ] **Step 7: Commit**

```bash
git add src/config/wheelingSupplyPoints.ts src/lib/wheeling/
git commit -m "feat(wheeling): supply-point config + pure eligibility evaluator" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Analytics events + WheelingEligibility wizard

**Files:**
- Modify: `src/lib/analytics.ts` (extend the `DlEvent` union)
- Create: `src/components/sections/WheelingEligibility.tsx`

**Interfaces:**
- Consumes: `evaluateWheeling`, `WheelingTou`, `WheelingOutcome` (Task 1); `WHEELING_SUPPLY_POINTS` (Task 1); `dlPush` (analytics); `IconCheck, IconX, IconHelpCircle, IconArrowLeft, IconArrowRight, IconZap, IconGlobe` from `@/components/ui/Icons`.
- Produces: `WheelingEligibility` (named export, no props) — rendered in the hero's `children` slot.

- [ ] **Step 1: Extend the analytics event union**

In `src/lib/analytics.ts`, add two variants to the `DlEvent` union (after the `strategy_learn_more` line):
```ts
  | { event: 'wheeling_eligibility_start';    vertical: string }
  | { event: 'wheeling_eligibility_complete'; vertical: string; tou: string; supply_point: string; status: string }
```

- [ ] **Step 2: Create the WheelingEligibility component**

`src/components/sections/WheelingEligibility.tsx`:
```tsx
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
```

- [ ] **Step 3: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: no errors.
Run: `npm run lint`
Expected: no NEW errors in `WheelingEligibility.tsx` or `analytics.ts` (pre-existing warnings elsewhere are fine).

- [ ] **Step 4: Commit**

```bash
git add src/lib/analytics.ts src/components/sections/WheelingEligibility.tsx
git commit -m "feat(wheeling): eligibility estimator wizard + analytics events" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Wire the Wheeling page (3 models + estimator) and deep-link target

**Files:**
- Modify: `src/app/solutions/wheeling/page.tsx`
- Modify: `src/app/solutions/energy-optimisation/page.tsx` (add `key: 'lever-tariff'` to the Tariff Optimisation tab)
- Delete: `src/components/sections/calculators/WheelingCalculator.tsx`

**Interfaces:**
- Consumes: `WheelingEligibility` (Task 2). `SolutionTabs` deep-links via tab `key` + `hashchange` (existing).

- [ ] **Step 1: Add the deep-link key to the Energy Optimisation Tariff tab**

In `src/app/solutions/energy-optimisation/page.tsx`, the Tariff Optimisation tab object (the one with `title: 'Stop overpaying for electricity.'`) — add a `key` as its first property:
```ts
  {
    key: 'lever-tariff',
    label: 'Tariff Optimisation',
    icon: 'DollarSign',
```
(Leave everything else in that object unchanged.)

- [ ] **Step 2: Swap the hero widget and import in the Wheeling page**

In `src/app/solutions/wheeling/page.tsx`:
- Replace the import line
  `import { WheelingCalculator } from '@/components/sections/calculators/WheelingCalculator';`
  with
  `import { WheelingEligibility } from '@/components/sections/WheelingEligibility';`
- In the hero, replace `<WheelingCalculator />` with `<WheelingEligibility />`.
- Replace the hero `subtitle` value with:
  `Buy renewable energy directly from independent generators and wheel it to your site across the grid — no panels, no capital. Check whether your business qualifies in two questions.`

- [ ] **Step 3: Replace the `tabs` array with the three models**

In `src/app/solutions/wheeling/page.tsx`, replace the entire `const tabs: TabItem[] = [ … ];` block with:
```ts
const tabs: TabItem[] = [
  {
    key: 'model-direct',
    label: 'Direct Wheeling',
    icon: 'Zap',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Direct Wheeling',
    body: 'If Eskom supplies your business directly, we connect you to an independent renewable generator and wheel that power to you across the Eskom transmission grid. You pay a fixed tariff below your current Eskom rate — with no capital outlay and nothing installed on site.',
    bullets: [
      'Fixed tariff below your Eskom rate.',
      'Renewable energy certificates (RECs) included.',
      'NERSA-licensed trading and settlement.',
      'No infrastructure or capital required.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(217,124,118,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🔌',
  },
  {
    key: 'model-virtual',
    label: 'Virtual Wheeling',
    icon: 'Globe',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Virtual Wheeling',
    body: 'If your business buys electricity from a municipality that supports virtual wheeling, we wheel renewable generation into the grid on your behalf and the municipality nets it off against your consumption — cleaner power at a lower effective rate, without leaving your municipal supply.',
    bullets: [
      'For supported metros — Johannesburg, Cape Town, Tshwane, Ekurhuleni, eThekwini and Nelson Mandela Bay.',
      'Municipality nets wheeled generation against your bill.',
      'Fixed, below-tariff pricing on wheeled energy.',
      'Fully managed agreements and settlement.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(217,124,118,0.15) 100%)',
    imageEmoji: '🌐',
  },
  {
    key: 'model-micro',
    label: 'Micro-wheeling',
    icon: 'Sun',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Micro-wheeling',
    body: 'A specialised solution for mid-sized consumers who want to own their generation. You purchase a dedicated solar plant — typically around 1 MW — that wheels its output directly to your site. Built for businesses with base loads between 500 kW and 1 MW that want the long-term returns of ownership.',
    bullets: [
      'Own a dedicated ~1 MW solar plant.',
      'Ideal for base loads of 500 kW–1 MW.',
      'Wheels directly to your point of consumption.',
      'Maximum lifetime returns through ownership.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(217,124,118,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🏭',
  },
];
```

- [ ] **Step 4: Update the SolutionTabs section header**

In the same file, on the `<SolutionTabs … />` usage, change:
- `heading="Two ways to <em>wheel clean power</em>"` → `heading="Three ways to <em>wheel clean power</em>"`
- `subtitle="Direct or aggregated wheeling agreements — and the financing structures that make each one work."` → `subtitle="Direct, virtual or owned — the right structure depends on who supplies your business and how you want to participate."`
(Keep `eyebrow="The models"`.)

- [ ] **Step 5: Delete the orphaned calculator**

```bash
rm src/components/sections/calculators/WheelingCalculator.tsx
```
Confirm no remaining references:
Run: `grep -rn "WheelingCalculator" src` → Expected: no matches.

- [ ] **Step 6: Verify types, lint, and build**

Run: `npx tsc --noEmit` → Expected: no errors.
Run: `npm run lint` → Expected: no NEW errors in the two modified pages.
Run: `npm run build` → Expected: `✓ Compiled successfully`, and `/solutions/wheeling` + `/solutions/energy-optimisation` listed as statically generated.

- [ ] **Step 7: Commit**

```bash
git add src/app/solutions/wheeling/page.tsx src/app/solutions/energy-optimisation/page.tsx
git commit -m "feat(wheeling): 3 model tabs + estimator wiring; tariff deep-link anchor" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Notes for the implementer

- The reveal "Learn about…" button uses `window.location.assign('#model-direct'|'#model-virtual')`. `SolutionTabs` already listens for `hashchange` and opens/scrolls to the tab whose `key` matches — this is why Step 3 gives each model tab a `key`.
- `’` in the component strings is a curly apostrophe (’) — keep it to avoid JSX/lint unescaped-entity issues in string literals (they're JS strings, not JSX text, but the curly form matches site copy).
- Do not modify `SolutionTabs.tsx` (a pre-existing line-208 ref-during-render lint error lives there; it is out of scope and must not be "fixed" as part of this work).

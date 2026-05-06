# Phase 4-C: Solar Asset Valuation Tool — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the three-step interactive Solar Asset Valuation Tool at `/tools/solar-valuation` — a client-side DCF + depreciated cost + market comps calculator with BESS toggle, soft paywall lead capture, reCAPTCHA v3, and HowTo JSON-LD.

**Architecture:** Server component page.tsx holds metadata and HowTo JSON-LD; all interactive logic lives in `'use client'` components under `src/components/tools/`. Pure calculation functions in `src/lib/valuation/` are framework-agnostic TypeScript. State is lifted to `SolarValuationTool` orchestrator; `useValuation` hook computes `ValuationResult` reactively via `useMemo`.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS v4, Framer Motion (AnimatedSection for header only), Chart.js + react-chartjs-2 (DCF bar chart), Resend (via existing `/api/contact`), reCAPTCHA v3 (globally loaded in layout.tsx — no npm package needed), Zod (existing `webBuySolarSchema` in `src/lib/validators/contact.ts`).

**What already exists (no tasks needed):**
- `/api/contact` route handles `intent: 'webuysolar'` with Resend email
- `webBuySolarSchema` in `src/lib/validators/contact.ts`
- reCAPTCHA v3 script loaded globally in `src/app/layout.tsx`
- `src/types/recaptcha.d.ts` — `window.grecaptcha` type declaration

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/valuation/types.ts` | Create | TypeScript interfaces: SolarInputs, BessInputs, ConditionInputs, ValuationResult |
| `src/lib/valuation/constants.ts` | Create | All market-rate constants (yield, tariff, WACC, inverter rates, BESS rates) |
| `src/lib/valuation/solarModel.ts` | Create | computeDCF, computeSolarCostVal, computeSolarFinal |
| `src/lib/valuation/bessModel.ts` | Create | computeBessVal |
| `src/components/tools/useValuation.ts` | Create | useMemo hook combining all model functions → ValuationResult |
| `src/components/tools/RangeSlider.tsx` | Create | Styled HTML range input with live fill gradient |
| `src/components/tools/SegmentedControl.tsx` | Create | Generic multi-option button group |
| `src/components/tools/Toggle.tsx` | Create | BESS on/off toggle switch |
| `src/components/tools/StepIndicator.tsx` | Create | Three-step progress indicator |
| `src/components/tools/Step1SystemDetails.tsx` | Create | Solar sliders + segmented controls + BESS section |
| `src/components/tools/Step2Condition.tsx` | Create | Six segmented controls + methodology callout |
| `src/components/tools/ResultsGrid.tsx` | Create | 3×2 metric card grid |
| `src/components/tools/DCFBarChart.tsx` | Create | Chart.js bar chart of 10-year annual savings |
| `src/components/tools/BreakdownRows.tsx` | Create | Key-value table of all inputs and intermediate values |
| `src/components/tools/SoftPaywall.tsx` | Create | Lead capture overlay — POST to /api/contact on submit |
| `src/components/tools/Step3Results.tsx` | Create | Blur wrapper + paywall + post-unlock content |
| `src/components/tools/SolarValuationTool.tsx` | Create | Orchestrator — step state, all inputs state, useValuation |
| `src/app/tools/solar-valuation/page.tsx` | Create | Server component — metadata, HowTo JSON-LD, page layout |
| `src/app/globals.css` | Modify | Add `.range-slider` CSS reset for custom thumb/track styling |

---

### Task 1: Install dependencies + foundation files

**Files:**
- Modify: `package.json` (via npm install)
- Create: `src/lib/valuation/types.ts`
- Create: `src/lib/valuation/constants.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Install Chart.js packages**

```bash
cd "C:\Users\ricar\OneDrive\Desktop\Phoenix Energy\Phoenix Website V3\website\phoenix-energy"
npm install chart.js react-chartjs-2
```

Expected: resolves without errors; `chart.js` and `react-chartjs-2` appear in `package.json` dependencies.

- [ ] **Step 2: Create `src/lib/valuation/types.ts`**

```typescript
// src/lib/valuation/types.ts

export interface SolarInputs {
  kw: number;
  installYear: number;
  tier: 'T1' | 'T2' | 'T3';
  inverterType: 'string' | 'hybrid' | 'micro' | 'offgrid';
}

export interface BessInputs {
  enabled: boolean;
  kWh: number;
  chemistry: 'lfp' | 'nmc' | 'lead';
  soh: 'high' | 'mid' | 'low';
  brand: 'premium' | 'mid' | 'generic';
}

export interface ConditionInputs {
  condition: 'exc' | 'good' | 'fair' | 'poor';
  monitoring: boolean;
  warrantyYears: 'full' | 'mid' | 'low' | 'none';
  hasCoc: boolean;
  province: 'gp' | 'wc' | 'kzn' | 'other';
  reason: 'upgrade' | 'relocate' | 'finance' | 'other';
}

export interface ValuationResult {
  solarDcf: number;
  solarCostVal: number;
  solarMktAdj: number;
  solarFinal: number;
  bessVal: number;
  total: number;
  rangeLow: number;
  rangeHigh: number;
  solarReplacement: number;
  bessReplacement: number;
  retained: number;
  yrCashFlows: number[];
}
```

- [ ] **Step 3: Create `src/lib/valuation/constants.ts`**

```typescript
// src/lib/valuation/constants.ts
// Last updated: April 2026
// Sources: EnergyBee, LZY Energy, SA PV Know-How, NERSA, Standard Bank

export const CONSTANTS = {
  SA_YIELD_KWH_PER_KWP: { gp: 1680, wc: 1900, kzn: 1750, other: 1680 },
  SELF_CONSUMPTION_RATIO: 0.80,
  TARIFF_2025_RAND_PER_KWH: 3.50,
  TARIFF_ESCALATION_ANNUAL: 0.127,
  WACC: 0.12,
  DCF_YEARS: 10,
  PANEL_LIFESPAN_YEARS: 25,
  DEGRADATION_RATE: { t1: 0.005, t2: 0.007, t3: 0.010 },
  MAX_DEGRADATION: 0.30,
  INVERTER_RATE_PER_KWP: { string: 20000, hybrid: 25000, micro: 27000, offgrid: 30000 },
  BESS_RATE_PER_KWH: { lfp: 12000, nmc: 10500, lead: 4000 },
  BESS_LIFE_YEARS: { lfp: 12, nmc: 8, lead: 4 },
  DCF_WEIGHT: 0.45,
  COST_WEIGHT: 0.35,
  MKT_WEIGHT: 0.20,
  MKT_COMPS_DISCOUNT: 0.92,
} as const;
```

- [ ] **Step 4: Add range slider CSS to `src/app/globals.css`**

Append the following block **after** the existing `@layer utilities { ... }` block (after the closing `}` of that block):

```css
/* ─── Range slider — custom thumb/track ────────────────────────────────────── */
.range-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  border: none;
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #39575C;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  cursor: pointer;
}
.range-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #39575C;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  border: none;
}
.range-slider:focus-visible {
  outline: 2px solid #39575C;
  outline-offset: 2px;
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: exits 0 (or only pre-existing errors unrelated to new files).

- [ ] **Step 6: Commit**

```bash
git add src/lib/valuation/types.ts src/lib/valuation/constants.ts src/app/globals.css package.json package-lock.json
git commit -m "feat(tools): install chart.js and create valuation foundation files"
```

---

### Task 2: Solar valuation model

**Files:**
- Create: `src/lib/valuation/solarModel.ts`

- [ ] **Step 1: Create `src/lib/valuation/solarModel.ts`**

```typescript
// src/lib/valuation/solarModel.ts
import { CONSTANTS } from './constants';
import type { SolarInputs, ConditionInputs } from './types';

const CONDITION_MULT: Record<ConditionInputs['condition'], number> = {
  exc: 1.00,
  good: 0.88,
  fair: 0.72,
  poor: 0.52,
};

const WARRANTY_MULT: Record<ConditionInputs['warrantyYears'], number> = {
  full: 1.05,
  mid: 1.00,
  low: 0.93,
  none: 0.85,
};

const TIER_MULT: Record<SolarInputs['tier'], number> = {
  T1: 1.00,
  T2: 0.88,
  T3: 0.72,
};

const DEG_KEY_MAP: Record<SolarInputs['tier'], keyof typeof CONSTANTS.DEGRADATION_RATE> = {
  T1: 't1',
  T2: 't2',
  T3: 't3',
};

export function computeDCF(
  solar: SolarInputs,
  cond: ConditionInputs,
): { dcfTotal: number; yrCashFlows: number[] } {
  const yield_ = CONSTANTS.SA_YIELD_KWH_PER_KWP[cond.province];
  const degRate = CONSTANTS.DEGRADATION_RATE[DEG_KEY_MAP[solar.tier]];
  const yrCashFlows: number[] = [];
  let dcfTotal = 0;

  for (let i = 1; i <= CONSTANTS.DCF_YEARS; i++) {
    const tariff =
      CONSTANTS.TARIFF_2025_RAND_PER_KWH *
      Math.pow(1 + CONSTANTS.TARIFF_ESCALATION_ANNUAL, i - 1);
    const perfFactor = Math.max(
      1 - CONSTANTS.MAX_DEGRADATION,
      1 - degRate * (i - 1),
    );
    const gen = solar.kw * yield_ * perfFactor * CONSTANTS.SELF_CONSUMPTION_RATIO;
    const saving = gen * tariff;
    yrCashFlows.push(saving);
    dcfTotal += saving / Math.pow(1 + CONSTANTS.WACC, i);
  }

  return { dcfTotal, yrCashFlows };
}

export function computeSolarCostVal(
  solar: SolarInputs,
  cond: ConditionInputs,
): { solarCostVal: number; solarReplacement: number } {
  const age = new Date().getFullYear() - solar.installYear;
  const solarReplacement = solar.kw * CONSTANTS.INVERTER_RATE_PER_KWP[solar.inverterType];
  const ageFactor = Math.max(0, 1 - age / CONSTANTS.PANEL_LIFESPAN_YEARS);
  const condM = CONDITION_MULT[cond.condition];
  const monM = cond.monitoring ? 1.04 : 0.97;
  const warrM = WARRANTY_MULT[cond.warrantyYears];
  const cocM = cond.hasCoc ? 1.00 : 0.93;
  const solarCostVal = solarReplacement * ageFactor * condM * monM * warrM * cocM;
  return { solarCostVal, solarReplacement };
}

export function computeSolarFinal(
  dcfTotal: number,
  solarCostVal: number,
  tier: SolarInputs['tier'],
): { solarFinal: number; solarMktAdj: number } {
  const solarMktAdj = solarCostVal * CONSTANTS.MKT_COMPS_DISCOUNT;
  const blended =
    dcfTotal * CONSTANTS.DCF_WEIGHT +
    solarCostVal * CONSTANTS.COST_WEIGHT +
    solarMktAdj * CONSTANTS.MKT_WEIGHT;
  const solarFinal = blended * TIER_MULT[tier];
  return { solarFinal, solarMktAdj };
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/lib/valuation/solarModel.ts
git commit -m "feat(tools): add solar DCF, cost, and market-comps valuation model"
```

---

### Task 3: BESS model + useValuation hook

**Files:**
- Create: `src/lib/valuation/bessModel.ts`
- Create: `src/components/tools/useValuation.ts`

- [ ] **Step 1: Create `src/lib/valuation/bessModel.ts`**

```typescript
// src/lib/valuation/bessModel.ts
import { CONSTANTS } from './constants';
import type { BessInputs, ConditionInputs } from './types';

const BRAND_MULT: Record<BessInputs['brand'], number> = {
  premium: 1.00,
  mid: 0.85,
  generic: 0.65,
};

const SOH_MULT: Record<BessInputs['soh'], number> = {
  high: 1.00,
  mid: 0.80,
  low: 0.55,
};

const CONDITION_MULT: Record<ConditionInputs['condition'], number> = {
  exc: 1.00,
  good: 0.88,
  fair: 0.72,
  poor: 0.52,
};

export function computeBessVal(
  bess: BessInputs,
  cond: ConditionInputs,
  installYear: number,
): { bessVal: number; bessReplacement: number } {
  if (!bess.enabled) return { bessVal: 0, bessReplacement: 0 };

  const age = new Date().getFullYear() - installYear;
  const bessReplacement = bess.kWh * CONSTANTS.BESS_RATE_PER_KWH[bess.chemistry];
  const bessAgeFactor = Math.max(
    0,
    1 - age / CONSTANTS.BESS_LIFE_YEARS[bess.chemistry],
  );
  const bessVal =
    bessReplacement *
    bessAgeFactor *
    SOH_MULT[bess.soh] *
    BRAND_MULT[bess.brand] *
    CONDITION_MULT[cond.condition];

  return { bessVal, bessReplacement };
}
```

- [ ] **Step 2: Create `src/components/tools/useValuation.ts`**

```typescript
// src/components/tools/useValuation.ts
'use client';
import { useMemo } from 'react';
import type { SolarInputs, BessInputs, ConditionInputs, ValuationResult } from '@/lib/valuation/types';
import { computeDCF, computeSolarCostVal, computeSolarFinal } from '@/lib/valuation/solarModel';
import { computeBessVal } from '@/lib/valuation/bessModel';

export function useValuation(
  solar: SolarInputs,
  bess: BessInputs,
  cond: ConditionInputs,
): ValuationResult {
  return useMemo(() => {
    const { dcfTotal, yrCashFlows } = computeDCF(solar, cond);
    const { solarCostVal, solarReplacement } = computeSolarCostVal(solar, cond);
    const { solarFinal, solarMktAdj } = computeSolarFinal(dcfTotal, solarCostVal, solar.tier);
    const { bessVal, bessReplacement } = computeBessVal(bess, cond, solar.installYear);

    const total = solarFinal + bessVal;
    const replacementTotal = solarReplacement + bessReplacement;
    const retained = replacementTotal > 0 ? (total / replacementTotal) * 100 : 0;

    return {
      solarDcf: dcfTotal,
      solarCostVal,
      solarMktAdj,
      solarFinal,
      bessVal,
      total,
      rangeLow: total * 0.88,
      rangeHigh: total * 1.12,
      solarReplacement,
      bessReplacement,
      retained,
      yrCashFlows,
    };
  }, [solar, bess, cond]);
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/lib/valuation/bessModel.ts src/components/tools/useValuation.ts
git commit -m "feat(tools): add BESS valuation model and useValuation hook"
```

---

### Task 4: Shared input primitives — RangeSlider, SegmentedControl, Toggle

**Files:**
- Create: `src/components/tools/RangeSlider.tsx`
- Create: `src/components/tools/SegmentedControl.tsx`
- Create: `src/components/tools/Toggle.tsx`

- [ ] **Step 1: Create `src/components/tools/RangeSlider.tsx`**

```tsx
// src/components/tools/RangeSlider.tsx
'use client';

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  hint?: string;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
}

export function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  hint,
  onChange,
  formatValue,
}: RangeSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = formatValue ? formatValue(value) : `${value} ${unit}`;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <label className="font-body font-semibold text-xs text-[#1A1A1A]">{label}</label>
        <span className="font-display font-bold text-sm text-[#39575C]">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="range-slider w-full"
        style={{
          background: `linear-gradient(to right, #39575C ${pct}%, #E5E7EB ${pct}%)`,
        }}
      />
      {hint && (
        <p className="font-body text-[10px] text-[#9CA3AF] mt-1.5">{hint}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/tools/SegmentedControl.tsx`**

```tsx
// src/components/tools/SegmentedControl.tsx
'use client';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: Option<T>[];
  value: T;
  hint?: string;
  onChange: (v: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  hint,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="mb-5">
      <label className="font-body font-semibold text-xs text-[#1A1A1A] block mb-2">
        {label}
      </label>
      <div
        className="flex rounded-xl overflow-hidden"
        style={{ border: '1px solid #E5E7EB' }}
      >
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex-1 py-2 px-1 font-body text-xs font-medium transition-colors leading-tight"
            style={{
              background: value === opt.value ? '#39575C' : 'white',
              color: value === opt.value ? 'white' : '#6B7280',
              borderRight: i < options.length - 1 ? '1px solid #E5E7EB' : 'none',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {hint && (
        <p className="font-body text-[10px] text-[#9CA3AF] mt-1.5">{hint}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/tools/Toggle.tsx`**

```tsx
// src/components/tools/Toggle.tsx
'use client';

interface ToggleProps {
  label: string;
  subLabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ label, subLabel, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-start gap-3 text-left mb-5"
    >
      <div
        className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors mt-0.5"
        style={{ background: checked ? '#39575C' : '#E5E7EB' }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </div>
      <div>
        <p className="font-body font-semibold text-sm text-[#1A1A1A]">{label}</p>
        {subLabel && (
          <p className="font-body text-[11px] text-[#6B7280] mt-0.5 leading-[1.5]">
            {subLabel}
          </p>
        )}
      </div>
    </button>
  );
}
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/tools/RangeSlider.tsx src/components/tools/SegmentedControl.tsx src/components/tools/Toggle.tsx
git commit -m "feat(tools): add RangeSlider, SegmentedControl, and Toggle input primitives"
```

---

### Task 5: StepIndicator

**Files:**
- Create: `src/components/tools/StepIndicator.tsx`

- [ ] **Step 1: Create `src/components/tools/StepIndicator.tsx`**

```tsx
// src/components/tools/StepIndicator.tsx
'use client';

interface StepIndicatorProps {
  current: 1 | 2 | 3;
}

const STEPS: { n: 1 | 2 | 3; label: string }[] = [
  { n: 1, label: 'System details' },
  { n: 2, label: 'Condition' },
  { n: 3, label: 'Your valuation' },
];

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-center mb-8">
      {STEPS.map((step, i) => {
        const isDone = current > step.n;
        const isActive = current === step.n;
        return (
          <div key={step.n} className="flex items-start">
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                style={{
                  background: isActive ? '#39575C' : isDone ? '#F5F5F5' : 'white',
                  color: isActive ? 'white' : '#6B7280',
                  border: isActive ? 'none' : '0.5px solid #E5E7EB',
                }}
              >
                {step.n}
              </div>
              <span
                className="font-body text-[10px] mt-1.5 whitespace-nowrap text-center"
                style={{
                  color: isActive ? '#1A1A1A' : '#9CA3AF',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-12 h-px mt-4 mx-1 flex-shrink-0"
                style={{ background: '#E5E7EB' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/tools/StepIndicator.tsx
git commit -m "feat(tools): add StepIndicator component"
```

---

### Task 6: Step1SystemDetails

**Files:**
- Create: `src/components/tools/Step1SystemDetails.tsx`

- [ ] **Step 1: Create `src/components/tools/Step1SystemDetails.tsx`**

```tsx
// src/components/tools/Step1SystemDetails.tsx
'use client';
import type { SolarInputs, BessInputs } from '@/lib/valuation/types';
import { RangeSlider } from './RangeSlider';
import { SegmentedControl } from './SegmentedControl';
import { Toggle } from './Toggle';

interface Step1SystemDetailsProps {
  solar: SolarInputs;
  bess: BessInputs;
  onSolarChange: (patch: Partial<SolarInputs>) => void;
  onBessChange: (patch: Partial<BessInputs>) => void;
  onNext: () => void;
}

const TIER_OPTIONS: { value: SolarInputs['tier']; label: string }[] = [
  { value: 'T1', label: 'Tier 1' },
  { value: 'T2', label: 'Tier 2' },
  { value: 'T3', label: 'Tier 3 / unknown' },
];

const INVERTER_OPTIONS: { value: SolarInputs['inverterType']; label: string }[] = [
  { value: 'string', label: 'String' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'micro', label: 'Micro' },
  { value: 'offgrid', label: 'Off-grid' },
];

const CHEM_OPTIONS: { value: BessInputs['chemistry']; label: string }[] = [
  { value: 'lfp', label: 'LFP / LiFePO₄' },
  { value: 'nmc', label: 'Li-NMC' },
  { value: 'lead', label: 'Lead-acid' },
];

const SOH_OPTIONS: { value: BessInputs['soh']; label: string }[] = [
  { value: 'high', label: '90%+ (like new)' },
  { value: 'mid', label: '70–90% (good)' },
  { value: 'low', label: 'Below 70% (degraded)' },
];

const BRAND_OPTIONS: { value: BessInputs['brand']; label: string }[] = [
  { value: 'premium', label: 'Premium (Pylontech, BYD, CATL)' },
  { value: 'mid', label: 'Mid-range' },
  { value: 'generic', label: 'Generic' },
];

export function Step1SystemDetails({
  solar,
  bess,
  onSolarChange,
  onBessChange,
  onNext,
}: Step1SystemDetailsProps) {
  return (
    <div>
      <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-4">
        Solar array
      </p>

      <RangeSlider
        label="Installed solar capacity"
        value={solar.kw}
        min={3}
        max={500}
        step={1}
        unit="kWp"
        hint="Residential: 5–30 kWp · Small C&I: 30–100 kWp · Large C&I: 100 kWp+"
        onChange={v => onSolarChange({ kw: v })}
      />

      <RangeSlider
        label="Year of installation"
        value={solar.installYear}
        min={2015}
        max={2025}
        step={1}
        unit=""
        hint="Age determines panel degradation rate and remaining warranty value"
        onChange={v => onSolarChange({ installYear: v })}
        formatValue={v => String(v)}
      />

      <SegmentedControl
        label="Panel brand tier"
        options={TIER_OPTIONS}
        value={solar.tier}
        hint="Tier 1: JA Solar, Canadian Solar, LONGi, Trina · Tier 3: unbranded / Chinese no-name"
        onChange={v => onSolarChange({ tier: v })}
      />

      <SegmentedControl
        label="Inverter type"
        options={INVERTER_OPTIONS}
        value={solar.inverterType}
        hint="Hybrid inverters command a significant premium as they support BESS"
        onChange={v => onSolarChange({ inverterType: v })}
      />

      <div
        className="mt-6 pt-6"
        style={{ borderTop: '1px solid #E5E7EB' }}
      >
        <Toggle
          label="Does your system include battery storage?"
          subLabel="BESS is valued separately and can significantly increase total buyback value"
          checked={bess.enabled}
          onChange={v => onBessChange({ enabled: v })}
        />

        {bess.enabled && (
          <div className="mt-2">
            <RangeSlider
              label="Battery capacity"
              value={bess.kWh}
              min={5}
              max={500}
              step={5}
              unit="kWh"
              hint="Total usable capacity installed"
              onChange={v => onBessChange({ kWh: v })}
            />

            <SegmentedControl
              label="Battery chemistry"
              options={CHEM_OPTIONS}
              value={bess.chemistry}
              hint="LFP retains value significantly better — 3,000+ cycle life vs 300–500 for lead-acid"
              onChange={v => onBessChange({ chemistry: v })}
            />

            <SegmentedControl
              label="Estimated battery health (SoH)"
              options={SOH_OPTIONS}
              value={bess.soh}
              hint="State of Health — most LFP systems remain above 80% SoH for 8–10 years"
              onChange={v => onBessChange({ soh: v })}
            />

            <SegmentedControl
              label="Battery brand"
              options={BRAND_OPTIONS}
              value={bess.brand}
              onChange={v => onBessChange({ brand: v })}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-6 w-full font-body font-semibold text-sm text-white rounded-xl py-3 transition-opacity hover:opacity-90"
        style={{ background: '#39575C' }}
      >
        Next: System condition →
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/tools/Step1SystemDetails.tsx
git commit -m "feat(tools): add Step1SystemDetails component"
```

---

### Task 7: Step2Condition

**Files:**
- Create: `src/components/tools/Step2Condition.tsx`

- [ ] **Step 1: Create `src/components/tools/Step2Condition.tsx`**

```tsx
// src/components/tools/Step2Condition.tsx
'use client';
import type { ConditionInputs } from '@/lib/valuation/types';
import { SegmentedControl } from './SegmentedControl';

interface Step2ConditionProps {
  cond: ConditionInputs;
  onChange: (patch: Partial<ConditionInputs>) => void;
  onBack: () => void;
  onNext: () => void;
}

const CONDITION_OPTIONS: { value: ConditionInputs['condition']; label: string }[] = [
  { value: 'exc', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

const WARRANTY_OPTIONS: { value: ConditionInputs['warrantyYears']; label: string }[] = [
  { value: 'full', label: '15+ years' },
  { value: 'mid', label: '5–15 years' },
  { value: 'low', label: 'Under 5 years' },
  { value: 'none', label: 'Expired' },
];

const PROVINCE_OPTIONS: { value: ConditionInputs['province']; label: string }[] = [
  { value: 'gp', label: 'Gauteng' },
  { value: 'wc', label: 'Western Cape' },
  { value: 'kzn', label: 'KZN' },
  { value: 'other', label: 'Other' },
];

const REASON_OPTIONS: { value: ConditionInputs['reason']; label: string }[] = [
  { value: 'upgrade', label: 'Upgrading' },
  { value: 'relocate', label: 'Relocating' },
  { value: 'finance', label: 'Refinancing' },
  { value: 'other', label: 'Other' },
];

export function Step2Condition({ cond, onChange, onBack, onNext }: Step2ConditionProps) {
  return (
    <div>
      <SegmentedControl
        label="Overall system condition"
        options={CONDITION_OPTIONS}
        value={cond.condition}
        hint="Excellent: no faults, recently serviced · Poor: inverter faults or physical damage"
        onChange={v => onChange({ condition: v })}
      />

      <SegmentedControl<'yes' | 'no'>
        label="Monitoring system"
        options={[
          { value: 'yes', label: 'Yes — remote monitoring' },
          { value: 'no', label: 'No monitoring' },
        ]}
        value={cond.monitoring ? 'yes' : 'no'}
        hint="Verified production data substantially increases buyer confidence"
        onChange={v => onChange({ monitoring: v === 'yes' })}
      />

      <SegmentedControl
        label="Panel warranty remaining"
        options={WARRANTY_OPTIONS}
        value={cond.warrantyYears}
        onChange={v => onChange({ warrantyYears: v })}
      />

      <SegmentedControl<'yes' | 'no'>
        label="COC / electrical compliance cert"
        options={[
          { value: 'yes', label: 'Yes — in hand' },
          { value: 'no', label: 'No / not sure' },
        ]}
        value={cond.hasCoc ? 'yes' : 'no'}
        hint="Required for resale — absence discounted from value"
        onChange={v => onChange({ hasCoc: v === 'yes' })}
      />

      <SegmentedControl
        label="Province / region"
        options={PROVINCE_OPTIONS}
        value={cond.province}
        hint="Affects regional solar yield used in DCF"
        onChange={v => onChange({ province: v })}
      />

      <SegmentedControl
        label="Reason for selling"
        options={REASON_OPTIONS}
        value={cond.reason}
        hint="Informational only — routed to WeBuySolar team"
        onChange={v => onChange({ reason: v })}
      />

      {/* Methodology callout */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{ background: 'rgba(57,87,92,0.06)', border: '1px solid rgba(57,87,92,0.15)' }}
      >
        <p className="font-body font-semibold text-xs text-[#39575C] mb-1.5">
          How we value your system
        </p>
        <p className="font-body text-[11px] text-[#6B7280] leading-[1.75]">
          Phoenix Energy uses a weighted three-method approach — DCF analysis (present value
          of future displaced tariff savings calculated from actual system capacity, not your
          net bill), depreciated replacement cost (current SA market rate adjusted for age,
          condition and component quality), and market comparables from recent WeBuySolar
          transactions. Solar and BESS are valued independently and then combined.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="font-body font-semibold text-sm text-[#6B7280] rounded-xl py-3 px-6 transition-colors hover:text-[#39575C]"
          style={{ border: '1px solid #E5E7EB', background: 'white' }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 font-body font-semibold text-sm text-white rounded-xl py-3 transition-opacity hover:opacity-90"
          style={{ background: '#39575C' }}
        >
          View my valuation →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/tools/Step2Condition.tsx
git commit -m "feat(tools): add Step2Condition component"
```

---

### Task 8: ResultsGrid

**Files:**
- Create: `src/components/tools/ResultsGrid.tsx`

- [ ] **Step 1: Create `src/components/tools/ResultsGrid.tsx`**

```tsx
// src/components/tools/ResultsGrid.tsx
'use client';
import type { ValuationResult } from '@/lib/valuation/types';

function fmtRand(n: number) {
  return `R ${Math.round(n).toLocaleString('en-ZA')}`;
}

interface ResultsGridProps {
  result: ValuationResult;
  hasBess: boolean;
}

export function ResultsGrid({ result, hasBess }: ResultsGridProps) {
  const cards = [
    {
      label: 'Indicative buyback value',
      value: fmtRand(result.total),
      sub: `Range: ${fmtRand(result.rangeLow)} – ${fmtRand(result.rangeHigh)}`,
      accent: true,
    },
    {
      label: 'Solar array value',
      value: fmtRand(result.solarFinal),
    },
    {
      label: 'BESS value',
      value: hasBess ? fmtRand(result.bessVal) : 'N/A',
    },
    {
      label: '10-yr displaced savings (PV)',
      value: fmtRand(result.solarDcf),
    },
    {
      label: 'Replacement cost (new)',
      value: fmtRand(result.solarReplacement + result.bessReplacement),
    },
    {
      label: 'Retained value',
      value: `${result.retained.toFixed(1)}%`,
    },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {cards.map(card => (
        <div
          key={card.label}
          className="rounded-xl p-4"
          style={{
            background: card.accent ? '#39575C' : '#F5F5F5',
            border: card.accent ? 'none' : '1px solid #E5E7EB',
          }}
        >
          <p
            className="font-body text-[10px] mb-1 leading-tight"
            style={{ color: card.accent ? 'rgba(255,255,255,0.6)' : '#6B7280' }}
          >
            {card.label}
          </p>
          <p
            className="font-display font-extrabold text-base leading-tight"
            style={{ color: card.accent ? 'white' : '#1A1A1A' }}
          >
            {card.value}
          </p>
          {'sub' in card && card.sub && (
            <p
              className="font-body text-[9px] mt-1 leading-tight"
              style={{ color: 'rgba(255,255,255,0.50)' }}
            >
              {card.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/tools/ResultsGrid.tsx
git commit -m "feat(tools): add ResultsGrid 3x2 metric card component"
```

---

### Task 9: DCFBarChart

**Files:**
- Create: `src/components/tools/DCFBarChart.tsx`

- [ ] **Step 1: Create `src/components/tools/DCFBarChart.tsx`**

```tsx
// src/components/tools/DCFBarChart.tsx
'use client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface DCFBarChartProps {
  yrCashFlows: number[];
}

export function DCFBarChart({ yrCashFlows }: DCFBarChartProps) {
  const startYear = new Date().getFullYear();
  const labels = yrCashFlows.map((_, i) => String(startYear + i));

  const data = {
    labels,
    datasets: [
      {
        data: yrCashFlows,
        backgroundColor: '#39575C',
        borderRadius: 4,
        hoverBackgroundColor: '#2e474c',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) =>
            ` R ${Math.round(ctx.raw as number).toLocaleString('en-ZA')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#9CA3AF' },
      },
      y: {
        grid: { color: '#F5F5F5' },
        border: { display: false },
        ticks: {
          font: { size: 10 },
          color: '#9CA3AF',
          callback: (value: number | string) =>
            `R ${(Number(value) / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <div className="mb-6">
      <p className="font-display font-bold text-[13px] text-[#1A1A1A] mb-3">
        10-year projected annual savings
      </p>
      <div style={{ height: 180 }}>
        <Bar data={data} options={options as Parameters<typeof Bar>[0]['options']} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0 (Chart.js types may generate warnings about `options` inference; the cast handles this).

- [ ] **Step 3: Commit**

```bash
git add src/components/tools/DCFBarChart.tsx
git commit -m "feat(tools): add DCFBarChart Chart.js bar chart component"
```

---

### Task 10: BreakdownRows

**Files:**
- Create: `src/components/tools/BreakdownRows.tsx`

- [ ] **Step 1: Create `src/components/tools/BreakdownRows.tsx`**

```tsx
// src/components/tools/BreakdownRows.tsx
'use client';
import { CONSTANTS } from '@/lib/valuation/constants';
import type { SolarInputs, BessInputs, ConditionInputs, ValuationResult } from '@/lib/valuation/types';

function fmtRand(n: number) {
  return `R ${Math.round(n).toLocaleString('en-ZA')}`;
}

const PROVINCE_LABEL: Record<ConditionInputs['province'], string> = {
  gp: 'Gauteng',
  wc: 'Western Cape',
  kzn: 'KZN',
  other: 'Other',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex justify-between items-baseline py-2.5"
      style={{ borderBottom: '1px solid #E5E7EB' }}
    >
      <span className="font-body text-xs text-[#6B7280]">{label}</span>
      <span className="font-body font-semibold text-xs text-[#1A1A1A] text-right ml-4">
        {value}
      </span>
    </div>
  );
}

interface BreakdownRowsProps {
  solar: SolarInputs;
  bess: BessInputs;
  cond: ConditionInputs;
  result: ValuationResult;
}

export function BreakdownRows({ solar, bess, cond, result }: BreakdownRowsProps) {
  const age = new Date().getFullYear() - solar.installYear;
  const yield_ = CONSTANTS.SA_YIELD_KWH_PER_KWP[cond.province];
  const yr1Saving = result.yrCashFlows[0] ?? 0;

  return (
    <div className="mb-6">
      <p className="font-display font-bold text-[13px] text-[#1A1A1A] mb-1">
        Calculation breakdown
      </p>
      <div>
        <Row label="Solar capacity" value={`${solar.kw} kWp`} />
        {bess.enabled && (
          <Row label="Battery storage" value={`${bess.kWh} kWh`} />
        )}
        <Row
          label="System age"
          value={`${age} year${age !== 1 ? 's' : ''} (installed ${solar.installYear})`}
        />
        <Row
          label="Regional solar yield"
          value={`${yield_} kWh/kWp/yr (${PROVINCE_LABEL[cond.province]})`}
        />
        <Row label="Yr 1 displaced electricity saving" value={fmtRand(yr1Saving)} />
        <Row label="10-yr DCF value" value={fmtRand(result.solarDcf)} />
        <Row
          label="Solar array depreciated cost value"
          value={fmtRand(result.solarCostVal)}
        />
        {bess.enabled && (
          <Row label="BESS depreciated value" value={fmtRand(result.bessVal)} />
        )}
        <Row label="Blended solar valuation" value={fmtRand(result.solarFinal)} />
        <Row
          label="Indicative buyback range"
          value={`${fmtRand(result.rangeLow)} – ${fmtRand(result.rangeHigh)}`}
        />
      </div>
      <p
        className="font-body text-[10px] text-[#9CA3AF] leading-[1.65] mt-3"
      >
        Based on April 2026 SA market rates. Sources: EnergyBee, LZY Energy, SA PV
        Know-How, NERSA tariff ruling, Standard Bank energy report Feb 2025.
        Self-consumption ratio: 80% (industry standard). WACC: 12% (SA risk-adjusted).
        Tariff escalation: 12.7% (NERSA approved 2025/26).{' '}
        <strong>This is an indicative estimate only — a formal offer requires on-site verification.</strong>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/tools/BreakdownRows.tsx
git commit -m "feat(tools): add BreakdownRows calculation detail component"
```

---

### Task 11: SoftPaywall

**Files:**
- Create: `src/components/tools/SoftPaywall.tsx`

- [ ] **Step 1: Create `src/components/tools/SoftPaywall.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/tools/SoftPaywall.tsx
git commit -m "feat(tools): add SoftPaywall lead capture overlay component"
```

---

### Task 12: Step3Results

**Files:**
- Create: `src/components/tools/Step3Results.tsx`

- [ ] **Step 1: Create `src/components/tools/Step3Results.tsx`**

```tsx
// src/components/tools/Step3Results.tsx
'use client';
import type { SolarInputs, BessInputs, ConditionInputs, ValuationResult } from '@/lib/valuation/types';
import { ResultsGrid } from './ResultsGrid';
import { DCFBarChart } from './DCFBarChart';
import { BreakdownRows } from './BreakdownRows';
import { SoftPaywall } from './SoftPaywall';

interface Step3ResultsProps {
  solar: SolarInputs;
  bess: BessInputs;
  cond: ConditionInputs;
  result: ValuationResult;
  unlocked: boolean;
  onUnlock: () => void;
  onBack: () => void;
}

function WhatHappensNext() {
  const steps = [
    {
      n: 1,
      text: 'WeBuySolar specialist reviews valuation and contacts you within 1 business day',
    },
    {
      n: 2,
      text: 'Free on-site verification arranged to confirm system condition and production data',
    },
    {
      n: 3,
      text: 'Formal written offer within 5 business days — no obligation to accept',
    },
  ];
  return (
    <div
      className="rounded-xl p-5 mt-6"
      style={{ background: 'rgba(57,87,92,0.06)', border: '1px solid rgba(57,87,92,0.15)' }}
    >
      <p className="font-display font-bold text-[13px] text-[#39575C] mb-3">
        What happens next
      </p>
      <div className="flex flex-col gap-3">
        {steps.map(s => (
          <div key={s.n} className="flex items-start gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: '#39575C' }}
            >
              <span className="font-display font-bold text-[10px] text-white">{s.n}</span>
            </div>
            <p className="font-body text-xs text-[#6B7280] leading-[1.65]">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Step3Results({
  solar,
  bess,
  cond,
  result,
  unlocked,
  onUnlock,
  onBack,
}: Step3ResultsProps) {
  return (
    <div>
      {/* Blurred results layer */}
      <div className="relative">
        <div
          aria-hidden={!unlocked}
          aria-live={unlocked ? 'polite' : undefined}
          style={{
            filter: unlocked ? 'none' : 'blur(7px)',
            userSelect: unlocked ? 'auto' : 'none',
            pointerEvents: unlocked ? 'auto' : 'none',
            transition: 'filter 0.4s',
          }}
        >
          <ResultsGrid result={result} hasBess={bess.enabled} />
          <DCFBarChart yrCashFlows={result.yrCashFlows} />
          <BreakdownRows solar={solar} bess={bess} cond={cond} result={result} />
        </div>

        {/* Soft paywall overlay */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center py-8">
            <SoftPaywall
              result={result}
              solar={solar}
              bess={bess}
              cond={cond}
              onUnlock={onUnlock}
            />
          </div>
        )}
      </div>

      {/* Post-unlock: what happens next */}
      {unlocked && <WhatHappensNext />}

      <button
        type="button"
        onClick={onBack}
        className="mt-5 font-body text-xs text-[#6B7280] hover:text-[#39575C] transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/tools/Step3Results.tsx
git commit -m "feat(tools): add Step3Results with blur paywall and post-unlock content"
```

---

### Task 13: SolarValuationTool orchestrator + page

**Files:**
- Create: `src/components/tools/SolarValuationTool.tsx`
- Create: `src/app/tools/solar-valuation/page.tsx`

- [ ] **Step 1: Create `src/components/tools/SolarValuationTool.tsx`**

```tsx
// src/components/tools/SolarValuationTool.tsx
'use client';
import { useState } from 'react';
import type { SolarInputs, BessInputs, ConditionInputs } from '@/lib/valuation/types';
import { useValuation } from './useValuation';
import { StepIndicator } from './StepIndicator';
import { Step1SystemDetails } from './Step1SystemDetails';
import { Step2Condition } from './Step2Condition';
import { Step3Results } from './Step3Results';

const DEFAULT_SOLAR: SolarInputs = {
  kw: 20,
  installYear: 2021,
  tier: 'T1',
  inverterType: 'string',
};

const DEFAULT_BESS: BessInputs = {
  enabled: false,
  kWh: 20,
  chemistry: 'lfp',
  soh: 'high',
  brand: 'premium',
};

const DEFAULT_COND: ConditionInputs = {
  condition: 'exc',
  monitoring: true,
  warrantyYears: 'full',
  hasCoc: true,
  province: 'gp',
  reason: 'upgrade',
};

export function SolarValuationTool() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [solar, setSolar] = useState<SolarInputs>(DEFAULT_SOLAR);
  const [bess, setBess] = useState<BessInputs>(DEFAULT_BESS);
  const [cond, setCond] = useState<ConditionInputs>(DEFAULT_COND);
  const [unlocked, setUnlocked] = useState(false);

  const result = useValuation(solar, bess, cond);

  return (
    <div
      className="bg-white rounded-2xl p-6 md:p-8 mx-auto"
      style={{
        border: '1px solid #E5E7EB',
        maxWidth: 680,
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      }}
    >
      <StepIndicator current={step} />

      {step === 1 && (
        <Step1SystemDetails
          solar={solar}
          bess={bess}
          onSolarChange={patch => setSolar(prev => ({ ...prev, ...patch }))}
          onBessChange={patch => setBess(prev => ({ ...prev, ...patch }))}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step2Condition
          cond={cond}
          onChange={patch => setCond(prev => ({ ...prev, ...patch }))}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Step3Results
          solar={solar}
          bess={bess}
          cond={cond}
          result={result}
          unlocked={unlocked}
          onUnlock={() => setUnlocked(true)}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/tools/solar-valuation/page.tsx`**

```tsx
// src/app/tools/solar-valuation/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { SolarValuationTool } from '@/components/tools/SolarValuationTool';
import { CTABanner } from '@/components/sections/CTABanner';

export const metadata: Metadata = {
  title: 'Solar Asset Valuation Tool — What Is Your System Worth? | Phoenix Energy',
  description:
    'Get an instant indicative buyback valuation for your solar system and BESS. Based on DCF analysis, SA market rates, and WeBuySolar transaction data.',
  openGraph: {
    images: [{ url: '/og-tools-valuation.jpg' }],
  },
  alternates: {
    canonical: 'https://phoenixenergy.solutions/tools/solar-valuation',
  },
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to value a solar system in South Africa',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Enter system details',
      text: 'Input your installed kWp, year, panel tier and inverter type.',
    },
    {
      '@type': 'HowToStep',
      name: 'Describe system condition',
      text: 'Rate condition, warranty status, monitoring, and COC certificate.',
    },
    {
      '@type': 'HowToStep',
      name: 'Receive your valuation',
      text: 'Get a DCF-based indicative buyback range from WeBuySolar.',
    },
  ],
};

export default function SolarValuationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-[960px] mx-auto px-6 pt-4">
        <nav
          aria-label="Breadcrumb"
          className="font-body text-[10px] text-[#6B7280] flex items-center gap-1"
        >
          <Link href="/" className="hover:text-[#39575C] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/tools" className="hover:text-[#39575C] transition-colors">
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#1A1A1A]">Solar Asset Valuation</span>
        </nav>
      </div>

      {/* Page header */}
      <section className="max-w-[600px] mx-auto px-6 py-10 text-center">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
          WeBuySolar Tool
        </p>
        <h1 className="font-display font-extrabold text-3xl text-[#1A1A1A] mb-3 leading-tight">
          What is your solar system{' '}
          <span style={{ color: '#709DA9' }}>worth?</span>
        </h1>
        <p className="font-body text-sm text-[#6B7280] leading-[1.75]">
          Get an indicative buyback valuation in under 2 minutes. Based on real SA market
          data, DCF analysis, and WeBuySolar transaction comparables.
        </p>
      </section>

      {/* Tool */}
      <section className="px-6 pb-16" style={{ background: '#F5F5F5' }}>
        <SolarValuationTool />
      </section>

      <CTABanner />
    </>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 4: Start dev server and verify the page loads**

```bash
npm run dev
```

Navigate to `http://localhost:3000/tools/solar-valuation` and verify:
- Page header renders with "worth?" in Dusty Blue
- Three-step indicator shows "1 System details" as active
- Solar sliders and segmented controls work
- BESS toggle reveals BESS fields when enabled
- "Next" advances to Step 2
- Step 2 shows all 6 segmented controls + methodology callout
- "View my valuation →" advances to Step 3
- Step 3 shows blurred results and soft paywall overlay
- Filling in name + email enables the "Unlock" button
- On submit (with no reCAPTCHA key configured, token will be empty string), `/api/contact` is called
- On success the blur lifts and "What happens next" panel appears

- [ ] **Step 5: Commit**

```bash
git add src/components/tools/SolarValuationTool.tsx src/app/tools/solar-valuation/page.tsx
git commit -m "feat(tools): add SolarValuationTool orchestrator and solar-valuation page"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered |
|---|---|
| Three-step tool at `/tools/solar-valuation` | ✅ Task 13 |
| Page header eyebrow + H1 + subtitle | ✅ Task 13 |
| Step indicator | ✅ Task 5 |
| Solar capacity slider (3–500 kWp, default 20) | ✅ Task 6 |
| Install year slider (2015–2025, default 2021) | ✅ Task 6 |
| Panel brand tier segmented (T1/T2/T3) | ✅ Task 6 |
| Inverter type segmented (string/hybrid/micro/offgrid) | ✅ Task 6 |
| BESS toggle (default off) | ✅ Task 6 |
| BESS capacity slider (5–500 kWh, step 5) | ✅ Task 6 |
| Battery chemistry, SoH, brand segmented controls | ✅ Task 6 |
| Step 2: condition, monitoring, warranty, COC, province, reason | ✅ Task 7 |
| Step 2 methodology callout | ✅ Task 7 |
| blur(7px) + aria-hidden + transition on results | ✅ Task 12 |
| Soft paywall overlay with 4 fields | ✅ Task 11 |
| POST to /api/contact with full valuation payload | ✅ Task 11 |
| 6 metric cards (3×2) | ✅ Task 8 |
| Bar chart — 10-year savings | ✅ Task 9 |
| Breakdown rows with methodology note | ✅ Task 10 |
| Post-unlock "what happens next" | ✅ Task 12 |
| DCF model (45% weight) | ✅ Task 2 |
| Depreciated cost model (35% weight) | ✅ Task 2 |
| Market comps (20% weight, 0.92 discount) | ✅ Task 2 |
| Tier multipliers (T1: 1.00, T2: 0.88, T3: 0.72) | ✅ Task 2 |
| BESS model (chemistry rates, life, SoH, brand multipliers) | ✅ Task 3 |
| HowTo JSON-LD | ✅ Task 13 |
| Metadata (title, description, OG image) | ✅ Task 13 |
| aria-hidden + aria-live on results div | ✅ Task 12 |
| No Sanity dependency — fully static page | ✅ all tasks |
| reCAPTCHA v3 (action: 'valuation_submit') | ✅ Task 11 |
| rangeLow = total × 0.88, rangeHigh = total × 1.12 | ✅ Task 3 |
| Breadcrumb | ✅ Task 13 |
| CTABanner | ✅ Task 13 |

**Placeholder scan:** None found — every step contains complete code.

**Type consistency:**
- `SolarInputs.tier` = `'T1' | 'T2' | 'T3'` — used consistently across tasks 1, 2, 6
- `BessInputs.kWh` — matches `valuation.bessKwh` mapping in SoftPaywall (explicit field)
- `ConditionInputs.province` — `'gp' | 'wc' | 'kzn' | 'other'` used in model + BreakdownRows
- `ValuationResult.yrCashFlows` — produced by solarModel, consumed by useValuation, passed to DCFBarChart
- All component props flow: `SolarValuationTool` → `Step1/2/3` → sub-components ✅

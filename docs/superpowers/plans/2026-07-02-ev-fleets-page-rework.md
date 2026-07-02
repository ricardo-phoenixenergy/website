# EV Fleets & Infrastructure Page Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework `/solutions/ev-fleets` into a fully-financed EV Fleet-as-a-Service page with a credible Fleet Savings Estimator (grid vs solar), a four-pillar bundle, dual financing, and SA-grounded copy.

**Architecture:** The page stays a Server Component composed from existing reusable sections. New code: a pure, unit-tested estimator calc module + client component (replacing `EvFleetsCalculator`), a CSS-only cost-per-km comparison component, one new icon (`IconTruck`), and a typed content config. Copy lives in the config, mirroring `carbonCreditsContent.ts`.

**Tech Stack:** Next.js App Router · TypeScript strict · Tailwind (arbitrary hex tokens) · Framer Motion (via `AnimatedSection`) · Vitest. No chart library.

## Global Constraints

- TypeScript strict — no `any`; **named exports only**.
- Vertical accent **`#A9D6CB`** (Light Aqua); accent-text **`#1a5a48`**. Accents stay subtle.
- Estimator constants (verbatim, indicative defaults): diesel **R24.00/L**; grid **R2.60/kWh**; solar **R1.50/kWh**; CO₂ diesel **2.68 kg/L**, grid **0.95 kg/kWh**, solar **0.05 kg/kWh**. Vehicle types (diesel L/100km · EV kWh/100km): van **9.0 · 22**, car **7.0 · 17**, minibus **11.0 · 28**, truck **18.0 · 60**.
- The estimator is **ungated** (no lead wall); footnote marks figures indicative and notes CO₂ depends on grid vs solar.
- Sourced SA facts only (carbon tax R308/t 2026 → R462/t 2030; diesel ~R24/L, ~R32/L spike 2026; 23–27% lower TCO across 12.5M km; grid ~0.95 kg CO₂/kWh; Section 12B = **100%**). Do NOT claim: BYD commercial vans in SA, 125% solar deduction, consumer EV subsidy, or unverified clients.
- Curly apostrophes (U+2019) in `.ts`/`.tsx` string literals; `&apos;`/`&amp;` in JSX **text**.
- Verify per task: `npx tsc --noEmit`, `npx eslint <files>`, and where noted `npm run build` (confirm `○ /solutions/ev-fleets` stays static).

---

## File Structure

- `src/lib/evfleet/estimate.ts` — constants, `FLEET_VEHICLES`, `estimateFleet()`. The math.
- `src/lib/evfleet/estimate.test.ts` — Vitest unit tests.
- `src/components/sections/calculators/FleetSavingsEstimator.tsx` — client hero widget.
- `src/components/sections/CostPerKmBars.tsx` — CSS bar visual (imports constants).
- `src/config/evFleetsContent.ts` — typed `EV_FLEETS` copy object.
- `src/components/ui/Icons.tsx` — add `IconTruck`.
- `src/components/sections/ExplainerCards.tsx` — register `Truck` icon.
- `src/lib/analytics.ts` — add one `DlEvent` variant.
- `src/app/solutions/ev-fleets/page.tsx` — recompose.
- `src/components/sections/calculators/EvFleetsCalculator.tsx` — **deleted**.

---

### Task 1: Add IconTruck and register it in ExplainerCards

**Files:**
- Modify: `src/components/ui/Icons.tsx` (add `IconTruck`)
- Modify: `src/components/sections/ExplainerCards.tsx` (register `Truck`)

**Interfaces:**
- Consumes: existing `IconProps` convention in Icons.tsx.
- Produces: `IconTruck` (named export) and `'Truck'` as a valid `ExplainerIcon` member usable in `ExplainerCardItem.icon`.

- [ ] **Step 1: Add the icon**

In `src/components/ui/Icons.tsx`, add this named export near the other icons (follow the file's existing `IconProps`/base-props pattern — `fill:none, stroke:currentColor, strokeWidth:2.5, viewBox 0 0 24 24`):

```tsx
export function IconTruck({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h11v9H3z" />
      <path d="M14 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}
```

> If the file's icon signature differs (e.g. it destructures differently), match the file's exact convention — read one neighbouring icon first.

- [ ] **Step 2: Register `Truck` in ExplainerCards**

In `src/components/sections/ExplainerCards.tsx`:
- add `IconTruck` to the existing `import { ... } from '@/components/ui/Icons';`
- add `'Truck'` to the `ExplainerIcon` union type
- add `Truck: (s) => <IconTruck size={s} />,` to the `ICONS` record

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit`
Then: `npx eslint src/components/ui/Icons.tsx src/components/sections/ExplainerCards.tsx`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Icons.tsx src/components/sections/ExplainerCards.tsx
git commit -m "feat(icons): add IconTruck and register it in ExplainerCards"
```

---

### Task 2: Fleet estimator calc module

**Files:**
- Create: `src/lib/evfleet/estimate.ts`
- Test: `src/lib/evfleet/estimate.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `estimateFleet(input: FleetInput): FleetEstimate`, the constants, `FLEET_VEHICLES`, and types `FleetVehicleType = 'van'|'car'|'minibus'|'truck'`, `ChargingSource = 'grid'|'solar'`. `FleetInput = { vehicles: number; type: FleetVehicleType; kmPerMonth: number; charging: ChargingSource }`. `FleetEstimate = { dieselCostPerKm: number; evCostPerKm: number; monthlySaving: number; annualSaving: number; fiveYearSaving: number; co2AvoidedTonnesYear: number }`. Later tasks import from `@/lib/evfleet/estimate`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/evfleet/estimate.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { estimateFleet } from './estimate';

describe('estimateFleet', () => {
  it('10 vans, 2500 km/mo, grid', () => {
    const e = estimateFleet({ vehicles: 10, type: 'van', kmPerMonth: 2500, charging: 'grid' });
    expect(e.dieselCostPerKm).toBeCloseTo(2.16, 2);
    expect(e.evCostPerKm).toBeCloseTo(0.572, 3);
    expect(e.monthlySaving).toBe(39700);
    expect(e.annualSaving).toBe(476400);
    expect(e.fiveYearSaving).toBe(2382000);
    expect(e.co2AvoidedTonnesYear).toBe(9.7);
  });

  it('10 vans, 2500 km/mo, solar — cheaper per km and far more CO2 avoided', () => {
    const e = estimateFleet({ vehicles: 10, type: 'van', kmPerMonth: 2500, charging: 'solar' });
    expect(e.evCostPerKm).toBeCloseTo(0.33, 2);
    expect(e.monthlySaving).toBe(45750);
    expect(e.co2AvoidedTonnesYear).toBe(69.1);
  });

  it('heavy trucks still save money on grid', () => {
    const e = estimateFleet({ vehicles: 5, type: 'truck', kmPerMonth: 4000, charging: 'grid' });
    expect(e.dieselCostPerKm).toBeCloseTo(4.32, 2);
    expect(e.evCostPerKm).toBeCloseTo(1.56, 2);
    expect(e.monthlySaving).toBe(55200);
  });

  it('heavy EV on the coal grid can avoid negative CO2 (honest behaviour)', () => {
    const e = estimateFleet({ vehicles: 5, type: 'truck', kmPerMonth: 4000, charging: 'grid' });
    expect(e.co2AvoidedTonnesYear).toBeLessThan(0);
  });

  it('zero vehicles → zero savings', () => {
    const e = estimateFleet({ vehicles: 0, type: 'van', kmPerMonth: 2500, charging: 'grid' });
    expect(e.monthlySaving).toBe(0);
    expect(e.annualSaving).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/evfleet/estimate.test.ts`
Expected: FAIL — cannot resolve `./estimate`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/evfleet/estimate.ts`:

```typescript
// Pure EV-fleet vs diesel savings estimator for the EV Fleets page.
// All prices ZAR; energy costs are per km; CO2 in kg unless noted.

export const DIESEL_PRICE_PER_L = 24.0;
export const GRID_RATE_PER_KWH = 2.60;
export const SOLAR_RATE_PER_KWH = 1.50;
export const CO2_DIESEL_PER_L = 2.68;
export const CO2_GRID_PER_KWH = 0.95;
export const CO2_SOLAR_PER_KWH = 0.05;

export type FleetVehicleType = 'van' | 'car' | 'minibus' | 'truck';
export type ChargingSource = 'grid' | 'solar';

export interface VehicleProfile {
  label: string;
  dieselLPer100: number;
  evKwhPer100: number;
}

export const FLEET_VEHICLES: Record<FleetVehicleType, VehicleProfile> = {
  van:     { label: 'Light delivery van', dieselLPer100: 9.0,  evKwhPer100: 22 },
  car:     { label: 'Passenger / car',    dieselLPer100: 7.0,  evKwhPer100: 17 },
  minibus: { label: 'Minibus / shuttle',  dieselLPer100: 11.0, evKwhPer100: 28 },
  truck:   { label: 'Medium truck (~4t)', dieselLPer100: 18.0, evKwhPer100: 60 },
};

export interface FleetInput {
  vehicles: number;
  type: FleetVehicleType;
  kmPerMonth: number; // per vehicle
  charging: ChargingSource;
}

export interface FleetEstimate {
  dieselCostPerKm: number;
  evCostPerKm: number;
  monthlySaving: number;        // ZAR, whole fleet
  annualSaving: number;
  fiveYearSaving: number;
  co2AvoidedTonnesYear: number; // tonnes/yr, whole fleet; can be <= 0 on grid for heavy EVs
}

export function estimateFleet(input: FleetInput): FleetEstimate {
  const v = FLEET_VEHICLES[input.type];
  const rate = input.charging === 'solar' ? SOLAR_RATE_PER_KWH : GRID_RATE_PER_KWH;
  const co2Rate = input.charging === 'solar' ? CO2_SOLAR_PER_KWH : CO2_GRID_PER_KWH;

  // Multiply-then-divide keeps the doubles clean (e.g. 9*24/100 === 2.16).
  const dieselCostPerKm = (v.dieselLPer100 * DIESEL_PRICE_PER_L) / 100;
  const evCostPerKm = (v.evKwhPer100 * rate) / 100;

  const fleetKmMonth = input.vehicles * input.kmPerMonth;
  const monthlySaving = Math.round(fleetKmMonth * (dieselCostPerKm - evCostPerKm));
  const annualSaving = monthlySaving * 12;
  const fiveYearSaving = annualSaving * 5;

  const co2DieselPerKm = (v.dieselLPer100 * CO2_DIESEL_PER_L) / 100;
  const co2EvPerKm = (v.evKwhPer100 * co2Rate) / 100;
  const co2AvoidedTonnesYear =
    Math.round((fleetKmMonth * 12 * (co2DieselPerKm - co2EvPerKm)) / 1000 * 10) / 10;

  return { dieselCostPerKm, evCostPerKm, monthlySaving, annualSaving, fiveYearSaving, co2AvoidedTonnesYear };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/evfleet/estimate.test.ts`
Expected: PASS — 5/5.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/evfleet/estimate.ts src/lib/evfleet/estimate.test.ts
git commit -m "feat(evfleet): fleet savings estimator calc with tests"
```

---

### Task 3: FleetSavingsEstimator client component (+ analytics event)

**Files:**
- Create: `src/components/sections/calculators/FleetSavingsEstimator.tsx`
- Modify: `src/lib/analytics.ts`

**Interfaces:**
- Consumes: `estimateFleet`, `FLEET_VEHICLES`, `FleetVehicleType`, `ChargingSource` from `@/lib/evfleet/estimate`; `dlPush` from `@/lib/analytics`.
- Produces: named export `FleetSavingsEstimator` (no props).

- [ ] **Step 1: Add the analytics variant**

In `src/lib/analytics.ts`, add this line to the `DlEvent` union (after the `carbon_estimate_used` line):

```typescript
  | { event: 'fleet_estimate_used';           vertical: string; vehicles: number; charging: string }
```

- [ ] **Step 2: Create the component**

Create `src/components/sections/calculators/FleetSavingsEstimator.tsx`:

```tsx
// src/components/sections/calculators/FleetSavingsEstimator.tsx
'use client';

import { useState } from 'react';
import { dlPush } from '@/lib/analytics';
import {
  estimateFleet, FLEET_VEHICLES,
  type FleetVehicleType, type ChargingSource,
} from '@/lib/evfleet/estimate';

const ACCENT = '#A9D6CB';
const ACCENT_TEXT = '#1a5a48';

const TYPES: FleetVehicleType[] = ['van', 'car', 'minibus', 'truck'];
const TYPE_LABEL: Record<FleetVehicleType, string> = {
  van: 'Van', car: 'Car', minibus: 'Minibus', truck: 'Truck',
};

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${Math.round(n / 1_000)}k`;
  return `R${Math.round(n)}`;
}

export function FleetSavingsEstimator() {
  const [vehicles, setVehicles] = useState(10);
  const [type, setType] = useState<FleetVehicleType>('van');
  const [kmPerMonth, setKmPerMonth] = useState(2500);
  const [charging, setCharging] = useState<ChargingSource>('grid');
  const [used, setUsed] = useState(false);

  const est = estimateFleet({ vehicles, type, kmPerMonth, charging });
  const co2 = Math.max(0, est.co2AvoidedTonnesYear);

  function touch() {
    if (used) return;
    setUsed(true);
    dlPush({ event: 'fleet_estimate_used', vertical: 'ev-fleets', vehicles, charging });
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your fleet savings
      </p>

      {/* Vehicles */}
      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Number of vehicles</span>
        <span className="font-display font-extrabold text-sm text-white">{vehicles}</span>
      </div>
      <input
        type="range" min={1} max={100} step={1} value={vehicles}
        onChange={(e) => { setVehicles(Number(e.target.value)); touch(); }}
        className="w-full mb-5" style={{ accentColor: ACCENT }} aria-label="Number of vehicles"
      />

      {/* Vehicle type */}
      <p className="font-body text-sm text-white/70 mb-2">Vehicle type</p>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {TYPES.map((t) => {
          const sel = type === t;
          return (
            <button
              key={t} type="button"
              onClick={() => { setType(t); touch(); }}
              className="rounded-lg py-2 font-body text-xs font-semibold transition-colors"
              style={sel
                ? { background: ACCENT, color: ACCENT_TEXT }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {TYPE_LABEL[t]}
            </button>
          );
        })}
      </div>

      {/* Distance */}
      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Distance per vehicle</span>
        <span className="font-display font-extrabold text-sm text-white">{kmPerMonth.toLocaleString('en-ZA')} km/mo</span>
      </div>
      <input
        type="range" min={500} max={8000} step={500} value={kmPerMonth}
        onChange={(e) => { setKmPerMonth(Number(e.target.value)); touch(); }}
        className="w-full mb-5" style={{ accentColor: ACCENT }} aria-label="Distance per vehicle per month"
      />

      {/* Charging source */}
      <p className="font-body text-sm text-white/70 mb-2">Charging source</p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {(['grid', 'solar'] as ChargingSource[]).map((c) => {
          const sel = charging === c;
          return (
            <button
              key={c} type="button"
              onClick={() => { setCharging(c); touch(); }}
              className="rounded-lg py-2.5 font-body text-sm font-semibold transition-colors"
              style={sel
                ? { background: ACCENT, color: ACCENT_TEXT }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {c === 'grid' ? 'Grid' : 'Solar + battery'}
            </button>
          );
        })}
      </div>

      {/* Outputs */}
      <div className="rounded-xl p-4 text-center mb-3" style={{ background: ACCENT }}>
        <p className="font-body text-xs mb-1" style={{ color: `${ACCENT_TEXT}99` }}>Est. monthly fleet saving</p>
        <p className="font-display font-extrabold text-2xl" style={{ color: ACCENT_TEXT }}>{formatRand(est.monthlySaving)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-body text-[11px] mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Annual saving</p>
          <p className="font-display font-extrabold text-base text-white">{formatRand(est.annualSaving)}</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-body text-[11px] mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>5-year saving</p>
          <p className="font-display font-extrabold text-base text-white">{formatRand(est.fiveYearSaving)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl p-3 mb-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="font-body text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Cost per km: diesel vs electric</span>
        <span className="font-display font-bold text-sm text-white">
          R{est.dieselCostPerKm.toFixed(2)} <span style={{ color: ACCENT }}>&rarr;</span> R{est.evCostPerKm.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="font-body text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
          CO&#8322; avoided / year{charging === 'grid' ? ' — charge from solar for more' : ''}
        </span>
        <span className="font-display font-bold text-sm text-white">~{co2.toLocaleString('en-ZA')} t</span>
      </div>

      <p className="font-body text-[10px] mt-3 text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Indicative only. Assumes diesel ~R24/L, depot charging R2.60/kWh (solar R1.50/kWh) and typical efficiency. Actual savings depend on your routes and tariffs; CO&#8322; depends on charging from grid vs solar.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit`
Then: `npx eslint src/components/sections/calculators/FleetSavingsEstimator.tsx src/lib/analytics.ts`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/calculators/FleetSavingsEstimator.tsx src/lib/analytics.ts
git commit -m "feat(evfleet): Fleet Savings Estimator hero widget + analytics event"
```

---

### Task 4: CostPerKmBars component

**Files:**
- Create: `src/components/sections/CostPerKmBars.tsx`

**Interfaces:**
- Consumes: `FLEET_VEHICLES`, `DIESEL_PRICE_PER_L`, `GRID_RATE_PER_KWH`, `SOLAR_RATE_PER_KWH` from `@/lib/evfleet/estimate`.
- Produces: named export `CostPerKmBars` with optional prop `{ accent?: string }`.

- [ ] **Step 1: Create the component**

Create `src/components/sections/CostPerKmBars.tsx`:

```tsx
// src/components/sections/CostPerKmBars.tsx — CSS cost-per-km comparison (light delivery van)
import {
  FLEET_VEHICLES, DIESEL_PRICE_PER_L, GRID_RATE_PER_KWH, SOLAR_RATE_PER_KWH,
} from '@/lib/evfleet/estimate';

interface CostPerKmBarsProps {
  accent?: string;
}

export function CostPerKmBars({ accent = '#A9D6CB' }: CostPerKmBarsProps) {
  const v = FLEET_VEHICLES.van;
  const diesel = (v.dieselLPer100 * DIESEL_PRICE_PER_L) / 100;
  const grid = (v.evKwhPer100 * GRID_RATE_PER_KWH) / 100;
  const solar = (v.evKwhPer100 * SOLAR_RATE_PER_KWH) / 100;
  const max = diesel;

  const rows: { label: string; value: number; color: string }[] = [
    { label: 'Diesel', value: diesel, color: '#C2703D' },
    { label: 'Electric — grid charged', value: grid, color: accent },
    { label: 'Electric — solar charged', value: solar, color: '#39575C' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-body text-sm font-semibold text-[#1A1A1A]">{r.label}</span>
            <span className="font-display font-extrabold text-sm text-[#1A1A1A]">R{r.value.toFixed(2)} / km</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#EDEFEF' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.max(6, (r.value / max) * 100)}%`, background: r.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit`
Then: `npx eslint src/components/sections/CostPerKmBars.tsx`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/CostPerKmBars.tsx
git commit -m "feat(evfleet): CSS cost-per-km comparison bars"
```

---

### Task 5: EV Fleets content config

**Files:**
- Create: `src/config/evFleetsContent.ts`

**Interfaces:**
- Consumes: `ExplainerCardItem` (`@/components/sections/ExplainerCards`, includes the new `'Truck'` icon), `FaqItem` (`@/components/sections/FaqAccordion`), `FinancingOption` (`@/components/sections/FinancingCards`).
- Produces: named export `EV_FLEETS` with shape: `{ hero: { title: string; subtitle: string }; whyNow: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] }; pillars: { eyebrow: string; heading: string; cards: ExplainerCardItem[] }; financing: { eyebrow: string; heading: string; options: FinancingOption[]; note: string }; industries: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[]; vehiclesKicker: string; vehicles: { label: string; spec: string }[] }; costPerKm: { eyebrow: string; heading: string; statValue: string; statLabel: string; note: string }; faq: { heading: string; items: FaqItem[] }; cta: { eyebrow: string; heading: string; body: string } }`. Task 6 imports `EV_FLEETS`.

- [ ] **Step 1: Create the config file**

Create `src/config/evFleetsContent.ts`:

```typescript
// src/config/evFleetsContent.ts
import type { ExplainerCardItem } from '@/components/sections/ExplainerCards';
import type { FaqItem } from '@/components/sections/FaqAccordion';
import type { FinancingOption } from '@/components/sections/FinancingCards';

export const EV_FLEETS: {
  hero: { title: string; subtitle: string };
  whyNow: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] };
  pillars: { eyebrow: string; heading: string; cards: ExplainerCardItem[] };
  financing: { eyebrow: string; heading: string; options: FinancingOption[]; note: string };
  industries: {
    eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[];
    vehiclesKicker: string; vehicles: { label: string; spec: string }[];
  };
  costPerKm: { eyebrow: string; heading: string; statValue: string; statLabel: string; note: string };
  faq: { heading: string; items: FaqItem[] };
  cta: { eyebrow: string; heading: string; body: string };
} = {
  hero: {
    title: 'Electrify your fleet — <em>fully financed, end to end</em>.',
    subtitle:
      'Phoenix supplies and funds the whole transition: electric vehicles, depot charging, and on-site solar and battery storage — as one managed package. Cut your fuel bill, fix your energy cost, and cut emissions, without the upfront capital.',
  },

  whyNow: {
    eyebrow: 'Why now',
    heading: 'The economics of running a diesel fleet have <em>turned</em>.',
    subtitle:
      'Fuel and carbon costs are rising and volatile — while electric fleets charged from your own solar lock in a lower, stable cost per kilometre. In South Africa, the case is now proven at scale.',
    cards: [
      { icon: 'TrendingUp', title: 'Diesel is volatile and only taxed more', body: 'Diesel sits around R24 a litre and spiked near R32 in 2026. A carbon fuel levy is added at the pump, and the underlying carbon tax rises from R308 a tonne in 2026 to R462 by 2030.' },
      { icon: 'Zap', title: 'Grid power keeps climbing', body: 'Eskom tariffs rise around 9% a year. Charging from on-site solar and battery storage fixes your energy cost and insulates the fleet from tariff hikes and grid risk.' },
      { icon: 'Award', title: 'The savings are proven here', body: 'Across 12.5 million real South African kilometres, electric fleets run 23–27% cheaper than diesel — at Woolworths, DSV, Clicks and Takealot — with full operational availability.' },
    ],
  },

  pillars: {
    eyebrow: 'One managed package',
    heading: 'Everything your fleet needs to go electric — <em>from one partner</em>.',
    cards: [
      { icon: 'Truck', title: 'Electric vehicles', body: 'We source and supply the right electric vehicles for your duty cycle — vans, bakkies, urban trucks, minibuses and buses available in South Africa.' },
      { icon: 'Zap', title: 'Depot charging', body: 'SANS-certified AC and DC charging, designed around your routes and depots, with smart load management to avoid demand spikes.' },
      { icon: 'Sun', title: 'Solar + battery storage', body: 'Charge from on-site solar and BESS for the lowest, most stable cost per kilometre — and real emissions cuts the grid alone can’t deliver.' },
      { icon: 'DollarSign', title: 'Financing', body: 'We fund the whole transition, so you can go electric without the upfront capital. Subscription or financed-to-own — your choice.' },
    ],
  },

  financing: {
    eyebrow: 'Fleet-as-a-Service',
    heading: 'Go electric with <em>zero upfront capital</em>.',
    options: [
      {
        icon: 'agreement',
        title: 'Fleet-as-a-Service',
        tag: 'Zero capital',
        description: 'Phoenix owns and operates the vehicles, chargers and solar. You pay a fixed monthly fee — or a rate per kilometre — with maintenance, insurance and charging included. Scale the fleet up or down as you grow.',
        benefits: ['R0 upfront capital.', 'Fixed monthly or per-km pricing.', 'Maintenance, insurance & charging included.', 'Fully managed — we run and optimise it.'],
      },
      {
        icon: 'purchase',
        title: 'Financed-to-own',
        tag: 'Own the assets',
        description: 'We arrange funding across the vehicles, charging and solar so you own the fleet and infrastructure outright over the term. The on-site solar qualifies for the Section 12B 100% first-year tax deduction.',
        benefits: ['Assets on your balance sheet.', 'Funding across vehicles + charging + solar.', 'Section 12B 100% solar deduction.', 'Own it outright at end of term.'],
      },
    ],
    note: 'All financing is subject to credit approval. Section 12B and tax treatment should be confirmed with your tax advisor.',
  },

  industries: {
    eyebrow: 'Built for your operation',
    heading: 'Electrification pays off first for <em>return-to-depot fleets</em>.',
    subtitle:
      'If your vehicles run predictable routes and come home to a depot each night, they can charge cheaply from solar and deliver the strongest savings.',
    cards: [
      { icon: 'Truck', title: 'Last-mile & e-commerce delivery', body: 'Dense urban routes, nightly depot charging, high stop-start running — the best-proven fit in South Africa.' },
      { icon: 'Thermometer', title: 'Cold-chain & refrigerated', body: 'Solar-powered refrigeration removes a second diesel burn — as Clicks and UPD proved with SA’s first solar-refrigerated EV fleet.' },
      { icon: 'Layers', title: 'FMCG & retail distribution', body: 'Scheduled depot-to-store loops with large, solar-ready distribution centres.' },
      { icon: 'Users', title: 'Staff & shuttle transport', body: 'Fixed timetabled routes that return to base between shifts — ideal for overnight charging.' },
      { icon: 'Building', title: 'Municipal & public transport', body: 'Defined urban routes and depots — already live with Golden Arrow and MyCiTi in Cape Town.' },
      { icon: 'TrendingUp', title: 'Regional logistics', body: 'Depot-to-depot lanes where predictable distance and return-to-base make electric viable today.' },
    ],
    vehiclesKicker: 'Vehicles we supply',
    vehicles: [
      { label: 'Electric vans', spec: 'Panel & delivery vans, ~220–300 km range' },
      { label: 'Electric bakkies', spec: 'Double-cab e-bakkies, up to ~450 km' },
      { label: 'Urban trucks (~4t)', spec: 'City distribution, ~200 km range' },
      { label: 'Heavy trucks', spec: 'Regional distribution & superlink' },
      { label: 'Minibuses & buses', spec: 'Staff, shuttle & public transport' },
    ],
  },

  costPerKm: {
    eyebrow: 'The numbers',
    heading: 'Diesel is the most expensive way to move your fleet.',
    statValue: '23–27%',
    statLabel: 'lower total cost of ownership — measured across 12.5M km of SA electric-fleet operation (Everlectric).',
    note: 'Energy cost only, for a light delivery van; excludes maintenance (typically ~35% lower for EVs). On South Africa’s coal-heavy grid the carbon saving is modest — charging from solar is what turns cost savings into deep emissions cuts.',
  },

  faq: {
    heading: 'Fleet electrification, answered.',
    items: [
      { question: 'What if my vehicles don’t return to a depot each night?', answer: 'Depot charging is where electric fleets save the most, because you charge cheaply overnight from solar. If your routes don’t return to base, we’ll tell you honestly at the assessment whether electrification stacks up yet.' },
      { question: 'Is the range enough for our routes?', answer: 'Most last-mile and urban routes run 150–220 km a day, well within the range of the vehicles we supply. We match vehicle range to your actual duty cycles during the assessment.' },
      { question: 'What happens during load-shedding?', answer: 'Charging from on-site solar and battery storage keeps your fleet moving independently of the grid — one of the main reasons we bundle solar and BESS into the package.' },
      { question: 'Do we need capital to start?', answer: 'No. With Fleet-as-a-Service you pay a fixed monthly or per-kilometre fee with zero upfront capital. If you prefer to own the assets, we arrange financing to own them over the term.' },
      { question: 'How much cheaper is it really?', answer: 'Across 12.5 million kilometres of South African operation, electric fleets have run 23–27% cheaper than diesel. Your saving depends on distance, vehicle type and whether you charge from solar — our estimator gives an indicative figure and the assessment confirms it.' },
      { question: 'What about battery life and resale?', answer: 'Fleet EV batteries are warrantied for years of commercial use, and under Fleet-as-a-Service the battery and residual-value risk sits with us, not you.' },
    ],
  },

  cta: {
    eyebrow: 'Electrify your fleet',
    heading: 'See what electric could save your fleet',
    body: 'Book a free fleet assessment — we’ll analyse your routes and fuel spend and show you the vehicles, charging and financing that make the switch pay.',
  },
};
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit`
Then: `npx eslint src/config/evFleetsContent.ts`
Expected: no errors — every `icon` is a valid `ExplainerIcon` (incl. `Truck`), every `FinancingOption.icon` is `agreement|purchase`, and the object satisfies its declared type.

- [ ] **Step 3: Commit**

```bash
git add src/config/evFleetsContent.ts
git commit -m "feat(evfleet): content config for reworked EV Fleets page"
```

---

### Task 6: Recompose the page + retire EvFleetsCalculator

**Files:**
- Modify (full render-tree rewrite): `src/app/solutions/ev-fleets/page.tsx`
- Delete: `src/components/sections/calculators/EvFleetsCalculator.tsx`

**Interfaces:**
- Consumes: `FleetSavingsEstimator` (T3), `CostPerKmBars` (T4), `EV_FLEETS` (T5), and existing `SolutionHero`, `ExplainerCards`, `FinancingBand`, `HowItWorks`, `FeaturedProjects`, `FaqAccordion`, `RelatedArticles`, `PageFooter`, `getHowItWorks`, `getHeroImages`, `VERTICAL_CONFIG`, `SOLUTION_META`.
- Produces: the rendered page.

- [ ] **Step 1: Rewrite `src/app/solutions/ev-fleets/page.tsx`**

Replace the entire file with:

```tsx
// src/app/solutions/ev-fleets/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { ExplainerCards } from '@/components/sections/ExplainerCards';
import { FinancingBand } from '@/components/sections/FinancingBand';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { FleetSavingsEstimator } from '@/components/sections/calculators/FleetSavingsEstimator';
import { CostPerKmBars } from '@/components/sections/CostPerKmBars';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import { EV_FLEETS } from '@/config/evFleetsContent';

const vertical = 'ev-fleets' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}`, images: [{ url: 'https://phoenixenergy.solutions/og-solutions-ev-fleets.png', width: 1200, height: 630 }] },
};

export const revalidate = 3600;

export default async function EvFleetsPage() {
  const howItWorks = await getHowItWorks(vertical);
  const hero = (await getHeroImages())[vertical];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: meta.label,
    provider: { '@type': 'Organization', name: 'Phoenix Energy' },
    description: cfg.seoDescription,
    url: `https://phoenixenergy.solutions/solutions/${vertical}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* §1 — Hero + fleet savings estimator */}
      <SolutionHero
        title={EV_FLEETS.hero.title}
        subtitle={EV_FLEETS.hero.subtitle}
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #0f2a28 50%, #1a4040 100%)"
        primaryCta={{ label: 'Book a Fleet Assessment', href: '/contact' }}
      >
        <FleetSavingsEstimator />
      </SolutionHero>

      {/* §2 — Why now (SA) */}
      <ExplainerCards
        id="why-now"
        background="white"
        eyebrow={EV_FLEETS.whyNow.eyebrow}
        heading={EV_FLEETS.whyNow.heading}
        subtitle={EV_FLEETS.whyNow.subtitle}
        accent={meta.accent}
        columns={3}
        cards={EV_FLEETS.whyNow.cards}
      />

      {/* §3 — Four pillars */}
      <ExplainerCards
        id="the-package"
        background="gray"
        eyebrow={EV_FLEETS.pillars.eyebrow}
        heading={EV_FLEETS.pillars.heading}
        accent={meta.accent}
        columns={4}
        cards={EV_FLEETS.pillars.cards}
      />

      {/* §4 — Financing (centrepiece) */}
      <FinancingBand
        eyebrow={EV_FLEETS.financing.eyebrow}
        heading={EV_FLEETS.financing.heading}
        options={EV_FLEETS.financing.options}
        accent={meta.accent}
        accentText={meta.accentText}
      />
      <div className="bg-[#F5F5F5] pb-12 md:pb-[52px] -mt-2">
        <p className="page-container font-body text-[11px] text-[#6B7280]">{EV_FLEETS.financing.note}</p>
      </div>

      {/* §5 — Industries + vehicles */}
      <ExplainerCards
        id="who-its-for"
        background="white"
        eyebrow={EV_FLEETS.industries.eyebrow}
        heading={EV_FLEETS.industries.heading}
        subtitle={EV_FLEETS.industries.subtitle}
        accent={meta.accent}
        columns={3}
        cards={EV_FLEETS.industries.cards}
        footer={
          <div className="mt-10">
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-4">
              {EV_FLEETS.industries.vehiclesKicker}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {EV_FLEETS.industries.vehicles.map((v) => (
                <div key={v.label} className="rounded-xl p-4 bg-[#F5F5F5] border border-[#E5E7EB]">
                  <p className="font-display font-bold text-sm text-[#1A1A1A] mb-1">{v.label}</p>
                  <p className="font-body text-xs text-[#6B7280] leading-snug">{v.spec}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* §6 — Cost per km */}
      <section className="bg-[#F5F5F5] py-16 md:py-24">
        <div className="page-container max-w-3xl">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: meta.accent }}>
            {EV_FLEETS.costPerKm.eyebrow}
          </p>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2] mb-8">
            {EV_FLEETS.costPerKm.heading}
          </h2>
          <CostPerKmBars accent={meta.accent} />
          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-display font-extrabold text-3xl" style={{ color: meta.accentText }}>
              {EV_FLEETS.costPerKm.statValue}
            </span>
            <span className="font-body text-sm text-[#6B7280] leading-snug">{EV_FLEETS.costPerKm.statLabel}</span>
          </div>
          <p className="font-body text-[11px] text-[#9CA3AF] mt-5 leading-relaxed">{EV_FLEETS.costPerKm.note}</p>
        </div>
      </section>

      {/* §7 — How it works (Sanity-driven) */}
      {howItWorks && <HowItWorks {...howItWorks} accent={meta.accent} accentText={meta.accentText} />}

      {/* §8 — Proof + FAQ */}
      <FeaturedProjects vertical={vertical} />
      <FaqAccordion
        id="faq"
        eyebrow="FAQ"
        heading={EV_FLEETS.faq.heading}
        items={EV_FLEETS.faq.items}
        accent={meta.accent}
      />
      <RelatedArticles vertical={vertical} />

      {/* §9 — Final CTA */}
      <PageFooter
        ctaVariant="centered"
        eyebrow={EV_FLEETS.cta.eyebrow}
        heading={EV_FLEETS.cta.heading}
        body={EV_FLEETS.cta.body}
        primaryCta={{ label: 'Book a Fleet Assessment', href: '/contact' }}
      />
    </>
  );
}
```

- [ ] **Step 2: Delete the retired calculator**

```bash
git rm src/components/sections/calculators/EvFleetsCalculator.tsx
```

- [ ] **Step 3: Confirm nothing else imports it**

Run: `git grep -n "EvFleetsCalculator" -- 'src/*'`
Expected: no matches. If any remain, switch them to `FleetSavingsEstimator` before continuing.

- [ ] **Step 4: Typecheck + lint**

Run: `npx tsc --noEmit`
Then: `npx eslint src/app/solutions/ev-fleets/page.tsx`
Expected: no errors (old imports `SolutionTabs`, `EvFleetsCalculator`, `TabItem` are gone — confirm no unused-import errors).

- [ ] **Step 5: Build and confirm the route stays static**

Run: `npm run build`
Expected: `✓ Compiled successfully`, route table shows `○ /solutions/ev-fleets`.

- [ ] **Step 6: Commit**

```bash
git add src/app/solutions/ev-fleets/page.tsx
git commit -m "feat(evfleet): recompose EV Fleets page — FaaS repositioning, retire fuel-slider tool"
```

---

## Post-implementation content task (NOT code)

The **§7 "From assessment to a fleet on the road"** steps live in Sanity. After
merge, update the `howItWorks.ev-fleets` document in Sanity Studio (`/studio`) to:

- Title: `From assessment to a fleet on the road` (eyebrow `How it works`)
- Steps (label · description · tag):
  1. Fleet assessment · `We analyse your routes, duty cycles and fuel spend to find which vehicles to electrify first.` · `Free · no obligation`
  2. Design & modelling · `We size the vehicles, depot charging and on-site solar+BESS to your operation.` · `Tailored to your routes`
  3. Financing · `We structure the package — subscription or financed-to-own — so you go electric without upfront capital.` · `Zero-capital option`
  4. Deployment · `Vehicles, chargers and solar are installed, commissioned and integrated.` · `Turnkey`
  5. Operate & optimise · `We run, monitor and optimise charging and energy so your cost per km stays low.` · `Fully managed`

Until updated, the section renders whatever the current Sanity doc holds (or hides if empty). Expected, not a bug.

---

## Self-Review

**Spec coverage:** §1 hero+estimator → T2/T3/T6; §2 why-now → T5/T6; §3 pillars → T1(icon)/T5/T6; §4 financing → T5/T6 (FinancingBand reuse + page disclaimer); §5 industries+vehicles → T1/T5/T6 (ExplainerCards footer slot); §6 cost-per-km → T4/T5/T6; §7 how-it-works → T6 wiring + CMS note; §8 proof+FAQ → T5/T6; §9 CTA → T5/T6; estimator calc + constants → T2; analytics event → T3; delete EvFleetsCalculator → T6. All covered.

**Type consistency:** `estimateFleet`/`FleetEstimate`/`FLEET_VEHICLES`/`FleetVehicleType`/`ChargingSource` identical across T2, T3, T4. `EV_FLEETS` shape declared in T5 matches every access in T6 (`.hero`, `.whyNow`, `.pillars`, `.financing.options`/`.note`, `.industries.cards`/`.vehicles`/`.vehiclesKicker`, `.costPerKm.*`, `.faq.items`, `.cta`). `FinancingOption` icons restricted to `agreement`/`purchase`. Icon strings restricted to valid `ExplainerIcon` members (incl. `Truck` added in T1). `fleet_estimate_used` payload (`vertical`, `vehicles`, `charging`) matches the `dlPush` call in T3. `FinancingBand` props (`eyebrow`, `heading`, `options`, `accent`, `accentText`) match its signature.

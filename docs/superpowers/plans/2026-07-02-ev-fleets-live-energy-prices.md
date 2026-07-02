# EV Fleets — Live Energy Prices + Hero Cost-Per-Km Comparator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make EV Fleets fuel/energy prices editable in Sanity (diesel, petrol 93, grid, solar) and upgrade the hero savings estimator with a heavy-truck class, a fuel toggle, live prices, and a cost-per-km bar visual — removing the standalone §6 "The numbers" section.

**Architecture:** Server component fetches prices from a Sanity singleton via a safe reader (`getEnergyPrices`, never throws, per-field fallback) and passes them to the client widget. All money math stays in the pure, Vitest-tested `estimate.ts` module with prices injected as a parameter. The bar visual is a small presentational component.

**Tech Stack:** Next.js App Router, TypeScript (strict), Tailwind, Sanity (authenticated server client), Vitest.

## Global Constraints

- TypeScript strict, no `any`; **named exports only**.
- Tailwind arbitrary-hex tokens (`text-[#1A1A1A]`, `bg-[#F5F5F5]`, `border-[#E5E7EB]`); never hardcode brand values outside tokens.
- Curly apostrophes (U+2019) in `.ts`/`.tsx` string literals; JSX HTML entities (`&rarr;`, `&#8322;`, `&apos;`, `&amp;`) in JSX text.
- Sanity reads use the authenticated server client `@/lib/sanity.server` (`sanityServerClient`); readers never throw.
- Route `○ /solutions/ev-fleets` must stay **static** (relies on page `revalidate = 3600`).
- Fallback prices: diesel R24.00/L, petrol 93 R24.50/L, grid R2.60/kWh, solar R1.50/kWh. CO₂ factors: diesel 2.68, petrol 2.31, grid 0.95, solar 0.05 kg.
- Petrol is offered for **car/van/minibus only**; medium & heavy truck are diesel-only.
- Per-task verify: `npx tsc --noEmit`, `npx eslint <files>`, `npx vitest run <test files>` (where present). Final task also runs `npm run build` and confirms `○ /solutions/ev-fleets`.

## File Structure

- `src/lib/evfleet/estimate.ts` — pure calc: constants, vehicle profiles, `EnergyPrices`, `vehicleCostPerKm`, `estimateFleet`. (modify)
- `src/lib/evfleet/estimate.test.ts` — calc tests. (modify)
- `src/lib/getEnergyPrices.ts` — Sanity reader + pure `resolveEnergyPrices`. (create)
- `src/lib/getEnergyPrices.test.ts` — reader-resolution tests. (create)
- `src/lib/queries.ts` — add `ENERGY_PRICES_QUERY`. (modify)
- `src/types/sanity.ts` — add `EnergyPricesContent`. (modify)
- `sanity/schemaTypes/energyPrices.ts` — singleton schema. (create)
- `sanity/schemaTypes/index.ts` — register schema. (modify)
- `sanity.config.ts` — studio singleton list item. (modify)
- `src/components/sections/CostPerKmBars.tsx` — presentational dark bars. (rewrite)
- `src/components/sections/calculators/FleetSavingsEstimator.tsx` — hero widget. (modify)
- `src/app/solutions/ev-fleets/page.tsx` — wire prices, delete §6. (modify)
- `src/config/evFleetsContent.ts` — remove dead `costPerKm` block. (modify)

---

### Task 1: Calc model — prices, petrol, heavy truck, `vehicleCostPerKm`

**Files:**
- Modify: `src/lib/evfleet/estimate.ts` (full rewrite of contents below)
- Test: `src/lib/evfleet/estimate.test.ts`
- Modify (compat only, to keep `tsc` green): `src/components/sections/calculators/FleetSavingsEstimator.tsx`

**Interfaces:**
- Produces:
  - `export type FleetVehicleType = 'car' | 'van' | 'minibus' | 'truck' | 'heavytruck'`
  - `export type ChargingSource = 'grid' | 'solar'`
  - `export type FuelType = 'diesel' | 'petrol'`
  - `export interface VehicleProfile { label: string; dieselLPer100: number; petrolLPer100?: number; evKwhPer100: number }`
  - `export const FLEET_VEHICLES: Record<FleetVehicleType, VehicleProfile>`
  - `export interface EnergyPrices { dieselPricePerL: number; petrol93PricePerL: number; gridPricePerKwh: number; solarPricePerKwh: number }`
  - `export const DEFAULT_ENERGY_PRICES: EnergyPrices`
  - `export interface CostPerKm { fuel: number; grid: number; solar: number }`
  - `export function vehicleCostPerKm(type: FleetVehicleType, prices: EnergyPrices, fuel?: FuelType): CostPerKm`
  - `export interface FleetInput { vehicles: number; type: FleetVehicleType; kmPerMonth: number; charging: ChargingSource; fuel?: FuelType }`
  - `export interface FleetEstimate { iceCostPerKm: number; evCostPerKm: number; monthlySaving: number; annualSaving: number; fiveYearSaving: number; co2AvoidedTonnesYear: number }`
  - `export function estimateFleet(input: FleetInput, prices?: EnergyPrices): FleetEstimate`
  - Retains existing exported constants `DIESEL_PRICE_PER_L`, `GRID_RATE_PER_KWH`, `SOLAR_RATE_PER_KWH` (used by other code) plus new `PETROL93_PRICE_PER_L`, `CO2_PETROL_PER_L`.

- [ ] **Step 1: Update the tests first (rename + new cases)**

Replace the entire contents of `src/lib/evfleet/estimate.test.ts` with:

```typescript
import { describe, it, expect } from 'vitest';
import {
  estimateFleet, vehicleCostPerKm, DEFAULT_ENERGY_PRICES, type EnergyPrices,
} from './estimate';

describe('estimateFleet', () => {
  it('10 vans, 2500 km/mo, grid, diesel', () => {
    const e = estimateFleet({ vehicles: 10, type: 'van', kmPerMonth: 2500, charging: 'grid' });
    expect(e.iceCostPerKm).toBeCloseTo(2.16, 2);
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

  it('medium trucks still save money on grid', () => {
    const e = estimateFleet({ vehicles: 5, type: 'truck', kmPerMonth: 4000, charging: 'grid' });
    expect(e.iceCostPerKm).toBeCloseTo(4.32, 2);
    expect(e.evCostPerKm).toBeCloseTo(1.56, 2);
    expect(e.monthlySaving).toBe(55200);
  });

  it('heavy EV on the coal grid can avoid negative CO2 (honest behaviour)', () => {
    const e = estimateFleet({ vehicles: 5, type: 'truck', kmPerMonth: 4000, charging: 'grid' });
    expect(e.co2AvoidedTonnesYear).toBeLessThan(0);
  });

  it('petrol car uses petrol consumption + price', () => {
    const e = estimateFleet({ vehicles: 10, type: 'car', kmPerMonth: 2000, charging: 'grid', fuel: 'petrol' });
    // 8 L/100km * R24.50 / 100 = 1.96
    expect(e.iceCostPerKm).toBeCloseTo(1.96, 2);
  });

  it('custom prices override the defaults', () => {
    const prices: EnergyPrices = { dieselPricePerL: 30, petrol93PricePerL: 30, gridPricePerKwh: 2.6, solarPricePerKwh: 1.5 };
    const e = estimateFleet({ vehicles: 10, type: 'van', kmPerMonth: 2500, charging: 'grid' }, prices);
    expect(e.iceCostPerKm).toBeCloseTo(2.7, 2); // 9 * 30 / 100
  });

  it('zero vehicles → zero savings', () => {
    const e = estimateFleet({ vehicles: 0, type: 'van', kmPerMonth: 2500, charging: 'grid' });
    expect(e.monthlySaving).toBe(0);
    expect(e.annualSaving).toBe(0);
  });
});

describe('vehicleCostPerKm', () => {
  it('van diesel at default prices', () => {
    const c = vehicleCostPerKm('van', DEFAULT_ENERGY_PRICES, 'diesel');
    expect(c.fuel).toBeCloseTo(2.16, 2);
    expect(c.grid).toBeCloseTo(0.572, 3);
    expect(c.solar).toBeCloseTo(0.33, 2);
  });

  it('car petrol uses petrol figures', () => {
    const c = vehicleCostPerKm('car', DEFAULT_ENERGY_PRICES, 'petrol');
    expect(c.fuel).toBeCloseTo(1.96, 2); // 8 * 24.5 / 100
  });

  it('heavy truck has no petrol → falls back to diesel', () => {
    const c = vehicleCostPerKm('heavytruck', DEFAULT_ENERGY_PRICES, 'petrol');
    expect(c.fuel).toBeCloseTo(7.92, 2); // 33 * 24 / 100 (diesel)
  });
});
```

- [ ] **Step 2: Run the tests — verify they fail**

Run: `npx vitest run src/lib/evfleet/estimate.test.ts`
Expected: FAIL (e.g. `iceCostPerKm` undefined / `vehicleCostPerKm` is not a function).

- [ ] **Step 3: Rewrite `src/lib/evfleet/estimate.ts`**

Replace the entire file with:

```typescript
// Pure EV-fleet vs diesel/petrol savings estimator for the EV Fleets page.
// All prices ZAR; energy costs are per km; CO2 in kg unless noted.

export const DIESEL_PRICE_PER_L = 24.0;
export const PETROL93_PRICE_PER_L = 24.5;
export const GRID_RATE_PER_KWH = 2.6;
export const SOLAR_RATE_PER_KWH = 1.5;
export const CO2_DIESEL_PER_L = 2.68;
export const CO2_PETROL_PER_L = 2.31;
export const CO2_GRID_PER_KWH = 0.95;
export const CO2_SOLAR_PER_KWH = 0.05;

export type FleetVehicleType = 'car' | 'van' | 'minibus' | 'truck' | 'heavytruck';
export type ChargingSource = 'grid' | 'solar';
export type FuelType = 'diesel' | 'petrol';

export interface VehicleProfile {
  label: string;
  dieselLPer100: number;
  petrolLPer100?: number; // omitted where petrol is not realistic (trucks)
  evKwhPer100: number;
}

export const FLEET_VEHICLES: Record<FleetVehicleType, VehicleProfile> = {
  car:        { label: 'Passenger / car',      dieselLPer100: 7.0,  petrolLPer100: 8.0,  evKwhPer100: 17 },
  van:        { label: 'Light delivery van',   dieselLPer100: 9.0,  petrolLPer100: 11.0, evKwhPer100: 22 },
  minibus:    { label: 'Minibus / shuttle',    dieselLPer100: 11.0, petrolLPer100: 13.0, evKwhPer100: 28 },
  truck:      { label: 'Medium truck (~4–8t)', dieselLPer100: 18.0, evKwhPer100: 60 },
  heavytruck: { label: 'Heavy truck (~26t+)',  dieselLPer100: 33.0, evKwhPer100: 130 },
};

export interface EnergyPrices {
  dieselPricePerL: number;
  petrol93PricePerL: number;
  gridPricePerKwh: number;
  solarPricePerKwh: number;
}

export const DEFAULT_ENERGY_PRICES: EnergyPrices = {
  dieselPricePerL: DIESEL_PRICE_PER_L,
  petrol93PricePerL: PETROL93_PRICE_PER_L,
  gridPricePerKwh: GRID_RATE_PER_KWH,
  solarPricePerKwh: SOLAR_RATE_PER_KWH,
};

export interface CostPerKm {
  fuel: number;
  grid: number;
  solar: number;
}

// Petrol is used only when the vehicle offers it AND the caller asked for it.
function usesPetrol(v: VehicleProfile, fuel: FuelType): boolean {
  return fuel === 'petrol' && v.petrolLPer100 !== undefined;
}

export function vehicleCostPerKm(
  type: FleetVehicleType,
  prices: EnergyPrices,
  fuel: FuelType = 'diesel',
): CostPerKm {
  const v = FLEET_VEHICLES[type];
  const petrol = usesPetrol(v, fuel);
  const lPer100 = petrol ? (v.petrolLPer100 as number) : v.dieselLPer100;
  const pricePerL = petrol ? prices.petrol93PricePerL : prices.dieselPricePerL;
  return {
    fuel: (lPer100 * pricePerL) / 100,
    grid: (v.evKwhPer100 * prices.gridPricePerKwh) / 100,
    solar: (v.evKwhPer100 * prices.solarPricePerKwh) / 100,
  };
}

export interface FleetInput {
  vehicles: number;
  type: FleetVehicleType;
  kmPerMonth: number; // per vehicle
  charging: ChargingSource;
  fuel?: FuelType;    // defaults to diesel
}

export interface FleetEstimate {
  iceCostPerKm: number; // diesel or petrol per the selected fuel
  evCostPerKm: number;
  monthlySaving: number;        // ZAR, whole fleet
  annualSaving: number;
  fiveYearSaving: number;
  co2AvoidedTonnesYear: number; // tonnes/yr, whole fleet; can be <= 0 on grid for heavy EVs
}

export function estimateFleet(
  input: FleetInput,
  prices: EnergyPrices = DEFAULT_ENERGY_PRICES,
): FleetEstimate {
  const v = FLEET_VEHICLES[input.type];
  const fuel = input.fuel ?? 'diesel';
  const petrol = usesPetrol(v, fuel);

  const rate = input.charging === 'solar' ? prices.solarPricePerKwh : prices.gridPricePerKwh;
  const co2Rate = input.charging === 'solar' ? CO2_SOLAR_PER_KWH : CO2_GRID_PER_KWH;

  const lPer100 = petrol ? (v.petrolLPer100 as number) : v.dieselLPer100;
  const fuelPricePerL = petrol ? prices.petrol93PricePerL : prices.dieselPricePerL;
  const co2FuelPerL = petrol ? CO2_PETROL_PER_L : CO2_DIESEL_PER_L;

  // Multiply-then-divide keeps the doubles clean (e.g. 9*24/100 === 2.16).
  const iceCostPerKm = (lPer100 * fuelPricePerL) / 100;
  const evCostPerKm = (v.evKwhPer100 * rate) / 100;

  const fleetKmMonth = input.vehicles * input.kmPerMonth;
  const monthlySaving = Math.round(fleetKmMonth * (iceCostPerKm - evCostPerKm));
  const annualSaving = monthlySaving * 12;
  const fiveYearSaving = annualSaving * 5;

  const co2IcePerKm = (lPer100 * co2FuelPerL) / 100;
  const co2EvPerKm = (v.evKwhPer100 * co2Rate) / 100;
  const co2AvoidedTonnesYear =
    Math.round(((fleetKmMonth * 12 * (co2IcePerKm - co2EvPerKm)) / 1000) * 10) / 10;

  return { iceCostPerKm, evCostPerKm, monthlySaving, annualSaving, fiveYearSaving, co2AvoidedTonnesYear };
}
```

- [ ] **Step 4: Run the tests — verify they pass**

Run: `npx vitest run src/lib/evfleet/estimate.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Minimal compat edit to the existing estimator (keep `tsc` green)**

Adding `heavytruck` to the union makes the estimator's `TYPE_LABEL: Record<FleetVehicleType, string>` non-exhaustive, and the renamed field breaks its display line. In `src/components/sections/calculators/FleetSavingsEstimator.tsx` make exactly two edits (the file is fully rewritten in Task 5 — this is only to compile now):

1. Add the missing key to `TYPE_LABEL`:

```typescript
const TYPE_LABEL: Record<FleetVehicleType, string> = {
  van: 'Van', car: 'Car', minibus: 'Minibus', truck: 'Truck', heavytruck: 'Heavy',
};
```

2. Change the cost-per-km display line from `est.dieselCostPerKm` to `est.iceCostPerKm`:

```tsx
          R{est.iceCostPerKm.toFixed(2)} <span style={{ color: ACCENT }}>&rarr;</span> R{est.evCostPerKm.toFixed(2)}
```

- [ ] **Step 6: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: no output (success).
Run: `npx eslint src/lib/evfleet/estimate.ts src/lib/evfleet/estimate.test.ts src/components/sections/calculators/FleetSavingsEstimator.tsx`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/evfleet/estimate.ts src/lib/evfleet/estimate.test.ts src/components/sections/calculators/FleetSavingsEstimator.tsx
git commit -m "feat(ev-fleets): energy-price-driven calc with petrol + heavy-truck classes"
```

---

### Task 2: Sanity reader — `getEnergyPrices` + query + type

**Files:**
- Create: `src/lib/getEnergyPrices.ts`
- Create: `src/lib/getEnergyPrices.test.ts`
- Modify: `src/lib/queries.ts` (append query)
- Modify: `src/types/sanity.ts` (append interface)

**Interfaces:**
- Consumes (from Task 1): `EnergyPrices`, `DEFAULT_ENERGY_PRICES` from `@/lib/evfleet/estimate`.
- Produces:
  - `export interface EnergyPricesContent { dieselPricePerL?: number; petrol93PricePerL?: number; gridPricePerKwh?: number; solarPricePerKwh?: number; effectiveDate?: string; sourceLabel?: string }` (in `src/types/sanity.ts`)
  - `export const ENERGY_PRICES_QUERY: string` (in `src/lib/queries.ts`)
  - `export interface ResolvedEnergyPrices extends EnergyPrices { effectiveDate: string | null; sourceLabel: string; isLive: boolean }`
  - `export function resolveEnergyPrices(raw: EnergyPricesContent | null): ResolvedEnergyPrices`
  - `export async function getEnergyPrices(): Promise<ResolvedEnergyPrices>`

- [ ] **Step 1: Add the content type**

Append to `src/types/sanity.ts`:

```typescript
export interface EnergyPricesContent {
  dieselPricePerL?: number;
  petrol93PricePerL?: number;
  gridPricePerKwh?: number;
  solarPricePerKwh?: number;
  effectiveDate?: string;
  sourceLabel?: string;
}
```

- [ ] **Step 2: Add the GROQ query**

Append to `src/lib/queries.ts`:

```typescript
/* ─── Energy & Fuel Prices ───────────────────────────────────────────────── */

export const ENERGY_PRICES_QUERY = `
  *[_id == "energyPrices"][0]{
    dieselPricePerL,
    petrol93PricePerL,
    gridPricePerKwh,
    solarPricePerKwh,
    effectiveDate,
    sourceLabel
  }
`;
```

- [ ] **Step 3: Write the failing test for `resolveEnergyPrices`**

Create `src/lib/getEnergyPrices.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { resolveEnergyPrices } from './getEnergyPrices';

describe('resolveEnergyPrices', () => {
  it('null → all fallbacks, not live', () => {
    const r = resolveEnergyPrices(null);
    expect(r.dieselPricePerL).toBe(24.0);
    expect(r.petrol93PricePerL).toBe(24.5);
    expect(r.gridPricePerKwh).toBe(2.6);
    expect(r.solarPricePerKwh).toBe(1.5);
    expect(r.effectiveDate).toBeNull();
    expect(r.sourceLabel).toBe('Estimated');
    expect(r.isLive).toBe(false);
  });

  it('full valid doc → those values, live', () => {
    const r = resolveEnergyPrices({
      dieselPricePerL: 25.1, petrol93PricePerL: 24.9,
      gridPricePerKwh: 2.8, solarPricePerKwh: 1.4,
      effectiveDate: '2026-07-01', sourceLabel: 'DMRE',
    });
    expect(r.dieselPricePerL).toBe(25.1);
    expect(r.solarPricePerKwh).toBe(1.4);
    expect(r.effectiveDate).toBe('2026-07-01');
    expect(r.sourceLabel).toBe('DMRE');
    expect(r.isLive).toBe(true);
  });

  it('one invalid price → that field falls back, not live', () => {
    const r = resolveEnergyPrices({
      dieselPricePerL: 25, petrol93PricePerL: 24,
      gridPricePerKwh: 0, solarPricePerKwh: 1.4,
    });
    expect(r.gridPricePerKwh).toBe(2.6); // fallback
    expect(r.dieselPricePerL).toBe(25);  // preserved
    expect(r.isLive).toBe(false);
  });

  it('negative / NaN price falls back', () => {
    const r = resolveEnergyPrices({
      dieselPricePerL: -3, petrol93PricePerL: Number.NaN,
      gridPricePerKwh: 2.6, solarPricePerKwh: 1.5,
    });
    expect(r.dieselPricePerL).toBe(24.0);
    expect(r.petrol93PricePerL).toBe(24.5);
    expect(r.isLive).toBe(false);
  });
});
```

- [ ] **Step 4: Run the test — verify it fails**

Run: `npx vitest run src/lib/getEnergyPrices.test.ts`
Expected: FAIL (cannot find module `./getEnergyPrices` / `resolveEnergyPrices`).

- [ ] **Step 5: Implement the reader**

Create `src/lib/getEnergyPrices.ts`:

```typescript
import { sanityServerClient } from '@/lib/sanity.server';
import { ENERGY_PRICES_QUERY } from '@/lib/queries';
import { DEFAULT_ENERGY_PRICES, type EnergyPrices } from '@/lib/evfleet/estimate';
import type { EnergyPricesContent } from '@/types/sanity';

export interface ResolvedEnergyPrices extends EnergyPrices {
  effectiveDate: string | null;
  sourceLabel: string;
  isLive: boolean; // true only when every price came from a valid doc value
}

function validPrice(n: number | undefined): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n > 0;
}

/**
 * Turns a raw (possibly missing/partial/invalid) Sanity document into a fully
 * resolved, always-valid price set. Each invalid or missing price falls back to
 * its constant; isLive is true only when all four prices were valid. Pure.
 */
export function resolveEnergyPrices(raw: EnergyPricesContent | null): ResolvedEnergyPrices {
  const dieselOk = validPrice(raw?.dieselPricePerL);
  const petrolOk = validPrice(raw?.petrol93PricePerL);
  const gridOk = validPrice(raw?.gridPricePerKwh);
  const solarOk = validPrice(raw?.solarPricePerKwh);

  const effectiveDate =
    typeof raw?.effectiveDate === 'string' && raw.effectiveDate ? raw.effectiveDate : null;
  const sourceLabel =
    typeof raw?.sourceLabel === 'string' && raw.sourceLabel ? raw.sourceLabel : 'Estimated';

  return {
    dieselPricePerL: dieselOk ? (raw!.dieselPricePerL as number) : DEFAULT_ENERGY_PRICES.dieselPricePerL,
    petrol93PricePerL: petrolOk ? (raw!.petrol93PricePerL as number) : DEFAULT_ENERGY_PRICES.petrol93PricePerL,
    gridPricePerKwh: gridOk ? (raw!.gridPricePerKwh as number) : DEFAULT_ENERGY_PRICES.gridPricePerKwh,
    solarPricePerKwh: solarOk ? (raw!.solarPricePerKwh as number) : DEFAULT_ENERGY_PRICES.solarPricePerKwh,
    effectiveDate,
    sourceLabel,
    isLive: dieselOk && petrolOk && gridOk && solarOk,
  };
}

/**
 * Fetches the Sanity energyPrices singleton and resolves it. Never throws;
 * returns fully-fallback prices (isLive: false) on any error or missing doc.
 */
export async function getEnergyPrices(): Promise<ResolvedEnergyPrices> {
  try {
    const raw = await sanityServerClient.fetch<EnergyPricesContent | null>(ENERGY_PRICES_QUERY);
    return resolveEnergyPrices(raw);
  } catch {
    return resolveEnergyPrices(null);
  }
}
```

- [ ] **Step 6: Run the test — verify it passes**

Run: `npx vitest run src/lib/getEnergyPrices.test.ts`
Expected: PASS (4 cases).

- [ ] **Step 7: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: no output.
Run: `npx eslint src/lib/getEnergyPrices.ts src/lib/getEnergyPrices.test.ts src/lib/queries.ts src/types/sanity.ts`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/getEnergyPrices.ts src/lib/getEnergyPrices.test.ts src/lib/queries.ts src/types/sanity.ts
git commit -m "feat(ev-fleets): getEnergyPrices reader with per-field fallback"
```

---

### Task 3: Sanity schema + studio structure

**Files:**
- Create: `sanity/schemaTypes/energyPrices.ts`
- Modify: `sanity/schemaTypes/index.ts`
- Modify: `sanity.config.ts`

**Interfaces:**
- Produces: a Sanity singleton document type `energyPrices` (fixed document id `energyPrices`) with fields `dieselPricePerL`, `petrol93PricePerL`, `gridPricePerKwh`, `solarPricePerKwh`, `effectiveDate`, `sourceLabel`.
- No unit test (schema/config); verified by `tsc` + `npm run build`.

- [ ] **Step 1: Create the schema**

Create `sanity/schemaTypes/energyPrices.ts`:

```typescript
import { defineType, defineField } from 'sanity';

/**
 * Singleton document — the energy & fuel prices that drive the EV Fleets
 * cost-per-km comparator. Edit these monthly (SA fuel prices change on the
 * first Wednesday). Surfaced as a single editable panel via the structure tool.
 */
export const energyPrices = defineType({
  name: 'energyPrices',
  title: 'Energy & Fuel Prices',
  type: 'document',
  fields: [
    defineField({
      name: 'dieselPricePerL',
      title: 'Diesel price (R / litre)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'petrol93PricePerL',
      title: 'Unleaded 93 petrol price (R / litre)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'gridPricePerKwh',
      title: 'Average grid electricity price (R / kWh)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'solarPricePerKwh',
      title: 'Average solar electricity price (R / kWh)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective from',
      type: 'date',
      description: 'The date these prices took effect (SA fuel prices change the 1st Wednesday monthly).',
    }),
    defineField({
      name: 'sourceLabel',
      title: 'Source label',
      type: 'string',
      description: 'Attribution shown under the widget, e.g. “Official DMRE price, inland (50 ppm)”.',
    }),
  ],
  preview: {
    select: { diesel: 'dieselPricePerL', grid: 'gridPricePerKwh' },
    prepare: ({ diesel, grid }) => ({
      title: 'Energy & Fuel Prices',
      subtitle:
        [diesel != null ? `Diesel R${diesel}/L` : null, grid != null ? `Grid R${grid}/kWh` : null]
          .filter(Boolean)
          .join(' · ') || 'Not set',
    }),
  },
});
```

- [ ] **Step 2: Register the schema**

In `sanity/schemaTypes/index.ts`, add the import and append to the array:

```typescript
import { energyPrices } from './energyPrices';
```

```typescript
export const schemaTypes = [project, blogPost, author, teamMember, milestoneTimeline, partner, companyStats, howItWorks, heroImages, energyPrices];
```

- [ ] **Step 3: Add the studio singleton list item**

In `sanity.config.ts`, immediately after the existing "Hero Images" list item (inside the `.items([ … ])` array), add:

```typescript
            S.divider(),
            S.listItem()
              .title('Energy & Fuel Prices')
              .id('energyPrices')
              .child(S.document().schemaType('energyPrices').documentId('energyPrices')),
```

- [ ] **Step 4: Verify types, lint, and build**

Run: `npx tsc --noEmit`
Expected: no output.
Run: `npx eslint sanity/schemaTypes/energyPrices.ts sanity/schemaTypes/index.ts sanity.config.ts`
Expected: no errors.
Run: `npm run build`
Expected: `✓ Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
git add sanity/schemaTypes/energyPrices.ts sanity/schemaTypes/index.ts sanity.config.ts
git commit -m "feat(cms): energyPrices singleton for EV Fleets prices"
```

---

### Task 4: Retire §6 + repurpose `CostPerKmBars` as presentational dark bars

**Files:**
- Rewrite: `src/components/sections/CostPerKmBars.tsx`
- Modify: `src/app/solutions/ev-fleets/page.tsx` (delete §6 section + its `CostPerKmBars` import)
- Modify: `src/config/evFleetsContent.ts` (remove dead `costPerKm` block + type field)

**Interfaces:**
- Consumes (from Task 1): `type CostPerKm` from `@/lib/evfleet/estimate`.
- Produces: `export function CostPerKmBars(props: { fuelLabel: string; costs: CostPerKm; accent: string }): JSX.Element` — presentational, no `'use client'`.

- [ ] **Step 1: Rewrite `CostPerKmBars` as presentational dark bars**

Replace the entire contents of `src/components/sections/CostPerKmBars.tsx` with:

```tsx
// src/components/sections/CostPerKmBars.tsx — cost-per-km comparison bars.
// Presentational + dark-themed (sits inside the EV Fleets hero widget).
import type { CostPerKm } from '@/lib/evfleet/estimate';

interface CostPerKmBarsProps {
  fuelLabel: string; // 'Diesel' | 'Petrol 93'
  costs: CostPerKm;  // { fuel, grid, solar }
  accent: string;    // grid-bar colour
}

export function CostPerKmBars({ fuelLabel, costs, accent }: CostPerKmBarsProps) {
  const max = Math.max(costs.fuel, costs.grid, costs.solar);
  const rows: { label: string; value: number; color: string }[] = [
    { label: fuelLabel, value: costs.fuel, color: '#C2703D' },
    { label: 'Electric — grid', value: costs.grid, color: accent },
    { label: 'Electric — solar', value: costs.solar, color: '#39575C' },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-body text-[11px] font-semibold text-white/80">{r.label}</span>
            <span className="font-display font-extrabold text-[11px] text-white">R{r.value.toFixed(2)} / km</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)' }}>
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

- [ ] **Step 2: Delete the §6 section and its import in the page**

In `src/app/solutions/ev-fleets/page.tsx`:

1. Remove the import line:

```tsx
import { CostPerKmBars } from '@/components/sections/CostPerKmBars';
```

2. Delete the entire §6 block (the `{/* §6 — Cost per km */}` comment and the `<section className="bg-[#F5F5F5] py-16 md:py-24"> … </section>` it labels — the section containing `EV_FLEETS.costPerKm.eyebrow`, `<CostPerKmBars … />`, `EV_FLEETS.costPerKm.statValue/statLabel`, and `EV_FLEETS.costPerKm.note`). Leave §5 (SolutionTabs) and §7 (HowItWorks) exactly as they are, now adjacent.

- [ ] **Step 3: Remove the dead `costPerKm` config**

In `src/config/evFleetsContent.ts`:

1. In the `EV_FLEETS` type annotation, delete the line:

```typescript
  costPerKm: { eyebrow: string; heading: string; statValue: string; statLabel: string; note: string };
```

2. Delete the corresponding data block:

```typescript
  costPerKm: {
    eyebrow: 'The numbers',
    heading: 'Diesel is the most expensive way to move your fleet.',
    statValue: '23–27%',
    statLabel: 'lower total cost of ownership — measured across 12.5M km of SA electric-fleet operation (Everlectric).',
    note: 'Energy cost only, for a light delivery van; excludes maintenance (typically ~35% lower for EVs). On South Africa’s coal-heavy grid the carbon saving is modest — charging from solar is what turns cost savings into deep emissions cuts.',
  },
```

- [ ] **Step 4: Verify types, lint, and build**

Run: `npx tsc --noEmit`
Expected: no output.
Run: `npx eslint src/components/sections/CostPerKmBars.tsx src/app/solutions/ev-fleets/page.tsx src/config/evFleetsContent.ts`
Expected: no errors.
Run: `npm run build`
Expected: `✓ Compiled successfully`; `○ /solutions/ev-fleets` still static.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/CostPerKmBars.tsx src/app/solutions/ev-fleets/page.tsx src/config/evFleetsContent.ts
git commit -m "refactor(ev-fleets): remove §6 numbers section, make CostPerKmBars presentational"
```

---

### Task 5: Hero widget rewrite + page wiring

**Files:**
- Rewrite: `src/components/sections/calculators/FleetSavingsEstimator.tsx`
- Modify: `src/app/solutions/ev-fleets/page.tsx` (fetch prices, pass prop)

**Interfaces:**
- Consumes (Task 1): `estimateFleet`, `vehicleCostPerKm`, `FLEET_VEHICLES`, `type FleetVehicleType`, `type ChargingSource`, `type FuelType` from `@/lib/evfleet/estimate`.
- Consumes (Task 2): `type ResolvedEnergyPrices`, `getEnergyPrices` from `@/lib/getEnergyPrices`.
- Consumes (Task 4): `CostPerKmBars` from `@/components/sections/CostPerKmBars`.
- Produces: `export function FleetSavingsEstimator(props: { prices: ResolvedEnergyPrices }): JSX.Element`.

- [ ] **Step 1: Rewrite the estimator**

Replace the entire contents of `src/components/sections/calculators/FleetSavingsEstimator.tsx` with:

```tsx
// src/components/sections/calculators/FleetSavingsEstimator.tsx
'use client';

import { useState } from 'react';
import { dlPush } from '@/lib/analytics';
import {
  estimateFleet, vehicleCostPerKm, FLEET_VEHICLES,
  type FleetVehicleType, type ChargingSource, type FuelType,
} from '@/lib/evfleet/estimate';
import type { ResolvedEnergyPrices } from '@/lib/getEnergyPrices';
import { CostPerKmBars } from '@/components/sections/CostPerKmBars';

const ACCENT = '#A9D6CB';
const ACCENT_TEXT = '#1a5a48';

const TYPES: FleetVehicleType[] = ['car', 'van', 'minibus', 'truck', 'heavytruck'];
const TYPE_LABEL: Record<FleetVehicleType, string> = {
  car: 'Car', van: 'Van', minibus: 'Minibus', truck: 'Truck', heavytruck: 'Heavy',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const UNSELECTED_BTN = {
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(255,255,255,0.12)',
} as const;

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${Math.round(n / 1_000)}k`;
  return `R${Math.round(n)}`;
}

// Deterministic 'Jul 2026' from an ISO date (avoids locale-dependent hydration mismatch).
function formatMonthYear(iso: string | null): string | null {
  if (!iso) return null;
  const m = iso.match(/^(\d{4})-(\d{2})/);
  if (!m) return null;
  const monthIdx = Number(m[2]) - 1;
  if (monthIdx < 0 || monthIdx > 11) return null;
  return `${MONTHS[monthIdx]} ${m[1]}`;
}

export function FleetSavingsEstimator({ prices }: { prices: ResolvedEnergyPrices }) {
  const [vehicles, setVehicles] = useState(10);
  const [type, setType] = useState<FleetVehicleType>('van');
  const [fuel, setFuel] = useState<FuelType>('diesel');
  const [kmPerMonth, setKmPerMonth] = useState(2500);
  const [charging, setCharging] = useState<ChargingSource>('grid');
  const [used, setUsed] = useState(false);

  const petrolOk = FLEET_VEHICLES[type].petrolLPer100 !== undefined;
  const effectiveFuel: FuelType = petrolOk ? fuel : 'diesel';

  const est = estimateFleet({ vehicles, type, kmPerMonth, charging, fuel: effectiveFuel }, prices);
  const costs = vehicleCostPerKm(type, prices, effectiveFuel);
  const co2 = Math.max(0, est.co2AvoidedTonnesYear);

  const fuelLabel = effectiveFuel === 'petrol' ? 'Petrol 93' : 'Diesel';
  const fuelPrice = effectiveFuel === 'petrol' ? prices.petrol93PricePerL : prices.dieselPricePerL;
  const monthYear = formatMonthYear(prices.effectiveDate);
  const priceCaption = `${fuelLabel} R${fuelPrice.toFixed(2)}/L · ${prices.isLive && monthYear ? monthYear : 'estimated'}`;

  function touch() {
    if (used) return;
    setUsed(true);
    dlPush({ event: 'fleet_estimate_used', vertical: 'ev-fleets', vehicles, charging });
  }

  // Reset fuel here (event handler, never during render) when moving to a diesel-only vehicle.
  function selectType(t: FleetVehicleType) {
    setType(t);
    if (FLEET_VEHICLES[t].petrolLPer100 === undefined) setFuel('diesel');
    touch();
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
      <div className="grid grid-cols-5 gap-1.5 mb-5">
        {TYPES.map((t) => {
          const sel = type === t;
          return (
            <button
              key={t} type="button"
              onClick={() => selectType(t)}
              className="rounded-lg py-2 font-body text-[11px] font-semibold transition-colors"
              style={sel ? { background: ACCENT, color: ACCENT_TEXT } : UNSELECTED_BTN}
            >
              {TYPE_LABEL[t]}
            </button>
          );
        })}
      </div>

      {/* Current fuel */}
      <p className="font-body text-sm text-white/70 mb-2">Current fuel</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {(['diesel', 'petrol'] as FuelType[]).map((f) => {
          const sel = effectiveFuel === f;
          const disabled = f === 'petrol' && !petrolOk;
          return (
            <button
              key={f} type="button" disabled={disabled}
              onClick={() => { setFuel(f); touch(); }}
              className="rounded-lg py-2.5 font-body text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={sel ? { background: ACCENT, color: ACCENT_TEXT } : UNSELECTED_BTN}
            >
              {f === 'diesel' ? 'Diesel' : 'Petrol 93'}
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
              style={sel ? { background: ACCENT, color: ACCENT_TEXT } : UNSELECTED_BTN}
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

      {/* Cost per km bars */}
      <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-body text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Cost per km</span>
          <span className="font-body text-[11px]" style={{ color: 'rgba(255,255,255,0.40)' }}>{priceCaption}</span>
        </div>
        <CostPerKmBars fuelLabel={fuelLabel} costs={costs} accent={ACCENT} />
      </div>

      {/* CO2 */}
      <div className="flex items-center justify-between rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="font-body text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
          CO&#8322; avoided / year{charging === 'grid' ? ' — charge from solar for more' : ''}
        </span>
        <span className="font-display font-bold text-sm text-white">~{co2.toLocaleString('en-ZA')} t</span>
      </div>

      <p className="font-body text-[10px] mt-3 text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Indicative only. Based on {fuelLabel.toLowerCase()} R{fuelPrice.toFixed(2)}/L, grid R{prices.gridPricePerKwh.toFixed(2)}/kWh and solar R{prices.solarPricePerKwh.toFixed(2)}/kWh. Actual savings depend on your routes, tariffs and duty cycle; CO&#8322; depends on charging from grid vs solar.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Wire prices into the page**

In `src/app/solutions/ev-fleets/page.tsx`:

1. Add the import (with the other `@/lib` imports):

```tsx
import { getEnergyPrices } from '@/lib/getEnergyPrices';
```

2. Fetch prices alongside the existing awaits inside `EvFleetsPage`:

```tsx
  const howItWorks = await getHowItWorks(vertical);
  const hero = (await getHeroImages())[vertical];
  const prices = await getEnergyPrices();
```

3. Pass the prop to the estimator in the hero children:

```tsx
        <FleetSavingsEstimator prices={prices} />
```

- [ ] **Step 3: Verify types, lint, tests, and build**

Run: `npx tsc --noEmit`
Expected: no output.
Run: `npx eslint src/components/sections/calculators/FleetSavingsEstimator.tsx src/app/solutions/ev-fleets/page.tsx`
Expected: no errors (in particular, no `react-hooks/set-state-in-effect` or refs-during-render warnings — fuel reset happens in the `selectType` handler).
Run: `npx vitest run src/lib/evfleet/estimate.test.ts src/lib/getEnergyPrices.test.ts`
Expected: PASS.
Run: `npm run build`
Expected: `✓ Compiled successfully`; `○ /solutions/ev-fleets` static.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/calculators/FleetSavingsEstimator.tsx src/app/solutions/ev-fleets/page.tsx
git commit -m "feat(ev-fleets): hero estimator with fuel toggle, live prices, cost-per-km bars"
```

---

## Post-implementation (non-code) follow-ups

- In Studio (`/studio`), open **Energy & Fuel Prices** and create the singleton with the current values (diesel, petrol 93, grid, solar), effective date, and a source label. Until it exists the page uses the fallback constants and shows "· estimated".
- Ensure the Sanity **revalidate webhook** (GROQ webhook → `/api/revalidate`) covers the `energyPrices` type with an **empty projection** so publishes update the live page instantly; otherwise updates appear within the 1-hour ISR window.

## Self-Review

**Spec coverage:**
- Sanity singleton (5 prices + date + label) → Task 3. ✅
- Reader with per-field fallback + `isLive` → Task 2. ✅
- Calc: heavy truck, petrol, `EnergyPrices`, `vehicleCostPerKm`, `estimateFleet(prices)`, `iceCostPerKm` rename → Task 1. ✅
- Presentational dark bars → Task 4. ✅
- Hero widget: heavy-truck button, fuel toggle (diesel-only trucks), live prices, bars, caption, updated note → Task 5. ✅
- §6 removal + dead config cleanup → Task 4. ✅
- Petrol available car/van/minibus only → `FLEET_VEHICLES` (Task 1) + `petrolOk` guard (Task 5). ✅
- Deterministic date formatting → `formatMonthYear` (Task 5). ✅
- Tests for calc + resolver → Tasks 1, 2. ✅
- Route stays static → verified Tasks 4, 5. ✅

**Type consistency:** `EnergyPrices`, `ResolvedEnergyPrices`, `CostPerKm`, `FuelType`, `FleetVehicleType`, `iceCostPerKm`, `vehicleCostPerKm(type, prices, fuel)`, `estimateFleet(input, prices)` used identically across tasks. `CostPerKmBars` props `{ fuelLabel, costs, accent }` match producer (Task 4) and consumer (Task 5). `getEnergyPrices`/`resolveEnergyPrices`/`EnergyPricesContent`/`ENERGY_PRICES_QUERY` consistent across Tasks 2, 5.

**Placeholder scan:** none — every code step has complete content.

**Build-green ordering:** Task 1 includes the two compat edits the union+rename force; Task 4 removes §6 before the `CostPerKmBars` signature change strands a consumer; Task 5 makes `prices` required and wires the page in the same task. Each task boundary compiles.

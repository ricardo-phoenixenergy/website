# EV Fleets — Sanity-managed energy prices + hero cost-per-km comparator (Design Spec)

> Version 1.0 | 2026-07-02 | Route: `/solutions/ev-fleets`

## Goal

Make the EV Fleets fuel/energy prices editable in Sanity (diesel, petrol 93,
grid electricity, solar electricity), and replace the hero `FleetSavingsEstimator`
with an upgraded version of itself that: adds a **heavy-truck** class, adds a
**fuel-type toggle (Diesel / Petrol 93)**, draws all prices from the Sanity
values, and renders a **fuel-vs-grid-vs-solar cost-per-km bar visual** — while
keeping its existing fleet-savings outputs (monthly / annual / 5-year + CO₂).
The standalone §6 "The numbers" section is removed.

## Background / current state

- Hero widget: `src/components/sections/calculators/FleetSavingsEstimator.tsx`
  (dark theme, in the hero via `SolutionHero` children). Controls: vehicles
  slider, vehicle type (van/car/minibus/truck), distance slider, charging
  (grid/solar). Outputs: monthly/annual/5-year savings, cost/km line, CO₂.
- Calc: `src/lib/evfleet/estimate.ts` (pure, Vitest-tested in
  `estimate.test.ts`). Prices are hardcoded module constants.
- §6 "The numbers": `src/app/solutions/ev-fleets/page.tsx` renders a static
  `CostPerKmBars` (van-only) + the `23–27%` Everlectric TCO stat + a note.
- The `23–27%` claim is **also** present in the "Why now" cards
  (`EV_FLEETS.whyNow.cards[2]`) and the FAQ, so removing §6 does not lose it.

## Decisions (from brainstorming)

- **Price source:** Sanity-managed singleton (no paid API, no scraping). One
  editable panel; monthly manual update. Fuel SA paid API is a possible future
  drop-in, out of scope here.
- **Hero widget:** comparator **plus** savings (keep the Rand-savings hook).
- **§6:** removed entirely.
- **Petrol:** add ULP 93 as a selectable fuel; realistic only for lighter
  vehicles — **Car / Van / Minibus support petrol; Medium & Heavy truck are
  diesel-only** (petrol toggle disables for those and falls back to diesel).
- **CO₂ factors** stay hardcoded constants (not CMS-configurable).

## Architecture

Server component (`page.tsx`) fetches the prices from Sanity via a safe reader
and passes them as props to the client widget. All money math stays in the pure
`estimate.ts` module (prices injected as a parameter, defaulting to fallback
constants so nothing breaks when the doc is absent). The bar visual is a small
presentational component. Same shape as the existing `getHowItWorks` /
`getHeroImages` → page → component flow.

Accent: Light Aqua `#A9D6CB`; accent-text `#1a5a48`.

## Global Constraints

- TypeScript strict, no `any`; **named exports only**.
- Tailwind arbitrary-hex tokens (`text-[#1A1A1A]`, `bg-[#F5F5F5]`, `border-[#E5E7EB]`); never hardcode brand values outside tokens.
- Curly apostrophes (U+2019) in `.ts`/`.tsx` string literals; `&apos;`/`&amp;`/`&rarr;`/`&#8322;` in JSX text.
- Sanity reads use the authenticated server client `@/lib/sanity.server`
  (`sanityServerClient`), never the public client. Readers never throw.
- Route `○ /solutions/ev-fleets` must stay **static** (relies on page
  `revalidate = 3600`; the reader must not opt into dynamic rendering).
- Verify each task: `npx tsc --noEmit`, `npx eslint <files>`,
  `npx vitest run <test files>`, and finally `npm run build`.

---

## Data model

### Fallback constants (safety net when the Sanity doc is missing/invalid)

| Constant | Value |
|---|---|
| `DIESEL_PRICE_PER_L` | `24.0` |
| `PETROL93_PRICE_PER_L` | `24.50` |
| `GRID_RATE_PER_KWH` | `2.60` |
| `SOLAR_RATE_PER_KWH` | `1.50` |
| `CO2_DIESEL_PER_L` | `2.68` |
| `CO2_PETROL_PER_L` | `2.31` (new) |
| `CO2_GRID_PER_KWH` | `0.95` |
| `CO2_SOLAR_PER_KWH` | `0.05` |

### Vehicle profiles (per 100 km)

| Key | label | dieselLPer100 | petrolLPer100 | evKwhPer100 |
|---|---|---|---|---|
| `car` | Passenger / car | 7.0 | 8.0 | 17 |
| `van` | Light delivery van | 9.0 | 11.0 | 22 |
| `minibus` | Minibus / shuttle | 11.0 | 13.0 | 28 |
| `truck` | Medium truck (~4–8t) | 18.0 | *(none)* | 60 |
| `heavytruck` | Heavy truck (~26t+) | 33.0 | *(none)* | 130 |

`petrolLPer100` is **optional** on `VehicleProfile`; absence means petrol is not
offered for that class.

### `EnergyPrices` (injected into calc)

```typescript
export interface EnergyPrices {
  dieselPricePerL: number;
  petrol93PricePerL: number;
  gridPricePerKwh: number;
  solarPricePerKwh: number;
}
```

### `FuelType`

```typescript
export type FuelType = 'diesel' | 'petrol';
```

---

## Components & files

### 1. Sanity schema — `sanity/schemaTypes/energyPrices.ts` (new)

Singleton document `energyPrices` (fixed id `energyPrices`), following
`companyStats.ts` conventions (`defineType`/`defineField`, preview):

- `dieselPricePerL` — `number`, title "Diesel price (R / litre)", `validation: (r) => r.required().positive()`.
- `petrol93PricePerL` — `number`, title "Unleaded 93 petrol price (R / litre)", `required().positive()`.
- `gridPricePerKwh` — `number`, title "Average grid electricity price (R / kWh)", `required().positive()`.
- `solarPricePerKwh` — `number`, title "Average solar electricity price (R / kWh)", `required().positive()`.
- `effectiveDate` — `date`, title "Effective from", description "The date these prices took effect (SA fuel prices change the 1st Wednesday monthly).", optional.
- `sourceLabel` — `string`, title "Source label", description "Attribution shown under the widget, e.g. ‘Official DMRE price, inland (50 ppm)’.", optional.
- `preview`: title "Energy & Fuel Prices", subtitle joins diesel/grid values.

Register in `sanity/schemaTypes/index.ts` (import + append to `schemaTypes`).

### 2. Studio structure — `sanity.config.ts`

Add a singleton list item after "Hero Images" (mirrors the `companyStats`/`heroImages`
singleton pattern):

```typescript
S.divider(),
S.listItem()
  .title('Energy & Fuel Prices')
  .id('energyPrices')
  .child(S.document().schemaType('energyPrices').documentId('energyPrices')),
```

### 3. GROQ + type

- `src/lib/queries.ts` — append:

```typescript
export const ENERGY_PRICES_QUERY = `
  *[_id == "energyPrices"][0]{
    dieselPricePerL,
    petrol93PricePerL,
    gridPricePerKwh,
    solarPricePerKwh,
    "effectiveDate": effectiveDate,
    sourceLabel
  }
`;
```

- `src/types/sanity.ts` — add:

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

### 4. Reader — `src/lib/getEnergyPrices.ts` (new)

Returns a fully-resolved, always-valid object (never throws). Split the
resolution into a **pure helper** so it can be unit-tested without Sanity:

```typescript
export interface ResolvedEnergyPrices extends EnergyPrices {
  effectiveDate: string | null;
  sourceLabel: string;
  isLive: boolean;        // true only when every price came from a valid doc value
}

// Pure — validates each field, falls back per-field, sets isLive.
export function resolveEnergyPrices(raw: EnergyPricesContent | null): ResolvedEnergyPrices
```

Rules for `resolveEnergyPrices`:
- A price field is "valid" when it is a finite number `> 0`.
- Each invalid/missing price falls back to its constant.
- `isLive = true` only if **all four** prices were valid from the doc.
- `sourceLabel` falls back to `'Estimated'`; `effectiveDate` to `null`.

`getEnergyPrices()` wraps it:

```typescript
export async function getEnergyPrices(): Promise<ResolvedEnergyPrices> {
  try {
    const raw = await sanityServerClient.fetch<EnergyPricesContent | null>(ENERGY_PRICES_QUERY);
    return resolveEnergyPrices(raw);
  } catch {
    return resolveEnergyPrices(null);
  }
}
```

### 5. Calc — `src/lib/evfleet/estimate.ts` (modify)

- Add `PETROL93_PRICE_PER_L`, `CO2_PETROL_PER_L` constants.
- Add `heavytruck` to `FleetVehicleType` and `FLEET_VEHICLES`; add optional
  `petrolLPer100?: number` to `VehicleProfile`; set petrol figures for
  car/van/minibus only.
- Add `EnergyPrices` interface and `FuelType` type.
- Add `DEFAULT_ENERGY_PRICES: EnergyPrices` built from the fallback constants.
- New pure fn:

```typescript
export interface CostPerKm { fuel: number; grid: number; solar: number }

export function vehicleCostPerKm(
  type: FleetVehicleType,
  prices: EnergyPrices,
  fuel: FuelType = 'diesel',
): CostPerKm
```

  - `usePetrol = fuel === 'petrol' && v.petrolLPer100 !== undefined`.
  - `fuel = (usePetrol ? v.petrolLPer100! : v.dieselLPer100) * (usePetrol ? prices.petrol93PricePerL : prices.dieselPricePerL) / 100`.
  - `grid = v.evKwhPer100 * prices.gridPricePerKwh / 100`; `solar = v.evKwhPer100 * prices.solarPricePerKwh / 100`.

- `FleetInput` gains `fuel?: FuelType` (default `'diesel'`).
- `estimateFleet(input, prices: EnergyPrices = DEFAULT_ENERGY_PRICES)`:
  - ICE side uses the selected fuel's consumption, price and CO₂ factor
    (petrol only when available for the type, else diesel).
  - **Rename** the result field `dieselCostPerKm` → `iceCostPerKm`
    (fuel-agnostic). Keep `evCostPerKm` and the rest unchanged.
  - `evCostPerKm` uses `prices.gridPricePerKwh` / `prices.solarPricePerKwh`.
- Update `estimate.test.ts` for the renamed field and add cases (below).

### 6. Presentational bars — `src/components/sections/CostPerKmBars.tsx` (rewrite)

Was a self-computing light component (only used by §6, which is being removed).
Rewrite as **presentational, dark-theme, props-driven**:

```typescript
interface CostPerKmBarsProps {
  fuelLabel: string;          // 'Diesel' | 'Petrol 93'
  costs: CostPerKm;           // { fuel, grid, solar }
  accent: string;             // grid bar colour
}
```

Three rows (`{fuelLabel}` / `Electric — grid` / `Electric — solar`), each a
label + `R{value.toFixed(2)} / km` + a proportional bar (widest = the fuel
cost). Dark styling to sit inside the hero card: bar track
`rgba(255,255,255,0.10)`, fuel bar `#C2703D`, grid bar `accent`, solar bar
`#39575C`; text white / `rgba(255,255,255,0.7)`. `Math.max(6, …)` min width.
No `'use client'` needed (pure presentational).

### 7. Hero widget — `FleetSavingsEstimator.tsx` (modify)

New props:

```typescript
interface FleetSavingsEstimatorProps {
  prices: ResolvedEnergyPrices;
}
```

Changes:
- `TYPES` becomes `['car','van','minibus','truck','heavytruck']`; `TYPE_LABEL`
  adds `heavytruck: 'Heavy'` (and keep labels short: Car/Van/Minibus/Truck/Heavy).
  Selector grid becomes `grid-cols-5` with `text-[11px]` buttons.
- New **fuel-type toggle** state `fuel: FuelType` (default `'diesel'`), rendered
  as a 2-button group (Diesel / Petrol 93) styled like the charging toggle.
  Petrol availability: `const petrolOk = FLEET_VEHICLES[type].petrolLPer100 !== undefined;`
  When `!petrolOk`, the Petrol button is disabled (dimmed) and an effect/guard
  forces `fuel` back to `'diesel'` when switching to a diesel-only vehicle.
  **Guard against set-state-in-render / ref-in-render lint** — reset via the
  vehicle-select `onClick` handler (`setType(t); if (noPetrol) setFuel('diesel')`),
  not during render.
- Compute `est = estimateFleet({ vehicles, type, kmPerMonth, charging, fuel }, prices)`
  and `costs = vehicleCostPerKm(type, prices, effectiveFuel)`.
- Replace the compact "Cost per km" line with `<CostPerKmBars fuelLabel={…} costs={costs} accent={ACCENT} />`.
- Add a **price caption** under the bars: active fuel price + effective date,
  e.g. `Diesel R24.32/L · Jul 2026` (from `prices`), or `… · estimated` when
  `!prices.isLive`. Format the date deterministically (no locale-dependent
  hydration mismatch) — a small month-year formatter from the ISO string.
- Update the disclaimer note to reflect the live values instead of the
  hardcoded "~R24/L" text (e.g. "Based on current SA prices — diesel
  R{diesel}/L, grid R{grid}/kWh, solar R{solar}/kWh …").
- Keep the `dlPush({ event: 'fleet_estimate_used', … })` analytics call; extend
  its payload only if trivial (no new schema work required — reuse existing
  event shape).
- Display uses `est.iceCostPerKm` where it used `est.dieselCostPerKm`.

### 8. Page — `src/app/solutions/ev-fleets/page.tsx` (modify)

- `const prices = await getEnergyPrices();` alongside the existing awaits.
- `<FleetSavingsEstimator prices={prices} />` inside `<SolutionHero>`.
- **Delete the entire §6 "The numbers" `<section>`** (heading, `CostPerKmBars`,
  the `23–27%` stat block, and the note).
- Remove the now-unused page-level `import { CostPerKmBars }` (it moves inside
  the estimator).
- Everything else (§2 why-now, §3 pillars, §4 financing, §5 industries tabs,
  §7 how-it-works, §8 proof+FAQ, §9 CTA) is unchanged.

Note: `EV_FLEETS.costPerKm` config becomes unused after §6 removal — remove that
config block and its type from `evFleetsContent.ts` to avoid dead code.

---

## Testing

`src/lib/evfleet/estimate.test.ts` (extend):
- Existing cases updated: `dieselCostPerKm` → `iceCostPerKm` (values unchanged
  because `DEFAULT_ENERGY_PRICES` equals the old constants).
- `vehicleCostPerKm('van', DEFAULT_ENERGY_PRICES, 'diesel')` → `{ fuel: 2.16, grid: 0.572, solar: 0.33 }` (approx).
- `vehicleCostPerKm('car', DEFAULT_ENERGY_PRICES, 'petrol')` → fuel `8*24.5/100 = 1.96`.
- `vehicleCostPerKm('heavytruck', DEFAULT_ENERGY_PRICES, 'petrol')` → falls back
  to diesel (`33*24/100 = 7.92`) because petrol is unavailable.
- `estimateFleet` with a **custom `EnergyPrices`** overrides the defaults
  (e.g. diesel 30 → higher savings).
- `estimateFleet({ …, fuel: 'petrol' }, prices)` for a car uses petrol cost/CO₂.

`src/lib/getEnergyPrices.test.ts` (new — pure `resolveEnergyPrices`):
- `null` → all fallbacks, `isLive: false`, `sourceLabel: 'Estimated'`, `effectiveDate: null`.
- Full valid doc → those values, `isLive: true`.
- One invalid field (e.g. `gridPricePerKwh: 0` or missing) → that field falls
  back, `isLive: false`, others preserved.
- Negative/`NaN` price → fallback for that field.

Run: `npx vitest run src/lib/evfleet/estimate.test.ts src/lib/getEnergyPrices.test.ts`.

---

## Error handling / edge cases

- Missing/invalid Sanity doc → per-field fallback constants; `isLive:false`
  drives the "· estimated" caption. Nothing renders `NaN`.
- Diesel-only vehicle + `fuel==='petrol'` in the URL/state → treated as diesel
  everywhere (calc guards via `petrolLPer100 !== undefined`).
- Heavy EV on grid → CO₂ avoided can be ≤ 0; the widget already clamps display
  with `Math.max(0, …)` (honest: "charge from solar for more").
- Date formatting is deterministic (ISO → manual month-year) to avoid SSR/client
  hydration mismatch.

## Post-implementation (non-code) follow-ups

- Create the `energyPrices` document in Studio and set the five prices +
  effective date + source label.
- Ensure the Sanity **revalidate webhook** covers the `energyPrices` type with an
  **empty projection** (per the site's content-pipeline rule) so publishes update
  the live page instantly; otherwise updates appear within the 1-hour ISR window.

## Non-goals / out of scope

- No paid Fuel SA API integration (future drop-in behind `getEnergyPrices`).
- CO₂ factors remain code constants.
- No change to the hero estimator's core layout beyond the additions above.
- No automated price scraping.

## Open items

- None.

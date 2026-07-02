# EV Fleets & Infrastructure Page Rework — Design Spec

> Version 1.0 | 2026-07-02 | Route: `/solutions/ev-fleets`

## Goal

Rework the EV Fleets & Infrastructure page from a charging-infrastructure pitch
into a **fully-financed, Phoenix-supplied EV Fleet-as-a-Service** story: replace
the flat-60%-saving fuel slider with a credible **Fleet Savings Estimator**
(cost-per-km EV-vs-diesel, grid-vs-solar), lead with the four-pillar bundle
(**Vehicles · Charging · Solar+BESS · Financing**), make **financing the
centrepiece** (both a zero-capital as-a-service subscription *and* a
financed-to-own route), and ground everything in South-African market reality
(diesel volatility, rising carbon tax, coal-grid honesty, real fleet proof).

## Architecture

The page stays a Server Component composed from existing reusable sections
(`SolutionHero`, `ExplainerCards`, `FinancingBand`, `HowItWorks`,
`FeaturedProjects`, `FaqAccordion`, `RelatedArticles`, `PageFooter`). New code:
(1) a pure, unit-tested estimator calc module + client component replacing
`EvFleetsCalculator`; (2) a small CSS-only cost-per-km comparison component;
(3) one new icon (`IconTruck`); (4) a typed content config. Copy lives in the
config, mirroring `carbonCreditsContent.ts` / `webuysolarContent.ts`.

Accent colour: **Light Aqua `#A9D6CB`** (`SOLUTION_META['ev-fleets'].accent`);
accent-text `#1a5a48`.

## Tech Stack

Next.js App Router · TypeScript strict · Tailwind (arbitrary hex tokens) ·
Framer Motion (via `AnimatedSection`) · Vitest for the calc module. No chart
library — the TCO/cost-per-km visual is CSS bars.

---

## Global Constraints

- TypeScript strict — no `any`; **named exports only**.
- Vertical accent `#A9D6CB`; accent-text `#1a5a48`. Accents stay subtle
  (bars/dots/10–15% fills), never dominant backgrounds.
- Estimator constants (verbatim; all are **indicative defaults**, footnoted as
  such — the tool is ungated, no lead wall):
  - Diesel price: **R24.00 / L**
  - Grid (depot) charging: **R2.60 / kWh**
  - Solar+BESS charging: **R1.50 / kWh**
  - CO₂ — diesel: **2.68 kg/L**; grid: **0.95 kg/kWh**; solar: **0.05 kg/kWh**
  - Vehicle types (diesel L/100km · EV kWh/100km): Light delivery van **9.0 · 22**;
    Passenger/car **7.0 · 17**; Minibus/shuttle **11.0 · 28**; Medium truck (~4 t) **18.0 · 60**
- Estimator footnote must state figures are indicative, list the key
  assumptions, and note that the CO₂ result depends on charging source (coal
  grid vs solar).
- Sourced SA facts allowed in copy (do **not** invent beyond these):
  carbon tax **R308/t in 2026 → R462/t by 2030**; diesel **~R24/L, spiked ~R32/L
  May 2026**; EVs **~23–27% lower TCO than diesel** across 12.5M real SA km
  (Everlectric fleet: Woolworths, DSV, UPD/Clicks, Takealot); grid **~0.95 kg
  CO₂/kWh**. Do **NOT** claim: BYD commercial vans in SA, a 125% solar
  deduction, any consumer EV purchase subsidy, or specific unverified clients
  (Karan Beef, Pick n Pay). Section 12B = **100%** first-year solar deduction.
- `HowItWorks` (§7) is Sanity-sourced via `getHowItWorks('ev-fleets')` — a **CMS
  content task**, exact copy specified below.
- Verification per task: `npx tsc --noEmit`, `npx eslint <files>`, `npm run
  build` (confirm `○ /solutions/ev-fleets` stays static).

---

## Section-by-Section Specification

### 1 · Hero + Fleet Savings Estimator
Component: `SolutionHero` with the estimator as `children`.

- **Badge:** `EV Fleets & Infrastructure`
- **Title:** `Electrify your fleet — <em>fully financed, end to end</em>.`
- **Subtitle:** `Phoenix supplies and funds the whole transition: electric vehicles, depot charging, and on-site solar and battery storage — as one managed package. Cut your fuel bill, fix your energy cost, and cut emissions, without the upfront capital.`
- **heroBg:** keep `linear-gradient(135deg, #0d1f22 0%, #0f2a28 50%, #1a4040 100%)`
- **Primary CTA:** `Book a Fleet Assessment` → `/contact` (arrow shows by default)
- **Right column:** `FleetSavingsEstimator` (see "New estimator").

### 2 · Why now — South Africa
Component: `ExplainerCards`, `background="white"`, `columns={3}`.

- **Eyebrow:** `Why now`
- **Heading:** `The economics of running a diesel fleet have <em>turned</em>.`
- **Subtitle:** `Fuel and carbon costs are rising and volatile — while electric fleets charged from your own solar lock in a lower, stable cost per kilometre. In South Africa, the case is now proven at scale.`
- **Cards:**
  1. icon `TrendingUp` — **Diesel is volatile and only taxed more** — `Diesel sits around R24 a litre and spiked near R32 in 2026. A carbon fuel levy is added at the pump, and the underlying carbon tax rises from R308 a tonne in 2026 to R462 by 2030.` 
  2. icon `Zap` — **Grid power keeps climbing** — `Eskom tariffs rise ~9% a year. Charging from on-site solar and battery storage fixes your energy cost and insulates the fleet from tariff hikes and grid risk.`
  3. icon `Award` — **The savings are proven here** — `Across 12.5 million real South African kilometres, electric fleets run 23–27% cheaper than diesel — at Woolworths, DSV, Clicks and Takealot — with full operational availability.`

### 3 · The Phoenix model — four pillars
Component: `ExplainerCards`, `background="gray"`, `columns={4}`.

- **Eyebrow:** `One managed package`
- **Heading:** `Everything your fleet needs to go electric — <em>from one partner</em>.`
- **Cards:**
  1. icon `Truck` — **Electric vehicles** — `We source and supply the right electric vehicles for your duty cycle — vans, bakkies, urban trucks, minibuses and buses available in South Africa.`
  2. icon `Zap` — **Depot charging** — `SANS-certified AC and DC charging, designed around your routes and depots, with smart load management to avoid demand spikes.`
  3. icon `Sun` — **Solar + battery storage** — `Charge from on-site solar and BESS for the lowest, most stable cost per kilometre — and real emissions cuts the grid alone can't deliver.`
  4. icon `DollarSign` — **Financing** — `We fund the whole transition, so you can go electric without the upfront capital. Subscription or financed-to-own — your choice.`

### 4 · Financing (the centrepiece)
Component: reuse `FinancingBand` (as `/solutions/energy-optimisation` does),
passing EV-specific option cards and accent `#A9D6CB`. Two options (renders
`md:grid-cols-2`):

- **Eyebrow:** `Fleet-as-a-Service`
- **Heading:** `Go electric with <em>zero upfront capital</em>.`
- **Subtitle:** `Financing is the heart of the model. Choose a fully-managed subscription or fund the fleet to own it — either way, we structure vehicles, charging and solar into one package.`
- **Option A — Fleet-as-a-Service (subscription):**
  - Title: `Fleet-as-a-Service`
  - Tagline: `Zero capital. One predictable cost.`
  - Body: `Phoenix owns and operates the vehicles, chargers and solar. You pay a fixed monthly fee — or a rate per kilometre — with maintenance, insurance and charging included. Scale the fleet up or down as you grow.`
  - Bullets: `R0 upfront capital.` · `Fixed monthly or per-km pricing.` · `Maintenance, insurance & charging included.` · `Fully managed — we run and optimise it.`
- **Option B — Financed-to-own:**
  - Title: `Financed-to-own`
  - Tagline: `Own the assets. We fund the switch.`
  - Body: `We arrange funding across the vehicles, charging and solar so you own the fleet and infrastructure outright over the term. The on-site solar qualifies for the Section 12B 100% first-year tax deduction.`
  - Bullets: `Assets on your balance sheet.` · `Funding across vehicles + charging + solar.` · `Section 12B 100% solar deduction.` · `Own it outright at end of term.`
- **Footer note:** `All financing is subject to credit approval. Section 12B and tax treatment should be confirmed with your tax advisor.`

### 5 · Who it's for + vehicles
Component: `ExplainerCards`, `background="white"`, `columns={3}` for industries,
followed by a compact vehicle-class strip rendered via the `footer` slot (plain
JSX cards — no per-vehicle icons).

- **Eyebrow:** `Built for your operation`
- **Heading:** `Electrification pays off first for <em>return-to-depot fleets</em>.`
- **Subtitle:** `If your vehicles run predictable routes and come home to a depot each night, they can charge cheaply from solar and deliver the strongest savings.`
- **Industry cards (6):**
  1. icon `Truck` — **Last-mile & e-commerce delivery** — `Dense urban routes, nightly depot charging, high stop-start running — the best-proven fit in South Africa.`
  2. icon `Thermometer` — **Cold-chain & refrigerated** — `Solar-powered refrigeration removes a second diesel burn — as Clicks/UPD proved with SA's first solar-refrigerated EV fleet.`
  3. icon `Layers` — **FMCG & retail distribution** — `Scheduled depot-to-store loops with large, solar-ready distribution centres.`
  4. icon `Users` — **Staff & shuttle transport** — `Fixed timetabled routes that return to base between shifts — ideal for overnight charging.`
  5. icon `Building` — **Municipal & public transport** — `Defined urban routes and depots — already live with Golden Arrow and MyCiTi in Cape Town.`
  6. icon `TrendingUp` — **Regional logistics** — `Depot-to-depot lanes where predictable distance and return-to-base make electric viable today.`
- **Vehicle strip (footer slot)** — kicker `Vehicles we supply` + a row of compact
  cards (label · one spec line):
  - `Electric vans` — `Panel & delivery vans, ~220–300 km range`
  - `Electric bakkies` — `Double-cab e-bakkies, up to ~450 km`
  - `Urban trucks (~4 t)` — `City distribution, ~200 km range`
  - `Heavy trucks` — `Regional distribution & superlink`
  - `Minibuses & buses` — `Staff, shuttle & public transport`

### 6 · Cost per kilometre (the honest comparison)
New CSS component `CostPerKmBars` — three horizontal bars comparing energy
cost per km for a representative light delivery van, derived from the same
constants as the estimator.

- **Eyebrow:** `The numbers`
- **Heading:** `Diesel is the most expensive way to move your fleet.`
- Bars (value from constants: dieselL/100 9.0, evkWh/100 22):
  - **Diesel** — `R2.16 / km` (9.0 L/100km × R24.00)
  - **Electric — grid charged** — `R0.57 / km` (22 kWh/100km × R2.60)
  - **Electric — solar charged** — `R0.33 / km` (22 kWh/100km × R1.50)
- Supporting stat callout: `~23–27% lower total cost of ownership` with caption
  `Independently measured across 12.5M km of SA electric-fleet operation (Everlectric).`
- **Honesty footnote:** `Energy cost only, for a light delivery van; excludes maintenance (typically ~35% lower for EVs). On South Africa's coal-heavy grid, the carbon saving is modest — charging from solar is what turns cost savings into deep emissions cuts.`

### 7 · How it works  *(CMS content task — Sanity `howItWorks.ev-fleets`)*
Component: existing `HowItWorks` (unchanged code). Update the Sanity document to:

- **Eyebrow:** `How it works`
- **Title:** `From assessment to a fleet on the road`
- **Steps (label · description · tag):**
  1. **Fleet assessment** — `We analyse your routes, duty cycles and fuel spend to find which vehicles to electrify first.` — `Free · no obligation`
  2. **Design & modelling** — `We size the vehicles, depot charging and on-site solar+BESS to your operation.` — `Tailored to your routes`
  3. **Financing** — `We structure the package — subscription or financed-to-own — so you go electric without upfront capital.` — `Zero-capital option`
  4. **Deployment** — `Vehicles, chargers and solar are installed, commissioned and integrated.` — `Turnkey`
  5. **Operate & optimise** — `We run, monitor and optimise charging and energy so your cost per km stays low.` — `Fully managed`

### 8 · Proof + FAQ
- `FeaturedProjects vertical="ev-fleets"` (unchanged).
- `FaqAccordion`, `accent="#A9D6CB"`, `eyebrow="FAQ"`, heading `Fleet
  electrification, answered.` Items:
  1. **What if my vehicles don't return to a depot each night?** — `Depot charging is where electric fleets save the most, because you charge cheaply overnight from solar. If your routes don't return to base, we'll tell you honestly at the assessment whether electrification stacks up yet.`
  2. **Is the range enough for our routes?** — `Most last-mile and urban routes run 150–220 km a day, well within the range of the vehicles we supply. We match vehicle range to your actual duty cycles during the assessment.`
  3. **What happens during load-shedding?** — `Charging from on-site solar and battery storage keeps your fleet moving independently of the grid — one of the main reasons we bundle solar and BESS into the package.`
  4. **Do we need capital to start?** — `No. With Fleet-as-a-Service you pay a fixed monthly or per-kilometre fee with zero upfront capital. If you prefer to own the assets, we arrange financing to own them over the term.`
  5. **How much cheaper is it really?** — `Across 12.5 million kilometres of South African operation, electric fleets have run 23–27% cheaper than diesel. Your saving depends on distance, vehicle type and whether you charge from solar — our estimator gives an indicative figure and the assessment confirms it.`
  6. **What about battery life and resale?** — `Fleet EV batteries are warrantied for years of commercial use, and under Fleet-as-a-Service the battery and residual-value risk sits with us, not you.`

### 9 · Final CTA
Component: `PageFooter`, `ctaVariant="centered"`.

- **Eyebrow:** `Electrify your fleet`
- **Heading:** `See what electric could save your fleet`
- **Body:** `Book a free fleet assessment — we'll analyse your routes and fuel spend and show you the vehicles, charging and financing that make the switch pay.`
- **Primary CTA:** `Book a Fleet Assessment` → `/contact`

---

## New estimator

### Pure calc module — `src/lib/evfleet/estimate.ts`

```typescript
export const DIESEL_PRICE_PER_L = 24.0;
export const GRID_RATE_PER_KWH = 2.60;
export const SOLAR_RATE_PER_KWH = 1.50;
export const CO2_DIESEL_PER_L = 2.68;
export const CO2_GRID_PER_KWH = 0.95;
export const CO2_SOLAR_PER_KWH = 0.05;

export type FleetVehicleType = 'van' | 'car' | 'minibus' | 'truck';
export type ChargingSource = 'grid' | 'solar';

export interface VehicleProfile { label: string; dieselLPer100: number; evKwhPer100: number }

export const FLEET_VEHICLES: Record<FleetVehicleType, VehicleProfile> = {
  van:     { label: 'Light delivery van', dieselLPer100: 9.0,  evKwhPer100: 22 },
  car:     { label: 'Passenger / car',    dieselLPer100: 7.0,  evKwhPer100: 17 },
  minibus: { label: 'Minibus / shuttle',  dieselLPer100: 11.0, evKwhPer100: 28 },
  truck:   { label: 'Medium truck (~4t)', dieselLPer100: 18.0, evKwhPer100: 60 },
};

export interface FleetInput {
  vehicles: number;
  type: FleetVehicleType;
  kmPerMonth: number;      // per vehicle
  charging: ChargingSource;
}

export interface FleetEstimate {
  dieselCostPerKm: number;      // R/km
  evCostPerKm: number;          // R/km
  monthlySaving: number;        // R (fleet)
  annualSaving: number;         // R
  fiveYearSaving: number;       // R
  co2AvoidedTonnesYear: number; // tonnes/yr (fleet); can be ≤0 on grid for heavy EVs
}

export function estimateFleet(input: FleetInput): FleetEstimate;
```

Formulae:
- `v = FLEET_VEHICLES[type]`
- `rate = charging === 'solar' ? SOLAR_RATE_PER_KWH : GRID_RATE_PER_KWH`
- `co2Rate = charging === 'solar' ? CO2_SOLAR_PER_KWH : CO2_GRID_PER_KWH`
- `dieselCostPerKm = v.dieselLPer100 / 100 * DIESEL_PRICE_PER_L`
- `evCostPerKm = v.evKwhPer100 / 100 * rate`
- `fleetKmMonth = vehicles * kmPerMonth`
- `monthlySaving = Math.round(fleetKmMonth * (dieselCostPerKm - evCostPerKm))`
- `annualSaving = monthlySaving * 12`; `fiveYearSaving = annualSaving * 5`
- `co2DieselPerKm = v.dieselLPer100 / 100 * CO2_DIESEL_PER_L`
- `co2EvPerKm = v.evKwhPer100 / 100 * co2Rate`
- `co2AvoidedTonnesYear = Math.round(fleetKmMonth * 12 * (co2DieselPerKm - co2EvPerKm) / 1000 * 10) / 10`

**Test cases (`estimate.test.ts`):**
- van · 10 · 2500 · grid → `dieselCostPerKm 2.16`, `evCostPerKm ≈ 0.572`, `monthlySaving 39700`, `annualSaving 476400`, `fiveYearSaving 2382000`, `co2AvoidedTonnesYear 9.7`.
- van · 10 · 2500 · solar → `evCostPerKm 0.33`, `monthlySaving 45750`, `co2AvoidedTonnesYear 69.1`.
- truck · 5 · 4000 · grid → `dieselCostPerKm 4.32`, `evCostPerKm 1.56`, `monthlySaving 55200` (cost saving positive; documents that a heavy EV still saves money on grid).
- truck · 5 · 4000 · grid → `co2AvoidedTonnesYear` is **negative** (heavy EV on coal grid) — assert `< 0` to lock in the honest behaviour.
- zero vehicles → all money outputs `0`.

### Client component — `src/components/sections/calculators/FleetSavingsEstimator.tsx`
Replaces `EvFleetsCalculator`. Dark translucent card (`rgba(255,255,255,0.06)`,
accent `#A9D6CB`). Controls:
- **Number of vehicles** — slider 1–100 (default 10).
- **Vehicle type** — 4 small toggle buttons / segmented control (default `van`).
- **Distance per vehicle** — slider, `km/month`, 500–8000 step 500 (default 2500).
- **Charging source** — two-button toggle: `Grid` / `Solar + battery` (default `grid`).
Outputs (live):
- **Monthly saving** (hero number, big) + Annual and 5-year secondary.
- **Cost per km: diesel vs electric** — two values, e.g. `R2.16 → R0.57`.
- **CO₂ avoided / year** — display `Math.max(0, co2AvoidedTonnesYear)` tonnes,
  with caption `Charge from solar to maximise CO₂ savings` when `charging === 'grid'`.
- Footnote: `Indicative only. Assumes diesel ~R24/L, depot charging R2.60/kWh (solar R1.50/kWh) and typical vehicle efficiency. Actual savings depend on your routes and tariffs; CO₂ depends on charging from grid vs solar.`
- Fire `dlPush({ event: 'fleet_estimate_used', vertical: 'ev-fleets', ... })` on
  first interaction — add the variant to `src/lib/analytics.ts`.

### Cost-per-km comparison — `src/components/sections/CostPerKmBars.tsx`
CSS-only. Props: `accent`. Renders three labelled horizontal bars whose widths
are proportional to `dieselCostPerKm`/`evCostPerKm(grid)`/`evCostPerKm(solar)`
for the `van` profile, importing the constants from `@/lib/evfleet/estimate`
(no duplicated numbers). Diesel bar in a muted/warning tone, grid in accent,
solar in a deeper accent. Values shown as `R_.__ / km`.

### New icon — `src/components/ui/Icons.tsx`
Add `IconTruck` (simple box-truck outline, same `IconProps` convention). Register
`Truck` in `ExplainerCards`'s `ExplainerIcon` type + `ICONS` map.

---

## Content config — `src/config/evFleetsContent.ts`
Typed `EV_FLEETS` export holding copy for §1–§6, §8, §9 (hero, whyNow, pillars,
financing options, industries + vehicle strip, faq, cta). Types reuse
`ExplainerCardItem`, `FaqItem`, and a local `FinancingOption`/`VehicleClass`
shape. Page imports from config.

## Files touched

- **Create:** `src/lib/evfleet/estimate.ts`, `src/lib/evfleet/estimate.test.ts`,
  `src/components/sections/calculators/FleetSavingsEstimator.tsx`,
  `src/components/sections/CostPerKmBars.tsx`, `src/config/evFleetsContent.ts`
- **Modify:** `src/app/solutions/ev-fleets/page.tsx` (recompose),
  `src/lib/analytics.ts` (event variant), `src/components/ui/Icons.tsx`
  (`IconTruck`), `src/components/sections/ExplainerCards.tsx` (register `Truck`)
- **Delete:** `src/components/sections/calculators/EvFleetsCalculator.tsx`
  (only consumer is this page)
- **Verify props:** `FinancingBand`/`FinancingCards` — confirm exact prop names
  before wiring (read the component; it was generalised for Energy Optimisation).
- **CMS (out-of-code):** update `howItWorks.ev-fleets` Sanity doc per §7.

## Non-goals / out of scope

- No lead-capture gate / soft paywall on the estimator (ungated, like the other
  solution-page calculators).
- No model-by-model vehicle TCO matrix (belongs in the post-assessment report).
- No chart library — the comparison is CSS bars.
- No new Sanity schema; `FeaturedProjects`/`RelatedArticles` internals unchanged.
- Writing new blog/insight articles is editorial, out of scope.

## Open items

- Confirm `FinancingBand` prop shape at implementation (read component).
- Diesel price and Eskom tariff move monthly — the R24/L default is indicative
  and footnoted; revisit at launch.

# Wheeling Page — 3 Models + Eligibility Estimator — Design

> Status: approved-pending-review · Date: 2026-06-30 · Vertical: `wheeling` (coral `#D97C76`)

## Goal

Restructure the Wheeling solution page's models section into **three models** and replace the
made-up bill-slider calculator in the hero with an **eligibility estimator** that routes a
visitor to the model that fits them — or to an alternative solution when wheeling isn't an option.

## Background

Current page (`src/app/solutions/wheeling/page.tsx`):
- 2 model tabs (Direct Wheeling, Aggregated Pool) + a Financing tab (`type: 'financing'`).
- Hero hosts `WheelingCalculator` — a bill slider × fixed 32%, i.e. output is always 32% of input
  (no real insight; same anti-pattern we just removed from Energy Optimisation).

Reference pattern: the C&I `StrategyFinder` wizard (`src/components/sections/StrategyFinder.tsx`)
with its **pure, unit-tested** recommendation logic in `src/lib/strategy/`. This design mirrors
that structure.

---

## 1. Models section — three model tabs

`SolutionTabs` (coral accent) carries exactly three model tabs. The `Aggregated Pool` and
`Financing` tabs are **removed**. Each model tab gets a deep-link `key` so the estimator reveal can
open it via the existing `SolutionTabs` `hashchange` mechanism.

Section header: eyebrow `The models`, heading `Three ways to <em>wheel clean power</em>`,
subtitle `Direct, virtual or owned — the wheeling structure depends on who supplies your business and how you want to participate.`

### 1a. Direct Wheeling — `key: model-direct`, icon `Zap`
- **title:** `Direct Wheeling`
- **body:** `If Eskom supplies your business directly, we connect you to an independent renewable generator and wheel that power to you across the Eskom transmission grid. You pay a fixed tariff below your current Eskom rate — with no capital outlay and nothing installed on site.`
- **bullets:**
  - `Fixed tariff below your Eskom rate.`
  - `Renewable energy certificates (RECs) included.`
  - `NERSA-licensed trading and settlement.`
  - `No infrastructure or capital required.`

### 1b. Virtual Wheeling — `key: model-virtual`, icon `Globe`
- **title:** `Virtual Wheeling`
- **body:** `If your business buys electricity from a municipality that supports virtual wheeling, we wheel renewable generation into the grid on your behalf and the municipality nets it off against your consumption — cleaner power at a lower effective rate, without leaving your municipal supply.`
- **bullets:**
  - `For supported metros — Johannesburg, Cape Town, Tshwane, Ekurhuleni, eThekwini and Nelson Mandela Bay.`
  - `Municipality nets wheeled generation against your bill.`
  - `Fixed, below-tariff pricing on wheeled energy.`
  - `Fully managed agreements and settlement.`

### 1c. Micro-wheeling — `key: model-micro`, icon `Sun`
- **title:** `Micro-wheeling`
- **body:** `A specialised solution for mid-sized consumers who want to own their generation. You purchase a dedicated solar plant — typically around 1 MW — that wheels its output directly to your site. Built for businesses with base loads between 500 kW and 1 MW that want the long-term returns of ownership.`
- **bullets:**
  - `Own a dedicated ~1 MW solar plant.`
  - `Ideal for base loads of 500 kW–1 MW.`
  - `Wheels directly to your point of consumption.`
  - `Maximum lifetime returns through ownership.`

> Copy above is the starting point; the user iterates copy post-build (as on Energy Optimisation).

---

## 2. Eligibility estimator — `WheelingEligibility`

Replaces `WheelingCalculator` in the hero's right column. Dark-card visual language identical to
`StrategyFinder` (coral accent `#D97C76`). Two inputs, then a routed reveal.

Card chrome:
- eyebrow: `Check eligibility`
- title: `Are you eligible for wheeling?`
- helper: `Two quick questions to see which wheeling model fits your business.`

### Step 1 (gate) — Time-of-Use tariff
Question: `Are you on a Time-of-Use tariff?`
Caption: `A tariff where the unit price changes by time of day — peak, standard and off-peak. Common for larger commercial and industrial supplies.`
Options (button list, like StrategyFinder): `Yes` · `No` · `I'm not sure`

- `No`  → short-circuit to reveal **not-eligible-tou** (Step 2 is never shown).
- `Yes` → go to Step 2.
- `I'm not sure` → go to Step 2; carry `verifyTariff = true` so the reveal appends a confirm note.
  *(Decision: proceed-and-verify rather than disqualify — preserves the lead.)*

### Step 2 — Supply point
Question: `Who supplies your electricity?`
Input: a styled native `<select>` (dropdown) populated from `WHEELING_SUPPLY_POINTS` (§3).
On change → reveal.

### Reveal states
- **direct:** `You're eligible` / **Direct Wheeling** / `Because Eskom supplies you directly, we can wheel renewable power to you across the Eskom grid.` → primary CTA `Get a wheeling quote` + chip `Learn about Direct Wheeling →` (opens `#model-direct`).
- **virtual:** `You're eligible` / **Virtual Wheeling** / `{supplyPointLabel} supports virtual wheeling — we can wheel renewable power to you and have it netted against your municipal bill.` → CTA + chip `Learn about Virtual Wheeling →` (`#model-virtual`).
- **not-available** (supply point `other`): `Not available in your area yet` / `Wheeling isn't live with your supplier yet. On-site solar and storage can cut your costs today.` → button `Explore C&I Solar & Storage →` (`/solutions/ci-solar-storage`).
- **not-eligible-tou** (`tou === 'no'`): `Let's get you wheel-ready` / `Wheeling needs a Time-of-Use / large-power-user tariff. Two routes can help — optimise your tariff, or generate on-site.` → buttons `Explore Tariff Optimisation →` (`/solutions/energy-optimisation#lever-tariff`) and `C&I Solar & Storage →` (`/solutions/ci-solar-storage`).
- When `verifyTariff` is true on a direct/virtual reveal, append: `We'll confirm your tariff type during the quote.`

Primary CTAs deep-link to `/contact?intent=client&message=<prefilled>` (e.g.
`I'd like a wheeling quote — Direct Wheeling, supplied by Eskom.`). `restart` resets the wizard,
mirroring `StrategyFinder`.

---

## 3. Architecture & files

Mirrors the tested `strategy/` pattern: config + pure logic + tests + client component.

**Create**
- `src/config/wheelingSupplyPoints.ts`
  ```ts
  export type WheelingModel = 'direct' | 'virtual' | 'none';
  export interface WheelingSupplyPoint { id: string; label: string; model: WheelingModel; }
  export const WHEELING_SUPPLY_POINTS: WheelingSupplyPoint[] = [
    { id: 'eskom',      label: 'Eskom (direct)',                    model: 'direct'  },
    { id: 'joburg',     label: 'City of Johannesburg',              model: 'virtual' },
    { id: 'cape-town',  label: 'City of Cape Town',                 model: 'virtual' },
    { id: 'tshwane',    label: 'City of Tshwane',                   model: 'virtual' },
    { id: 'ekurhuleni', label: 'City of Ekurhuleni',                model: 'virtual' },
    { id: 'ethekwini',  label: 'eThekwini (Durban)',                model: 'virtual' },
    { id: 'nmb',        label: 'Nelson Mandela Bay (Gqeberha)',     model: 'virtual' },
    { id: 'other',      label: "My area isn't listed / other",      model: 'none'    },
  ];
  ```
- `src/lib/wheeling/types.ts` — `WheelingTou = 'yes' | 'no' | 'unsure'`; `WheelingAnswers`; `WheelingOutcome`.
- `src/lib/wheeling/eligibility.ts` — pure:
  ```ts
  export type WheelingStatus = 'direct' | 'virtual' | 'not-available' | 'not-eligible-tou';
  export function evaluateWheeling(a: WheelingAnswers): WheelingOutcome
  // tou==='no' -> not-eligible-tou (supplyPoint ignored)
  // else look up supplyPointId: 'direct'->direct, 'virtual'->virtual(+label), 'none'->not-available
  // verifyTariff = (tou === 'unsure')
  ```
- `src/lib/wheeling/eligibility.test.ts` — covers: no-ToU short-circuit; eskom→direct; each metro→virtual; other→not-available; unsure sets verifyTariff; unsure+other→not-available.
- `src/components/sections/WheelingEligibility.tsx` — `'use client'` wizard: holds `{ tou, supplyPointId }`, branches steps (ToU `no` skips Step 2), calls `evaluateWheeling`, renders reveal, fires `dlPush` analytics (`wheeling_eligibility_start`, `wheeling_eligibility_complete` with `status`).

**Modify**
- `src/app/solutions/wheeling/page.tsx` — swap `WheelingCalculator` → `WheelingEligibility`; replace `tabs` with the 3 models (with `key`s); update tabs header + hero subtitle.
- `src/app/solutions/energy-optimisation/page.tsx` — add `key: 'lever-tariff'` to the Tariff Optimisation tab so `#lever-tariff` deep-links land on it.

**Delete**
- `src/components/sections/calculators/WheelingCalculator.tsx` (orphaned after the swap).

---

## 4. Copy / wiring details

- Hero subtitle (drops "32% average saving"): `Buy renewable energy directly from independent generators and wheel it to your site across the grid — no panels, no capital. Check whether your business qualifies in two questions.` Hero CTA stays `Get a Wheeling Quote`.
- `SolutionTabs` deep-linking already exists (tab `key` + `hashchange`); no component change needed beyond giving the 3 tabs `key`s.
- Analytics mirror `StrategyFinder` (`dlPush`).

## 5. Out of scope (YAGNI)

- No size-band question, no rand/savings output, no live municipal API. The supported-metro list is
  static config, updated as more metros come online.
- No per-model-tab CTA buttons (not requested for this page).
- `SolutionTabs` is not modified to support dropdowns — the dropdown lives only in the estimator.

## 6. Testing

- Unit: `eligibility.test.ts` (Vitest) — all branches enumerated in §3.
- Verification: `npx tsc --noEmit`, `npm run lint`, `npm run build` (page statically generates).
- No component/E2E harness in this project (consistent with existing calculators/finder).

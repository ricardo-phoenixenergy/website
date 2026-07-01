# Carbon Credits Page Rework — Design Spec

> Version 1.0 | 2026-07-01 | Route: `/solutions/carbon-credits`

## Goal

Rework the Carbon Credits solution page so it (1) replaces the gimmicky
monthly-bill revenue slider with a credible **PV-size → carbon revenue
estimator**, and (2) educates the visitor — what carbon credits are, how an
existing solar system already generates them, and why a specialist is needed —
*before* explaining the managed process. The narrative arc is:
**hook → teach the concept → show the opportunity → justify the specialist →
process → mechanics → objections → convert.**

## Architecture

The page stays a Server Component at
`src/app/solutions/carbon-credits/page.tsx`, composed from existing reusable
section components (`SolutionHero`, `ExplainerCards`, `HowItWorks`,
`SolutionTabs`, `FaqAccordion`, `FeaturedProjects`, `RelatedArticles`,
`PageFooter`). The only new code is the estimator: a pure, unit-tested calc
module plus a client component that replaces `CarbonCalculator`. All page copy
that lives in code moves into a single content config file for maintainability,
mirroring the `WEBUYSOLAR` pattern (`src/config/webuysolarContent.ts`).

Accent colour for the vertical: **Sage Green `#9CAF88`** (`SOLUTION_META['carbon-credits'].accent`).

## Tech Stack

Next.js App Router · TypeScript strict · Tailwind (arbitrary hex tokens) ·
Framer Motion (via existing `AnimatedSection`) · Vitest for the calc module.

---

## Global Constraints

- TypeScript strict — no `any`; named exports only.
- Never hardcode brand values inline where a token/`SOLUTION_META` value exists;
  the vertical accent is `#9CAF88`.
- Estimator revenue must render as a **low–high range**, never a single figure.
- Estimator constants (verbatim):
  - Specific yield: **1,600 kWh/kWp/year**
  - Grid emission factor: **0.95 tCO₂/MWh**
  - Credit price band: **R50 (low) – R150 (high) per credit**
  - Derived: **1 credit = 1 tonne CO₂**; ≈ **1.52 credits per kWp/year**
    (1 MWp ⇒ ~1,520 credits/yr ⇒ ~R76,000–R228,000/yr).
- The estimator footnote must state the figures are indicative only and vary
  with project performance and market pricing.
- `HowItWorks` content (section 5) is Sanity-sourced via
  `getHowItWorks('carbon-credits')` — it is a **CMS content task**, not a code
  change. The exact copy is specified below.

---

## Section-by-Section Specification

### 1 · Hero + Revenue Estimator
Component: `SolutionHero` with the estimator passed as `children`.

- **Badge:** `Carbon Credits`
- **Title (supports `<em>`):** `Turn your existing solar system into <em>a new revenue stream</em>.`
- **Subtitle:** `Your solar system already avoids carbon emissions every day. Phoenix certifies those reductions, converts them into verified carbon credits, and sells them on your behalf — creating additional revenue on top of the electricity savings you already enjoy.`
- **Primary CTA:** `Book a Carbon Assessment` → `/contact`
- **heroBg:** keep existing `linear-gradient(135deg, #0d1f22 0%, #182a1a 50%, #2a4a28 100%)`
- **Right column:** new `CarbonRevenueEstimator` (see "New estimator" below).

### 2 · How Carbon Becomes Revenue
Component: `ExplainerCards`, `background="white"`, `columns={3}`, `accent="#9CAF88"`.

- **Eyebrow:** `The basics`
- **Heading:** `How does your solar system generate <em>carbon credits</em>?`
- **Subtitle:** `Every unit of solar electricity your system produces avoids emissions that would otherwise have come from the national grid. Those avoided emissions can be independently verified, certified and sold as carbon credits — creating an entirely new revenue stream from the same solar asset.`
- **Cards:**
  1. icon `Sun` — **Your solar already avoids emissions** — `Every megawatt-hour your system generates replaces electricity from the grid, preventing carbon emissions that would otherwise have been produced.`
  2. icon `ClipboardCheck` — **Those reductions are independently verified** — `Your generation data is measured, audited and verified against recognised carbon standards before credits are issued.`
  3. icon `DollarSign` — **Verified credits become revenue** — `Once issued, the credits are sold to qualified buyers. Phoenix manages the entire process and you receive the proceeds.`

### 3 · Why Your Solar Could Be Earning More
Component: `ExplainerCards`, `background="gray"`, `columns={3}`.

- **Eyebrow:** `The opportunity`
- **Heading:** `Your solar system already saves money. <em>It could also be generating revenue.</em>`
- **Cards:**
  1. icon `Zap` — **You're already creating the asset** — `If your solar system is generating electricity, it's already producing the emissions reductions required for carbon credits.`
  2. icon `TrendingUp` — **Revenue that stacks on your savings** — `Carbon credit income is earned in addition to the electricity bill savings your system already delivers.`
  3. icon `Building` — **No changes to your system** — `No additional equipment, operational changes or disruption to your facility. Phoenix handles registration, verification and trading while your system continues operating as normal.`

### 4 · Why Phoenix
Component: `ExplainerCards`, `background="white"`, `columns={3}`.

- **Eyebrow:** `Why work with us?`
- **Heading:** `We unlock the value. <em>You keep running your business.</em>`
- **Subtitle:** `Generating carbon credits is far more than simply owning solar. It requires ongoing monitoring, independent verification, registry management and access to carbon markets. Phoenix manages the entire process on your behalf.`
- **Cards:**
  1. icon `ClipboardCheck` — **Registration & Compliance** — `Project registration, eligibility assessment and documentation.`
  2. icon `Activity` — **Monitoring & Verification** — `Continuous monitoring, emissions calculations and third-party verification.`
  3. icon `TrendingUp` — **Trading & Payouts** — `We market your credits, manage buyer relationships and distribute proceeds with complete transparency.`

### 5 · From Generation to Payout  *(CMS content task — Sanity `howItWorks.carbon-credits`)*
Component: existing `HowItWorks` (unchanged code). Update the Sanity document to:

- **Eyebrow:** `How it works`
- **Title:** `From generation to payout`
- **Steps (label · description · tag):**
  1. **Eligibility Assessment** — `We assess your system and confirm whether it qualifies to generate credits.` — tag `Free · no obligation`
  2. **Project Registration** — `Phoenix registers your project and prepares all required documentation.` — tag `6–8 week onboarding`
  3. **Monitoring & Data Collection** — `Generation data is captured automatically and continuously from your inverters.` — tag `Continuous`
  4. **Verification** — `An independent third party verifies your avoided emissions against a recognised standard.` — tag `Independent audit`
  5. **Credit Issuance** — `Verified reductions are issued as tradable carbon credits.` — tag `1 credit = 1 tonne`
  6. **Trading & Payout** — `Phoenix sells your credits to qualified buyers and pays the proceeds to you.` — tag `Scheduled payouts`

> If maintaining seven discrete nodes in the CMS is impractical, the two data
> steps (Monitoring, Verification) may be kept separate as above; do **not**
> collapse "Trading" and "Credit Issuance" — issuance and sale are distinct.

### 6 · Behind the Scenes
Component: `SolutionTabs`, `accent="#9CAF88"`, `vertical="carbon-credits"`. **The
Financing tab is removed** — carbon credits are a revenue product, not a capex
purchase. Three content tabs:

- **Eyebrow:** `Behind the scenes`
- **Heading:** `What it takes to turn generation into <em>verified credits</em>`
- Tabs:
  1. label `Measurement & MRV`, icon `Activity` — **Measurement, Reporting & Verification** — `Automatic collection of inverter data, emissions calculations and audit-ready reporting throughout the life of the project.` — bullets: `Automatic inverter data capture.` · `Baseline emission displacement calculation.` · `Audit-ready reports.` · `ESG dashboard for corporate reporting.`
  2. label `Verification & Standards`, icon `ClipboardCheck` — **Independent verification against recognised standards** — `Independent third-party verification against recognised international carbon standards. Phoenix selects the most appropriate methodology for your project.` — bullets: `Independent third-party audit.` · `Recognised international standards.` · `Best-fit methodology per project.` · `Full documentation trail.`
  3. label `Trading & Payouts`, icon `DollarSign` — **Credit trading and transparent payouts** — `Verified credits are sold through trusted carbon markets and buyer networks. You receive scheduled payouts together with complete reporting and transaction transparency.` — bullets: `Access to vetted buyer networks.` · `Scheduled credit sales.` · `Transparent payouts.` · `Full transaction reporting.`

### 7 · FAQ
Component: `FaqAccordion`, `accent="#9CAF88"`, `eyebrow="FAQ"`, heading
`Carbon credits, answered.` Items (question · answer):

1. **Is carbon credit trading legitimate?** — `Yes. Carbon credits are a well-established, regulated global market. Credits are only issued after independent third-party verification against recognised standards, so every credit represents a genuine, audited tonne of avoided emissions.`
2. **Do I still own my solar system?** — `Yes. You retain full ownership of your system and continue to operate it exactly as you do today. Phoenix only manages the certification and sale of the carbon reductions it produces.`
3. **Can I still claim my renewable energy benefits?** — `Your electricity bill savings are unaffected. We'll confirm how carbon credit registration interacts with any other environmental claims so there's no double-counting, and structure everything correctly from the start.`
4. **What does the service cost?** — `There's no upfront cost to assess and register your system. Phoenix is paid from a share of the credit revenue generated, so our incentives are aligned with yours — we only earn when you do.`
5. **Is there a minimum system size?** — `Larger systems generate more credits and are the most economical to register, but we assess each system individually. Book an assessment and we'll tell you whether yours qualifies.`
6. **How long before I receive my first payment?** — `Onboarding and registration typically take six to eight weeks, after which monitoring runs continuously and credits are issued and sold on a scheduled basis.`
7. **What happens if carbon prices change?** — `Carbon prices move with the market, which is why we show revenue as a range rather than a fixed figure. Phoenix actively manages the timing and placement of sales to protect your returns.`
8. **Can newly installed solar systems be registered from day one?** — `Yes. New systems can be enrolled at commissioning so they start generating carbon credits from their first day of operation.`

### 8 · Featured Projects & Insights
Components: `FeaturedProjects vertical="carbon-credits"` and
`RelatedArticles vertical="carbon-credits"` — both unchanged (data-driven).
Related-article topics to prioritise (editorial, out of scope for this build):
*How Carbon Credits Work · Are Carbon Credits Worth It? · How Much Could Your
Solar System Earn? · Carbon Tax vs Carbon Credits Explained.*

### 9 · Final CTA
Component: `PageFooter`, `ctaVariant="centered"`.

- **Eyebrow:** `Start earning`
- **Heading:** `Turn your solar system into an additional source of revenue`
- **Body:** `We'll assess your existing solar system, estimate how many carbon credits it could generate and confirm whether it qualifies — all at no obligation.`
- **Primary CTA:** `Book a Carbon Assessment` → `/contact`

---

## New estimator

### Pure calc module — `src/lib/carbon/estimate.ts`
Mirrors the tested-logic pattern of `src/lib/wheeling` and `src/lib/strategy`.

```typescript
export const CARBON_YIELD_KWH_PER_KWP = 1600;   // specific yield, kWh/kWp/yr
export const GRID_FACTOR_T_PER_MWH = 0.95;      // tCO₂ per MWh displaced
export const CREDIT_PRICE_LOW = 50;             // ZAR per credit (low)
export const CREDIT_PRICE_HIGH = 150;           // ZAR per credit (high)

export interface CarbonEstimate {
  sizeKwp: number;
  tonnesPerYear: number;    // avoided CO₂; equals creditsPerYear (1:1)
  creditsPerYear: number;
  revenueLow: number;       // ZAR/yr
  revenueHigh: number;      // ZAR/yr
}

export function estimateCarbon(sizeKwp: number): CarbonEstimate;
```

Formula: `credits = round(sizeKwp * 1600 * 0.95 / 1000)`, `tonnes = credits`,
`revenueLow = credits * 50`, `revenueHigh = credits * 150`.

**Test cases (`estimate.test.ts`):**
- `estimateCarbon(1000)` → `{ tonnesPerYear: 1520, creditsPerYear: 1520, revenueLow: 76000, revenueHigh: 228000 }`
- `estimateCarbon(100)` → `{ creditsPerYear: 152, revenueLow: 7600, revenueHigh: 22800 }`
- `estimateCarbon(10000)` → `{ creditsPerYear: 15200, revenueLow: 760000, revenueHigh: 2280000 }`
- `estimateCarbon(0)` → all zero.

### Client component — `src/components/sections/calculators/CarbonRevenueEstimator.tsx`
Replaces `CarbonCalculator` inside the hero (same dark translucent card
styling: `rgba(255,255,255,0.06)` bg, `#9CAF88` accent).

- Heading: `Estimate your annual carbon revenue`
- Input: **System size** slider, `min 100`, `max 10000`, `step 100` kWp;
  label shows the value formatted (e.g. `1.0 MWp` / `500 kWp`).
- Output tiles (three):
  - `~{tonnesPerYear} tonnes` CO₂ avoided per year
  - `~{creditsPerYear} verified credits` per year  *(caption: 1 credit = 1 tonne)*
  - `R{revenueLow} – R{revenueHigh}` estimated annual carbon revenue
  - Rand formatting reuses the existing `formatRand` helper style (`Rk`/`RM`).
- Footnote: `Based on typical South African solar yields (~1,600 kWh/kWp) and the current grid emissions factor (~0.95 tCO₂/MWh). Revenue estimates are indicative only and will vary with project performance and market pricing.`
- Fire a `dlPush` analytics event on first interaction (mirror
  `wheeling_eligibility_start` pattern) — e.g. `carbon_estimate_used` with the
  chosen `size_kwp`. Add the event variant to `src/lib/analytics.ts`.

---

## Content config — `src/config/carbonCreditsContent.ts`
A single typed export `CARBON_CREDITS` holding the copy for sections 2, 3, 4, 6,
7, 9 (hero title/subtitle may also move here). Types reuse `ExplainerCardItem`,
`TabItem`, and `FaqItem`. Page file imports from this config so copy edits don't
touch JSX. Mirrors `src/config/webuysolarContent.ts`.

## Files touched

- **Create:** `src/lib/carbon/estimate.ts`, `src/lib/carbon/estimate.test.ts`,
  `src/components/sections/calculators/CarbonRevenueEstimator.tsx`,
  `src/config/carbonCreditsContent.ts`
- **Modify:** `src/app/solutions/carbon-credits/page.tsx` (recompose sections,
  swap estimator), `src/lib/analytics.ts` (new event variant)
- **Delete/retire:** `src/components/sections/calculators/CarbonCalculator.tsx`
  (only used by this page — remove once the page no longer imports it)
- **CMS (out-of-code content task):** update `howItWorks.carbon-credits` Sanity
  document per section 5.

## Non-goals / out of scope

- Writing the four related blog articles (editorial task).
- Any change to `FeaturedProjects` / `RelatedArticles` internals or Sanity
  schemas.
- Real-time or per-project carbon pricing — the estimator uses the fixed
  R50–R150 band above.
- Lead capture beyond the existing `/contact` CTA (no soft paywall here).

## Open items

- Confirm the final Related-article slugs exist in Sanity before linking
  (editorial; page already degrades gracefully when none exist).

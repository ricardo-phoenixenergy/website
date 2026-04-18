# 11 — Tools: Solar Asset Valuation Tool
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Route: `/tools/solar-valuation`
> **Approved April 2026**

---

## Overview

The Solar Asset Valuation Tool is a three-step interactive calculator that gives owners of existing solar systems (and BESS) an indicative buyback valuation using industry-standard DCF + depreciated cost + market comparables methodology. It sits under the WeBuySolar vertical and is the primary lead-capture mechanism for that service.

**Key design principles:**
- Generation is calculated from installed kWp and regional SA yield — never from the user's net electricity bill (which is net-of-solar and would understate the system's actual contribution)
- Solar and BESS are valued independently using separate depreciation models, then combined
- A soft paywall gates the full results — the user sees blurred results and unlocks by submitting name + email + phone
- The tool is a lead generator: captured details route to the WeBuySolar team via the same `/api/contact` Resend pipeline as the Contact page

---

## Page Structure

```
[Navbar — light glass pill]
[Breadcrumb — Home / Tools / Solar Asset Valuation]
[Page header — eyebrow + H1 + subtitle]
[Three-step tool card]
  Step 1: System details (solar + BESS toggle)
  Step 2: Condition & context
  Step 3: Results — blurred behind soft paywall
[Footer]
```

---

## Page Header

- Eyebrow: `WEBUYSOLAR TOOL`
- H1: `What is your solar system worth?` — "worth" in Dusty Blue `#709DA9`
- Subtitle: *"Get an indicative buyback valuation in under 2 minutes. Based on real SA market data, DCF analysis, and WeBuySolar transaction comparables."*
- `max-width: 600px`

---

## Step Indicator

Three steps connected by lines — same pattern as How It Works:
```
[1 System details] ——— [2 Condition] ——— [3 Your valuation]
```
- Inactive: `border: 0.5px solid var(--color-border-secondary)`, muted text
- Active: Deep Teal `#39575C` filled circle, primary text, `font-weight: 500`
- Done: `background: var(--color-background-secondary)`

---

## Step 1 — System Details

### Solar Array section

#### Installed solar capacity (kWp)
- **Type:** Range slider
- **Range:** 3–500 kWp, `step: 1`
- **Default:** 20 kWp
- **Live readout:** e.g. `20 kWp`
- **Hint:** *"Residential: 5–30 kWp · Small C&I: 30–100 kWp · Large C&I: 100 kWp+"*

#### Year of installation
- **Type:** Range slider
- **Range:** 2015–2025, `step: 1`
- **Default:** 2021
- **Hint:** *"Age determines panel degradation rate and remaining warranty value"*

#### Panel brand tier
- **Type:** 3-option segmented control
- **Options:** `Tier 1` · `Tier 2` · `Tier 3 / unknown`
- **Default:** Tier 1
- **Hint:** *"Tier 1: JA Solar, Canadian Solar, LONGi, Trina · Tier 3: unbranded / Chinese no-name"*
- **Valuation impact:** Tier multiplier applied to blended solar value (T1: 1.00, T2: 0.88, T3: 0.72)

#### Inverter type
- **Type:** 4-option segmented control
- **Options:** `String` · `Hybrid` · `Micro` · `Off-grid`
- **Default:** String
- **Hint:** *"Hybrid inverters command a significant premium as they support BESS"*
- **Valuation impact:** Sets replacement cost rate per kWp (see market rates table below)

---

### BESS section (toggle)

A toggle switch labelled *"Does your system include battery storage?"* with sub-label *"BESS is valued separately and can significantly increase total buyback value"*. Default: off.

When toggled on, four fields appear below:

#### Battery capacity (kWh)
- **Type:** Range slider
- **Range:** 5–500 kWh, `step: 5`
- **Default:** 20 kWh
- **Hint:** *"Total usable capacity installed"*

#### Battery chemistry
- **Type:** 3-option segmented control
- **Options:** `LFP / LiFePO₄` · `Li-NMC` · `Lead-acid`
- **Default:** LFP
- **Hint:** *"LFP retains value significantly better — 3,000+ cycle life vs 300–500 for lead-acid"*
- **Valuation impact:** Sets replacement rate per kWh and depreciation life (see BESS model below)

#### Estimated battery health (SoH)
- **Type:** 3-option segmented control
- **Options:** `90%+ (like new)` · `70–90% (good)` · `Below 70% (degraded)`
- **Default:** 90%+
- **Hint:** *"State of Health — most LFP systems remain above 80% SoH for 8–10 years"*

#### Battery brand
- **Type:** 3-option segmented control
- **Options:** `Premium (Pylontech, BYD, CATL)` · `Mid-range` · `Generic`
- **Default:** Premium

---

## Step 2 — Condition & Context

Six segmented control fields:

| Field | Options | Default | Hint |
|---|---|---|---|
| Overall system condition | Excellent / Good / Fair / Poor | Excellent | Excellent: no faults, recently serviced · Poor: inverter faults or physical damage |
| Monitoring system | Yes — remote monitoring / No monitoring | Yes | Verified production data substantially increases buyer confidence |
| Panel warranty remaining | 15+ years / 5–15 years / Under 5 years / Expired | 15+ years | — |
| COC / electrical compliance cert | Yes — in hand / No / not sure | Yes | Required for resale — absence discounted from value |
| Province / region | Gauteng / Western Cape / KZN / Other | Gauteng | Affects regional solar yield used in DCF |
| Reason for selling | Upgrading / Relocating / Refinancing / Other | Upgrading | Informational only — routed to WeBuySolar team |

### Information callout
```
How we value your system:
Phoenix Energy uses a weighted three-method approach — DCF analysis (present value
of future displaced tariff savings calculated from actual system capacity, not your
net bill), depreciated replacement cost (current SA market rate adjusted for age,
condition and component quality), and market comparables from recent WeBuySolar
transactions. Solar and BESS are valued independently and then combined.
```

---

## Step 3 — Results (soft paywall)

### Blurred results layer

The full results card renders immediately and is blurred via `filter: blur(7px)` + `user-select: none` + `pointer-events: none`. The user can see shapes and numbers are there but cannot read them. The blur lifts smoothly on unlock (`transition: filter 0.4s`).

### Soft paywall overlay card

Positioned absolute over the blurred results, centred:

- Icon: Deep Teal circle with lightning bolt `⚡`
- Title: *"Your valuation is ready"*
- Body: *"Enter your details to unlock your full report — including the year-by-year DCF breakdown and your personalised WeBuySolar buyback offer."*
- Four fields: First name · Last name · Email address · Phone number
- CTA button: `Unlock my full valuation →`
- Privacy note: *"Used only to send your report and for a WeBuySolar specialist to follow up. Never shared or sold."*

**Validation:** First name + email required. Phone + last name optional but strongly prompted. On submit: overlay hides, blur removes, "what happens next" panel appears below.

**Lead routing:** On unlock, POST to `/api/contact` with `intent: 'webuysolar'` + all form fields + full valuation data object (kWp, kWh, age, blended value, range). Same Resend pipeline as Contact page. Email subject: `[WeBuySolar] Valuation request — {kWp}kWp system, {firstName} {lastName}`.

---

## Results Panel Content

### 6 metric cards (3×2 grid)

| Position | Label | Source |
|---|---|---|
| Top-left (accent) | Indicative buyback value | `solarFinal + bessVal` |
| Top-centre | Solar array value | `solarFinal` |
| Top-right | BESS value | `bessVal` (or "N/A" if no BESS) |
| Bottom-left | 10-yr displaced savings (PV) | `dcfTotal` |
| Bottom-centre | Replacement cost (new) | `solarReplacement + bessReplacement` |
| Bottom-right | Retained value | `total / solarReplacement × 100` |

Accent card: `background: #39575C`, white text, white-60% label, white-50% sub.
Standard cards: `background: var(--color-background-secondary)`.

### Bar chart — 10-year projected annual savings

- Chart.js bar chart
- X axis: years (e.g. `2022`, `2023` ... `2031`)
- Y axis: annual displaced saving in Rand (R000s)
- Bar colour: Deep Teal `#39575C`
- Each bar: `gen_yr_i × tariff_yr_i` where gen degrades by `degRate` per year and tariff escalates 12.7%/yr
- Tooltip: full Rand value formatted with `.toLocaleString('en-ZA')`

### Breakdown rows

Key-value table showing all inputs and intermediate calculations:
Solar capacity · Battery storage (if present) · System age / panel degradation · Regional solar yield · Yr 1 displaced electricity saving · 10-yr DCF · Solar array depreciated cost value · BESS depreciated value (if present) · Blended solar valuation · Indicative total buyback range

### Methodology note

Small muted text block citing all assumptions and sources. Includes disclaimer: *"This is an indicative estimate only — a formal offer requires on-site verification."*

### Post-unlock: What happens next

Three-step promise list (same pattern as Contact page):
1. WeBuySolar specialist reviews valuation and contacts you within 1 business day
2. Free on-site verification arranged to confirm system condition and production data
3. Formal written offer within 5 business days — no obligation to accept

---

## Valuation Model

### Solar array — three-method weighted blend

```
Blended solar value = (DCF × 0.45) + (Depreciated cost × 0.35) + (Market comps × 0.20)
Final solar value   = Blended solar value × Tier multiplier
```

#### Method 1: DCF — displaced tariff savings (45% weight)

```typescript
const saYield = { gp: 1680, wc: 1900, kzn: 1750, other: 1680 }; // kWh/kWp/yr
const selfConsumptionRatio = 0.80;   // Industry standard
const tariff2025 = 3.50;             // R/kWh (Eskom/municipal avg, 2025)
const tariffEscalation = 0.127;      // NERSA-approved 2025/26 rate
const wacc = 0.12;                   // SA risk-adjusted cost of capital

let dcfTotal = 0;
for (let i = 1; i <= 10; i++) {
  const tariff = tariff2025 * Math.pow(1 + tariffEscalation, i - 1);
  const gen    = kw * saYield[prov] * perfFactor * (1 - degRate * (i - 1)) * selfConsumptionRatio;
  const saving = gen * tariff;
  dcfTotal    += saving / Math.pow(1 + wacc, i);
}
```

**Data sources:**
- SA solar yield: SA PV Know-How (average 1,680 kWh/kWp/yr Gauteng)
- Eskom tariff: R3.50/kWh (2025 direct + municipal average)
- Tariff escalation: 12.7% (NERSA approved 2025/26, Standard Bank energy report Feb 2025)
- WACC: 12% (SA risk-adjusted rate for energy assets)
- Self-consumption: 80% industry standard (remainder fed back to grid or curtailed)

#### Method 2: Depreciated replacement cost (35% weight)

```typescript
// 2025 SA installed market rates (EnergyBee, LZY Energy)
const invRate = { string: 20000, hybrid: 25000, micro: 27000, offgrid: 30000 }; // R/kWp

const solarReplacement = kw * invRate[inv];
const ageFactor        = Math.max(0, 1 - age / 25);  // 25-yr panel lifespan
const solarCostVal     = solarReplacement * ageFactor * condM * monM * warrM * cocM;
```

**Condition multipliers:**
| Factor | Excellent | Good | Fair | Poor |
|---|---|---|---|---|
| Condition | 1.00 | 0.88 | 0.72 | 0.52 |

**Quality multipliers:**
| Factor | Yes/Full | Mid | No/None/Expired |
|---|---|---|---|
| Monitoring | 1.04 | — | 0.97 |
| Warranty | 1.05 (15+ yr) | 1.00 (5–15) | 0.93 (<5) / 0.85 (expired) |
| COC cert | 1.00 | — | 0.93 |

#### Method 3: Market comparables (20% weight)

```typescript
const solarMktAdj = solarCostVal * 0.92;
// Applied discount reflects that secondary market transactions typically clear
// at 8% below depreciated replacement cost in current SA market conditions.
// Updated periodically based on WeBuySolar transaction data.
```

#### Tier multiplier (applied after blend)

| Tier | Multiplier | Rationale |
|---|---|---|
| Tier 1 (JA, Canadian, LONGi, Trina) | 1.00 | Bloomberg Tier 1, bankable warranty |
| Tier 2 (mid-range) | 0.88 | Reduced secondary market demand |
| Tier 3 / unknown | 0.72 | Warranty risk, unverifiable performance data |

#### Panel degradation rates

| Tier | Rate | Standard |
|---|---|---|
| Tier 1 | 0.5%/yr | IEC 61215 / manufacturer spec |
| Tier 2 | 0.7%/yr | Industry estimate |
| Tier 3 | 1.0%/yr | Conservative estimate for no-name panels |
| Maximum applied | 30% | Floor: no system valued below 70% performance factor |

---

### BESS — independent valuation model

```typescript
// 2025 SA installed BESS cost (LZY Energy, EnergyBee)
const chemRate = { lfp: 12000, nmc: 10500, lead: 4000 }; // R/kWh installed
const chemLife = { lfp: 12,    nmc: 8,     lead: 4 };    // Calendar life (years)

const brandMult = { premium: 1.00, mid: 0.85, generic: 0.65 };
const sohMult   = { high: 1.00, mid: 0.80, low: 0.55 };

const bessReplacement = bessKwh * chemRate[chem];
const bessAgeFactor   = Math.max(0, 1 - age / chemLife[chem]);
const bessVal         = bessReplacement * bessAgeFactor * sohMult[soh] * brandMult[brand] * condM;
```

**BESS chemistry rationale:**
| Chemistry | Rate | Life | Cycles | Notes |
|---|---|---|---|---|
| LFP (LiFePO₄) | R12,000/kWh | 12 yr | 3,000–4,000 | Pylontech, BYD, CATL — dominant in SA market |
| Li-NMC | R10,500/kWh | 8 yr | 1,500–2,000 | Higher energy density, shorter cycle life |
| Lead-acid | R4,000/kWh | 4 yr | 300–500 | Rapidly depreciated, low secondary value |

**Brand tier rationale:**
- Premium (Pylontech, BYD, CATL): transferable BMS warranty, verified SoH reporting
- Mid-range: limited warranty transferability
- Generic: no BMS data, no warranty — priced on chemistry value only

---

## Component File Structure

```
src/
├── app/
│   └── tools/
│       └── solar-valuation/
│           └── page.tsx                    ← Page wrapper, metadata
├── components/
│   └── tools/
│       └── SolarValuationTool.tsx          ← Main tool component
│           ├── StepIndicator.tsx
│           ├── Step1SystemDetails.tsx
│           ├── Step2Condition.tsx
│           ├── Step3Results.tsx
│           │   ├── ResultsGrid.tsx
│           │   ├── DCFBarChart.tsx         ← Chart.js bar chart
│           │   ├── BreakdownRows.tsx
│           │   └── SoftPaywall.tsx
│           └── useValuation.ts             ← All calculation logic
└── lib/
    └── valuation/
        ├── solarModel.ts                   ← DCF + cost model
        ├── bessModel.ts                    ← BESS model
        └── constants.ts                    ← All market rate constants
```

---

## TypeScript Interfaces

```typescript
// src/lib/valuation/types.ts

interface SolarInputs {
  kw: number;                           // Installed kWp
  installYear: number;                  // Year of installation
  tier: 'T1' | 'T2' | 'T3';            // Panel brand tier
  inverterType: 'string' | 'hybrid' | 'micro' | 'offgrid';
}

interface BessInputs {
  enabled: boolean;
  kWh: number;                          // Installed capacity
  chemistry: 'lfp' | 'nmc' | 'lead';
  soh: 'high' | 'mid' | 'low';         // State of health
  brand: 'premium' | 'mid' | 'generic';
}

interface ConditionInputs {
  condition: 'exc' | 'good' | 'fair' | 'poor';
  monitoring: boolean;
  warrantyYears: 'full' | 'mid' | 'low' | 'none';
  hasCoc: boolean;
  province: 'gp' | 'wc' | 'kzn' | 'other';
  reason: 'upgrade' | 'relocate' | 'finance' | 'other';
}

interface ValuationResult {
  solarDcf: number;                     // 10-yr DCF present value
  solarCostVal: number;                 // Depreciated replacement cost
  solarMktAdj: number;                  // Market comparables
  solarFinal: number;                   // Blended + tier multiplier
  bessVal: number;                      // BESS valuation (0 if none)
  total: number;                        // solarFinal + bessVal
  rangeLow: number;                     // total × 0.88
  rangeHigh: number;                    // total × 1.12
  solarReplacement: number;             // New system cost
  bessReplacement: number;              // New BESS cost
  retained: number;                     // % of replacement cost retained
  yrCashFlows: number[];                // 10 annual saving values for chart
}
```

---

## Lead Capture API

```typescript
// POST /api/contact — same route as Contact page
// Additional fields for WeBuySolar tool:

interface WeBuySolarLead {
  intent: 'webuysolar';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  valuation: {
    kw: number;
    bessKwh: number;
    installYear: number;
    tier: string;
    province: string;
    indicativeValue: number;
    rangeLow: number;
    rangeHigh: number;
    dcfValue: number;
  };
  recaptchaToken: string;    // reCAPTCHA v3, same as Contact page
}

// Email to info@phoenixenergy.solutions:
// Subject: [WeBuySolar] {kWp}kWp valuation — {firstName} {lastName} — {fmtK(indicativeValue)}
// Body: full valuation summary + contact details
```

---

## SEO & Metadata

```typescript
export const metadata = {
  title: 'Solar Asset Valuation Tool — What Is Your System Worth? | Phoenix Energy',
  description: 'Get an instant indicative buyback valuation for your solar system and BESS. Based on DCF analysis, SA market rates, and WeBuySolar transaction data.',
  openGraph: {
    images: [{ url: '/og-tools-valuation.jpg' }],
  },
};
```

**Structured data (HowTo schema):**
```typescript
{
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to value a solar system in South Africa',
  step: [
    { '@type': 'HowToStep', name: 'Enter system details', text: 'Input your installed kWp, year, panel tier and inverter type.' },
    { '@type': 'HowToStep', name: 'Describe system condition', text: 'Rate condition, warranty status, monitoring, and COC certificate.' },
    { '@type': 'HowToStep', name: 'Receive your valuation', text: 'Get a DCF-based indicative buyback range from WeBuySolar.' },
  ],
}
```

---

## Market Rate Constants (update annually)

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
};
```

> ⚠️ **Review constants annually** — Eskom tariff, installed cost per kWp, and BESS rates change year-on-year. The methodology note shown to users must always cite the year of the data.

---

## Open Items

| # | Item | Owner |
|---|---|---|
| 1 | reCAPTCHA v3 site key for tool paywall form | Dev |
| 2 | Extend `/api/contact` route to handle `intent: 'webuysolar'` with valuation payload | Dev |
| 3 | Update `CONSTANTS` annually with latest NERSA tariff ruling and EnergyBee cost data | Dev |
| 4 | Review WeBuySolar market comparables discount factor (currently 0.92) against real transaction data | Phoenix Energy |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.1 | Approved April 2026*

---

## Accessibility Fix (Engineering Review April 2026)

### Blurred results layer — screen reader handling
The blurred results div (visible before paywall unlock) must have `aria-hidden="true"` so screen readers skip it entirely. On unlock, remove `aria-hidden` and add `aria-live="polite"` to announce the revealed content.

```tsx
<div
  ref={resultsRef}
  aria-hidden={!unlocked}
  aria-live={unlocked ? 'polite' : undefined}
  style={{ filter: unlocked ? 'none' : 'blur(7px)', userSelect: unlocked ? 'auto' : 'none' }}
>
  {/* results content */}
</div>
```


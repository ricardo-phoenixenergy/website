# 11 · Tools: Solar Valuation Request
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.2
> Route: `/tools/solar-valuation`
> **Approved April 2026. Updated 2026-09-24:** rewritten as the valuation request the site now ships. The April calculator, its valuation model and the soft paywall were removed in September 2026 (UX fix programme, steps 8a and 10a).

---

## Overview

The Solar Valuation Request is a three-step form for owners of existing commercial solar systems, with or without battery storage. It collects the system's details and the owner's contact details and emails them to the WeBuySolar team. A specialist then contacts the owner to book a free on-site audit, and the valuation arrives with the preliminary offer after that audit. The page shows no figure.

It sits under the WeBuySolar vertical and is linked from `/tools` and the WeBuySolar page. Every link to it uses `VALUATION_CTA` in `src/config/ctas.ts`: "Request a valuation".

**Key design principles:**
- A request, not a calculator. Nothing on the page estimates a value, and no copy promises an on-screen figure.
- One source for the offer. The eligibility rule, the first contact and the process steps come from `WEBUYSOLAR_OFFER` in `src/config/webuysolarOffer.ts`, which the WeBuySolar page also renders, so the two can't promise different things.
- One reply promise. The first contact uses `REPLY_PROMISE.window` from `src/config/contact.ts` ("within 1 business day").
- The deal is an acquisition, never a "buyback".
- Leads go to the WeBuySolar team through the same `/api/contact` Resend route as the contact form, with `intent: 'webuysolar'`.

---

## Page Structure

```
[Navbar]
[Breadcrumb: Home / Tools / Solar Valuation Request]
[Page header: eyebrow, H1, intro, eligibility line, "How WeBuySolar works" link]
[Three-step request card]
  Step 1: System details (solar array, battery storage toggle)
  Step 2: Condition
  Step 3: Your details (what happens next, contact fields, privacy notice)
[Site footer]
```

---

## Page Header

- Eyebrow: `WeBuySolar` (set in capitals by the eyebrow style).
- H1: "Request a *valuation* of your solar system", with "valuation" in `text-pe-secondary-ink`.
- Intro: *"Tell us about your system in three short steps. Our WeBuySolar team prepares your valuation after a free on-site audit, so you won’t see a figure on this page."*
- Eligibility line: `WEBUYSOLAR_OFFER.eligibility`, *"We acquire systems built on BloombergNEF Tier 1 equipment, with or without battery storage."*
- The header column is centred at `max-width: 600px`; the eligibility line is capped at 52ch.
- Under it, a "How WeBuySolar works" link to `/solutions/webuysolar` (`SOLUTION_META.webuysolar.slug`), where the full six-step process and the FAQ live (added September 2026, audit VRT-04). Inter 600, 14px, Deep Teal, with an arrow that nudges right on hover, underlined on hover, as the site's other standalone arrow links; `padding: 4px 0` gives a 28px target.

---

## Step Indicator

Three numbered steps in an ordered list labelled "Progress":
```
[1 System details] · [2 Condition] · [3 Your details]
```
- Active: Deep Teal (`pe-primary`) filled circle, white numeral, `aria-current="step"`, label at weight 500.
- Done: `pe-bg` circle; screen readers hear "(done)" after the label.
- Upcoming: white circle with a `pe-border` outline, muted label.
- The connecting lines are decorative (`aria-hidden`).

A visually hidden H2 ("Step 2 of 3: Condition") takes focus whenever the visitor changes step, so keyboard and screen reader users know where they are.

---

## Step 1: System Details

### Solar array section

| Field | Control | Default | Hint |
|---|---|---|---|
| Installed solar capacity | Number field (kWp, 1 decimal) | 250 | "Total installed panel capacity, up to 10,000 kWp (10 MW)." |
| Year of installation | Range slider, 2010 to the current year | 2021 | "Age determines panel degradation and remaining useful life." |
| Panel brand | Select: 13 brands in alphabetical order, plus Other (free text) | JA Solar | None |
| Inverter type | Segmented control: Grid-tied / string, Hybrid | Grid-tied / string | "Hybrid inverters command a premium as they support battery storage." |
| Inverter capacity | Number field (kW, 1 decimal) | 250 | "Combined rating of your inverter(s)." |
| Inverter brand | Select: 21 inverter and battery brands, plus Other | Sunsynk | None |

---

### Battery storage section (toggle)

A switch labelled *"Does your system include battery storage?"*, with the sub-label *"Include batteries so our team can value them with the rest of your system."* Default: off.

When it is on, four fields appear:

| Field | Control | Default | Hint |
|---|---|---|---|
| Battery capacity | Number field (kWh, 2 decimals) | 250 | "Total usable capacity, up to 20,000 kWh (20 MWh)." |
| Battery brand | Select: the same brand list, plus Other | Pylontech | None |
| Battery chemistry | Segmented control: LFP / LiFePO₄, Li-NMC, Lead-acid | LFP | "LFP retains value significantly better, with a cycle life of 3,000+ against 300 to 500 for lead-acid." |
| Estimated battery health (SoH) | Segmented control: 90% or more (like new), 70 to 90% (good), Below 70% (degraded) | 90% or more | "SoH is State of Health. Most LFP systems remain above 80% SoH for 8 to 10 years." |

### Validation

The size fields are checked when the visitor presses **Next: System condition**, then again as they type. The first field with a problem takes focus.

- Each message names the actual problem (`src/lib/valuation/sizeFields.ts`, updated September 2026, VAL-27); the examples follow the field:
  - Empty, zero or negative: *"Enter a number above 0, for example 250 or 82.8."*
  - Too many decimal places (kWp and kW take one, kWh two): *"Use up to one decimal place, for example 82.8."*
  - A unit typed after the number, such as "250 kWp": *"Enter the number only, without the unit, for example 250."*
  - Not a number at all: *"Enter a number, for example 250 or 82.8."*
- Above the limit (10,000 kWp, 10,000 kW or 20,000 kWh): *"That's above 10 000 kWp. For larger portfolios, contact us directly."* The figure is formatted with `toLocaleString('en-ZA')`, which groups thousands with a space, while the hints use a comma.

The brand lists are not limited to Tier 1 brands. Whether they should be is a business decision (see Open Items).

---

## Step 2: Condition

| Field | Options | Default | Hint |
|---|---|---|---|
| Overall system condition | Excellent / Good / Fair / Poor | Excellent | Excellent: no faults, recently serviced · Poor: inverter faults or physical damage |
| Monitoring system | Yes, remote monitoring / No monitoring | Yes | Verified production data substantially increases buyer confidence. |
| Documentation & compliance | Full pack / COC only / None / not sure | Full pack | Full pack = Certificate of Compliance (COC), single-line diagrams (SLDs) and the system handover documents. Complete paperwork de-risks resale and improves value. |
| Province / region | All nine provinces, alphabetical | Gauteng | Used to reflect regional solar performance. |

Buttons: **Back** and **Next: your contact details**.

The April fields for panel warranty and reason for selling, and the "How we value your system" callout, were removed with the calculator.

---

## Step 3: Your Details

- Heading: "Your contact details", then *"There’s no cost, and no obligation to sell."*
- **What happens next** (`NextSteps`, an ordered list), worded from `WEBUYSOLAR_OFFER`:
  1. *"A WeBuySolar specialist reviews your details and contacts you within 1 business day to book your free audit."*
  2. **Free expert audit.** *"On-site inspection: drone scan, string-level review, inverter config audit, opportunity mapping. Written report within 10 business days."*
  3. **Preliminary offer & valuation.** *"Fair market valuation, indicative PPA or lease, and a forecasted savings model with an optimisation roadmap."*
- Fields: First name (required, at least 2 letters) · Last name (optional) · Email address (required) · Phone number (optional).
- Button: **Request my valuation** ("Sending…" while the request is on its way).
- Privacy: `FormPrivacyNotice form="valuation"` under the form: *"Phoenix Energy Solutions (Pty) Ltd uses these details only to reply to your valuation request. Our Privacy Policy explains how we handle personal information and your rights."*, followed by Google's reCAPTCHA disclosure (the badge is hidden site-wide). The wording lives in `src/config/privacyNotice.ts` and is pending legal review (`docs/legal/privacy-review-draft.md`).

**Validation:** errors show under each field, and the first one takes focus: *"Enter your first name (at least 2 letters)."* and *"Enter an email address like name@company.co.za."*

**If sending fails:** `SendFailureNotice` says why (the spam check couldn't run, the spam check failed, or the message didn't send), keeps the details in the form, and gives the email address and phone number.

---

## After Sending

The card is replaced by a confirmation. Its heading, *"Thank you. We’ve got your request."*, takes focus, and the same What happens next list follows. Nothing is calculated or shown: the team works from the email described under Lead Capture API.

---

## How the Valuation Is Prepared

The site holds no valuation model. The WeBuySolar team values the system after the free on-site audit and presents the valuation with the preliminary offer. The process, as `WEBUYSOLAR_OFFER.steps` states it and the WeBuySolar page's How It Works shows it:

1. Free expert audit (free, no obligation).
2. Preliminary offer & valuation (indicative).
3. Due diligence (at Phoenix's cost).
4. Final offer & contracting (either side can step back, no obligation).
5. Acquisition & handover (settlement on the date agreed in the sale agreement).
6. Ongoing optimisation (each upgrade justified by its own return).

An indicative valuation range may be added to the tool later (a decision from the September 2026 UX audit). It would need its own spec, a source for every assumption, and entries in the claims register (`docs/content/claims-register.md`).

---

## Component File Structure

```
src/
├── app/
│   └── tools/
│       └── solar-valuation/
│           └── page.tsx                    ← Page, metadata, HowTo JSON-LD
├── components/
│   ├── tools/
│   │   ├── SolarValuationTool.tsx          ← Step state, focus, analytics, reCAPTCHA script
│   │   ├── StepIndicator.tsx
│   │   ├── Step1SystemDetails.tsx
│   │   ├── Step2Condition.tsx
│   │   ├── Step3Capture.tsx                ← Contact fields, send, confirmation
│   │   └── NumberField.tsx, RangeSlider.tsx, SegmentedControl.tsx, SelectControl.tsx, Toggle.tsx
│   └── ui/
│       └── NextSteps.tsx, FormPrivacyNotice.tsx, SendFailureNotice.tsx, RecaptchaScript.tsx
├── config/
│   └── webuysolarOffer.ts                  ← Eligibility, first contact, process steps
├── lib/
│   ├── valuation/
│   │   ├── types.ts                        ← The answers collected
│   │   ├── labels.ts                       ← One wording per answer, for the form and the email
│   │   └── provinces.ts
│   └── validators/
│       └── contact.ts                      ← webBuySolarSchema
└── emails/
    └── WeBuySolarEmail.tsx                 ← The team's lead email
```

---

## TypeScript Interfaces

```typescript
// src/lib/valuation/types.ts

export interface SolarInputs {
  kw: number;
  installYear: number;
  inverterType: 'string' | 'hybrid';
  /** Combined inverter rating (kW). */
  inverterKw: number;
  panelBrand: string;
  inverterBrand: string;
}

export interface BessInputs {
  enabled: boolean;
  kWh: number;
  chemistry: 'lfp' | 'nmc' | 'lead';
  soh: 'high' | 'mid' | 'low';
  brand: string;
}

export type Province = 'ec' | 'fs' | 'gp' | 'kzn' | 'lp' | 'mp' | 'nw' | 'nc' | 'wc';

export interface ConditionInputs {
  condition: 'exc' | 'good' | 'fair' | 'poor';
  monitoring: boolean;
  /** Documentation held: full handover pack (COC + SLDs + docs), COC only, or none. */
  docs: 'full' | 'coc' | 'none';
  province: Province;
}
```

---

## Lead Capture API

```typescript
// POST /api/contact, the same route as the contact form.
// Validated by webBuySolarSchema (src/lib/validators/contact.ts).

interface WeBuySolarLead {
  intent: 'webuysolar';
  firstName: string;            // at least 2 characters
  lastName?: string;
  email: string;
  phone?: string;
  valuation: {                  // the owner's answers, as the labels they chose
    kw: number;
    bessKwh: number;            // 0 without battery storage
    installYear: number;
    inverterType?: string;
    inverterKw?: number;
    panelBrand?: string;
    inverterBrand?: string;
    batteryBrand?: string;
    batteryChemistry?: string;
    batteryHealth?: string;
    condition?: string;
    monitoring?: string;
    documentation?: string;
    province: string;
  };
  recaptchaToken?: string;      // reCAPTCHA v3, action 'valuation_submit'
}

// Email to info@phoenixenergy.solutions, reply-to the owner.
// Subject: [WeBuySolar] {kw} kWp system: {firstName} {lastName}
// Template: WeBuySolarEmail ("New valuation request"), with contact, system and condition sections.
```

**Spam check:** a missing or invalid reCAPTCHA token is refused, and the form then offers email and phone. A low score (below 0.5) is accepted, and the subject starts with "[Check: low reCAPTCHA score]".

**Analytics:** `valuation_complete` fires once, when the visitor reaches step 3 (`kw`, `bess_kwh`, `install_year`). `valuation_lead` fires after a successful send (`kw`, `has_battery`). The names predate the relabel (see Open Items).

---

## SEO & Metadata

```typescript
export const metadata: Metadata = {
  title: 'Solar System Valuation Request',   // the root layout adds " | Phoenix Energy"
  description:
    'Request a valuation of your solar system and battery storage. Our WeBuySolar team prepares it after a free on-site audit, with no obligation.',
  openGraph: { images: [{ url: '/og-default.png', width: 1200, height: 630 }] },
  alternates: { canonical: 'https://phoenixenergy.solutions/tools/solar-valuation' },
};
```

**Structured data (HowTo schema):**
```typescript
{
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to request a solar system valuation in South Africa',
  step: [
    { '@type': 'HowToStep', name: 'Enter system details', text: 'Input your installed kWp, year of installation, brands and inverter type.' },
    { '@type': 'HowToStep', name: 'Describe system condition', text: 'Rate condition, monitoring, documentation and province.' },
    { '@type': 'HowToStep', name: 'Submit your details', text: `Share your contact details. ${WEBUYSOLAR_OFFER.firstContact}` },
  ],
}
```

---

## Market Rates

None. The April 2026 calculator's constants (tariffs, regional yields, replacement rates, discount rate and method weights) are not in the code, and the site states none of them.

---

## Open Items

| # | Item | Owner |
|---|---|---|
| 1 | Confirm the WeBuySolar timings (first contact, audit report, settlement), the Tier 1 eligibility rule, and whether the brand lists should offer only Tier 1 brands (claims register, step 8a confirmations) | Phoenix Energy |
| 2 | Rename `valuation_complete`, which fires before any valuation exists, and remove the unused `paywall_unlock` event type, together with the GTM container | Dev + marketing |
| 3 | Legal sign-off of the form privacy notice, and of the privacy policy's section 2 and 3 wording for the request (`docs/legal/privacy-review-draft.md`, gaps 2.6 and 2.7) | Legal |
| 4 | An indicative valuation range, if it is added later, with a source for every assumption | Phoenix Energy |
| 5 | A link from the tool to `/solutions/webuysolar`, where the full process and FAQ live (polish backlog, VRT-04) | Dev |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.2 | Approved April 2026, updated 2026-09-24*

---

## Accessibility

- Controls are native: the segmented controls are radio groups (`.choice-segment`), the battery toggle is a `role="switch"` button, and the year is a range input.
- Focus moves with the visitor: to the hidden step heading on every step change, to the first invalid field on a failed check, and to the confirmation heading after sending.
- Errors are tied to their fields with `aria-invalid` and `aria-describedby`, and a status line announces "Sending your request".
- The April rule for a blurred results layer (`aria-hidden` until the visitor gave their details) no longer applies: there is no results layer.

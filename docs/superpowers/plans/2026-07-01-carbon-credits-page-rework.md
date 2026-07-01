# Carbon Credits Page Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework `/solutions/carbon-credits` with a PV-size → carbon-revenue estimator and an education-led section flow (concept → opportunity → why Phoenix → process → mechanics → FAQ).

**Architecture:** The page stays a Server Component composed from existing reusable sections. The only new code is a pure, unit-tested estimator calc module plus a client component that replaces `CarbonCalculator`. All in-code page copy moves to a single typed content config, mirroring `src/config/webuysolarContent.ts`.

**Tech Stack:** Next.js App Router · TypeScript strict · Tailwind (arbitrary hex tokens) · Framer Motion (via `AnimatedSection`) · Vitest for the calc module.

## Global Constraints

- TypeScript strict — no `any`; **named exports only** (no default exports).
- Vertical accent colour is **Sage Green `#9CAF88`** (`SOLUTION_META['carbon-credits'].accent`). Do not invent other brand values.
- Estimator revenue renders as a **low–high range**, never a single figure.
- Estimator constants (verbatim): yield **1,600 kWh/kWp/yr**; grid factor **0.95 tCO₂/MWh**; credit price band **R50 low – R150 high**; **1 credit = 1 tonne**; ≈ **1.52 credits/kWp/yr** (1 MWp ⇒ 1,520 credits ⇒ R76,000–R228,000/yr).
- Estimator footnote must state figures are indicative only and vary with project performance and market pricing.
- Curly apostrophes (U+2019) in `.ts`/`.tsx` string literals; `&apos;`/`&rsquo;` in JSX **text** nodes (react/no-unescaped-entities). Copy strings living in a `.ts` config are string literals → use real `'` characters there.
- When writing files via PowerShell, use `UTF8Encoding($false)` (no BOM). Prefer the Write/Edit tools.
- Verification per task: `npx tsc --noEmit`, `npx eslint <changed files>`, and where noted `npm run build` (confirm `○ /solutions/carbon-credits` stays static).

---

## File Structure

- `src/lib/carbon/estimate.ts` — pure calc: constants + `estimateCarbon(sizeKwp)`. One responsibility: the math.
- `src/lib/carbon/estimate.test.ts` — Vitest unit tests for the calc.
- `src/components/sections/calculators/CarbonRevenueEstimator.tsx` — client hero widget (slider → tiles). Replaces `CarbonCalculator.tsx`.
- `src/config/carbonCreditsContent.ts` — typed `CARBON_CREDITS` copy object for sections 2, 3, 4, 6, 7, 9 + hero.
- `src/lib/analytics.ts` — add one `DlEvent` variant.
- `src/app/solutions/carbon-credits/page.tsx` — recompose sections.
- `src/components/sections/calculators/CarbonCalculator.tsx` — **deleted** (only consumer is this page).

---

### Task 1: Carbon estimate calc module

**Files:**
- Create: `src/lib/carbon/estimate.ts`
- Test: `src/lib/carbon/estimate.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `estimateCarbon(sizeKwp: number): CarbonEstimate` and the exported constants below. `CarbonEstimate = { sizeKwp: number; tonnesPerYear: number; creditsPerYear: number; revenueLow: number; revenueHigh: number }`. `tonnesPerYear === creditsPerYear` (1:1). Later tasks import `estimateCarbon` from `@/lib/carbon/estimate`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/carbon/estimate.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { estimateCarbon } from './estimate';

describe('estimateCarbon', () => {
  it('1 MWp (1000 kWp) → ~1,520 credits and R76k–R228k', () => {
    const e = estimateCarbon(1000);
    expect(e.tonnesPerYear).toBe(1520);
    expect(e.creditsPerYear).toBe(1520);
    expect(e.revenueLow).toBe(76000);
    expect(e.revenueHigh).toBe(228000);
  });

  it('100 kWp scales linearly', () => {
    const e = estimateCarbon(100);
    expect(e.creditsPerYear).toBe(152);
    expect(e.revenueLow).toBe(7600);
    expect(e.revenueHigh).toBe(22800);
  });

  it('10 MWp scales linearly', () => {
    const e = estimateCarbon(10000);
    expect(e.creditsPerYear).toBe(15200);
    expect(e.revenueLow).toBe(760000);
    expect(e.revenueHigh).toBe(2280000);
  });

  it('tonnes equals credits (1 credit = 1 tonne)', () => {
    const e = estimateCarbon(2500);
    expect(e.tonnesPerYear).toBe(e.creditsPerYear);
  });

  it('zero size → all zero', () => {
    const e = estimateCarbon(0);
    expect(e.creditsPerYear).toBe(0);
    expect(e.revenueLow).toBe(0);
    expect(e.revenueHigh).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/carbon/estimate.test.ts`
Expected: FAIL — cannot resolve `./estimate` / `estimateCarbon is not a function`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/carbon/estimate.ts`:

```typescript
// Pure carbon-credit estimator for the Carbon Credits page.
// 1 credit = 1 tonne CO₂ avoided.

/** Specific yield assumption for SA C&I solar, kWh per kWp per year. */
export const CARBON_YIELD_KWH_PER_KWP = 1600;
/** Grid emission factor displaced by solar generation, tCO₂ per MWh. */
export const GRID_FACTOR_T_PER_MWH = 0.95;
/** Credit price band, ZAR per credit. */
export const CREDIT_PRICE_LOW = 50;
export const CREDIT_PRICE_HIGH = 150;

export interface CarbonEstimate {
  sizeKwp: number;
  /** Avoided CO₂ per year in tonnes; equals creditsPerYear (1:1). */
  tonnesPerYear: number;
  creditsPerYear: number;
  /** Estimated annual revenue in ZAR at the low price. */
  revenueLow: number;
  /** Estimated annual revenue in ZAR at the high price. */
  revenueHigh: number;
}

export function estimateCarbon(sizeKwp: number): CarbonEstimate {
  const credits = Math.round(
    (sizeKwp * CARBON_YIELD_KWH_PER_KWP * GRID_FACTOR_T_PER_MWH) / 1000,
  );
  return {
    sizeKwp,
    tonnesPerYear: credits,
    creditsPerYear: credits,
    revenueLow: credits * CREDIT_PRICE_LOW,
    revenueHigh: credits * CREDIT_PRICE_HIGH,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/carbon/estimate.test.ts`
Expected: PASS — 5/5.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/carbon/estimate.ts src/lib/carbon/estimate.test.ts
git commit -m "feat(carbon): pure carbon-credit revenue estimator with tests"
```

---

### Task 2: CarbonRevenueEstimator client component (+ analytics event)

**Files:**
- Create: `src/components/sections/calculators/CarbonRevenueEstimator.tsx`
- Modify: `src/lib/analytics.ts` (add one `DlEvent` variant)

**Interfaces:**
- Consumes: `estimateCarbon` from `@/lib/carbon/estimate`; `dlPush` from `@/lib/analytics`.
- Produces: named export `CarbonRevenueEstimator` (no props) — rendered as `SolutionHero` children by Task 4.

- [ ] **Step 1: Add the analytics event variant**

In `src/lib/analytics.ts`, add this line to the `DlEvent` union (place it directly after the existing `wheeling_eligibility_complete` line):

```typescript
  | { event: 'carbon_estimate_used';          vertical: string; size_kwp: number }
```

- [ ] **Step 2: Create the component**

Create `src/components/sections/calculators/CarbonRevenueEstimator.tsx`:

```tsx
// src/components/sections/calculators/CarbonRevenueEstimator.tsx
'use client';

import { useState } from 'react';
import { dlPush } from '@/lib/analytics';
import { estimateCarbon } from '@/lib/carbon/estimate';

const ACCENT = '#9CAF88';
const ACCENT_TEXT = '#2a4a18';

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${Math.round(n / 1_000)}k`;
  return `R${n.toLocaleString()}`;
}

function formatSize(kwp: number): string {
  return kwp >= 1000 ? `${(kwp / 1000).toFixed(1)} MWp` : `${kwp} kWp`;
}

export function CarbonRevenueEstimator() {
  const [sizeKwp, setSizeKwp] = useState(1000);
  const [used, setUsed] = useState(false);

  const est = estimateCarbon(sizeKwp);

  function handleChange(v: number) {
    setSizeKwp(v);
    if (!used) {
      setUsed(true);
      dlPush({ event: 'carbon_estimate_used', vertical: 'carbon-credits', size_kwp: v });
    }
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your annual carbon revenue
      </p>

      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">System size</span>
        <span className="font-display font-extrabold text-sm text-white">{formatSize(sizeKwp)}</span>
      </div>

      <input
        type="range"
        min={100}
        max={10000}
        step={100}
        value={sizeKwp}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
        aria-label="System size in kWp"
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>tCO₂ avoided / year</p>
          <p className="font-display font-extrabold text-xl text-white">~{est.tonnesPerYear.toLocaleString()}</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Verified credits / year</p>
          <p className="font-display font-extrabold text-xl text-white">~{est.creditsPerYear.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
        <p className="font-body text-xs mb-1" style={{ color: `${ACCENT_TEXT}99` }}>Est. annual carbon revenue</p>
        <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
          {formatRand(est.revenueLow)} – {formatRand(est.revenueHigh)}
        </p>
      </div>

      <p className="font-body text-[10px] mt-3 text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Based on typical South African solar yields (~1,600 kWh/kWp) and the current grid emissions factor (~0.95 tCO₂/MWh). Revenue estimates are indicative only and will vary with project performance and market pricing.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (the new `dlPush` call typechecks against the union variant added in Step 1).

- [ ] **Step 4: Lint**

Run: `npx eslint src/components/sections/calculators/CarbonRevenueEstimator.tsx src/lib/analytics.ts`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/calculators/CarbonRevenueEstimator.tsx src/lib/analytics.ts
git commit -m "feat(carbon): PV-size revenue estimator hero widget + analytics event"
```

---

### Task 3: Carbon Credits content config

**Files:**
- Create: `src/config/carbonCreditsContent.ts`

**Interfaces:**
- Consumes: types `ExplainerCardItem` (`@/components/sections/ExplainerCards`), `TabItem` (`@/components/sections/SolutionTabs`), `FaqItem` (`@/components/sections/FaqAccordion`).
- Produces: named export `CARBON_CREDITS` with shape: `{ hero: { title: string; subtitle: string }; becomes: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] }; opportunity: { eyebrow: string; heading: string; cards: ExplainerCardItem[] }; whyPhoenix: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] }; tabs: TabItem[]; faq: { heading: string; items: FaqItem[] }; cta: { eyebrow: string; heading: string; body: string } }`. Task 4 imports `CARBON_CREDITS`.

- [ ] **Step 1: Create the config file**

Create `src/config/carbonCreditsContent.ts`:

```typescript
// src/config/carbonCreditsContent.ts
import type { ExplainerCardItem } from '@/components/sections/ExplainerCards';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { FaqItem } from '@/components/sections/FaqAccordion';

const TAB_ICON_BG = 'rgba(156,175,136,0.18)';
const TAB_IMAGE_BG_A = 'linear-gradient(135deg, rgba(156,175,136,0.18) 0%, rgba(57,87,92,0.18) 100%)';
const TAB_IMAGE_BG_B = 'linear-gradient(135deg, rgba(57,87,92,0.18) 0%, rgba(156,175,136,0.18) 100%)';

export const CARBON_CREDITS: {
  hero: { title: string; subtitle: string };
  becomes: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] };
  opportunity: { eyebrow: string; heading: string; cards: ExplainerCardItem[] };
  whyPhoenix: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] };
  tabs: TabItem[];
  faq: { heading: string; items: FaqItem[] };
  cta: { eyebrow: string; heading: string; body: string };
} = {
  hero: {
    title: 'Turn your existing solar system into <em>a new revenue stream</em>.',
    subtitle:
      'Your solar system already avoids carbon emissions every day. Phoenix certifies those reductions, converts them into verified carbon credits, and sells them on your behalf — creating additional revenue on top of the electricity savings you already enjoy.',
  },

  becomes: {
    eyebrow: 'The basics',
    heading: 'How does your solar system generate <em>carbon credits</em>?',
    subtitle:
      'Every unit of solar electricity your system produces avoids emissions that would otherwise have come from the national grid. Those avoided emissions can be independently verified, certified and sold as carbon credits — creating an entirely new revenue stream from the same solar asset.',
    cards: [
      { icon: 'Sun', title: 'Your solar already avoids emissions', body: 'Every megawatt-hour your system generates replaces electricity from the grid, preventing carbon emissions that would otherwise have been produced.' },
      { icon: 'ClipboardCheck', title: 'Those reductions are independently verified', body: 'Your generation data is measured, audited and verified against recognised carbon standards before credits are issued.' },
      { icon: 'DollarSign', title: 'Verified credits become revenue', body: 'Once issued, the credits are sold to qualified buyers. Phoenix manages the entire process and you receive the proceeds.' },
    ],
  },

  opportunity: {
    eyebrow: 'The opportunity',
    heading: 'Your solar system already saves money. <em>It could also be generating revenue.</em>',
    cards: [
      { icon: 'Zap', title: "You're already creating the asset", body: "If your solar system is generating electricity, it's already producing the emissions reductions required for carbon credits." },
      { icon: 'TrendingUp', title: 'Revenue that stacks on your savings', body: 'Carbon credit income is earned in addition to the electricity bill savings your system already delivers.' },
      { icon: 'Building', title: 'No changes to your system', body: 'No additional equipment, operational changes or disruption to your facility. Phoenix handles registration, verification and trading while your system continues operating as normal.' },
    ],
  },

  whyPhoenix: {
    eyebrow: 'Why work with us?',
    heading: 'We unlock the value. <em>You keep running your business.</em>',
    subtitle:
      'Generating carbon credits is far more than simply owning solar. It requires ongoing monitoring, independent verification, registry management and access to carbon markets. Phoenix manages the entire process on your behalf.',
    cards: [
      { icon: 'ClipboardCheck', title: 'Registration & Compliance', body: 'Project registration, eligibility assessment and documentation.' },
      { icon: 'Activity', title: 'Monitoring & Verification', body: 'Continuous monitoring, emissions calculations and third-party verification.' },
      { icon: 'TrendingUp', title: 'Trading & Payouts', body: 'We market your credits, manage buyer relationships and distribute proceeds with complete transparency.' },
    ],
  },

  tabs: [
    {
      label: 'Measurement & MRV',
      icon: 'Activity',
      iconBg: TAB_ICON_BG,
      title: 'Measurement, Reporting & Verification',
      body: 'Automatic collection of inverter data, emissions calculations and audit-ready reporting throughout the life of the project.',
      bullets: ['Automatic inverter data capture.', 'Baseline emission displacement calculation.', 'Audit-ready reports.', 'ESG dashboard for corporate reporting.'],
      imageBg: TAB_IMAGE_BG_A,
      imageEmoji: '📊',
    },
    {
      label: 'Verification & Standards',
      icon: 'ClipboardCheck',
      iconBg: TAB_ICON_BG,
      title: 'Independent verification against recognised standards',
      body: 'Independent third-party verification against recognised international carbon standards. Phoenix selects the most appropriate methodology for your project.',
      bullets: ['Independent third-party audit.', 'Recognised international standards.', 'Best-fit methodology per project.', 'Full documentation trail.'],
      imageBg: TAB_IMAGE_BG_B,
      imageEmoji: '🔍',
    },
    {
      label: 'Trading & Payouts',
      icon: 'DollarSign',
      iconBg: TAB_ICON_BG,
      title: 'Credit trading and transparent payouts',
      body: 'Verified credits are sold through trusted carbon markets and buyer networks. You receive scheduled payouts together with complete reporting and transaction transparency.',
      bullets: ['Access to vetted buyer networks.', 'Scheduled credit sales.', 'Transparent payouts.', 'Full transaction reporting.'],
      imageBg: TAB_IMAGE_BG_A,
      imageEmoji: '💰',
    },
  ],

  faq: {
    heading: 'Carbon credits, answered.',
    items: [
      { question: 'Is carbon credit trading legitimate?', answer: 'Yes. Carbon credits are a well-established, regulated global market. Credits are only issued after independent third-party verification against recognised standards, so every credit represents a genuine, audited tonne of avoided emissions.' },
      { question: 'Do I still own my solar system?', answer: 'Yes. You retain full ownership of your system and continue to operate it exactly as you do today. Phoenix only manages the certification and sale of the carbon reductions it produces.' },
      { question: 'Can I still claim my renewable energy benefits?', answer: "Your electricity bill savings are unaffected. We'll confirm how carbon credit registration interacts with any other environmental claims so there's no double-counting, and structure everything correctly from the start." },
      { question: 'What does the service cost?', answer: "There's no upfront cost to assess and register your system. Phoenix is paid from a share of the credit revenue generated, so our incentives are aligned with yours — we only earn when you do." },
      { question: 'Is there a minimum system size?', answer: "Larger systems generate more credits and are the most economical to register, but we assess each system individually. Book an assessment and we'll tell you whether yours qualifies." },
      { question: 'How long before I receive my first payment?', answer: 'Onboarding and registration typically take six to eight weeks, after which monitoring runs continuously and credits are issued and sold on a scheduled basis.' },
      { question: 'What happens if carbon prices change?', answer: 'Carbon prices move with the market, which is why we show revenue as a range rather than a fixed figure. Phoenix actively manages the timing and placement of sales to protect your returns.' },
      { question: 'Can newly installed solar systems be registered from day one?', answer: 'Yes. New systems can be enrolled at commissioning so they start generating carbon credits from their first day of operation.' },
    ],
  },

  cta: {
    eyebrow: 'Start earning',
    heading: 'Turn your solar system into an additional source of revenue',
    body: "We'll assess your existing solar system, estimate how many carbon credits it could generate and confirm whether it qualifies — all at no obligation.",
  },
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors — every `icon` value is a valid `ExplainerIcon`/`IconName`, and each object satisfies its declared type.

- [ ] **Step 3: Lint**

Run: `npx eslint src/config/carbonCreditsContent.ts`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/config/carbonCreditsContent.ts
git commit -m "feat(carbon): content config for reworked Carbon Credits page"
```

---

### Task 4: Recompose the page + retire CarbonCalculator

**Files:**
- Modify (full rewrite of the render tree): `src/app/solutions/carbon-credits/page.tsx`
- Delete: `src/components/sections/calculators/CarbonCalculator.tsx`

**Interfaces:**
- Consumes: `CarbonRevenueEstimator` (Task 2), `CARBON_CREDITS` (Task 3), and existing `SolutionHero`, `ExplainerCards`, `HowItWorks`, `SolutionTabs`, `FaqAccordion`, `FeaturedProjects`, `RelatedArticles`, `PageFooter`, `getHowItWorks`, `getHeroImages`, `VERTICAL_CONFIG`, `SOLUTION_META`.
- Produces: the rendered page. No new exports.

- [ ] **Step 1: Rewrite `src/app/solutions/carbon-credits/page.tsx`**

Replace the entire file contents with:

```tsx
// src/app/solutions/carbon-credits/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { ExplainerCards } from '@/components/sections/ExplainerCards';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { CarbonRevenueEstimator } from '@/components/sections/calculators/CarbonRevenueEstimator';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import { CARBON_CREDITS } from '@/config/carbonCreditsContent';

const vertical = 'carbon-credits' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}`, images: [{ url: 'https://phoenixenergy.solutions/og-solutions-carbon-credits.png', width: 1200, height: 630 }] },
};

export const revalidate = 3600;

export default async function CarbonCreditsPage() {
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

      {/* §1 — Hero + revenue estimator */}
      <SolutionHero
        title={CARBON_CREDITS.hero.title}
        subtitle={CARBON_CREDITS.hero.subtitle}
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #182a1a 50%, #2a4a28 100%)"
        primaryCta={{ label: 'Book a Carbon Assessment', href: '/contact' }}
      >
        <CarbonRevenueEstimator />
      </SolutionHero>

      {/* §2 — How carbon becomes revenue */}
      <ExplainerCards
        id="how-it-earns"
        background="white"
        eyebrow={CARBON_CREDITS.becomes.eyebrow}
        heading={CARBON_CREDITS.becomes.heading}
        subtitle={CARBON_CREDITS.becomes.subtitle}
        accent={meta.accent}
        columns={3}
        cards={CARBON_CREDITS.becomes.cards}
      />

      {/* §3 — Why your solar could be earning more */}
      <ExplainerCards
        id="opportunity"
        background="gray"
        eyebrow={CARBON_CREDITS.opportunity.eyebrow}
        heading={CARBON_CREDITS.opportunity.heading}
        accent={meta.accent}
        columns={3}
        cards={CARBON_CREDITS.opportunity.cards}
      />

      {/* §4 — Why Phoenix */}
      <ExplainerCards
        id="why-phoenix"
        background="white"
        eyebrow={CARBON_CREDITS.whyPhoenix.eyebrow}
        heading={CARBON_CREDITS.whyPhoenix.heading}
        subtitle={CARBON_CREDITS.whyPhoenix.subtitle}
        accent={meta.accent}
        columns={3}
        cards={CARBON_CREDITS.whyPhoenix.cards}
      />

      {/* §5 — From generation to payout (Sanity-driven) */}
      {howItWorks && <HowItWorks {...howItWorks} accent={meta.accent} accentText={meta.accentText} />}

      {/* §6 — Behind the scenes */}
      <SolutionTabs
        tabs={CARBON_CREDITS.tabs}
        accent={meta.accent}
        vertical="carbon-credits"
        eyebrow="Behind the scenes"
        heading="What it takes to turn generation into <em>verified credits</em>"
      />

      {/* §7 — FAQ */}
      <FaqAccordion
        id="faq"
        eyebrow="FAQ"
        heading={CARBON_CREDITS.faq.heading}
        items={CARBON_CREDITS.faq.items}
        accent={meta.accent}
      />

      {/* §8 — Proof + insights */}
      <FeaturedProjects vertical={vertical} />
      <RelatedArticles vertical={vertical} />

      {/* §9 — Final CTA */}
      <PageFooter
        ctaVariant="centered"
        eyebrow={CARBON_CREDITS.cta.eyebrow}
        heading={CARBON_CREDITS.cta.heading}
        body={CARBON_CREDITS.cta.body}
        primaryCta={{ label: 'Book a Carbon Assessment', href: '/contact' }}
      />
    </>
  );
}
```

- [ ] **Step 2: Delete the retired calculator**

```bash
git rm src/components/sections/calculators/CarbonCalculator.tsx
```

- [ ] **Step 3: Confirm nothing else imports CarbonCalculator**

Run: `git grep -n "CarbonCalculator"`
Expected: no matches (empty output). If any match remains, that file must switch to `CarbonRevenueEstimator` before continuing.

- [ ] **Step 4: Typecheck + lint**

Run: `npx tsc --noEmit`
Then: `npx eslint src/app/solutions/carbon-credits/page.tsx`
Expected: no errors. (`Card`, `CardBody`, `IconCheck` etc. are no longer imported — verify no unused-import lint errors remain.)

- [ ] **Step 5: Build and confirm the route stays static**

Run: `npm run build`
Expected: `✓ Compiled successfully`, and the route table shows `○ /solutions/carbon-credits` (static). No build errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/solutions/carbon-credits/page.tsx
git commit -m "feat(carbon): recompose Carbon Credits page — estimator + education flow, retire bill-slider tool"
```

---

## Post-implementation content task (NOT code — do not attempt in a coding task)

The **§5 "From generation to payout"** step copy lives in Sanity, not the repo.
After the branch merges, update the `howItWorks.carbon-credits` document in
Sanity Studio (`/studio`) to:

- Title: `From generation to payout` (eyebrow `How it works`)
- Steps (label · description · tag):
  1. Eligibility Assessment · `We assess your system and confirm whether it qualifies to generate credits.` · `Free · no obligation`
  2. Project Registration · `Phoenix registers your project and prepares all required documentation.` · `6–8 week onboarding`
  3. Monitoring & Data Collection · `Generation data is captured automatically and continuously from your inverters.` · `Continuous`
  4. Verification · `An independent third party verifies your avoided emissions against a recognised standard.` · `Independent audit`
  5. Credit Issuance · `Verified reductions are issued as tradable carbon credits.` · `1 credit = 1 tonne`
  6. Trading & Payout · `Phoenix sells your credits to qualified buyers and pays the proceeds to you.` · `Scheduled payouts`

Until this is done, the page renders whatever the current Sanity document holds
(it degrades gracefully to hidden if empty). This is expected and not a bug.

---

## Self-Review

**Spec coverage:** §1 hero+estimator → Tasks 2 & 4; §2/§3/§4 ExplainerCards → Tasks 3 & 4; §5 process → Task 4 wiring + post-impl CMS note; §6 tabs (Financing dropped) → Tasks 3 & 4; §7 FAQ → Tasks 3 & 4; §8 projects/articles → Task 4; §9 CTA → Task 4; estimator calc + constants → Task 1; analytics event → Task 2; content config → Task 3; delete CarbonCalculator → Task 4. All covered.

**Type consistency:** `estimateCarbon`/`CarbonEstimate` field names identical across Tasks 1, 2. `CARBON_CREDITS` shape declared in Task 3 matches every access in Task 4 (`.hero.title`, `.becomes.cards`, `.opportunity`, `.whyPhoenix`, `.tabs`, `.faq.items`, `.cta`). Icon strings restricted to valid `ExplainerIcon`/`IconName` members. `carbon_estimate_used` payload (`vertical`, `size_kwp`) matches the `dlPush` call in Task 2.

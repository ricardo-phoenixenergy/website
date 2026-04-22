# Phase 4-A: Solutions Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 6 independent solution pages with shared section components, per-vertical calculators, and full SEO metadata.

**Architecture:** Static routes under `src/app/solutions/[slug]/page.tsx`. Each page composes shared section components and injects a per-vertical calculator via `SolutionPain`'s children prop. Config in `src/config/verticals.ts` provides per-vertical stats and SEO strings; accent colours live in the existing `src/types/solutions.ts`.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS, Framer Motion (`AnimatedSection`), Sanity CMS (projects carousel via existing `PROJECTS_BY_VERTICAL_QUERY`).

---

## File Map

| Action | Path |
|---|---|
| Create | `src/config/verticals.ts` |
| Create | `src/components/sections/SolutionHero.tsx` |
| Create | `src/components/sections/SolutionSubNav.tsx` |
| Create | `src/components/sections/SolutionPain.tsx` |
| Create | `src/components/sections/calculators/SolarCalculator.tsx` |
| Create | `src/components/sections/calculators/WheelingCalculator.tsx` |
| Create | `src/components/sections/calculators/OptimisationCalculator.tsx` |
| Create | `src/components/sections/calculators/CarbonCalculator.tsx` |
| Create | `src/components/sections/calculators/WeBuySolarCalculator.tsx` |
| Create | `src/components/sections/calculators/EvFleetsCalculator.tsx` |
| Create | `src/components/sections/FinancingCards.tsx` |
| Create | `src/components/sections/SolutionTabs.tsx` |
| Create | `src/components/sections/Testimonials.tsx` |
| Modify | `src/components/sections/HowItWorks.tsx` |
| Modify | `src/components/sections/FeaturedProjects.tsx` |
| Delete | `src/app/solutions/[vertical]/loading.tsx` |
| Create | `src/app/solutions/ci-solar-storage/page.tsx` |
| Create | `src/app/solutions/wheeling/page.tsx` |
| Create | `src/app/solutions/energy-optimisation/page.tsx` |
| Create | `src/app/solutions/carbon-credits/page.tsx` |
| Create | `src/app/solutions/webuysolar/page.tsx` |
| Create | `src/app/solutions/ev-fleets/page.tsx` |

---

## Task 1: Per-vertical config

**Files:**
- Create: `src/config/verticals.ts`

- [ ] **Step 1: Create the config file**

```typescript
// src/config/verticals.ts
import type { SolutionVertical } from '@/types/solutions';

interface VerticalStat {
  value: string;
  label: string;
}

export interface VerticalConfig {
  seoTitle: string;
  seoDescription: string;
  stats: VerticalStat[];
}

export const VERTICAL_CONFIG: Record<SolutionVertical, VerticalConfig> = {
  'ci-solar-storage': {
    seoTitle: 'C&I Solar & Storage Solutions | Phoenix Energy',
    seoDescription:
      'Commercial and industrial solar and battery storage systems. Zero upfront with our PPA model. Cut your electricity bill by up to 60%.',
    stats: [
      { value: '250+', label: 'C&I Installations' },
      { value: '60%', label: 'Avg. Bill Reduction' },
      { value: 'R0', label: 'Upfront with PPA' },
      { value: '25yr', label: 'System Lifespan' },
    ],
  },
  wheeling: {
    seoTitle: 'Electricity Wheeling Solutions | Phoenix Energy',
    seoDescription:
      'Buy renewable energy directly from generators via the Eskom grid. Save up to 32% on electricity costs with Phoenix Energy wheeling agreements.',
    stats: [
      { value: '32%', label: 'Avg. Cost Saving' },
      { value: '3', label: 'Licensed Platforms' },
      { value: 'R0', label: 'Infrastructure Cost' },
      { value: 'T-day', label: 'Settlement' },
    ],
  },
  'energy-optimisation': {
    seoTitle: 'Energy Optimisation Services | Phoenix Energy',
    seoDescription:
      'Real-time monitoring, HVAC tuning, and load-shifting that cuts energy waste by up to 28% — zero capital outlay required.',
    stats: [
      { value: '28%', label: 'Avg. Waste Identified' },
      { value: '<12mo', label: 'Typical ROI' },
      { value: 'R0', label: 'Capital Outlay' },
      { value: '24/7', label: 'Live Monitoring' },
    ],
  },
  'carbon-credits': {
    seoTitle: 'Carbon Credit Solutions | Phoenix Energy',
    seoDescription:
      'Monetise your solar generation through Verra-certified carbon credits. Quarterly payouts, no admin burden, fully managed by Phoenix Energy.',
    stats: [
      { value: 'R8+', label: 'Per Carbon Credit' },
      { value: 'Verra', label: 'Certified Standard' },
      { value: 'Quarterly', label: 'Payouts' },
      { value: '90 days', label: 'To Registration' },
    ],
  },
  webuysolar: {
    seoTitle: 'We Buy Solar Systems | Phoenix Energy',
    seoDescription:
      'Sell your existing solar installation to Phoenix Energy. Fast valuation, cash within 14 days, any brand accepted. We handle the removal.',
    stats: [
      { value: '48hr', label: 'Free Valuation' },
      { value: '14 days', label: 'Cash Payment' },
      { value: 'Any Brand', label: 'Systems Accepted' },
      { value: 'Included', label: 'Removal & Transport' },
    ],
  },
  'ev-fleets': {
    seoTitle: 'EV Fleet & Infrastructure Solutions | Phoenix Energy',
    seoDescription:
      'Electrify your commercial fleet with SANS-certified chargers, a fleet management dashboard, and up to 60% savings on fuel costs.',
    stats: [
      { value: '60%+', label: 'Fuel Saving' },
      { value: 'SANS', label: 'Certified Chargers' },
      { value: 'Fleet', label: 'Dashboard Included' },
      { value: 'V2G', label: 'Ready' },
    ],
  },
};
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/config/verticals.ts
git commit -m "feat: add per-vertical SEO and stats config"
```

---

## Task 2: SolutionHero component

**Files:**
- Create: `src/components/sections/SolutionHero.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/sections/SolutionHero.tsx
import { Button } from '@/components/ui/Button';

interface CtaLink {
  label: string;
  href: string;
}

export interface SolutionHeroProps {
  title: string;       // HTML string — <em> tags render at opacity 0.45
  subtitle: string;
  accent: string;      // hex, used for badge border
  badge: string;       // e.g. 'C&I Solar & Storage'
  heroBg: string;      // CSS gradient placeholder until real photo supplied
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

function renderTitle(raw: string) {
  const parts = raw.split(/(<em>.*?<\/em>)/g);
  return parts.map((part, i) => {
    const match = part.match(/^<em>(.*)<\/em>$/);
    if (match) {
      return (
        <em key={i} style={{ opacity: 0.45, fontStyle: 'normal' }}>
          {match[1]}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function SolutionHero({
  title,
  subtitle,
  accent,
  badge,
  heroBg,
  primaryCta,
  secondaryCta,
}: SolutionHeroProps) {
  return (
    <section
      className="relative flex items-end"
      style={{
        minHeight: 'clamp(260px, 36vw, 340px)',
        background: heroBg,
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(13,31,34,0.15) 0%, rgba(13,31,34,0.92) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[960px] mx-auto px-5 pb-10 pt-16 w-full">
        {/* Vertical badge */}
        <span
          className="inline-block font-body text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={{
            border: `1px solid ${accent}`,
            color: accent,
            background: `${accent}1a`,
          }}
        >
          {badge}
        </span>

        {/* Headline */}
        <h1 className="font-display font-extrabold text-[1.625rem] md:text-[2rem] text-white leading-[1.2] mb-3 max-w-[640px]">
          {renderTitle(title)}
        </h1>

        {/* Subtitle */}
        <p
          className="font-body text-sm md:text-base leading-[1.75] mb-7 max-w-[520px]"
          style={{ color: 'rgba(255,255,255,0.70)' }}
        >
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Button variant="light" href={primaryCta.href}>
            {primaryCta.label}
          </Button>
          <Button variant="ghost" href={secondaryCta.href}>
            {secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/SolutionHero.tsx
git commit -m "feat: add SolutionHero section component"
```

---

## Task 3: SolutionSubNav component

**Files:**
- Create: `src/components/sections/SolutionSubNav.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/sections/SolutionSubNav.tsx
'use client';

import { useState, useEffect } from 'react';

interface NavLink {
  label: string;
  href: string;  // anchor, e.g. '#pain'
}

export interface SolutionSubNavProps {
  links: NavLink[];
}

export function SolutionSubNav({ links }: SolutionSubNavProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 220);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-0 right-0 z-30 bg-white border-b border-[#E5E7EB]"
      style={{
        top: 64,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'opacity 250ms ease-out, transform 250ms ease-out',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="max-w-[960px] mx-auto px-5 flex gap-6 overflow-x-auto py-3"
        style={{ scrollbarWidth: 'none', whiteSpace: 'nowrap' }}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className="font-body text-sm font-medium text-[#39575C] hover:text-[#2a4045] transition-colors flex-shrink-0"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/SolutionSubNav.tsx
git commit -m "feat: add SolutionSubNav sticky anchor nav"
```

---

## Task 4: SolutionPain component

**Files:**
- Create: `src/components/sections/SolutionPain.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/sections/SolutionPain.tsx
import type { ReactNode } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export interface SolutionPainProps {
  id?: string;
  eyebrow: string;
  headline: string;   // HTML with <em> tags → rendered in accent colour
  body: string;
  pills: string[];
  accent?: string;    // for em colour; defaults to #709DA9
  children: ReactNode;
}

function renderHeadline(raw: string, accent: string) {
  const parts = raw.split(/(<em>.*?<\/em>)/g);
  return parts.map((part, i) => {
    const match = part.match(/^<em>(.*)<\/em>$/);
    if (match) {
      return (
        <em key={i} style={{ color: accent, fontStyle: 'normal' }}>
          {match[1]}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function SolutionPain({
  id,
  eyebrow,
  headline,
  body,
  pills,
  accent = '#709DA9',
  children,
}: SolutionPainProps) {
  return (
    <section
      id={id}
      className="px-5"
      style={{ background: '#0d1f22', padding: '52px 20px' }}
    >
      <div className="max-w-[960px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left: copy */}
        <AnimatedSection>
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {eyebrow}
          </p>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white leading-[1.2] mb-4">
            {renderHeadline(headline, accent)}
          </h2>
          <p className="font-body text-sm md:text-base leading-[1.75] mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {body}
          </p>
          {/* Pills — hidden on mobile */}
          {pills.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-2">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="font-body text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.70)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          )}
        </AnimatedSection>

        {/* Right: calculator slot */}
        <AnimatedSection delay={0.1}>
          {children}
        </AnimatedSection>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/SolutionPain.tsx
git commit -m "feat: add SolutionPain dark layout with calculator slot"
```

---

## Task 5: SolarCalculator

**Files:**
- Create: `src/components/sections/calculators/SolarCalculator.tsx`

- [ ] **Step 1: Create the calculator**

```typescript
// src/components/sections/calculators/SolarCalculator.tsx
'use client';

import { useState } from 'react';

const ACCENT = '#E3C58D';
const ACCENT_TEXT = '#6b4e10';
const ESCALATION = [1, 1.15, 1.3225, 1.5209, 1.749]; // 15%/yr compounded

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${(n / 1_000).toFixed(0)}k`;
  return `R${n.toLocaleString()}`;
}

export function SolarCalculator() {
  const [bill, setBill] = useState(30000);

  const fiveYrEskomCost = bill * 12 * ESCALATION.reduce((a, b) => a + b, 0);
  const fiveYrSaving = Math.round(fiveYrEskomCost * 0.48);
  const monthlySaving = Math.round(bill * 0.48);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your saving
      </p>

      {/* Slider label */}
      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Monthly electricity bill</span>
        <span className="font-display font-extrabold text-sm text-white">{formatRand(bill)}</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={5000}
        max={500000}
        step={5000}
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
        aria-label="Monthly electricity bill"
      />

      {/* Results */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Est. monthly saving</p>
          <p className="font-display font-extrabold text-xl text-white">{formatRand(monthlySaving)}</p>
        </div>
        {/* Highlighted */}
        <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
          <p className="font-body text-xs mb-1" style={{ color: `${ACCENT_TEXT}99` }}>5-yr potential saving</p>
          <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
            {formatRand(fiveYrSaving)}
          </p>
        </div>
      </div>

      <p className="font-body text-[10px] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Estimates based on 15% annual Eskom escalation. Indicative only.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/calculators/SolarCalculator.tsx
git commit -m "feat: add SolarCalculator component"
```

---

## Task 6: WheelingCalculator

**Files:**
- Create: `src/components/sections/calculators/WheelingCalculator.tsx`

- [ ] **Step 1: Create the calculator**

```typescript
// src/components/sections/calculators/WheelingCalculator.tsx
'use client';

import { useState } from 'react';

const ACCENT = '#D97C76';
const ACCENT_TEXT = '#ffffff';

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${(n / 1_000).toFixed(0)}k`;
  return `R${n.toLocaleString()}`;
}

export function WheelingCalculator() {
  const [bill, setBill] = useState(80000);

  const annualSaving = Math.round(bill * 12 * 0.32);
  const monthlySaving = Math.round(bill * 0.32);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your saving
      </p>

      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Monthly electricity bill</span>
        <span className="font-display font-extrabold text-sm text-white">{formatRand(bill)}</span>
      </div>

      <input
        type="range"
        min={10000}
        max={1000000}
        step={10000}
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
        aria-label="Monthly electricity bill"
      />

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Est. monthly saving</p>
          <p className="font-display font-extrabold text-xl text-white">{formatRand(monthlySaving)}</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.70)' }}>Annual wheeling saving</p>
          <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
            {formatRand(annualSaving)}
          </p>
        </div>
      </div>

      <p className="font-body text-[10px] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Based on average 32% tariff discount. Indicative only.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/calculators/WheelingCalculator.tsx
git commit -m "feat: add WheelingCalculator component"
```

---

## Task 7: OptimisationCalculator

**Files:**
- Create: `src/components/sections/calculators/OptimisationCalculator.tsx`

- [ ] **Step 1: Create the calculator**

```typescript
// src/components/sections/calculators/OptimisationCalculator.tsx
'use client';

import { useState } from 'react';

const ACCENT = '#709DA9';
const ACCENT_TEXT = '#ffffff';
const ESCALATION = [1, 1.15, 1.3225, 1.5209, 1.749];

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${(n / 1_000).toFixed(0)}k`;
  return `R${n.toLocaleString()}`;
}

export function OptimisationCalculator() {
  const [bill, setBill] = useState(50000);

  const monthlyWaste = Math.round(bill * 0.28);
  const fiveYrWaste = Math.round(bill * 12 * ESCALATION.reduce((a, b) => a + b, 0) * 0.28);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Find your waste
      </p>

      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Monthly electricity bill</span>
        <span className="font-display font-extrabold text-sm text-white">{formatRand(bill)}</span>
      </div>

      <input
        type="range"
        min={5000}
        max={500000}
        step={5000}
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
        aria-label="Monthly electricity bill"
      />

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>5-yr recoverable waste</p>
          <p className="font-display font-extrabold text-xl text-white">{formatRand(fiveYrWaste)}</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.70)' }}>Est. monthly energy waste</p>
          <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
            {formatRand(monthlyWaste)}
          </p>
        </div>
      </div>

      <p className="font-body text-[10px] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Based on 28% avg. waste identified across audited facilities. Indicative only.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/calculators/OptimisationCalculator.tsx
git commit -m "feat: add OptimisationCalculator component"
```

---

## Task 8: CarbonCalculator

**Files:**
- Create: `src/components/sections/calculators/CarbonCalculator.tsx`

- [ ] **Step 1: Create the calculator**

```typescript
// src/components/sections/calculators/CarbonCalculator.tsx
'use client';

import { useState } from 'react';

const ACCENT = '#9CAF88';
const ACCENT_TEXT = '#2a4a18';

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${(n / 1_000).toFixed(0)}k`;
  return `R${n.toLocaleString()}`;
}

export function CarbonCalculator() {
  const [bill, setBill] = useState(30000);

  // Formula from spec: (bill/3500) × 1680 × 0.5 × 90/1000 × 8
  const annualRevenue = Math.round((bill / 3500) * 1680 * 0.5 * (90 / 1000) * 8);
  const monthlyRevenue = Math.round(annualRevenue / 12);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your credit revenue
      </p>

      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Monthly electricity bill</span>
        <span className="font-display font-extrabold text-sm text-white">{formatRand(bill)}</span>
      </div>

      <input
        type="range"
        min={5000}
        max={500000}
        step={5000}
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
        aria-label="Monthly electricity bill"
      />

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Est. monthly revenue</p>
          <p className="font-display font-extrabold text-xl text-white">{formatRand(monthlyRevenue)}</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
          <p className="font-body text-xs mb-1" style={{ color: `${ACCENT_TEXT}99` }}>Est. annual credit revenue</p>
          <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
            {formatRand(annualRevenue)}
          </p>
        </div>
      </div>

      <p className="font-body text-[10px] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Based on Verra VCS methodology at R8/credit. Indicative only.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/calculators/CarbonCalculator.tsx
git commit -m "feat: add CarbonCalculator component"
```

---

## Task 9: WeBuySolarCalculator

**Files:**
- Create: `src/components/sections/calculators/WeBuySolarCalculator.tsx`

- [ ] **Step 1: Create the calculator**

```typescript
// src/components/sections/calculators/WeBuySolarCalculator.tsx
'use client';

import { useState } from 'react';

const ACCENT = '#C97A40';
const ACCENT_TEXT = '#ffffff';

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${(n / 1_000).toFixed(0)}k`;
  return `R${n.toLocaleString()}`;
}

export function WeBuySolarCalculator() {
  const [bill, setBill] = useState(20000);

  // Est. system size in kWp; indicative buyback
  const systemKwp = Math.round((bill / 3500) * 10) / 10;
  // Formula from spec: (bill/3500) × 1680 × 20000 × 0.4 / 12
  const buybackValue = Math.round((bill / 3500) * 1680 * 20000 * 0.4 / 12);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your buyback value
      </p>

      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Pre-solar monthly bill</span>
        <span className="font-display font-extrabold text-sm text-white">{formatRand(bill)}</span>
      </div>

      <input
        type="range"
        min={5000}
        max={200000}
        step={5000}
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
        aria-label="Pre-solar monthly electricity bill"
      />

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Est. system size</p>
          <p className="font-display font-extrabold text-xl text-white">{systemKwp} kWp</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.70)' }}>Indicative buyback value</p>
          <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
            {formatRand(buybackValue)}
          </p>
        </div>
      </div>

      <p className="font-body text-[10px] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Subject to physical inspection and system condition. Indicative only.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/calculators/WeBuySolarCalculator.tsx
git commit -m "feat: add WeBuySolarCalculator component"
```

---

## Task 10: EvFleetsCalculator

**Files:**
- Create: `src/components/sections/calculators/EvFleetsCalculator.tsx`

- [ ] **Step 1: Create the calculator**

```typescript
// src/components/sections/calculators/EvFleetsCalculator.tsx
'use client';

import { useState } from 'react';

const ACCENT = '#A9D6CB';
const ACCENT_TEXT = '#1a5a48';
const DIESEL_ESCALATION = [1, 1.12, 1.2544, 1.4049, 1.5735]; // 12%/yr

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${(n / 1_000).toFixed(0)}k`;
  return `R${n.toLocaleString()}`;
}

export function EvFleetsCalculator() {
  const [fuel, setFuel] = useState(40000);

  const monthlySaving = Math.round(fuel * 0.60);
  const fiveYrFuelCost = fuel * 12 * DIESEL_ESCALATION.reduce((a, b) => a + b, 0);
  const fiveYrSaving = Math.round(fiveYrFuelCost * 0.60);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Estimate your fuel saving
      </p>

      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-white/70">Monthly fleet fuel spend</span>
        <span className="font-display font-extrabold text-sm text-white">{formatRand(fuel)}</span>
      </div>

      <input
        type="range"
        min={10000}
        max={500000}
        step={10000}
        value={fuel}
        onChange={(e) => setFuel(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
        aria-label="Monthly fleet fuel spend"
      />

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-body text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Est. monthly saving</p>
          <p className="font-display font-extrabold text-xl text-white">{formatRand(monthlySaving)}</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
          <p className="font-body text-xs mb-1" style={{ color: `${ACCENT_TEXT}99` }}>Est. 5-yr fuel saving</p>
          <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
            {formatRand(fiveYrSaving)}
          </p>
        </div>
      </div>

      <p className="font-body text-[10px] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.30)' }}>
        Based on 60% saving vs diesel at 12% annual escalation. Indicative only.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/calculators/EvFleetsCalculator.tsx
git commit -m "feat: add EvFleetsCalculator component"
```

---

## Task 11: FinancingCards

**Files:**
- Create: `src/components/sections/FinancingCards.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/sections/FinancingCards.tsx
export function FinancingCards() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* CapEx */}
      <div className="flex-1 rounded-2xl p-6" style={{ background: '#F5F5F5' }}>
        <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280] mb-1">CapEx</p>
        <h3 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-3">Purchase outright</h3>
        <ul className="space-y-2">
          {[
            'Full asset ownership from day one',
            'Section 12B tax depreciation (125%)',
            'Highest long-term ROI',
            'No monthly payment obligations',
            'Balance-sheet asset',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-sm text-[#374151]">
              <span className="mt-0.5 text-[#39575C] flex-shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* OpEx */}
      <div className="flex-1 rounded-2xl p-6" style={{ background: '#0d1f22' }}>
        <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>OpEx</p>
        <h3 className="font-display font-extrabold text-xl text-white mb-3">PPA or lease</h3>
        <ul className="space-y-2">
          {[
            'R0 capital — no upfront cost',
            'Fixed tariff below Eskom rate',
            'Operations & maintenance included',
            'Off-balance-sheet financing',
            '10–25 year agreement, purchase option',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <span className="mt-0.5 text-[#709DA9] flex-shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/FinancingCards.tsx
git commit -m "feat: add FinancingCards CapEx vs OpEx component"
```

---

## Task 12: SolutionTabs

**Files:**
- Create: `src/components/sections/SolutionTabs.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/sections/SolutionTabs.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { FinancingCards } from './FinancingCards';

export interface TabItem {
  label: string;
  icon: string;
  iconBg: string;
  title: string;
  body: string;
  bullets: string[];
  imageBg: string;
  imageEmoji: string;
  type?: 'financing';
}

export interface SolutionTabsProps {
  tabs: TabItem[];
  accent: string;
  id?: string;
}

export function SolutionTabs({ tabs, accent, id }: SolutionTabsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activeItem = tabs[activeTab];

  function renderPanelBody(tab: TabItem) {
    if (tab.type === 'financing') return <FinancingCards />;
    return (
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        <div className="flex-1">
          <h3 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-3">{tab.title}</h3>
          <p className="font-body text-sm text-[#374151] leading-[1.75] mb-4">{tab.body}</p>
          <ul className="space-y-2">
            {tab.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 font-body text-sm text-[#374151]">
                <span style={{ color: accent }} className="mt-0.5 flex-shrink-0 font-bold">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        {tab.imageBg && (
          <div
            className="w-full md:w-[220px] h-[160px] md:h-[180px] rounded-2xl flex items-center justify-center flex-shrink-0 text-5xl"
            style={{ background: tab.imageBg }}
          >
            {tab.imageEmoji}
          </div>
        )}
      </div>
    );
  }

  return (
    <section id={id} className="bg-white px-5 py-12 md:py-[52px]">
      <div className="max-w-[960px] mx-auto">
        {/* Desktop tabs */}
        {!isMobile && (
          <>
            <div className="flex gap-1 border-b border-[#E5E7EB] mb-8 overflow-x-auto">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className="flex items-center gap-2 px-4 py-3 font-body text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2 -mb-px"
                  style={{
                    borderBottomColor: i === activeTab ? accent : 'transparent',
                    color: i === activeTab ? '#1A1A1A' : '#6B7280',
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                    style={{ background: tab.iconBg }}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>
            {renderPanelBody(activeItem)}
          </>
        )}

        {/* Mobile accordion */}
        {isMobile && (
          <div className="space-y-2">
            {tabs.map((tab, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={tab.label} className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 text-left"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                        style={{ background: tab.iconBg }}
                      >
                        {tab.icon}
                      </span>
                      <span className="font-body text-sm font-semibold text-[#1A1A1A]">{tab.label}</span>
                    </span>
                    <span
                      className="text-[#6B7280] transition-transform duration-300 text-xs"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    ref={(el) => { contentRefs.current[i] = el; }}
                    style={{
                      maxHeight: isOpen
                        ? (contentRefs.current[i]?.scrollHeight ?? 1000) + 'px'
                        : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 350ms ease-in-out',
                    }}
                  >
                    <div className="px-4 pb-5">{renderPanelBody(tab)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/SolutionTabs.tsx
git commit -m "feat: add SolutionTabs with desktop tabs and mobile accordion"
```

---

## Task 13: Testimonials

**Files:**
- Create: `src/components/sections/Testimonials.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/sections/Testimonials.tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export interface TestimonialQuote {
  text: string;
  author: string;
  role: string;
  company: string;
}

export interface TestimonialsProps {
  quotes: TestimonialQuote[];
  accent: string;
  id?: string;
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function Testimonials({ quotes, accent, id }: TestimonialsProps) {
  return (
    <section id={id} className="bg-[#F5F5F5] px-5 py-12 md:py-[52px]">
      <div className="max-w-[960px] mx-auto">
        <AnimatedSection className="text-center mb-10">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
            What clients say
          </p>
          <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
            Results that{' '}
            <em style={{ color: accent, fontStyle: 'normal' }}>speak for themselves</em>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((q, i) => (
            <AnimatedSection key={i} delay={i * 0.07}>
              <div className="bg-white rounded-2xl p-6 h-full flex flex-col" style={{ border: '1px solid #E5E7EB' }}>
                {/* Quote mark */}
                <p
                  className="font-display font-extrabold leading-none mb-3 select-none"
                  style={{ fontSize: 44, color: accent, lineHeight: 1 }}
                >
                  "
                </p>
                <p className="font-body text-sm leading-[1.75] text-[#374151] flex-1 mb-5">{q.text}</p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#39575C' }}
                  >
                    <span className="font-display font-bold text-xs text-white">{initials(q.author)}</span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-[#1A1A1A] leading-none mb-0.5">{q.author}</p>
                    <p className="font-body text-xs text-[#6B7280]">{q.role} · {q.company}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Testimonials.tsx
git commit -m "feat: add Testimonials 3-col quote cards component"
```

---

## Task 14: Update HowItWorks — add ctaLabel / ctaHref props

**Files:**
- Modify: `src/components/sections/HowItWorks.tsx`

The component currently hardcodes `href="/contact"` and label `"Get a Free Assessment →"`. Add optional props that fall back to those defaults.

- [ ] **Step 1: Update the interface and usages**

In `src/components/sections/HowItWorks.tsx`, change the `HowItWorksProps` interface:

```typescript
// BEFORE
interface HowItWorksProps {
  eyebrow?: string;
  title: string;
  steps: Step[];
  autoAdvanceInterval?: number;
  showCTA?: boolean;
}

// AFTER
interface HowItWorksProps {
  eyebrow?: string;
  title: string;
  steps: Step[];
  autoAdvanceInterval?: number;
  showCTA?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}
```

Update the destructure and both CTA `<Button>` usages (one in desktop layout, one in mobile layout):

```typescript
// BEFORE destructure
export function HowItWorks({
  eyebrow = 'How it works',
  title,
  steps,
  autoAdvanceInterval = 2600,
  showCTA = true,
}: HowItWorksProps) {

// AFTER destructure
export function HowItWorks({
  eyebrow = 'How it works',
  title,
  steps,
  autoAdvanceInterval = 2600,
  showCTA = true,
  ctaLabel = 'Get a Free Assessment →',
  ctaHref = '/contact',
}: HowItWorksProps) {
```

Replace both `<Button variant="primary" href="/contact">` occurrences:

```typescript
// BEFORE (appears twice)
<Button variant="primary" href="/contact">
  Get a Free Assessment →
</Button>

// AFTER (appears twice)
<Button variant="primary" href={ctaHref}>
  {ctaLabel}
</Button>
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HowItWorks.tsx
git commit -m "feat: add ctaLabel/ctaHref props to HowItWorks"
```

---

## Task 15: Update FeaturedProjects — add vertical filter prop

**Files:**
- Modify: `src/components/sections/FeaturedProjects.tsx`

- [ ] **Step 1: Update the component**

```typescript
// src/components/sections/FeaturedProjects.tsx
import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import { FEATURED_PROJECTS_QUERY, PROJECTS_BY_VERTICAL_QUERY } from '@/lib/queries';
import { ProjectCard } from './ProjectCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import type { ProjectCard as ProjectCardType } from '@/types/sanity';
import type { SolutionVertical } from '@/types/solutions';

interface FeaturedProjectsProps {
  vertical?: SolutionVertical;
}

async function getProjects(vertical?: SolutionVertical): Promise<ProjectCardType[]> {
  try {
    if (vertical) {
      return await sanityClient.fetch<ProjectCardType[]>(PROJECTS_BY_VERTICAL_QUERY, { vertical });
    }
    return await sanityClient.fetch<ProjectCardType[]>(FEATURED_PROJECTS_QUERY);
  } catch {
    return [];
  }
}

export async function FeaturedProjects({ vertical }: FeaturedProjectsProps = {}) {
  const projects = await getProjects(vertical);

  if (projects.length === 0) return null;

  return (
    <section className="bg-white px-5 py-12 md:py-[48px]">
      {/* Header row */}
      <AnimatedSection>
        <div className="flex items-end justify-between max-w-[960px] mx-auto mb-6">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
              Featured projects
            </p>
            <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
              Work that speaks{' '}
              <em style={{ color: '#709DA9', fontStyle: 'normal' }}>for itself</em>
            </h2>
          </div>
          <Link
            href="/projects"
            className="font-body text-sm font-medium text-[#39575C] hover:text-[#2a4045] transition-colors flex-shrink-0 ml-4"
          >
            View all projects →
          </Link>
        </div>
      </AnimatedSection>

      {/* Horizontal scroll container */}
      <div
        className="flex gap-3.5 overflow-x-auto scrollbar-none pb-2"
        style={{ margin: '0 -20px', paddingLeft: 20, paddingRight: 20 }}
      >
        {projects.map((project, i) => (
          <AnimatedSection key={project._id} delay={i * 0.05} as="div" className="flex-shrink-0">
            <ProjectCard project={project} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/FeaturedProjects.tsx
git commit -m "feat: add optional vertical filter prop to FeaturedProjects"
```

---

## Task 16: Remove dynamic route

**Files:**
- Delete: `src/app/solutions/[vertical]/loading.tsx`

- [ ] **Step 1: Delete the dynamic route directory**

```bash
rm -rf "src/app/solutions/[vertical]"
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove dynamic [vertical] route — replaced with static routes"
```

---

## Task 17: ci-solar-storage page

**Files:**
- Create: `src/app/solutions/ci-solar-storage/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// src/app/solutions/ci-solar-storage/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionSubNav } from '@/components/sections/SolutionSubNav';
import { SolutionPain } from '@/components/sections/SolutionPain';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTABanner } from '@/components/sections/CTABanner';
import { StatsStrip } from '@/components/ui/StatsStrip';
import { SolarCalculator } from '@/components/sections/calculators/SolarCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { TestimonialQuote } from '@/components/sections/Testimonials';

const vertical = 'ci-solar-storage' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}` },
};

const subNavLinks = [
  { label: 'Overview', href: '#pain' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Technology & Financing', href: '#tabs' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
];

const tabs: TabItem[] = [
  {
    label: 'Solar Technology',
    icon: '🔆',
    iconBg: 'rgba(227,197,141,0.18)',
    title: 'Tier 1 Panels & Hybrid Inverters',
    body: 'We specify Tier 1 monocrystalline panels with string or hybrid inverters sized to your load profile, ensuring maximum yield and full NERSA grid compliance.',
    bullets: ['Tier 1 monocrystalline panels (JA, Longi, Jinko)', 'Hybrid inverters — battery-ready from day one', 'NERSA-compliant single-line diagram', 'Remote performance monitoring via web portal'],
    imageBg: 'linear-gradient(135deg, rgba(227,197,141,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🔆',
  },
  {
    label: 'Battery Storage',
    icon: '🔋',
    iconBg: 'rgba(227,197,141,0.18)',
    title: 'BESS — Energy Without Limits',
    body: 'Battery Energy Storage Systems extend your solar window through peak tariff hours, eliminate demand charges, and provide seamless UPS failover during loadshedding.',
    bullets: ['LFP chemistry for 6 000+ cycle life', 'Peak-shaving algorithms cut demand charges', 'Sub-20ms UPS failover — zero disruption', 'Scalable — add capacity as demand grows'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(227,197,141,0.15) 100%)',
    imageEmoji: '⚡',
  },
  {
    label: 'Financing',
    icon: '💰',
    iconBg: 'rgba(227,197,141,0.18)',
    title: 'Financing Options',
    body: '',
    bullets: [],
    imageBg: '',
    imageEmoji: '',
    type: 'financing',
  },
];

const steps = [
  { label: 'Site Assessment', description: 'We audit your consumption data, roof or ground area, and grid connection details.', tag: 'Free' },
  { label: 'System Design', description: 'Our engineers produce a yield simulation and NERSA-compliant single-line diagram.', tag: '5–7 days' },
  { label: 'Installation', description: 'SAPVIA-certified teams install and commission with zero business disruption.', tag: '1–3 weeks' },
  { label: 'Monitoring', description: '24/7 remote monitoring with monthly generation reports and annual preventive maintenance.', tag: 'Ongoing' },
];

const testimonials: TestimonialQuote[] = [
  { text: 'Phoenix Energy cut our electricity bill by 58% in the first month. The PPA model meant we paid nothing upfront — a no-brainer for our manufacturing plant.', author: 'Sipho Dlamini', role: 'Operations Director', company: 'Coastal Manufacturing (Pty) Ltd' },
  { text: 'The installation team finished three days ahead of schedule. Our BESS system has seen us through every Stage 6 event without a single production stoppage.', author: 'Anele Nkosi', role: 'CFO', company: 'Nkosi Textiles' },
  { text: 'We were sceptical about yield projections but Phoenix delivered 4% above forecast in year one. Their monitoring portal gives us real-time data at our fingertips.', author: 'Pieter van der Berg', role: 'CEO', company: 'Berg Cold Chain Solutions' },
];

export default function CiSolarStoragePage() {
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
      <SolutionHero
        title="Cut your electricity bill by <em>up to 60%</em>"
        subtitle="Commercial and industrial solar and battery storage — zero upfront capital with our PPA model."
        accent={meta.accent}
        badge={meta.label}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1a3a3f 50%, #2d5c63 100%)"
        primaryCta={{ label: 'Get a Free Assessment', href: '/contact' }}
        secondaryCta={{ label: 'See Projects', href: '#projects' }}
      />
      <SolutionSubNav links={subNavLinks} />
      <StatsStrip stats={cfg.stats} />
      <SolutionPain
        id="pain"
        eyebrow="The problem"
        headline="Eskom tariffs rising <em>15% every year</em>"
        body="South African businesses face relentless tariff escalation compounded by loadshedding that costs the economy over R1bn per day. Diesel generators are expensive and polluting. Commercial solar eliminates both problems — with no upfront cost on a PPA."
        pills={['Stage 6 Loadshedding', '15% Annual Tariff Hikes', 'NERSA Compliance', 'Generator Diesel Costs']}
        accent={meta.accent}
      >
        <SolarCalculator />
      </SolutionPain>
      <div id="how-it-works">
        <HowItWorks
          title="From assessment to <em>savings in weeks</em>"
          steps={steps}
          showCTA
          ctaLabel="Get a Free Assessment →"
          ctaHref="/contact"
        />
      </div>
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} />
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
      <Testimonials id="testimonials" quotes={testimonials} accent={meta.accent} />
      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Start dev server and verify visually**

```bash
npm run dev
```
Navigate to `http://localhost:3000/solutions/ci-solar-storage`. Verify:
- Hero renders with gradient bg, badge, headline with em opacity, two buttons
- SubNav appears on scroll and links smooth-scroll to sections
- StatsStrip shows 4 stats in teal strip
- SolutionPain dark section with SolarCalculator — slider moves, numbers update
- HowItWorks auto-advances steps
- SolutionTabs shows desktop tabs / mobile accordion
- Financing tab renders CapEx/OpEx cards
- FeaturedProjects (may show empty if Sanity has no ci-solar-storage projects — that is fine)
- Testimonials renders 3 quote cards
- CTABanner renders

- [ ] **Step 4: Commit**

```bash
git add src/app/solutions/ci-solar-storage/page.tsx
git commit -m "feat: add ci-solar-storage solution page"
```

---

## Task 18: wheeling page

**Files:**
- Create: `src/app/solutions/wheeling/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// src/app/solutions/wheeling/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionSubNav } from '@/components/sections/SolutionSubNav';
import { SolutionPain } from '@/components/sections/SolutionPain';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTABanner } from '@/components/sections/CTABanner';
import { StatsStrip } from '@/components/ui/StatsStrip';
import { WheelingCalculator } from '@/components/sections/calculators/WheelingCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { TestimonialQuote } from '@/components/sections/Testimonials';

const vertical = 'wheeling' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}` },
};

const subNavLinks = [
  { label: 'Overview', href: '#pain' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Agreement Types', href: '#tabs' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
];

const tabs: TabItem[] = [
  {
    label: 'Direct Wheeling',
    icon: '⚡',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Generator-to-Consumer Wheeling',
    body: 'Phoenix Energy connects your facility directly to a renewable generator using the Eskom transmission grid. You pay the generator a fixed tariff below the Eskom rate — no infrastructure investment required.',
    bullets: ['Fixed tariff below Eskom rate', 'Renewable energy certificates (RECs) included', 'NERSA-licensed trading desk', 'Transparent monthly settlement statements'],
    imageBg: 'linear-gradient(135deg, rgba(217,124,118,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🔌',
  },
  {
    label: 'Aggregated Pool',
    icon: '🌐',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Multi-Generator Pool Access',
    body: 'For consumers who want supply security, Phoenix aggregates multiple generators into a single pooled agreement. Your volume is matched dynamically to maintain consistent supply.',
    bullets: ['Supply security from multiple generators', 'Volume-matched dynamically', 'Single contract, single invoice', 'Scales with your consumption growth'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(217,124,118,0.15) 100%)',
    imageEmoji: '🌐',
  },
  {
    label: 'Financing',
    icon: '💰',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Financing Options',
    body: '',
    bullets: [],
    imageBg: '',
    imageEmoji: '',
    type: 'financing',
  },
];

const steps = [
  { label: 'Consumption Audit', description: 'We analyse 12 months of interval meter data to quantify your wheeling opportunity.', tag: 'Free' },
  { label: 'Generator Matching', description: 'Phoenix matches your load profile to available generators on our licensed platforms.', tag: '5–10 days' },
  { label: 'Agreement Sign-off', description: 'NERSA-compliant wheeling agreement executed between generator, Eskom, and consumer.', tag: '2–4 weeks' },
  { label: 'Live Settlement', description: 'T-day energy accounting with monthly consolidated invoicing and REC delivery.', tag: 'Ongoing' },
];

const testimonials: TestimonialQuote[] = [
  { text: "We switched 70% of our load to wheeled renewable energy and immediately cut our electricity cost by 34%. Phoenix handled every licensing requirement — we didn't lift a finger.", author: 'Tarryn Botha', role: 'Head of Sustainability', company: 'Protea Retail Group' },
  { text: "The wheeling agreement was active within six weeks. The fixed tariff has given us budget certainty we haven't had in years — Eskom increases no longer keep us up at night.", author: 'Mohammed Ismail', role: 'Group Financial Manager', company: 'Ismail Properties' },
  { text: "Phoenix's aggregated pool means we get renewable energy even on cloudy days. The monthly REC certificates satisfy our ESG reporting requirements perfectly.", author: 'Liesl Venter', role: 'COO', company: 'Venter Food Processing' },
];

export default function WheelingPage() {
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
      <SolutionHero
        title="Buy renewable energy <em>directly from the source</em>"
        subtitle="Wheel clean power through the Eskom grid to your facility — fixed tariff, no infrastructure, 32% average saving."
        accent={meta.accent}
        badge={meta.label}
        heroBg="linear-gradient(135deg, #1a0f0f 0%, #3a1a18 50%, #5a2a28 100%)"
        primaryCta={{ label: 'Get a Wheeling Quote', href: '/contact' }}
        secondaryCta={{ label: 'How It Works', href: '#how-it-works' }}
      />
      <SolutionSubNav links={subNavLinks} />
      <StatsStrip stats={cfg.stats} />
      <SolutionPain
        id="pain"
        eyebrow="The problem"
        headline="You're paying Eskom rates <em>when cheaper power exists</em>"
        body="Licensed wheeling allows South African businesses to bypass Eskom's retail tariff and buy directly from renewable generators. The regulatory framework exists — but navigating NERSA licensing, generator contracts, and T-day settlement requires expert intervention."
        pills={['NERSA Licensing', 'Eskom Retail Tariff', 'Tariff Escalation', 'Carbon Footprint']}
        accent={meta.accent}
      >
        <WheelingCalculator />
      </SolutionPain>
      <div id="how-it-works">
        <HowItWorks
          title="Wheeling made <em>straightforward</em>"
          steps={steps}
          showCTA
          ctaLabel="Get a Wheeling Quote →"
          ctaHref="/contact"
        />
      </div>
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} />
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
      <Testimonials id="testimonials" quotes={testimonials} accent={meta.accent} />
      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/solutions/wheeling/page.tsx
git commit -m "feat: add wheeling solution page"
```

---

## Task 19: energy-optimisation page

**Files:**
- Create: `src/app/solutions/energy-optimisation/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// src/app/solutions/energy-optimisation/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionSubNav } from '@/components/sections/SolutionSubNav';
import { SolutionPain } from '@/components/sections/SolutionPain';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTABanner } from '@/components/sections/CTABanner';
import { StatsStrip } from '@/components/ui/StatsStrip';
import { OptimisationCalculator } from '@/components/sections/calculators/OptimisationCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { TestimonialQuote } from '@/components/sections/Testimonials';

const vertical = 'energy-optimisation' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}` },
};

const subNavLinks = [
  { label: 'Overview', href: '#pain' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Our Approach', href: '#tabs' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
];

const tabs: TabItem[] = [
  {
    label: 'Real-Time Monitoring',
    icon: '📊',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Sub-Meter Visibility at Every Circuit',
    body: 'Phoenix installs sub-metering at circuit level and streams data to our cloud dashboard. Anomalies trigger instant alerts — before they become costly bills.',
    bullets: ['Circuit-level sub-metering', 'Real-time cloud dashboard', 'Anomaly detection alerts via SMS/email', 'Monthly benchmarking reports'],
    imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '📊',
  },
  {
    label: 'HVAC Optimisation',
    icon: '❄️',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Smart HVAC Control',
    body: 'HVAC typically accounts for 40–60% of commercial energy use. Our BMS integration and schedule tuning reduces run-time waste without sacrificing occupant comfort.',
    bullets: ['BMS integration (any brand)', 'Occupancy-based scheduling', 'Setpoint optimisation algorithms', 'Demand response pre-cooling'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(112,157,169,0.15) 100%)',
    imageEmoji: '❄️',
  },
  {
    label: 'Load Shifting',
    icon: '⚡',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Peak Demand Reduction',
    body: 'Demand charges often make up 30–40% of your electricity bill. We identify shiftable loads and automate them to avoid peak periods — cutting demand charges without touching production.',
    bullets: ['Automated load-shift scheduling', 'Demand charge analysis and reduction', 'Loadshedding-aware scheduling', 'ROI dashboard with savings attribution'],
    imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.18) 0%, rgba(57,87,92,0.22) 100%)',
    imageEmoji: '⏱️',
  },
];

const steps = [
  { label: 'Energy Audit', description: 'A certified energy auditor walks your facility and identifies top waste sources.', tag: 'Free' },
  { label: 'Sub-Meter Install', description: 'Circuit-level sub-meters and IoT sensors installed within 2–5 days.', tag: '2–5 days' },
  { label: 'Tuning & Automation', description: 'BMS integration and load-shift automations deployed — savings start immediately.', tag: '1–2 weeks' },
  { label: 'Continuous Reporting', description: 'Monthly savings reports with attributed ROI. We review and retune quarterly.', tag: 'Ongoing' },
];

const testimonials: TestimonialQuote[] = [
  { text: "Phoenix's energy audit found R180k/year in waste we didn't know we had. Their HVAC optimisation alone paid for the entire engagement in four months.", author: 'Gugu Sithole', role: 'Facilities Manager', company: 'Sithole Commercial Properties' },
  { text: 'The sub-metering dashboard changed how we manage energy. We can see exactly where every rand is going and we have cut our bill by 24% without any capital spend.', author: 'André du Plessis', role: 'Operations Manager', company: 'Du Plessis Food Group' },
  { text: 'Load-shifting kept us off Eskom demand charges through the entire winter peak season. Phoenix saved us R340k in a single quarter.', author: 'Nomsa Khumalo', role: 'CFO', company: 'Khumalo Logistics' },
];

export default function EnergyOptimisationPage() {
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
      <SolutionHero
        title="Stop paying for energy <em>you are wasting</em>"
        subtitle="Real-time monitoring, smart HVAC control, and load-shifting — 28% average waste identified with zero capital outlay."
        accent={meta.accent}
        badge={meta.label}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1c3540 50%, #2a4a58 100%)"
        primaryCta={{ label: 'Book a Free Audit', href: '/contact' }}
        secondaryCta={{ label: 'Our Approach', href: '#tabs' }}
      />
      <SolutionSubNav links={subNavLinks} />
      <StatsStrip stats={cfg.stats} />
      <SolutionPain
        id="pain"
        eyebrow="The problem"
        headline="Up to <em>28% of your energy bill</em> is waste"
        body="Most commercial facilities waste between 20–35% of their electricity through inefficient HVAC scheduling, unmonitored equipment, and avoidable demand charges. Without sub-meter visibility, you are guessing — and paying for it."
        pills={['Demand Charges', 'HVAC Inefficiency', 'No Sub-Meter Data', 'Unmonitored Equipment']}
        accent={meta.accent}
      >
        <OptimisationCalculator />
      </SolutionPain>
      <div id="how-it-works">
        <HowItWorks
          title="From audit to savings <em>in two weeks</em>"
          steps={steps}
          showCTA
          ctaLabel="Book a Free Audit →"
          ctaHref="/contact"
        />
      </div>
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} />
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
      <Testimonials id="testimonials" quotes={testimonials} accent={meta.accent} />
      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/solutions/energy-optimisation/page.tsx
git commit -m "feat: add energy-optimisation solution page"
```

---

## Task 20: carbon-credits page

**Files:**
- Create: `src/app/solutions/carbon-credits/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// src/app/solutions/carbon-credits/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionSubNav } from '@/components/sections/SolutionSubNav';
import { SolutionPain } from '@/components/sections/SolutionPain';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTABanner } from '@/components/sections/CTABanner';
import { StatsStrip } from '@/components/ui/StatsStrip';
import { CarbonCalculator } from '@/components/sections/calculators/CarbonCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { TestimonialQuote } from '@/components/sections/Testimonials';

const vertical = 'carbon-credits' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}` },
};

const subNavLinks = [
  { label: 'Overview', href: '#pain' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Standards & Process', href: '#tabs' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
];

const tabs: TabItem[] = [
  {
    label: 'Verra VCS',
    icon: '🌿',
    iconBg: 'rgba(156,175,136,0.18)',
    title: 'Verra Verified Carbon Standard',
    body: 'Phoenix registers your solar system under the Verra VCS methodology, the most widely accepted carbon standard globally. Credits are issued quarterly and tradeable on international markets.',
    bullets: ['Gold Standard or Verra VCS certification', 'Internationally tradeable credits', 'Quarterly issuance and payout', 'Independent third-party verification'],
    imageBg: 'linear-gradient(135deg, rgba(156,175,136,0.18) 0%, rgba(57,87,92,0.18) 100%)',
    imageEmoji: '🌿',
  },
  {
    label: 'MRV & Reporting',
    icon: '📋',
    iconBg: 'rgba(156,175,136,0.18)',
    title: 'Measurement, Reporting & Verification',
    body: 'Our MRV platform automatically captures generation data from your inverters, calculates displacement emissions, and generates audit-ready reports — with zero manual effort on your part.',
    bullets: ['Automatic inverter data capture', 'Baseline emission displacement calculation', 'Audit-ready MRV reports', 'ESG dashboard for corporate reporting'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.18) 0%, rgba(156,175,136,0.18) 100%)',
    imageEmoji: '📋',
  },
  {
    label: 'Financing',
    icon: '💰',
    iconBg: 'rgba(156,175,136,0.18)',
    title: 'Financing Options',
    body: '',
    bullets: [],
    imageBg: '',
    imageEmoji: '',
    type: 'financing',
  },
];

const steps = [
  { label: 'Eligibility Check', description: 'We verify your solar system meets Verra VCS project criteria — takes 48 hours.', tag: 'Free' },
  { label: 'Project Registration', description: 'Phoenix submits your project to the registry. Third-party validation is arranged.', tag: '30–60 days' },
  { label: 'First Issuance', description: 'Credits issued for retrospective generation since system commissioning date.', tag: 'Once registered' },
  { label: 'Quarterly Payouts', description: 'Credits issued and sold quarterly. Revenue is deposited directly to your account.', tag: 'Every quarter' },
];

const testimonials: TestimonialQuote[] = [
  { text: 'We had no idea our solar system was sitting on a revenue stream. Phoenix registered us in 45 days and we received our first credit payout within the quarter.', author: 'Desiree Mkhize', role: 'Sustainability Lead', company: 'Mkhize Manufacturing' },
  { text: "The MRV platform does everything automatically. The quarterly ESG reports Phoenix produces have been invaluable for our JSE sustainability disclosure.", author: 'Bernhard Steyn', role: 'Group CFO', company: 'Steyn Holdings Ltd' },
  { text: 'Carbon credit revenue now offsets our entire annual maintenance contract. It has turned our solar system from a cost centre into a net revenue generator.', author: 'Fatima Davids', role: 'Financial Director', company: 'Davids Retail Group' },
];

export default function CarbonCreditsPage() {
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
      <SolutionHero
        title="Turn your solar generation into <em>quarterly revenue</em>"
        subtitle="Verra-certified carbon credits from your existing solar system — fully managed, zero admin, quarterly payouts."
        accent={meta.accent}
        badge={meta.label}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #182a1a 50%, #2a4a28 100%)"
        primaryCta={{ label: 'Check Eligibility', href: '/contact' }}
        secondaryCta={{ label: 'How It Works', href: '#how-it-works' }}
      />
      <SolutionSubNav links={subNavLinks} />
      <StatsStrip stats={cfg.stats} />
      <SolutionPain
        id="pain"
        eyebrow="The opportunity"
        headline="Your solar system is generating <em>untapped revenue</em>"
        body="Every kWh your solar system produces displaces grid-sourced CO₂. Under Verra VCS, those avoided emissions convert to tradeable carbon credits worth R8+ each. Most solar owners have never claimed them — leaving significant revenue on the table."
        pills={['Verra VCS Standard', 'ESG Reporting', 'JSE Disclosure', 'Carbon Tax Offset']}
        accent={meta.accent}
      >
        <CarbonCalculator />
      </SolutionPain>
      <div id="how-it-works">
        <HowItWorks
          title="Credits in your account <em>within 90 days</em>"
          steps={steps}
          showCTA
          ctaLabel="Check Eligibility →"
          ctaHref="/contact"
        />
      </div>
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} />
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
      <Testimonials id="testimonials" quotes={testimonials} accent={meta.accent} />
      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/solutions/carbon-credits/page.tsx
git commit -m "feat: add carbon-credits solution page"
```

---

## Task 21: webuysolar page

**Files:**
- Create: `src/app/solutions/webuysolar/page.tsx`

Note: WeBuySolar has no Financing tab — it is a buyback service, not an installation offering.

- [ ] **Step 1: Create the page**

```typescript
// src/app/solutions/webuysolar/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionSubNav } from '@/components/sections/SolutionSubNav';
import { SolutionPain } from '@/components/sections/SolutionPain';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTABanner } from '@/components/sections/CTABanner';
import { StatsStrip } from '@/components/ui/StatsStrip';
import { WeBuySolarCalculator } from '@/components/sections/calculators/WeBuySolarCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { TestimonialQuote } from '@/components/sections/Testimonials';

const vertical = 'webuysolar' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}` },
};

const subNavLinks = [
  { label: 'Overview', href: '#pain' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'What We Accept', href: '#tabs' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
];

const tabs: TabItem[] = [
  {
    label: 'Rooftop Systems',
    icon: '🏭',
    iconBg: 'rgba(201,122,64,0.18)',
    title: 'Commercial Rooftop Solar',
    body: 'We purchase rooftop solar installations of any size from commercial and industrial facilities. Reason for selling does not matter — relocation, upgrade, closure, or portfolio rationalisation all qualify.',
    bullets: ['Systems from 10 kWp to 10 MWp', 'All major inverter brands accepted', 'Panels up to 15 years old considered', 'Roof structural assessment included'],
    imageBg: 'linear-gradient(135deg, rgba(201,122,64,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🏭',
  },
  {
    label: 'Ground-Mount',
    icon: '🌾',
    iconBg: 'rgba(201,122,64,0.18)',
    title: 'Ground-Mount & Farm Systems',
    body: 'Agricultural and ground-mount solar installations are assessed on a case-by-case basis. We handle all decommissioning, transport, and repowering logistics.',
    bullets: ['Single-axis tracker systems accepted', 'Agricultural installations welcome', 'DC and AC-coupled systems', 'Full decommissioning by our certified teams'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(201,122,64,0.15) 100%)',
    imageEmoji: '🌾',
  },
  {
    label: 'Battery Storage',
    icon: '🔋',
    iconBg: 'rgba(201,122,64,0.18)',
    title: 'BESS & Hybrid Systems',
    body: 'Battery systems paired with solar installations are purchased as a bundle. We assess state-of-health and offer fair buyback based on remaining capacity.',
    bullets: ['LFP and NMC chemistries', 'State-of-health assessment included', 'Bundle pricing for solar + BESS', 'Inverter and BMS included in offer'],
    imageBg: 'linear-gradient(135deg, rgba(201,122,64,0.18) 0%, rgba(57,87,92,0.22) 100%)',
    imageEmoji: '🔋',
  },
];

const steps = [
  { label: 'Submit Details', description: 'Share your system specs and location — a 5-minute online form or a quick call.', tag: 'Online' },
  { label: 'Site Inspection', description: 'Our technician visits within 48 hours, assesses condition, and prepares an offer.', tag: '48 hours' },
  { label: 'Offer & Sign', description: "You receive a written offer. No obligation — accept if it works for you.", tag: 'Your choice' },
  { label: 'Cash & Removal', description: 'Payment is transferred within 14 days. Our team handles all decommissioning.', tag: '14 days' },
];

const testimonials: TestimonialQuote[] = [
  { text: 'We relocated our head office and had no use for the solar system. Phoenix made a fair offer within 48 hours and their team removed everything cleanly within a week.', author: 'Siya Mthembu', role: 'Facilities Director', company: 'Mthembu Group' },
  { text: "Upgrading to a larger system, we sold the old installation to Phoenix. The process was effortless — one site visit, one offer, one bank transfer. Exactly what you'd want.", author: 'Karen Fourie', role: 'COO', company: 'Fourie Industrial' },
  { text: 'Phoenix paid significantly more than the scrap quotes we received elsewhere. They clearly know the second-life value of solar assets and price accordingly.', author: 'Rajesh Pillay', role: 'Managing Director', company: 'Pillay Manufacturing' },
];

export default function WeBuySolarPage() {
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
      <SolutionHero
        title="We buy your solar system — <em>cash in 14 days</em>"
        subtitle="Fast valuation, fair price, full decommissioning. Any brand, any size, any reason for selling."
        accent={meta.accent}
        badge={meta.label}
        heroBg="linear-gradient(135deg, #1a0f00 0%, #3a2000 50%, #5a3a10 100%)"
        primaryCta={{ label: 'Get a Valuation', href: '/contact' }}
        secondaryCta={{ label: 'What We Accept', href: '#tabs' }}
      />
      <SolutionSubNav links={subNavLinks} />
      <StatsStrip stats={cfg.stats} />
      <SolutionPain
        id="pain"
        eyebrow="The situation"
        headline="Your solar system has <em>real second-life value</em>"
        body="Businesses relocating, upgrading, or closing often leave solar assets stranded. Scrap dealers undervalue them; brokers take months. Phoenix Energy buys directly — a fair offer based on generation potential and component condition, settled fast."
        pills={['Business Relocation', 'System Upgrade', 'Portfolio Sale', 'Business Closure']}
        accent={meta.accent}
      >
        <WeBuySolarCalculator />
      </SolutionPain>
      <div id="how-it-works">
        <HowItWorks
          title="From enquiry to cash <em>in 14 days</em>"
          steps={steps}
          showCTA
          ctaLabel="Get a Valuation →"
          ctaHref="/contact"
        />
      </div>
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} />
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
      <Testimonials id="testimonials" quotes={testimonials} accent={meta.accent} />
      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/solutions/webuysolar/page.tsx
git commit -m "feat: add webuysolar solution page"
```

---

## Task 22: ev-fleets page

**Files:**
- Create: `src/app/solutions/ev-fleets/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// src/app/solutions/ev-fleets/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionSubNav } from '@/components/sections/SolutionSubNav';
import { SolutionPain } from '@/components/sections/SolutionPain';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTABanner } from '@/components/sections/CTABanner';
import { StatsStrip } from '@/components/ui/StatsStrip';
import { EvFleetsCalculator } from '@/components/sections/calculators/EvFleetsCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { TestimonialQuote } from '@/components/sections/Testimonials';

const vertical = 'ev-fleets' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}` },
};

const subNavLinks = [
  { label: 'Overview', href: '#pain' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Infrastructure', href: '#tabs' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
];

const tabs: TabItem[] = [
  {
    label: 'Charging Infrastructure',
    icon: '⚡',
    iconBg: 'rgba(169,214,203,0.20)',
    title: 'SANS-Certified EV Chargers',
    body: 'Phoenix supplies and installs AC and DC fast chargers compliant with SANS 1017 and SANS 60309. We design depot layouts that maximise vehicle throughput and minimise grid connection costs.',
    bullets: ['AC Level 2 (22 kW) and DC fast (150 kW+)', 'SANS 1017 & SANS 60309 certified', 'Load management to avoid demand spikes', 'Solar integration — charge from your own generation'],
    imageBg: 'linear-gradient(135deg, rgba(169,214,203,0.18) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '⚡',
  },
  {
    label: 'Fleet Dashboard',
    icon: '📱',
    iconBg: 'rgba(169,214,203,0.20)',
    title: 'Real-Time Fleet Management',
    body: 'Our fleet dashboard gives operations managers live visibility into vehicle state-of-charge, charging status, range, and energy cost per kilometre — all in one place.',
    bullets: ['Live state-of-charge per vehicle', 'Route planning with charge stops', 'Energy cost per km vs diesel baseline', 'Driver behaviour scoring'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(169,214,203,0.18) 100%)',
    imageEmoji: '📱',
  },
  {
    label: 'Financing',
    icon: '💰',
    iconBg: 'rgba(169,214,203,0.20)',
    title: 'Financing Options',
    body: '',
    bullets: [],
    imageBg: '',
    imageEmoji: '',
    type: 'financing',
  },
];

const steps = [
  { label: 'Fleet Assessment', description: 'We analyse your fleet routes, duty cycles, and depot layout to design the right charging solution.', tag: 'Free' },
  { label: 'Depot Design', description: 'Load flow study, charger placement plan, and grid connection sizing delivered in 7 days.', tag: '7 days' },
  { label: 'Installation', description: 'SANS-certified electricians install chargers and connect fleet management software.', tag: '2–4 weeks' },
  { label: 'Fleet Dashboard', description: 'Dashboard onboarding and driver training. Live savings reporting from day one.', tag: 'Ongoing' },
];

const testimonials: TestimonialQuote[] = [
  { text: 'We electrified 40 delivery vehicles and Phoenix managed the entire depot infrastructure from planning to commissioning. Our energy cost per km dropped by 63%.', author: 'Thabo Mokoena', role: 'Fleet Director', company: 'Mokoena Logistics Group' },
  { text: "The fleet dashboard has transformed how we manage vehicles. We know exactly what each vehicle costs to run and the ESG reporting is done automatically.", author: 'Priya Naidoo', role: 'Head of Operations', company: 'Naidoo Distribution' },
  { text: 'Phoenix integrated our EV charging with our existing solar system. We are now charging 80% of our fleet from our own generation — the economics are extraordinary.', author: 'Willem Olivier', role: 'CEO', company: 'Olivier Transport Solutions' },
];

export default function EvFleetsPage() {
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
      <SolutionHero
        title="Electrify your fleet and cut fuel costs <em>by 60%</em>"
        subtitle="SANS-certified EV charging infrastructure, fleet management dashboard, and full depot design — built for South African conditions."
        accent={meta.accent}
        badge={meta.label}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #0f2a28 50%, #1a4040 100%)"
        primaryCta={{ label: 'Get a Fleet Assessment', href: '/contact' }}
        secondaryCta={{ label: 'Our Infrastructure', href: '#tabs' }}
      />
      <SolutionSubNav links={subNavLinks} />
      <StatsStrip stats={cfg.stats} />
      <SolutionPain
        id="pain"
        eyebrow="The opportunity"
        headline="Diesel is costing your fleet <em>more every year</em>"
        body="South African diesel prices have risen 85% in five years and continue climbing with the rand. EV total cost of ownership is already below diesel — and falling. Fleet electrification eliminates fuel price volatility, reduces maintenance costs, and satisfies ESG mandates."
        pills={['Diesel Price Volatility', 'Fleet Carbon Footprint', 'ESG Compliance', 'Rising Maintenance Costs']}
        accent={meta.accent}
      >
        <EvFleetsCalculator />
      </SolutionPain>
      <div id="how-it-works">
        <HowItWorks
          title="Your fleet electrified <em>in four steps</em>"
          steps={steps}
          showCTA
          ctaLabel="Get a Fleet Assessment →"
          ctaHref="/contact"
        />
      </div>
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} />
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
      <Testimonials id="testimonials" quotes={testimonials} accent={meta.accent} />
      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Final build check**

```bash
npm run build
```
Expected: build completes with no TypeScript or Next.js errors. All 6 solution pages appear in the output as static routes.

- [ ] **Step 4: Commit**

```bash
git add src/app/solutions/ev-fleets/page.tsx
git commit -m "feat: add ev-fleets solution page — Phase 4-A complete"
```

---

## Self-Review

**Spec coverage check:**
- ✅ 6 static routes created (Tasks 17–22)
- ✅ `src/config/verticals.ts` — stats + SEO per vertical (Task 1)
- ✅ `SolutionHero` — gradient bg, badge, em-opacity title, two CTAs (Task 2)
- ✅ `SolutionSubNav` — sticky, scroll-triggered, smooth-scroll anchors (Task 3)
- ✅ `SolutionPain` — dark bg, 2-col desktop, children slot, pills hidden mobile (Task 4)
- ✅ 6 per-vertical calculators — spec formulas, highlighted output card (Tasks 5–10)
- ✅ `FinancingCards` — CapEx (#F5F5F5) + OpEx (#0d1f22), static content (Task 11)
- ✅ `SolutionTabs` — desktop tabs + mobile accordion, SSR-safe, financing slot (Task 12)
- ✅ `Testimonials` — 3-col, accent quote mark, initials avatar (Task 13)
- ✅ `HowItWorks` updated — `ctaLabel`/`ctaHref` props, defaults preserved (Task 14)
- ✅ `FeaturedProjects` updated — optional `vertical` prop, switches query (Task 15)
- ✅ Dynamic route removed (Task 16)
- ✅ JSON-LD Service schema per page
- ✅ `generateMetadata` canonical URL per page
- ✅ `WeBuySolar` has no Financing tab (confirmed per spec open item 4)
- ✅ SSR-safe mobile detection — `useEffect + window.innerWidth` (no `useMediaQuery`)

**Open items not in scope:**
- Real hero photography (client-supplied)
- Real client testimonials (client-supplied)
- OG images per vertical (separate task)
- Sanity project data tagged by vertical (seeding task)

---

*Phase 4-A: Solutions Pages | Phoenix Energy Website v3.0*

# C&I Solar Strategy Finder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic in-hero savings slider on `/solutions/ci-solar-storage` with a branching "Find My Strategy" wizard that diagnoses the visitor (no bill amount, no savings numbers) and routes them to the best-fit Solar/BESS strategy tab and a free assessment.

**Architecture:** A pure `recommendStrategy(answers)` function (unit-tested with Vitest) drives a client `StrategyFinder` wizard. A single `strategies` config is the source of truth for the reveal, the restructured Solution tabs (deep-linked by URL hash), and the contact-form prefill. Financing moves out of the tabs into its own band. All shared-component changes are additive so the other five verticals are unaffected.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind v4, Vitest (new, logic only), existing `dlPush` analytics.

**Reference:** Design spec at `docs/superpowers/specs/2026-06-09-ci-solar-strategy-finder-design.md`.

---

## File Structure

**Create**
- `vitest.config.ts` — Vitest config (node env, `src/**/*.test.ts`).
- `src/lib/strategy/types.ts` — shared strategy types.
- `src/lib/strategy/recommendStrategy.ts` — pure decision logic.
- `src/lib/strategy/recommendStrategy.test.ts` — unit tests for the logic.
- `src/lib/strategy/rationale.ts` — pure rationale-sentence builder.
- `src/lib/strategy/rationale.test.ts` — unit tests for the rationale builder.
- `src/config/strategies.ts` — per-strategy display + tab content + contact sentence; tab builder.
- `src/components/sections/StrategyFinder.tsx` — the wizard + reveal (client).
- `src/components/sections/FinancingBand.tsx` — standalone CapEx/OpEx band.

**Modify**
- `package.json` — add `test` script + Vitest dev dependency.
- `src/lib/analytics.ts` — add three strategy-finder events.
- `src/components/sections/SolutionTabs.tsx` — additive `key` + hash/scroll support.
- `src/components/sections/SolutionHero.tsx` — additive `secondaryLink` prop.
- `src/components/sections/ContactForm.tsx` — prefill intent + message from URL.
- `src/app/solutions/ci-solar-storage/page.tsx` — wire finder, strategy tabs, financing band.

**Delete**
- `src/components/sections/calculators/SolarCalculator.tsx`.

---

## Task 1: Set up Vitest (logic tests only)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create (temporary): `src/lib/strategy/smoke.test.ts`

- [ ] **Step 1: Install Vitest**

Run: `npm install -D vitest`
Expected: `vitest` appears under `devDependencies` in `package.json`; no errors.

- [ ] **Step 2: Add the test script**

In `package.json`, add to the `"scripts"` block (after `"lint": "eslint"`):

```json
    "lint": "eslint",
    "test": "vitest run"
```

- [ ] **Step 3: Create the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Add a smoke test to prove the runner works**

Create `src/lib/strategy/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('vitest', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run the smoke test**

Run: `npm test`
Expected: PASS — 1 passed test.

- [ ] **Step 6: Delete the smoke test**

Delete `src/lib/strategy/smoke.test.ts` (it has served its purpose).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add Vitest for unit-testing strategy logic"
```

---

## Task 2: Strategy types

**Files:**
- Create: `src/lib/strategy/types.ts`

- [ ] **Step 1: Create the types**

Create `src/lib/strategy/types.ts`:

```ts
// Inputs the wizard collects.
export type Goal = 'cut-bill' | 'backup' | 'independence';
export type EnergyRate = 'flat' | 'tou' | 'block' | 'unknown';
export type DemandCharge = 'yes' | 'no' | 'unknown';
export type Usage = 'daytime' | 'around-clock' | 'evenings';

// The five strategies (also the Solution tab keys).
export type StrategyKey =
  | 'grid-tied-solar'
  | 'battery-arbitrage'
  | 'demand-shaving'
  | 'backup-resilience'
  | 'off-grid';

export type Topology = 'solar-only' | 'hybrid' | 'off-grid';

export interface StrategyAnswers {
  goal: Goal;
  energyRate?: EnergyRate;     // present only when goal === 'cut-bill'
  demandCharge?: DemandCharge; // present only when goal === 'cut-bill'
  usage: Usage;
}

export interface StrategyResult {
  primary: StrategyKey;
  secondary: StrategyKey[];
  topology: Topology;
  caveated: boolean;     // true for the "don't know" hybrid default
  tabAnchor: string;     // e.g. 'strategy-battery-arbitrage'
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/strategy/types.ts
git commit -m "feat(strategy): add strategy-finder types"
```

---

## Task 3: `recommendStrategy` decision logic (TDD)

**Files:**
- Create: `src/lib/strategy/recommendStrategy.test.ts`
- Create: `src/lib/strategy/recommendStrategy.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/strategy/recommendStrategy.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { recommendStrategy } from './recommendStrategy';
import type { StrategyAnswers } from './types';

describe('recommendStrategy — goal gate', () => {
  it('backup goal → backup-resilience, hybrid, regardless of tariff', () => {
    const r = recommendStrategy({ goal: 'backup', usage: 'daytime' });
    expect(r.primary).toBe('backup-resilience');
    expect(r.topology).toBe('hybrid');
    expect(r.secondary).toEqual([]);
    expect(r.caveated).toBe(false);
    expect(r.tabAnchor).toBe('strategy-backup-resilience');
  });

  it('independence goal → off-grid, off-grid topology', () => {
    const r = recommendStrategy({ goal: 'independence', usage: 'evenings' });
    expect(r.primary).toBe('off-grid');
    expect(r.topology).toBe('off-grid');
  });
});

describe('recommendStrategy — cut-bill levers', () => {
  it('demand charge + ToU → demand-shaving with arbitrage secondary', () => {
    const a: StrategyAnswers = { goal: 'cut-bill', demandCharge: 'yes', energyRate: 'tou', usage: 'around-clock' };
    const r = recommendStrategy(a);
    expect(r.primary).toBe('demand-shaving');
    expect(r.secondary).toEqual(['battery-arbitrage']);
    expect(r.topology).toBe('hybrid');
  });

  it('demand charge without ToU → demand-shaving, no secondary', () => {
    const r = recommendStrategy({ goal: 'cut-bill', demandCharge: 'yes', energyRate: 'flat', usage: 'daytime' });
    expect(r.primary).toBe('demand-shaving');
    expect(r.secondary).toEqual([]);
  });

  it('ToU without demand charge → battery-arbitrage', () => {
    const r = recommendStrategy({ goal: 'cut-bill', demandCharge: 'no', energyRate: 'tou', usage: 'daytime' });
    expect(r.primary).toBe('battery-arbitrage');
    expect(r.topology).toBe('hybrid');
  });

  it('block tariff → grid-tied-solar (not caveated)', () => {
    const r = recommendStrategy({ goal: 'cut-bill', demandCharge: 'no', energyRate: 'block', usage: 'daytime' });
    expect(r.primary).toBe('grid-tied-solar');
    expect(r.caveated).toBe(false);
    expect(r.topology).toBe('solar-only');
  });

  it('flat tariff + evening usage → grid-tied-solar, hybrid topology', () => {
    const r = recommendStrategy({ goal: 'cut-bill', demandCharge: 'no', energyRate: 'flat', usage: 'evenings' });
    expect(r.primary).toBe('grid-tied-solar');
    expect(r.topology).toBe('hybrid');
  });

  it('both unknown → grid-tied-solar, caveated hybrid default', () => {
    const r = recommendStrategy({ goal: 'cut-bill', demandCharge: 'unknown', energyRate: 'unknown', usage: 'daytime' });
    expect(r.primary).toBe('grid-tied-solar');
    expect(r.caveated).toBe(true);
  });
});

describe('recommendStrategy — topology from usage for grid-tied', () => {
  it('daytime → solar-only', () => {
    expect(recommendStrategy({ goal: 'cut-bill', demandCharge: 'no', energyRate: 'flat', usage: 'daytime' }).topology).toBe('solar-only');
  });
  it('around-clock → hybrid', () => {
    expect(recommendStrategy({ goal: 'cut-bill', demandCharge: 'no', energyRate: 'flat', usage: 'around-clock' }).topology).toBe('hybrid');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `./recommendStrategy` (module not found).

- [ ] **Step 3: Write the implementation**

Create `src/lib/strategy/recommendStrategy.ts`:

```ts
import type { StrategyAnswers, StrategyResult, StrategyKey, Topology, Usage } from './types';

function deriveTopology(primary: StrategyKey, usage: Usage): Topology {
  if (primary === 'off-grid') return 'off-grid';
  if (primary === 'grid-tied-solar') return usage === 'daytime' ? 'solar-only' : 'hybrid';
  // battery-arbitrage, demand-shaving, backup-resilience all require storage
  return 'hybrid';
}

export function recommendStrategy(answers: StrategyAnswers): StrategyResult {
  const { goal, energyRate = 'unknown', demandCharge = 'unknown', usage } = answers;

  let primary: StrategyKey;
  let secondary: StrategyKey[] = [];
  let caveated = false;

  if (goal === 'backup') {
    primary = 'backup-resilience';
  } else if (goal === 'independence') {
    primary = 'off-grid';
  } else {
    // goal === 'cut-bill' — pick the biggest lever first
    if (demandCharge === 'yes') {
      primary = 'demand-shaving';
      if (energyRate === 'tou') secondary = ['battery-arbitrage'];
    } else if (energyRate === 'tou') {
      primary = 'battery-arbitrage';
    } else if (energyRate === 'block' || energyRate === 'flat') {
      primary = 'grid-tied-solar';
    } else {
      // energy rate unknown and no known demand charge → flexible hybrid default
      primary = 'grid-tied-solar';
      caveated = true;
    }
  }

  return {
    primary,
    secondary,
    topology: deriveTopology(primary, usage),
    caveated,
    tabAnchor: `strategy-${primary}`,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all `recommendStrategy` tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/strategy/recommendStrategy.ts src/lib/strategy/recommendStrategy.test.ts
git commit -m "feat(strategy): add recommendStrategy decision logic with tests"
```

---

## Task 4: Rationale builder (TDD)

**Files:**
- Create: `src/lib/strategy/rationale.test.ts`
- Create: `src/lib/strategy/rationale.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/strategy/rationale.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { buildRationale } from './rationale';
import { recommendStrategy } from './recommendStrategy';

describe('buildRationale', () => {
  it('demand-shaving + arbitrage mentions both Time-of-Use and demand charges', () => {
    const a = { goal: 'cut-bill', demandCharge: 'yes', energyRate: 'tou', usage: 'around-clock' } as const;
    const text = buildRationale(a, recommendStrategy(a));
    expect(text).toContain('Time-of-Use');
    expect(text).toContain('demand charges');
  });

  it('caveated default points to the free assessment', () => {
    const a = { goal: 'cut-bill', demandCharge: 'unknown', energyRate: 'unknown', usage: 'daytime' } as const;
    const text = buildRationale(a, recommendStrategy(a));
    expect(text.toLowerCase()).toContain('free assessment');
  });

  it('returns a non-empty sentence for every primary', () => {
    const samples = [
      { goal: 'backup', usage: 'daytime' },
      { goal: 'independence', usage: 'evenings' },
      { goal: 'cut-bill', demandCharge: 'no', energyRate: 'tou', usage: 'daytime' },
      { goal: 'cut-bill', demandCharge: 'no', energyRate: 'block', usage: 'daytime' },
    ] as const;
    for (const a of samples) {
      expect(buildRationale(a, recommendStrategy(a)).length).toBeGreaterThan(10);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `./rationale`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/strategy/rationale.ts`:

```ts
import type { StrategyAnswers, StrategyResult, Usage } from './types';

const USAGE_PHRASE: Record<Usage, string> = {
  daytime: 'mostly during the day',
  'around-clock': 'around the clock',
  evenings: 'mostly in the evenings',
};

export function buildRationale(answers: StrategyAnswers, result: StrategyResult): string {
  const usage = USAGE_PHRASE[answers.usage];

  switch (result.primary) {
    case 'demand-shaving':
      return result.secondary.includes('battery-arbitrage')
        ? `You're on Time-of-Use and pay demand charges, running ${usage}. Solar covers your daytime load; a battery flattens the demand spikes driving your kVA charge and shifts energy into the expensive peak hours.`
        : `You pay demand charges, running ${usage}. Solar covers your daytime load while a battery flattens the demand spikes that drive your kVA charge — often the biggest line on the bill.`;
    case 'battery-arbitrage':
      return `Your Time-of-Use tariff makes power expensive at peak. Store cheap solar by day and use it when the rates bite, running ${usage}.`;
    case 'grid-tied-solar':
      if (result.caveated) {
        return `Based on what you've told us, a hybrid solar-and-storage system is the flexible starting point — a free assessment will confirm the exact tactic for your site.`;
      }
      if (answers.energyRate === 'block') {
        return `On a block tariff every extra unit costs more — generating your own power, used ${usage}, shaves off the priciest units first.`;
      }
      return result.topology === 'hybrid'
        ? `Solar offsets the power you use ${usage}, and a battery stores the daytime surplus so you can use it after dark.`
        : `Solar offsets the power you use ${usage}, with the grid staying as your simple backup.`;
    case 'backup-resilience':
      return `Uptime is your priority. A grid-tied hybrid keeps you running ${usage} through loadshedding and outages — and trims your bill as a bonus.`;
    case 'off-grid':
      return `You want off the grid. Solar plus a large battery (and an optional generator) can take you there, covering your use ${usage}.`;
    default:
      return '';
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all rationale tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/strategy/rationale.ts src/lib/strategy/rationale.test.ts
git commit -m "feat(strategy): add rationale sentence builder with tests"
```

---

## Task 5: Strategies config (display + tab content + contact sentence)

**Files:**
- Modify: `src/components/sections/SolutionTabs.tsx` (add optional `key` to `TabItem`)
- Create: `src/config/strategies.ts`

- [ ] **Step 1: Add an optional `key` to `TabItem`**

In `src/components/sections/SolutionTabs.tsx`, update the `TabItem` interface (around line 32) to add a `key` field:

```ts
export interface TabItem {
  key?: string;        // stable anchor for deep-linking, e.g. 'strategy-demand-shaving'
  label: string;
  icon: IconName;
  iconBg: string;
  title: string;
  body: string;
  bullets: string[];
  imageBg: string;
  imageEmoji: string;
  type?: 'financing';
}
```

- [ ] **Step 2: Create the strategies config**

Create `src/config/strategies.ts`. Copy for `grid-tied-solar` and `battery-arbitrage` is repurposed from the current CI tabs (Solar Technology / Battery Storage); the three new strategies get concise copy in the same voice.

```ts
import type { TabItem, IconName } from '@/components/sections/SolutionTabs';
import type { StrategyKey } from '@/lib/strategy/types';

export interface StrategyDef {
  key: StrategyKey;
  label: string;            // tab label + reveal name
  icon: IconName;
  glyph: string;            // emoji used in the reveal diagram
  bestFor: string;
  contactSentence: string;  // pre-fills the contact "Tell us more" box
  tab: {
    iconBg: string;
    title: string;
    body: string;
    bullets: string[];
    imageBg: string;
    imageEmoji: string;
  };
}

const ICON_BG = 'rgba(227,197,141,0.18)';

export const STRATEGIES: Record<StrategyKey, StrategyDef> = {
  'grid-tied-solar': {
    key: 'grid-tied-solar',
    label: 'Grid-Tied Solar',
    icon: 'Sun',
    glyph: '☀️',
    bestFor: 'Daytime users on a simple tariff',
    contactSentence:
      "I used the Strategy Finder on your C&I Solar & Storage page — my recommended strategy is Grid-Tied Solar (self-consumption). I'd like a free assessment.",
    tab: {
      iconBg: ICON_BG,
      title: 'Tier 1 Panels & Hybrid Inverters',
      body: 'We specify Tier 1 monocrystalline panels with string or hybrid inverters sized to your load profile — offsetting the power you use during the day, with the grid (and an optional battery) as backup.',
      bullets: [
        'Tier 1 monocrystalline panels (JA, Longi, Jinko)',
        'Hybrid inverters — battery-ready from day one',
        'NERSA-compliant single-line diagram',
        'Add storage later to use solar after dark (hybrid)',
      ],
      imageBg: 'linear-gradient(135deg, rgba(227,197,141,0.15) 0%, rgba(57,87,92,0.20) 100%)',
      imageEmoji: '🔆',
    },
  },
  'battery-arbitrage': {
    key: 'battery-arbitrage',
    label: 'Battery Arbitrage',
    icon: 'Battery',
    glyph: '🔋',
    bestFor: 'Time-of-Use tariffs — buy low, use high',
    contactSentence:
      "I used the Strategy Finder on your C&I Solar & Storage page — my recommended strategy is Battery Arbitrage. I'd like a free assessment.",
    tab: {
      iconBg: ICON_BG,
      title: 'BESS — Buy Low, Use High',
      body: 'On a Time-of-Use tariff, energy costs far more in peak windows. A Battery Energy Storage System stores cheap solar and off-peak power, then discharges when Eskom charges the most.',
      bullets: [
        'LFP chemistry for 6 000+ cycle life',
        'Automated daily charge/discharge scheduling',
        'Targets peak / standard / off-peak rate spreads',
        'Sub-20ms UPS failover during loadshedding',
      ],
      imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(227,197,141,0.15) 100%)',
      imageEmoji: '⚡',
    },
  },
  'demand-shaving': {
    key: 'demand-shaving',
    label: 'Demand Shaving',
    icon: 'Activity',
    glyph: '📉',
    bestFor: 'Bills with demand / kVA charges',
    contactSentence:
      "I used the Strategy Finder on your C&I Solar & Storage page — my recommended strategy is Demand Shaving. I'd like a free assessment.",
    tab: {
      iconBg: ICON_BG,
      title: 'Peak-Shaving — Cut Your kVA Charge',
      body: 'Demand (kVA) charges are billed on your highest power draw and are often the biggest line on a C&I bill. A battery discharges during short demand spikes to cap your notified maximum demand.',
      bullets: [
        'Automatically caps demand peaks in real time',
        'Cuts the R/kVA charge without changing operations',
        'Stacks with arbitrage on the same battery',
        'Detailed demand profiling during the assessment',
      ],
      imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.20) 0%, rgba(227,197,141,0.15) 100%)',
      imageEmoji: '📉',
    },
  },
  'backup-resilience': {
    key: 'backup-resilience',
    label: 'Backup & Resilience',
    icon: 'Zap',
    glyph: '🔋',
    bestFor: 'Uptime-critical sites; loadshedding hurts',
    contactSentence:
      "I used the Strategy Finder on your C&I Solar & Storage page — my priority is reliable backup / resilience. I'd like a free assessment.",
    tab: {
      iconBg: ICON_BG,
      title: 'Keep Running Through Loadshedding',
      body: 'A grid-tied hybrid sized for resilience keeps your critical loads live through outages, with seamless failover — and trims your bill from solar self-consumption as a bonus.',
      bullets: [
        'Sub-20ms UPS failover — no disruption',
        'Battery sized to your critical loads and outage length',
        'Solar recharges the battery between outages',
        'Optional generator integration for extended events',
      ],
      imageBg: 'linear-gradient(135deg, rgba(227,197,141,0.18) 0%, rgba(57,87,92,0.22) 100%)',
      imageEmoji: '🛡️',
    },
  },
  'off-grid': {
    key: 'off-grid',
    label: 'Off-Grid',
    icon: 'Globe',
    glyph: '🔌',
    bestFor: 'Weak/no grid; full independence',
    contactSentence:
      "I used the Strategy Finder on your C&I Solar & Storage page — my priority is energy independence (off-grid). I'd like a free assessment.",
    tab: {
      iconBg: ICON_BG,
      title: 'Full Energy Independence',
      body: 'For remote sites or businesses wanting off the grid entirely, solar plus a large battery (and an optional generator) delivers full independence from Eskom tariffs and outages.',
      bullets: [
        'Sized for 24/7 autonomy from solar + storage',
        'Optional generator for worst-case backup',
        'Immune to tariff hikes and loadshedding',
        'Feasibility and sizing confirmed on site',
      ],
      imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.22) 0%, rgba(112,157,169,0.18) 100%)',
      imageEmoji: '🔌',
    },
  },
};

export const STRATEGY_ORDER: StrategyKey[] = [
  'grid-tied-solar',
  'battery-arbitrage',
  'demand-shaving',
  'backup-resilience',
  'off-grid',
];

/** Build the Solution-section tabs from the strategies, in display order. */
export function strategyTabs(): TabItem[] {
  return STRATEGY_ORDER.map((k) => {
    const s = STRATEGIES[k];
    return {
      key: `strategy-${s.key}`,
      label: s.label,
      icon: s.icon,
      ...s.tab,
    };
  });
}

/** Contact "Tell us more" prefill text for a strategy key, or undefined if unknown. */
export function contactMessageForStrategy(key: string): string | undefined {
  return (STRATEGIES as Record<string, StrategyDef>)[key]?.contactSentence;
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/config/strategies.ts src/components/sections/SolutionTabs.tsx
git commit -m "feat(strategy): add strategies config and tab builder"
```

---

## Task 6: `SolutionTabs` deep-link (hash → open tab + scroll)

**Files:**
- Modify: `src/components/sections/SolutionTabs.tsx`

- [ ] **Step 1: Import `useRef` (if not already) and add the hash effect**

`useState`, `useEffect`, `useRef` are already imported at the top of the file. Inside the `SolutionTabs` component, after the existing `contentRefs` ref (around line 55), add a section ref:

```ts
  const sectionRef = useRef<HTMLElement | null>(null);
```

Then add this effect directly below the existing mobile-detection `useEffect` (around line 62):

```ts
  // Deep-link: when the URL hash matches a tab's key, open it and scroll into view.
  useEffect(() => {
    function applyHash() {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const idx = tabs.findIndex((t) => t.key === hash);
      if (idx === -1) return;
      setActiveTab(idx);
      setOpenIndex(idx);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      sectionRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [tabs]);
```

- [ ] **Step 2: Attach the ref to the section element**

Update the opening `<section>` tag (around line 85) to attach the ref:

```tsx
    <section ref={sectionRef} id={id} className="bg-white py-12 md:py-[52px]">
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors. (Existing verticals pass tabs without `key`, so `findIndex` never matches and behaviour is unchanged for them.)

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/SolutionTabs.tsx
git commit -m "feat(solution-tabs): open + scroll to a tab from URL hash"
```

---

## Task 7: Analytics events

**Files:**
- Modify: `src/lib/analytics.ts`

- [ ] **Step 1: Add the three strategy-finder events to the union**

In `src/lib/analytics.ts`, add these members to the `DlEvent` union (after the `tab_change` line):

```ts
  | { event: 'strategy_finder_start';    vertical: string }
  | { event: 'strategy_finder_complete'; vertical: string; goal: string; energy_rate: string; demand_charge: string; usage: string; strategy: string }
  | { event: 'strategy_learn_more';      vertical: string; strategy: string }
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/analytics.ts
git commit -m "feat(analytics): add strategy-finder events"
```

---

## Task 8: `StrategyFinder` wizard + reveal

**Files:**
- Create: `src/components/sections/StrategyFinder.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/sections/StrategyFinder.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dlPush } from '@/lib/analytics';
import { recommendStrategy } from '@/lib/strategy/recommendStrategy';
import { buildRationale } from '@/lib/strategy/rationale';
import { STRATEGIES } from '@/config/strategies';
import type {
  Goal, EnergyRate, DemandCharge, Usage, StrategyAnswers,
} from '@/lib/strategy/types';

const ACCENT = '#E3C58D';

type Step = 'goal' | 'energyRate' | 'demandCharge' | 'usage' | 'reveal';

interface Option<T> {
  value: T;
  label: string;
  hint?: string;
}

const GOAL_OPTIONS: Option<Goal>[] = [
  { value: 'cut-bill', label: '💰 Cut my electricity bill', hint: 'Lowest running cost is the priority.' },
  { value: 'backup', label: '🔋 Reliable backup', hint: 'Stay running through loadshedding and outages.' },
  { value: 'independence', label: '🔌 Energy independence', hint: 'Reduce or remove reliance on the grid entirely.' },
];

const ENERGY_OPTIONS: Option<EnergyRate>[] = [
  { value: 'flat', label: 'Flat rate, all year', hint: 'The same price per unit (c/kWh) at all times.' },
  { value: 'tou', label: 'Time-of-Use', hint: 'Price changes by time: peak, standard & off-peak.' },
  { value: 'block', label: 'Block / tiered', hint: 'Price per unit rises the more you use in a month.' },
  { value: 'unknown', label: "I don't know", hint: "No problem — we'll work it out together." },
];

const DEMAND_OPTIONS: Option<DemandCharge>[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: "I don't know" },
];

const USAGE_OPTIONS: Option<Usage>[] = [
  { value: 'daytime', label: '☀️ Mostly daytime', hint: 'Office or factory, roughly 8am–5pm.' },
  { value: 'around-clock', label: '🔁 Round the clock', hint: '24/7 operations, cold storage, plant.' },
  { value: 'evenings', label: '🌙 Evenings & nights', hint: 'Retail, hospitality, security.' },
];

function stepsFor(goal: Goal | null): Step[] {
  if (goal === 'backup' || goal === 'independence') return ['goal', 'usage', 'reveal'];
  if (goal === 'cut-bill') return ['goal', 'energyRate', 'demandCharge', 'usage', 'reveal'];
  return ['goal'];
}

function OptionList<T extends string>({
  options, selected, onSelect,
}: {
  options: Option<T>[];
  selected: T | undefined;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5" role="radiogroup">
      {options.map((opt) => {
        const isSel = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSel}
            onClick={() => onSelect(opt.value)}
            className="text-left rounded-xl px-4 py-3 transition-all duration-150"
            style={{
              border: `1px solid ${isSel ? ACCENT : 'rgba(255,255,255,0.14)'}`,
              background: isSel ? 'rgba(227,197,141,0.10)' : 'rgba(255,255,255,0.05)',
            }}
          >
            <span className="block font-body text-sm font-bold text-white">{opt.label}</span>
            {opt.hint && (
              <span className="block font-body text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {opt.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface StrategyFinderProps {
  vertical: string;
}

export function StrategyFinder({ vertical }: StrategyFinderProps) {
  const [answers, setAnswers] = useState<Partial<StrategyAnswers>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const steps = stepsFor(answers.goal ?? null);
  const current = steps[stepIndex];

  function advance() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function pickGoal(goal: Goal) {
    if (!started) {
      setStarted(true);
      dlPush({ event: 'strategy_finder_start', vertical });
    }
    // Changing goal resets downstream answers (the branch may change).
    setAnswers({ goal });
    setStepIndex(1);
  }

  function pickEnergy(energyRate: EnergyRate) {
    setAnswers((a) => ({ ...a, energyRate }));
    advance();
  }

  function pickDemand(demandCharge: DemandCharge) {
    setAnswers((a) => ({ ...a, demandCharge }));
    advance();
  }

  function pickUsage(usage: Usage) {
    setAnswers((a) => ({ ...a, usage }));
    advance();
  }

  const total = steps.length - 1; // exclude reveal from the progress count
  const progress = current === 'reveal' ? total : stepIndex;

  const isComplete = current === 'reveal' && answers.goal && answers.usage;
  const result = isComplete ? recommendStrategy(answers as StrategyAnswers) : null;

  // Fire the completion event when we land on the reveal step.
  useEffect(() => {
    if (current !== 'reveal' || !answers.goal || !answers.usage) return;
    const r = recommendStrategy(answers as StrategyAnswers);
    dlPush({
      event: 'strategy_finder_complete',
      vertical,
      goal: answers.goal,
      energy_rate: answers.energyRate ?? 'n/a',
      demand_charge: answers.demandCharge ?? 'n/a',
      usage: answers.usage,
      strategy: r.primary,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function onLearnMore(anchor: string, strategy: string) {
    dlPush({ event: 'strategy_learn_more', vertical, strategy });
    window.location.hash = anchor;
  }

  function restart() {
    setAnswers({});
    setStepIndex(0);
  }

  return (
    <section id="strategy-finder" className="bg-[#0d1f22] py-12 md:py-[52px]">
      <div className="page-container max-w-[680px]">
        <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-2" style={{ color: ACCENT }}>
          Find my strategy
        </p>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white mb-2">
          Not sure which approach fits you?
        </h2>
        <p className="font-body text-sm mb-7" style={{ color: 'rgba(255,255,255,0.6)' }}>
          A few quick questions — no bill needed. We&apos;ll point you to the strategy that suits you best.
        </p>

        {/* Progress bar */}
        {current !== 'reveal' && (
          <div className="flex gap-1.5 mb-6">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{ background: i <= progress ? ACCENT : 'rgba(255,255,255,0.14)' }}
              />
            ))}
          </div>
        )}

        {/* Steps */}
        {current === 'goal' && (
          <Question title="What matters most to you?">
            <OptionList options={GOAL_OPTIONS} selected={answers.goal} onSelect={pickGoal} />
          </Question>
        )}

        {current === 'energyRate' && (
          <Question title="How are you billed for the energy you use?" onBack={back}>
            <OptionList options={ENERGY_OPTIONS} selected={answers.energyRate} onSelect={pickEnergy} />
          </Question>
        )}

        {current === 'demandCharge' && (
          <Question
            title="Do you pay a demand (kVA) charge?"
            caption='A separate line billed on your highest power draw — often labelled "demand", "kVA" or "maximum demand".'
            onBack={back}
          >
            <OptionList options={DEMAND_OPTIONS} selected={answers.demandCharge} onSelect={pickDemand} />
          </Question>
        )}

        {current === 'usage' && (
          <Question title="When does your business use the most power?" onBack={back}>
            <OptionList options={USAGE_OPTIONS} selected={answers.usage} onSelect={pickUsage} />
          </Question>
        )}

        {/* Reveal */}
        {current === 'reveal' && result && (
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{ border: `1px solid ${ACCENT}66`, background: 'linear-gradient(180deg,#0d1f22,#13262a)' }}
            aria-live="polite"
          >
            <p className="font-body text-xs uppercase tracking-[0.12em] text-center mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Your recommended strategy
            </p>
            <p className="text-3xl text-center mb-2">
              {result.topology === 'off-grid' ? '🔌' : result.topology === 'solar-only' ? '☀️' : '☀️ + 🔋'}
            </p>
            <h3 className="font-display font-extrabold text-2xl text-center mb-3" style={{ color: ACCENT }}>
              {STRATEGIES[result.primary].label}
              {result.secondary.map((s) => ` & ${STRATEGIES[s].label}`).join('')}
            </h3>
            <p className="font-body text-sm text-center leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {buildRationale(answers as StrategyAnswers, result)}
            </p>

            <button
              type="button"
              onClick={() => onLearnMore(result.tabAnchor, result.primary)}
              className="block w-full rounded-full py-3 font-display font-bold text-sm mb-2"
              style={{ background: ACCENT, color: '#3a2c08' }}
            >
              Read about {STRATEGIES[result.primary].label} →
            </button>

            {result.secondary.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onLearnMore(`strategy-${s}`, s)}
                className="block w-full text-center font-body text-xs underline mb-2"
                style={{ color: ACCENT }}
              >
                Also relevant: {STRATEGIES[s].label} →
              </button>
            ))}

            <Link
              href={`/contact?intent=client&strategy=${result.primary}`}
              className="block w-full rounded-full py-3 font-display font-bold text-sm text-center mt-3"
              style={{ background: '#F5F5F5', color: '#0d1f22' }}
            >
              Get my free assessment →
            </Link>

            <button
              type="button"
              onClick={restart}
              className="block w-full text-center font-body text-xs mt-4"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              ↺ Start over
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Question({
  title, caption, onBack, children,
}: {
  title: string;
  caption?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
          >
            ←
          </button>
        )}
        <h3 className="font-display font-extrabold text-xl text-white">{title}</h3>
      </div>
      {caption && (
        <p className="font-body text-xs mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {caption}
        </p>
      )}
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/StrategyFinder.tsx
git commit -m "feat(strategy): add StrategyFinder wizard and reveal"
```

---

## Task 9: `FinancingBand` section

**Files:**
- Create: `src/components/sections/FinancingBand.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/sections/FinancingBand.tsx`:

```tsx
import { FinancingCards } from './FinancingCards';

export function FinancingBand() {
  return (
    <section className="bg-[#F5F5F5] py-12 md:py-[52px]">
      <div className="page-container">
        <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280] mb-2">
          How to fund it
        </p>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] mb-6 max-w-xl">
          Own it, or zero upfront — works with any strategy
        </h2>
        <FinancingCards />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/FinancingBand.tsx
git commit -m "feat(solution): add standalone financing band"
```

---

## Task 10: `SolutionHero` secondary link

**Files:**
- Modify: `src/components/sections/SolutionHero.tsx`

- [ ] **Step 1: Add the optional prop to the interface**

In `src/components/sections/SolutionHero.tsx`, add to `SolutionHeroProps` (after `primaryCta`):

```ts
  secondaryLink?: { label: string; href: string }; // e.g. anchor to the strategy finder
```

- [ ] **Step 2: Destructure it**

Add `secondaryLink,` to the destructured props in the function signature (after `primaryCta,`).

- [ ] **Step 3: Render it under the primary button**

Replace the primary `<Button>` block (around lines 105–107) with:

```tsx
            <Button variant="light" href={primaryCta.href}>
              {primaryCta.label}
            </Button>

            {secondaryLink && (
              <a
                href={secondaryLink.href}
                className="block mt-4 font-body text-sm underline transition-colors"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {secondaryLink.label}
              </a>
            )}
```

- [ ] **Step 4: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors. (Other verticals don't pass `secondaryLink`, so nothing renders for them.)

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/SolutionHero.tsx
git commit -m "feat(solution-hero): optional secondary link under the CTA"
```

---

## Task 11: Wire up the C&I Solar page

**Files:**
- Modify: `src/app/solutions/ci-solar-storage/page.tsx`

- [ ] **Step 1: Update imports**

In `src/app/solutions/ci-solar-storage/page.tsx`, remove the `SolarCalculator` import (line 9) and add the new ones. The import block should include:

```ts
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { StrategyFinder } from '@/components/sections/StrategyFinder';
import { FinancingBand } from '@/components/sections/FinancingBand';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { strategyTabs } from '@/config/strategies';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
```

(Note: the local `TabItem` import and the hand-written `tabs` array are removed — see next step.)

- [ ] **Step 2: Delete the hand-written `tabs` array**

Delete the entire `const tabs: TabItem[] = [ ... ];` block (lines 29–61) and the `import type { TabItem }` line. The tabs now come from `strategyTabs()`.

- [ ] **Step 3: Build the tabs inside the component**

Inside `CiSolarStoragePage`, after the existing `const hero = ...` line, add:

```ts
  const tabs = strategyTabs();
```

- [ ] **Step 4: Update the hero — remove the calculator child, add the secondary link**

Replace the `<SolutionHero …> <SolarCalculator /> </SolutionHero>` block with this self-closing hero (no children):

```tsx
      <SolutionHero
        title="Cut your electricity bill by <em>up to 60%</em>"
        subtitle="Commercial and industrial solar and battery storage — zero upfront capital with our PPA model."
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1a3a3f 50%, #2d5c63 100%)"
        primaryCta={{ label: 'Get a Free Assessment', href: '/contact' }}
        secondaryLink={{ label: 'Not sure what you need? Find your strategy ↓', href: '#strategy-finder' }}
      />
```

- [ ] **Step 5: Add the finder and financing band into the page body**

The render order between the hero and `HowItWorks` becomes: `StrategyFinder`, `SolutionTabs`, `FinancingBand`. Update that section so it reads:

```tsx
      <StrategyFinder vertical={vertical} />
      <SolutionTabs tabs={tabs} accent={meta.accent} vertical="ci-solar-storage" />
      <FinancingBand />
      {howItWorks && <HowItWorks {...howItWorks} />}
      <FeaturedProjects vertical={vertical} />
      <RelatedArticles vertical={vertical} />
```

- [ ] **Step 6: Type-check, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: no errors; the page compiles.

- [ ] **Step 7: Manual verification in the browser**

Run: `npm run dev`, open `http://localhost:3000/solutions/ci-solar-storage`. Verify:
- Hero shows the CTA + "Find your strategy ↓" link; no calculator card.
- Clicking the link scrolls to the finder.
- Goal "Reliable backup" → 2 questions (goal → usage) → reveal shows "Backup & Resilience".
- Goal "Cut my bill" → demand charge Yes + Time-of-Use → reveal shows "Demand Shaving & Battery Arbitrage".
- "Read about …" scrolls down and opens the matching strategy tab.
- Financing band (CapEx/OpEx) appears below the tabs.

- [ ] **Step 8: Commit**

```bash
git add src/app/solutions/ci-solar-storage/page.tsx
git commit -m "feat(solar): replace in-hero calculator with Strategy Finder + strategy tabs"
```

---

## Task 12: Contact form prefill from URL

**Files:**
- Modify: `src/components/sections/ContactForm.tsx`

- [ ] **Step 1: Add imports**

At the top of `src/components/sections/ContactForm.tsx`, update the React import and add the config import:

```ts
import { useState, useEffect } from 'react';
import { contactMessageForStrategy } from '@/config/strategies';
```

- [ ] **Step 2: Add the prefill effect**

Inside the `ContactForm` component, after the `const [fields, setFields] = useState(...)` block, add:

```ts
  // Prefill from the Strategy Finder deep-link: /contact?intent=client&strategy=<key>
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qsIntent = params.get('intent');
    const qsStrategy = params.get('strategy');

    const validIntent = INTENTS.find((i) => i.value === qsIntent);
    if (validIntent) {
      setIntent(validIntent.value);
      setStep(2);
    }
    if (qsStrategy) {
      const message = contactMessageForStrategy(qsStrategy);
      if (message) setFields((prev) => ({ ...prev, message }));
    }
  }, []);
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual verification**

Run `npm run dev`, open `http://localhost:3000/contact?intent=client&strategy=demand-shaving`. Verify:
- The form opens on step 2 ("Tell us about your business").
- The "Tell us more" box is pre-filled with the Demand Shaving sentence and is editable.
- Opening `/contact` with no params behaves exactly as before (step 1, empty message).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ContactForm.tsx
git commit -m "feat(contact): prefill intent and message from strategy deep-link"
```

---

## Task 13: Delete the unused `SolarCalculator`

**Files:**
- Delete: `src/components/sections/calculators/SolarCalculator.tsx`

- [ ] **Step 1: Confirm there are no remaining references**

Run: `git grep -n "SolarCalculator"`
Expected: no results (the CI page no longer imports it).

- [ ] **Step 2: Delete the file**

```bash
git rm src/components/sections/calculators/SolarCalculator.tsx
```

- [ ] **Step 3: Type-check, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(solar): remove unused SolarCalculator"
```

---

## Task 14: Final verification

- [ ] **Step 1: Run the full check suite**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: tests pass; no type, lint, or build errors.

- [ ] **Step 2: Regression-check another vertical**

Run `npm run dev`, open `http://localhost:3000/solutions/wheeling`. Verify its calculator, tabs (including Financing), and layout are unchanged — confirming the shared-component edits were non-breaking.

- [ ] **Step 3: Update the spec's open item #3 (optional housekeeping)**

If desired, update `specs/07-SOLUTIONS.md` to note the CI page now uses the Strategy Finder and strategy-based tabs (financing as its own band). This is documentation only.

---

## Notes for the implementer

- **No `any`, named exports only, Tailwind tokens** — per the repo's core rules in `CLAUDE.md`.
- **Scope discipline:** only the CI Solar page changes behaviour. `SolutionTabs`, `SolutionHero`, `ContactForm`, and `analytics.ts` are edited additively; the other five verticals must remain visually and functionally identical (Task 14, Step 2 confirms this).
- **Deep-link mechanism:** the reveal sets `window.location.hash = 'strategy-<key>'`; `SolutionTabs` listens for `hashchange`, matches a tab by `key`, opens it, and scrolls. Both components live on the same page, so no shared state is needed.
- **`StrategyResult.rationale`:** the spec listed `rationale` on `StrategyResult`; the implementation keeps selection (`recommendStrategy`) and copy (`buildRationale`) as separate pure functions for cleaner tests. The reveal composes them. This is the only intentional deviation from the spec's type sketch.
```

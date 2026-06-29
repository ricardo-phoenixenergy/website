# WeBuySolar EaaS Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/solutions/webuysolar` as an Energy-as-a-Service "acquire & operate" (sale-and-PPA-back) page, reusing the existing design system and adding five small presentational components.

**Architecture:** All page copy lives in one config (`src/config/webuysolarContent.ts`). Five new presentational components (`ExplainerCards`, `DealExchange`, `ComparisonTable`, `PullQuote`, `FaqAccordion`) compose from existing primitives (`Card`, `Button`, `AnimatedSection`, `Icons`). Two shared components get backward-compatible optional props (`SolutionHero.secondaryCta`, `ContactForm` generic `message` param). The page (`page.tsx`) is recomposed to wire sections in order and emit four JSON-LD blocks. The standalone `/tools` valuation tool and the other five verticals are untouched.

**Tech Stack:** Next.js App Router, TypeScript (strict), Tailwind (custom tokens), Framer Motion (via `AnimatedSection`).

**Design spec:** `docs/superpowers/specs/2026-06-29-webuysolar-eaas-redesign-design.md`

## Global Constraints

Every task implicitly includes these:

- **TypeScript strict** — no `any`; every prop/interface typed.
- **Named exports only** — no default exports from component files (page files use the framework's default export as usual).
- **Tokens only** — bg `#F5F5F5`, white `#FFFFFF`, primary teal `#39575C`, dusty blue `#709DA9`, text `#1A1A1A`, secondary text `#374151`/`#6B7280`, border `#E5E7EB`, dark `#0d1f22`. **WeBuySolar accent = Warm Copper `#C97A40`** (use `meta.accent`, never hardcode in the page).
- **Fonts** — `font-display` (Plus Jakarta Sans) for all headings, `font-body` (Inter) for copy.
- **Accent is subtle** — 3px bars / dots / arrows / 5–18% tints; never a dominant fill.
- **No dark mode. No new npm dependencies. `next/image` with blur for photos.**
- **One `<h1>`** on the page (the hero). Sections use `<h2>`, cards `<h3>`.
- **Copy rules** — list/bullet items end with a full stop. No fabricated stats. Single settlement timeline (process step 5 only). No "removal / decommissioning / cash in 14 days" framing except the FAQ relocation path.
- **Testing model** — this project has **no unit-test harness**; do not add one (YAGNI, matches the codebase). Each task's verification is `npx tsc --noEmit` (clean) + `npm run lint` (clean on touched files) plus the stated manual/visual check. Commit after each task.

---

## File structure

**New**
- `src/config/webuysolarContent.ts` — all page copy + typed content object.
- `src/components/sections/ExplainerCards.tsx` — generic icon+title+body card-grid section (powers §1b win-cards, §3, §4, §6).
- `src/components/sections/DealExchange.tsx` — sale-and-PPA-back exchange diagram (`compact` for hero, `full` for §1b).
- `src/components/sections/ComparisonTable.tsx` — semantic old-vs-new HTML table (§5).
- `src/components/sections/PullQuote.tsx` — accented blockquote block (§4 footer).
- `src/components/sections/FaqAccordion.tsx` — accordion + emits `FAQPage` JSON-LD (§9).

**Modified**
- `src/components/sections/SolutionHero.tsx` — add optional `secondaryCta`.
- `src/components/sections/ContactForm.tsx` — read a generic `?message=` query param.
- `src/config/verticals.ts` — rewrite `webuysolar` SEO + empty its `stats`.
- `src/app/solutions/webuysolar/page.tsx` — full recompose.

**Unchanged**
- `WeBuySolarCalculator.tsx`, `SolutionTabs.tsx`, `HowItWorks.tsx`, the `/tools` valuation tool, the other five solution pages.

---

## Task 1: Content config

**Files:**
- Create: `src/config/webuysolarContent.ts`

**Interfaces:**
- Consumes: `ExplainerCardItem` (Task 2), `ComparisonRow` (Task 4), `FaqItem` (Task 6) — **these are imported as `type` only; Task 1 may be written before them but won't type-check until those files exist. Implement Tasks 2/4/6 first if executing strictly in order, OR stub the three type imports as inline shapes and replace once those tasks land.** Recommended order: 2 → 4 → 6 → 1.
- Produces: `WEBUYSOLAR` constant consumed by Task 9 (page).

- [ ] **Step 1: Create the config file with the full content object**

```ts
// src/config/webuysolarContent.ts
import type { ExplainerCardItem } from '@/components/sections/ExplainerCards';
import type { ComparisonRow } from '@/components/sections/ComparisonTable';
import type { FaqItem } from '@/components/sections/FaqAccordion';

interface ProcessStep {
  label: string;
  description: string;
  tag?: string;
}

interface WebuysolarContent {
  hero: { title: string; subtitle: string };
  auditPrefill: string;
  deal: { heading: string; intro: string; winCards: ExplainerCardItem[] };
  whyNow: { eyebrow: string; heading: string; intro: string; cards: ExplainerCardItem[] };
  valueLost: { heading: string; intro: string; cards: ExplainerCardItem[]; pullQuote: string };
  comparison: { heading: string; columns: [string, string, string]; rows: ComparisonRow[] };
  difference: { heading: string; intro: string; cards: ExplainerCardItem[] };
  process: { title: string; steps: ProcessStep[] };
  audit: { heading: string; subtitle: string; deliverables: string[] };
  faq: { heading: string; items: FaqItem[] };
  finalCta: { eyebrow: string; heading: string; body: string };
}

export const WEBUYSOLAR: WebuysolarContent = {
  hero: {
    title: 'Sell your commercial solar system and <em>keep its power for less than the grid.</em>',
    subtitle:
      "Sell us your existing commercial solar or battery system for a fair cash sum, then buy back the power it produces under a flexible PPA. The system never moves. You free up capital, keep your savings, and hand the running of it to specialists who'll make it earn more than it does now.",
  },

  auditPrefill:
    "I'd like to book a free WeBuySolar audit of my existing solar / battery system.",

  deal: {
    heading: 'Sold, but never gone.',
    intro:
      "It's a sale-and-PPA-back. You sell us the system for cash, we take over ownership and running it, and you keep buying the power it makes — for less than the grid charges. The panels never leave your roof.",
    winCards: [
      {
        icon: 'DollarSign',
        title: 'Capital back.',
        body: 'Recoup the money tied up in a depreciating roof asset — redeploy it in your core business.',
      },
      {
        icon: 'TrendingUp',
        title: 'Savings kept.',
        body: 'Your power stays cheaper than the grid. The asset becomes a clean opex line, not a maintenance headache.',
      },
      {
        icon: 'ClipboardCheck',
        title: 'Risk gone.',
        body: 'Performance, O&M and obsolescence become our problem. You stop managing something that was never your core business.',
      },
    ],
  },

  whyNow: {
    eyebrow: 'Why now',
    heading: 'The economics of C&I solar have changed.',
    intro:
      "Commercial solar has been a sound investment for a decade. But three structural shifts have changed what your asset is worth — and who's positioned to capture that value.",
    cards: [
      {
        icon: 'Battery',
        title: 'Battery economics flipped.',
        body: 'C&I battery prices are down ~40% in two years, and the same hardware bought for backup now earns daily through time-of-use arbitrage, peak shaving and solar-consumption optimisation. Systems without batteries leave value on the table; systems using batteries only for backup leave even more.',
      },
      {
        icon: 'Globe',
        title: 'The market liberalised.',
        body: 'Wheeling, multi-site aggregation, licensed traders and the upcoming SAWEM wholesale market (Q3 2026) turn business energy from a passive grid bill into an active, optimisable position. A standalone system is now just one node in a much bigger picture.',
      },
      {
        icon: 'Activity',
        title: 'Operations became the differentiator.',
        body: "Active battery dispatch, performance benchmarking, energy trading and tariff optimisation are how value is captured now — and they need dedicated expertise that didn't exist in deployable form when most systems were installed.",
      },
    ],
  },

  valueLost: {
    heading: "The cost of running yesterday's system in today's market.",
    intro:
      "Across the C&I solar owners we work with, three patterns recur. None are technology failures — they're failures of operational context.",
    cards: [
      {
        icon: 'Activity',
        title: 'Silent underperformance.',
        body: 'Inverter clipping, soiling, module mismatch and suboptimal tilt compound quietly. Without operator-grade monitoring, a system producing 78% of its potential looks identical to one at 92%. The difference is enormous.',
      },
      {
        icon: 'Users',
        title: 'No one owns the solar asset.',
        body: "It's usually run by a site manager whose real job is something else, or by the installer under an uptime-focused O&M contract. Both leave value on the table — for different reasons.",
      },
      {
        icon: 'Clock',
        title: 'Designed for a market that no longer exists.',
        body: 'Systems sized in 2021–22 assumed no wheeling, no affordable storage, no smart optimisation. The assumptions were right then. Every month they run unchanged now, they forfeit revenue.',
      },
    ],
    pullQuote:
      "The investment was right. The question now is who's positioned to operate it for the market that exists.",
  },

  comparison: {
    heading: "Your solar asset hasn't changed. Everything around it has.",
    columns: ['Dimension', 'The old model', 'The new model'],
    rows: [
      {
        dimension: 'Where value is created',
        oldModel: 'The technology brand on the spec sheet',
        newModel: 'Configuration & operation — same hardware, materially better lifetime savings',
      },
      {
        dimension: 'Supplier relationship',
        oldModel: 'Transactional installer ("I install, the deal closes")',
        newModel: 'Energy-as-a-Service provider — we supply the power and own energy as an ongoing function',
      },
      {
        dimension: 'System management',
        oldModel: 'Static — sized once, run as designed',
        newModel: 'Dynamic — responsive to tariffs, load shifts and market signals',
      },
      {
        dimension: 'Capital structure',
        oldModel: 'Outright cash purchase',
        newModel: 'Zero-capex PPA or lease — recoup your capital today',
      },
      {
        dimension: 'Market integration',
        oldModel: 'Standalone behind-the-meter',
        newModel: 'Integrated: solar, storage, wheeling and trading as one optimised whole',
      },
    ],
  },

  difference: {
    heading: 'Built for the new energy market.',
    intro:
      'Phoenix Energy is a C&I energy partner — not a solar installer, not an energy fund. We acquire, operate and continuously optimise existing assets for businesses serious about their energy future.',
    cards: [
      {
        icon: 'ClipboardCheck',
        title: 'Acquire & operate.',
        body: 'We take over assets from owners ready to let specialists run them. Clean handover, measurably better outcomes.',
      },
      {
        icon: 'DollarSign',
        title: 'Transparent, fair valuations.',
        body: 'Fair market value, flexible PPAs and leases, bespoke capex-free arrangements. No headline 100% or 110% buyback offers funded by inflated PPAs and high escalations. The model that works for you now and going forward.',
      },
      {
        icon: 'Monitor',
        title: 'Analyse & optimise.',
        body: 'Proprietary tools run continuous performance analysis on every asset, surfacing revenue leakage standard reporting misses — then reconfiguring to capture it.',
      },
      {
        icon: 'TrendingUp',
        title: 'Build for what’s next.',
        body: 'We evolve your system as the market does, so it gets more valuable over time instead of ageing out.',
      },
    ],
  },

  process: {
    title: 'The path from owned to operated, in six steps.',
    steps: [
      {
        label: 'Free expert audit',
        description: 'On-site inspection: drone scan, string-level review, inverter config audit, opportunity mapping. Written report within 10 business days.',
        tag: 'Free · no obligation',
      },
      {
        label: 'Preliminary offer & valuation',
        description: 'Fair market valuation, indicative PPA or lease, and a forecasted savings model with an optimisation roadmap.',
        tag: 'Indicative',
      },
      {
        label: 'Due diligence',
        description: 'At our cost: financials, asset docs, contracts, operational data.',
        tag: 'At our cost',
      },
      {
        label: 'Final offer & contracting',
        description: 'Binding term sheet, PPA/lease and sale agreement. Either side can step back here, no obligation.',
        tag: 'No obligation',
      },
      {
        label: 'Acquisition & handover',
        description: 'Ownership transfers, the acquisition value is paid out, and we take operational responsibility from day one with monthly reporting. Settlement on the agreed date in the sale agreement.',
        tag: 'Settlement on agreed date',
      },
      {
        label: 'Ongoing optimisation',
        description: 'We operate and upgrade as economics evolve. Each upgrade is justified by its own ROI; none committed upfront.',
        tag: 'ROI-justified',
      },
    ],
  },

  audit: {
    heading: 'Start with the audit. Decide everything else later.',
    subtitle: 'A free, independent, operator-grade audit of your existing system. No cost. No commitment.',
    deliverables: [
      'Inverter configuration & clipping review.',
      'System production review.',
      'Battery dispatch analysis (where applicable).',
      'Tariff structure & electricity bill review.',
      'Quantified estimate of unrealised value.',
      'System valuation quote.',
      'Preliminary PPA/lease commercial offer.',
      'Tailored energy optimisation roadmap.',
    ],
  },

  faq: {
    heading: 'Questions, answered.',
    items: [
      {
        question: 'Do you remove the system, or does it stay where it is?',
        answer: "It stays on your roof and keeps operating exactly as before — that's the whole point. If you're relocating or closing the site and genuinely need it removed, we'll discuss a removal or buyout separately.",
      },
      {
        question: 'What brands and sizes do you accept?',
        answer: 'All major inverter and module brands, from small commercial arrays up to multi-megawatt systems, with or without battery storage. Condition and configuration are assessed in the audit.',
      },
      {
        question: 'How do you calculate the valuation?',
        answer: "Fair market value based on the system's condition, production and the savings it can generate under active operation — not an inflated headline buyback funded by a high PPA tariff.",
      },
      {
        question: 'PPA, lease or outright sale — which do I get?',
        answer: 'Whichever fits your balance sheet. We structure a fair-market sale with a flexible PPA or lease back; bespoke capex-free arrangements are available.',
      },
      {
        question: 'What does it cost me?',
        answer: 'The audit is free. Due diligence is at our cost. You only commit at final contracting, and either side can step back before then.',
      },
      {
        question: "How long until I'm paid?",
        answer: 'On the settlement date agreed in the sale agreement, once contracting and handover are complete.',
      },
      {
        question: "What happens to my site manager's involvement?",
        answer: 'We take operational responsibility from day one, with monthly reporting. Your team stops managing something that was never their core job.',
      },
      {
        question: 'Is there any obligation after the audit?',
        answer: 'None. The audit and its report are yours to keep, with no obligation to proceed.',
      },
    ],
  },

  finalCta: {
    eyebrow: 'Start today',
    heading: 'Ready to find out what your system is really worth?',
    body: 'Book a free, operator-grade audit of your existing solar or battery system. No cost, no commitment — just a clear picture of what it could earn under active operation.',
  },
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean (assuming Tasks 2/4/6 are done; if not, the three `import type` lines will error — implement those first).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors for `src/config/webuysolarContent.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/config/webuysolarContent.ts
git commit -m "feat(webuysolar): add EaaS page content config"
```

---

## Task 2: ExplainerCards component

**Files:**
- Create: `src/components/sections/ExplainerCards.tsx`

**Interfaces:**
- Consumes: `Card`, `CardBody` from `@/components/ui/Card`; `AnimatedSection`; icon components from `@/components/ui/Icons`.
- Produces: `ExplainerCards` component; exported types `ExplainerIcon`, `ExplainerCardItem`, `ExplainerCardsProps`. `ExplainerCardItem` is imported by Task 1 and Task 9.

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/ExplainerCards.tsx
import type { ReactNode } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import {
  IconSun, IconBattery, IconDollarSign, IconLeaf, IconGlobe,
  IconActivity, IconThermometer, IconBuilding, IconMonitor, IconZap,
  IconClipboardCheck, IconTrendingUp, IconUsers, IconLayers, IconClock,
} from '@/components/ui/Icons';

export type ExplainerIcon =
  | 'Sun' | 'Battery' | 'DollarSign' | 'Leaf' | 'Globe' | 'Activity'
  | 'Thermometer' | 'Building' | 'Monitor' | 'Zap' | 'ClipboardCheck'
  | 'TrendingUp' | 'Users' | 'Layers' | 'Clock';

const ICONS: Record<ExplainerIcon, (s: number) => ReactNode> = {
  Sun: (s) => <IconSun size={s} />,
  Battery: (s) => <IconBattery size={s} />,
  DollarSign: (s) => <IconDollarSign size={s} />,
  Leaf: (s) => <IconLeaf size={s} />,
  Globe: (s) => <IconGlobe size={s} />,
  Activity: (s) => <IconActivity size={s} />,
  Thermometer: (s) => <IconThermometer size={s} />,
  Building: (s) => <IconBuilding size={s} />,
  Monitor: (s) => <IconMonitor size={s} />,
  Zap: (s) => <IconZap size={s} />,
  ClipboardCheck: (s) => <IconClipboardCheck size={s} />,
  TrendingUp: (s) => <IconTrendingUp size={s} />,
  Users: (s) => <IconUsers size={s} />,
  Layers: (s) => <IconLayers size={s} />,
  Clock: (s) => <IconClock size={s} />,
};

export interface ExplainerCardItem {
  icon: ExplainerIcon;
  title: string;
  body: string;
}

export interface ExplainerCardsProps {
  eyebrow?: string;
  heading?: string;   // supports <em> for accent
  subtitle?: string;
  cards: ExplainerCardItem[];
  columns?: 3 | 4;
  accent?: string;
  background?: 'gray' | 'white';
  /** Optional rich content rendered between the header and the card grid (e.g. a diagram). */
  lead?: ReactNode;
  /** Optional content rendered after the card grid (e.g. a pull-quote). */
  footer?: ReactNode;
  id?: string;
}

function renderHeading(raw: string, accent: string) {
  return raw.split(/(<em>.*?<\/em>)/g).map((part, i) => {
    const m = part.match(/^<em>(.*)<\/em>$/);
    return m
      ? <em key={i} style={{ color: accent, fontStyle: 'normal' }}>{m[1]}</em>
      : <span key={i}>{part}</span>;
  });
}

export function ExplainerCards({
  eyebrow,
  heading,
  subtitle,
  cards,
  columns = 3,
  accent = '#C97A40',
  background = 'gray',
  lead,
  footer,
  id,
}: ExplainerCardsProps) {
  return (
    <section
      id={id}
      className={`${background === 'white' ? 'bg-white' : 'bg-[#F5F5F5]'} py-16 md:py-24`}
    >
      <div className="page-container">
        {(eyebrow || heading || subtitle) && (
          <AnimatedSection className="max-w-2xl mb-9">
            {eyebrow && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: accent }}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2] mb-3">
                {renderHeading(heading, accent)}
              </h2>
            )}
            {subtitle && (
              <p className="font-body text-sm md:text-base leading-[1.75] text-[#6B7280]">
                {subtitle}
              </p>
            )}
          </AnimatedSection>
        )}

        {lead}

        <div className={`grid gap-4 ${columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
          {cards.map((c, i) => (
            <AnimatedSection key={c.title} delay={i * 0.08}>
              <Card variant="light" pattern={3} className="h-full">
                <div className="h-[3px]" style={{ background: accent }} />
                <CardBody padding="lg">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${accent}1F`, color: accent }}
                  >
                    {ICONS[c.icon](20)}
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-[#1A1A1A] mb-2 leading-tight">
                    {c.title}
                  </h3>
                  <p className="font-body text-sm text-[#374151] leading-[1.7]">
                    {c.body}
                  </p>
                </CardBody>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        {footer}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors for the new file.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ExplainerCards.tsx
git commit -m "feat(webuysolar): add ExplainerCards section component"
```

---

## Task 3: DealExchange component

**Files:**
- Create: `src/components/sections/DealExchange.tsx`

**Interfaces:**
- Consumes: `IconArrowRight, IconSun, IconDollarSign, IconZap, IconClipboardCheck` from `@/components/ui/Icons`.
- Produces: `DealExchange` component + `DealExchangeProps`. Consumed by Task 9.

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/DealExchange.tsx
import type { ReactNode } from 'react';
import {
  IconArrowRight, IconSun, IconDollarSign, IconZap, IconClipboardCheck,
} from '@/components/ui/Icons';

const ACCENT = '#C97A40';

interface FlowRow {
  from: string;
  to: string;
  label: string;
  icon: (s: number) => ReactNode;
}

const ONE_TIME: FlowRow[] = [
  { from: 'You', to: 'Phoenix', label: 'Your solar / battery system.', icon: (s) => <IconSun size={s} /> },
  { from: 'Phoenix', to: 'You', label: 'A fair-market cash sum.', icon: (s) => <IconDollarSign size={s} /> },
];

const ONGOING: FlowRow[] = [
  { from: 'System', to: 'You', label: 'Clean power, exactly as before.', icon: (s) => <IconZap size={s} /> },
  { from: 'You', to: 'Phoenix', label: 'A PPA payment below your grid tariff.', icon: (s) => <IconDollarSign size={s} /> },
  { from: 'Phoenix', to: 'System', label: 'Active management, optimisation, dispatch & trading.', icon: (s) => <IconClipboardCheck size={s} /> },
];

export interface DealExchangeProps {
  variant: 'compact' | 'full';
}

export function DealExchange({ variant }: DealExchangeProps) {
  const dark = variant === 'compact';
  return (
    <div
      className="rounded-2xl p-5 md:p-6"
      style={
        dark
          ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }
          : { background: '#ffffff', border: '1px solid #E5E7EB' }
      }
    >
      <FlowBlock kicker="One-time exchange" rows={ONE_TIME} dark={dark} />
      <div
        className="my-4 border-t border-dashed"
        style={{ borderColor: dark ? 'rgba(255,255,255,0.14)' : '#E5E7EB' }}
      />
      <FlowBlock kicker="Then, ongoing" rows={ONGOING} dark={dark} />
    </div>
  );
}

function FlowBlock({ kicker, rows, dark }: { kicker: string; rows: FlowRow[]; dark: boolean }) {
  const muted = dark ? 'rgba(255,255,255,0.55)' : '#6B7280';
  const text = dark ? '#ffffff' : '#1A1A1A';
  return (
    <div>
      <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ACCENT }}>
        {kicker}
      </p>
      <ul className="flex flex-col gap-3">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start gap-3">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: dark ? 'rgba(201,122,64,0.18)' : 'rgba(201,122,64,0.12)', color: ACCENT }}
            >
              {r.icon(16)}
            </span>
            <span className="flex flex-col">
              <span className="flex items-center gap-1.5 font-body text-xs font-semibold" style={{ color: muted }}>
                {r.from}
                <IconArrowRight size={12} className="opacity-70" />
                <span style={{ color: text }}>{r.to}</span>
              </span>
              <span className="font-body text-xs leading-[1.5]" style={{ color: muted }}>
                {r.label}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/DealExchange.tsx
git commit -m "feat(webuysolar): add DealExchange sale-and-PPA-back diagram"
```

---

## Task 4: ComparisonTable component

**Files:**
- Create: `src/components/sections/ComparisonTable.tsx`

**Interfaces:**
- Consumes: `AnimatedSection`.
- Produces: `ComparisonTable` component + `ComparisonRow`, `ComparisonTableProps`. `ComparisonRow` imported by Task 1 and Task 9.

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/ComparisonTable.tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export interface ComparisonRow {
  dimension: string;
  oldModel: string;
  newModel: string;
}

export interface ComparisonTableProps {
  eyebrow?: string;
  heading?: string;   // supports <em>
  columns: [string, string, string];
  rows: ComparisonRow[];
  accent?: string;
  id?: string;
}

function renderHeading(raw: string, accent: string) {
  return raw.split(/(<em>.*?<\/em>)/g).map((part, i) => {
    const m = part.match(/^<em>(.*)<\/em>$/);
    return m
      ? <em key={i} style={{ color: accent, fontStyle: 'normal' }}>{m[1]}</em>
      : <span key={i}>{part}</span>;
  });
}

export function ComparisonTable({
  eyebrow,
  heading,
  columns,
  rows,
  accent = '#C97A40',
  id,
}: ComparisonTableProps) {
  return (
    <section id={id} className="bg-[#F5F5F5] py-16 md:py-24">
      <div className="page-container">
        {(eyebrow || heading) && (
          <AnimatedSection className="max-w-2xl mb-9">
            {eyebrow && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: accent }}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2]">
                {renderHeading(heading, accent)}
              </h2>
            )}
          </AnimatedSection>
        )}

        <AnimatedSection className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white">
          <table className="w-full border-collapse min-w-[680px]">
            <thead>
              <tr>
                <th className="text-left font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] py-4 px-5 w-[20%]">
                  {columns[0]}
                </th>
                <th className="text-left font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] py-4 px-5">
                  {columns[1]}
                </th>
                <th className="text-left font-body text-xs font-bold uppercase tracking-[0.1em] py-4 px-5" style={{ color: accent }}>
                  {columns[2]}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.dimension} className="border-t border-[#E5E7EB]">
                  <td className="align-top py-4 px-5 font-display font-bold text-sm text-[#1A1A1A]">
                    {r.dimension}
                  </td>
                  <td className="align-top py-4 px-5 font-body text-sm text-[#6B7280] leading-[1.6]">
                    {r.oldModel}
                  </td>
                  <td className="align-top py-4 px-5 font-body text-sm text-[#1A1A1A] leading-[1.6]" style={{ background: `${accent}0D` }}>
                    {r.newModel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AnimatedSection>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.
- [ ] **Step 3: Lint** — Run: `npm run lint` — Expected: no errors.
- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ComparisonTable.tsx
git commit -m "feat(webuysolar): add ComparisonTable section component"
```

---

## Task 5: PullQuote component

**Files:**
- Create: `src/components/sections/PullQuote.tsx`

**Interfaces:**
- Consumes: `AnimatedSection`.
- Produces: `PullQuote` component + `PullQuoteProps`. Rendered inside Task 9's §4 `footer` slot — **it is a plain block, NOT its own `<section>`**, so it nests inside `ExplainerCards`.

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/PullQuote.tsx
import type { ReactNode } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export interface PullQuoteProps {
  children: ReactNode;
  accent?: string;
}

export function PullQuote({ children, accent = '#C97A40' }: PullQuoteProps) {
  return (
    <AnimatedSection className="max-w-3xl mt-12">
      <blockquote
        className="font-display font-extrabold text-xl md:text-2xl text-[#1A1A1A] leading-[1.4] pl-5"
        style={{ borderLeft: `3px solid ${accent}` }}
      >
        {children}
      </blockquote>
    </AnimatedSection>
  );
}
```

- [ ] **Step 2: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.
- [ ] **Step 3: Lint** — Run: `npm run lint` — Expected: no errors.
- [ ] **Step 4: Commit**

```bash
git add src/components/sections/PullQuote.tsx
git commit -m "feat(webuysolar): add PullQuote block component"
```

---

## Task 6: FaqAccordion component (+ FAQPage JSON-LD)

**Files:**
- Create: `src/components/sections/FaqAccordion.tsx`

**Interfaces:**
- Consumes: `AnimatedSection`; `IconArrowRight` from `@/components/ui/Icons`; React `useState`.
- Produces: `FaqAccordion` component + `FaqItem`, `FaqAccordionProps`. `FaqItem` imported by Task 1 and Task 9. The component emits its own `FAQPage` JSON-LD `<script>` from `items` — Task 9 must NOT also emit a FAQPage block.

- [ ] **Step 1: Create the component**

```tsx
// src/components/sections/FaqAccordion.tsx
'use client';

import { useState } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { IconArrowRight } from '@/components/ui/Icons';

export interface FaqItem {
  question: string;
  answer: string;   // plain text — also used verbatim in FAQPage JSON-LD
}

export interface FaqAccordionProps {
  eyebrow?: string;
  heading?: string;
  items: FaqItem[];
  accent?: string;
  id?: string;
}

export function FaqAccordion({
  eyebrow,
  heading,
  items,
  accent = '#C97A40',
  id,
}: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };

  return (
    <section id={id} className="bg-white py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="page-container max-w-3xl">
        {(eyebrow || heading) && (
          <AnimatedSection className="mb-8">
            {eyebrow && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: accent }}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2]">
                {heading}
              </h2>
            )}
          </AnimatedSection>
        )}

        <dl className="flex flex-col">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.question} className="border-t border-[#E5E7EB] last:border-b">
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-bold text-base md:text-lg text-[#1A1A1A]">
                      {it.question}
                    </span>
                    <span
                      className="flex-shrink-0 transition-transform duration-200"
                      style={{ color: accent, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    >
                      <IconArrowRight size={18} />
                    </span>
                  </button>
                </dt>
                {isOpen && (
                  <dd className="pb-5 -mt-1 font-body text-sm md:text-base text-[#374151] leading-[1.75] max-w-[640px]">
                    {it.answer}
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.
- [ ] **Step 3: Lint** — Run: `npm run lint` — Expected: no errors.
- [ ] **Step 4: Manual check** — Temporarily render `<FaqAccordion items={[{question:'Q',answer:'A'}]} heading="Test" />` on any dev page, run `npm run dev`, confirm the first item is open, clicking toggles, and the caret rotates. Remove the temporary render. (Optional if confident.)
- [ ] **Step 5: Commit**

```bash
git add src/components/sections/FaqAccordion.tsx
git commit -m "feat(webuysolar): add FaqAccordion with FAQPage JSON-LD"
```

---

## Task 7: SolutionHero — optional secondaryCta

**Files:**
- Modify: `src/components/sections/SolutionHero.tsx`

**Interfaces:**
- Produces: `SolutionHeroProps` gains optional `secondaryCta?: { label: string; href: string }`. Backward-compatible — the other five pages pass no `secondaryCta` and render identically.

- [ ] **Step 1: Add the import**

Add `IconArrowRight` to the existing imports at the top of the file:

```tsx
import { Button } from '@/components/ui/Button';
import { IconArrowRight } from '@/components/ui/Icons';
```

- [ ] **Step 2: Extend the props interface**

In `SolutionHeroProps`, after `primaryCta: CtaLink;` add:

```tsx
  secondaryCta?: CtaLink;   // optional text link beside the primary button
```

- [ ] **Step 3: Destructure the new prop**

In the function signature destructure, after `primaryCta,` add `secondaryCta,`.

- [ ] **Step 4: Render the secondary link**

Replace the existing primary-button block:

```tsx
            <Button variant="light" href={primaryCta.href}>
              {primaryCta.label}
            </Button>
```

with:

```tsx
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button variant="light" href={primaryCta.href}>
                {primaryCta.label}
              </Button>
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="font-body text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.80)' }}
                >
                  {secondaryCta.label} <IconArrowRight size={13} />
                </Link>
              )}
            </div>
```

(`Link` is already imported in this file.)

- [ ] **Step 5: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.
- [ ] **Step 6: Lint** — Run: `npm run lint` — Expected: no errors.
- [ ] **Step 7: Commit**

```bash
git add src/components/sections/SolutionHero.tsx
git commit -m "feat(solution-hero): optional secondaryCta text link"
```

---

## Task 8: ContactForm — generic message prefill + verticals SEO

**Files:**
- Modify: `src/components/sections/ContactForm.tsx:88-96`
- Modify: `src/config/verticals.ts:60-70`

**Interfaces:**
- Produces: `/contact?message=<text>` now prefills the message box (in addition to the existing `?strategy=` behaviour). `VERTICAL_CONFIG.webuysolar` SEO rewritten; its `stats` emptied.

- [ ] **Step 1: Support a generic `message` query param**

In `ContactForm.tsx`, replace the body of `getQueryParams` (lines ~88-96):

```tsx
function getQueryParams(): { intent: Intent | null; message: string } {
  if (typeof window === 'undefined') return { intent: null, message: '' };
  const params = new URLSearchParams(window.location.search);
  const qsIntent = params.get('intent');
  const qsStrategy = params.get('strategy');
  const qsMessage = params.get('message');
  const validIntent = INTENTS.find((i) => i.value === qsIntent);
  const message = qsMessage
    ? qsMessage
    : qsStrategy
      ? (contactMessageForStrategy(qsStrategy) ?? '')
      : '';
  return { intent: validIntent ? validIntent.value : null, message };
}
```

(`URLSearchParams.get` already URL-decodes the value.)

- [ ] **Step 2: Verify nothing reads webuysolar's stats array**

Run: `npx grep -rn "VERTICAL_CONFIG" src` (or use the editor search) and confirm no consumer indexes `.stats` for a fixed length on the webuysolar vertical. The current solution pages render their footer stats from inline literals, not `cfg.stats`, so emptying it is safe.

Run: `grep -rn "\.stats" src/app src/components`
Expected: no usage that requires `VERTICAL_CONFIG[...].stats` to be non-empty for webuysolar. (If a consumer is found, stop and surface it rather than emptying the array.)

- [ ] **Step 3: Rewrite the webuysolar config**

In `verticals.ts`, replace the `webuysolar` block:

```ts
  webuysolar: {
    seoTitle: 'Sell or Convert Your Commercial Solar System | Phoenix Energy',
    seoDescription:
      'We acquire and operate existing C&I solar and battery systems — fair-market valuation, flexible PPA or lease, and active optimisation. Free expert audit.',
    stats: [],
  },
```

- [ ] **Step 4: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.
- [ ] **Step 5: Lint** — Run: `npm run lint` — Expected: no errors.
- [ ] **Step 6: Commit**

```bash
git add src/components/sections/ContactForm.tsx src/config/verticals.ts
git commit -m "feat(webuysolar): generic contact message prefill + EaaS SEO config"
```

---

## Task 9: Recompose the WeBuySolar page

**Files:**
- Modify (full rewrite): `src/app/solutions/webuysolar/page.tsx`

**Interfaces:**
- Consumes: `WEBUYSOLAR` (Task 1); `ExplainerCards` (Task 2); `DealExchange` (Task 3); `ComparisonTable` (Task 4); `PullQuote` (Task 5); `FaqAccordion` (Task 6); `SolutionHero` w/ `secondaryCta` (Task 7); existing `HowItWorks`, `FeaturedProjects`, `RelatedArticles`, `PageFooter`, `Card`/`CardBody`, `Button`, `IconCheck`/`IconArrowRight`, `getHeroImages`, `VERTICAL_CONFIG`, `SOLUTION_META`.
- Produces: the rendered page. Removes the old `SolutionTabs` + `WeBuySolarCalculator` usage and the old hardcoded footer stats.

- [ ] **Step 1: Replace the entire file**

```tsx
// src/app/solutions/webuysolar/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { DealExchange } from '@/components/sections/DealExchange';
import { ExplainerCards } from '@/components/sections/ExplainerCards';
import { ComparisonTable } from '@/components/sections/ComparisonTable';
import { PullQuote } from '@/components/sections/PullQuote';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { IconCheck, IconArrowRight } from '@/components/ui/Icons';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import { WEBUYSOLAR } from '@/config/webuysolarContent';

const vertical = 'webuysolar' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: {
    title: cfg.seoTitle,
    description: cfg.seoDescription,
    url: `https://phoenixenergy.solutions/solutions/${vertical}`,
    images: [{ url: 'https://phoenixenergy.solutions/og-solutions-webuysolar.png', width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;

const AUDIT_HREF = `/contact?intent=client&message=${encodeURIComponent(WEBUYSOLAR.auditPrefill)}`;

export default async function WeBuySolarPage() {
  const hero = (await getHeroImages())[vertical];
  const base = `https://phoenixenergy.solutions/solutions/${vertical}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://phoenixenergy.solutions/' },
        { '@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://phoenixenergy.solutions/solutions' },
        { '@type': 'ListItem', position: 3, name: meta.label, item: base },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Solar Asset Acquisition & Energy-as-a-Service',
      provider: { '@type': 'Organization', name: 'Phoenix Energy' },
      description: cfg.seoDescription,
      areaServed: 'ZA',
      url: base,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Phoenix Energy',
      url: 'https://phoenixenergy.solutions',
      logo: 'https://phoenixenergy.solutions/inverted-logo.svg',
      contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'info@phoenixenergy.solutions' },
    },
  ];

  return (
    <>
      {jsonLd.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}

      {/* §1 — Hero */}
      <SolutionHero
        title={WEBUYSOLAR.hero.title}
        subtitle={WEBUYSOLAR.hero.subtitle}
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #1a0f00 0%, #3a2000 50%, #5a3a10 100%)"
        primaryCta={{ label: 'Book your free audit', href: AUDIT_HREF }}
        secondaryCta={{ label: 'See how the deal works', href: '#how-the-deal-works' }}
      >
        <DealExchange variant="compact" />
      </SolutionHero>

      {/* §1b — How the deal works */}
      <ExplainerCards
        id="how-the-deal-works"
        background="white"
        heading={WEBUYSOLAR.deal.heading}
        subtitle={WEBUYSOLAR.deal.intro}
        accent={meta.accent}
        columns={3}
        cards={WEBUYSOLAR.deal.winCards}
        lead={
          <div className="max-w-2xl mb-12">
            <DealExchange variant="full" />
          </div>
        }
      />

      {/* §3 — Why now */}
      <ExplainerCards
        id="why-now"
        background="gray"
        eyebrow={WEBUYSOLAR.whyNow.eyebrow}
        heading={WEBUYSOLAR.whyNow.heading}
        subtitle={WEBUYSOLAR.whyNow.intro}
        accent={meta.accent}
        columns={3}
        cards={WEBUYSOLAR.whyNow.cards}
      />

      {/* §4 — Where value is lost */}
      <ExplainerCards
        id="value-lost"
        background="white"
        heading={WEBUYSOLAR.valueLost.heading}
        subtitle={WEBUYSOLAR.valueLost.intro}
        accent={meta.accent}
        columns={3}
        cards={WEBUYSOLAR.valueLost.cards}
        footer={<PullQuote accent={meta.accent}>{WEBUYSOLAR.valueLost.pullQuote}</PullQuote>}
      />

      {/* §5 — Old vs new */}
      <ComparisonTable
        id="old-vs-new"
        heading={WEBUYSOLAR.comparison.heading}
        columns={WEBUYSOLAR.comparison.columns}
        rows={WEBUYSOLAR.comparison.rows}
        accent={meta.accent}
      />

      {/* §6 — What Phoenix does differently */}
      <ExplainerCards
        id="difference"
        background="white"
        heading={WEBUYSOLAR.difference.heading}
        subtitle={WEBUYSOLAR.difference.intro}
        accent={meta.accent}
        columns={4}
        cards={WEBUYSOLAR.difference.cards}
      />

      {/* §7 — Process */}
      <HowItWorks
        eyebrow="The process"
        title={WEBUYSOLAR.process.title}
        steps={WEBUYSOLAR.process.steps}
        showCTA={false}
      />

      {/* Proof */}
      <FeaturedProjects vertical={vertical} />

      {/* §8 — Audit deliverables + CTA */}
      <section id="audit" className="bg-white py-16 md:py-24">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2] mb-3">
                {WEBUYSOLAR.audit.heading}
              </h2>
              <p className="font-body text-sm md:text-base leading-[1.75] text-[#6B7280] mb-6">
                {WEBUYSOLAR.audit.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button variant="primary" href={AUDIT_HREF}>
                  Arrange your free audit <IconArrowRight size={14} />
                </Button>
                <Link
                  href="/tools/solar-asset-valuation"
                  className="font-body text-sm font-semibold inline-flex items-center gap-1.5 text-[#39575C] hover:text-[#2a4045] transition-colors"
                >
                  Try the solar asset valuation tool <IconArrowRight size={13} />
                </Link>
              </div>
            </div>

            <Card variant="light" pattern={3}>
              <div className="h-[3px]" style={{ background: meta.accent }} />
              <CardBody padding="lg">
                <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-3">
                  What you receive
                </p>
                <ul className="space-y-2.5">
                  {WEBUYSOLAR.audit.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 font-body text-sm font-semibold text-[#1A1A1A]">
                      <span className="mt-0.5 flex-shrink-0" style={{ color: '#39575C' }}>
                        <IconCheck size={16} />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Topical links */}
      <RelatedArticles vertical={vertical} />

      {/* §9 — FAQ (emits FAQPage JSON-LD) */}
      <FaqAccordion
        id="faq"
        eyebrow="FAQ"
        heading={WEBUYSOLAR.faq.heading}
        items={WEBUYSOLAR.faq.items}
        accent={meta.accent}
      />

      {/* §10 — Final CTA */}
      <PageFooter
        ctaVariant="centered"
        eyebrow={WEBUYSOLAR.finalCta.eyebrow}
        heading={WEBUYSOLAR.finalCta.heading}
        body={WEBUYSOLAR.finalCta.body}
        primaryCta={{ label: 'Book your free audit', href: AUDIT_HREF }}
      />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean. (If `WEBUYSOLAR.process.steps` errors against `HowItWorks`'s `steps` prop, confirm each step object has only `label`/`description`/`tag` — it does; the shape is structurally compatible.)

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors. Confirm no unused imports remain (the old `SolutionTabs`, `WeBuySolarCalculator`, `getHowItWorks`, `TabItem` imports must be gone).

- [ ] **Step 4: Visual smoke test**

Run: `npm run dev`, open `http://localhost:3000/solutions/webuysolar`. Confirm:
- Hero shows the new H1, the compact DealExchange card on the right, "Book your free audit" + "See how the deal works →".
- Clicking "See how the deal works →" scrolls to §1b.
- All sections render in order with Warm-Copper accents; the comparison renders as a real table; the FAQ toggles.
- "Book your free audit" navigates to `/contact` with the client step pre-selected and the message box pre-filled.

- [ ] **Step 5: Commit**

```bash
git add src/app/solutions/webuysolar/page.tsx
git commit -m "feat(webuysolar): recompose page as EaaS acquire-and-operate narrative"
```

---

## Task 10: Final verification & SEO validation

**Files:** none (verification only)

- [ ] **Step 1: Full type-check & lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both clean.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds; `/solutions/webuysolar` compiles with no errors or warnings about it.

- [ ] **Step 3: JSON-LD presence check**

With `npm run dev` running, view source of `/solutions/webuysolar` and confirm **four** `application/ld+json` blocks: `BreadcrumbList`, `Service`, `Organization`, and `FAQPage` (the last emitted by `FaqAccordion`). Optionally paste each into the Google Rich Results test.

- [ ] **Step 4: Acceptance-criteria sweep**

Confirm against the spec's acceptance criteria:
- No "removal / decommissioning / any reason for selling / 14 days" copy outside the FAQ relocation answer.
- Settlement timeline appears once (process step 5).
- No stat counters anywhere.
- Exactly one `<h1>` (hero).
- Comparison + FAQ are real HTML.
- Hero has no calculator; CTA → audit.

- [ ] **Step 5: Final commit (if any cleanup was needed)**

```bash
git add -A
git commit -m "chore(webuysolar): final verification cleanup"
```

(Skip if Step 1–4 required no changes.)

---

## Self-review notes (author)

- **Spec coverage:** Hero §1 (Task 9), deal §1b (Tasks 3+2+9), why-now §3 (Task 9), value-lost §4 + pull-quote (Tasks 5+9), old-vs-new §5 (Tasks 4+9), difference §6 (Task 9), process §7 (Task 9 via HowItWorks), audit §8 (Task 9), FAQ §9 (Tasks 6+9), final CTA §10 (Task 9), SEO/meta/4×JSON-LD (Tasks 8+9), audit CTA routing (Tasks 8+9). Trust band intentionally omitted. ✔
- **Placeholder scan:** no TBD/TODO; all copy and code inline. ✔
- **Type consistency:** `ExplainerCardItem`/`ComparisonRow`/`FaqItem` defined in Tasks 2/4/6 and consumed by Tasks 1/9 with matching shapes; `secondaryCta` shape matches `CtaLink`; `AUDIT_HREF` used identically in hero, audit section and footer. ✔
- **Ordering note:** Task 1 imports types from Tasks 2/4/6 — execute 2→4→6 before 1 (or 2,4,6 then 1; Tasks 3/5/7/8 are independent). Task 9 depends on all prior tasks.

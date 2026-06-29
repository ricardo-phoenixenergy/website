# WeBuySolar Page Redesign — Design Spec

> **Date:** 2026-06-29
> **Topic:** Reposition `/solutions/webuysolar` from "we buy & remove" to Energy-as-a-Service "acquire & operate"
> **Source of truth:** `WeBuySolar_Page_Spec.md` (client brief) + Phoenix Energy EaaS brochure
> **Status:** Approved for implementation planning

---

## 1. Goal & positioning

Reposition the WeBuySolar page from a **decommissioning/buyback** story to an **Energy-as-a-Service (sale-and-PPA-back)** story:

- **You sell** Phoenix your existing C&I solar/battery system for a fair cash sum.
- **The system never moves** — it stays on your roof.
- **Phoenix owns, operates and optimises** it from day one.
- **You keep buying its power** under a PPA priced *below* the grid tariff.

We keep the high-volume transactional search hook ("sell my solar / we buy solar") in the title, meta and H1, then elevate toward the higher-value EaaS proposition in the body — **capture the intent, elevate the offer.**

### Decisions locked during brainstorming

| Decision | Choice |
|---|---|
| Scope | **Full page** — all spec sections |
| Stat counters (42 / R85M / 98%) | **Removed** everywhere (unverifiable → liability on a finance page) |
| Hero valuator | **Dropped from hero**; hero CTA goes straight to the free-audit booking. The standalone `/tools/solar-asset-valuation` tool is unchanged and linked from §8 |
| Hero right-hand slot | **Deal-exchange visual** (compact) |
| Trust band (§2 in brief) | **Removed** — no partner-logo / counter band |
| Hero H1 | *"Sell your commercial solar system **and keep its power for less than the grid.**"* (accent on "less than the grid") — single both/and deal, not an either/or |

---

## 2. Design principles (reuse-first)

The site already has a mature design system. This redesign **composes from existing primitives** and adds the **minimum** net-new components.

- Tokens only: bg `#F5F5F5`, primary `#39575C`, dusty blue `#709DA9`, WeBuySolar accent **Warm Copper `#C97A40`**, text `#1A1A1A`, muted `#6B7280`, border `#E5E7EB`, dark `#0d1f22`.
- Display = Plus Jakarta Sans, Body = Inter. `<em>` renders in the vertical accent (Warm Copper here).
- Sections `py-16 md:py-24`, `page-container` (max-w 80rem), cards `rounded-2xl`, buttons `rounded-full`.
- Accent used subtly — 3px bars / dots / arrows / 10–15% tints, never dominant fills.
- Named exports only. Framer Motion via `AnimatedSection`. `next/image` with blur. No dark mode. No new npm deps.

---

## 3. Page architecture — section → component map

Render order in `src/app/solutions/webuysolar/page.tsx`:

| # | Section | id | Component(s) | Reuse / New |
|---|---------|----|--------------|-------------|
| 1 | Hero | — | `SolutionHero` + `DealExchange variant="compact"` | Reuse + new |
| 1b | How the deal works | `how-the-deal-works` | `DealExchange variant="full"` + `ExplainerCards` (3 win-cards) | New |
| 3 | Why now — 3 shifts | `why-now` | `ExplainerCards` (3) | New generic |
| 4 | Where value is lost | `value-lost` | `ExplainerCards` (3) + `PullQuote` | New |
| 5 | Old vs new model | `old-vs-new` | `ComparisonTable` | New |
| 6 | What Phoenix does differently | `difference` | `ExplainerCards` (4) | Reuse new |
| 7 | The 6-step process | `process` | `HowItWorks` (local steps config) | Reuse |
| — | Featured projects | — | `FeaturedProjects vertical="webuysolar"` | Reuse |
| 8 | Audit deliverables + CTA | `audit` | `AuditDeliverables` (Card + IconCheck) + audit CTA + `/tools` link | Reuse-composed |
| — | Related articles | — | `RelatedArticles vertical="webuysolar"` | Reuse |
| 9 | FAQ | `faq` | `FaqAccordion` (+ FAQPage JSON-LD) | New |
| 10 | Final CTA | — | `PageFooter ctaVariant="centered"` | Reuse |

> **Note:** the current "What we buy" `SolutionTabs` (Rooftop / Ground-mount / Battery) is **removed** from this page. The brands/sizes question it answered is now handled in the FAQ (§9). `SolutionTabs` remains untouched for the other five verticals.

---

## 4. New components

All copy lives in **`src/config/webuysolarContent.ts`** (mirrors how `src/config/strategies.ts` keeps copy out of JSX). Components are presentational and typed.

### 4.1 `DealExchange` — `src/components/sections/DealExchange.tsx`
The make-or-break visual. Resolves "why sell something that saves me money?" in one read.

```ts
interface DealExchangeProps {
  variant: 'compact' | 'full';
}
```

- **compact** (hero right slot, on dark): a vertical card with two labelled blocks — **ONE-TIME** (You → Phoenix: the system · Phoenix → You: fair cash sum) and **ONGOING** (System → You: clean power · You → Phoenix: PPA below grid). Warm-Copper arrows.
- **full** (§1b, on light): same two blocks expanded with the brief's legend lines, including the "Phoenix → the system: active management, optimisation, battery dispatch, wheeling & trading" line. Followed by the three "three-way win" cards rendered via `ExplainerCards`.
- Pure layout + `AnimatedSection`. Icons from existing set (`IconArrowRight`, `IconSun`/`IconBattery`, `IconDollarSign`). No new deps.

### 4.2 `ExplainerCards` — `src/components/sections/ExplainerCards.tsx`
Generic icon + heading + body card row. The reuse workhorse — powers §1b win-cards, §3, §4 and §6.

```ts
interface ExplainerCard {
  icon: IconName;       // reuses SolutionTabs' IconName union
  title: string;        // rendered as <h3>
  body: string;
}
interface ExplainerCardsProps {
  eyebrow?: string;
  heading?: string;     // <h2>, supports <em> accent
  subtitle?: string;
  cards: ExplainerCard[];
  columns?: 3 | 4;      // default 3
  accent?: string;      // default Warm Copper
}
```
- Built on `Card` (`variant="light"`, 3px Warm-Copper accent bar) + `CardBody`. Responsive grid: `md:grid-cols-3` or `md:grid-cols-4`. Each card wrapped in `AnimatedSection` with staggered `delay`.

### 4.3 `ComparisonTable` — `src/components/sections/ComparisonTable.tsx`
§5 "old vs new" — semantic HTML `<table>` (NOT an image), for featured-snippet eligibility and dwell time.

```ts
interface ComparisonRow { dimension: string; oldModel: string; newModel: string; }
interface ComparisonTableProps {
  eyebrow?: string;
  heading?: string;     // <h2>
  columns: [string, string, string]; // header labels
  rows: ComparisonRow[];
  accent?: string;
}
```
- Light card wrapper, Warm-Copper header accent on the "new model" column. Horizontal scroll on mobile (`overflow-x-auto`), never collapses to images.

### 4.4 `PullQuote` — `src/components/sections/PullQuote.tsx`
§4 emphasis line.

```ts
interface PullQuoteProps { children: React.ReactNode; accent?: string; }
```
- Large display-font quote, 3px Warm-Copper left bar, centered, `AnimatedSection`.

### 4.5 `FaqAccordion` — `src/components/sections/FaqAccordion.tsx`
§9 expandable Q&A + emits `FAQPage` JSON-LD from the same data (single source of truth).

```ts
interface FaqItem { question: string; answer: string; } // answer = plain text for JSON-LD safety
interface FaqAccordionProps {
  eyebrow?: string;
  heading?: string;     // <h2>
  items: FaqItem[];
}
```
- Client component (open/close state), `IconMinus`/chevron toggle, semantic `<dl>`/button rows, keyboard-accessible. Renders a sibling `<script type="application/ld+json">` with the `FAQPage` schema built from `items`.

### 4.6 `AuditDeliverables` (composed, §8)
Not necessarily a standalone component — a section composed from `Card` + `IconCheck` checklist + audit CTA + a secondary link to `/tools/solar-asset-valuation`. If it reads cleanly inline in the page it can stay in `page.tsx`; extract to `src/components/sections/AuditDeliverables.tsx` if it exceeds ~40 lines.

---

## 5. Reused components (no changes needed)

- `SolutionHero` — `<em>` accent, breadcrumbs, dark overlay, right `children` slot (takes `DealExchange compact`). Hero `primaryCta` → audit booking. Add a secondary text link "See how the deal works →" anchoring to `#how-the-deal-works` (use the existing `children`/layout; if `SolutionHero` has no secondary-link prop, render the anchor inside the hero copy area — **do not** add new props unless trivially clean).
- `HowItWorks` — fed by a **local 6-step config** (not Sanity) since the copy is page-specific. Risk: it renders a 3+ column horizontal grid; **6 steps may be too dense for one row** → implementation should verify and, if needed, allow a 2-row / wrap layout. This is the one reused component that may need a small layout tweak; keep it backward-compatible for the other verticals.
- `FeaturedProjects`, `RelatedArticles` — `vertical="webuysolar"`, pull from Sanity, render `null` if empty (safe).
- `PageFooter` — `ctaVariant="centered"`, audit CTA.
- `Card`/`CardBody`, `Button`, `AnimatedSection`, `Icons`, `SectionLabel`.

---

## 6. Content (final copy)

Stored in `src/config/webuysolarContent.ts`. Brochure typos corrected ("singificant" → "significant"; "is being left" fixed). Single settlement timeline. All "removal / decommissioning / any reason for selling / cash in 14 days" framing removed (relocation/removal survives only as an FAQ path).

### Hero
- **Eyebrow:** `WeBuySolar by Phoenix Energy`
- **H1:** `Sell your commercial solar system and keep its power for less than the grid.` (accent: "less than the grid")
- **Subhead:** `Sell us your existing commercial solar or battery system for a fair cash sum, then buy back the power it produces under a flexible PPA. The system never moves. You free up capital, keep your savings, and hand the running of it to specialists who'll make it earn more than it does now.`
- **Primary CTA:** `Book your free audit` → `/contact` (client intent, audit prefill)
- **Secondary link:** `See how the deal works →` → `#how-the-deal-works`

### §1b — How the deal works
- **H2:** `Sold, but never gone.`
- **Intro:** `It's a sale-and-PPA-back. You sell us the system for cash, we take over ownership and running it, and you keep buying the power it makes — for less than the grid charges. The panels never leave your roof.`
- **One-time exchange:** You → Phoenix: the existing solar / battery system. · Phoenix → You: a fair-market cash sum, paid on settlement.
- **Then, ongoing:** System → You: clean kWh, exactly as before. · You → Phoenix: a monthly PPA payment, below your grid tariff. · Phoenix → system: active management, optimisation, battery dispatch, wheeling and trading.
- **Three-way win (3 cards):**
  1. **Capital back.** Recoup the money tied up in a depreciating roof asset — redeploy it in your core business.
  2. **Savings kept.** Your power stays cheaper than the grid. The asset becomes a clean opex line, not a maintenance headache.
  3. **Risk gone.** Performance, O&M and obsolescence become our problem. You stop managing something that was never your core business.

### §3 — Why now (3 shifts)
- **H2:** `The economics of C&I solar have changed.`
- **Intro:** `Commercial solar has been a sound investment for a decade. But three structural shifts have changed what your asset is worth — and who's positioned to capture that value.`
  1. **Battery economics flipped.** C&I battery prices are down ~40% in two years, and the same hardware bought for backup now earns daily through time-of-use arbitrage, peak shaving and solar-consumption optimisation. Systems without batteries leave value on the table; systems using batteries only for backup leave even more.
  2. **The market liberalised.** Wheeling, multi-site aggregation, licensed traders and the upcoming SAWEM wholesale market (Q3 2026) turn business energy from a passive grid bill into an active, optimisable position. A standalone system is now just one node in a much bigger picture.
  3. **Operations became the differentiator.** Active battery dispatch, performance benchmarking, energy trading and tariff optimisation are how value is captured now — and they need dedicated expertise that didn't exist in deployable form when most systems were installed.

### §4 — Where value is lost (3 patterns) + pull-quote
- **H2:** `The cost of running yesterday's system in today's market.`
- **Intro:** `Across the C&I solar owners we work with, three patterns recur. None are technology failures — they're failures of operational context.`
  1. **Silent underperformance.** Inverter clipping, soiling, module mismatch and suboptimal tilt compound quietly. Without operator-grade monitoring, a system producing 78% of its potential looks identical to one at 92%. The difference is enormous.
  2. **No one owns the solar asset.** It's usually run by a site manager whose real job is something else, or by the installer under an uptime-focused O&M contract. Both leave value on the table — for different reasons.
  3. **Designed for a market that no longer exists.** Systems sized in 2021–22 assumed no wheeling, no affordable storage, no smart optimisation. The assumptions were right then. Every month they run unchanged now, they forfeit revenue.
- **Pull-quote:** `The investment was right. The question now is who's positioned to operate it for the market that exists.`

### §5 — Old vs new (table)
- **H2:** `Your solar asset hasn't changed. Everything around it has.`
- **Columns:** Dimension · The old model · The new model

| Dimension | The old model | The new model |
|---|---|---|
| Where value is created | The technology brand on the spec sheet | Configuration & operation — same hardware, materially better lifetime savings |
| Supplier relationship | Transactional installer ("I install, the deal closes") | Energy-as-a-Service provider — we supply the power and own energy as an ongoing function |
| System management | Static — sized once, run as designed | Dynamic — responsive to tariffs, load shifts and market signals |
| Capital structure | Outright cash purchase | Zero-capex PPA or lease — recoup your capital today |
| Market integration | Standalone behind-the-meter | Integrated: solar, storage, wheeling and trading as one optimised whole |

### §6 — What Phoenix does differently (4 cards)
- **H2:** `Built for the new energy market.`
- **Intro:** `Phoenix Energy is a C&I energy partner — not a solar installer, not an energy fund. We acquire, operate and continuously optimise existing assets for businesses serious about their energy future.`
  1. **Acquire & operate** — We take over assets from owners ready to let specialists run them. Clean handover, measurably better outcomes.
  2. **Transparent, fair valuations** — Fair market value, flexible PPAs and leases, bespoke capex-free arrangements. No headline 100% or 110% buyback offers funded by inflated PPAs and high escalations. The model that works for you now and going forward.
  3. **Analyse & optimise** — Proprietary tools run continuous performance analysis on every asset, surfacing revenue leakage standard reporting misses — then reconfiguring to capture it.
  4. **Build for what's next** — We evolve your system as the market does, so it gets more valuable over time instead of ageing out.

### §7 — The 6-step process
- **H2:** `The path from owned to operated, in six steps.`
  1. **Free expert audit** — On-site inspection: drone scan, string-level review, inverter config audit, opportunity mapping. Written report within 10 business days. *(Free. No obligation.)*
  2. **Preliminary offer & valuation** — Fair market valuation, indicative PPA or lease, and a forecasted savings model with an optimisation roadmap.
  3. **Due diligence** — At our cost: financials, asset docs, contracts, operational data.
  4. **Final offer & contracting** — Binding term sheet, PPA/lease and sale agreement. Either side can step back here, no obligation.
  5. **Acquisition & handover** — Ownership transfers, the acquisition value is paid out, and we take operational responsibility from day one with monthly reporting. **Settlement on the agreed date in the sale agreement.** *(single timeline lives here only)*
  6. **Ongoing optimisation** — We operate and upgrade as economics evolve. Each upgrade justified by its own ROI; none committed upfront.

### §8 — Audit deliverables + CTA
- **H2:** `Start with the audit. Decide everything else later.`
- **Sub:** `A free, independent, operator-grade audit of your existing system. No cost. No commitment.`
- **Checklist:** Inverter configuration & clipping review · System production review · Battery dispatch analysis (where applicable) · Tariff structure & electricity bill review · Quantified estimate of unrealised value · System valuation quote · Preliminary PPA/lease commercial offer · Tailored energy optimisation roadmap
- **Primary CTA:** `Arrange your free audit` → `/contact` (client intent, audit prefill)
- **Secondary link:** `Try the solar asset valuation tool →` → `/tools/solar-asset-valuation`

### §9 — FAQ (also emits FAQPage JSON-LD)
- **H2:** `Questions, answered.`
  1. **Do you remove the system, or does it stay where it is?** — It stays on your roof and keeps operating exactly as before — that's the whole point. If you're relocating or closing the site and genuinely need it removed, we'll discuss a removal/buyout separately.
  2. **What brands and sizes do you accept?** — All major inverter and module brands, from small commercial arrays up to multi-megawatt systems, with or without battery storage. Condition and configuration are assessed in the audit.
  3. **How do you calculate the valuation?** — Fair market value based on the system's condition, production and the savings it can generate under active operation — not an inflated headline buyback funded by a high PPA tariff.
  4. **PPA, lease or outright sale — which do I get?** — Whichever fits your balance sheet. We structure a fair-market sale with a flexible PPA or lease back; bespoke capex-free arrangements are available.
  5. **What does it cost me?** — The audit is free. Due diligence is at our cost. You only commit at final contracting, and either side can step back before then.
  6. **How long until I'm paid?** — On the settlement date agreed in the sale agreement, once contracting and handover are complete.
  7. **What happens to my site manager's involvement?** — We take operational responsibility from day one, with monthly reporting. Your team stops managing something that was never their core job.
  8. **Is there any obligation after the audit?** — None. The audit and its report are yours to keep, with no obligation to proceed.

### §10 — Final CTA
- **PageFooter** centered: eyebrow `Start today` · heading `Ready to find out what your system is really worth?` · body (short audit invitation) · CTA `Book your free audit` → `/contact`.

---

## 7. SEO / metadata / structured data

- **One H1** — hero only. Every section uses `<h2>`; cards use `<h3>`.
- **`metadata`** (`page.tsx`): title `Sell or Convert Your Commercial Solar System | Phoenix Energy`; description `We acquire and operate existing C&I solar and battery systems — fair-market valuation, flexible PPA or lease, and active optimisation. Free expert audit.`; matching OG title/description; canonical self-referential (already correct). OG image copy to be updated to match H1 (asset task — flagged, not blocking).
- **`VERTICAL_CONFIG.webuysolar`** (`src/config/verticals.ts`): rewrite `seoTitle` + `seoDescription` (strip "we handle the removal", "cash within 14 days"); **remove the `stats` array** (counters gone). Verify no other consumer of `cfg.stats` breaks (hero/footer no longer use it).
- **`SOLUTION_META.webuysolar`** unchanged (label `WeBuySolar`, accent `#C97A40`).
- **JSON-LD — four blocks** (currently only `Service`):
  - `BreadcrumbList` — Home › Solutions › WeBuySolar
  - `Service` — name `Solar Asset Acquisition & Energy-as-a-Service`, provider Phoenix Energy, `areaServed: "ZA"`, url canonical
  - `FAQPage` — generated by `FaqAccordion` from the §9 items
  - `Organization` — name, logo, contactPoint
- **Internal links:** audit CTAs → `/contact`; §8 → `/tools/solar-asset-valuation`; `/projects` + `/about` via existing carousels; `RelatedArticles` surfaces wheeling / SAWEM / arbitrage blog posts when tagged.

---

## 8. Scope guards (explicitly NOT doing)

- No new lead-capture backend — reuse the existing `/contact` intent + Resend flow (audit prefill mirrors the strategy-prefill pattern in `strategies.ts`).
- No fix/rebuild of `WeBuySolarCalculator` — it is removed from this page; the standalone `/tools/solar-asset-valuation` tool is untouched.
- No changes to the other five solution verticals or to shared components' existing behaviour (any `HowItWorks` tweak must stay backward-compatible).
- No new npm dependencies.
- No fabricated stats anywhere.

---

## 9. File-change summary

**New**
- `src/components/sections/DealExchange.tsx`
- `src/components/sections/ExplainerCards.tsx`
- `src/components/sections/ComparisonTable.tsx`
- `src/components/sections/PullQuote.tsx`
- `src/components/sections/FaqAccordion.tsx`
- `src/config/webuysolarContent.ts` (all page copy + FAQ + process steps + comparison rows + deliverables)
- (optional) `src/components/sections/AuditDeliverables.tsx`

**Modified**
- `src/app/solutions/webuysolar/page.tsx` (full recompose: new section order, 4 JSON-LD blocks, metadata, audit CTAs)
- `src/config/verticals.ts` (webuysolar seoTitle/seoDescription rewrite, remove stats array)
- possibly `src/components/sections/HowItWorks.tsx` (only if 6-step density needs a wrap/2-row layout; backward-compatible)

**Unchanged**
- `WeBuySolarCalculator.tsx`, `SolutionTabs.tsx`, the `/tools` valuation tool, the other five solution pages.

---

## 10. Acceptance criteria

- [ ] No "removal / decommissioning / any reason for selling / 14 days" framing in hero, meta, OG, or body (removal survives only as the FAQ relocation path).
- [ ] One settlement timeline, stated once (process step 5).
- [ ] No stat counters anywhere; no fabricated numbers.
- [ ] Hero valuator removed; hero CTA → free-audit booking.
- [ ] Exactly one `<h1>`; sections use semantic `<h2>`/`<h3>`.
- [ ] Comparison + FAQ are real HTML (not images).
- [ ] Four JSON-LD blocks present and valid (BreadcrumbList, Service, FAQPage, Organization).
- [ ] Page reuses SolutionHero, HowItWorks, FeaturedProjects, RelatedArticles, PageFooter, Card/Button/AnimatedSection — only the five (+1 optional) new components added.
- [ ] `tsc --noEmit` clean; ESLint clean; Warm-Copper accent + tokens only, no hardcoded off-palette values.

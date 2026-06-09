# Design — "Find My Strategy" for C&I Solar & Storage

> Spec | Date: 2026-06-09 | Page: `/solutions/ci-solar-storage`
> Status: Approved for planning

---

## 1. Summary

Replace the generic savings slider (`SolarCalculator`) on the C&I Solar & Storage page
with a qualitative **Strategy Finder** — a short, branching wizard that diagnoses the
visitor and routes them to the single Solar/BESS strategy that best fits them, then to a
free assessment.

The Solution section below is restructured so its tabs **are** those strategies, and
financing (CapEx vs OpEx) is pulled out into its own band beneath them.

**Core principles**
- **No bill amount, no savings figures.** Nothing the visitor could dispute or feel
  over-promised by. The only "ask" is the free assessment.
- **Answerable from memory.** Every question is qualitative with a one-line hint; no
  document, no typing, no maths.
- **Diagnose → prescribe → educate → convert.** The page tells one story.

**Scope:** C&I Solar & Storage page only. The other five verticals keep their existing
calculators and tab sets unchanged. Shared components are changed **additively** so they
remain backward-compatible.

---

## 2. Non-goals

- No financial/savings estimate, payback period, or system pricing in the finder.
- No bill-amount input anywhere in the finder.
- No change to the other five solution verticals' calculators or tabs.
- No change to the contact form's submission API, schema, or fields (only client-side
  prefill from URL params is added).

---

## 3. UX flow — the Strategy Finder

A branching wizard living in its **own dark section** (`#0d1f22`) directly **below the
hero** and **above** the Solution tabs. The hero keeps its primary CTA ("Get a Free
Assessment") and gains a quiet secondary link: *"Not sure what you need? Find your
strategy ↓"* that scrolls to the finder.

### 3.1 Questions

Each option renders a bold label + a one-line hint. One question visible at a time;
a thin progress bar reflects total steps in the current branch.

**Q1 — Goal (always asked, first)** — single select
| Option | Hint |
|---|---|
| 💰 Cut my electricity bill | Lowest running cost is the priority. |
| 🔋 Reliable backup | Stay running through loadshedding and outages. |
| 🔌 Energy independence | Reduce or remove reliance on the grid entirely. |

**Branch:**
- Goal = **backup** or **independence** → skip Q2 & Q3, go straight to Q4 (usage) → reveal. *(2 questions total)*
- Goal = **cut my bill** → ask Q2, Q3, Q4 → reveal. *(4 questions total)*

**Q2 — Energy rate** (only if goal = cut-bill) — single select
| Option | Hint |
|---|---|
| Flat rate, all year | The same price per unit (c/kWh) at all times. |
| Time-of-Use | Price changes by time: peak, standard & off-peak. |
| Block / tiered | Price per unit rises the more you use in a month. |
| I don't know | No problem — we'll work it out together. |

**Q3 — Demand charge** (only if goal = cut-bill) — single select, with a clarifying
caption: *"A separate line billed on your highest power draw — often labelled 'demand',
'kVA' or 'maximum demand'."*
- Yes · No · I don't know

**Q4 — Usage (always asked)** — single select
| Option | Hint |
|---|---|
| ☀️ Mostly daytime | Office or factory, roughly 8am–5pm. |
| 🔁 Round the clock | 24/7 operations, cold storage, plant. |
| 🌙 Evenings & nights | Retail, hospitality, security. |

### 3.2 Navigation
- Forward on select (or an explicit "Continue"); a back affordance per step.
- Selecting a different Q1 goal after branching resets Q2/Q3 answers (branch may change).
- First question auto-focuses; arrow/Tab keyboard navigation between options (radio group semantics).

---

## 4. Decision logic

Implemented as a **pure function** `recommendStrategy(answers): StrategyResult` with no UI
or side effects, unit-tested per branch (see §9).

### 4.1 Inputs
```ts
type Goal = 'cut-bill' | 'backup' | 'independence';
type EnergyRate = 'flat' | 'tou' | 'block' | 'unknown';
type DemandCharge = 'yes' | 'no' | 'unknown';
type Usage = 'daytime' | 'around-clock' | 'evenings';

interface StrategyAnswers {
  goal: Goal;
  energyRate?: EnergyRate;     // present only when goal === 'cut-bill'
  demandCharge?: DemandCharge; // present only when goal === 'cut-bill'
  usage: Usage;
}
```

### 4.2 Output
```ts
type StrategyKey =
  | 'grid-tied-solar' | 'battery-arbitrage' | 'demand-shaving'
  | 'backup-resilience' | 'off-grid';
type Topology = 'solar-only' | 'hybrid' | 'off-grid';

interface StrategyResult {
  primary: StrategyKey;
  secondary: StrategyKey[];   // e.g. arbitrage alongside demand shaving
  topology: Topology;         // drives reveal copy (solar-only vs + battery)
  rationale: string;          // templated sentence built from the answers
  caveated: boolean;          // true for the "don't know" default
  tabAnchor: string;          // e.g. 'strategy-battery-arbitrage'
}
```

### 4.3 Algorithm (goal-first)
```
1. Goal gate:
   - goal === 'backup'        → primary = 'backup-resilience'
   - goal === 'independence'  → primary = 'off-grid'
   - goal === 'cut-bill'      → go to step 2

2. Cut-bill levers (biggest saving first):
   - demandCharge === 'yes':
        primary   = 'demand-shaving'
        secondary = energyRate === 'tou' ? ['battery-arbitrage'] : []
   - else if energyRate === 'tou':   primary = 'battery-arbitrage'
   - else if energyRate === 'block': primary = 'grid-tied-solar'   // max self-consumption, dodge top blocks
   - else if energyRate === 'flat':  primary = 'grid-tied-solar'
   - else:                            primary = 'grid-tied-solar', caveated = true  // both unknown → flexible hybrid default

3. Topology (battery need), from usage + primary:
   - primary === 'off-grid'                         → 'off-grid'
   - primary in {battery-arbitrage, demand-shaving,
                 backup-resilience}                 → 'hybrid'
   - primary === 'grid-tied-solar':
        usage === 'daytime'                         → 'solar-only'
        else (around-clock | evenings)              → 'hybrid'
   - caveated default is always 'hybrid' framing.

4. tabAnchor = 'strategy-' + primary.
```

### 4.4 Rationale templates
Built from the answers so the reveal reads bespoke. Examples (final copy in implementation):
- demand-shaving (+tou): *"You're on Time-of-Use **and** pay demand charges, running mostly
  {usage}. Solar covers daytime load; a battery flattens the demand spikes driving your kVA
  charge and shifts energy into peak hours."*
- battery-arbitrage: *"Your Time-of-Use tariff makes power expensive at peak. Store cheap
  solar by day and use it when the rates bite."*
- grid-tied-solar / block: *"On a block tariff every extra unit costs more — so generating
  your own daytime power shaves off the priciest units first."*
- backup-resilience: *"Uptime is your priority. A grid-tied hybrid keeps you running
  through loadshedding, and trims your bill as a bonus."*
- off-grid: *"You want off the grid. Solar plus a large battery (and optional generator)
  can take you there."*
- caveated default: appends *"— a free assessment will confirm the exact tactic for your site."*

---

## 5. The reveal

Replaces Q4's panel once answered. Contents:
- Eyebrow: "Your recommended strategy"
- Small system glyph reflecting topology (☀️ solar-only · ☀️+🔋 hybrid · 🔌 off-grid)
- **Strategy name** (primary, + secondary appended e.g. "Arbitrage & Peak-Shaving")
- **Rationale** sentence (from §4.4)
- **Primary action:** `Read about {strategy} →` — sets `#strategy-{key}` hash, which opens
  that tab below and smooth-scrolls to it (see §7).
- **Secondary strategies** (if any): small "also relevant" links, each deep-linking its tab.
- **Conversion CTA:** `Get my free assessment →` → `/contact?intent=client&strategy={key}` (see §8).
- **Start over** link → resets the wizard.

No numbers anywhere in the reveal.

---

## 6. Restructured Solution section

### 6.1 Strategy tabs (replaces Solar Technology / Battery Storage / Financing)
Five tabs, each a readable deep-dive, in this order:

| Key | Label | Icon | "Best for" |
|---|---|---|---|
| `grid-tied-solar` | Grid-Tied Solar | Sun | Daytime users, simple tariff; solar-only or hybrid |
| `battery-arbitrage` | Battery Arbitrage | Battery | Time-of-Use tariffs — buy low, use high |
| `demand-shaving` | Demand Shaving | Activity | Bills with demand / kVA charges |
| `backup-resilience` | Backup & Resilience | Zap | Uptime-critical; loadshedding hurts |
| `off-grid` | Off-Grid | Globe | Weak/no grid; full independence |

- Each tab keeps the existing panel shape (title, body, bullet list, image) from `TabItem`.
- The Grid-Tied tab explicitly covers both solar-only and hybrid-with-BESS self-consumption.
- Each tab gets a stable `key` used to build its anchor `strategy-{key}`.
- Initial copy is authored as part of implementation; existing Solar Technology and
  Battery Storage copy is repurposed into Grid-Tied and Arbitrage/Demand-Shaving.

### 6.2 Financing band (new, below the tabs)
- Its own section titled e.g. "How to fund it — any strategy".
- Renders the existing `FinancingCards` (CapEx "Own it" vs OpEx "PPA/lease"). No content
  change to `FinancingCards`; it simply moves out of the tab set into a standalone band.

---

## 7. `SolutionTabs` refactor (additive, backward-compatible)

The other five verticals still pass a `financing` tab and have no finder, so changes must
not break them.

- Add an optional `key?: string` to `TabItem`. When present, the tab is addressable.
- `SolutionTabs` listens for `hashchange` and on mount reads `location.hash`; if it matches
  `strategy-{key}` (or `#{key}`) of a tab, it sets that tab active (desktop) / opens that
  accordion item (mobile) and scrolls the section into view.
- All existing behaviour (internal `activeTab`/`openIndex` state, `type: 'financing'`
  rendering, analytics `tab_change`) is preserved unchanged when no `key`/hash is used.
- The CI page passes the five strategy tabs **without** a financing tab and renders the
  financing band separately; other verticals are untouched.

---

## 8. Lead handoff — contact form prefill

Reveal CTA → `/contact?intent=client&strategy={key}`.

`ContactForm` (client component) gains URL-param handling:
- Read `searchParams` on mount.
- If `intent=client` (or any valid intent), pre-select that intent and advance to **step 2**.
- If `strategy` is a known key, seed the **"Tell us more"** textarea (`fields.message`) with
  editable, preconfigured text, e.g.:
  > "I used the Strategy Finder on your C&I Solar & Storage page — my recommended strategy
  > is **Demand Shaving**. I'd like a free assessment."
- The user can edit or clear the text. No schema/API/field changes; this is purely
  client-side default state.
- A `strategy` → friendly-name + sentence map lives alongside the strategies config so the
  finder and the form stay in sync.

Edge cases: unknown/missing `strategy` → no prefill, normal form. Unknown `intent` → ignore,
start at step 1.

---

## 9. Component & file architecture

**New**
- `src/components/sections/StrategyFinder.tsx` — client component; wizard state, branching,
  renders steps + reveal. Presentational; delegates the decision to the pure function.
- `src/lib/strategy/recommendStrategy.ts` — pure `recommendStrategy(answers)` (§4).
- `src/lib/strategy/recommendStrategy.test.ts` — unit tests (§ below).
- `src/config/strategies.ts` — single source of truth: per-strategy `{ key, label, icon,
  bestFor, tab content, contactSentence }`. Drives the reveal, the tabs, and the contact prefill.
- `src/components/sections/FinancingBand.tsx` — thin wrapper rendering `FinancingCards` as a
  titled standalone section (or render `FinancingCards` directly in the page with a heading).

**Changed**
- `src/components/sections/SolutionTabs.tsx` — additive hash/key support (§7); add icons to
  `IconName` if any new ones are needed (Activity, Zap, Globe already exist).
- `src/components/sections/ContactForm.tsx` — read `intent`/`strategy` params, prefill (§8).
- `src/app/solutions/ci-solar-storage/page.tsx` — remove in-hero `SolarCalculator`; add
  `StrategyFinder` section; pass the five strategy tabs (no financing tab) to `SolutionTabs`;
  add `FinancingBand` below; add the hero secondary "Find your strategy ↓" link.

**Untouched**
- `SolarCalculator.tsx` is CI-only; it is removed from the CI page and either left in place
  unused or deleted in cleanup (open item #4). Other verticals' calculators and pages:
  unchanged. `FinancingCards.tsx`: unchanged.

---

## 10. Testing

- **`recommendStrategy` (TDD, primary focus):** table-driven unit tests covering every
  branch and tie-break:
  - goal backup → backup-resilience; goal independence → off-grid (regardless of tariff).
  - cut-bill × {demand yes/no/unknown} × {flat/tou/block/unknown} → expected primary +
    secondary (esp. demand+tou → demand-shaving with arbitrage secondary).
  - topology derivation for grid-tied across the three usage values.
  - caveated default when both energyRate and demandCharge are unknown.
- **Wizard interaction:** branching (backup/independence skips Q2/Q3); changing the goal
  resets downstream answers; reveal shows the expected strategy.
- **Deep-link:** selecting "Read about X" sets the hash and the correct tab opens/scrolls.
- **Contact prefill:** `/contact?intent=client&strategy=demand-shaving` lands on step 2 with
  the templated message; unknown params degrade gracefully.

---

## 11. Analytics

Extend existing `dlPush` usage:
- `strategy_finder_start` — first interaction.
- `strategy_finder_complete` — `{ goal, energy_rate, demand_charge, usage, strategy }`.
- `strategy_learn_more` — `{ strategy }` when a "Read about" deep-link is used.
- Existing `tab_change` continues to fire on tab/accordion changes.

---

## 12. Accessibility & responsive

- Questions are radio groups with labels + hints; keyboard navigable; focus moves to the new
  step on advance; the reveal is announced (`aria-live="polite"`).
- Respect `prefers-reduced-motion` for step/scroll transitions.
- Mobile: wizard stacks full-width; reveal full-width; tabs use the existing accordion —
  a deep-link opens the right accordion item and scrolls to it.

---

## 13. Open items

| # | Item | Owner |
|---|---|---|
| 1 | Final copy for the five strategy tabs (repurpose existing Solar/Battery copy) | Dev + Client |
| 2 | Confirm tab order and labels ("Backup & Resilience" vs "Backup") | Client |
| 3 | Update `specs/07-SOLUTIONS.md` CI tab list + pain-section note to reflect this change | Dev |
| 4 | Decide whether to delete `SolarCalculator.tsx` or leave it unused | Dev |

---

*Design for the C&I Solar & Storage Strategy Finder. Supersedes the in-hero `SolarCalculator`
on `/solutions/ci-solar-storage` only.*

# Wheeling Model Flow Diagrams — Design

> Status: approved-pending-review · Date: 2026-07-01 · Vertical: `wheeling` (coral `#D97C76`, teal companion `#39575C`)

## Goal

Add a data-driven **box-and-arrow flow diagram** beside each of the three Wheeling model tabs
(Direct / Virtual / Micro), showing how energy and money move — most importantly the Virtual
Wheeling **credit/refund** mechanism (pay the municipality as normal → the municipality credits the
IPP → the IPP withholds its PPA amount and refunds the balance).

## Background

`SolutionTabs` (`src/components/sections/SolutionTabs.tsx`) renders each tab's panel via
`renderPanelBody`. Today: a tab with `chartKey` renders a two-column layout (text left,
`StrategyProfileChart` right, `lg:grid-cols-2 lg:items-center`); otherwise the text renders in a
`max-w-[640px]` single column. The three Wheeling model tabs currently render text-only with empty
right space. The `imageBg`/`imageEmoji` fields on `TabItem` are vestigial (not rendered) — leave them.

Integration approach: keep `SolutionTabs` generic. Add an optional `diagram?: React.ReactNode` slot to
`TabItem`; when present, render the two-column layout with the node in the right column. The page
supplies `<WheelingFlowDiagram flow={…} accent={meta.accent} />`. This mirrors the existing coupling
to `StrategyProfileChart`/`FinancingCards` but does not make `SolutionTabs` aware of anything
wheeling-specific.

---

## 1. `SolutionTabs` change (generic diagram slot)

- Add to `TabItem`: `diagram?: React.ReactNode;` (optional; documented as "optional visual rendered in the right column, beside the panel text").
- In `renderPanelBody`, the two-column branch fires when `tab.chartKey` **or** `tab.diagram` is set:
  - `chartKey` → right column is `<StrategyProfileChart strategyKey={tab.chartKey} />` (unchanged, keeps `lg:items-center`).
  - `diagram` → right column is `{tab.diagram}`, and the grid uses `lg:items-start` (the Wheeling tabs have long bullet lists; centering the diagram against tall text looks unbalanced).
- If neither is set → unchanged `max-w-[640px]` single column.
- No change to the mobile accordion path (it calls the same `renderPanelBody`, so the diagram stacks below the text there too).

## 2. `WheelingFlowDiagram` component

`src/components/sections/WheelingFlowDiagram.tsx` — a pure presentational component (no hooks, no
`'use client'`; safe to render statically).

Props:
```ts
import type { WheelingFlow } from '@/config/wheelingFlows';
interface WheelingFlowDiagramProps { flow: WheelingFlow; accent: string; }
export function WheelingFlowDiagram({ flow, accent }: WheelingFlowDiagramProps): JSX.Element
```

Layout — a light card `rounded-2xl border border-[#E5E7EB] bg-[#F5F5F5] p-5 md:p-6`, containing:

1. **Legend** (top-right, tiny): `— energy` (solid swatch in `accent`) and `┄ money` (dashed swatch in `#39575C`).
2. **Energy path** — `flow.energy` rendered as a chain of node chips joined by arrows:
   - Each node: a chip `rounded-lg bg-white border border-[#E5E7EB] px-3 py-2`, label in `font-display font-bold text-sm text-[#1A1A1A]`, optional `sub` in `text-xs text-[#6B7280]`. A node with `emphasis: true` gets a coral left-accent (`border-l-[3px]` in `accent`) to mark "Your site".
   - Arrows between nodes: solid, coloured `accent`. Horizontal (`→`) on `sm+`; the chain switches to vertical (`↓`) stacking on mobile (`flex-col sm:flex-row`).
3. **Money flow** — a titled block:
   - Title: `flow.moneyTitle` in `font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280]`.
   - Each `flow.money` step as a row: `[from] ┄▶ [to]` with the two endpoints as small chips (`text-xs font-semibold`), a dashed arrow in `#39575C`, and the `label` in `font-body text-sm text-[#374151]` beneath/beside. Rows stack vertically (`space-y-3`). Virtual has three rows; Direct/Micro have two.
4. **Footer chip** — `flow.footer` in a full-width pill `rounded-lg bg-white border border-[#E5E7EB] px-3 py-2 text-xs text-[#374151]`, with a coral left-accent bar.

Colour rule (brand): energy uses the `accent` (coral) at full for arrows and the emphasis bar; money
uses `#39575C` (teal). Both are used as thin arrows/bars only — no dominant fills (brand rule §8).

Accessibility: the diagram is decorative-but-informative; give the card `role="img"` and an
`aria-label` summarising the flow (e.g. Virtual: "Energy flows from the IPP through the grid to your
site. You pay your municipal bill; the municipality credits the IPP; the IPP refunds you the
balance."). The `aria-label` string is part of each flow's data (`flow.summary`).

## 3. Flow data — `src/config/wheelingFlows.ts`

```ts
export interface FlowNode { label: string; sub?: string; emphasis?: boolean; }
export interface MoneyStep { from: string; to: string; label: string; }
export interface WheelingFlow {
  energy: FlowNode[];      // horizontal chain joined by energy arrows (2–3 nodes)
  moneyTitle: string;      // kicker above the money rows
  money: MoneyStep[];      // dashed money arrows (1–3 rows)
  footer: string;          // footer pill — Phoenix's role / the key distinction
  summary: string;         // aria-label describing the whole flow
}
```

**DIRECT_FLOW**
- energy: `[{ label: 'IPP', sub: 'renewable generator' }, { label: 'Eskom grid' }, { label: 'Your site', emphasis: true }]`
- moneyTitle: `How you pay`
- money:
  - `{ from: 'You', to: 'IPP', label: 'Fixed PPA tariff, below your Eskom rate' }`
  - `{ from: 'You', to: 'Eskom', label: 'Network / use-of-system charges' }`
- footer: `Managed by Phoenix — trading, settlement & compliance.`
- summary: `Energy flows from the IPP through the Eskom grid to your site. You pay the IPP a fixed PPA tariff below your Eskom rate, plus Eskom network charges.`

**VIRTUAL_FLOW**
- energy: `[{ label: 'IPP', sub: 'renewable generator' }, { label: 'Grid', sub: 'virtually allocated' }, { label: 'Your site', emphasis: true }]`
- moneyTitle: `How you're credited`
- money:
  - `{ from: 'You', to: 'Municipality', label: 'Pay your municipal bill as normal' }`
  - `{ from: 'Municipality', to: 'IPP', label: 'Wheeled generation credited to the IPP' }`
  - `{ from: 'IPP', to: 'You', label: 'PPA withheld, balance refunded to you' }`
- footer: `No change to your existing municipal connection.`
- summary: `Energy flows from the IPP through the grid and is virtually allocated to your site. You pay your municipal bill as normal, the municipality credits the IPP, and the IPP withholds its PPA amount and refunds the balance to you.`

**MICRO_FLOW**
- energy: `[{ label: 'Your ~1 MW plant', sub: 'you own it' }, { label: 'Grid' }, { label: 'Your site', emphasis: true }]`
- moneyTitle: `How you pay`
- money:
  - `{ from: 'You', to: 'Plant', label: 'Own the asset — buy or finance' }`
  - `{ from: 'You', to: 'Grid', label: 'Network / wheeling charges only' }`
- footer: `You own the plant — capture the full generation value.`
- summary: `You own a dedicated ~1 MW plant whose energy is wheeled through the grid to your site. You fund the plant and pay only network and wheeling charges — no third-party PPA.`

## 4. Page wiring — `src/app/solutions/wheeling/page.tsx`

Import `WheelingFlowDiagram` and the three flows. Add to each model tab object a `diagram` prop:
```tsx
diagram: <WheelingFlowDiagram flow={DIRECT_FLOW}  accent={meta.accent} />   // Direct
diagram: <WheelingFlowDiagram flow={VIRTUAL_FLOW} accent={meta.accent} />   // Virtual
diagram: <WheelingFlowDiagram flow={MICRO_FLOW}   accent={meta.accent} />   // Micro
```
(`meta.accent` is already `SOLUTION_META['wheeling'].accent === '#D97C76'`, in module scope.)

## 5. Files

- **Create:** `src/config/wheelingFlows.ts`, `src/components/sections/WheelingFlowDiagram.tsx`
- **Modify:** `src/components/sections/SolutionTabs.tsx` (add `diagram?` to `TabItem`; two-column branch also fires on `diagram`, `lg:items-start`), `src/app/solutions/wheeling/page.tsx` (import + `diagram` on the 3 model tabs)

## 6. Out of scope (YAGNI)

- No animation, no SVG illustration, no interactivity — a static schematic.
- No change to `imageBg`/`imageEmoji` (vestigial).
- The diagram is wheeling-only right now; `SolutionTabs` stays generic (`diagram?: ReactNode`) so any future page can reuse the slot without wheeling coupling.

## 7. Testing

- No logic to unit-test (pure presentational + static data). Verify with `npx tsc --noEmit`,
  `npm run lint` (no new issues in the created/modified files), and `npm run build`
  (`/solutions/wheeling` statically generates).
- Manual: each tab shows its diagram right of the text on `lg`, stacked on mobile; Virtual shows the
  three-step credit/refund money flow.

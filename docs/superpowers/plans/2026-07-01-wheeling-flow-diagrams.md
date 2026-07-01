# Wheeling Model Flow Diagrams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a data-driven box-and-arrow flow diagram beside each of the three Wheeling model tabs (Direct / Virtual / Micro), showing how energy and money move — including the Virtual credit/refund loop.

**Architecture:** A pure presentational `WheelingFlowDiagram` component driven by per-model data in `wheelingFlows.ts`. `SolutionTabs` gains a generic optional `diagram?: React.ReactNode` slot (mirroring its existing `chartKey` two-column pattern) so it stays wheeling-agnostic; the page passes `<WheelingFlowDiagram flow={…} accent={meta.accent} />` into each model tab.

**Tech Stack:** Next.js App Router, TypeScript (strict), Tailwind (arbitrary hex tokens). No new deps. No unit tests (pure presentational + static data) — verified by tsc/lint/build.

## Global Constraints

- TypeScript strict — no `any`. Named exports only (no default exports).
- Tailwind arbitrary hex tokens are the house convention (`text-[#1A1A1A]`, `bg-[#F5F5F5]`, `border-[#E5E7EB]`).
- Colours: energy arrows/emphasis = wheeling accent coral `#D97C76` (passed in as `accent`); money arrows = teal `#39575C`. Both are thin arrows/bars only — no dominant fills (brand rule: accents subtle).
- Do NOT modify the vestigial `imageBg`/`imageEmoji` fields. Do NOT touch the pre-existing `SolutionTabs.tsx` line ~208 ref-during-render lint error (out of scope).
- Commit messages end with: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

### Task 1: Flow data config + WheelingFlowDiagram component

**Files:**
- Create: `src/config/wheelingFlows.ts`
- Create: `src/components/sections/WheelingFlowDiagram.tsx`

**Interfaces:**
- Produces:
  - `FlowNode { label: string; sub?: string; emphasis?: boolean }`
  - `MoneyStep { from: string; to: string; label: string }`
  - `WheelingFlow { energy: FlowNode[]; moneyTitle: string; money: MoneyStep[]; footer: string; summary: string }`
  - `DIRECT_FLOW`, `VIRTUAL_FLOW`, `MICRO_FLOW: WheelingFlow`
  - `WheelingFlowDiagram({ flow, accent }: { flow: WheelingFlow; accent: string })` — named export, pure component.

- [ ] **Step 1: Create the flow data config**

`src/config/wheelingFlows.ts`:
```ts
export interface FlowNode {
  label: string;
  sub?: string;
  emphasis?: boolean; // highlights the "Your site" node
}

export interface MoneyStep {
  from: string;
  to: string;
  label: string;
}

export interface WheelingFlow {
  energy: FlowNode[];   // horizontal chain joined by energy arrows (2–3 nodes)
  moneyTitle: string;   // kicker above the money rows
  money: MoneyStep[];   // dashed money arrows (1–3 rows)
  footer: string;       // footer pill — Phoenix's role / the key distinction
  summary: string;      // aria-label describing the whole flow
}

export const DIRECT_FLOW: WheelingFlow = {
  energy: [
    { label: 'IPP', sub: 'renewable generator' },
    { label: 'Eskom grid' },
    { label: 'Your site', emphasis: true },
  ],
  moneyTitle: 'How you pay',
  money: [
    { from: 'You', to: 'IPP', label: 'Fixed PPA tariff, below your Eskom rate' },
    { from: 'You', to: 'Eskom', label: 'Network / use-of-system charges' },
  ],
  footer: 'Managed by Phoenix — trading, settlement & compliance.',
  summary:
    'Energy flows from the IPP through the Eskom grid to your site. You pay the IPP a fixed PPA tariff below your Eskom rate, plus Eskom network charges.',
};

export const VIRTUAL_FLOW: WheelingFlow = {
  energy: [
    { label: 'IPP', sub: 'renewable generator' },
    { label: 'Grid', sub: 'virtually allocated' },
    { label: 'Your site', emphasis: true },
  ],
  moneyTitle: "How you're credited",
  money: [
    { from: 'You', to: 'Municipality', label: 'Pay your municipal bill as normal' },
    { from: 'Municipality', to: 'IPP', label: 'Wheeled generation credited to the IPP' },
    { from: 'IPP', to: 'You', label: 'PPA withheld, balance refunded to you' },
  ],
  footer: 'No change to your existing municipal connection.',
  summary:
    'Energy flows from the IPP through the grid and is virtually allocated to your site. You pay your municipal bill as normal, the municipality credits the IPP, and the IPP withholds its PPA amount and refunds the balance to you.',
};

export const MICRO_FLOW: WheelingFlow = {
  energy: [
    { label: 'Your ~1 MW plant', sub: 'you own it' },
    { label: 'Grid' },
    { label: 'Your site', emphasis: true },
  ],
  moneyTitle: 'How you pay',
  money: [
    { from: 'You', to: 'Plant', label: 'Own the asset — buy or finance' },
    { from: 'You', to: 'Grid', label: 'Network / wheeling charges only' },
  ],
  footer: 'You own the plant — capture the full generation value.',
  summary:
    'You own a dedicated ~1 MW plant whose energy is wheeled through the grid to your site. You fund the plant and pay only network and wheeling charges — no third-party PPA.',
};
```

- [ ] **Step 2: Create the WheelingFlowDiagram component**

`src/components/sections/WheelingFlowDiagram.tsx`:
```tsx
import type { WheelingFlow } from '@/config/wheelingFlows';

const MONEY = '#39575C';

interface WheelingFlowDiagramProps {
  flow: WheelingFlow;
  accent: string;
}

export function WheelingFlowDiagram({ flow, accent }: WheelingFlowDiagramProps) {
  return (
    <div
      role="img"
      aria-label={flow.summary}
      className="rounded-2xl border border-[#E5E7EB] bg-[#F5F5F5] p-5 md:p-6"
    >
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-1.5 font-body text-[0.7rem] text-[#6B7280]">
          <span className="inline-block w-4" style={{ borderTop: `2px solid ${accent}` }} />
          energy
        </span>
        <span className="flex items-center gap-1.5 font-body text-[0.7rem] text-[#6B7280]">
          <span className="inline-block w-4" style={{ borderTop: `2px dashed ${MONEY}` }} />
          money
        </span>
      </div>

      {/* Energy path */}
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        {flow.energy.map((node, i) => (
          <div key={node.label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:flex-1">
            <div
              className="w-full rounded-lg bg-white border border-[#E5E7EB] px-3 py-2"
              style={node.emphasis ? { borderLeft: `3px solid ${accent}` } : undefined}
            >
              <p className="font-display font-bold text-sm text-[#1A1A1A] leading-tight">{node.label}</p>
              {node.sub && (
                <p className="font-body text-xs text-[#6B7280] leading-tight mt-0.5">{node.sub}</p>
              )}
            </div>
            {i < flow.energy.length - 1 && (
              <span aria-hidden className="self-center font-bold leading-none" style={{ color: accent }}>
                <span className="hidden sm:inline">→</span>
                <span className="sm:hidden">↓</span>
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Money flow */}
      <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-2.5">
        {flow.moneyTitle}
      </p>
      <div className="space-y-3 mb-4">
        {flow.money.map((step) => (
          <div key={`${step.from}->${step.to}: ${step.label}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-body text-xs font-semibold text-[#1A1A1A]">{step.from}</span>
              <span aria-hidden className="inline-flex items-center" style={{ color: MONEY }}>
                <span className="inline-block w-5" style={{ borderTop: `2px dashed ${MONEY}` }} />
                <span className="text-[9px] -ml-1 leading-none">▶</span>
              </span>
              <span className="font-body text-xs font-semibold text-[#1A1A1A]">{step.to}</span>
            </div>
            <p className="font-body text-sm text-[#374151] leading-snug">{step.label}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="rounded-lg bg-white border border-[#E5E7EB] px-3 py-2"
        style={{ borderLeft: `3px solid ${accent}` }}
      >
        <p className="font-body text-xs text-[#374151] leading-snug">{flow.footer}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify types and lint**

Run: `npx tsc --noEmit` → Expected: clean (exit 0).
Run: `npm run lint` → Expected: no NEW errors/warnings in `wheelingFlows.ts` or `WheelingFlowDiagram.tsx` (pre-existing issues elsewhere are fine).

- [ ] **Step 4: Commit**

```bash
git add src/config/wheelingFlows.ts src/components/sections/WheelingFlowDiagram.tsx
git commit -m "feat(wheeling): flow-diagram component + per-model flow data" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Generic diagram slot in SolutionTabs + wire the 3 model tabs

**Files:**
- Modify: `src/components/sections/SolutionTabs.tsx`
- Modify: `src/app/solutions/wheeling/page.tsx`

**Interfaces:**
- Consumes: `WheelingFlowDiagram`, `DIRECT_FLOW`, `VIRTUAL_FLOW`, `MICRO_FLOW` (Task 1); `SOLUTION_META['wheeling'].accent` (already imported as `meta` in the page).

- [ ] **Step 1: Add the generic `diagram` slot to TabItem**

In `src/components/sections/SolutionTabs.tsx`, in the `TabItem` interface, add this line immediately after the `chartKey?: string;` line:
```ts
  diagram?: React.ReactNode;              // optional visual rendered right of the panel text (two-column on lg)
```

- [ ] **Step 2: Render the diagram in a two-column layout**

In `renderPanelBody`, the tail currently reads:
```tsx
    // With a chart: side-by-side on large screens (text left, chart right), stacked on mobile.
    if (tab.chartKey) {
      return (
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {textBlock}
          <StrategyProfileChart strategyKey={tab.chartKey} />
        </div>
      );
    }

    return <div className="max-w-[640px]">{textBlock}</div>;
```
Replace it with:
```tsx
    // With a chart: side-by-side on large screens (text left, chart right), stacked on mobile.
    if (tab.chartKey) {
      return (
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {textBlock}
          <StrategyProfileChart strategyKey={tab.chartKey} />
        </div>
      );
    }

    // With a diagram (e.g. wheeling flow): text left, diagram right, top-aligned (panels have long lists).
    if (tab.diagram) {
      return (
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {textBlock}
          {tab.diagram}
        </div>
      );
    }

    return <div className="max-w-[640px]">{textBlock}</div>;
```

- [ ] **Step 3: Import the diagram + flows in the wheeling page**

In `src/app/solutions/wheeling/page.tsx`, add these imports alongside the existing component imports (after the `WheelingEligibility` import line):
```ts
import { WheelingFlowDiagram } from '@/components/sections/WheelingFlowDiagram';
import { DIRECT_FLOW, VIRTUAL_FLOW, MICRO_FLOW } from '@/config/wheelingFlows';
```

- [ ] **Step 4: Add a `diagram` to each model tab**

In the `tabs` array, add a `diagram` property to each model tab object (place it right after that tab's `imageEmoji` line):

- Direct Wheeling tab (`key: 'model-direct'`, `imageEmoji: '🔌'`):
```tsx
    diagram: <WheelingFlowDiagram flow={DIRECT_FLOW} accent={meta.accent} />,
```
- Virtual Wheeling tab (`key: 'model-virtual'`, `imageEmoji: '🌐'`):
```tsx
    diagram: <WheelingFlowDiagram flow={VIRTUAL_FLOW} accent={meta.accent} />,
```
- Micro-wheeling tab (`key: 'model-micro'`, `imageEmoji: '🏭'`):
```tsx
    diagram: <WheelingFlowDiagram flow={MICRO_FLOW} accent={meta.accent} />,
```

- [ ] **Step 5: Verify types, lint, and build**

Run: `npx tsc --noEmit` → Expected: clean.
Run: `npm run lint` → Expected: no NEW errors in the two modified files.
Run: `npm run build` → Expected: `✓ Compiled successfully`, and `/solutions/wheeling` listed as statically generated (○).

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/SolutionTabs.tsx src/app/solutions/wheeling/page.tsx
git commit -m "feat(wheeling): render per-model flow diagrams beside the model tabs" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Notes for the implementer

- `React.ReactNode` is used as a type in `TabItem` without a default `import React` — this matches the existing file (it already uses `React.ReactNode` in `ICON_MAP`). Do not add `import React`.
- The `meta` binding in `wheeling/page.tsx` is `SOLUTION_META['wheeling']`; `meta.accent === '#D97C76'`. Use `meta.accent`, not a hardcoded hex, in the page.
- Preserve the en-dashes (—) and `~1 MW` in the flow data verbatim.

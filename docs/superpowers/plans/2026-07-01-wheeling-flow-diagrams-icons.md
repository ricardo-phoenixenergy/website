# Wheeling Flow Diagrams — Icon Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the wheeling model flow diagrams so the energy path renders as vertical icon-badge nodes (IPP / Grid / Site) with one-line descriptions, dropping the legend; money rows and footer stay as-is.

**Architecture:** Two coupled file edits — `wheelingFlows.ts` gains an `icon` field on `FlowNode` (and `sub`→`desc`), and `WheelingFlowDiagram.tsx` renders the energy nodes as a vertical icon stack using `IconSun`/`IconGlobe`/`IconBuilding`. `SolutionTabs` and the page are untouched. One task (the type change breaks the component until both are updated).

**Tech Stack:** Next.js App Router, TypeScript (strict), Tailwind (arbitrary hex tokens). No new deps, no tests (presentational + static data) — verified by tsc/lint/build.

## Global Constraints

- TypeScript strict — no `any`. Named exports only.
- Tailwind arbitrary hex tokens (`text-[#1A1A1A]`, `bg-[#F5F5F5]`, `border-[#E5E7EB]`).
- Energy accent = coral, passed in as the `accent` prop (do not hardcode); money = teal `#39575C`.
- Icons only from `@/components/ui/Icons`: `IconSun`, `IconGlobe`, `IconBuilding`.
- Do NOT modify `SolutionTabs.tsx` or `wheeling/page.tsx`.
- Commit messages end with: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

### Task 1: Icon nodes in the wheeling flow diagram

**Files:**
- Modify: `src/config/wheelingFlows.ts` (FlowNode shape + per-model `energy` nodes)
- Modify: `src/components/sections/WheelingFlowDiagram.tsx` (icon map, vertical icon-node energy path, remove legend)

**Interfaces:**
- Produces: `FlowIcon = 'sun' | 'globe' | 'building'`; `FlowNode { icon: FlowIcon; label: string; desc: string; emphasis?: boolean }` (consumed by the component). `WheelingFlow`, `MoneyStep`, and the three exported flows keep their names.

- [ ] **Step 1: Update the flow config**

Replace the full contents of `src/config/wheelingFlows.ts` with:
```ts
export type FlowIcon = 'sun' | 'globe' | 'building';

export interface FlowNode {
  icon: FlowIcon;
  label: string;
  desc: string;          // one-line description of the node
  emphasis?: boolean;    // highlights the "Your site" node
}

export interface MoneyStep {
  from: string;
  to: string;
  label: string;
}

export interface WheelingFlow {
  energy: FlowNode[];   // vertical icon-node chain
  moneyTitle: string;   // kicker above the money rows
  money: MoneyStep[];   // dashed money arrows (1–3 rows)
  footer: string;       // footer pill — Phoenix's role / the key distinction
  summary: string;      // aria-label describing the whole flow
}

export const DIRECT_FLOW: WheelingFlow = {
  energy: [
    { icon: 'sun', label: 'IPP', desc: 'Independent renewable generator produces the power.' },
    { icon: 'globe', label: 'Eskom grid', desc: "Wheeled to you across Eskom's transmission grid." },
    { icon: 'building', label: 'Your site', desc: 'Uses the power at a fixed tariff below your Eskom rate.', emphasis: true },
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
    { icon: 'sun', label: 'IPP', desc: 'Independent renewable generator produces the power.' },
    { icon: 'globe', label: 'The grid', desc: 'Wheeled across the grid, virtually allocated to your meter.' },
    { icon: 'building', label: 'Your site', desc: 'Uses the power at a lower effective rate.', emphasis: true },
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
    { icon: 'sun', label: 'Your ~1 MW plant', desc: 'A dedicated plant you own generates the power.' },
    { icon: 'globe', label: 'The grid', desc: 'Wheeled directly to your point of consumption.' },
    { icon: 'building', label: 'Your site', desc: 'Powered by your own asset — you keep the full value.', emphasis: true },
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

- [ ] **Step 2: Rewrite the component**

Replace the full contents of `src/components/sections/WheelingFlowDiagram.tsx` with:
```tsx
import type { WheelingFlow, FlowIcon } from '@/config/wheelingFlows';
import { IconSun, IconGlobe, IconBuilding } from '@/components/ui/Icons';

const MONEY = '#39575C';

const NODE_ICON: Record<FlowIcon, (size: number) => React.ReactNode> = {
  sun: (s) => <IconSun size={s} />,
  globe: (s) => <IconGlobe size={s} />,
  building: (s) => <IconBuilding size={s} />,
};

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
      {/* Energy path — icon nodes, vertical stack with dashed connectors */}
      <div className="mb-5">
        {flow.energy.map((node, i) => (
          <div key={node.label}>
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: node.emphasis ? 'rgba(217,124,118,0.20)' : 'rgba(217,124,118,0.14)',
                  color: accent,
                  ...(node.emphasis ? { boxShadow: `inset 3px 0 0 ${accent}` } : {}),
                }}
              >
                {NODE_ICON[node.icon](20)}
              </div>
              <div className="pt-0.5">
                <p className="font-display font-bold text-sm text-[#1A1A1A] leading-tight">{node.label}</p>
                <p className="font-body text-xs text-[#6B7280] leading-snug mt-0.5">{node.desc}</p>
              </div>
            </div>
            {i < flow.energy.length - 1 && (
              <div aria-hidden className="ml-5 my-1" style={{ height: 16, borderLeft: `2px dashed ${accent}` }} />
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

- [ ] **Step 3: Verify types, lint, build**

Run: `npx tsc --noEmit` → Expected: clean.
Run: `npx eslint src/config/wheelingFlows.ts src/components/sections/WheelingFlowDiagram.tsx` → Expected: no errors.
Run: `npm run build` → Expected: `✓ Compiled successfully`; `/solutions/wheeling` statically generated (○).

- [ ] **Step 4: Commit**

```bash
git add src/config/wheelingFlows.ts src/components/sections/WheelingFlowDiagram.tsx
git commit -m "feat(wheeling): icon-node flow diagrams (IPP / grid / site)" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Notes for the implementer

- `React.ReactNode` in the `NODE_ICON` map type needs no `import React` (matches the codebase convention in `SolutionTabs.tsx`).
- The `ml-5` (20px) connector indent centres the dashed line under the 40px icon badge. Keep it.
- Preserve the en-dashes (—), `~1 MW`, and curly apostrophe in "Eskom's" verbatim.

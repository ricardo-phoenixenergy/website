# Wheeling Flow Diagrams — Icon Redesign

> Status: approved-pending-review · Date: 2026-07-01 · Supersedes the visual of the box-and-arrow diagram from `2026-07-01-wheeling-flow-diagrams-design.md` (Layout A, chosen via visual-companion mock-ups)

## Goal

Replace the text-chip energy path in the wheeling model diagrams with **icon-badge nodes**, each carrying a short description of what the IPP, the grid, and the site are. Keep the money-flow rows and footer. Vertical "stepped" layout (mock-up option A).

## Background

Current `WheelingFlowDiagram` (`src/components/sections/WheelingFlowDiagram.tsx`) renders the energy path as a horizontal row of plain label chips joined by `→`/`↓` arrows, plus a legend, money rows, and a footer. The user found the plain chips unclear. The redesign turns each energy node into an icon + label + one-line description, stacked vertically, and drops the legend. Money rows and footer are unchanged. No change to `SolutionTabs` (still the generic `diagram?: ReactNode` slot). This is a rework of two files only.

Icons come from the existing `@/components/ui/Icons` set: `IconSun`, `IconGlobe`, `IconBuilding` (all confirmed present).

## 1. Data change — `src/config/wheelingFlows.ts`

`FlowNode` gains an `icon` field and keeps a one-line description (rename `sub` → `desc` for clarity):
```ts
export type FlowIcon = 'sun' | 'globe' | 'building';

export interface FlowNode {
  icon: FlowIcon;
  label: string;
  desc: string;          // one-line description of the node
  emphasis?: boolean;    // highlights "Your site"
}
```
`MoneyStep`, `WheelingFlow` (`energy`, `moneyTitle`, `money`, `footer`, `summary`) are unchanged except `energy: FlowNode[]` now uses the new shape.

Per-model `energy` nodes:

**DIRECT_FLOW.energy**
- `{ icon: 'sun', label: 'IPP', desc: 'Independent renewable generator produces the power.' }`
- `{ icon: 'globe', label: 'Eskom grid', desc: "Wheeled to you across Eskom's transmission grid." }`
- `{ icon: 'building', label: 'Your site', desc: 'Uses the power at a fixed tariff below your Eskom rate.', emphasis: true }`

**VIRTUAL_FLOW.energy**
- `{ icon: 'sun', label: 'IPP', desc: 'Independent renewable generator produces the power.' }`
- `{ icon: 'globe', label: 'The grid', desc: 'Wheeled across the grid, virtually allocated to your meter.' }`
- `{ icon: 'building', label: 'Your site', desc: 'Uses the power at a lower effective rate.', emphasis: true }`

**MICRO_FLOW.energy**
- `{ icon: 'sun', label: 'Your ~1 MW plant', desc: 'A dedicated plant you own generates the power.' }`
- `{ icon: 'globe', label: 'The grid', desc: 'Wheeled directly to your point of consumption.' }`
- `{ icon: 'building', label: 'Your site', desc: 'Powered by your own asset — you keep the full value.', emphasis: true }`

`moneyTitle`, `money`, `footer`, `summary` for all three models: **unchanged** from the current file.

## 2. Component change — `src/components/sections/WheelingFlowDiagram.tsx`

- Add an icon map: `{ sun: IconSun, globe: IconGlobe, building: IconBuilding }` (import those three from `@/components/ui/Icons`).
- **Remove** the legend block.
- **Energy path** becomes a vertical stack. Each node:
  - a `40×40` rounded icon badge — `background: rgba(217,124,118,0.14)` (accent tint), `color: accent`; the `emphasis` node gets a stronger tint + coral left-bar (`inset 3px 0 0 accent`) to mark "Your site".
  - to its right: `label` (`font-display font-bold text-sm text-[#1A1A1A]`) and `desc` (`font-body text-xs text-[#6B7280] leading-snug`).
  - between consecutive nodes: a short vertical coral dashed connector (`border-left: 2px dashed accent`, ~16px tall, indented to sit under the badge centre).
- **Money flow** (`moneyTitle` + `money` rows) and the **footer chip**: unchanged from the current component.
- Card container unchanged: `rounded-2xl border border-[#E5E7EB] bg-[#F5F5F5] p-5 md:p-6`, `role="img"`, `aria-label={flow.summary}`.
- Props unchanged: `{ flow: WheelingFlow; accent: string }`.

Colours: energy accent = coral (passed-in `accent`); money teal `#39575C` (unchanged).

## 3. Files

- **Modify:** `src/config/wheelingFlows.ts` (FlowNode shape + per-model energy nodes)
- **Modify:** `src/components/sections/WheelingFlowDiagram.tsx` (icon map, vertical icon-node energy path, remove legend)

No change to `wheeling/page.tsx` (it already passes `<WheelingFlowDiagram flow={…} accent={meta.accent} />`).

## 4. Out of scope (YAGNI)

- No new icons, no SVG illustration, no animation.
- Money rows / footer copy unchanged.
- `SolutionTabs` untouched.

## 5. Testing

- No logic to unit-test (presentational + static data). Verify with `npx tsc --noEmit`, `npm run lint` (no new issues in the two files), `npm run build` (`/solutions/wheeling` statically generates).
- Manual: each model tab shows three icon nodes (Sun/Globe/Building) with descriptions, connectors, the money rows, and footer; Virtual still shows the 3-step credit/refund.

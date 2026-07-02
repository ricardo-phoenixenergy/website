# Fleet Savings Estimator — Stepped Form (Design Spec)

> Version 1.0 | 2026-07-02 | Component: `src/components/sections/calculators/FleetSavingsEstimator.tsx`

## Goal

The EV Fleets hero estimator shows all five inputs plus a large results block at
once, making the widget very tall and overwhelming (especially on mobile).
Reorganise the existing controls into a **3-step wizard** so only one group is
visible at a time, cutting the widget's height.

## Scope

**Only** `FleetSavingsEstimator.tsx` changes. No change to the calc
(`estimate.ts`), the Sanity reader/prices, `CostPerKmBars`, the page, or the
component's props (`{ prices: ResolvedEnergyPrices }`). All existing state,
derived values, handlers (`selectType`, `touch`, petrol-disable logic), and the
`fleet_estimate_used` analytics event are preserved. This is a presentational
reorganisation with no new tested logic.

## Global Constraints

- TypeScript strict, no `any`; named export only.
- Curly apostrophes (U+2019) in `.tsx` string literals; JSX HTML entities
  (`&rarr;`, `&larr;`, `&#8322;`) in JSX text.
- Tailwind arbitrary-hex tokens; dark-on-hero styling unchanged.
- Framer Motion for the step transition (project animation standard; v12 present).
- Verify: `npx tsc --noEmit`, `npx eslint <file>`, `npm run build`
  (`○ /solutions/ev-fleets` stays static). No render-phase set-state (keep the
  fuel reset in the `selectType` handler).

## Design

### State
Add `const [step, setStep] = useState(0)` — `0` = Your fleet, `1` = Usage &
charging, `2` = Your savings. All other state is unchanged.

### Header (persists on every step)
- Eyebrow `Estimate your fleet savings` (unchanged).
- A row with a **progress indicator**: three pill dots (current = wider, done =
  accent, upcoming = faint white) + a `Step X of 3` label. Dots `aria-hidden`.

### Steps (rendered one at a time)
Wrap the active step's content in a `motion.div` **keyed by `step`** with a light
enter animation (`initial {opacity:0, y:6}` → `animate {opacity:1, y:0}`,
`duration ~0.18`). Keying by `step` replays the fade on each change; no
`AnimatePresence` needed (avoids the empty-gap collapse of `mode="wait"`).

- **Step 0 — Your fleet:** Number of vehicles (slider) + Vehicle type (5 buttons,
  via `selectType`).
- **Step 1 — Usage & charging:** Current fuel (Diesel / Petrol 93, petrol
  disabled for diesel-only vehicles) + Distance (slider) + Charging source.
- **Step 2 — Your savings:** the existing outputs block verbatim — monthly
  headline, Annual/5-year, cost-per-km bars + price caption, CO₂ row, disclaimer.

### Navigation (below the animated region, per step)
- Step 0: right-aligned primary `Next &rarr;` → `setStep(1)`.
- Step 1: secondary `&larr; Back` → `setStep(0)` (left) and primary
  `See savings &rarr;` → `setStep(2)` (right).
- Step 2: secondary `&larr; Edit inputs` → `setStep(0)` (left).
- Primary buttons: `background: ACCENT, color: ACCENT_TEXT`. Secondary: the
  existing `UNSELECTED_BTN` style. No input validation gates navigation (every
  input has a valid default; Next is always enabled).

### Behaviour notes
- Results are always live (derived from state), so returning to edit and changing
  any input updates Step 2 on return.
- Formatting is unchanged from the current component (out of scope: the
  carry-over `toLocaleString('en-ZA')` Minor, already assessed low-risk).

## Non-goals
- No calc, price, page, or analytics-schema changes.
- No clickable progress dots / step-jumping (YAGNI).
- No height auto-animation between steps.

## Open items
- None.

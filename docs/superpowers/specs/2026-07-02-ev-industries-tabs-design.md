# EV Fleets — Industries as Tabs (Design Spec)

> Version 1.0 | 2026-07-02 | Route: `/solutions/ev-fleets`, §5 "Built for your operation"

## Goal

Replace the §5 industries `ExplainerCards` 6-card grid with a `SolutionTabs`
block (the same tabbed pattern as the C&I Solar "Strategies" section), so each
industry gets a richer two-column panel: "why it fits" + "best suited for"
bullets on the left, and a real South-African proof example card on the right.
The vehicle strip (currently the card grid's footer) moves to a standalone
white block directly after the tabs. Nothing else on the page changes.

## Architecture

Reuse the existing `SolutionTabs` component (desktop tab bar / mobile
accordion; each panel = text left, optional right-column visual via the
`diagram` slot). Industries have no chart, so the right column is a new
presentational `IndustryProofCard`. Industry text lives as data in the
`evFleetsContent.ts` `.ts` config; the page assembles `TabItem[]` and builds
each proof card as JSX at render time — exactly how the Wheeling page builds
its flow diagrams.

Accent: Light Aqua `#A9D6CB`; accent-text `#1a5a48` (`SOLUTION_META['ev-fleets']`).

## Global Constraints

- TypeScript strict, no `any`; named exports only.
- Curly apostrophes (U+2019) in `.ts`/`.tsx` string literals; `&apos;`/`&amp;` in JSX text.
- Only sourced SA proof facts (from the EV research): Woolworths+DSV 41 vans /
  ~400,000 kg CO₂ per yr; Clicks/UPD 42 solar-refrigerated vans; DHL+Unilever
  Africa's first electric superlink (Volvo FMX); Golden Arrow 120 e-buses;
  Vector Logistics electric Volvo FH. Staff transport has no named SA case →
  no proof card (text-only panel).
- Verify: `npx tsc --noEmit`, `npx eslint <files>`, `npm run build` (route
  `○ /solutions/ev-fleets` stays static).

## Changes

### 1. `src/components/sections/SolutionTabs.tsx` — extend the icon set
Add four icons already present in `Icons.tsx` to the tab icon registry:
- import `IconTruck, IconLayers, IconUsers, IconTrendingUp` from `@/components/ui/Icons`
- add `'Truck' | 'Layers' | 'Users' | 'TrendingUp'` to the `IconName` union
- add the four entries to `ICON_MAP`.
Safe for existing consumers (purely additive).

### 2. New `src/components/sections/IndustryProofCard.tsx`
Presentational card (no `'use client'`). Props:
`{ client: string; stat: string; detail: string; accent: string; accentText: string }`.
Renders a light card with a 3px accent top bar: kicker `Proven in South Africa`,
big `stat` (dark), `client` in `accentText`, `detail` paragraph. Styled to sit
in the tab panel's right column (mirrors the `Card variant="light"` look used
elsewhere).

### 3. `src/config/evFleetsContent.ts` — industries: cards → tabs
Replace `industries.cards: ExplainerCardItem[]` with `industries.tabs: IndustryTab[]`.
Keep `eyebrow`, `heading`, `subtitle`, `vehiclesKicker`, `vehicles`.

```typescript
import type { IconName } from '@/components/sections/SolutionTabs';

interface IndustryTab {
  key: string;
  label: string;
  icon: IconName;
  title: string;
  body: string;
  bullets: string[];
  proof?: { client: string; stat: string; detail: string };
}
```

The six tabs (verbatim copy):

1. `key: 'industry-last-mile'` · label `Last-mile delivery` · icon `Truck`
   - title: `Last-mile & e-commerce delivery`
   - body: `Dense urban routes, constant stop-start running and a nightly return to the depot make last-mile the best-proven fit in South Africa — vehicles charge cheaply overnight from solar and cover high daily kilometres where the fuel saving is largest.`
   - bullets: `Fixed urban routes under ~220 km/day` · `Returns to the depot every night` · `Stop-start running where EVs beat diesel`
   - proof: client `Woolworths + DSV`, stat `41 electric vans`, detail `~400,000 kg of tailpipe CO₂ avoided a year, charged from depot solar.`

2. `key: 'industry-cold-chain'` · label `Cold chain` · icon `Thermometer`
   - title: `Cold-chain & refrigerated distribution`
   - body: `Local, return-to-base distribution where the refrigeration itself can run off solar and battery — removing a second diesel burn. Predictable, temperature-critical routes reward reliable electric running.`
   - bullets: `Local return-to-base distribution` · `Solar-powered refrigeration` · `Predictable, temperature-critical routes`
   - proof: client `Clicks / UPD`, stat `42 solar-refrigerated vans`, detail `South Africa’s first solar-powered refrigerated EV fleet — about a tonne of CO₂ saved per van each month.`

3. `key: 'industry-fmcg'` · label `FMCG distribution` · icon `Layers`
   - title: `FMCG & retail distribution`
   - body: `High-volume, scheduled distribution from distribution centres to stores on fixed routes, with large solar-ready depots — a strong fit for heavier electric trucks on regional loops.`
   - bullets: `Scheduled depot-to-store loops` · `Large, solar-ready distribution centres` · `High daily kilometres`
   - proof: client `DHL + Unilever`, stat `Africa’s first electric superlink`, detail `A fully electric Volvo FMX tractor running live Unilever distribution routes.`

4. `key: 'industry-staff'` · label `Staff & shuttle` · icon `Users`
   - title: `Staff & shuttle transport`
   - body: `Fixed, timetabled routes that return to base between shifts are a textbook fit for overnight depot charging — predictable daily distance makes range easy to plan.`
   - bullets: `Fixed timetabled routes` · `Returns to base between shifts` · `Overnight depot charging`
   - proof: none (text-only panel).

5. `key: 'industry-municipal'` · label `Municipal & public` · icon `Building`
   - title: `Municipal & public transport`
   - body: `Scheduled urban routes, defined daily range and mandatory overnight depot returns make public and municipal fleets a strong fit — already live on South African roads.`
   - bullets: `Defined urban routes and depots` · `Overnight + off-peak charging` · `Strong public ESG mandate`
   - proof: client `Golden Arrow`, stat `120 electric buses`, detail `Cape Town’s first electric public bus fleet, charged on solar and off-peak power.`

6. `key: 'industry-logistics'` · label `Regional logistics` · icon `TrendingUp`
   - title: `Regional logistics`
   - body: `Depot-to-depot regional lanes with predictable distance and a return to base are viable for electric today — the sweet spot between short urban runs and true long-haul.`
   - bullets: `Depot-to-depot regional lanes` · `Predictable distance` · `Return-to-base charging`
   - proof: client `Vector Logistics`, stat `Electric Volvo FH trucks`, detail `South Africa’s first bumper-to-bumper net-zero cold-chain trucks.`

### 4. `src/app/solutions/ev-fleets/page.tsx` — §5 rewrite
- Add imports: `SolutionTabs` + `type TabItem`, `IndustryProofCard`.
- Build `const industryTabs: TabItem[]` by mapping `EV_FLEETS.industries.tabs`:
  each → `{ key, label, icon, iconBg: 'rgba(169,214,203,0.20)', title, body,
  bulletsLabel: 'Best suited for', bullets, imageBg: '', imageEmoji: '',
  diagram: proof ? <IndustryProofCard {...proof} accent={meta.accent} accentText={meta.accentText}/> : undefined }`.
- Replace the §5 `ExplainerCards` (industries) with:
  `<SolutionTabs tabs={industryTabs} accent={meta.accent} vertical="ev-fleets"
   eyebrow=… heading=… subtitle=… />` (copy from `EV_FLEETS.industries`),
  followed by a white vehicle-strip `<section>` reusing the existing
  `vehiclesKicker` + `vehicles` markup (the same 5-card grid, now standalone).
- The §2 why-now and §3 pillars `ExplainerCards` are untouched (they still use
  `industries`-unrelated data).

## Non-goals / out of scope
- No change to the estimator, financing, cost-per-km, FAQ, or CTA sections.
- No new tested logic (this is presentational).
- Staff-transport gets no fabricated proof — text-only is intentional.

## Open items
- None.

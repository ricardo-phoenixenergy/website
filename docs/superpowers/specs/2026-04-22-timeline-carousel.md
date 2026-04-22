# Timeline Carousel — Design Spec
> Date: 2026-04-22 | Status: Approved | Route: `/about` (section 8)

---

## Overview

Redesign the `AboutTimeline` section to:
1. Replace the hardcoded `MILESTONES` array with Sanity CMS-driven documents
2. Replace auto-advance with explicit user-driven navigation (prev/next buttons on desktop, scroll-snap swipe on mobile)
3. Visually distinguish future/vision milestones from historical ones via a `isFuture` boolean field in Sanity

No image field — the gradient fill is a deliberate design element, not a placeholder.

---

## Sanity Schema — `milestoneTimeline`

New file: `sanity/schemaTypes/milestoneTimeline.ts`

```typescript
import { defineType, defineField } from 'sanity';

export const milestoneTimeline = defineType({
  name: 'milestoneTimeline',
  title: 'Timeline Milestone',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date label',
      type: 'string',
      description: 'Display label only — e.g. "March 2026", "2019", "2030". Not a date picker.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Milestone title',
      type: 'string',
      description: 'One sentence. e.g. "First C&I solar installation commissioned in Gauteng"',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'isFuture',
      title: 'Future / Vision milestone',
      type: 'boolean',
      description: 'True = aspirational (dashed track, Vision badge). False = historical event.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower = earlier on the timeline. 1, 2, 3...',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Uncheck to hide without deleting.',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'date', subtitle: 'title' },
  },
});
```

Register in `sanity/schemaTypes/index.ts`:
```typescript
import { milestoneTimeline } from './milestoneTimeline';
export const schemaTypes = [project, blogPost, author, teamMember, milestoneTimeline];
```

---

## TypeScript Type

Add to `src/types/sanity.ts`:

```typescript
export interface MilestoneTimeline {
  _id:      string;
  date:     string;
  title:    string;
  isFuture: boolean;
  order:    number;
  active:   boolean;
}
```

---

## GROQ Query

Add to `src/lib/queries.ts`:

```typescript
export const MILESTONE_TIMELINE_QUERY = `
  *[_type == "milestoneTimeline" && active == true]
  | order(order asc) {
    _id,
    date,
    title,
    isFuture,
    order,
    active
  }
`;
```

---

## Component Architecture

### Server layer — `src/app/about/page.tsx`

Fetch milestones at build time alongside the existing `teamMembers` fetch:

```typescript
const [teamMembers, milestones] = await Promise.all([
  getTeamMembers(),
  sanityClient.fetch<MilestoneTimeline[]>(MILESTONE_TIMELINE_QUERY),
]);
```

Pass as prop: `<AboutTimeline milestones={milestones} />`

Fall back to empty array if fetch fails (same try/catch pattern as `getTeamMembers`).

### Client component — `src/components/sections/AboutTimeline.tsx`

- `'use client'`
- Props: `{ milestones: MilestoneTimeline[] }`
- No internal fetch, no hardcoded data
- All carousel state owned here: `activeIndex` (number). `canGoPrev` and `canGoNext` are derived booleans (`activeIndex > 0`, `activeIndex < milestones.length - 1`), not separate state.
- `useReducedMotion` respected — skip `behavior: 'smooth'` when true
- Remove all auto-advance logic (`setInterval`, `isPaused` state)

---

## Desktop Interaction Model

- Prev / Next buttons rendered **top-right, inline with the section heading**
- Left arrow dimmed (`opacity: 0.3`, `pointer-events: none`) when `activeIndex === 0`
- Right arrow dimmed when `activeIndex === milestones.length - 1`
- Clicking Next: `activeIndex += 1`, scroll track so active card is visible (`scrollTo` with `behavior: 'smooth'`)
- Clicking Prev: `activeIndex -= 1`, same scroll logic
- Clicking any card directly also sets `activeIndex` to that card (same as current)
- Progress dots below track: clicking a dot jumps directly to that index
- Card width: `200px` fixed, `flex-shrink: 0`
- Track: `overflow-x: auto`, `scrollbar-width: none`, no scroll-snap on desktop

---

## Mobile Interaction Model

- Buttons hidden: `md:flex hidden` on the btn-group, `hidden md:flex` inversion
- Card width: `calc(80vw)` — 1.25 cards visible at a time (peek affordance)
- `scroll-snap-type: x mandatory` on track container
- `scroll-snap-align: start` on each card
- `-webkit-overflow-scrolling: touch`
- Progress dots remain visible on mobile as position indicators
- No auto-advance or button-driven `scrollTo` on mobile — native finger swipe drives navigation
- Tapping a dot on mobile **does** call `scrollTo` on the track container to jump to the target card (same helper used on desktop)
- `activeIndex` tracking on mobile: use `IntersectionObserver` on each card (≥0.5 visible → set as active) so dots stay in sync with finger swipe position

---

## Visual States

### Historical milestone (isFuture: false)

| State | Top line | Dot | Gradient box | Date colour | Title opacity |
|---|---|---|---|---|---|
| Inactive | None | `#E5E7EB` fill | `linear-gradient(135deg, #E5E7EB, #F5F5F5)`, scale 0.97 | `#709DA9` | 55% |
| Done (past active) | Full width, `#709DA9` | `#709DA9` fill | Same as inactive | `#709DA9` | 55% |
| Active | Full width, `#39575C` | `#39575C` fill + glow ring | `linear-gradient(135deg, #39575C, #0d1f22)`, scale 1.0 | `#39575C` | 100% + `translateY(0)` |

### Future / Vision milestone (isFuture: true)

- Top line: **dashed** — `repeating-linear-gradient(to right, #709DA9 0, #709DA9 6px, transparent 6px, transparent 12px)`, opacity 50%
- Dot: hollow, `border: 2px dashed #709DA9`, white fill, opacity 70%
- Gradient box: `linear-gradient(135deg, #1a3a3e, #0d1f22)`, opacity 45%, `border: 1px dashed rgba(112,157,169,0.4)`, scale 0.96
- Badge: `✦ Vision` pill — `background: rgba(112,157,169,0.1)`, `border: 1px solid rgba(112,157,169,0.25)`, Dusty Blue text, 8px uppercase, shown above the date
- Date & title: italic
- When active: box opacity lifts to 70%, scale 1.0

### Transitions

- Gradient box scale: `400ms cubic-bezier(0.4, 0, 0.2, 1)`
- Title opacity + translateY: `300ms ease`
- Dot + line fill: `300ms ease`

---

## Progress Dots

- Same pill-expands-on-active style as current implementation
- Active dot: `width: 20px`, `height: 6px`, `border-radius: 3px`, `background: #39575C`
- Inactive dot: `width: 6px`, `height: 6px`, `border-radius: 50%`, `background: #E5E7EB`
- Done dot: `background: #C5D5D7` (lighter teal, distinguishes from inactive grey)
- Transition: `width 0.3s ease`, `background 0.3s ease`
- Clickable on both desktop and mobile (jumps to that index)

---

## Files Changed / Created

| File | Action |
|---|---|
| `sanity/schemaTypes/milestoneTimeline.ts` | Create |
| `sanity/schemaTypes/index.ts` | Add import + register |
| `src/types/sanity.ts` | Add `MilestoneTimeline` interface |
| `src/lib/queries.ts` | Add `MILESTONE_TIMELINE_QUERY` |
| `src/app/about/page.tsx` | Add milestone fetch, pass prop |
| `src/components/sections/AboutTimeline.tsx` | Full rewrite |

---

## Sanity Content — Initial Milestones to Create

| Order | Date | Title | isFuture |
|---|---|---|---|
| 1 | 2019 | Founded by Erin, Ricardo & Russel with a vision to transform African energy | false |
| 2 | 2020 | First C&I solar installation commissioned in Gauteng | false |
| 3 | 2021 | BESS offering launched — first battery + solar hybrid project delivered | false |
| 4 | 2022 | Wheeling vertical launched — first PPA agreement signed | false |
| 5 | 2023 | Carbon credits programme launched — Gold Standard certification achieved | false |
| 6 | 2024 | EV Fleets & Infrastructure vertical launched — Transnet Phase 1 commissioned | false |
| 7 | 2025 | WeBuySolar platform launched — 42 systems acquired in first 6 months | false |
| 8 | 2030 | Vision: Net Zero roadmap delivered for 1,000+ Southern African businesses | true |

> ⚠️ Confirm real founding year and milestone dates with client before creating in Sanity.

---

*Spec approved 2026-04-22 | See `docs/superpowers/plans/` for implementation plan*

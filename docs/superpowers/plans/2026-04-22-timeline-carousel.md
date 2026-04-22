# Timeline Carousel Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded, auto-advancing `AboutTimeline` with a Sanity-driven carousel that uses prev/next buttons on desktop and scroll-snap swipe on mobile, with distinct visual treatment for future/vision milestones.

**Architecture:** New `milestoneTimeline` Sanity document type feeds data through a server-side fetch in `about/page.tsx`, which passes typed props to the fully-rewritten `AboutTimeline` client component. Auto-advance is removed entirely; all navigation is user-driven.

**Tech Stack:** Sanity (defineType/defineField), TypeScript, Next.js 14 server components, React hooks (useState, useRef, useEffect, useCallback), IntersectionObserver API, Tailwind CSS, `useReducedMotion` hook.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `sanity/schemaTypes/milestoneTimeline.ts` | **Create** | Sanity document schema |
| `sanity/schemaTypes/index.ts` | **Modify** | Register new schema type |
| `src/types/sanity.ts` | **Modify** | `MilestoneTimeline` TypeScript interface |
| `src/lib/queries.ts` | **Modify** | `MILESTONE_TIMELINE_QUERY` GROQ query |
| `src/app/about/page.tsx` | **Modify** | Fetch milestones server-side, pass as prop |
| `src/components/sections/AboutTimeline.tsx` | **Rewrite** | Full carousel component |

---

## Task 1: Sanity Schema

**Files:**
- Create: `sanity/schemaTypes/milestoneTimeline.ts`
- Modify: `sanity/schemaTypes/index.ts`

- [ ] **Step 1: Create the schema file**

Create `sanity/schemaTypes/milestoneTimeline.ts` with this exact content:

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

- [ ] **Step 2: Register in index.ts**

Open `sanity/schemaTypes/index.ts`. Its current content is:

```typescript
import { project } from './project';
import { blogPost } from './blogPost';
import { author } from './author';
import { teamMember } from './teamMember';

export const schemaTypes = [project, blogPost, author, teamMember];
```

Replace it with:

```typescript
import { project } from './project';
import { blogPost } from './blogPost';
import { author } from './author';
import { teamMember } from './teamMember';
import { milestoneTimeline } from './milestoneTimeline';

export const schemaTypes = [project, blogPost, author, teamMember, milestoneTimeline];
```

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/milestoneTimeline.ts sanity/schemaTypes/index.ts
git commit -m "feat(cms): add milestoneTimeline Sanity schema"
```

---

## Task 2: TypeScript Type + GROQ Query

**Files:**
- Modify: `src/types/sanity.ts` (append after the `TeamMember` interface at line 137)
- Modify: `src/lib/queries.ts` (append at end of file)

- [ ] **Step 1: Add the TypeScript interface**

Open `src/types/sanity.ts`. Append the following after the closing `}` of the `TeamMember` interface (after line 137):

```typescript
/* ─── Timeline ───────────────────────────────────────────────────────────────── */

export interface MilestoneTimeline {
  _id:      string;
  date:     string;   // display label — "2019", "March 2026", "2030"
  title:    string;
  isFuture: boolean;  // true = vision/aspirational; false = historical
  order:    number;
  active:   boolean;
}
```

- [ ] **Step 2: Add the GROQ query**

Open `src/lib/queries.ts`. Append at the end of the file:

```typescript
/* ─── Timeline Milestones ─────────────────────────────────────────────────────── */

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

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors. If you see "Cannot find name 'MilestoneTimeline'", verify the interface was added to `src/types/sanity.ts` without a syntax error.

- [ ] **Step 4: Commit**

```bash
git add src/types/sanity.ts src/lib/queries.ts
git commit -m "feat(types): add MilestoneTimeline interface and GROQ query"
```

---

## Task 3: Server Component — Data Fetch

**Files:**
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Update imports**

Open `src/app/about/page.tsx`. The current imports block is:

```typescript
import type { Metadata } from 'next';
import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import { TEAM_MEMBERS_QUERY } from '@/lib/queries';
import { Button } from '@/components/ui/Button';
import { AboutStory } from '@/components/sections/AboutStory';
import { AboutMission } from '@/components/sections/AboutMission';
import { AboutValues } from '@/components/sections/AboutValues';
import { AboutTimeline } from '@/components/sections/AboutTimeline';
import { AboutTeam } from '@/components/sections/AboutTeam';
import { AboutTrust } from '@/components/sections/AboutTrust';
import type { TeamMember } from '@/types/sanity';
```

Replace with:

```typescript
import type { Metadata } from 'next';
import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import { TEAM_MEMBERS_QUERY, MILESTONE_TIMELINE_QUERY } from '@/lib/queries';
import { Button } from '@/components/ui/Button';
import { AboutStory } from '@/components/sections/AboutStory';
import { AboutMission } from '@/components/sections/AboutMission';
import { AboutValues } from '@/components/sections/AboutValues';
import { AboutTimeline } from '@/components/sections/AboutTimeline';
import { AboutTeam } from '@/components/sections/AboutTeam';
import { AboutTrust } from '@/components/sections/AboutTrust';
import type { TeamMember, MilestoneTimeline } from '@/types/sanity';
```

- [ ] **Step 2: Add the getMilestones helper**

The file currently has:

```typescript
async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    return await sanityClient.fetch<TeamMember[]>(TEAM_MEMBERS_QUERY);
  } catch {
    return [];
  }
}
```

Add `getMilestones` immediately after it:

```typescript
async function getMilestones(): Promise<MilestoneTimeline[]> {
  try {
    return await sanityClient.fetch<MilestoneTimeline[]>(MILESTONE_TIMELINE_QUERY);
  } catch {
    return [];
  }
}
```

- [ ] **Step 3: Parallel-fetch and pass prop**

The current page function begins with:

```typescript
export default async function AboutPage() {
  const teamMembers = await getTeamMembers();
```

Replace those two lines with:

```typescript
export default async function AboutPage() {
  const [teamMembers, milestones] = await Promise.all([
    getTeamMembers(),
    getMilestones(),
  ]);
```

Then find the `<AboutTimeline />` JSX (currently self-closing with no props) and change it to:

```tsx
<AboutTimeline milestones={milestones} />
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: exactly **one** error — something like `Property 'milestones' does not exist on type 'IntrinsicAttributes'`. This is correct; the `AboutTimeline` component hasn't been updated yet. It will be resolved in Task 4. **Proceed to commit regardless.**

- [ ] **Step 5: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat(about): fetch milestone timeline from Sanity server-side"
```

---

## Task 4: Client Component — Full Rewrite

**Files:**
- Rewrite: `src/components/sections/AboutTimeline.tsx`

This task replaces the entire file. Write it in one pass.

- [ ] **Step 1: Write the new component**

Replace the full contents of `src/components/sections/AboutTimeline.tsx` with:

```tsx
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { MilestoneTimeline } from '@/types/sanity';

interface Props {
  milestones: MilestoneTimeline[];
}

export function AboutTimeline({ milestones }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isProgrammaticScroll = useRef(false);
  const reduced = useReducedMotion();

  // Derived — not separate state
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < milestones.length - 1;

  const scrollToCard = useCallback(
    (i: number) => {
      const el = itemRefs.current[i];
      if (el && scrollRef.current) {
        isProgrammaticScroll.current = true;
        scrollRef.current.scrollTo({
          left: el.offsetLeft - 20,
          behavior: reduced ? 'instant' : 'smooth',
        });
        // Allow IntersectionObserver to resume after scroll animation
        setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 600);
      }
    },
    [reduced]
  );

  const goTo = useCallback(
    (i: number) => {
      setActiveIndex(i);
      scrollToCard(i);
    },
    [scrollToCard]
  );

  // Keeps activeIndex in sync with finger-swipe on mobile.
  // Gated by isProgrammaticScroll so desktop button/dot clicks don't conflict.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || milestones.length === 0) return;

    const els = itemRefs.current.filter((el): el is HTMLDivElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const i = els.indexOf(entry.target as HTMLDivElement);
            if (i !== -1) setActiveIndex(i);
          }
        }
      },
      { root: container, threshold: 0.5 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [milestones]);

  if (milestones.length === 0) return null;

  return (
    <section className="bg-white py-[52px] overflow-hidden">
      <div className="page-container">

        {/* Heading row — prev/next buttons visible on md+ only */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
              Roadmap
            </p>
            <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
              Our story{' '}
              <em style={{ color: '#709DA9', fontStyle: 'normal' }}>so far</em>
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => canGoPrev && goTo(activeIndex - 1)}
              aria-label="Previous milestone"
              className="w-9 h-9 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#39575C] transition-all duration-200 hover:border-[#39575C] hover:bg-[#F5F5F5]"
              style={{
                opacity: canGoPrev ? 1 : 0.3,
                pointerEvents: canGoPrev ? 'auto' : 'none',
              }}
            >
              ←
            </button>
            <button
              onClick={() => canGoNext && goTo(activeIndex + 1)}
              aria-label="Next milestone"
              className="w-9 h-9 rounded-full border bg-[#39575C] border-[#39575C] flex items-center justify-center text-white transition-all duration-200"
              style={{
                opacity: canGoNext ? 1 : 0.3,
                pointerEvents: canGoNext ? 'auto' : 'none',
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Scroll track
            Mobile: scroll-snap, 80vw cards, swipe-driven
            Desktop: overflow scroll, 200px cards, button/click-driven */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-none [scroll-snap-type:x_mandatory] md:[scroll-snap-type:none] [-webkit-overflow-scrolling:touch]"
          style={{ borderTop: '2px solid #E5E7EB' }}
        >
          {milestones.map((m, i) => {
            const isActive = i === activeIndex;
            const isDone = i < activeIndex;

            return (
              <div
                key={m._id}
                ref={(el) => { itemRefs.current[i] = el; }}
                onClick={() => goTo(i)}
                className="flex-shrink-0 w-[80vw] md:w-[200px] pt-5 pr-4 relative cursor-pointer [scroll-snap-align:start]"
              >
                {/* Top line — historical milestone: fills left-to-right as active/done */}
                {!m.isFuture && (
                  <div
                    className="absolute top-[-2px] left-0 h-0.5 transition-all duration-[400ms]"
                    style={{
                      width: isActive || isDone ? '100%' : '0%',
                      background: isDone ? '#709DA9' : '#39575C',
                    }}
                  />
                )}

                {/* Top line — future milestone: static dashed pattern */}
                {m.isFuture && (
                  <div
                    className="absolute top-[-2px] left-0 right-0 h-0.5"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(to right, #709DA9 0, #709DA9 6px, transparent 6px, transparent 12px)',
                      opacity: 0.5,
                    }}
                  />
                )}

                {/* Dot */}
                <div
                  className="absolute top-[-7px] left-5 w-3 h-3 rounded-full transition-all duration-300"
                  style={
                    m.isFuture
                      ? { background: 'white', border: '2px dashed #709DA9', opacity: 0.7 }
                      : isActive
                      ? {
                          background: '#39575C',
                          border: '2px solid #39575C',
                          boxShadow: '0 0 0 3px rgba(57,87,92,0.15)',
                        }
                      : isDone
                      ? { background: '#709DA9', border: '2px solid #709DA9' }
                      : { background: '#E5E7EB', border: '2px solid #E5E7EB' }
                  }
                />

                {/* Gradient box */}
                <div
                  className="w-full rounded-[10px] mb-3"
                  style={{
                    height: 80,
                    background: m.isFuture
                      ? 'linear-gradient(135deg, #1a3a3e 0%, #0d1f22 100%)'
                      : isActive
                      ? 'linear-gradient(135deg, #39575C 0%, #0d1f22 100%)'
                      : 'linear-gradient(135deg, #E5E7EB 0%, #F5F5F5 100%)',
                    transform: isActive ? 'scale(1)' : 'scale(0.97)',
                    opacity: m.isFuture ? (isActive ? 0.7 : 0.45) : 1,
                    border: m.isFuture ? '1px dashed rgba(112,157,169,0.4)' : 'none',
                    transition: 'transform 400ms cubic-bezier(0.4,0,0.2,1), opacity 300ms ease',
                  }}
                />

                {/* Vision badge — future milestones only */}
                {m.isFuture && (
                  <p
                    className="font-body text-[8px] font-bold uppercase tracking-[0.1em] mb-1 inline-flex items-center gap-1 rounded-full px-[7px] py-[2px]"
                    style={{
                      color: '#709DA9',
                      background: 'rgba(112,157,169,0.1)',
                      border: '1px solid rgba(112,157,169,0.25)',
                    }}
                  >
                    ✦ Vision
                  </p>
                )}

                {/* Date */}
                <p
                  className="font-body font-bold text-xs mb-1.5 transition-colors duration-300"
                  style={{
                    color: isActive && !m.isFuture ? '#39575C' : '#709DA9',
                    fontStyle: m.isFuture ? 'italic' : 'normal',
                  }}
                >
                  {m.date}
                </p>

                {/* Title */}
                <p
                  className="font-display font-bold text-sm leading-[1.4] transition-all duration-300"
                  style={{
                    color: '#1A1A1A',
                    opacity: isActive ? 1 : m.isFuture ? 0.45 : 0.55,
                    transform: isActive ? 'translateY(0)' : 'translateY(4px)',
                    fontStyle: m.isFuture ? 'italic' : 'normal',
                  }}
                >
                  {m.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Progress dots — clickable on both desktop and mobile */}
        <div className="flex items-center gap-2 mt-6">
          {milestones.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to milestone ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 20 : 6,
                height: 6,
                background:
                  i === activeIndex
                    ? '#39575C'
                    : i < activeIndex
                    ? '#C5D5D7'
                    : '#E5E7EB',
                borderRadius: i === activeIndex ? 3 : 9999,
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors. Common failures:
- `behavior: 'instant'` — if TypeScript complains, cast as `ScrollBehavior`: `behavior: (reduced ? 'instant' : 'smooth') as ScrollBehavior`
- `Cannot find module '@/hooks/useReducedMotion'` — confirm the hook exists at `src/hooks/useReducedMotion.ts`

- [ ] **Step 3: Manual smoke test — desktop**

Run `npm run dev` and open `http://localhost:3000/about`.

Check:
- [ ] Left arrow is dimmed at milestone 1 (can't go back)
- [ ] Right arrow is active; clicking it advances to milestone 2, line fills, dot changes colour
- [ ] Clicking any card directly jumps to it; dots update
- [ ] Clicking a dot jumps to that milestone
- [ ] At last milestone, right arrow dims
- [ ] Active card: teal gradient, full opacity title, glow dot
- [ ] Done cards: Dusty Blue dot + line, 55% title opacity
- [ ] Inactive cards: grey gradient, grey dot, 55% opacity
- [ ] Future/Vision milestone: dashed line, hollow dashed dot, muted dark gradient, "✦ Vision" badge, italic date + title

- [ ] **Step 4: Manual smoke test — mobile**

Open DevTools → responsive mode → set to iPhone 14 (390px wide).

Check:
- [ ] Cards are ~80vw wide with the next card peeking in
- [ ] Swiping left/right snaps cleanly between cards
- [ ] Progress dots update as you swipe
- [ ] Prev/Next buttons are not visible
- [ ] Tapping a dot scrolls to that card

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/AboutTimeline.tsx
git commit -m "feat(about): rewrite timeline carousel — Sanity-driven, user navigation, future milestone treatment"
```

---

## Post-Implementation: Seed Sanity Content

After the code is deployed, create these 8 milestone documents in Sanity Studio (`/studio`) in this order:

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

> ⚠️ Confirm real founding year and milestone dates with client before publishing.

---

*Plan: `docs/superpowers/plans/2026-04-22-timeline-carousel.md` | Spec: `docs/superpowers/specs/2026-04-22-timeline-carousel.md`*

# Featured Project Card — Projects Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pin the featured project in a cinematic 60/40 card above the projects grid, swapping per active vertical filter, with "Flagship" renamed to "Featured" throughout.

**Architecture:** Client-side split inside `ProjectsGrid` — derive `featuredProject` and `gridProjects` from the already-fetched `projects` array using inline computed values (no new GROQ queries). Render a new `FeaturedProjectCard` component between the filter pills and the grid, animated via Framer Motion `AnimatePresence`.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion, Sanity (data already fetched).

---

## File Map

| Action | File | Purpose |
|---|---|---|
| Modify | `src/types/sanity.ts` | Add `featuredOrder?: number` to `ProjectPreview` |
| Create | `src/components/sections/FeaturedProjectCard.tsx` | New 60/40 cinematic card component |
| Modify | `src/components/sections/ProjectsGrid.tsx` | Compute featured/grid split, render FeaturedProjectCard |
| Modify | `src/components/sections/ProjectCard.tsx` | "★ Flagship" → "★ Featured" |

---

## Task 1: Add `featuredOrder` to `ProjectPreview`

**Files:**
- Modify: `src/types/sanity.ts:50-58`

- [ ] **Step 1: Add the field**

Open `src/types/sanity.ts`. The `ProjectPreview` interface currently looks like:

```ts
export interface ProjectPreview extends ProjectCard {
  featured: boolean;
  clientName?: string;
  completionDate?: string;
  projectValue?: string;
  status?: 'completed' | 'in-progress' | 'planned';
  metrics?: ProjectMetric[];
  summary?: string;
}
```

Add `featuredOrder` so it becomes:

```ts
export interface ProjectPreview extends ProjectCard {
  featured: boolean;
  featuredOrder?: number;
  clientName?: string;
  completionDate?: string;
  projectValue?: string;
  status?: 'completed' | 'in-progress' | 'planned';
  metrics?: ProjectMetric[];
  summary?: string;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/sanity.ts
git commit -m "feat(types): add featuredOrder to ProjectPreview"
```

---

## Task 2: Create `FeaturedProjectCard` component

**Files:**
- Create: `src/components/sections/FeaturedProjectCard.tsx`

- [ ] **Step 1: Create the file with this exact content**

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { SOLUTION_META } from '@/types/solutions';
import type { ProjectPreview } from '@/types/sanity';
import { IconArrowRight } from '@/components/ui/Icons';

interface FeaturedProjectCardProps {
  project: ProjectPreview;
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const meta = project.vertical ? SOLUTION_META[project.vertical] : null;

  return (
    <Link href={`/projects/${project.slug.current}`} className="group block">
      <article
        className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] overflow-hidden rounded-2xl bg-white transition-all duration-200 group-hover:-translate-y-[5px] group-hover:shadow group-hover:border-[#cccccc]"
        style={{ border: '1px solid #E5E7EB' }}
      >
        {/* Left: photo column */}
        <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
          {project.heroImage ? (
            <Image
              src={project.heroImage.asset.url}
              alt={project.heroImage.alt ?? project.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, 60vw"
              {...(project.heroImage.asset.metadata?.lqip
                ? { placeholder: 'blur', blurDataURL: project.heroImage.asset.metadata.lqip }
                : {})}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: meta
                  ? `linear-gradient(135deg, ${meta.accent}88 0%, ${meta.accent}33 100%)`
                  : 'linear-gradient(135deg, #39575C 0%, #709DA9 100%)',
              }}
            />
          )}

          {/* Gradient scrim */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(13,31,34,0.82) 0%, rgba(13,31,34,0.15) 55%, transparent 100%)' }}
          />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span
              className="font-body font-bold text-[10px] uppercase tracking-[0.08em] px-3 py-1.5 rounded-full text-white"
              style={{ background: '#39575C', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              ★ Featured
            </span>
            {meta && project.vertical && (
              <span
                className="font-body font-bold text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
                style={{ background: meta.accent, color: meta.accentText }}
              >
                {meta.label}
              </span>
            )}
          </div>

          {/* Bottom: title + location overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
            <h2 className="font-display font-extrabold text-2xl text-white leading-[1.2] mb-1">
              {project.title}
            </h2>
            {project.location && (
              <p className="font-body text-sm text-white/60">{project.location}</p>
            )}
          </div>
        </div>

        {/* Right: stats panel */}
        <div
          className="flex flex-col p-6 justify-between border-t border-[#E5E7EB] sm:border-t-0 sm:border-l"
          style={{ background: '#fafafa' }}
        >
          <div>
            {project.summary && (
              <p className="font-body text-sm text-[#6B7280] leading-[1.7] mb-5 line-clamp-4">
                {project.summary}
              </p>
            )}

            {/* Metric tiles — up to 2; hidden if fewer than 2 */}
            {project.metrics && project.metrics.length >= 2 && (
              <div className="flex flex-col gap-3 mb-5">
                {project.metrics.slice(0, 2).map((metric, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3.5"
                    style={{ background: '#fff', border: '1px solid #E5E7EB' }}
                  >
                    <p className="font-display font-extrabold text-xl text-[#39575C] leading-none mb-1">
                      {metric.value}
                    </p>
                    <p className="font-body text-xs text-[#6B7280]">{metric.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
            <span className="font-body text-xs text-[#6B7280] truncate pr-3">
              {project.location ?? ''}
            </span>
            <span
              className="font-body font-bold text-xs text-white rounded-full px-4 py-2 flex-shrink-0 flex items-center gap-1.5"
              style={{ background: '#39575C' }}
            >
              View case study <IconArrowRight />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/FeaturedProjectCard.tsx
git commit -m "feat(projects): add FeaturedProjectCard component — 60/40 cinematic layout"
```

---

## Task 3: Update `ProjectsGrid` to compute and render the featured card

**Files:**
- Modify: `src/components/sections/ProjectsGrid.tsx`

- [ ] **Step 1: Add the import for `FeaturedProjectCard` and `AnimatePresence`**

At the top of `src/components/sections/ProjectsGrid.tsx`, the import block currently reads:

```ts
import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
```

Change it to:

```ts
import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FeaturedProjectCard } from './FeaturedProjectCard';
```

- [ ] **Step 2: Replace the derived data computations**

In `ProjectsGrid`, the current computed values (after the three hooks) are:

```ts
const filteredProjects = activeFilter === 'all'
  ? projects
  : projects.filter((p) => p.vertical === activeFilter);

const visibleProjects = filteredProjects.slice(0, visibleCount);
```

Replace with:

```ts
const filteredProjects = activeFilter === 'all'
  ? projects
  : projects.filter((p) => p.vertical === activeFilter);

const featuredProject = filteredProjects
  .filter(p => p.featured)
  .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))[0] ?? null;

const gridProjects = filteredProjects.filter(p => p._id !== featuredProject?._id);

const visibleProjects = gridProjects.slice(0, visibleCount);
```

- [ ] **Step 3: Insert the featured card between filter pills and the count/grid**

Find this block (the `{/* Grid toolbar */}` comment and the grid below it):

```tsx
        {/* Grid toolbar — only when there are results */}
        {filteredProjects.length > 0 && (
          <div className="mb-4">
            <p className="font-body text-sm text-[#6B7280]">
              Showing{' '}
              <span className="font-semibold text-[#1A1A1A]">
                {Math.min(visibleCount, filteredProjects.length)}
              </span>
              {' '}of{' '}
              <span className="font-semibold text-[#1A1A1A]">{filteredProjects.length}</span>
              {' '}project{filteredProjects.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
```

Replace the entire block with:

```tsx
        {/* Featured card — pinned above the grid, animates in/out per filter */}
        <AnimatePresence mode="wait">
          {featuredProject && (
            <motion.div
              key={featuredProject._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mb-4"
            >
              <FeaturedProjectCard project={featuredProject} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid toolbar — only when there are grid results */}
        {gridProjects.length > 0 && (
          <div className="mb-4">
            <p className="font-body text-sm text-[#6B7280]">
              Showing{' '}
              <span className="font-semibold text-[#1A1A1A]">
                {Math.min(visibleCount, gridProjects.length)}
              </span>
              {' '}of{' '}
              <span className="font-semibold text-[#1A1A1A]">{gridProjects.length}</span>
              {' '}project{gridProjects.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
```

- [ ] **Step 4: Fix the Load more button to use `gridProjects`**

Find:

```tsx
        {visibleCount < filteredProjects.length && (
```

Replace with:

```tsx
        {visibleCount < gridProjects.length && (
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/ProjectsGrid.tsx
git commit -m "feat(projects): pin featured project card above grid; swap per active filter"
```

---

## Task 4: Rename "Flagship" → "Featured" in `ProjectCard`

**Files:**
- Modify: `src/components/sections/ProjectCard.tsx:54`

- [ ] **Step 1: Update the badge label**

Find in `src/components/sections/ProjectCard.tsx`:

```tsx
            ★ Flagship
```

Replace with:

```tsx
            ★ Featured
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ProjectCard.tsx
git commit -m "fix(projects): rename Flagship badge to Featured"
```

---

## Task 5: Visual verification

**Files:** none — verification only.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open `http://localhost:3000/projects`.

- [ ] **Step 2: Verify "All projects" state**

Confirm:
- The cinematic 60/40 card appears below the filter pills, above the project grid.
- It shows the project with `featured: true` and the lowest `featuredOrder`.
- The photo fills the left column with a dark gradient scrim.
- "★ Featured" pill appears top-left; vertical accent badge top-right.
- Project title and location overlay the bottom of the photo.
- Right panel shows: summary paragraph (if set), up to 2 metric tiles, "View case study →" CTA.
- The featured project does NOT appear again in the 3-column grid below.
- The "Showing X of Y" count reflects only the grid rows.

- [ ] **Step 3: Verify hover behaviour**

Hover the featured card. Confirm: card lifts 5px, branded shadow appears, photo scales to 1.05. Identical to the existing `ProjectCard` hover.

- [ ] **Step 4: Verify filter behaviour**

Click a vertical filter (e.g. "C&I Solar & Storage"). Confirm:
- If that vertical has a featured project: the featured card animates out and a new one animates in for that vertical.
- If no featured project for that vertical: the featured card animates out and the grid takes full width.
- The "All projects" pill restores the original featured card.

- [ ] **Step 5: Verify mobile layout**

Resize browser below 640px (or use DevTools device toolbar). Confirm:
- The featured card stacks to a single column: photo on top, stats panel below.
- The border between columns becomes a top border on the stats panel.

- [ ] **Step 6: Verify `ProjectCard` badge label**

Open any project card in the grid. Confirm the badge reads "★ Featured", not "★ Flagship".

- [ ] **Step 7: Final commit if any last tweaks were made**

```bash
git add -p
git commit -m "fix(projects): visual tweaks from dev verification"
```

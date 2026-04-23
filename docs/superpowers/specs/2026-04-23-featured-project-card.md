# Featured Project Card — Projects Page

**Date:** 2026-04-23
**Status:** Approved

---

## Problem

The Projects page renders all projects in a flat 3-column grid regardless of whether a project is marked `featured`. The only difference a featured project gets today is a small "★ Flagship" badge in the top-right corner of its card — identical in size and layout to every other card. The blog page, by contrast, pins its featured post in a wide cinematic card above the grid, which creates a clear editorial hierarchy.

---

## Goal

Pin the featured project in a full-width cinematic card **below the filter pills, above the project grid**, matching the same structural pattern as the blog's featured article. Rename the label from "Flagship" to "Featured" throughout.

---

## Design Decisions

### Layout — Cinematic 60/40

The featured card uses a two-column grid: 60% photo / 40% stats panel.

- **Left (photo column):** Full-bleed project image with a dark gradient scrim. "★ Featured" pill top-left. Vertical accent badge top-right. Project name and location overlaid at the bottom of the image.
- **Right (stats panel):** Light background (`#fafafa`), left border separator. Short summary paragraph, two metric tiles (value + label), location + "View case study →" CTA at the bottom.

This layout was chosen over a 50/50 blog-mirror (too article-like for portfolio content) and a full-width overlay (legibility depends on image darkness).

### Filtering behaviour — per-vertical featured

| Active filter | Featured card shows |
|---|---|
| All projects | Project with `featured: true` and lowest `featuredOrder` across all verticals |
| Specific vertical | Project with `featured: true` and lowest `featuredOrder` within that vertical |
| Specific vertical, no featured project | Card hidden; grid takes full width |

### Data — client-side split, no new queries

`ALL_PROJECTS_QUERY` already returns `featured`, `featuredOrder`, and `metrics`. `ProjectsGrid` derives the featured project from the already-fetched array using a `useMemo` — no additional network requests.

The featured project is **excluded from the grid** below so it does not appear twice. The "Showing X of Y" count reflects only the grid rows (i.e. total minus the pinned featured project).

---

## Components

### New: `FeaturedProjectCard`

**File:** `src/components/sections/FeaturedProjectCard.tsx`

Props:
```ts
interface FeaturedProjectCardProps {
  project: ProjectPreview;
}
```

Renders as a `<Link>` to `/projects/[slug]`. Hover: `-translate-y-[5px]`, branded shadow, `scale-[1.05]` on the image — consistent with site-wide card hover standard.

Structure:
```
<Link>                          ← full card is clickable
  <article style="grid 3fr 2fr">
    <div>                       ← photo column
      image (fill, object-cover, scale on hover)
      gradient scrim (bottom-up dark)
      "★ Featured" pill (top-left, #39575C)
      vertical accent badge (top-right)
      title + location overlay (bottom-left)
    </div>
    <div>                       ← stats panel (#fafafa, border-left)
      summary paragraph
      metric tiles (up to 2, stacked, white card style)
      footer: location text | "View case study →" pill
    </div>
  </article>
</Link>
```

Gracefully degrades: if no `heroImage`, shows a gradient placeholder using the vertical accent colour. If fewer than 2 metrics, hides the metrics section.

### Modified: `ProjectsGrid`

**File:** `src/components/sections/ProjectsGrid.tsx`

Add `useMemo` to compute `featuredProject` and `gridProjects`:

```ts
const featuredProject = useMemo(() => {
  const pool = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.vertical === activeFilter);
  return pool
    .filter(p => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))[0] ?? null;
}, [projects, activeFilter]);

const gridProjects = useMemo(() =>
  filteredProjects.filter(p => p._id !== featuredProject?._id),
  [filteredProjects, featuredProject]
);
```

Render `<FeaturedProjectCard>` between the filter pills and the count/grid, wrapped in a Framer Motion `AnimatePresence` so it animates in/out when the filter changes and a featured project appears or disappears.

The "Showing X of Y" count uses `gridProjects.length` (featured excluded).

### Modified: `ProjectCard`

**File:** `src/components/sections/ProjectCard.tsx`

Line 54: `★ Flagship` → `★ Featured`

---

## Type changes

`ProjectPreview` in `src/types/sanity.ts` must include `featuredOrder`:

```ts
featuredOrder?: number;
```

Check whether it's already present; add if missing.

---

## What does NOT change

- `ALL_PROJECTS_QUERY` — no GROQ changes needed.
- `FeaturedProjects` (home/solutions carousel) — unaffected.
- `ProjectDrawer` — unaffected.
- Sanity schema — `featuredOrder` field already exists.
- The blog page — unaffected.

---

## Acceptance criteria

1. On the Projects page with "All projects" selected, the project with `featured: true` and the lowest `featuredOrder` renders above the grid in the 60/40 cinematic card.
2. The featured project does not appear again in the 3-column grid below.
3. Selecting a vertical filter swaps the featured card to that vertical's featured project (or hides it if none exists), with a smooth animate-in/out transition.
4. The "Showing X of Y" count reflects grid rows only (featured card excluded).
5. The badge on `ProjectCard` reads "★ Featured", not "★ Flagship".
6. Hovering the featured card produces the standard site hover: 5px lift, branded shadow, 1.05 image scale.
7. On mobile (< sm breakpoint) the featured card stacks to single column: photo on top, stats panel below.

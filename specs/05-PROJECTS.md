# 05 · Projects Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Route: `/projects`
> High-fidelity mockup approved April 2026. **Updated 2026-09-24:** aligned with the build (`src/components/sections/ProjectsGrid.tsx`). The layout now depends on how many projects are published, filters come from the data, and there is no project drawer.

---

## Page Structure

The page reads every published project from Sanity (`ALL_PROJECTS_QUERY`) and picks one of three layouts.

```
[Navbar]
[Breadcrumb: Home / Projects]
[Page header: eyebrow, H1, intro]

No projects:          [Empty state]
1 to 3 projects,
or one service only:  [Equal large cards, 2 columns]
                      [Our other services]
4 or more projects
across 2+ services:   [Filter pills, with counts]
                      [Result count]
                      [Featured project card, when one is featured]
                      [Project grid, 3 columns]
                      [Load more projects]
                      [Our other services]

[Footer band: Book a discovery meeting]
[Site footer]
```

The page revalidates hourly. A Sanity error throws, so ISR keeps serving the last good page instead of an empty portfolio.

---

## Navbar State

As `specs/03-NAVIGATION.md`. On `/projects` and every `/projects/[slug]` page, the Projects link carries `aria-current="page"` and the active style.

---

## Page Header

- **Breadcrumb:** `Home / Projects`, with "Projects" as the current page (`aria-current="page"`).
- **Eyebrow:** `Our work`, set in capitals, `text-pe-muted` (changed 2026-10-08 from `text-pe-secondary-ink`: the index headers share one eyebrow colour).
- **Component:** the breadcrumb, eyebrow, H1 and intro are `IndexHeader` (`src/components/ui/IndexHeader.tsx`), shared with `/blog`; the page passes it to `ProjectsGrid` as its `header`. The breadcrumb is `BreadcrumbTrail` (an `ol`, as the project page's breadcrumb row). The H1's emphasis stays `text-pe-primary`.
- **H1:** "Projects & *installations*", with "installations" in `pe-primary`.
- **Intro:** *"Commercial solar and battery installations by Phoenix Energy: the site and system for each project, with projected results where available."* (max 60ch).

---

## Filter Pill Bar

Shown only when there are **4 or more projects in 2 or more services** (`FILTER_THRESHOLD = 4`). Below that there is nothing to filter.

- The pills are built from the data: "All projects (N)" first, then one pill per service that has a published project, each with its count, for example "C&I Solar & Storage (3)". A service with no project gets no pill, so no filter leads to an empty grid.
- Each pill is a `Chip` toggle (`aria-pressed`): 36px tall, 16px side padding, Inter 500, 14px in both states, a 1px border in both states. Inactive: white with a `#E5E7EB` border and muted text. Active: the service's accent fill and border with its accent "on" colour (`SOLUTION_META[vertical].accent` and `.accentText`), no shadow; "All projects" uses Deep Teal with white text.
- Each change sends `filter_change` (`filter_value`) to the data layer and resets the grid to its first 6 cards.
- Cards that appear after a filter change fade and rise in (8px), 0.04s apart. Before any filter change the grid renders without animation.

---

## Featured Project Card

Only in the layout with filters, and only when the filtered set has a **featured** project: the first in the list, which puts featured projects first in their featured order (`getAllProjects()`, `src/lib/projectData.ts`). Otherwise no featured card is shown. The featured project is left out of the grid below it.

`FeaturedProjectCard` is a two-column card (one column below `sm`), outcomes first like `ProjectCard` (updated September 2026):
- Left: the hero photo (`next/image`, blur placeholder, decorative `alt=""`, `priority` here as the first image) under a dark gradient, the kicker badge ("Featured project"), a status badge when in progress or planned, the project title (H2 here) and the place line: the location, then the client's name when it may show, which takes the client's recorded consent (`cardPlace()`, `specs/06-PROJECT-SINGLE.md`).
- Right: the "Projected results" caption unless an editor marks the results measured (`isMeasured()`), the first two results as value and label pairs (Plus Jakarta Sans 800, 24px, `pe-primary`, over a 12px label; no boxes, so no card sits inside the card), the specs on one line, then the summary (clamped to 3 lines). A project with no results shows its specs (up to four) as the pairs instead.
- Footer: "View project", with an arrow: a compact primary pill (40px) drawn on a `<span>` with `buttonClasses({ size: 'compact', inCard: true })`, since the whole card is the link. It darkens and presses with the card (hover or press anywhere on it), as well as the card's own lift.

It links straight to `/projects/[slug]`. The same card, with an h3, its pill naming the project's service and no `priority` image, is the wide card in a project page's next project section (`specs/06-PROJECT-SINGLE.md`).

The April mockup's per-filter featured data (Shoprite DC, Cape Town Industrial, Mpumalanga Solar Carbon Offset, Tiger Brands, Transnet Fleet, Pretoria Estate Buyback) was placeholder content, not Phoenix projects. It has been removed from this spec, and none of it may appear on the site.

---

## Result Count

In the filter layout only: *"Showing X of Y projects"* in a `role="status"` line, so the count is announced when a filter or Load more changes it. The April grid and list view toggle was not built.

---

## Project Card

`ProjectCard` (`src/components/sections/ProjectCard.tsx`), a single link to `/projects/[slug]`, outcomes first:

```
[Photo, 16:10, blur placeholder; decorative (alt="")]
  ↳ service badge, bottom left: accent fill + accent "on" text
  ↳ status badge, top right: "In progress" or "Planned" (none when completed)
[Body]
  ↳ title: H2 on /projects, H3 under a section heading elsewhere
  ↳ location · client (only with the client's recorded consent)
  ↳ "Projected results" caption, unless an editor marks the results measured
  ↳ the first two results: value (Plus Jakarta Sans 800, pe-primary) over its label; side by side
    when there's room, with the values top-aligned so a label that wraps never pushes its neighbour down
  ↳ up to four specs on one line, joined with " · "
[Footer]
  ↳ "View project" + arrow
```

- Few projects (the 1 to 3 layout): `size="large"`, with roomier padding and larger type.
- The same card is used on home and the solution pages (`FeaturedProjects`) and in a project page's next project section when there are two or more.

---

## Load More Button

- In the filter layout only, when more cards remain: **Load more projects**.
- `Button`, outline, default size: a 48px pill with a Deep Teal edge and label, Inter 600, 14px, 20px side padding.
- Shows **6** cards to start and adds **6** per click.

---

## Our Other Services

Under the grid in both layouts with projects. It lists every service with no published project yet:
- H2 "Our other services", then *"No project is published for these yet. See how each one works."*
- One `Chip` link per service (36px, white with a `#E5E7EB` border and muted text), with its 8px accent dot, to that solution page. The chips sit 8px apart and wrap onto rows 10px apart, so their 44px touch targets stay 2px clear of the next row's.

---

## Empty State

When no project is published: a dashed card with the H2 "No projects published yet", *"In the meantime, tell us about your site."* and the "Book a discovery meeting" button (`DISCOVERY_CTA`, `src/config/ctas.ts`; `Button`, primary, default size). It makes no promise about projects to come.

---

## Card Click Behaviour

Updated 2026-09-24: **one step.** Every card, and the featured card, is a link straight to the project page at `/projects/[slug]` (`specs/06-PROJECT-SINGLE.md`). The April two-step design (a card opened a slide-in `ProjectDrawer`, whose button opened the project page) was removed in September 2026, together with `src/components/ui/ProjectDrawer.tsx`.

---

## TypeScript Component

```tsx
// src/components/sections/ProjectsGrid.tsx
interface ProjectsGridProps {
  projects: ProjectPreview[];
  /** Page header (breadcrumb, H1, intro), rendered above the projects. */
  header: React.ReactNode;
}

// Constants
// FILTER_THRESHOLD = 4   below this many projects, equal cards and no filters
// PAGE_SIZE = 6          first page, and each Load more

// Order: as given by getAllProjects() (src/lib/projectData.ts): featured projects first in their featured order, then the rest newest first.

// State
// activeFilter: SolutionVertical | 'all'
// visibleCount: number    starts at 6, +6 on Load more, back to 6 on a filter change
// hasFiltered: boolean    cards animate in only after the first filter change

// Derived
// verticalsWithProjects   services with at least one project (pills, counts)
// filtersShown            projects.length >= 4 && verticalsWithProjects.length > 1
// featuredProject         filtered.find(p => p.featured) ?? null
// otherVerticals          services with no project (Our other services)
```

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Updated 2026-09-29*

---

## Mobile Responsive Spec

### Project grid breakpoints (filter layout)
- `< 640px`: 1 column
- `640px` to `767px`: 2 columns
- `≥ 768px`: 3 columns

### Equal cards (1 to 3 projects)
- `< 768px`: 1 column
- `≥ 768px`: 2 columns

### Featured project card
- Below `640px` the photo stacks above the outcomes panel (minimum photo height 260px).

### Filter bar
The pills stay on one line and the bar scrolls sideways (`overflow-x: auto`, hidden scrollbar, touch scrolling); see `src/components/ui/FilterPills.tsx`. The bar keeps 6px of padding, offset by negative margins, so its scrolling edge clips neither a focus ring nor a chip's 44px touch target, and 6px of scroll padding (`scroll-px-1.5`). A pill that takes keyboard focus scrolls fully into view (`revealFocusedChip`), since Tab alone leaves a partly hidden pill cut off, and stops 6px inside the edge with its ring whole.

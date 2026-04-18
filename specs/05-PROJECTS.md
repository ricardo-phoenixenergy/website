# 05 — Projects Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0
> Route: `/projects`
> High-fidelity mockup approved April 2026. Build to match exactly.

---

## Page Structure

```
[Navbar — light glass pill, "Projects" active]
[Breadcrumb — Home / Projects]
[Page header — eyebrow + H1 + subtitle]
[Filter pill bar]
[Featured cinematic card — 320px]
[Grid toolbar — count + view toggle]
[3-column project card grid]
[Load more button]
[Footer]
```

---

## Navbar State

- Light glass pill: `background: rgba(255,255,255,0.85)`, `backdrop-filter: blur(12px)`
- Logo: Deep Teal `#39575C`
- Active link: "Projects" — Deep Teal, `font-weight: 600`
- CTA: Deep Teal fill `#39575C` + white text (inverse of homepage)

---

## Page Header

- **Breadcrumb:** `Home / Projects` — Inter 400, 11px, muted. "Projects" in Deep Teal 500
- **Eyebrow:** `OUR WORK` — 10px, Inter 700, `#709DA9`, `letter-spacing: 0.14em`
- **H1:** `Projects & installations` — Plus Jakarta Sans 800, 32px. "installations" in Deep Teal
- **Subtitle:** Inter 400, 13px, muted, `max-width: 520px`
- Max-width container: `960px`, `padding: 0 24px`

---

## Filter Pill Bar

**Pills:** `All projects · C&I Solar & Storage · Wheeling · Carbon Credits · Energy Optimisation · EV Fleets · WeBuySolar`

### Default state
- `background: #fff`, `border: 1px solid #E5E7EB`, `color: #6B7280`
- Inter 500, 11px, `border-radius: 9999px`, padding `7px 16px`

### Active state
- Fill with vertical accent colour, `border: none`, `box-shadow: 0 2px 8px rgba(0,0,0,0.12)`
- **Text colour logic:**
  - Light accents (`#E3C58D`, `#9CAF88`, `#A9D6CB`) → `#1A1A1A`
  - Dark accents (`#D97C76`, `#709DA9`, `#C97A40`) + All → `#ffffff`
- "All projects" active → Deep Teal `#39575C` fill, white text

### Filter transition
`opacity: 0.5` → swap featured card data → `opacity: 1` over `180ms`
Grid cards: CSS `opacity: 0` + `pointer-events: none` for hidden (no DOM removal — preserves layout)

---

## Featured Cinematic Card

- Full-width, `height: 320px`, `border-radius: 18px`, `overflow: hidden`
- `box-shadow: 0 8px 40px rgba(57,87,92,0.15)`

### Photo layer
- `background-size: cover; background-position: center`
- Hover: `scale(1.03)` over `0.8s cubic-bezier(0.4,0,0.2,1)`

### Overlay
```css
background: linear-gradient(90deg,
  rgba(13,31,34,0.94) 0%,
  rgba(13,31,34,0.65) 45%,
  rgba(13,31,34,0.1)  100%
);
```

### Left content (bottom-anchored, `max-width: 520px`, padding `30px 36px`)
- Eyebrow: `FLAGSHIP PROJECT` — 9px, Inter 700, `rgba(255,255,255,0.4)`, `letter-spacing: 0.14em`
- Badge pill: accent bg at 20% opacity + full accent colour text + 7px dot
- Title: Plus Jakarta Sans 800, 20px, white, `line-height: 1.25`
- Meta row: `📍 location · 📅 date · 💰 value` — Inter 400, 11px, `rgba(255,255,255,0.55)`
- CTA: `View case study →` ghost pill — `rgba(255,255,255,0.1)` bg + blur, white text, `border: 1px solid rgba(255,255,255,0.25)`

### Right stats panel (absolute, bottom-right, `padding: 30px 32px`)
- 3 stats stacked, right-aligned
- Value: Plus Jakarta Sans 800, 22px, white
- Label: Inter 400, 9px, `rgba(255,255,255,0.4)`, uppercase, `letter-spacing: 0.08em`

### Progress bar
- `height: 2px`, bottom of card, accent colour
- Animates on hover (visual indicator only — no auto-cycle on featured card)

### Per-filter featured project data

| Filter | Photo | Badge | Title | Loc | Date | Value | S1 | S2 | S3 |
|---|---|---|---|---|---|---|---|---|---|
| All/Solar | Commercial rooftop solar | C&I Solar & Storage | Shoprite DC — 4.8 MW Solar + 2 MWh BESS | Centurion, GP | Completed Q3 2024 | R42M | 4.8 MW / System size | R4.2M / Annual saving | 8,400 t / CO₂/yr |
| Wheeling | Power lines | Wheeling | Cape Town Industrial — 5 MW Wheeling PPA | Cape Town, WC | Completed Q1 2023 | R28M | 5 MW / Wheeled | 32% / Tariff saving | R28M / Deal value |
| Carbon | Green forest | Carbon Credits | Mpumalanga Solar Carbon Offset — 1,200 tCO₂e/yr | Mpumalanga | Active 2024 | R8M/yr | 1,200 t / CO₂e yr | Gold Std. / Certified | R8M / Revenue/yr |
| Optimisation | Control room | Energy Optimisation | Tiger Brands Smart Energy — 18% Cost Reduction | Johannesburg, GP | Completed Q2 2024 | R3.2M/yr | 18% / Cost reduction | 6 sites / Monitored | R3.2M / Saving/yr |
| EV Fleets | EV truck | EV Fleets & Infrastructure | Transnet Fleet Phase 1 — 40 Electric Trucks | Durban, KZN | In progress 2025 | R65M | 40 / Trucks deployed | 680 t / CO₂/yr | R65M / Value |
| WeBuySolar | Residential panels | WeBuySolar | Pretoria Estate Buyback — 42 Systems | Pretoria, GP | Completed Q4 2024 | R9.4M | 42 / Systems | 284 kW / Capacity | R9.4M / Paid out |

---

## Grid Toolbar

- Left: `Showing X projects` — Inter 400, 12px, muted. Count in `font-weight: 600`, `color: #1A1A1A`
- Right: Grid / List toggle — 28px square buttons, `border-radius: 7px`
  - Active: Deep Teal fill, white icon
  - Inactive: white bg, border, muted icon

---

## Project Card

- `background: #fff`, `border: 1px solid #E5E7EB`, `border-radius: 16px`
- Hover: `translateY(-5px)`, border → `#cccccc`, `box-shadow: 0 16px 40px rgba(57,87,92,0.12)`

### Structure
```
[Photo 148px — overflow hidden]
  ↳ accent bar: 3px top, full width, absolute z-index 2
  ↳ photo inner: scale(1.07) on card hover, 0.5s ease
[Body — padding 16px]
  ↳ badge pill: accent bg 10% + accent text + 6px dot
  ↳ title: Plus Jakarta Sans 700, 13px, line-height 1.4
  ↳ 1px rule #E5E7EB
  ↳ 2×2 stats grid (gap 10px)
     stat label: Inter 400, 10px, muted
     stat value: Inter 600, 12px, dark
  ↳ footer row (border-top 1px #E5E7EB, padding-top 10px)
     location: 10px, muted, emoji pin
     arrow circle: 26px, border 1px #E5E7EB, muted →
       hover: Deep Teal fill + white →
```

---

## Load More Button

- Centred, pill shape, `background: #fff`, `border: 1px solid #E5E7EB`, Inter 500, 13px, `padding: 11px 32px`
- Hover: border `#aaaaaa`, `box-shadow: 0 4px 12px rgba(0,0,0,0.06)`
- Default show: **6 cards** (2 rows × 3)
- Load more increments by **6** per click

---

## Card Click Behaviour — Drawer + Full Page

**Two-step interaction — confirmed April 2026:**

1. **Card click** → opens `ProjectDrawer` (slide-in from right)
2. **"View full case study →" button inside drawer** → navigates to `/projects/[slug]`

This lets users quickly preview multiple projects without losing their place in the grid, while still providing the full editorial case study page for serious prospects.

---

## Project Drawer

### Behaviour
- Slides in from the right edge of the viewport
- Dark overlay `rgba(13,31,34,0.5)` appears behind drawer over the grid
- Click overlay or `✕` button to close — returns to grid with no state change
- ESC key also closes
- URL does **not** change when drawer opens (no routing)
- Only one drawer open at a time

### Dimensions
- Width: `480px` desktop, `100vw` mobile
- Height: `100vh` (full screen height)
- `position: fixed`, `top: 0`, `right: 0`, `z-index: 50`

### Animation
- Open: `translateX(100%) → translateX(0)` over `400ms cubic-bezier(0.4,0,0.2,1)`
- Close: `translateX(0) → translateX(100%)` over `300ms cubic-bezier(0.4,0,0.2,1)`
- Overlay: `opacity 0 → 0.5` over `300ms`

### Drawer structure
```
[Project photo — full width, 180px height]
[Body — padding 20px, scrollable]
  ↳ [close ✕ button — absolute top-right]
  ↳ vertical badge pill (accent)
  ↳ project title — Plus Jakarta Sans 800, 16px
  ↳ meta list: location · completion date · project value
  ↳ 1px divider
  ↳ 2×2 stats grid (same style as card stats, slightly larger)
  ↳ "The challenge" section heading + 2–3 sentence summary
  ↳ CTA row:
      [View full case study →]  [Get a Quote]
       Deep Teal pill, flex:1    ghost border pill
```

### CTA buttons in drawer
- `View full case study →` — Deep Teal `#39575C` fill, white text, `flex: 1`
  - `onClick`: `router.push('/projects/[slug]')`
- `Get a Quote` — white bg, `border: 1px solid #E5E7EB`, Deep Teal text
  - `onClick`: `router.push('/contact?service=[vertical]')`

### Component
```tsx
// src/components/ui/ProjectDrawer.tsx
interface ProjectDrawerProps {
  project: Project | null;   // null = closed
  onClose: () => void;
}

// - AnimatePresence wraps the drawer for enter/exit
// - motion.div: initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
// - Overlay: motion.div opacity 0 → 1
// - useEffect: add/remove 'overflow-hidden' on body when open
// - Focus trap while open (accessibility)
// - Close on ESC via useEffect keydown listener
```

---

## TypeScript Component

```tsx
// src/components/sections/ProjectsGrid.tsx
interface ProjectsGridProps {
  projects: Project[];
  initialFilter?: SolutionVertical | 'all';
}

// State
// activeFilter: SolutionVertical | 'all'  — controls featured + grid
// visibleCount: number                     — starts at 6, +6 on load more
// isTransitioning: boolean                 — featured card opacity during swap
// drawerProject: Project | null            — null = drawer closed

// Card click handler
// onClick(project) → setDrawerProject(project)

// Filter change sequence
// 1. setIsTransitioning(true)  → featured opacity 0.5
// 2. setTimeout 180ms
// 3. Update featured data + filter grid
// 4. setIsTransitioning(false) → featured opacity 1
// 5. Toggle card .hidden class (CSS opacity + pointer-events, no DOM removal)

// Load more
// setVisibleCount(prev => prev + 6)
// Client-side slice: projects.filter(...).slice(0, visibleCount)
```

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md)*

---

## Mobile Responsive Spec (Engineering Review April 2026)

### Project card grid breakpoints
- `< 640px`: 1 column
- `640px–768px`: 2 columns
- `≥ 768px`: 3 columns

### Featured cinematic card — mobile
- `height: 260px` (down from 320px)
- Overlay switches to vertical: `linear-gradient(180deg, rgba(13,31,34,0.1) 0%, rgba(13,31,34,0.92) 100%)`
- Left content: full-width, bottom-anchored
- Stats panel: moves below title inline (not absolute right)
- CTA button: full-width

### Touch/swipe on filter bar
`overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch`


### Project filter — newly visible card entrance animation
When filter changes, newly visible cards animate in:
- `opacity: 0 → 1` + `translateY(8px → 0)`, staggered at `0.04s` per card over `280ms`
- Implemented via Framer Motion `variants` with `staggerChildren: 0.04` on the grid wrapper
- Cards that become hidden: `opacity: 0` + `pointer-events: none` (no DOM removal — preserves layout shift)


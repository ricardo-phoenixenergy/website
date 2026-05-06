# About Page — Design Cleanup
> Date: 2026-04-22 | Route: `/about`

## Summary

Four targeted changes to the About page. No structural pages added or removed — this is editorial and visual cleanup only.

---

## Change 1 — Story Section: Replace placeholder gradient with impact stats panel

**Component:** `src/components/sections/AboutStory.tsx`

**What changes:** The left column currently renders a dark gradient placeholder (`linear-gradient(135deg, #1a3a3e, #0d1f22)`) with a "Pan-Africa / Our Vision" floating badge. Replace this with a 2×2 stat tile grid (Hybrid 1 design).

### Layout
```
┌─────────────┬─────────────┐
│   R380M     │    48MW     │
│ Client sav. │  Deployed   │  ← featured tile top-left
├─────────────┼─────────────┤
│    120+     │    12kt     │
│  Projects   │ CO₂ saved/yr│
└─────────────┴─────────────┘
        ↑ badge: "Since 2019 / Our impact"
```

### Tile spec
- Container: `border-radius: 16px`, `height: 230px`, `overflow: hidden`, `background: #0d1f22`
- Inner grid: `display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 3px; padding: 3px`
- Each tile: `border-radius: 8px`, `background: rgba(255,255,255,0.04)`, `display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px`
- Value: Plus Jakarta Sans 800, 24px, white, `line-height: 1`
- Label: Inter 400, 8px, `rgba(255,255,255,0.38)`, uppercase, `letter-spacing: 0.08em`, `margin-top: 4px`, text-align center

### Featured tile (R380M — top-left)
- `background: linear-gradient(140deg, #1a4a52 0%, #0f2d33 100%)`
- Radial glow overlay: `::before` pseudo, `position: absolute; top: -20px; left: -20px; width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle, rgba(112,157,169,0.25) 0%, transparent 70%)`
- Value font-size: 26px

### Shimmer animation (all tiles)
- `::after` pseudo on each tile: `position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(112,157,169,0.5), transparent)`
- Each tile shimmer animates with a staggered delay: 0.2s, 0.8s, 1.4s, 2.0s
- `@keyframes shimmer`: `0%{transform:translateX(-100%)} 40%,100%{transform:translateX(100%)}`; duration 2.5s, ease-in-out, infinite

**Implementation note:** Add the `@keyframes shimmer` rule to `src/app/globals.css`. The component uses inline styles (no CSS module), so the keyframe must live in global CSS. Reference it via a utility class (e.g. `.shimmer-tile::after`) or apply `animationName: 'shimmer'` inline with `animationDuration`, `animationDelay`, etc.

### Scroll-in animation (Framer Motion)
- Use `useInView` from Framer Motion, `once: true`, `margin: "-60px"`
- Each tile: `initial={{ opacity: 0, scale: 0.85, y: 4 }}` → `animate={{ opacity: 1, scale: 1, y: 0 }}`
- Spring: `type: "spring", stiffness: 300, damping: 24`
- Stagger delays: tile 1 → 0s, tile 2 → 0.15s, tile 3 → 0.3s, tile 4 → 0.45s

### Badge
- `position: absolute; bottom: 8px; left: 8px`
- `background: #39575C; border: 2px solid white; border-radius: 7px; padding: 5px 9px`
- Value line: Plus Jakarta Sans 800, 10px, white — `"Since 2019"`
- Label line: Inter 400, 8px, `rgba(255,255,255,0.6)`, uppercase — `"Our impact"`

### Stats data
| Value | Label |
|---|---|
| R380M | Client savings |
| 48MW | Deployed |
| 120+ | Projects |
| 12kt | CO₂ saved / yr |

> Stats sourced from `CTABanner.tsx` (already live). If these numbers update, update both components.

---

## Change 2 — Stats Strip: Remove entirely

**File:** `src/app/about/page.tsx`

**What changes:** Delete the `<StatsStrip stats={ABOUT_STATS} />` call and the `ABOUT_STATS` constant. Remove the `StatsStrip` import if it's no longer used elsewhere on this page.

The hero flows directly into `<AboutStory />`. Remove the `StatsStrip` import from `about/page.tsx`.

> `StatsStrip` component itself is not deleted — it's used on the single project page.

---

## Change 3 — Values Section: Replace "Join the team" card with Ubuntu value

**Component:** `src/components/sections/AboutValues.tsx`

**What changes:** The 6th item in the `VALUES` array is currently a hardcoded "Join the team" card rendered separately after the map. Replace the entire pattern with a uniform 6-item `VALUES` array including Ubuntu, rendered identically to the other 5 cards.

### New 6th value
```typescript
{
  num: '06',
  title: 'Ubuntu',
  text: "We are rooted in the African belief that we grow stronger together — alongside our clients, our communities, and our continent.",
}
```

### Card style
- Same dark card style as values 01–05: `background: #0d1f22`, `border-radius: 14px`, etc.
- **Do not** use the dashed/tinted join-card style — Ubuntu is a full value, not a CTA slot.
- Remove the separate `{/* Join card */}` JSX block entirely.

---

## Change 4 — CareersBand: Remove entirely

**Files affected:**
1. `src/app/about/page.tsx` — remove `<CareersBand />` call and its import
2. `src/components/sections/CareersBand.tsx` — delete file

The team section's "Become a part of our journey" full-width banner (in `AboutTeam.tsx`) is the single careers touchpoint on the page.

### CTA Banner copy tweak
In `src/app/about/page.tsx`, the inline CTA section subtext currently reads:

> *"Whether you're a prospective client, partner, or future team member — we'd love to hear from you."*

Update to:

> *"Whether you're a prospective client or a future partner — we'd love to hear from you."*

This removes the "future team member" phrase so careers messaging is consolidated entirely to the team section.

---

## Unchanged

Everything else on the About page stays as-is:
- Hero
- `AboutMission`
- `AboutTimeline`
- `AboutTeam` (including the "Become a part of our journey" banner — kept)
- `AboutTrust`
- CTA Banner structure (only the subtext copy changes)
- `specs/08-ABOUT.md` — should be updated to reflect the above after implementation

---

## Files Modified

| File | Change |
|---|---|
| `src/app/about/page.tsx` | Remove StatsStrip + ABOUT_STATS, remove CareersBand import + usage, update CTA subtext |
| `src/components/sections/AboutStory.tsx` | Replace gradient placeholder with Framer Motion stat panel |
| `src/components/sections/AboutValues.tsx` | Add Ubuntu to VALUES array, remove separate join card JSX |
| `src/components/sections/CareersBand.tsx` | **Delete** |
| `specs/08-ABOUT.md` | Update to reflect final state (post-implementation) |

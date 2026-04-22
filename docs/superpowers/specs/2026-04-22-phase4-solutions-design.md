# Phase 4 — Solutions Pages Design
> Date: 2026-04-22 | Status: Approved

---

## Overview

Six independent solution pages under `/solutions/[vertical]` implemented as **static routes** (not a dynamic `[vertical]` route). Each page composes shared section components directly — no shared template intermediary. Components accept props; pages own their content.

Phase 4 is split into three sequential sub-phases:
1. **Solutions pages** (this doc)
2. Blog index + single post (separate plan)
3. Solar Asset Valuation Tool (separate plan)

---

## Architecture

### Routes (static, not dynamic)

```
src/app/solutions/
├── ci-solar-storage/page.tsx
├── wheeling/page.tsx
├── energy-optimisation/page.tsx
├── carbon-credits/page.tsx
├── webuysolar/page.tsx
└── ev-fleets/page.tsx
```

Each page is fully independent — its own metadata, JSON-LD, sections composition, tabs array, and testimonial quotes.

### Shared Config

```
src/config/verticals.ts
```

Exports shared constants only: accent hex per vertical, accentText colour, SEO title/description strings, stats arrays. Does **not** export templates or render logic.

### Shared Section Components

```
src/components/sections/
├── SolutionHero.tsx          — full-bleed photo + gradient + badge + CTAs
├── SolutionSubNav.tsx        — sticky anchor nav, appears on scroll past hero
├── SolutionPain.tsx          — dark bg layout shell + editorial left column
├── SolutionTabs.tsx          — desktop tabs / mobile accordion, generic
├── FinancingCards.tsx        — CapEx vs OpEx cards, used inside SolutionTabs
└── Testimonials.tsx          — 3-col placeholder quote cards
```

### Per-Vertical Calculators

```
src/components/sections/calculators/
├── SolarCalculator.tsx
├── WheelingCalculator.tsx
├── OptimisationCalculator.tsx
├── CarbonCalculator.tsx
├── WeBuySolarCalculator.tsx
└── EvFleetsCalculator.tsx
```

Each calculator is a client component that owns its own:
- Input controls (sliders, segmented buttons, toggles — varies per vertical)
- Calculation formula (from spec `07-SOLUTIONS.md`)
- Output layout (number of result cards, labels, highlighted card)

### Reused from Phase 2/3 (minor additions only)

| Component | Addition |
|---|---|
| `HowItWorks.tsx` | Add `showCTA`, `ctaLabel`, `ctaHref` props |
| `FeaturedProjects.tsx` | Add optional `vertical` filter prop |
| `StatsStrip.tsx` | No changes |
| `CTABanner.tsx` | No changes |

---

## Section Components

### SolutionHero

Props: `title`, `subtitle`, `accent`, `badge`, `heroBg` (CSS gradient placeholder until real photo), `primaryCta`, `secondaryCta`

- `position: relative`, `min-height: 300px` desktop / `260px` mobile
- `next/image` fill with `placeholder="blur"` (real photos: client-supplied)
- Overlay: `linear-gradient(180deg, rgba(13,31,34,0.15) 0%, rgba(13,31,34,0.92) 100%)`
- Headline: Plus Jakarta Sans 800, 26px white. `<em>` tags at `opacity: 0.45`
- Two buttons: `#F5F5F5` primary + ghost secondary

### SolutionSubNav

Props: `links: { label: string; href: string }[]`

- Sticky below main nav on scroll past hero bottom
- Appears: `opacity: 0 → 1` + `translateY(-100% → 0)` over `250ms ease-out`
- `background: #ffffff`, `border-bottom: 1px solid #E5E7EB`
- Mobile: `overflow-x: auto; scrollbar-width: none; white-space: nowrap`
- Clicking smooth-scrolls to section anchor

### SolutionPain

Props: `eyebrow`, `headline` (HTML with `<em>`), `body`, `pills: string[]`, `children` (calculator slot)

- `background: #0d1f22`, `padding: 52px 24px`
- Desktop: 2-col grid (copy left, calculator right)
- Mobile: stacked (copy above, calculator below). Pills hidden on mobile.
- `children` renders in the right column (desktop) / below copy (mobile)

### SolutionTabs

Props: `tabs: TabItem[]`

```typescript
interface TabItem {
  label: string;
  icon: string;           // emoji
  iconBg: string;         // rgba value
  title: string;
  body: string;
  bullets: string[];
  imageBg: string;        // CSS gradient placeholder
  imageEmoji: string;
  type?: 'financing';     // triggers FinancingCards render instead of standard layout
}
```

- `background: #ffffff`, `padding: 52px 24px`
- **Desktop (≥ 768px):** horizontal tab bar + content panel (text left, image right)
- **Mobile (< 768px):** accordion — one item open at a time, first open by default
- Mode switch: `useState<boolean>(false)` initialised server-safe, set via `useEffect` + `window.innerWidth` check on mount (avoids hydration mismatch from `useMediaQuery`)
- Accordion animation: CSS `max-height` transition via measured ref
- Chevron rotates 180° when open
- When `tab.type === 'financing'`: renders `<FinancingCards />` as panel body

### FinancingCards

No props — static content per spec.

- CapEx card: `background: #F5F5F5` — "Purchase outright", Section 12B bullets
- OpEx card: `background: #0d1f22` — "PPA or lease", R0 capital bullets
- Desktop: side by side. Mobile: stacked.
- Footer note: muted, centred, tax disclaimer

### Testimonials

Props: `quotes: { text: string; author: string; role: string; company: string }[]`

- 3-col grid desktop, 1-col mobile
- Large opening quote mark: Plus Jakarta Sans 800, 44px, accent colour
- Avatar: 34px circle, Deep Teal bg, white initials
- Placeholder quotes: realistic SA business context per vertical (hardcoded, swap-ready)

---

## Per-Vertical Calculator Logic (from spec)

| Vertical | Input | Key formula | Highlight card |
|---|---|---|---|
| Solar | Monthly bill (R) slider | 5-yr Eskom cost × 0.48 saving | 5-yr potential saving |
| Wheeling | Monthly bill (R) slider | bill × 12 × 0.32 | Annual wheeling saving |
| Optimisation | Monthly bill (R) slider | Same escalation model as solar | Est. monthly energy waste |
| Carbon | Monthly bill (R) slider | (bill/3500) × 1680 × 0.5 × 90/1000 × 8 | Est. annual credit revenue |
| WeBuySolar | Pre-solar monthly bill slider | (bill/3500) × 1680 × 20000 × 0.4/12 | Indicative buyback value |
| EV Fleets | Monthly fuel spend slider | Same escalation model (diesel) | Est. 5-yr fuel saving |

---

## Mobile Accordion — Implementation Detail

```typescript
const [isMobile, setIsMobile] = useState(false);
const [openIndex, setOpenIndex] = useState(0);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);
```

SSR renders desktop tabs (no flash on desktop). Mobile users see a brief tab→accordion swap after hydration — acceptable trade-off vs hydration mismatch errors.

---

## SEO & Metadata Per Page

Each page exports:
- `generateMetadata` — title, description, canonical URL, OG image
- JSON-LD `Service` schema (inline `<script type="application/ld+json">`)

```typescript
// Canonical pattern
alternates: { canonical: `https://phoenixenergy.solutions/solutions/${slug}` }

// JSON-LD Service schema
{ '@type': 'Service', name: config.label, provider: { '@type': 'Organization', name: 'Phoenix Energy' } }
```

---

## Build Order

1. `src/config/verticals.ts` — accent colours, stats, SEO strings
2. Shared section components (order independent):
   - `SolutionHero.tsx`
   - `SolutionSubNav.tsx`
   - `SolutionPain.tsx`
   - `SolutionTabs.tsx`
   - `FinancingCards.tsx`
   - `Testimonials.tsx`
3. Per-vertical calculators — all 6 in `src/components/sections/calculators/`
4. Update `HowItWorks.tsx` — add `showCTA`, `ctaLabel`, `ctaHref` props
5. Update `FeaturedProjects.tsx` — add optional `vertical` filter prop
6. Six solution pages — compose sections, define content, wire metadata

---

## Open Items (from spec)

| # | Item | Owner |
|---|---|---|
| 1 | Real hero photography per vertical | Client |
| 2 | Real client testimonials per vertical | Client |
| 3 | Real project data in Sanity tagged by vertical | Dev |
| 4 | Confirm WeBuySolar excludes Financing tab | Client — assumed excluded in this build |
| 5 | OG images per vertical (1200×630) | Dev |

---

*Phase 4-A Solutions Design | Phoenix Energy Website v3.0*

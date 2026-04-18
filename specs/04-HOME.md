# 04 — Home Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Route: `/`
> **Approved April 2026**

---

## Section Order

```
1. Hero Accordion          ← Full viewport, sits directly under nav
2. Energy Partners         ← Light partner cards (Option B)
3. How It Works            ← Vertical Option A with power-up animation
4. Projects Carousel       ← Horizontal scroll cards (Option B)
5. Blog & Articles         ← Featured article + list sidebar (Option B)
6. CTA Banner              ← Dark split with stats grid (Option A)
7. Footer
```

---

## 1. Hero Accordion

See `specs/03-NAVIGATION.md` for nav spec. Hero sits flush below the nav pill.

Full spec in `specs/04-HOME.md` under Hero Accordion — see approved mockup. Refer to `specs/03-NAVIGATION.md` for the nav pill which overlays the hero.

### Behaviour
- 6 vertical panels, one per solution vertical
- Default: Panel 01 (C&I Solar & Storage) active
- Auto-cycles every **4000ms** when no hover is active
- On `mouseenter` panel: pause timer, activate that panel
- On `mouseleave` accordion wrapper: restart from current panel
- Progress bar (2px, accent colour) fills bottom of active panel over 4s

### Dimensions
- Full width, `height: calc(100vh - 60px)`
- No border-radius — bleeds edge to edge

### Panel collapsed
- `flex: 1`
- Background photo + `rgba(13,31,34,0.72)` dark tint
- Panel number `01`–`06` top-left: Plus Jakarta Sans 800, 11px, `rgba(255,255,255,0.2)`
- Eyebrow: `writing-mode: vertical-rl`, rotated 180°, 9px uppercase
- `1px solid rgba(255,255,255,0.06)` right-edge divider

### Panel active
- `flex: 5`, transition `0.6s cubic-bezier(0.4,0,0.2,1)`
- Photo: `scale(1.04)` Ken Burns over `0.8s`
- Tint: `linear-gradient(180deg, rgba(13,31,34,0.1) 0%, rgba(13,31,34,0.82) 60%, rgba(13,31,34,0.95) 100%)`
- Panel number fades out
- Eyebrow switches to `writing-mode: horizontal-tb`

### Staggered content reveal
| Element | Delay | Animation |
|---|---|---|
| Accent bar | 180ms | `scaleX(0→1)` from left + `opacity 0→1` |
| Title | 200ms | `translateY(10px→0)` + `opacity 0→1`, 350ms |
| Description | 280ms | `translateY(6px→0)` + `opacity 0→1`, 320ms |
| CTA link | 360ms | `translateY(4px→0)` + `opacity 0→1`, 300ms |

### Per-panel data
| # | Solution | Accent | bg tint |
|---|---|---|---|
| 01 | C&I Solar & Storage | `#E3C58D` | `#2a3d28` |
| 02 | Wheeling | `#D97C76` | `#3d2a28` |
| 03 | Carbon Credits | `#9CAF88` | `#28352a` |
| 04 | Energy Optimisation | `#709DA9` | `#1e2e38` |
| 05 | EV Fleets & Infrastructure | `#A9D6CB` | `#1e3230` |
| 06 | WeBuySolar | `#C97A40` | `#2e1e10` |

### Component
```tsx
// src/components/sections/HeroAccordion.tsx
// - useRef: intervalRef, startTimeRef
// - useState: activeIndex (0–5), isPaused
// - onMouseEnter panel: clearInterval, setActive
// - onMouseLeave wrapper: restart interval
// - Progress bar: CSS transition duration synced to interval
// - Photos: next/image fill, placeholder="blur"
// - Framer Motion variants for staggered content reveal
```

---

## 2. Energy Partners

**Approved design:** Option B — Light partner cards

- `background: #ffffff`
- `padding: 32px 20px`
- `border-bottom: 1px solid #E5E7EB`

### Label
- `OUR ENERGY PARTNERS` — Inter 700, 9px, `#6B7280`, uppercase, `letter-spacing: 0.14em`
- `text-align: center`, `margin-bottom: 18px`

### Partner cards row
```css
display: flex;
gap: 10px;
justify-content: center;
flex-wrap: wrap;
```

### Each partner card
- `background: #F5F5F5`, `border-radius: 12px`, `border: 1px solid #E5E7EB`
- `padding: 14px 20px`
- `display: flex`, `align-items: center`, `gap: 12px`
- `flex: 1`, `min-width: 160px`, `max-width: 200px`
- Hover: `border-color: #709DA9`, `background: #ffffff`
- Transition: `all 0.2s`

### Card anatomy
- **Logo mark:** 40×40px, `border-radius: 8px`, brand colour bg, white text initials, Plus Jakarta Sans 800
- **Name:** Plus Jakarta Sans 700, 13px, `#1A1A1A`
- **Role:** Inter 400, 10px, `#6B7280`, `margin-top: 1px`

### Partners (confirmed)
| Logo mark | Name | Role |
|---|---|---|
| `SB` — `#1a3a6e` | Standard Bank | Finance partner |
| `WEG` — `#003087` | WEG | Equipment partner |

> Additional partners can be added — the flex layout accommodates them automatically.

### Mobile
- Same card design, `flex-wrap: wrap`, cards become `min-width: 140px`
- 2-card row for Standard Bank + WEG

---

## 3. How It Works

**Approved design:** Vertical Option A — numbered circles with power-up animation

- `background: #F5F5F5`
- `padding: 48px 24px` desktop / `36px 14px` mobile

### Section header (centred)
- Eyebrow: `HOW IT WORKS`
- H2: `Your path to energy independence` — "independence" in Dusty Blue `#709DA9`
- Subtitle: Inter 400, 13px, muted, `max-width: 440px`, centred, `margin: 8px auto 0`
- `margin-bottom: 44px`

---

### Desktop — 3-column grid with connector

```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 0 16px;
position: relative;
max-width: 760px;
margin: 0 auto;
```

**Connector track** (absolute, behind circles):
- `top: 27px` (centre of 56px circle)
- `left: calc(16.67% + 4px)`, `right: calc(16.67% + 4px)`
- `height: 2px`, `background: #E5E7EB`, `border-radius: 1px`, `overflow: hidden`

**Connector fill** (energy animation):
- `background: linear-gradient(90deg, #39575C, #709DA9)`
- `width: 0%` → `50%` → `100%` as steps advance
- `transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1)`

**Travelling spark** (rides ahead of fill):
- `width: 8px`, `height: 8px`, `border-radius: 50%`, `background: #ffffff`
- `box-shadow: 0 0 0 3px #709DA9, 0 0 12px 4px rgba(112,157,169,0.6)`
- Positioned via JS `left` percentage, `transition: left 0.7s cubic-bezier(0.4,0,0.2,1)`
- `opacity: 0` normally → `1` during transition → `0` after `800ms`

**Each step (column):**
- `display: flex`, `flex-direction: column`, `align-items: center`, `text-align: center`

**Number circle:**
- `width: 56px`, `height: 56px`, `border-radius: 50%`
- Default: `background: #fff`, `border: 2px solid #E5E7EB`, `color: #6B7280`
- Active: `background: #39575C`, `border-color: #39575C`, `color: #fff`, `transform: scale(1.08)`
- Done: `background: #709DA9`, `border-color: #709DA9`, `color: #fff`
- All transitions: `0.4s ease`
- Plus Jakarta Sans 800, 17px

**Pulse ring** (active state only):
```css
/* ::before pseudo on circle */
border: 2px solid rgba(57,87,92,0.25);
animation: pulseRing 1.8s ease-out infinite;

@keyframes pulseRing {
  0%   { transform: scale(1.08); opacity: 1; }
  70%  { transform: scale(1.22); opacity: 0; }
  100% { transform: scale(1.22); opacity: 0; }
}
```

**Zap flash** (on activation):
- Absolute overlay on circle, `background: #39575C`, briefly `opacity: 0.7 → 0` over `180ms`

**Step content:**
- Title: Plus Jakarta Sans 700, 14px, `#1A1A1A` → `#39575C` when active
- Text: Inter 400, 12px, `#6B7280`, `line-height: 1.75`
- Tag pill: Inter 600, 10px, `background: rgba(57,87,92,0.08)`, `color: #39575C`
  - `opacity: 0`, `transform: translateY(4px)` → `opacity: 1`, `translateY(0)` on active/done
  - Transition: `0.3s ease 0.2s`

**Progress dots:**
- `display: flex`, `gap: 8px`, `justify-content: center`, `margin-top: 32px`
- Inactive: `width: 8px`, `height: 8px`, `border-radius: 50%`, `background: #E5E7EB`
- Active: `width: 24px`, `border-radius: 4px`, `background: #39575C`
- Transition: `all 0.3s`

**Auto-cycle:**
- Advances every **2600ms**
- Clicking a dot pauses auto-cycle permanently for that session

**CTA button:**
- `Get a Free Assessment →` — Deep Teal fill, white text, pill, centred, `margin-top: 28px`

---

### Steps content
| # | Title | Body | Tag |
|---|---|---|---|
| 01 | Free assessment | We visit your site and model three solution scenarios at no cost, no obligation. | No cost · No obligation |
| 02 | Proposal & financing | Full ROI model, payback period, and financing options delivered in 5 business days. | Delivered in 5 days |
| 03 | Installation & beyond | Certified install in 8–12 weeks, then 24/7 monitoring with a 25-year warranty. | 8–12 week commissioning |

---

### Mobile — continuous vertical spine

```css
/* Wrapper */
display: flex;
flex-direction: column;
position: relative;
```

**Spine** (single continuous line, NOT per-step segments):
```css
position: absolute;
left: 21px;          /* centre of 44px circle */
top: 22px;           /* centre of first circle */
bottom: 22px;        /* centre of last circle */
width: 2px;
background: #E5E7EB;
border-radius: 1px;
overflow: hidden;
```

**Spine fill:**
- `background: linear-gradient(180deg, #39575C, #709DA9)`
- `height: 0%` → grows downward as steps complete
- `transition: height 0.7s cubic-bezier(0.4, 0, 0.2, 1)`

**Mobile spark:**
- Same visual as desktop spark but travels vertically
- `top` position calculated as `(pct / 100) * spineHeight`

**Each step:**
```css
display: flex;
gap: 16px;
padding: 18px 0;
align-items: flex-start;
position: relative;
z-index: 1;        /* sits above spine */
```

**Mobile circle:** 44px, same state colours as desktop
**Mobile title:** Plus Jakarta Sans 700, 13px
**Mobile text:** Inter 400, 11px, `#6B7280`
**Mobile tag:** 9px, same style

**4 steps on mobile** (adds step 04: Ongoing monitoring & support — 24/7 monitoring, monthly reports, 25-year panel warranty. Tag: `25-yr warranty`)

---

## 4. Projects Carousel

**Approved design:** Option B — Horizontal scroll cards

- `background: #ffffff`
- `padding: 48px 20px` desktop / `36px 14px` mobile

### Section header row
- Left: eyebrow `FEATURED PROJECTS` + H2 `Work that speaks for itself` — "for itself" in Dusty Blue
- Right: `View all projects →` — Inter 500, 12px, Deep Teal

### Scroll container
```css
display: flex;
gap: 14px;
overflow-x: auto;
scrollbar-width: none;
padding-bottom: 8px;
/* bleed to edges */
margin: 0 -20px;
padding-left: 20px;
padding-right: 20px;
```

### Each project card
- `width: 260px`, `flex-shrink: 0`
- `background: #fff`, `border: 1px solid #E5E7EB`, `border-radius: 16px`, `overflow: hidden`
- Hover: `translateY(-4px)`, `border-color: #bbbbbb`
- Transition: `transform 0.2s, border-color 0.2s`

**Photo area:** `height: 148px`, `overflow: hidden`
- Photo inner: `scale(1.07)` on card hover over `0.5s`
- Accent bar: `3px`, full width, `position: absolute`, `top: 0`, `z-index: 2`

**Card body** (padding `14px`):
- Badge: accent bg 10% opacity + accent text + 5px dot
- Title: Plus Jakarta Sans 700, 13px, `line-height: 1.35`, `margin-bottom: 10px`
- `1px` rule `#E5E7EB`
- Stats row: 2 stats side by side — value (Plus Jakarta Sans 700, 13px, Deep Teal) + label (9px, muted)
- Footer: location left (10px, muted) + arrow circle right (24px, hover fills Deep Teal)

### Project cards (pull from Sanity, `featured: true`)
| Vertical | Accent | Sample title |
|---|---|---|
| C&I Solar & Storage | `#E3C58D` | Shoprite DC — 4.8 MW + 2 MWh BESS |
| Wheeling | `#D97C76` | Cape Town Industrial — 5 MW PPA |
| EV Fleets | `#A9D6CB` | Transnet Fleet Phase 1 — 40 trucks |
| Carbon Credits | `#9CAF88` | Mpumalanga Carbon Offset Programme |
| WeBuySolar | `#C97A40` | Pretoria Estate Buyback — 42 systems |

### Mobile
- Same horizontal scroll, card `width: 200px`
- Photo `height: 110px`
- Margin bleed: `0 -14px`, `padding-left: 14px`

---

## 5. Blog & Articles

**Approved design:** Option B — Featured article + list sidebar

- `background: #F5F5F5`
- `padding: 48px 20px` desktop / `36px 14px` mobile

### Section header row
- Left: eyebrow `LATEST INSIGHTS` + H2 `News, views & analysis` — "analysis" in Dusty Blue
- Right: `All articles →` — Inter 500, 12px, Deep Teal

### Desktop — 2-column grid
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 20px;
```

**Featured article card (left):**
- `background: #fff`, `border-radius: 14px`, `overflow: hidden`
- `border: 1px solid #E5E7EB`
- Hover: `translateY(-3px)`
- Photo: `height: 180px`
- Body padding: `18px`
- Category pill: Inter 700, 9px, uppercase, Deep Teal bg at 10% opacity
- Title: Plus Jakarta Sans 800, 16px, `line-height: 1.35`
- Excerpt: Inter 400, 11px, muted, `line-height: 1.7`
- Meta: `[date] · [read time]` — Inter 400, 10px, muted

**List (right) — 3 articles:**
- `background: #fff`, `border-radius: 14px`, `overflow: hidden`
- `border: 1px solid #E5E7EB`
- Each item: `display: flex`, `gap: 12px`, `padding: 14px 16px`
- `border-bottom: 1px solid #E5E7EB`. Last item: none
- Hover: `background: #F5F5F5`
- Thumb: `60×52px`, `border-radius: 8px`
- Category: Inter 600, 9px, uppercase, `#709DA9`
- Title: Plus Jakarta Sans 700, 12px, `line-height: 1.4`
- Meta: Inter 400, 10px, muted

### Mobile — stacked
- Featured card full-width, photo `height: 140px`
- List below: same 3-item layout, `border-radius: 12px`
- Show 2 list items on mobile (3rd hidden to reduce scroll length)

### Content (from Sanity, `publishedAt desc`)
Categories: `Company News` · `Industry Insights` · `Project Spotlights` · `Press Releases`

---

## 6. CTA Banner

**Approved design:** Option A — Dark split with stats grid

- `background: #0d1f22`
- `padding: 48px 20px` desktop / `36px 14px` mobile

### Desktop — 2-column split
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 40px;
align-items: center;
max-width: 960px;
margin: 0 auto;
```

**Left — copy:**
- Eyebrow: `START TODAY` — Inter 700, 9px, `rgba(255,255,255,0.35)`, uppercase
- Headline: Plus Jakarta Sans 800, 24px, white, `line-height: 1.2`
  - *"Ignite what's possible for your business"*
- Body: Inter 400, 12px, `rgba(255,255,255,0.55)`, `line-height: 1.75`, `margin-bottom: 22px`
  - *"Get a free energy assessment from Phoenix Energy's certified engineers — no commitment, no cost, results delivered in 48 hours."*
- Buttons:
  - `Get a Free Quote` — `#F5F5F5` bg, Deep Teal text, pill
  - `Explore solutions` — `rgba(255,255,255,0.08)` bg, `border: 1px solid rgba(255,255,255,0.15)`, white text

**Right — stats grid:**
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 10px;
```
Each stat card:
- `background: rgba(255,255,255,0.05)`
- `border: 1px solid rgba(255,255,255,0.06)`
- `border-radius: 12px`, `padding: 14px`
- Value: Plus Jakarta Sans 800, 22px, white
- Label: Inter 400, 9px, `rgba(255,255,255,0.35)`, uppercase, `letter-spacing: 0.08em`

### Stats data (update when real figures confirmed)
| Value | Label |
|---|---|
| 120+ | Projects completed |
| 48 MW | Deployed |
| 12k t | CO₂ saved / yr |
| R380M | Client savings |

### Mobile — stacked
- Copy section first (full width)
- Both buttons: `flex: 1` equal-width row
- Stats grid below buttons: same 2×2 layout, `gap: 8px`
- Stat cards: `border-radius: 10px`, `padding: 12px`
- Value: 18px, label: 8px

---

## 7. Footer

- `background: #0d1f22`
- `border-top: 1px solid rgba(255,255,255,0.06)`

### Desktop — single row
```
[PHOENIX.ENERGY logo]    [© 2025 Phoenix Energy. All rights reserved.]    [Privacy Policy · Legal]
        left                              centre                                    right
```
- Logo: Plus Jakarta Sans 800, 12px, white + Dusty Blue dot
- Copy: Inter 400, 9px, `rgba(255,255,255,0.3)`
- Links: Inter 400, 9px, `rgba(255,255,255,0.35)`, `gap: 14px`
- `padding: 16px 20px`

### Mobile — centred stack
- Logo centred, copy below
- `padding: 14px`

---

## Page-level SEO

```typescript
// src/app/page.tsx
export const metadata = {
  title: 'Phoenix Energy — Integrated Clean Energy Solutions for SA Businesses',
  description: 'C&I solar, wheeling, carbon credits, EV fleets and more. Get a free energy assessment from Phoenix Energy today.',
  openGraph: {
    images: [{ url: '/og-home.jpg' }],
  },
};
```

---

## Component Map

| Section | Component |
|---|---|
| Hero | `src/components/sections/HeroAccordion.tsx` |
| Partners | `src/components/sections/PartnerCards.tsx` |
| How It Works | `src/components/sections/HowItWorks.tsx` |
| Projects | `src/components/sections/FeaturedProjects.tsx` |
| Blog | `src/components/sections/LatestPosts.tsx` |
| CTA | `src/components/sections/CTABanner.tsx` |
| Footer | `src/components/layout/Footer.tsx` |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.1 | Approved April 2026*

---

## Engineering Review Fixes (April 2026)

### HowItWorks component — authoritative interface
`07-SOLUTIONS.md` interface is the single source of truth. The homepage uses the same component with:
```typescript
<HowItWorks
  title="Your path to energy <em>independence</em>"
  steps={HOME_HIW_STEPS}
  autoAdvanceInterval={2600}
  showCTA={false}   // No CTA button on homepage — dedicated section follows
/>
```

### Homepage metadata — complete spec
```typescript
export const metadata: Metadata = {
  title: 'Phoenix Energy — Integrated Clean Energy Solutions for SA Businesses',
  description: 'C&I solar, wheeling, carbon credits, EV fleets and more. Get a free energy assessment from Phoenix Energy today.',
  alternates: { canonical: 'https://phoenixenergy.solutions' },
  openGraph: {
    title: 'Phoenix Energy — Save, Earn & Grow with Renewable Energy',
    description: 'Six clean energy verticals. One partner. End-to-end solutions for Southern African businesses.',
    url: 'https://phoenixenergy.solutions',
    siteName: 'Phoenix Energy',
    images: [{ url: 'https://phoenixenergy.solutions/og-home.jpg', width: 1200, height: 630, alt: 'Phoenix Energy — Clean Energy Solutions for Southern Africa' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phoenix Energy — Save, Earn & Grow with Renewable Energy',
    description: 'Six clean energy verticals. One partner. End-to-end solutions for Southern African businesses.',
    images: ['https://phoenixenergy.solutions/og-home.jpg'],
  },
};
```

**Required static asset:** `/public/og-home.jpg` — 1200×630px, Deep Teal background with logo and tagline. Generate before launch.


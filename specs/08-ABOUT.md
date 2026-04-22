# 08 — About Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Route: `/about`
> **Approved April 2026**

---

## Section Order

```
1.  Navbar           — light glass pill, "About" active
2.  Breadcrumb       — Home / About
3.  Hero             — full-bleed photo + gradient overlay
4.  Stats strip      — Deep Teal, flush below hero, NO overlap
5.  Story            — two-column: image left, copy right
6.  Mission strip    — dark full-width two-column
7.  Values           — dark cards grid (3 × 2)
8.  Timeline         — horizontal scroll carousel with dot navigation
9.  Team             — dark cards grid + category filter tabs
10. Trust            — tabbed: Investors & Financiers / Partners / Media & Press
11. Careers band     — inline row with CTA button
12. CTA banner       — Deep Teal centred
13. Footer
```

---

## 1. Navbar

- Light glass pill: `background: rgba(255,255,255,0.92)`, `backdrop-filter: blur(12px)`
- `border: 1px solid rgba(57,87,92,0.15)`
- Logo: Deep Teal `#39575C` + Dusty Blue dot
- Active link: "About" — Deep Teal, `font-weight: 600`
- CTA: Deep Teal fill + white text

---

## 2. Breadcrumb

```
Home / About
```
- Inter 400, 9px, `#6B7280`
- Current: `#39575C`, `font-weight: 600`
- `padding: 6px 20px 0`

---

## 3. Hero

- `position: relative`, `height: 300px`, `overflow: hidden`

**Photo layer:**
- `next/image` fill, `object-fit: cover`, `object-position: center`
- Placeholder: gradient `linear-gradient(135deg, #1a3a3e, #0d1f22)`
- Replace with real team / project / Southern Africa landscape photography

**Overlay:**
```css
background: linear-gradient(180deg, rgba(13,31,34,0.2) 0%, rgba(13,31,34,0.9) 100%);
```

**Bottom-anchored content** (`padding: 32px 24px`, `max-width: 960px`, `margin: 0 auto`):
- Eyebrow: `THE RISE OF PHOENIX ENERGY` — Inter 700, 9px, `rgba(255,255,255,0.4)`, uppercase, `letter-spacing: 0.14em`, `margin-bottom: 10px`
- Headline: Plus Jakarta Sans 800, 28px, white, `line-height: 1.2`, `max-width: 560px`
  - *"Save, earn & grow with renewable energy across Africa"*
  - "Africa" in Dusty Blue `#709DA9`

---

## 4. Stats Strip

> ~~Removed April 2026.~~ The stats strip has been removed. The hero flows directly into the Story section. Impact numbers (48 MW, 120+, R380M, 12kt) are now presented in the Story section's animated stat panel.

---

## 5. Story Section

- `background: #ffffff`
- `padding: 52px 24px`

### Desktop — 2-column grid
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 44px;
align-items: start;
max-width: 960px;
margin: 0 auto;
```

**Left — animated stat panel:**
- Container: `border-radius: 16px`, `height: 230px`, `background: #0d1f22`
- Inner 2×2 grid: absolute inset-0, `gap: 3px`, `padding: 3px`
- Stats: R380M (Client savings — featured), 48MW (Deployed), 120+ (Projects), 12kt (CO₂ saved / yr)
- Featured tile (R380M): `background: linear-gradient(140deg, #1a4a52 0%, #0f2d33 100%)` + radial glow, value `font-size: 26px`
- Other tiles: `background: rgba(255,255,255,0.04)`, value `font-size: 24px`
- Shimmer: `.shimmer-tile` CSS class (`globals.css`) — 1px gradient sweeps tile top; `--shimmer-delay` CSS var staggers per tile
- Scroll reveal: Framer Motion `useInView`, spring stagger 0 → 0.45s; component is `'use client'`
- Badge bottom-left: "Since 2019 / Our impact" — `background: #39575C`, `border: 2px solid white`

**Right — copy:**
- Eyebrow: `OUR STORY`
- H2: `Built to make clean energy accessible across Africa` — "accessible" in Dusty Blue
- Body paragraph: Inter 400, 12px, `#6B7280`, `line-height: 1.8`, `margin-bottom: 12px`
- Pull quote block:
  - `border-left: 3px solid #709DA9`
  - `padding: 12px 16px`
  - `background: rgba(112,157,169,0.07)`
  - `border-radius: 0 8px 8px 0`
  - `margin: 14px 0`
  - Quote text: Plus Jakarta Sans 700, 13px, `#1A1A1A`, italic, `line-height: 1.5`
    - *"For us, it's not just about saving — it's about empowering businesses to earn, grow, and thrive sustainably."*
  - Source: Inter 400, 10px, `#6B7280`, `margin-top: 5px` — *"— Phoenix Energy founding vision"*
- Second body paragraph

**Copy (from phoenixenergy.tech):**
> Phoenix Energy was created to make renewable energy both accessible and transformative across Africa. We set ourselves apart by providing bespoke, turnkey solutions that go beyond conventional energy savings. Our approach gives businesses a comprehensive roadmap designed to drive Net Zero Carbon Emissions, enhance efficiency, and unlock new revenue streams across Southern Africa and beyond.

### Mobile — stacked
- Image full-width, `height: 200px`
- Copy below, same padding

---

## 6. Mission Strip

- `background: #0d1f22`
- `padding: 52px 24px`

### Desktop — 2-column asymmetric
```css
display: grid;
grid-template-columns: 1fr 2fr;
gap: 40px;
align-items: center;
max-width: 960px;
margin: 0 auto;
```

**Left:**
- Label: `WHAT DRIVES US` — Inter 700, 9px, `rgba(255,255,255,0.35)`, uppercase, `margin-bottom: 12px`
- Title: Plus Jakarta Sans 800, 22px, white, `line-height: 1.3`
  - *"Mission &"* + line break + *"vision"* — "vision" in Dusty Blue `#709DA9`

**Right — 2-column split:**
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 20px;
```
Each column:
- `border-left: 2px solid rgba(255,255,255,0.08)`
- `padding-left: 16px`
- Title: Plus Jakarta Sans 700, 13px, white, `margin-bottom: 6px`
- Text: Inter 400, 11px, `rgba(255,255,255,0.5)`, `line-height: 1.75`

**Content:**
- **Our mission:** *"Deliver bespoke solutions that propel businesses toward Net Zero Carbon Emissions, optimise efficiency, and unlock new revenue streams. Clean energy. Thriving enterprises. A prosperous, resilient Africa."*
- **Our vision:** *"An Africa where renewable energy fuels unstoppable growth and lasting sustainability — where every business has access to a fullstack clean energy solution."*

### Mobile — stacked
- Left (label + title) above, two mission columns stacked below

---

## 7. Values

- `background: #F5F5F5`
- `padding: 52px 24px`
- Eyebrow: `WHAT WE STAND FOR`
- H2: `Our values` — "values" in Dusty Blue

### Desktop — 3×2 grid (6 cards including join card)
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 12px;
margin-top: 32px;
max-width: 960px;
margin-left: auto;
margin-right: auto;
```

### Value card (dark)
- `background: #0d1f22`, `border-radius: 14px`, `padding: 22px`
- Hover: `translateY(-3px)`, `background: #162630`
- Transition: `transform 0.2s, background 0.2s`

**Anatomy:**
- Number: Plus Jakarta Sans 800, 28px, `rgba(255,255,255,0.08)`, `line-height: 1`, `margin-bottom: 12px`
- Title: Plus Jakarta Sans 700, 14px, white, `margin-bottom: 8px`
- Text: Inter 400, 11px, `rgba(255,255,255,0.5)`, `line-height: 1.75`

### Values content (from phoenixenergy.tech/about)
| # | Title | Text |
|---|---|---|
| 01 | Empathy | We put people first, understanding our clients' unique needs to create meaningful, impactful solutions. |
| 02 | Pioneering | We break new ground with advanced renewable solutions, setting new standards for sustainable growth in business. |
| 03 | Trust | We build lasting partnerships rooted in integrity, transparency, and unwavering reliability. |
| 04 | Conscience | Everything we do is driven by our commitment to creating positive change for the planet and future generations. |
| 05 | Inspiration | We inspire businesses by creating new opportunities to deliver efficient, sustainable services — empowering them to inspire their own customers. |

### 6th card — Ubuntu
- Same dark card style as values 01–05: `background: #0d1f22`, `border-radius: 14px`
- Number: `06` in `rgba(255,255,255,0.08)`
- Title: `Ubuntu` — white
- Text: *"We are rooted in the African belief that we grow stronger together — alongside our clients, our communities, and our continent."*

### Mobile — 1-column stacked

---

## 8. Timeline Carousel

- `background: #ffffff`
- `padding: 52px 24px`
- Eyebrow: `ROADMAP`
- H2: `Our story so far` — "so far" in Dusty Blue

### Track
```css
/* Top border of scroll container = the timeline track */
border-top: 2px solid #E5E7EB;
margin-top: 32px;
```

### Scroll container
```css
display: flex;
gap: 0;
overflow-x: auto;
scrollbar-width: none;
```
Each item: `width: 200px`, `flex-shrink: 0`, `padding-top: 20px`, `position: relative`

### Per-item top line fill
```css
/* ::before on each item */
position: absolute;
top: -2px;
left: 0;
width: 0%;   /* → 100% when done/active */
height: 2px;
background: #39575C;  /* done: #709DA9 */
transition: width 0.4s;
```

### Dot
- `width: 12px`, `height: 12px`, `border-radius: 50%`
- `position: absolute`, `top: -7px`, `left: 20px`
- Default: `background: #E5E7EB`, `border: 2px solid #E5E7EB`
- Active: `background: #39575C`, `border-color: #39575C`
- Done: `background: #709DA9`, `border-color: #709DA9`

### Item anatomy
- Date: Inter 700, 10px, `#709DA9`, `margin-bottom: 6px`, `margin-top: 4px`
- Image: `width: 100%`, `height: 90px`, `border-radius: 10px`, `next/image` fill
- Title: Plus Jakarta Sans 700, 12px, `#1A1A1A`, `line-height: 1.4`

### Auto-advance
- Advances every **2800ms**
- Smooth scroll: `scrollTo({ left: item.offsetLeft - 20, behavior: 'smooth' })`
- Progress dots row below: same style as How It Works dots

### Milestone data (placeholders — confirm real dates)
| Date | Event |
|---|---|
| 2019 | Founded by Erin, Ricardo & Russel with a vision to transform African energy |
| 2020 | First C&I solar installation commissioned in Gauteng |
| 2021 | BESS offering launched — first battery + solar hybrid project delivered |
| 2022 | Wheeling vertical launched — first PPA agreement signed |
| 2023 | Carbon credits programme launched — Gold Standard certification |
| 2024 | EV Fleets & Infrastructure vertical launched — Transnet Phase 1 commissioned |
| 2025 | WeBuySolar platform launched — 42 systems acquired in first 6 months |
| 2030 | Vision: Net Zero roadmap delivered for 1,000+ Southern African businesses |

> ⚠️ **Confirm real founding year and milestone dates with client before build.**

---

## 9. Team Section

- `background: #F5F5F5`
- `padding: 52px 24px`
- Eyebrow: `THE TEAM`
- H2: `Meet the people behind Phoenix Energy` — "behind Phoenix Energy" in Dusty Blue

### Category filter tabs
```
[All]  [Founders]  [Business]  [Technical]
```
- Default: white bg, `border: 1px solid #E5E7EB`, muted text
- Active: Deep Teal fill, white text, `font-weight: 600`
- `border-radius: 9999px`, Inter 500, 11px
- Filter logic: CSS `display: none` toggle on `.tc[data-cat]` cards

### Team grid
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 12px;
```

### Team card (dark, Greenlyte-style)
- `background: #0d1f22`, `border-radius: 14px`, `overflow: hidden`
- Hover: `translateY(-4px)`

**Photo area:** `height: 150px`
- `next/image` fill, `object-fit: cover`
- LinkedIn icon: absolute `top: 10px`, `right: 10px` — 24px circle, `background: rgba(255,255,255,0.1)`, `color: rgba(255,255,255,0.6)`, "in" text

**Body** (`padding: 14px`):
- Name: Plus Jakarta Sans 700, 13px, white, `margin-bottom: 3px`
- Archetype title: Inter 600, 11px, `#709DA9` (Dusty Blue), `margin-bottom: 2px`
  - *"The Strategist"*, *"The Innovator"*, *"The Trailblazer"*
- Role: Inter 400, 10px, `rgba(255,255,255,0.45)`

### Confirmed team members
| Name | Archetype | Role | Filter |
|---|---|---|---|
| Erin Berman-Levy | The Strategist | Co-Founder | Founders |
| Ricardo De Sousa | The Innovator | Co-Founder | Founders |
| Russel Swanepoel | The Trailblazer | Co-Founder | Founders |
| + additional team | TBC | TBC | Business / Technical |

> ⚠️ **Team data is managed entirely through Sanity CMS — not hardcoded.** See `12-CMS.md` for the full `teamMember` schema and field guidance. Client must create team member documents in Sanity Studio before launch. Required fields per member: name, photo, role, category, order. See `14-OPEN-ITEMS.md` for the full client action checklist.

### "Join the journey" card
- `grid-column: span 3` — spans full grid width
- `background: #0d1f22`, `border-radius: 14px`, `padding: 20px`
- `display: flex`, `align-items: center`, `justify-content: space-between`, `gap: 16px`
- Left: title *"Become a part of our journey"* (Plus Jakarta Sans 700, 15px, white) + sub *"We're always looking for passionate, ambitious individuals..."* (Inter 400, 11px, muted white)
- Right: `See career opportunities →` button — `#F5F5F5` bg, Deep Teal text, pill

### Mobile — 1-column, filter tabs scroll horizontally

---

## 10. Trust Section

- `background: #ffffff`
- `padding: 52px 24px`
- `border-top: 1px solid #E5E7EB`
- Eyebrow: `TRUSTED BY THE BEST`
- H2: `Our network` — "network" in Dusty Blue

### Tab navigation (Greenlyte-style)
```
[Investors & Financiers]  [Partners]  [Media & Press]
```
- `border-bottom: 1px solid #E5E7EB`, `margin-top: 28px`, `margin-bottom: 28px`
- Each tab: Inter 600, 11px, muted, `padding: 10px 20px`
- Active: Deep Teal text, `border-bottom: 2px solid #39575C`, `margin-bottom: -1px`

### Logo grid (all three panels use same layout)
```css
display: flex;
flex-wrap: wrap;
```
Each logo item:
- `padding: 16px 24px`
- `border-right: 1px solid #E5E7EB`
- `border-bottom: 1px solid #E5E7EB`
- `flex: 1`, `min-width: 140px`
- `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 4px`
- Hover: `background: #F5F5F5`
- Logo mark: 44×44px rounded square, brand colour bg, white initials
- Name: Plus Jakarta Sans 700, 12px, `#1A1A1A`
- Role/sub: Inter 400, 9px, `#6B7280`

### Investors & Financiers panel
| Mark | Name | Role |
|---|---|---|
| SB — `#1a3a6e` | Standard Bank | Finance partner |
| WEG — `#003087` | WEG | Equipment financier |
| CP — `#39575C` | Captive Power | Strategic investor |
| BE — `#5a3a1a` | Blue Echo | Technology partner |

### Partners panel
Standard Bank · WEG · Blue Echo · Captive Power + additional partners

### Media & Press panel
Use text-only logo marks (publication name in Inter 700, muted) until real SVG logos provided:
Business Day · Fin24 · Engineering News · Daily Maverick · ESI Africa · EE Publishers

> ⚠️ **Full partner/investor list and SVG logo files to be provided by client.**

### Mobile — single column logos, tabs scroll horizontally

---

## 11. Careers Band

> ~~Removed April 2026.~~ The standalone careers band has been removed. The single careers touchpoint on the About page is the "Become a part of our journey" banner at the bottom of the Team section grid (section 9).

---

## 12. CTA Banner

- `background: #39575C`
- `padding: 52px 24px`
- `text-align: center`

```
[max-width: 520px, margin: 0 auto]
Headline: "Work with us"
Sub: "Whether you're a prospective client or a future partner — we'd love to hear from you."
[Get in Touch]   [View our projects]
```
- Headline: Plus Jakarta Sans 800, 24px, white
- Sub: Inter 400, 12px, `rgba(255,255,255,0.6)`, `margin-bottom: 22px`
- Primary btn: white bg, Deep Teal text, pill
- Ghost btn: `rgba(255,255,255,0.1)` bg, `border: 1px solid rgba(255,255,255,0.2)`, white text

---

## SEO & Metadata

```typescript
export const metadata = {
  title: 'About Phoenix Energy — Our Story, Mission & Team',
  description: 'Learn about Phoenix Energy\'s founding story, mission to drive Net Zero across Africa, our values, and the team behind Southern Africa\'s leading clean energy company.',
  openGraph: {
    images: [{ url: '/og-about.jpg' }],
  },
};
```

---

## Component Map

| Section | Component |
|---|---|
| Hero | `src/app/about/page.tsx` (inline, not reused) |
| ~~Stats strip~~ | ~~removed April 2026~~ — `StatsStrip` still used on `/projects/[slug]` |
| Story | `src/components/sections/AboutStory.tsx` |
| Mission | `src/components/sections/AboutMission.tsx` |
| Values | `src/components/sections/AboutValues.tsx` |
| Timeline | `src/components/sections/AboutTimeline.tsx` |
| Team | `src/components/sections/AboutTeam.tsx` |
| Trust | `src/components/sections/AboutTrust.tsx` |
| ~~Careers band~~ | ~~removed April 2026~~ — `CareersBand.tsx` deleted |
| CTA | `src/components/sections/CTABanner.tsx` (shared) |
| Footer | `src/components/layout/Footer.tsx` (shared) |

---

## Open Items for This Page

| # | Item | Owner |
|---|---|---|
| 1 | Confirm real founding year and timeline milestone dates | Client |
| 2 | Team photos (high-res, consistent lighting/style) | Client |
| 3 | Team LinkedIn URLs | Client |
| 4 | Additional team members beyond 3 founders | Client |
| 5 | Full investor / partner list with SVG logos | Client |
| 6 | Media / press logos (SVG preferred) | Client |
| 7 | Hero photography (team / Southern Africa landscape) | Client |
| 8 | Careers page URL (replace LinkedIn link when live) | Dev |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.1 | Approved April 2026*

---

## Engineering Review Fixes (April 2026)

### Timeline — active item animation
When a new item becomes active:
- Image: `scale(0.97 → 1)` over `400ms cubic-bezier(0.4,0,0.2,1)`
- Title: `opacity: 0.5 → 1` + `translateY(4px → 0)` over `300ms`

### Timeline — mobile behaviour
- Card width: `calc(80vw)` (peek pattern — 1.25 visible at any time)
- `scroll-snap-type: x mandatory` on container, `scroll-snap-align: start` on each item
- Auto-advance: **disabled on mobile** — gesture-first UX

### Trust tabs — mobile logo grid
2 logos per row (not 1 column). Same border grid pattern as desktop:
```css
.logo-item { flex: 1; min-width: 50%; }
```

### Trust tabs — mobile tab scroll
`overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch`


---

## Team Section — CMS-Driven Update (April 2026)

The team grid is **fully driven by Sanity**. No team member data is hardcoded in the component. The `AboutTeam.tsx` component fetches all active team members at build time and renders them dynamically. Adding, editing, or removing a team member in Sanity triggers a webhook that revalidates `/about` immediately.

### Data fetch
```typescript
// src/app/about/page.tsx (server component)
const teamMembers = await sanityClient.fetch(TEAM_MEMBERS_QUERY);
// Pass as prop to <AboutTeam members={teamMembers} />
```

### Category filter logic
Filter tabs (All / Founders / Business / Technical) are derived from the `category` field on each document — no hardcoded category list in the component. If no members exist in a category, that tab is hidden automatically.

### "Join the journey" card
Always rendered as the final item in the grid regardless of team member count. `grid-column: span 3` on desktop, `span 1` on mobile (full width via 1-col grid). This card is static — not CMS-managed.

### Mobile — 1-column grid, filter tabs scroll horizontally
Filter tabs: `overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; white-space: nowrap`


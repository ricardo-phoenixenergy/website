# 04 — Home Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Route: `/`
> **Approved April 2026**
> **Updated 2026-09-24:** corrected to match the build (`src/app/page.tsx` and the components it renders).

---

## Section Order

```
1. Hero                    ← HeroAccordion: accordion from 1280px, static hero and solution list below
2. By the numbers          ← CompanyStats: stats from Sanity (Company Stats)
3. Who we work with        ← AboutTrust without tabs: partner logos from Sanity
4. Projects                ← FeaturedProjects: featured projects from Sanity
5. How It Works            ← HowItWorks: content from Sanity (How It Works, Home)
6. Latest insights         ← LatestPosts: the three newest posts
7. CTA band                ← PageFooter, centred, company-level copy
8. Footer                  ← SiteFooter, rendered by SiteShell on every page
```

This is the order in `src/app/page.tsx`. The sections below keep their April numbering and headings. How It Works is hidden when its Sanity document has no title or no steps; Projects and Latest insights are hidden when Sanity returns nothing.

**By the numbers** (`CompanyStats.tsx`) has no section of its own here. It is a white strip under the hero with a 1px `#E5E7EB` top border and the centred eyebrow "By the numbers", then one column per stat (stacked below 768px): the value in Plus Jakarta Sans 800, 30px (36px from 768px) with its units in Dusty Blue ink, a 3px × 24px Dusty Blue bar, and a 12px uppercase label, plus an "As at" caption when the stat is dated. Numbers count up once if the strip starts off-screen. The stats come from the Sanity Company Stats document (`specs/12-CMS.md`); if that is empty or Sanity is unreachable, the fallback in `src/lib/companyStats.ts` shows instead.

Sizes and colours follow `specs/01-BRAND.md`: nothing below 12px, muted text `#646B78`, and Dusty Blue as text on light surfaces `#45727E`.

---

## 1. Hero Accordion

See `specs/03-NAVIGATION.md` for nav spec. Hero sits flush below the nav pill.

Full spec in `specs/04-HOME.md` under Hero Accordion — see approved mockup. Refer to `specs/03-NAVIGATION.md` for the nav pill which overlays the hero.

### Behaviour
- From 1280px (`xl`): six vertical panels, one per solution vertical.
- Default: Panel 01 (C&I Solar & Storage) active.
- A panel opens on hover (`mouseenter`), click or keyboard: each panel is filled by a `<button aria-expanded>`. Nothing rotates on its own (WCAG 2.2.2), so there is no timer and no progress bar.
- On first load the open panel's text is in the server HTML at full opacity. The staggered reveal plays only after the visitor opens another panel.
- The desktop H1 is screen-reader only: "Phoenix Energy: integrated clean energy solutions for South African businesses".
- Below 1280px there is no accordion. A static hero shows the C&I photo under a dark gradient, the H1 "Integrated clean energy for South African businesses", a summary ("Six solutions, one partner. Cut your electricity costs, buy renewable power through the grid, electrify your fleet or earn from the solar you already have.") and a "Book a discovery meeting" button (`DISCOVERY_CTA`). Below it comes a list of the six solutions, two columns from 768px. Each row has a 56px thumbnail, an accent dot, the solution name and its panel heading, and links to the solution page.

### Dimensions
- Accordion: full width, `height: calc(100vh - 60px)`, `min-height: 500px`.
- The hero bleeds edge to edge, with no border-radius.
- Static hero below 1280px: at least `min(78svh, 720px)` tall with its text at the bottom, then the solution list.

### Panel collapsed
- `flex: 1`.
- Background photo + `rgba(13,31,34,0.72)` dark tint.
- No panel number. The only content is the vertical label.
- Label: the solution name, Inter 700, 12px, uppercase, `letter-spacing: 0.14em`, `#B9C3C5` (on-dark-muted; on-dark-subtle measured 3.8:1 over the lighter photos), `writing-mode: vertical-rl`, rotated 180°, centred in the panel.
- `1px solid rgba(255,255,255,0.06)` right-edge divider (none on the last panel).

### Panel active
- `flex: 5`, transition `0.6s cubic-bezier(0.4,0,0.2,1)`.
- Photo: `scale(1.05)` over `0.8s` ease-in-out; no zoom under reduced motion.
- Tint: `linear-gradient(180deg, rgba(13,31,34,0.1) 0%, rgba(13,31,34,0.82) 60%, rgba(13,31,34,0.95) 100%)`.
- The vertical label becomes screen-reader only. The content sits at the bottom of the panel (`padding: 0 32px 48px`): a 40 × 2px accent bar, the solution name as an eyebrow (Inter 700, 12px, uppercase, accent colour), the heading as an H2 (Plus Jakarta Sans 800, white, `clamp(1.75rem, 3vw, 2.75rem)`, max-width 520px), the description (Inter 400, 16px, `#B9C3C5`, max-width 440px) and an "Explore {solution}" link with an arrow (Inter 600, 16px, accent colour).

### Staggered content reveal
Plays only when a visitor opens a panel, never on first load.

| Element | Delay | Animation |
|---|---|---|
| Accent bar | 180ms | `scaleX(0→1)` from left + `opacity 0→1`, 300ms |
| Eyebrow | 180ms | `translateY(10px→0)` + `opacity 0→1`, 350ms |
| Title | 220ms | `translateY(10px→0)` + `opacity 0→1`, 350ms |
| Description | 300ms | `translateY(10px→0)` + `opacity 0→1`, 350ms |
| CTA link | 380ms | `translateY(10px→0)` + `opacity 0→1`, 350ms |

### Per-panel data
| # | Solution | Accent | Heading |
|---|---|---|---|
| 01 | C&I Solar & Storage | `#E3C58D` | Reduce your electricity costs with solar & storage |
| 02 | Wheeling | `#D97C76` | Buy cheaper renewable energy via the grid |
| 03 | WeBuySolar | `#C97A40` | Cash in your solar investment |
| 04 | Energy Optimisation | `#709DA9` | Reduce energy costs before adding generation |
| 05 | EV Fleets & Infrastructure | `#A9D6CB` | Electrify your fleet from day one |
| 06 | Carbon Credits | `#9CAF88` | Turn your solar into a new revenue stream |

The numbers give the order only; they are not rendered. Photos come from the Sanity Hero Images document (`heroImages`, one image per vertical). A panel without one shows `linear-gradient(135deg, #0d1f22 0%, {accent} 160%)`.

### Component
```tsx
// src/components/sections/HeroAccordion.tsx
// - HeroAccordion({ heroImages }): DesktopAccordion from xl (1280px), MobileHero below
// - DesktopAccordion: useState activeIndex (0 to 5) and hasInteracted; useId for panel ids
// - onMouseEnter panel or click on its button: open(i). No timer, no progress bar
// - MobileHero: static hero (H1, summary, DISCOVERY_CTA), then a link per solution
// - Photos: next/image fill from Sanity heroImages; placeholder="blur" when the image has an LQIP
// - Framer Motion variants for the staggered reveal, played only after a visitor opens a panel
```

---

## 2. Energy Partners

**Approved design:** Option B — Light partner cards

**Build:** `AboutTrust` with `showTabs={false}`, `justify="center"` and `flushTop`. About uses the same component with tabs. The cards show logos only.

- `background: #ffffff`.
- No top padding or border: the section sits flush under By the numbers, also white. `padding-bottom: 64px`, 96px from 768px.

### Label
- Eyebrow: `Partners and financiers`, Inter 700, 12px, `#646B78`, uppercase, `letter-spacing: 0.14em`, `margin-bottom: 12px`.
- H2: `Who we work with`, Plus Jakarta Sans 800, 30px, with "work with" in Dusty Blue ink `#45727E`.
- Both centred, `margin-bottom: 40px` (48px from 768px).

### Partner cards row
```css
display: flex;
gap: 12px;
justify-content: center;
flex-wrap: wrap;
```

### Each partner card
- `background: #ffffff`, `border-radius: 12px`, `border: 1px solid #E5E7EB`, `box-shadow: 0 1px 3px rgba(0,0,0,0.04)`.
- Width: `280px` from 640px, `calc(50% - 6px)` below.
- Hover (Framer Motion spring): lifts 4px, `border-color: #709DA970`, `box-shadow: 0 10px 28px rgba(57,87,92,0.1), 0 1px 4px rgba(0,0,0,0.05)`.
- Links to the partner's website in a new tab when one is set.

### Card anatomy
- **Logo only:** no name or role text.
- **Logo zone:** `background: rgba(245,245,245,0.55)`, `min-height: 140px`, `padding: 24px 24px 20px`. The Sanity logo fills a 96px-tall box with `object-fit: contain`; its alt text comes from Sanity, or else the partner's name.
- **No logo:** the partner's initials (first two words) in a 44px rounded square, `rgba(57,87,92,0.08)` fill, `#39575C` text, Plus Jakarta Sans 800.
- **Data:** every Sanity Partner / Investor document with Active ticked, in any category, sorted by Display order (`PARTNERS_QUERY`). With none, a dashed "Coming soon" box replaces the row.

### Partners (confirmed)
| Logo mark | Name | Role |
|---|---|---|
| `SB` — `#1a3a6e` | Standard Bank | Finance partner |
| `WEG` — `#003087` | WEG | Equipment partner |

> Placeholder from the April 2026 mockup, not confirmed. The site shows partner logos from Sanity with no names or roles. Don't publish a partner or role without evidence (see `docs/content/claims-register.md`).

> Partners are added in Sanity; the wrapping row takes any number.

### Mobile
- Same card design. Below 640px each card is `calc(50% - 6px)` wide, so two sit side by side.
- The mockup's 2-card row was Standard Bank + WEG.

---

## 3. How It Works

**Approved design:** Vertical Option A — numbered circles with power-up animation

**Build:** the eyebrow, title, subtitle, steps and the Show CTA button switch come from the Sanity document `howItWorks.home` (Studio: How It Works, Home), read by `getHowItWorks('home')`. The section is hidden when the document has no title or no steps. Solution pages use the same component and pass their own `accent`, `accentText` and `cta`, which re-colour the track and set the button; home uses the defaults below.

- `background: #F5F5F5`.
- `padding: 64px 0`, 96px from 768px, inside `page-container`.

### Section header (centred)
- Eyebrow: from Sanity (default `How it works`), Inter 700, 12px, uppercase, `#646B78`.
- H2: from Sanity, Plus Jakarta Sans 800, 30px (36px from 768px). Words wrapped in `<em>` render in Dusty Blue ink `#45727E`. The April mockup and `scripts/seedHowItWorks.mjs` used `Your path to energy <em>independence</em>`.
- Subtitle: from Sanity, Inter 400, 16px, `#646B78`, `max-width: 600px`, centred.
- `margin-bottom: 44px`.

---

### Desktop (768px and up): one column per step, with connector

```css
/* --step-count is set inline from steps.length */
display: grid;
grid-template-columns: repeat(var(--step-count), 1fr);
gap: 0 16px;
position: relative;
max-width: min(100%, calc(var(--step-count) * 220px));
margin: 0 auto;
```

**Connector track** (absolute, behind circles):
- `top: 27px` (centre of 56px circle).
- `left` and `right`: half a column plus 4px, `calc(50% / var(--step-count) + 4px)`.
- `height: 2px`, `background: #E5E7EB`, `border-radius: 1px`, `overflow: hidden`.

**Connector fill** (energy animation):
- `background: linear-gradient(90deg, #39575C, #45727E)`.
- `width`: the active step's share of the track, `activeStep / (steps - 1) × 100%`, so 100% in the finished state.
- `transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1)`; none under reduced motion.

**Travelling spark** (rides ahead of fill):
- `width: 8px`, `height: 8px`, `border-radius: 50%`, `background: #ffffff`.
- `box-shadow: 0 0 0 3px #45727E, 0 0 12px 4px #45727E99`.
- Positioned via JS `left` percentage, `transition: left 0.7s cubic-bezier(0.4,0,0.2,1)`.
- Rendered for 800ms after each advance, then removed; never under reduced motion.

**Each step (column):**
- `display: flex`, `flex-direction: column`, `align-items: center`, `text-align: center`, `max-width: 260px`.

**Number circle:**
- `width: 56px`, `height: 56px`, `border-radius: 50%`.
- Default: `background: #fff`, `border: 2px solid #E5E7EB`, `color: #646B78`.
- Active: `background: #39575C`, `border-color: #39575C`, `color: #fff`, `transform: scale(1.08)`.
- Done: `background: #45727E`, `border-color: #45727E`, `color: #fff`.
- All transitions: `0.4s`.
- Plus Jakarta Sans 800, 18px, two digits (`01`, `02`).

**Pulse ring** (active step, only while the section is playing):
```css
/* overlay div on the circle: absolute, inset 0, round */
border: 2px solid rgba(57,87,92,0.25);
animation: pulseRing 1.8s ease-out infinite;

@keyframes pulseRing {
  0%   { transform: scale(1.08); opacity: 1; }
  70%  { transform: scale(1.22); opacity: 0; }
  100% { transform: scale(1.22); opacity: 0; }
}
```

**Zap flash:** not built.

**Step content:**
- Title: Plus Jakarta Sans 700, 16px, `#1A1A1A` → `#39575C` when active.
- Text: Inter 400, 14px, `#646B78`, `line-height: 1.75`.
- Tag pill, when the step has a tag: Inter 600, 12px, `background: rgba(57,87,92,0.08)`, `color: #39575C`. Always visible, with no fade-in.

**Progress dots** (`ProgressDots`):
- Centred, `margin-top: 32px` (24px on phones). Each dot sits in a 24px button, its hit area, labelled "Go to step N".
- Inactive: `width: 8px`, `height: 8px`, `border-radius: 50%`, `background: #E5E7EB`.
- Active: a 24 × 8px pill, `background: #39575C`.
- Transition: `all 0.3s`.

**Auto-cycle:** plays once, then stops.
- The server render, reduced motion and a section already on screen at load show the finished state: fill at 100%, the earlier steps done and the last one active.
- A section that starts below the fold resets to step 1 as it comes within 240px of the viewport. Once 35% of it is visible it advances every **2600ms** (`autoAdvanceInterval`) and stops on the last step.
- Clicking a dot jumps to that step and stops the play.

**CTA button:**
- `Book a discovery meeting` with an arrow, a Deep Teal pill with white text, centred, `margin-top: 28px`. The label and link come from `DISCOVERY_CTA` in `src/config/ctas.ts`, which opens the contact form with a discovery-meeting message filled in.
- Shown only when Show CTA button (`showCta`) is ticked in the Sanity document.

---

### Steps content
Steps are edited in Sanity (How It Works, Home); none is held in code. `scripts/seedHowItWorks.mjs` seeded this table once.

| # | Title | Body | Tag |
|---|---|---|---|
| 01 | Free assessment | We visit your site and model three solution scenarios at no cost, no obligation. | No cost · No obligation |
| 02 | Proposal & financing | Full ROI model, payback period, and financing options delivered in 5 business days. | Delivered in 5 days |
| 03 | Installation & beyond | Certified install in 8–12 weeks, then 24/7 monitoring with a 25-year warranty. | 8–12 week commissioning |

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

---

### Mobile — continuous vertical spine

Below 768px, `max-width: 480px`, centred.

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
- `background: linear-gradient(180deg, #39575C, #45727E)`.
- `height`: the same share as the desktop fill, growing downward as steps complete.
- `transition: height 0.7s cubic-bezier(0.4, 0, 0.2, 1)`; none under reduced motion.

**Mobile spark:** not built. The spine has only the fill.

**Each step:**
```css
display: flex;
gap: 16px;
padding: 18px 0;
align-items: flex-start;
position: relative;
z-index: 10;       /* sits above spine */
```

**Mobile circle:** 44px, same state colours as desktop but no scale on the active step; Plus Jakarta Sans 800, 16px
**Mobile title:** Plus Jakarta Sans 700, 16px
**Mobile text:** Inter 400, 14px, `#646B78`
**Mobile tag:** 12px, same style

Phones show the same steps as desktop, on the vertical spine, with the same dots and button below. The mockup added step 04 on phones, "Ongoing monitoring & support", with the text "24/7 monitoring, monthly reports, 25-year panel warranty" and the tag `25-yr warranty`.

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

---

## 4. Projects Carousel

**Approved design:** Option B — Horizontal scroll cards

**Build:** `FeaturedProjects` in a `SectionCarousel`, with one `ProjectCard` per project. The solution pages use the same section with that vertical's projects.

- `background: #ffffff`.
- No top padding (flush under the partners, also white); `padding-bottom: 64px`, 96px from 768px.
- Data: Sanity projects with `featured: true`, ordered by `featuredOrder` (unset counts as 99), then newest `completionDate`. Projects marked case study ready (`caseStudyReady`) move to the front. The section is hidden when there are none.
- Three or fewer projects: a static grid instead of the scroller. It has one column on phones and, from 768px, three columns for three projects or two for one or two (with larger cards).

### Section header row
- Left: eyebrow `Our work` (Inter 700, 12px, uppercase, `#646B78`) + H2 `Projects` (Plus Jakarta Sans 800, 30px).
- Right: `View published projects` (`PROJECTS_CTA` in `src/config/ctas.ts`) with an arrow, linking to `/projects`, Inter 500, 14px, Deep Teal. It sits under the company stats, and /projects holds only the published projects, so the label names what the page holds rather than "all projects" (PRJ-18).

### Scroll container
```css
display: flex;
gap: 14px;
overflow-x: auto;
scrollbar-width: none;
/* room for the hover lift */
padding-top: 12px;
margin-top: -12px;
padding-bottom: 16px;
/* sits inside page-container: no bleed to the edges */
```

### Each project card
- Width in the scroller: `82vw` on phones; from 768px a third of the container, `calc((min(100vw, 80rem) - 4rem - 28px) / 3)`, so three show at once. In the grid, cards fill their column.
- `background: #fff`, `border: 1px solid #E5E7EB`, `border-radius: 16px`, `overflow: hidden`.
- Hover: `translateY(-4px)`, `border-color: #cccccc`, `box-shadow: 0 12px 32px rgba(57,87,92,0.10)`.
- Transition: `all 0.2s`.

**Photo area:** `aspect-ratio: 16 / 10`, `overflow: hidden`
- A dark gradient scrim covers the lower part of the photo. Without a photo, the area shows a soft gradient of the accent.
- No image zoom and no accent bar.
- Badge, bottom-left: the vertical's name on a solid accent fill in its dark text colour (for example `#5E430C` on `#E3C58D`), Inter 700, 12px, uppercase.
- Status pill, top-right, only for "In progress" or "Planned": white, Inter 600, 12px.

**Card body** (padding `16px`, or `24px` on large cards):
- Title: Plus Jakarta Sans 700, 18px (20px on large cards), `line-height: 1.3`.
- Place: location · client name, Inter 400, 14px, `#646B78`.
- Results: the first two results with values, under a "Projected results" caption unless the project's results basis is set to measured. Value in Plus Jakarta Sans 800, 20px (24px on large cards), Deep Teal; label Inter 12px, `#646B78`.
- Spec line: up to four metric values joined with " · ", Inter 12px, `#646B78`.
- Footer, below a 1px `#E5E7EB` rule: "Read case study" (or "View project" when `caseStudyReady` is false), Inter 600, 14px, Deep Teal, with a 24px arrow circle that fills Deep Teal on hover.

### Project cards (pull from Sanity, `featured: true`)
| Vertical | Accent | Sample title |
|---|---|---|
| C&I Solar & Storage | `#E3C58D` | Shoprite DC — 4.8 MW + 2 MWh BESS |
| Wheeling | `#D97C76` | Cape Town Industrial — 5 MW PPA |
| EV Fleets | `#A9D6CB` | Transnet Fleet Phase 1 — 40 trucks |
| Carbon Credits | `#9CAF88` | Mpumalanga Carbon Offset Programme |
| WeBuySolar | `#C97A40` | Pretoria Estate Buyback — 42 systems |

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

### Mobile
- Same horizontal scroll, cards `82vw` wide, so one shows with the next peeking. A grid of three or fewer stacks in one column.
- The photo keeps its 16:10 ratio.
- No margin bleed: the row sits inside `page-container` (16px sides).

---

## 5. Blog & Articles

**Approved design:** Option B — Featured article + list sidebar

**Build:** Option B was not built. `LatestPosts` is a `SectionCarousel` of the three newest posts as `ArticleCard`s, laid out like the projects row.

- `background: #F5F5F5`.
- No top padding (flush under How It Works, also `#F5F5F5`); `padding-bottom: 64px`, 96px from 768px.
- Header row: eyebrow `Latest insights` + H2 `News, views & analysis`, with "analysis" in Dusty Blue ink `#45727E`. On the right, `View all articles` with an arrow, linking to `/blog` (Inter 500, 14px, Deep Teal).
- A horizontal scroller (gap 14px, no scrollbar), even for three posts. Cards are `82vw` on phones and a third of the container from 768px, so all three show from there.
- The section is hidden when there are no posts.
- Card: the same shell and hover as the project cards. Photo 160px tall; category badge top-right (solid category colour, white text, Inter 700, 12px, uppercase); the first tag, when it names a vertical, as an accent badge bottom-left; title in Plus Jakarta Sans 700, 14px, two lines at most; excerpt in Inter 12px, `#646B78`, two lines at most; footer with the date and "{n} min read" (12px, the read time in Dusty Blue ink).

### Content (from Sanity, `publishedAt desc`)
Categories: `Industry Insights` · `Project Spotlight` · `Company News` · `Press Release` (singular, as in the `blogPost` schema)

---

## 6. CTA Banner

**Approved design:** Option A — Dark split with stats grid

**Build:** Option A was not built. The home page ends with the shared company-level band: `PageFooter` with `ctaVariant="centered"`, whose defaults are `DISCOVERY_BAND` and `DISCOVERY_CTA` in `src/config/ctas.ts`. There is no stats grid and no second button.

- `background: #0d1f22`, a 3px `#709DA9` top border, and the inverted logo as a faint watermark (7% opacity) at the bottom right.
- `padding: 64px 0`, 96px from 768px. Content centred, `max-width: 672px`.
- Eyebrow: `Start your energy transition`, Inter 700, 12px, uppercase, `#709DA9`.
- Headline: `Find the right energy strategy for your business.`, Plus Jakarta Sans 800, 30px (36px from 768px), white.
- Body: "Meet with our engineers to identify the solutions that will reduce costs, generate new revenue and strengthen your energy resilience, at no cost or obligation. We reply within 1 business day." Inter 400, 16px, `#9BA7A9`. The last sentence is `REPLY_PROMISE` in `src/config/contact.ts`.
- One button: `Book a discovery meeting` with an arrow, a white pill with `#0d1f22` text, Inter 600, 14px. It opens the contact form with a discovery-meeting message filled in.
- Phones get the same centred stack.
- Superseded September 2026: the shared footer's default is now the company-level band in `src/config/ctas.ts` (`DISCOVERY_BAND`, "Find the right energy strategy for your business.", with the "Book a discovery meeting" CTA and "We reply within 1 business day."). The old default body promised "results delivered in 48 hours", which contradicted the site's one response time.

### Stats data (update when real figures confirmed)
| Value | Label |
|---|---|
| 120+ | Projects completed |
| 48 MW | Deployed |
| 12k t | CO₂ saved / yr |
| R380M | Client savings |

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

---

## 7. Footer

`SiteFooter`, rendered once by `SiteShell` on every page except `/studio`.

- `background: #0d1f22`.
- `border-top: 1px solid rgba(255,255,255,0.06)`.

### Desktop — single row
```
[logo + Phoenix Energy]    [© {year} Phoenix Energy. All rights reserved.]    [Privacy Policy · Terms of Use · Disclaimer]
        left                              centre                                          right
```
- Logo: the 28px inverted logo image, then "Phoenix Energy" in Plus Jakarta Sans 800, 20px, `#F5F5F5`, linking to `/`.
- Copy: Inter 400, 12px, `#9BA7A9` (on-dark-subtle). The year is the current year.
- Links: Inter 400, 12px, `#9BA7A9`, `gap: 14px` (12px below 768px), to `/privacy-policy`, `/terms-of-use` and `/disclaimer`.
- A single row from 768px, `padding: 16px` top and bottom, inside `page-container`.

### Mobile — centred stack
- Logo, copy and links centred in a column, `gap: 8px`.
- `padding: 14px` top and bottom.

---

## Page-level SEO

```typescript
// src/app/page.tsx
export const metadata: Metadata = {
  title: { absolute: 'Phoenix Energy: Integrated Clean Energy Solutions for SA Businesses' },
  description: 'C&I solar, wheeling, carbon credits, EV fleets and more. Get a free energy assessment from Phoenix Energy today.',
  openGraph: {
    images: [{ url: 'https://phoenixenergy.solutions/og-default.png' }],
  },
};
```

The page also sets `revalidate = 3600`, an hourly refresh in case the Sanity webhook misses a change, and renders a `WebSite` JSON-LD block. Its `SearchAction`, which points at `/blog?q={search_term_string}`, is included only once a blog post is published (`PUBLISHED_POSTS_COUNT_QUERY`), so the site never advertises a search that finds nothing (updated September 2026, audit BLG-01). The full metadata is under Engineering Review Fixes below.

---

## Component Map

| Section | Component |
|---|---|
| Hero | `src/components/sections/HeroAccordion.tsx` |
| By the numbers | `src/components/sections/CompanyStats.tsx` |
| Partners | `src/components/sections/AboutTrust.tsx` (`showTabs={false}`) |
| Projects | `src/components/sections/FeaturedProjects.tsx` (cards: `ProjectCard.tsx`) |
| How It Works | `src/components/sections/HowItWorks.tsx` |
| Blog | `src/components/sections/LatestPosts.tsx` (cards: `src/components/ui/ArticleCard.tsx`) |
| CTA | `src/components/layout/PageFooter.tsx` (`ctaVariant="centered"`) |
| Footer | `src/components/layout/SiteFooter.tsx` (rendered by `SiteShell`) |

Projects and Blog share the header and scroller in `src/components/ui/SectionCarousel.tsx`.

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.1 | Approved April 2026*

---

## Engineering Review Fixes (April 2026)

### HowItWorks component — authoritative interface
The props are defined in `src/components/sections/HowItWorks.tsx` (`HowItWorksProps`). The homepage feeds the component from Sanity:
```tsx
// src/app/page.tsx
const homeHowItWorks = await getHowItWorks('home'); // howItWorks.home, or null when it has no title or steps

{homeHowItWorks && <HowItWorks {...homeHowItWorks} autoAdvanceInterval={2600} />}
// eyebrow, title, subtitle, steps and showCTA come from Sanity (showCTA is the Show CTA button field).
// cta is not passed, so the button is the default DISCOVERY_CTA: "Book a discovery meeting".
```

### Homepage metadata — complete spec
```typescript
export const metadata: Metadata = {
  title: { absolute: 'Phoenix Energy: Integrated Clean Energy Solutions for SA Businesses' },
  description: 'C&I solar, wheeling, carbon credits, EV fleets and more. Get a free energy assessment from Phoenix Energy today.',
  alternates: { canonical: 'https://phoenixenergy.solutions' },
  openGraph: {
    title: 'Phoenix Energy: Save, Earn & Grow with Renewable Energy',
    description: 'Six clean energy verticals. One partner. End-to-end solutions for Southern African businesses.',
    url: 'https://phoenixenergy.solutions',
    siteName: 'Phoenix Energy',
    images: [{ url: 'https://phoenixenergy.solutions/og-default.png', width: 1200, height: 630, alt: 'Phoenix Energy: Clean Energy Solutions for Southern Africa' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phoenix Energy: Save, Earn & Grow with Renewable Energy',
    description: 'Six clean energy verticals. One partner. End-to-end solutions for Southern African businesses.',
    images: ['https://phoenixenergy.solutions/og-default.png'],
  },
};
```

**Static asset:** Open Graph and Twitter use the shared `/public/og-default.png`, declared as 1200×630. There is no `og-home.jpg`.


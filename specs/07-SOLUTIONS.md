# 07 — Solution Pages
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Routes: `/solutions/[vertical]`
> **Approved April 2026**

---

## Overview

Six solution pages, one shared template component. Every section is data-driven from a per-vertical config object — the template renders identically across all 6 verticals, with content, accent colour, and tab configuration injected at the page level.

**Verticals and routes:**
| Vertical | Route | Accent |
|---|---|---|
| C&I Solar & Storage | `/solutions/solar` | `#E3C58D` |
| Wheeling | `/solutions/wheeling` | `#D97C76` |
| Energy Optimisation | `/solutions/optimisation` | `#709DA9` |
| Carbon Credits | `/solutions/carbon-credits` | `#9CAF88` |
| WeBuySolar | `/solutions/webuysolar` | `#C97A40` |
| EV Fleets & Infrastructure | `/solutions/ev-fleets` | `#A9D6CB` |

---

## Page Structure

```
1.  Navbar              — light glass pill, "Solutions" active + vertical highlighted
2.  Breadcrumb          — Home / Solutions / [Vertical name]
3.  Solution sub-nav    — sticky anchor links: Overview · The problem · Our solution · How it works · Case studies · Get a quote
4.  Hero                — full-bleed photo + gradient + badge + headline + CTA buttons
5.  Stats strip         — Deep Teal flush, 4 key numbers
6.  Pain section        — dark bg, interactive cost calculator
7.  Solution section    — white bg, tabbed offering (desktop) / accordion (mobile)
8.  How It Works        — reusable animated component (shared with homepage)
9.  Testimonials        — 3-column quote cards
10. Projects carousel   — horizontal scroll, filtered to this vertical
11. CTA banner          — Deep Teal centred
12. Footer
```

---

## 1. Navbar

- Light glass pill: `background: rgba(255,255,255,0.92)`, `backdrop-filter: blur(12px)`
- "Solutions" nav link: Deep Teal, `font-weight: 600`
- Mega-menu (see `specs/03-NAVIGATION.md`): active vertical highlighted with accent dot

---

## 2. Breadcrumb

```
Home / Solutions / [Vertical name]
```
- Inter 400, 9px, `#6B7280`. Current: Deep Teal, `font-weight: 600`

---

## 3. Solution Sub-Nav

Sticky at top on scroll (below main nav):
- `background: #ffffff`, `border-bottom: 1px solid #E5E7EB`
- `padding: 0 24px`, `max-width: 960px`, `margin: 0 auto`
- Items: Inter 500, 11px, muted. Active: Deep Teal, `border-bottom: 2px solid #39575C`
- Horizontal scroll on mobile (`overflow-x: auto`, `scrollbar-width: none`)
- Clicking an item smooth-scrolls to that section anchor

```
Overview · The problem · Our solution · How it works · Case studies · Get a quote
```

---

## 4. Hero

- `position: relative`, `min-height: 300px`, `display: flex`, `flex-direction: column`, `justify-content: flex-end`

**Photo layer:**
- `next/image` fill, `object-fit: cover`, `object-position: center`
- Hover: `scale(1.03)` over `8s` (subtle Ken Burns)
- `placeholder="blur"`

**Overlay:**
```css
background: linear-gradient(180deg, rgba(13,31,34,0.15) 0%, rgba(13,31,34,0.92) 100%);
```

**Bottom-anchored content** (`padding: 28px 24px`, `max-width: 960px`, `margin: 0 auto`):

- **Vertical badge:** `display: inline-flex`, `gap: 6px`, accent bg at 20% opacity, accent text, 6px accent dot
  - Font: Inter 700, 9px, uppercase, `letter-spacing: 0.12em`
- **Headline:** Plus Jakarta Sans 800, 26px, white, `line-height: 1.2`, `max-width: 580px`
  - `<em>` tags render at `opacity: 0.45` (de-emphasised contrast phrase)
- **Subtitle:** Inter 400, 12px, `rgba(255,255,255,0.6)`, `line-height: 1.75`, `max-width: 500px`, `margin-bottom: 18px`
- **Two buttons:**
  - Primary: `#F5F5F5` bg, `#0d1f22` text, pill — *"Get a free assessment"*
  - Ghost: `rgba(255,255,255,0.1)` bg, `border: 1px solid rgba(255,255,255,0.2)`, white text — *"See case studies ↓"*

**Mobile:** `min-height: 260px`. Headline: 22px. Subtitle hidden on smallest screens (<380px).

---

## 5. Stats Strip

Sits flush below hero. No overlap.
- `background: #39575C`, `padding: 14px 24px`
- `display: grid`, `grid-template-columns: repeat(4, 1fr)`, `max-width: 960px`, `margin: 0 auto`
- Dividers: `::after` right-edge, `rgba(255,255,255,0.15)`
- Value: Plus Jakarta Sans 800, 18px, white
- Label: Inter 400, 8px, `rgba(255,255,255,0.45)`, uppercase, `letter-spacing: 0.07em`
- Mobile: 2×2 grid

### Stats per vertical
| Vertical | Stat 1 | Stat 2 | Stat 3 | Stat 4 |
|---|---|---|---|---|
| Solar | 12.7% / 2025 tariff hike | R600k / Cost per Stage 6 event | 4–7 yr / Typical payback | 25 yr / Panel warranty |
| Wheeling | 32% / Typical tariff saving | 5 MW / Min viable offtake | 90 days / Licensing timeline | R28M / Largest PPA signed |
| Optimisation | 28% / Avg C&I energy waste | R0 / Cost of an audit | 3 mo / Typical payback | R12M / Savings to date |
| Carbon | R8M / Avg revenue per MW/yr | Gold / Standard certified | R0 / Enrolment cost | 100% / Phoenix manages all |
| WeBuySolar | 2 min / Online valuation | 5 days / Formal offer | 42 / Systems acquired | R0 / Cost to get valued |
| EV Fleets | 87% / Diesel increase since 2019 | 60% / Fleet cost reduction | R0 / CapEx under OpEx model | 40+ / Trucks commissioned |

---

## 6. Pain Section — Interactive Cost Calculator

- `background: #0d1f22`, `padding: 52px 24px`

### Desktop — 2-column grid
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 40px;
align-items: center;
max-width: 960px;
margin: 0 auto;
```

**Left — editorial copy:**
- Eyebrow: Inter 700, 9px, `rgba(255,255,255,0.35)`, uppercase
- Headline: Plus Jakarta Sans 800, 24px, white, `line-height: 1.2`
  - Key phrase wrapped in `<em>` with `color: var(--accent)` (vertical accent colour)
- Body: Inter 400, 12px, `rgba(255,255,255,0.5)`, `line-height: 1.8`, `margin-bottom: 20px`
- Fact pills: `display: flex`, `flex-wrap: wrap`, `gap: 7px`
  - Each: Inter 500, 10px, `padding: 5px 12px`, `border-radius: 9999px`
  - `border: 1px solid rgba(255,255,255,0.1)`, `color: rgba(255,255,255,0.55)`

**Right — calculator card:**
```css
background: rgba(255,255,255,0.05);
border-radius: 16px;
border: 1px solid rgba(255,255,255,0.08);
padding: 24px;
```
- Title: Inter 600, 13px, white, `margin-bottom: 14px`
- Slider label: Inter 400, 11px, `rgba(255,255,255,0.45)`, `margin-bottom: 6px`
- Range slider: `accent-color: var(--accent)`, full width
- Live value readout: Plus Jakarta Sans 700, 14px, white, right-aligned
- Three result cards in `grid-template-columns: 1fr 1fr 1fr`, `gap: 8px`:
  - Standard: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.06)`, `border-radius: 10px`, `padding: 12px`, `text-align: center`
  - Highlight (middle): `background: rgba(var(--accent-rgb), 0.12)`, `border-color: rgba(var(--accent-rgb), 0.25)`
  - Value: Plus Jakarta Sans 800, 17px, white (`color: var(--accent)` on highlight)
  - Label: Inter 400, 9px, `rgba(255,255,255,0.35)`, uppercase
- Note: Inter 400, 10px, `rgba(255,255,255,0.25)`, `margin-top: 10px`, `line-height: 1.6`

### Calculator logic per vertical

```typescript
// Solar / Optimisation / EV
// Input: monthly bill (R)
// 5-yr Eskom cost: sum of monthly × 12 × (1.127^i) for i=0..4
// 10-yr Eskom cost: same for i=0..9
// Potential 5-yr saving: 5-yr cost × 0.48 (conservative 48% saving after solar/opex amortised)

// Wheeling
// Input: monthly bill (R)
// Saving: bill × 12 × 0.32 (32% tariff reduction)
// Highlight card: annual saving

// Carbon Credits
// Input: monthly bill (R) — used as proxy for system size
// Revenue: (bill / 3500) × 1680 × 0.5 × 90 / 1000 × 8 (approx kW → tonnes → R)
// Highlight card: estimated annual credit revenue

// WeBuySolar
// Input: approximate monthly bill before solar (R) — proxy for system size
// Indicative buyback: (bill / 3500) × 1680 × 20000 × 0.4 / 12 (rough system value estimate)
// Highlight card: indicative buyback range
```

### Mobile — stacked
- Copy section full-width above calculator card
- Fact pills hidden on mobile to reduce clutter
- Calculator card full-width below

### Per-vertical copy

| Vertical | Eyebrow | Headline | Body | Fact pills | Highlight label |
|---|---|---|---|---|---|
| Solar | Calculate your exposure | What is grid dependence actually *costing you?* | Eskom tariffs have increased at 3× inflation since 2008. Drag to your monthly spend to see your 10-year cost trajectory. | 12.7% hike April 2025 · R3.50/kWh · Doubles every 5.8 yrs · No ceiling | 5-yr potential saving |
| Wheeling | Calculate your wheeling opportunity | What is a 32% tariff saving worth to *your business?* | Drag to your monthly spend and see the annual saving a wheeling PPA can deliver — starting within 90 days of agreement. | 32% average reduction · 90-day licensing · NERSA 2025 framework · Min 5 MW | Annual wheeling saving |
| Optimisation | Identify your savings potential | How much is energy waste *costing your business?* | 28% of energy in commercial facilities is wasted with no impact on productivity. Drag to see your monthly waste. | 28% avg waste · R0 audit cost · 3-month payback · Carbon Trust benchmark | Est. monthly energy waste |
| Carbon | Calculate your carbon revenue | How much is your solar system *leaving on the table?* | Most SA businesses with solar assets are missing an entirely untapped revenue stream. Drag to see your estimate. | R6–10M per MW/yr · Gold Standard · R0 enrolment · 100% managed | Est. annual credit revenue |
| WeBuySolar | What is your system worth? | Get an instant indicative *buyback estimate.* | Drag to your approximate bill before solar was installed. We use this to estimate your system size and indicative value. | 5-day turnaround · 42 systems acquired · DCF-based model · R0 to value | Indicative buyback value |
| EV Fleets | Calculate your fleet savings | What is diesel dependency *costing your fleet?* | SA diesel has increased 87% since 2019. Drag to your monthly fuel spend to see the savings from electrification. | 87% diesel increase · 50% avg saving · R0 OpEx model · 40+ trucks live | Est. 5-yr fuel saving |

---

## 7. Solution Tabs / Accordion

- `background: #ffffff`, `padding: 52px 24px`

### Section header (above tabs)
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 32px;
align-items: end;
margin-bottom: 28px;
max-width: 960px;
margin-left: auto;
margin-right: auto;
```
- H2: left column
- Intro paragraph: right column — Inter 400, 12px, muted

### Desktop — Tabs (`>= 768px`)

```css
display: flex;
border-bottom: 1px solid #E5E7EB;
overflow-x: auto;
scrollbar-width: none;
```
- Each tab: Inter 500, 12px, muted, `padding: 11px 18px`, `border-bottom: 2px solid transparent`
- Active: Deep Teal text, `border-bottom-color: #39575C`, `font-weight: 600`

**Tab content panel:**
```css
display: grid;
grid-template-columns: 1fr 1fr;   /* text left, image right */
border: 1px solid #E5E7EB;
border-top: none;
border-radius: 0 0 14px 14px;
```
- Left (`padding: 28px`): title + body + bullet list
- Right: photo, `object-fit: cover`, `border-radius: 0 0 12px 0`, `min-height: 200px`

**Financing tab** — special layout, full-width inside panel:
- Two cards side by side: CapEx (light bg) + OpEx (dark bg)
- See Financing section spec below

### Mobile — Accordion (`< 768px`)

**Component:** `<SolutionTabs>` uses `useMediaQuery('(max-width: 768px)')` to switch between tab and accordion renderers. Same data, same content array.

```typescript
// Accordion behaviour:
// - One item open at a time
// - Tapping open item: closes it
// - Tapping closed item: opens it, closes previously open item
// - First item open by default
// - Smooth height animation: max-height 0 → auto via CSS transition
```

**Each accordion item:**
```
[Icon 32px] [Label Plus Jakarta Sans 700 13px] [Chevron ▼ rotates 180° when open]
```
- Header hover: `background: rgba(57,87,92,0.04)`
- Header active: `color: #39575C`, icon bg → Deep Teal, chevron → Deep Teal
- Body: `padding: 0 16px 16px` — image (full-width, 120px, rounded), title, description, bullets
- Financing item body: CapEx card + OpEx card stacked vertically, no side-by-side

**Icon backgrounds per tab:**
| Tab | Icon bg |
|---|---|
| Solar array | `rgba(227,197,141,0.15)` |
| Battery storage | `rgba(112,157,169,0.12)` |
| Monitoring & O&M | `rgba(57,87,92,0.08)` |
| Tax benefits | `rgba(156,175,136,0.12)` |
| Financing | `rgba(57,87,92,0.08)` |

### Financing tab — CapEx vs OpEx

Two cards: `grid-template-columns: 1fr 1fr` (desktop), stacked (mobile)

**CapEx card** (`background: #F5F5F5`, `border: 1px solid #E5E7EB`):
- Tag: `CapEx — Own it` · Deep Teal bg at 10% + Deep Teal text
- Title: `Purchase outright` — Plus Jakarta Sans 800, 16px
- Subtitle: highest long-term ROI, Section 12B accelerates payback
- Bullets: 125% Section 12B year one · 4–7yr payback on 25-yr asset · Standard Bank prime-linked finance · Full asset ownership increases property value
- Best for: businesses wanting maximum long-term returns

**OpEx card** (`background: #0d1f22`):
- Tag: `OpEx — Zero upfront` · white-tint bg + white-70 text
- Title: `PPA or lease` — Plus Jakarta Sans 800, 16px, white
- Subtitle: R0 capital, savings from month one
- Bullets (accent dots): R0 capital required · Fixed rate locked 10–15 years · Full O&M, monitoring and insurance included · Option to purchase at end of term at residual value
- Best for: zero capex, immediate savings, no balance sheet impact

**Footer note:** Inter 400, 11px, muted, centred — *"All financing subject to credit approval. Phoenix Energy works with Standard Bank. Section 12B should be confirmed with your tax advisor."*

### Tab configuration per vertical

**C&I Solar & Storage** (5 content tabs + Financing):
`Solar array` · `Battery storage` · `Monitoring & O&M` · `Tax benefits` · `Financing`

**Wheeling** (3 content tabs + Financing):
`PPA structuring` · `Grid connection` · `Ongoing management` · `Financing`

**Energy Optimisation** (3 content tabs + Financing):
`Energy audit` · `Tariff restructuring` · `Demand management` · `Financing`

**Carbon Credits** (3 content tabs + Financing):
`Registration` · `Monitoring & MRV` · `Credit trading` · `Financing`

**WeBuySolar** (4 process tabs, no Financing tab — WeBuySolar is a buyback service):
`Online valuation` · `Site verification` · `Formal offer` · `Payment & transfer`

**EV Fleets** (3 content tabs + Financing):
`Charging infrastructure` · `Vehicle procurement` · `Fleet management` · `Financing`

---

## 8. How It Works — Reusable Animated Component

**Component:** `src/components/sections/HowItWorks.tsx`

This is the same animated component used on the homepage. It is fully reusable — steps, title, and subtitle are props.

```typescript
interface HowItWorksProps {
  eyebrow?: string;           // Default: "How it works"
  title: string;              // Supports <em> for accent colour
  steps: {
    label: string;            // Short title
    description: string;      // One to two sentences
    tag?: string;             // Optional pill tag (e.g. "No cost · No obligation")
  }[];
}
```

### Animation spec (see `specs/04-HOME.md` for full detail)

- Number circles: 56px, `border-radius: 50%`
- States: default (white bg, grey border), active (Deep Teal fill, `scale(1.08)`), done (Dusty Blue fill)
- Pulse ring: `::before` pseudo, `animation: pulseRing 1.8s ease-out infinite` on active
- Connector: `height: 2px`, full span, `background: #E5E7EB`, overflow hidden
- Connector fill: `linear-gradient(90deg, #39575C, #709DA9)`, `width` animates via JS
- Travelling spark: 8px white circle, `box-shadow: 0 0 0 3px #709DA9, 0 0 10px 3px rgba(112,157,169,0.5)`, travels left on connector
- Auto-advance: every **2600ms**
- Progress dots: `display: flex`, `gap: 8px`, centred below. Active: `width: 24px`, `border-radius: 4px`, Deep Teal
- Step count: driven by `--step-count` CSS variable → connector positioning auto-adjusts
- Mobile: spine layout (see `specs/04-HOME.md` mobile section)

### Steps per vertical

**C&I Solar:** Free assessment · Custom proposal · Installation · Live & monitored
Tags: No cost · No obligation | Delivered in 5 days | 8–12 week commissioning | 25-yr warranty

**Wheeling:** Feasibility review · PPA structuring · Grid connection · First kWh wheeled
Tags: Free feasibility | 5 business days | 90-day process | Savings live

**Optimisation:** Energy audit · Recommendations · Implementation · Savings verified
Tags: Free audit | Delivered in 3 days | Zero disruption | Proven & reported

**Carbon Credits:** Eligibility check · Gold Standard registration · Monitoring & MRV · Credit issuance
Tags: Free check | 6–8 week process | Continuous | Quarterly payments

**WeBuySolar:** Online valuation · Site verification · Formal offer · Payment
Tags: 2 minutes | Free · no obligation | 5 business days | Same week

**EV Fleets:** Depot assessment · Infrastructure design · Installation · Fleet live
Tags: Free assessment | 5 business days | 6–10 weeks | Savings from day one

---

## 9. Testimonials

- `background: #ffffff`, `padding: 52px 24px`
- Section header: centred eyebrow + H2

### 3-column card grid
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 14px;
margin-top: 28px;
```

**Each card:**
- `background: #F5F5F5`, `border-radius: 14px`, `padding: 20px`, `border: 1px solid #E5E7EB`
- Large opening quote mark: Plus Jakarta Sans 800, 44px, `color: var(--accent)`, absolute top-left
- Quote text: Inter 400, 12px, `#1A1A1A`, italic, `line-height: 1.8`, `padding-top: 18px`
- Author row: avatar circle (34px, Deep Teal bg, white initials) + name + role

**Mobile:** 1-column stack

> ⚠️ **Testimonial copy is placeholder** — replace with real client quotes before build.

---

## 10. Projects Carousel

- `background: #F5F5F5`, `padding: 52px 24px`
- Section header row: eyebrow (vertical-specific e.g. `SOLAR & STORAGE PROJECTS`) + H2 `Proof in every project` + `View all →` right

**Carousel:**
```css
display: flex;
gap: 14px;
overflow-x: auto;
scrollbar-width: none;
margin: 0 -24px;
padding: 0 24px 8px;
```

**Project cards:** 260px width. Same `ProjectCard` component as homepage and projects page.
- Cards filtered by `vertical === currentVertical` from Sanity
- GROQ: `*[_type == "project" && vertical == $vertical] | order(publishedAt desc) [0..5]`
- Accent bar, badge colour, badge text all driven by vertical

**Mobile:** Same horizontal scroll, card width 200px.

---

## 11. CTA Banner

- `background: #39575C`, `padding: 52px 24px`, `text-align: center`

```
[max-width: 520px, margin: 0 auto]
Headline: vertical-specific (see table below)
Sub: vertical-specific
[Primary button]   [Explore other solutions]
```

- Primary btn: `#fff` bg, Deep Teal text
- Ghost btn: `rgba(255,255,255,0.1)` bg, `border: 1px solid rgba(255,255,255,0.2)`, white text
- "Explore other solutions" → `/solutions`

### CTA copy per vertical

| Vertical | Headline | Sub |
|---|---|---|
| Solar | Ready to eliminate your Eskom dependency? | Get a free solar feasibility assessment — delivered in 48 hours, no commitment required. |
| Wheeling | Find out if wheeling works for your business | Free feasibility assessment — we'll confirm viability and indicative savings within 5 days. |
| Optimisation | Find out where your business is losing money on energy | Book a free energy audit — we identify the savings, you keep them. |
| Carbon Credits | Start earning from your clean energy assets | Find out how much your existing or planned solar system generates in annual carbon credit revenue. |
| WeBuySolar | Get your solar system valuation now | Use our free tool for an instant indicative buyback range — no site visit needed to start. |
| EV Fleets | Ready to electrify your fleet? | Free fleet electrification feasibility study — ROI model, infrastructure design, and financing options in 5 days. |

---

## TypeScript — Vertical Config Object

```typescript
// src/config/verticals.ts

export interface VerticalConfig {
  slug: string;
  label: string;
  accent: string;              // Hex — used for badge, dots, calculator highlight
  accentText: string;          // Dark shade for text on light accent bg
  heroBg: string;              // CSS gradient for hero photo placeholder
  heroEmoji: string;           // Replaced by real next/image in production
  heroTitle: string;           // HTML string — <em> for de-emphasised phrase
  heroSub: string;
  stats: { value: string; label: string }[];  // 4 items
  pain: {
    eyebrow: string;
    headline: string;          // HTML — <em> for accent colour
    body: string;
    pills: string[];
    calcTitle: string;
    calcLabel: string;
    calcHighlightLabel: string;
    calcNote: string;
    calcFn: (monthlyBill: number) => { left: number; highlight: number; right: number };
  };
  solution: {
    h2: string;                // HTML — <em>
    intro: string;
    tabs: {
      label: string;
      icon: string;
      iconBg: string;
      title: string;
      body: string;
      bullets: string[];
      imageBg: string;
      imageEmoji: string;
    }[];
    showFinancingTab: boolean;
  };
  howItWorks: {
    title: string;             // HTML — <em>
    steps: { label: string; description: string; tag?: string }[];
  };
  projectsEyebrow: string;
  cta: { title: string; sub: string };
  seo: { title: string; description: string };
}
```

---

## SEO & Metadata per vertical

```typescript
// src/app/solutions/[vertical]/page.tsx
export async function generateMetadata({ params }) {
  const config = verticalConfigs[params.vertical];
  return {
    title: config.seo.title,
    description: config.seo.description,
    openGraph: {
      images: [{ url: `/og-solutions-${params.vertical}.jpg` }],
    },
  };
}
```

**JSON-LD Service schema per vertical:**
```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: config.label,
  provider: { '@type': 'Organization', name: 'Phoenix Energy', url: 'https://phoenixenergy.solutions' },
  description: config.seo.description,
  areaServed: { '@type': 'Place', name: 'Southern Africa' },
  url: `https://phoenixenergy.solutions/solutions/${config.slug}`,
}
```

### SEO titles and descriptions per vertical

| Vertical | Title | Description |
|---|---|---|
| Solar | Commercial Solar Panels & Battery Storage South Africa \| Phoenix Energy | Bespoke C&I solar and BESS systems for South African businesses. Free assessment, 25-yr warranty, CapEx or PPA financing. |
| Wheeling | Energy Wheeling & PPA South Africa \| Phoenix Energy | Purchase clean energy via the national grid at 20–40% below Eskom TOU tariffs. NERSA 2025 compliant wheeling agreements. |
| Optimisation | Energy Optimisation & Audit South Africa \| Phoenix Energy | Free commercial energy audit. Identify and eliminate the 28% average energy waste in your facility — typical payback under 3 months. |
| Carbon Credits | Solar Carbon Credits South Africa — Gold Standard \| Phoenix Energy | Earn R6–10M per MW per year from verified carbon credits on your renewable energy assets. Zero upfront cost, fully managed. |
| WeBuySolar | Sell Your Solar System — WeBuySolar \| Phoenix Energy | Get an instant indicative buyback valuation and formal offer within 5 business days. South Africa's fastest solar asset buyback service. |
| EV Fleets | EV Fleet Electrification South Africa \| Phoenix Energy | Reduce fleet running costs by 40–60%. End-to-end EV charging infrastructure, vehicle procurement, and R0 OpEx model. |

---

## Component Map

| Component | Path |
|---|---|
| Solutions page shell | `src/app/solutions/[vertical]/page.tsx` |
| Page template | `src/components/templates/SolutionPage.tsx` |
| Hero section | `src/components/sections/SolutionHero.tsx` |
| Stats strip | `src/components/ui/StatsStrip.tsx` (shared — also used on project page, about page) |
| Pain + calculator | `src/components/sections/SolutionPain.tsx` |
| Tabs / accordion | `src/components/sections/SolutionTabs.tsx` |
| Financing cards | `src/components/sections/FinancingCards.tsx` |
| How It Works | `src/components/sections/HowItWorks.tsx` (shared — also used on homepage) |
| Testimonials | `src/components/sections/Testimonials.tsx` |
| Projects carousel | `src/components/sections/FeaturedProjects.tsx` (shared — filtered by vertical prop) |
| CTA banner | `src/components/sections/CTABanner.tsx` (shared) |
| Vertical config | `src/config/verticals.ts` |

---

## Responsive Breakpoints Summary

| Section | Desktop (≥ 768px) | Mobile (< 768px) |
|---|---|---|
| Hero | min-height 300px, 26px headline | min-height 260px, 22px headline |
| Stats strip | 4-column horizontal | 2×2 grid |
| Pain section | 2-col (copy left, calculator right) | Stacked, pills hidden |
| Solution offering | Horizontal tabs | Vertical accordion, one open at a time |
| Financing | 2-col cards side by side | Stacked vertically |
| How It Works | Horizontal circles with connector | Vertical spine (see `04-HOME.md`) |
| Testimonials | 3-column grid | 1-column stack |
| Projects | Horizontal scroll, 260px cards | Horizontal scroll, 200px cards |
| Sub-nav | Full labels, no scroll | Horizontal scroll, labels truncated |

---

## Open Items

| # | Item | Owner |
|---|---|---|
| 1 | Real hero photography per vertical (replace emoji placeholders) | Client |
| 2 | Real client testimonials per vertical (3 per page minimum) | Client |
| 3 | Real project data in Sanity — tagged by vertical | Dev |
| 4 | Confirm WeBuySolar page excludes Financing tab (buyback service, not install) | Client |
| 5 | OG images per vertical (1200×630) for social sharing | Dev |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.1 | Approved April 2026*

---

## Engineering Review Fixes (April 2026)

### Solution sub-nav — appearance animation
Appears when user scrolls past hero bottom edge:
`opacity: 0 → 1` + `translateY(-100% → 0)` over `250ms ease-out`
Disappears when scrolled back above hero: reverse.

### Solution sub-nav — mobile scroll behaviour
`overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch`
Labels use `white-space: nowrap` — they scroll horizontally, they do NOT truncate.

### Canonical URL — all solution pages
```typescript
// In generateMetadata for each vertical:
alternates: {
  canonical: `https://phoenixenergy.solutions/solutions/${params.vertical}`
}
```

### HowItWorks — showCTA prop
Solution pages use `showCTA={true}` with `ctaLabel="Get a free assessment"` and `ctaHref="/contact?service={vertical}"`. This renders the Deep Teal pill button below the progress dots.


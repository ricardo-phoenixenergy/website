# 07 — Solution Pages
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Routes: `/solutions/{vertical}`, six static routes with one page folder each (there is no `[vertical]` dynamic segment)
> **Approved April 2026**
> **Updated 2026-09-24:** corrected to match the build.

---

## Overview

Six page files, one per vertical (`src/app/solutions/{vertical}/page.tsx`). There is no shared template: each page composes shared section components in its own order (see Page Structure). The copy lives in the page file or in a content file under `src/config/` (`strategies.ts`, `carbonCreditsContent.ts`, `evFleetsContent.ts`, `webuysolarContent.ts`). `VERTICAL_CONFIG` holds only the SEO title, description and stats; `SOLUTION_META` (`src/types/solutions.ts`) holds the label and accent colours; How It Works steps come from Sanity. Type sizes and colours follow `specs/01-BRAND.md` (12px minimum; muted text is `#646B78`).

**Verticals and routes:**
| Vertical | Route | Accent |
|---|---|---|
| C&I Solar & Storage | `/solutions/ci-solar-storage` | `#E3C58D` |
| Wheeling | `/solutions/wheeling` | `#D97C76` |
| Energy Optimisation | `/solutions/energy-optimisation` | `#709DA9` |
| Carbon Credits | `/solutions/carbon-credits` | `#9CAF88` |
| WeBuySolar | `/solutions/webuysolar` | `#C97A40` |
| EV Fleets & Infrastructure | `/solutions/ev-fleets` | `#A9D6CB` |

---

## Page Structure

Every page sits inside the site layout (`SiteShell`: the navbar above, `SiteFooter` below). Between them, each page renders its own sections in this order:

- **C&I Solar & Storage:** hero with the Strategy Finder, strategy tabs, financing band, How It Works, projects, related articles, CTA band.
- **Wheeling:** hero with the eligibility check, model tabs, How It Works, projects, related articles, CTA band.
- **Energy Optimisation:** hero (copy only, no tool), lever tabs, financing band, How It Works, projects, related articles, CTA band.
- **Carbon Credits:** hero with the revenue estimator, two explainer card sections (`#how-it-earns`, `#opportunity`), How It Works, FAQ (`#faq`), projects, related articles, CTA band.
- **EV Fleets:** hero with the fleet savings estimator, two explainer card sections (`#why-now`, `#the-package`), financing band and its note, industry tabs (`#who-its-for`), How It Works, projects, FAQ (`#faq`), related articles, CTA band.
- **WeBuySolar:** see "WeBuySolar Page as Built" below.

How It Works is hidden when its Sanity document has no title or no steps. Projects and related articles are hidden when nothing is published for the vertical. The breadcrumb sits inside the hero. There is no sub-nav, stats strip, pain section or testimonials section (see §3, §5, §6 and §9).

---

## 1. Navbar

- The shared navbar: see `specs/03-NAVIGATION.md`. It is a solid white pill, not a glass one.
- On every solution page the Solutions item shows as active (Deep Teal, `font-weight: 600`, on a light Deep Teal tint).
- In the mega-menu every vertical carries its accent dot. The current page gets `aria-current="page"` and no extra visual highlight.

---

## 2. Breadcrumb

```
Home / Solutions / [Vertical name]
```
- Inside the hero, above the H1, not a separate strip (`SolutionHero`, `aria-label="Breadcrumb"`).
- Inter 14px in `--color-on-dark-subtle` (`#9BA7A9`). Home and Solutions are links that turn white on hover.
- The current item is white, `font-weight: 600`, and shows the page's `SOLUTION_META` label.

---

## 3. Solution Sub-Nav

Removed from the solution pages in May 2026; the `SolutionSubNav` component was deleted in June 2026. There is no sub-nav. Sections carry ids instead (for example `#how-it-earns`, `#opportunity` and `#faq` on Carbon Credits; `#why-now`, `#the-package`, `#who-its-for` and `#faq` on EV Fleets), and a tab opens from its key in the URL hash, for example `#strategy-demand-shaving` (see §7).

---

## 4. Hero

`SolutionHero` (`src/components/sections/SolutionHero.tsx`):

- `<section>` with `position: relative` and `min-height: clamp(580px, 75vw, 760px)`. The content is centred vertically in the page container, with `padding-top: 96px` and `padding-bottom: 72px`.

**Photo layer:**
- The page's photo from the Sanity Hero Images document (`getHeroImages()`), as `next/image` with `fill`, `priority` and `object-fit: cover`. `object-position` is centre unless the page sets `imagePosition` to top or bottom.
- `placeholder="blur"` with the Sanity LQIP when the image has one.
- With no photo, the page's `heroBg` gradient fills the hero. There is no hover zoom.

**Overlay** (darker behind the copy on the left):
```css
background: linear-gradient(105deg, rgba(13,31,34,0.92) 0%, rgba(13,31,34,0.84) 45%, rgba(13,31,34,0.64) 100%);
```

**Layout:** one column below 1024px, with the tool under the copy. From 1024px the copy sits left and the tool right, in a 440px column; C&I uses a 40/60 split (`wideRight`). Energy Optimisation has no tool (`copyOnly`), so its copy spans about two thirds of the container.

**Copy column:**
- **Breadcrumb:** see §2. There is no vertical badge: the `badge` prop is the breadcrumb's last item and the photo's alt text.
- **Headline (H1):** Plus Jakarta Sans 800, 30px (42px from 768px), white, `line-height: 1.18`, `max-width: 560px`. `<em>` renders in the vertical accent, upright, not italic.
- **Subtitle:** Inter, 14px (16px from 768px), `rgba(255,255,255,0.70)`, `line-height: 1.75`, `max-width: 460px` (640px on the copy-only hero). Line breaks in the string show from 1024px.
- **One button:** `Button variant="light"` at the default size (a 48px pill, `#F5F5F5` fill, `#0d1f22` text) with a right arrow. It is the page CTA, `SERVICE_CTA[vertical]` (`src/config/ctas.ts`), which opens the contact form at step 2 as a client with the service already written in the message. The component also takes an optional ghost button, the same 48px size, and a note under the buttons; only WeBuySolar uses them.

| Page | H1 (accent words in italics) | Right column | Button |
|---|---|---|---|
| C&I Solar & Storage | Go solar with *zero upfront cost* | `StrategyFinder` | Book a discovery meeting |
| Wheeling | Access lower-cost *renewable electricity* through the grid. | `WheelingEligibility` | Book a free wheeling assessment |
| Energy Optimisation | Reduce energy. *Increase performance.* | None (copy only) | Book a free energy audit |
| Carbon Credits | Maximise the *return* on your solar investment. | `CarbonRevenueEstimator` | Check my eligibility |
| EV Fleets | The complete *fleet electrification* solution. | `FleetSavingsEstimator` | Book a free fleet assessment |

**Mobile:** the same `min-height` clamp (580px at phone widths). The H1 is 30px, the subtitle always shows and the tool stacks under the copy.

---

## 5. Stats Strip

Removed from the solution pages in May 2026; the unused `StatsStrip` component was deleted in September 2026. Each vertical's four stats are `VERTICAL_CONFIG[vertical].stats` (`src/config/verticals.ts`), read from the claims register (`src/config/claims.ts`). Only the first two show, on the vertical's card on `/solutions`; the solution pages show none.

### Stats per vertical
| Vertical | Stat 1 | Stat 2 | Stat 3 | Stat 4 |
|---|---|---|---|---|
| Solar | 12.7% / 2025 tariff hike | R600k / Cost per Stage 6 event | 4–7 yr / Typical payback | 25 yr / Panel warranty |
| Wheeling | 32% / Typical tariff saving | 5 MW / Min viable offtake | 90 days / Licensing timeline | R28M / Largest PPA signed |
| Optimisation | 28% / Avg C&I energy waste | R0 / Cost of an audit | 3 mo / Typical payback | R12M / Savings to date |
| Carbon | R8M / Avg revenue per MW/yr | Gold / Standard certified | R0 / Enrolment cost | 100% / Phoenix manages all |
| WeBuySolar | Free / Expert audit | PPA / Lease / After the sale | Operated / We run & optimise | Tier 1 / BloombergNEF equipment |
| EV Fleets | 87% / Diesel increase since 2019 | 60% / Fleet cost reduction | R0 / CapEx under OpEx model | 40+ / Trucks commissioned |

> The rows other than WeBuySolar are placeholders from the April 2026 mockup, not confirmed and not on the site. Don't publish them without evidence (see `docs/content/claims-register.md`).

> **WeBuySolar (updated 2026-09-24):** the row above is the site's current set, `VERTICAL_CONFIG.webuysolar.stats` in `src/config/verticals.ts`, read from the claims register (`src/config/claims.ts`). The April figures "2 min / Online valuation", "5 days / Formal offer", "42 / Systems acquired" and "R0 / Cost to get valued" are retired. "42 systems acquired" is an unconfirmed claim: it must not return to the site without evidence.

---

## 6. Pain Section — Interactive Cost Calculator

Removed from the solution pages in May 2026; the unused `SolutionPain` component was deleted in September 2026. No page has a pain section or a bill slider. The interactive tools sit in the hero's right column instead (see §4):

- **C&I Solar & Storage:** `StrategyFinder`, a few questions with no bill needed, which point the visitor to the strategy that suits them best.
- **Wheeling:** `WheelingEligibility`, which asks who supplies the site (Eskom direct, a metro, or "My supplier isn’t listed, or I’m not sure") and, for Eskom and metro supplies, about the Time-of-Use tariff, then gives an outcome (`src/lib/wheeling/eligibility.ts`). "Yes" is eligible and "No" is "Let’s get you wheel-ready". "I’m not sure" and an unlisted supplier are not a no: they get "We can tell from one electricity bill", with "Book a free wheeling assessment" and a message that asks for the check (updated September 2026, SOL-11). "Not available in your area yet" is kept for suppliers the business confirms can’t wheel; none is listed. The prefilled messages are built in `src/lib/wheeling/enquiry.ts`.
- **Carbon Credits:** `CarbonRevenueEstimator` (`src/lib/carbon/estimate.ts`), which turns system size in kWp into annual credits and a revenue range at 1,600 kWh per kWp a year, 0.95 tCO2 per MWh and R50 to R150 per credit.
- **EV Fleets:** `FleetSavingsEstimator` (`src/lib/evfleet/estimate.ts`), which takes the number of vehicles, vehicle type, fuel, distance and charging source, with fuel and electricity prices from the Sanity energy prices document (`getEnergyPrices()`). On the result step, "Edit inputs" and "Get a fleet assessment" sit side by side from 640px and stack full width below it, where each label used to wrap onto two lines.
- **Energy Optimisation:** no tool; the hero is copy only.

**The tool cards** (updated September 2026). All four cards sit on a 55% Night Teal fill (`bg-pe-nav-dark/55`, with a `rgba(255,255,255,0.10)` border). They used to be 6% white veils, so their text depended on the hero photo behind them and fell to 2.3:1 where a photo was bright (measured pixel by pixel at 1440 and 390px, in every state of each tool). On the fill, the small labels and hints that still measured low use `on-dark-muted`: the Strategy Finder's intro and option hints, the Wheeling check's "Check eligibility" eyebrow (the coral accent measured 3.1:1), its intro, the Carbon estimator's credit labels, and the fleet estimator's title and its result tiles' labels. Every text run on the cards now measures 4.5:1 or more.

**The tools' buttons** (updated September 2026) sit on the shared scale (`specs/01-BRAND.md`, Buttons and controls):
- Result CTAs are `Button` `accent` at the default size: the vertical's accent fill with its "on" ink. That covers "Book a discovery meeting about this" (Strategy Finder) and "Book a free wheeling assessment" and the first not-eligible link (Wheeling), all full width, and "See savings" and "Get a fleet assessment" (fleet). The Wheeling "Continue" and the Carbon "Check my eligibility" are `light`, full width.
- Secondary result buttons are plain `ghost`: the Wheeling "How … works" buttons and second not-eligible link (coral text on the card measured 2.3 to 3.9:1, so they don't take the coral tint) and the fleet "Edit inputs". The Strategy Finder's "Learn more" strategy buttons are compact `ghost` with the solar tint.
- Back is the 44px ghost `IconButton`, on the questions and on the result, in the same corner, named for where it goes. "Start over" is a `TextButton`: quiet 12px text in a 44px target.
- The Strategy Finder and Wheeling result CTAs wrap onto two lines at 390px (58px tall); the labels are the owner's call.

```typescript
// WeBuySolar (updated 2026-09-24)
// No calculator. The WeBuySolar team values a system after the free on-site
// audit; the page links to the valuation request (specs/11-TOOLS.md).
```

### April 2026 per-vertical copy (not on the site)

| Vertical | Eyebrow | Headline | Body | Fact pills | Highlight label |
|---|---|---|---|---|---|
| Solar | Calculate your exposure | What is grid dependence actually *costing you?* | Eskom tariffs have increased at 3× inflation since 2008. Drag to your monthly spend to see your 10-year cost trajectory. | 12.7% hike April 2025 · R3.50/kWh · Doubles every 5.8 yrs · No ceiling | 5-yr potential saving |
| Wheeling | Calculate your wheeling opportunity | What is a 32% tariff saving worth to *your business?* | Drag to your monthly spend and see the annual saving a wheeling PPA can deliver — starting within 90 days of agreement. | 32% average reduction · 90-day licensing · NERSA 2025 framework · Min 5 MW | Annual wheeling saving |
| Optimisation | Identify your savings potential | How much is energy waste *costing your business?* | 28% of energy in commercial facilities is wasted with no impact on productivity. Drag to see your monthly waste. | 28% avg waste · R0 audit cost · 3-month payback · Carbon Trust benchmark | Est. monthly energy waste |
| Carbon | Calculate your carbon revenue | How much is your solar system *leaving on the table?* | Most SA businesses with solar assets are missing an entirely untapped revenue stream. Drag to see your estimate. | R6–10M per MW/yr · Gold Standard · R0 enrolment · 100% managed | Est. annual credit revenue |
| WeBuySolar | None (updated 2026-09-24) | No calculator and no on-screen estimate: see "WeBuySolar page as built" below | | | |
| EV Fleets | Calculate your fleet savings | What is diesel dependency *costing your fleet?* | SA diesel has increased 87% since 2019. Drag to your monthly fuel spend to see the savings from electrification. | 87% diesel increase · 50% avg saving · R0 OpEx model · 40+ trucks live | Est. 5-yr fuel saving |

> The rows other than WeBuySolar are placeholders from the April 2026 mockup, not confirmed and not on the site. Don't publish them without evidence (see `docs/content/claims-register.md`).

---

## 7. Solution Tabs / Accordion

`SolutionTabs` (`src/components/sections/SolutionTabs.tsx`), a client component. C&I Solar & Storage, Wheeling, Energy Optimisation and EV Fleets use it; Carbon Credits and WeBuySolar have no tabs.

- `background: #ffffff`, padding 64px top and bottom (96px from 768px).

### Section header (above tabs)
- One stacked, left-aligned block, `max-width: 42rem`: the eyebrow (12px, uppercase, muted), the H2 (Plus Jakarta Sans 800, 24px, 30px from 768px, `<em>` in the accent's text-safe ink) and an optional subtitle (Inter, 14px, 16px from 768px, muted, `max-width: 60ch`).

### Desktop: tabs (from 1280px)

Both layouts render on the server and CSS shows one (`hidden xl:block` for the tabs, `xl:hidden` for the accordion), so nothing waits on a JavaScript width check. The switch sits at 1280px because at 1024px the C&I, Energy Optimisation and EV Fleets strips need 993 to 1,085px in a 960px row, which cut their last tab.

- Tab strip: `role="tablist"`, a 1px inset bottom rule in `#E5E7EB`, and horizontal scroll with a thin scrollbar when the labels don't fit.
- Each tab: 48px tall (`tabClasses()`, shared with the About partner tabs), 16px side padding, Inter 500, 14px, with a 28px icon chip before the label (the page's icon background, the icon in the accent).
- Inactive tabs use muted text. The active tab uses the body text colour and a 2px bottom border in the vertical accent.
- Arrow keys move and select; Home and End jump to the first and last tab. A selected tab scrolls into view if the strip ever overflows (a larger default text size, for example).
- Each tab change pushes `tab_change` (with `vertical` and `tab_label`) to the data layer.

**Tab content panel** (no border and no photo):
- The text block: H3 (Plus Jakarta Sans 800, 20px), body (16px), an optional kicker above the bullets (for example "Suited for"), bullets with accent check icons, an optional second group (for example "Benefits") and an optional button.
- Buttons: C&I strategy tabs show "Book a discovery meeting", linking to `/contact?intent=client&strategy={strategy}` (for example `strategy=demand-shaving`). Energy Optimisation lever tabs show "Book a free energy audit". Both end with an arrow, like every CTA on the site. Wheeling and EV Fleets tabs have none.
- With a chart (C&I, `StrategyProfileChart`, loaded on the client only when a tab needs it) or a diagram (Wheeling `WheelingFlowDiagram`, EV Fleets `IndustryProofCard`), the text sits left and the visual right from 1024px.
- Otherwise the text block stands alone, `max-width: 640px`. A tab's `imageBg` and `imageEmoji` fields are no longer drawn.

### Below 1280px: accordion

The same tabs, drawn as bordered, rounded cards:

- One item is open at a time, the first by default. Tapping the open item closes it; tapping another opens it and closes the last.
- Header: a 32px icon chip, the label (Inter 600, 14px) and an arrow that rotates 90° when the item is open.
- The panel opens with a `grid-template-rows` transition from `0fr` to `1fr` over 350ms. Closed panels are `inert`, and a chart loads only when its panel opens.
- Body: `padding: 0 16px 20px`, with the same content as the tab panel.
- Opening an item pushes `tab_change`.

**Deep links:** when the URL hash matches a tab's `key`, that tab and its accordion item open and the section scrolls into view (instantly under reduced motion). The keys are `strategy-{self-consumption | battery-arbitrage | demand-shaving | backup-resilience | off-grid}` (C&I), `model-direct`, `model-virtual` and `model-micro` (Wheeling), `lever-tariff` (Energy Optimisation, the only lever with a key) and `industry-{last-mile | cold-chain | fmcg | staff | municipal | logistics}` (EV Fleets).

**Icon backgrounds:** one per page, used on every tab:
| Page | Icon bg |
|---|---|
| C&I Solar & Storage | `rgba(227,197,141,0.18)` |
| Wheeling | `rgba(217,124,118,0.18)` |
| Energy Optimisation | `rgba(112,157,169,0.18)` |
| EV Fleets | `rgba(169,214,203,0.20)` |

### Financing (a band, not a tab)

No page has a Financing tab. Financing is its own section, `FinancingBand` (`src/components/sections/FinancingBand.tsx`), on `#F5F5F5`: an eyebrow, an H2, then `FinancingCards` option cards, two or three across from 768px and stacked below. Each card has a 3px accent bar, an icon chip, an optional tag pill, the title, an optional subtitle, the description and a "Benefits" list.

| Page | Placed | Eyebrow | H2 | Cards |
|---|---|---|---|---|
| C&I Solar & Storage | After the strategy tabs | How to fund it | Three ways to fund it to suit your balance sheet | Outright Purchase; Power Lease Agreement (PLA), tag "5 to 10 years"; Power Purchase Agreement (PPA), tag "10 to 20 years" |
| Energy Optimisation | After the lever tabs | How to fund it | Buy it outright or start with zero capex | Outright Purchase; Energy Efficiency Asset Lease, tag "Zero capex" |
| EV Fleets | After the two explainer sections, before the industry tabs | Fleet-as-a-Service | Go electric with *zero upfront capital*. | Fleet-as-a-Service, tag "Subscription"; Outright Purchase, tag "Ownership" |

The C&I cards are the band's defaults. Energy Optimisation passes its own from the page file. EV Fleets reads `EV_FLEETS.financing` (`src/config/evFleetsContent.ts`) and shows its note under the band: "All financing is subject to credit approval. Section 12B and tax treatment should be confirmed with your tax advisor." Wheeling and Carbon Credits have no financing band.

`FinancingCards` still contains a CapEx and OpEx fallback, drawn for a tab of `type: 'financing'`, but no page uses it.

**April 2026 Financing tab (not built).** The April design put two cards inside a Financing tab.

**CapEx card:**
- Subtitle: highest long-term ROI, Section 12B accelerates payback
- Bullets: 125% Section 12B year one · 4–7yr payback on 25-yr asset · Standard Bank prime-linked finance · Full asset ownership increases property value
- Best for: businesses wanting maximum long-term returns

**OpEx card:**
- Subtitle: R0 capital, savings from month one
- Bullets (accent dots): R0 capital required · Fixed rate locked 10–15 years · Full O&M, monitoring and insurance included · Option to purchase at end of term at residual value
- Best for: zero capex, immediate savings, no balance sheet impact

**Footer note:** *"All financing subject to credit approval. Phoenix Energy works with Standard Bank. Section 12B should be confirmed with your tax advisor."*

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

### Tab configuration per vertical

**C&I Solar & Storage** (five strategy tabs from `strategyTabs()` in `src/config/strategies.ts`, each with a daily-profile chart and a button):
`Solar Self-Consumption` · `Time-of-Use Optimisation` · `Demand Shaving` · `Backup & Resilience` · `Off-Grid`

**Wheeling** (three model tabs in the page file, each with a flow diagram):
`Direct Wheeling` · `Virtual Wheeling` · `Micro-wheeling`

**Energy Optimisation** (four lever tabs in the page file, each with the audit button):
`Energy Efficiency & Process Optimisation` · `Demand Side Management` · `Tariff Optimisation` · `Real-Time Monitoring`

**Carbon Credits** (no tabs): two explainer card sections take their place.

**WeBuySolar** (no tabs, updated 2026-09-24): explainer cards, a comparison table and a six-step How It Works take the place of tabs. See "WeBuySolar page as built" below.

**EV Fleets** (six industry tabs from `EV_FLEETS.industries` in `src/config/evFleetsContent.ts`, each with an industry example card, `IndustryProofCard`: the heading "Industry example: {stat}", the operator in body text, a grey border and no accent bar, so none reads as a Phoenix project. A source line shows once the business records one; sources and photo rights are open decision D15):
`Last-Mile Delivery` · `Cold Chain` · `FMCG Distribution` · `Staff & Shuttle` · `Municipal & Public` · `Regional Logistics`

---

## 8. How It Works — Reusable Animated Component

**Component:** `src/components/sections/HowItWorks.tsx`

This is the same animated component the homepage uses. Steps, title and subtitle are props. Solution pages spread in the page's Sanity document and add the page's `cta`, `accent` and `accentText`.

```typescript
interface HowItWorksProps {
  eyebrow?: string;              // Default: "How it works"
  title: string;                 // Supports <em>, drawn in the accent's text-safe ink
  subtitle?: string;
  steps: {
    label: string;               // Short title
    description: string;         // One to two sentences
    tag?: string;                // Optional pill tag (e.g. "No cost · No obligation")
  }[];
  autoAdvanceInterval?: number;  // ms per step while playing. Default: 2600
  showCTA?: boolean;             // Default: true. Solution pages take it from Sanity
  cta?: Cta;                     // Default: DISCOVERY_CTA ("Book a discovery meeting")
  accent?: string;               // Themes the circles, track and spark
  accentText?: string;           // Number colour on filled circles. Default: white
  flushTop?: boolean;            // No top padding under a same-background section
}
```

### Animation spec (see `specs/04-HOME.md` for full detail)

- Number circles: 56px, `border-radius: 50%`
- States: default (white fill, `#E5E7EB` border, muted number), active (`scale(1.08)`) and done. With an `accent` (every solution page), active and done circles fill with the accent and their numbers take `accentText`. Without one (the homepage), active is Deep Teal `#39575C` and done is `#45727E`.
- Pulse ring: a ring element around the active circle, `animation: pulseRing 1.8s ease-out infinite`, shown only while the sequence plays.
- Connector: `height: 2px`, `background: #E5E7EB`, overflow hidden, running between the first and last circle centres.
- Connector fill: the accent on solution pages (`linear-gradient(90deg, #39575C, #45727E)` without one). Its `width` follows the active step with a 0.7s transition.
- Travelling spark: 8px white circle with a glow in the accent (`#45727E` without one), shown for 800ms each time the sequence moves on a step.
- Playback: the server render shows the finished state, with every step done. A section that starts below the fold resets to step 1 as it nears the viewport and plays once when 35% of it is in view, one step every **2600ms** (`autoAdvanceInterval`), then stops on the last step. A section already in view or scrolled past at load, and any section under reduced motion, stays finished.
- Progress dots (`ProgressDots`): 8px dots centred below; the active one is 24px wide in the accent's text-safe ink. Each dot jumps to its step and stops the playback.
- Step count: one grid column per step, with the row capped at 220px per step; the connector's ends follow `steps.length`.
- Button: when `showCTA` is true, the `cta` button (`Button variant="primary"`, a 48px Deep Teal pill with an arrow) sits under the dots.
- Mobile (below 768px): spine layout with 44px circles (see `specs/04-HOME.md` mobile section).

### Steps per vertical

Steps and tags are edited in Sanity per page, along with the eyebrow, title, subtitle and `showCTA`: one `howItWorks` singleton for each page (`howItWorks.{vertical}`, read by `getHowItWorks()` in `src/lib/getHowItWorks.ts`), not code. When the document has no title or no steps, the page hides the section. The lists below, except WeBuySolar, are the April 2026 drafts; the live wording is whatever Studio holds.

**C&I Solar:** Free assessment · Custom proposal · Installation · Live & monitored
Tags: No cost · No obligation | Delivered in 5 days | 8–12 week commissioning | 25-yr warranty

**Wheeling:** Feasibility review · PPA structuring · Grid connection · First kWh wheeled
Tags: Free feasibility | 5 business days | 90-day process | Savings live

**Optimisation:** Energy audit · Recommendations · Implementation · Savings verified
Tags: Free audit | Delivered in 3 days | Zero disruption | Proven & reported

**Carbon Credits:** Eligibility check · Gold Standard registration · Monitoring & MRV · Credit issuance
Tags: Free check | 6–8 week process | Continuous | Quarterly payments

**WeBuySolar** (updated 2026-09-24; from `WEBUYSOLAR_OFFER.steps` in `src/config/webuysolarOffer.ts`, not Sanity): Free expert audit · Preliminary offer & valuation · Due diligence · Final offer & contracting · Acquisition & handover · Ongoing optimisation
Tags: Free · no obligation | Indicative | At our cost | No obligation | Settlement on agreed date | ROI-justified

**EV Fleets:** Depot assessment · Infrastructure design · Installation · Fleet live
Tags: Free assessment | 5 business days | 6–10 weeks | Savings from day one

> The lists other than WeBuySolar are placeholders from the April 2026 mockup, not confirmed. The live steps come from Sanity, which this spec doesn't track. Don't publish these timings or claims without evidence (see `docs/content/claims-register.md`).

---

## 9. Testimonials

Removed from the solution pages in May 2026; the unused `Testimonials` component was deleted in September 2026. No solution page has testimonials.

- **FAQ:** Carbon Credits and EV Fleets (and WeBuySolar) have an FAQ accordion instead: `FaqAccordion` at `#faq`, which also emits FAQPage JSON-LD.
- **Related articles:** every page has `RelatedArticles` (`src/components/sections/RelatedArticles.tsx`) on `#F5F5F5`, with the eyebrow "Industry insights", the H2 "Further reading on {label}" and a "View all articles" link to `/blog`. It shows up to three posts tagged for the vertical, newest first (`POSTS_BY_VERTICAL_QUERY`), and is hidden when there are none.

---

## 10. Projects Carousel

`FeaturedProjects` (`src/components/sections/FeaturedProjects.tsx`) with the page's `vertical`, inside `SectionCarousel`:

- `background: #ffffff`, padding 64px (96px from 768px). On Carbon Credits it sits flush under the FAQ (`flushTop`).
- Header row, the same on every page and on the homepage: the eyebrow "Our work", the H2 "Projects" and a "View published projects" link to `/projects` (`PROJECTS_CTA`).
- GROQ (`PROJECTS_BY_VERTICAL_QUERY`): `*[_type == "project" && vertical == $vertical] | order(completionDate desc) [0..5]`. Complete case studies (`caseStudyReady`) then move to the front, so an unwritten one never takes the first slot.
- No projects: the section is hidden.
- Three or fewer: a static grid, one column on phones. From 768px, three projects sit in three columns and one or two in two columns, with large cards when there are fewer than three.
- Four to six: a horizontal carousel. Cards are 82vw on phones and a third of the container from 768px, so three show and the rest scroll.
- Cards: the same `ProjectCard` as the homepage.

---

## 11. CTA Banner

`PageFooter` (`src/components/layout/PageFooter.tsx`) with `ctaVariant="centered"`. It replaced `CTABanner` on the solution pages in May 2026, and `CTABanner` was deleted in September 2026.

- Night Teal background (`--color-pe-nav-dark`, `#0d1f22`), a 3px Dusty Blue (`#709DA9`) top border and a faint logo watermark; padding 64px (96px from 768px).

```
[centred, max-width: 42rem]
Eyebrow: page-specific, Dusty Blue
Headline: page-specific (see table below)
Body: page-specific
[Page CTA button]
```

- The button is `Button variant="light"` at the default size: a 48px `#F5F5F5` pill with Night Teal text and an arrow, white on hover. It is the page's `SERVICE_CTA[vertical]`, the same label as the hero button (see §4).
- There is no "Explore other solutions" button. The site footer (`SiteFooter`, from the layout) follows the band.

### CTA copy per vertical

Eyebrows: Start today (Solar), Start wheeling (Wheeling), Get started (Optimisation), Start earning (Carbon Credits), Electrify your fleet (EV Fleets). Carbon Credits and EV Fleets read their copy from `CARBON_CREDITS.cta` and `EV_FLEETS.cta`; the other pages set it in the page file. The Sub column is the band's body text.

| Vertical | Headline | Sub |
|---|---|---|
| Solar | Find your optimal energy strategy | Work with our engineers to identify the best energy strategy for your business. You'll receive a clear, data-driven roadmap to reduce costs and improve energy performance. |
| Wheeling | Access lower-cost renewable electricity through a fully managed wheeling framework. | Connect to off-site renewable generation and reduce your electricity costs through structured wheeling agreements, fully managed from contract to settlement. |
| Optimisation | Stop overpaying for energy. | We analyse your energy use, identify inefficiencies, and deliver a prioritised energy efficiency roadmap so you know exactly where to reduce costs. Free. No obligation. |
| Carbon Credits | Your solar system is already generating carbon reductions. Let’s see what they’re worth. | We’ll assess your system, estimate your potential revenue, and confirm your eligibility, free and with no obligation. |
| WeBuySolar | Start with the audit. Decide everything else later. | A free, independent, operator-grade audit of your existing system. No cost. No commitment. (Updated 2026-09-24: the band lists the seven audit deliverables beside the "Book a free WeBuySolar audit" button.) |
| EV Fleets | Discover the most cost-effective path to fleet electrification. | We’ll assess your fleet, model the potential savings, and recommend the right vehicles, charging infrastructure, renewable energy strategy, and commercial model for your business. |

April 2026 subs that the build replaced, kept because they promise timings. The Solar one also conflicts with the site's one reply promise, "within 1 business day" (`REPLY_PROMISE`, `src/config/contact.ts`).
- Solar: "Get a free solar feasibility assessment. Delivered in 48 hours, no commitment required."
- Wheeling: "Free feasibility assessment. We'll confirm viability and indicative savings within 5 days."
- EV Fleets: "Free fleet electrification feasibility study. ROI model, infrastructure design, and financing options in 5 days."

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

---

## WeBuySolar Page as Built (updated 2026-09-24)

The WeBuySolar page (`src/app/solutions/webuysolar/page.tsx`) doesn't use the tab and calculator template above. Its copy lives in `src/config/webuysolarContent.ts`; the eligibility rule, the first contact and the process steps live in `src/config/webuysolarOffer.ts`, which the valuation request (`specs/11-TOOLS.md`) also reads.

**Sections, in order:**
1. **Hero:** "You own the solar asset. *But you're missing the upside.*" Primary button "Book a free WeBuySolar audit" (the contact form at step 2, with the message written); secondary button "Request a valuation" (`/tools/solar-valuation`); under them, the eligibility line "We acquire systems built on BloombergNEF Tier 1 equipment, with or without battery storage."
2. **Why now:** three explainer cards (Battery economics flipped, The market liberalised, Operations became the differentiator).
3. **Old against new:** a five-row comparison table ("Your solar asset hasn't changed. *Everything around it has.*"). The table is at least 680px wide and scrolls sideways on phones, so its box is a focusable region named by the section heading (`role="region"`, `tabIndex={0}`, `aria-labelledby`), which keyboard users can scroll with the arrow keys.
4. **Where value is lost:** three explainer cards and a pull quote.
5. **How it works:** "The path from *owned to operated*", the six steps of `WEBUYSOLAR_OFFER.steps`, with no button.
6. **Projects** and **Related articles**, each hidden while nothing is published for WeBuySolar.
7. **FAQ:** six questions, with FAQPage JSON-LD.
8. **Final band:** the `deliverables` variant of `PageFooter`: "Start with the audit. Decide everything else later.", the seven audit deliverables under "What you receive", and "Book a free WeBuySolar audit".

**Wording rules:**
- The deal is an acquisition. Don't call it a "buyback".
- No on-screen or "instant" valuation, no "2 min online valuation" and no "formal offer within 5 business days". The valuation comes with the preliminary offer, after the free on-site audit.
- The first contact uses the site-wide reply promise, "within 1 business day" (`REPLY_PROMISE`, `src/config/contact.ts`).
- "42 systems acquired" appeared in the April spec. It is unconfirmed and must not return to the site without evidence (claims register, `docs/content/claims-register.md`).

---

## TypeScript — Vertical Config Object

```typescript
// src/config/verticals.ts
// SEO copy and headline stats per vertical. Every figure comes from the claims
// register (src/config/claims.ts) through claimStat() and claimValue().

export interface VerticalStat {
  value: string;
  label: string;
}

export interface VerticalConfig {
  seoTitle: string;
  seoDescription: string;
  stats: VerticalStat[];       // 4 per vertical; the /solutions card shows the first two
}

export const VERTICAL_CONFIG: Record<SolutionVertical, VerticalConfig> = { /* one entry per vertical */ };
```

The rest of what the April interface held lives elsewhere now:
- Label, accent colours and route: `SOLUTION_META` in `src/types/solutions.ts`.
- Hero, tab, financing and CTA copy: each page file, `src/config/strategies.ts`, `carbonCreditsContent.ts`, `evFleetsContent.ts` and `webuysolarContent.ts`.
- How It Works: Sanity (§8).
- CTA labels and links: `SERVICE_CTA` in `src/config/ctas.ts`.
- Pain calculator and its copy: removed (§6).

---

## SEO & Metadata per vertical

Each page exports a static `metadata` object; there is no `generateMetadata`. The shape is the same on all six pages:

```typescript
// src/app/solutions/ci-solar-storage/page.tsx
const vertical = 'ci-solar-storage' as const;
const cfg = VERTICAL_CONFIG[vertical];

export const metadata: Metadata = {
  title: { absolute: cfg.seoTitle },
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: {
    title: cfg.seoTitle,
    description: cfg.seoDescription,
    url: `https://phoenixenergy.solutions/solutions/${vertical}`,
    images: [{ url: 'https://phoenixenergy.solutions/og-solutions-ci-solar.png', width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;
```

OG images: `public/og-solutions-{ci-solar | wheeling | energy-optimisation | carbon-credits | webuysolar | ev-fleets}.png`, 1200×630.

**JSON-LD Service schema** (C&I Solar & Storage, Wheeling, Energy Optimisation, Carbon Credits and EV Fleets):
```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: meta.label,            // SOLUTION_META[vertical].label
  provider: { '@type': 'Organization', name: 'Phoenix Energy' },
  description: cfg.seoDescription,
  url: `https://phoenixenergy.solutions/solutions/${vertical}`,
}
```

There is no `areaServed` and the provider has no `url`. Carbon Credits and EV Fleets also get FAQPage JSON-LD from `FaqAccordion`. WeBuySolar's JSON-LD differs: a BreadcrumbList, a Service named "Solar Asset Acquisition & Energy-as-a-Service" with `areaServed: 'ZA'`, and an Organization.

### SEO titles and descriptions per vertical

| Vertical | Title | Description |
|---|---|---|
| Solar | C&I Solar & Storage Solutions \| Phoenix Energy | Commercial and industrial solar and battery storage systems. Zero upfront with our PPA model. Cut your electricity bill by up to 60%. |
| Wheeling | Electricity Wheeling Solutions \| Phoenix Energy | Buy renewable energy directly from generators via the Eskom grid. Save up to 32% on electricity costs with Phoenix Energy wheeling agreements. |
| Optimisation | Energy Optimisation Services \| Phoenix Energy | Cut energy costs with high-efficiency WEG motors, VSDs, smart controls and demand management, bought outright or on a zero-capex efficiency lease. Book a free energy audit. |
| Carbon Credits | Carbon Credit Solutions \| Phoenix Energy | Monetise your solar generation through Verra-certified carbon credits. Quarterly payouts, no admin burden, fully managed by Phoenix Energy. |
| WeBuySolar | WeBuySolar: We Acquire & Operate Your Solar \| Phoenix Energy | We acquire and operate existing C&I solar and battery systems: fair-market valuation, flexible PPA or lease, and active optimisation. Free expert audit. (Updated 2026-09-24, from `VERTICAL_CONFIG.webuysolar`.) |
| EV Fleets | EV Fleet & Infrastructure Solutions \| Phoenix Energy | Electrify your commercial fleet with SANS-certified chargers, a fleet management dashboard, and up to 60% savings on fuel costs. |

Titles and descriptions are `VERTICAL_CONFIG[vertical].seoTitle` and `.seoDescription` (`src/config/verticals.ts`). The figures and names in the descriptions (60%, 32%, Verra, Quarterly, SANS) come from the claims register (`src/config/claims.ts`), which marks them unconfirmed.

April 2026 descriptions that the build replaced, kept because they carry claims. The April Carbon Credits title also ended in "Gold Standard \| Phoenix Energy".

| Vertical | April description |
|---|---|
| Solar | Bespoke C&I solar and BESS systems for South African businesses. Free assessment, 25-yr warranty, CapEx or PPA financing. |
| Wheeling | Purchase clean energy via the national grid at 20 to 40% below Eskom TOU tariffs. NERSA 2025 compliant wheeling agreements. |
| Optimisation | Free commercial energy audit. Identify and eliminate the 28% average energy waste in your facility. Typical payback under 3 months. |
| Carbon Credits | Earn R6 to 10M per MW per year from verified carbon credits on your renewable energy assets. Zero upfront cost, fully managed. |
| EV Fleets | Reduce fleet running costs by 40 to 60%. End-to-end EV charging infrastructure, vehicle procurement, and R0 OpEx model. |

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

---

## Component Map

| Component | Path |
|---|---|
| Solution pages | `src/app/solutions/{vertical}/page.tsx`, one file per vertical |
| Page template | None: each page composes the sections below |
| Hero section | `src/components/sections/SolutionHero.tsx` |
| Stats strip | None (removed, see §5) |
| Hero tools | `src/components/sections/StrategyFinder.tsx` (C&I), `WheelingEligibility.tsx` (Wheeling), `calculators/CarbonRevenueEstimator.tsx`, `calculators/FleetSavingsEstimator.tsx` |
| Tabs / accordion | `src/components/sections/SolutionTabs.tsx`, with `StrategyProfileChart.tsx`, `WheelingFlowDiagram.tsx` and `IndustryProofCard.tsx` as panel visuals |
| Financing band and cards | `src/components/sections/FinancingBand.tsx`, `FinancingCards.tsx` |
| Explainer cards | `src/components/sections/ExplainerCards.tsx` (Carbon Credits, EV Fleets, WeBuySolar) |
| FAQ accordion | `src/components/sections/FaqAccordion.tsx` (Carbon Credits, EV Fleets, WeBuySolar) |
| How It Works | `src/components/sections/HowItWorks.tsx` (shared, also used on the homepage); content from Sanity through `src/lib/getHowItWorks.ts` |
| Testimonials | None (removed, see §9) |
| Projects carousel | `src/components/sections/FeaturedProjects.tsx` (shared, filtered by the `vertical` prop), in `src/components/ui/SectionCarousel.tsx` |
| Related articles | `src/components/sections/RelatedArticles.tsx` |
| CTA banner | `src/components/layout/PageFooter.tsx` (shared, `ctaVariant="centered"`) |
| WeBuySolar only | `src/components/sections/ComparisonTable.tsx`, `PullQuote.tsx` |
| Vertical config | `src/config/verticals.ts` (SEO and stats), `src/types/solutions.ts` (`SOLUTION_META`), `src/config/ctas.ts` (`SERVICE_CTA`) |

---

## Responsive Breakpoints Summary

Breakpoints differ by section, so each cell names its own.

| Section | Wider screens | Narrower screens |
|---|---|---|
| Hero | From 1024px: copy left, tool right (440px, or 60% on C&I). H1 42px from 768px | Below 1024px: one column, tool under the copy. H1 30px below 768px. `min-height: clamp(580px, 75vw, 760px)` at every width |
| Stats strip | Removed (§5) | Removed |
| Pain section | Removed (§6) | Removed |
| Solution offering | From 1280px: horizontal tabs | Below 1280px: accordion, one open at a time |
| Financing | From 768px: two or three cards side by side | Below 768px: stacked |
| How It Works | From 768px: horizontal circles with connector | Below 768px: vertical spine (see `04-HOME.md`) |
| Testimonials | Removed (§9) | Removed |
| Projects | From 768px: three cards in view, the rest scroll; a static grid when there are three or fewer | Below 768px: horizontal scroll with 82vw cards; one column when there are three or fewer |
| Sub-nav | Removed (§3) | Removed |

---

## Open Items

| # | Item | Owner |
|---|---|---|
| 1 | Resolved in the build: no emoji placeholders remain. Since June 2026 each hero shows the photo set in the Sanity Hero Images document, and the page gradient when none is set. Uploading a photo per vertical is a Studio task. | Client |
| 2 | Not needed: the solution pages have no testimonials section (removed in May 2026, see §9). | Client |
| 3 | Real project data in Sanity — tagged by vertical | Dev |
| 4 | Done (September 2026): the WeBuySolar page has no Financing tab, and no tabs at all. The deal is an acquisition, not an installation. | Client |
| 5 | Done: `public/og-solutions-{short name}.png` for all six verticals, 1200×630, set in each page's metadata. | Dev |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.1 | Approved April 2026*

---

## Engineering Review Fixes (April 2026)

### Solution sub-nav — appearance animation
Not on the site: the sub-nav was removed in May 2026 (see §3).

### Solution sub-nav — mobile scroll behaviour
Not on the site: there is no sub-nav (see §3).

### Canonical URL — all solution pages
```typescript
// In each page's static metadata; `vertical` is the page's own constant:
alternates: {
  canonical: `https://phoenixenergy.solutions/solutions/${vertical}`
}
```

### HowItWorks — showCTA prop
Solution pages pass `cta={SERVICE_CTA[vertical]}` (`src/config/ctas.ts`): the page's button label, with a `/contact?intent=client&message=...` link that writes the service into the form. `showCTA` comes from the Sanity document's `showCta` field (default true). There are no `ctaLabel` or `ctaHref` props; the Sanity fields of those names are deprecated and unused. The button is the Deep Teal pill below the progress dots.


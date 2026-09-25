# 01 — Brand & Design System
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0
> **Updated 2026-09-24:** corrected to match the build. The navbar is a solid white pill, reveals run through `useScrollReveal`, there are no page transitions, and the component maps and interfaces list what is in `src/components` today.

---

## Design Reference

**Primary inspiration:** [greenlyte.tech](https://www.greenlyte.tech)

Phoenix Energy adapts Greenlyte's clean editorial aesthetic to a **light theme** (`#F5F5F5`) with a **multi-accent colour system** across 6 verticals.

### Patterns adopted from Greenlyte

| Pattern | Phoenix Energy adaptation |
|---|---|
| Pill nav | A solid white pill with a soft shadow on every page; no glass or dark state (see `specs/03-NAVIGATION.md`) |
| Section eyebrow labels | Uppercase 12px labels above section headings |
| Projects row | Horizontal scroll row (swipe or trackpad) of outcome-first project cards; a static grid when there are three or fewer |
| Logo wall | Static, wrapped row of partner logo cards from Sanity, with no ticker (tabbed on About) |
| News/blog feed strip | Horizontal card row with category + date |
| Team photo mosaic | Full-width candid grid on About page |
| Minimal two-row footer | Adapted to Phoenix Energy nav structure |
| Scroll-triggered reveals | `useScrollReveal` (IntersectionObserver plus Framer `animate`) through `AnimatedSection` |

---

## Colour Palette

### Core tokens

Tokens live in `src/app/globals.css` under `@theme static`, which generates the Tailwind utilities (`text-pe-muted`, `bg-pe-primary` and so on) and emits every value as a CSS variable (`var(--color-pe-muted)`) for inline styles. Contrast ratios are WCAG 2.2 against the surface named.

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--color-pe-bg` | Smoke White | `#F5F5F5` | Page background |
| `--color-pe-primary` | Deep Teal | `#39575C` | Headings, primary buttons, nav logo |
| `--color-pe-primary-hover` | Deep Teal, pressed | `#2a4045` | Primary button hover |
| `--color-pe-secondary` | Dusty Blue | `#709DA9` | Fills, rules, icons, and text on dark surfaces only (5.7:1 on `#0d1f22`) |
| `--color-pe-text` | Near Black | `#1A1A1A` | Body copy |
| `--color-pe-text-soft` | Slate | `#374151` | Long secondary copy |
| `--color-pe-muted` | Cool Grey (ink) | `#646B78` | Captions, metadata, eyebrows, hints: 4.9:1 on `#F5F5F5`, 5.4:1 on white |
| `--color-pe-border` | Light Grey | `#E5E7EB` | Card borders, dividers, rules (decoration only) |
| `--color-pe-control-border` | Control Grey | `#848B96` | A form control’s own edge: input, select and textarea borders, radio rings, segment strips and a switch’s off track. 3.4:1 on white and 3.2:1 on `#F5F5F5`, so the control can be seen (WCAG 1.4.11) |
| `--color-pe-card` | White | `#FFFFFF` | Card backgrounds |
| `--color-pe-nav-dark` | Night Teal | `#0d1f22` | Dark sections, footer, mobile menu |

### Ink tier (text that must pass on its surface)

| Token | Hex | Usage |
|---|---|---|
| `--color-pe-secondary-ink` | `#45727E` | Dusty Blue as text on light surfaces (4.9:1 on `#F5F5F5`); white text on it is 5.3:1 |
| `--color-pe-error` | `#C0392B` | Error text and error borders (5.0:1 on `#F5F5F5`) |
| `--color-on-dark-muted` | `#B9C3C5` | Secondary text on dark surfaces (9.4:1) |
| `--color-on-dark-subtle` | `#9BA7A9` | Labels, captions and legal text on dark surfaces (6.9:1). Nothing on a dark surface is lighter than this; white at 30 to 50% opacity fails. |
| `--color-on-dark-error` | `#F2B8B4` | Error text on dark surfaces |

Cool Grey was `#6B7280`, which is 4.43:1 on the page background and fails AA for small text; `#646B78` replaces it.

### Vertical accent colours

Each accent has three roles. The accent itself is for fills, bars, dots and text on dark surfaces. The ink is the accent as text on light surfaces. The "on" colour is text on a solid accent fill (badges, active pills, step circles). White text fails on every accent, including coral (2.96:1), Dusty Blue (2.96:1) and copper (3.31:1).

| Vertical | Accent | Ink (text on light) | On (text on the fill) |
|---|---|---|---|
| C&I Solar & Storage | Soft Amber `#E3C58D` | `#8A6516` | `#5E430C` |
| Wheeling | Fresh Coral `#D97C76` | `#A8453E` | `#4A1E1B` |
| Energy Optimisation | Dusty Blue `#709DA9` | `#45727E` | `#0F2E36` |
| Carbon Credits | Sage Green `#9CAF88` | `#56733F` | `#223D12` |
| WeBuySolar | Warm Copper `#C97A40` | `#9A5420` | `#3A1C08` |
| EV Fleets & Infrastructure | Light Aqua `#A9D6CB` | `#2F7565` | `#1A5A48` |

In code the same values are `SOLUTION_META[vertical].accent`, `.accentInk` and `.accentText` (`src/types/solutions.ts`); `inkFor(accent)` returns the ink for a raw accent value.

### Accent colour usage rule
Apply accent colours **subtly** — they are highlights, not backgrounds:
- 3px accent bar at the top of financing, explainer, deliverables and EV industry proof cards. Project cards carry a solid accent badge instead, and the /solutions cards show their two stat values in the accent (their Explore pill is plain ghost; see Buttons and controls).
- Badge pills: accent fill with the accent's "on" colour, or a 10 to 15% tint with the accent's ink.
- Section dividers and decorative lines.
- Icon backgrounds at low opacity.
- Hover states on CTAs within a solution page.
- Never as a full-bleed section background.

### Nav-specific colours
- **Navbar:** a solid white pill (`#ffffff`) with a soft shadow (`0 4px 20px rgba(57,87,92,0.10), 0 1px 4px rgba(57,87,92,0.06)`) on every page. There is no glass or dark state (see `specs/03-NAVIGATION.md`).
- **Mobile menu:** a full-screen `#0d1f22` (`bg-pe-nav-dark`) dialog.

---

## Typography

### Fonts

| Role | Family | Weights | Usage |
|---|---|---|---|
| Display | Plus Jakarta Sans | 700, 800 | H1–H4, logo wordmark, section titles |
| Body | Inter | 400, 500, 600 | Paragraphs, UI labels, nav, captions, form fields |

Load via `next/font/google` — both fonts are free on Google Fonts.

```typescript
// src/app/layout.tsx
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});
```

### Type scale — Canonical Tailwind classes

Every text element on the site must use one of these roles. **Never use arbitrary `text-[Xpx]` values.**

**Size floor: 12px.** Nothing on the site renders smaller than `text-xs` (12px), including badges, stat labels, form hints, step labels, chart axes and legal notes. Reading copy is larger still: 16px for primary body copy and 18px for blog prose. Keep prose to about 75 characters a line: `max-w-[56ch]` for 16px copy (Inter's `ch` is its wide zero, so 56ch holds about 75 characters; case studies measure a median of 69 to 72), `max-w-[42rem]` for 18px blog prose. The legal pages still use `max-w-[60ch]`, roughly 79 characters.

| Role | Tailwind classes | Rendered | Usage |
|---|---|---|---|
| **page-h1** | `font-display font-extrabold text-4xl leading-[1.2]` | 36px | Page titles on light pages: Contact, Projects, Tools, the valuation request, the blog index and the legal pages |
| **section-h2** | `font-display font-extrabold text-3xl leading-[1.2]` | 30px | All section headings site-wide |
| **card-h3** | `font-display font-bold text-xl leading-[1.3]` | 20px | Card titles, subsection titles |
| **subheading** | `font-display font-bold text-lg leading-tight` | 18px | Smaller inline headings, form section titles |
| **body** | `font-body font-normal text-base leading-[1.75]` | 16px | Main paragraph copy, case-study sections (56ch column), legal pages (60ch column) |
| **prose** | `font-body font-normal text-lg leading-[1.75] text-pe-text-soft` | 18px | Blog post body, in a 42rem column |
| **body-sm** | `font-body font-normal text-sm leading-[1.6]` | 14px | Secondary descriptions, card copy, step text |
| **eyebrow** | `font-body font-bold text-xs uppercase tracking-[0.14em]` | 12px | Section labels above every heading |
| **badge** | `font-body font-semibold text-xs uppercase tracking-[0.1em]` | 12px | Vertical badges and category tags (filter pills are chips, below) |
| **caption** | `font-body font-normal text-xs` | 12px | Dates, locations, read-time, metadata |
| **breadcrumb** | `font-body font-normal text-sm` | 14px | Page navigation breadcrumbs (all pages) |
| **quote** | `font-display font-bold text-base italic leading-[1.5]` | 16px | Pull quotes / blockquotes |
| **stat-value** | `font-display font-extrabold text-2xl leading-none` | 24px | Stats strip numbers, metric callouts |
| **stat-label** | `font-body font-normal text-xs uppercase tracking-[0.07em]` | 12px | Stats strip labels beneath values |
| **nav-link** | `font-body font-medium text-sm` | 14px | Navbar and footer navigation links |
| **button** | `font-body font-semibold text-sm leading-5` | 14px | Every button, at both sizes and in every variant (see Buttons and controls) |
| **chip, tab** | `font-body font-medium text-sm leading-5` | 14px | Chips and underline tabs, the same weight selected or not |
| **form-label** | `font-body font-semibold text-sm` | 14px | Form field labels |
| **form-input** | `font-body font-normal text-base` | 16px | Form input text |

### Hero accordion (home page only)
The home hero uses fluid sizes outside the scale above:
```css
/* Desktop accordion panel titles (h2, from 1280px; the page h1 is visually hidden) */
font-size: clamp(1.75rem, 3vw, 2.75rem);  /* about 28px to 44px */

/* Static hero h1 below 1280px */
font-size: clamp(2rem, 6.4vw, 3.25rem);   /* about 32px to 52px */
```

### Other titles outside the scale
- Larger: About `text-4xl md:text-5xl lg:text-6xl`, /solutions `text-4xl md:text-5xl`, solution heroes `text-[1.875rem] md:text-[2.625rem]` (30px rising to 42px), the 404 page `clamp(2rem, 5vw, 3.5rem)` and the error page `clamp(1.75rem, 4vw, 3rem)`.
- Smaller, on dark or photo heroes: case studies `text-2xl` (`text-lg` below 768px), blog posts `text-2xl md:text-3xl` and author pages `text-3xl`.

### Eyebrow colour rules
- On light backgrounds: `text-pe-muted` (Cool Grey ink)
- On dark backgrounds (`#0d1f22`, `#39575C`): `var(--color-on-dark-subtle)`
- On solution pages: the vertical's ink on light surfaces, the accent itself on dark surfaces
- On a dark gradient or a photo, measure the lightest part behind the text (axe can't): where `on-dark-subtle` or an accent falls under 4.5:1, step up to `on-dark-muted`. A card of text over a photo gets its own fill rather than relying on the photo: the solution-hero tool cards use 55% Night Teal (`bg-pe-nav-dark/55`). Since September 2026 this covers the case study hero's "Case study" label, the tool cards' eyebrows, hints and labels that still measured low, and the home accordion's collapsed labels, all `on-dark-muted`. Dusty Blue `#709DA9` passes as a label only on solid `#0d1f22` (5.7:1), not on the `#1a3a3e` end of the gradients (4.2:1).

### Button and CTA labels (added September 2026)
- **Sentence case** for every button and link label: "Book a discovery meeting", not "Book a Discovery Meeting". Product and proper names keep their capitals (WeBuySolar, C&I).
- A label says what happens next, and the same action has the same label everywhere.
- CTA labels and links live in `src/config/ctas.ts`, in four kinds.
  - "Get in touch": the navbar only, for every audience.
  - "Book a discovery meeting": company-level pages and C&I Solar & Storage.
  - "Book a free {service} assessment" or "Book a free {service} audit": solution pages whose process starts with that step, in the page's own word for it. "Free" only where the page says the step is free.
  - "Check my eligibility" (Carbon Credits) and "Request a valuation" (WeBuySolar's valuation request).
- Page CTAs link to `/contact?intent=client&message=…` with a sentence naming the service, built with `contactHref()` (`src/lib/contactLink.ts`). The C&I strategy tabs and the Strategy Finder result pass `?intent=client&strategy={key}` instead (the Finder adds `&source=finder`), and the form writes the message for that strategy. The other tool results (Wheeling eligibility, the Carbon and Fleet estimators) keep their own labels and write the visitor's answers into the message with `contactHref()`.
- Two more links open the form: the navbar's plain Contact link (`/contact`, also in the mobile menu) and the blog Inline CTA, whose label and link the editor sets, falling back to "Learn more" and `/contact`.
- Response times come from `REPLY_PROMISE` in `src/config/contact.ts` ("within 1 business day"); no page states another.

---

## Spacing & Layout

- **Max content width:** `1280px` through `.page-container` on every section; blog posts use `max-w-5xl` (1024px). `.max-w-content` (960px) is defined in `globals.css` but unused.
- **Page horizontal padding:** `16px`, `24px` from 640px and `32px` from 1024px (`.page-container`); blog posts use `24px` (`px-6`).
- **Section vertical padding:** `py-16 md:py-24` (64px / 96px).
- **Card padding:** `16px` inner body (`CardBody padding="sm"`), `24px` for content-heavy cards (`padding="lg"`).
- **Grid gap:** `16px` cards, `24px` sections.
- **Border radius:** `16px` cards (`rounded-2xl`, the featured project card included) and `9999px` for buttons, chips, pills, badges and the navbar (`rounded-full`). The `rounded-card`, `rounded-featured` and `rounded-nav` tokens in `globals.css` are unused.

---

## Component Rules

**Every distinct UI element is a reusable TypeScript component.** Never repeat styles inline across pages.

### Component map

```
src/components/
├── ui/
│   ├── AnimatedSection.tsx     // scroll-reveal wrapper (see Animation System)
│   ├── AnimatedStatValue.tsx   // stat that counts up once when it scrolls into view
│   ├── ArrowLink.tsx           // text link with an arrow, no box (default 14px, lg 16px)
│   ├── ArticleCard.tsx
│   ├── Button.tsx              // variant and size; a Link with href, otherwise a <button>
│   ├── buttonStyles.ts         // the button scale as class builders; no 'use client'
│   ├── Card.tsx                // Card, CardImage, CardBody, CardFooter, CardArrow
│   ├── Chip.tsx                // 36px pill: a toggle <button> or a link
│   ├── FeaturedArticleCard.tsx
│   ├── FilterPills.tsx         // a scrolling strip of Chip toggles
│   ├── FloatingOrbs.tsx
│   ├── FormPrivacyNotice.tsx
│   ├── IconButton.tsx          // 44px control whose only content is a glyph
│   ├── Icons.tsx
│   ├── MountWhenVisible.tsx    // mounts charts only as they near the viewport
│   ├── NextSteps.tsx
│   ├── ProgressDots.tsx
│   ├── ProjectStatsTiles.tsx
│   ├── RecaptchaNotice.tsx
│   ├── RecaptchaScript.tsx
│   ├── SectionCarousel.tsx     // section header plus a scroll row or a static grid
│   ├── SendFailureNotice.tsx
│   └── TextButton.tsx          // quiet text action with a 44px target ("Start over")
├── layout/
│   ├── Navbar.tsx              // solid white pill nav (see specs/03-NAVIGATION.md)
│   ├── SiteShell.tsx           // skip link, Navbar, <main>, SiteFooter, MotionConfig
│   ├── PageFooter.tsx          // dark CTA band above the site footer
│   └── SiteFooter.tsx          // logo, copyright and legal links strip
├── sections/
│   ├── HeroAccordion.tsx
│   ├── CompanyStats.tsx
│   ├── HowItWorks.tsx          // home and solution pages
│   ├── FeaturedProjects.tsx    // home and solution pages (vertical prop)
│   ├── FeaturedProjectCard.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectsGrid.tsx
│   ├── ProjectGallery.tsx
│   ├── LatestPosts.tsx
│   ├── RelatedArticles.tsx
│   ├── SolutionHero.tsx
│   ├── SolutionTabs.tsx
│   ├── FinancingBand.tsx
│   ├── FinancingCards.tsx
│   ├── ExplainerCards.tsx
│   ├── FaqAccordion.tsx
│   ├── ComparisonTable.tsx
│   ├── CostPerKmBars.tsx
│   ├── IndustryProofCard.tsx
│   ├── PullQuote.tsx
│   ├── StrategyFinder.tsx
│   ├── StrategyProfileChart.tsx
│   ├── WheelingEligibility.tsx
│   ├── WheelingFlowDiagram.tsx
│   ├── ContactForm.tsx
│   ├── AboutStory.tsx
│   ├── AboutMission.tsx
│   ├── AboutValues.tsx
│   ├── AboutTimeline.tsx
│   ├── AboutTeam.tsx
│   ├── AboutTrust.tsx          // partner logo wall (home and About)
│   └── calculators/
│       ├── CarbonRevenueEstimator.tsx
│       └── FleetSavingsEstimator.tsx
├── blog/
│   ├── AuthorCard.tsx
│   ├── BlogFilterPills.tsx
│   ├── BlogPagination.tsx      // Prev, page numbers and Next as Chip links; wraps; a window past 7 pages
│   ├── BlogSearchInput.tsx
│   ├── Callout.tsx
│   ├── InlineCta.tsx
│   ├── RelatedPosts.tsx
│   ├── ShareButtons.tsx
│   ├── StatStrip.tsx
│   └── TableOfContents.tsx
├── tools/
│   ├── SolarValuationTool.tsx
│   ├── Step1SystemDetails.tsx
│   ├── Step2Condition.tsx
│   ├── Step3Capture.tsx
│   ├── StepIndicator.tsx
│   ├── NumberField.tsx
│   ├── RangeSlider.tsx
│   ├── SegmentedControl.tsx
│   ├── SelectControl.tsx
│   └── Toggle.tsx
└── analytics/
    ├── ScrollDepth.tsx
    └── BlogReadDepth.tsx
```

### TypeScript conventions

```typescript
// Props type defined immediately above the component (src/components/ui/Button.tsx).
// ButtonStyle (buttonStyles.ts) holds variant, vertical, size and className.
type OwnProps = ButtonStyle & { children: ReactNode };
type AsButton = OwnProps & Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonStyle | 'children'> & { href?: undefined };
type AsLink = OwnProps & Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonStyle | 'children'>;
export type ButtonProps = AsButton | AsLink;

// Named exports only, never default exports
export function Button(props: ButtonProps) { /* ... */ }
```

With `href` set, `Button` renders a Next `Link`; without it, a `<button type="button">` (a form passes `type="submit"`). Its sizes and variants are in Buttons and controls, below.

### Buttons and controls (added September 2026)

Every button and button-like control sits on one scale, defined once in `src/components/ui/buttonStyles.ts` and drawn by `Button`, `IconButton`, `Chip`, `TextButton` and `ArrowLink`. Controls that do the same job are the same size everywhere, and the solid and outline versions of a size have identical boxes.

| Piece | Box | Side padding | Type | Gap and icon | Used for |
|---|---|---|---|---|---|
| `Button`, default | 48px minimum (`min-h-12`, `py-2`) | 20px | Inter 14px 600, 20px line | 8px, 16px icons | Hero, band, section and panel CTAs; secondary CTAs; Load more; the 404 and error actions; form and tool steps and results; the mobile menu CTA |
| `Button`, compact | 40px minimum (`min-h-10`, `py-1.5`) | 16px | Inter 14px 600, 20px line | 8px, 16px icons | The navbar CTA; card actions, including the pills drawn inside card links; inline actions |
| `Chip` | 36px (`h-9`) | 16px | Inter 14px 500, both states | 8px, 8px dot | Filter pills, the team filter, service chip links, blog tag links |
| Tab (`tabClasses()`) | 48px (`h-12`), 2px bottom rule, 8px top corners | 16px | Inter 14px 500, both states | 8px | The solution tabs and the About partner tabs |
| `IconButton` | 44 × 44px (`size-11`) | none | none | 20px glyph | Menu, close, the photo viewer, the timeline arrows, back buttons, share buttons |
| `TextButton` | 44px minimum (`min-h-11`), no fill or edge | 12px | Inter 12px 400, 16px line, `on-dark-subtle` (white on hover) | 4px, 14px icons | "Start over" on the Strategy Finder and the Wheeling check |
| `ArrowLink` | no box | none | Inter 14px 600 (`lg` 16px) | 6px and a 14px arrow (`lg` 8px and 16px) | "View …" links, the About audience links, "View all solutions", "How WeBuySolar works", the /tools card's arrow line, the desktop hero's "Explore …" (`lg`) |

- **Minimum heights.** Buttons set `min-h`, not `h`, so a label that has to wrap makes the box taller instead of overflowing. Each line of label is 20px: a two-line label makes a 58px button and a three-line label a 78px one (54px and 74px compact). Three lines happen only on the smallest phones: at 320px, "Book a free wheeling assessment" in the Wheeling results.
- **One border.** Every button variant has a 1px border, transparent on the fills, so the boxes match; the transparent edge also shows in Windows forced-colours mode.
- **Variants.** `primary` (Deep Teal fill on light sections, the default), `light` (`#F5F5F5` fill and Night Teal text on dark sections, white on hover; the site's only light style), `ghost` (translucent white on dark sections), `outline` (Deep Teal edge on light sections) and `accent` (a vertical's accent fill with its "on" ink, for the hero tools; it needs `vertical`). `ghost` with a `vertical` takes the accent's edge, a faint accent fill and the accent as its label; check the label's contrast where it sits.
- **Choosing a variant by surface.** The second button beside a solid one is `ghost` on a dark surface and `outline` on a light one, never `ghost` on light: the 404 pairs `light` with `ghost`, the error page `primary` with `outline`. `ghost` with a `vertical` goes only where its label measures 4.5:1 or more on its surface, hover included; elsewhere plain `ghost`: the Wheeling results' secondary buttons (coral text measured 2.3 to 3.9:1) and the /solutions card pills (WeBuySolar's copper measured 4.3:1 on hover, so all six cards keep one look). The Strategy Finder's "Learn more" buttons keep the solar tint (5.6:1 or more). No colour overrides through `className` on a boxed control (see Overrides).
- **Icon button variants.** `ghost` on dark surfaces and photos, `outline` on light surfaces, `plain` (no disc until hover) inside the navbar pill. Its `label` is the accessible name and says where the control goes. The share buttons draw `IconLinkedIn`, `IconXLogo` and `IconLink` (a check, `IconCheck`, for 2 seconds after a copy). The LinkedIn mark is a filled square, which reads larger and darker than an open glyph of the same size, so `ShareButtons` draws it at 16px (`size-4`) beside the 20px X and link glyphs: the same height as the X. `IconLinkedIn` itself is unchanged for its other uses.
- **Back controls in the tools.** The Strategy Finder's and the Wheeling check's back control is the 44px ghost `IconButton` on each question and on the result, which has it in the same corner, labelled with where it goes ("Back to the previous question", "Back to your supplier", "Back to the Time-of-Use question"). A back control anywhere else takes a `TextButton`. The valuation steps' Back is an `outline` button beside Next.
- **Text buttons** (`TextButton`, `textButtonClasses()`) keep a low-emphasis action quiet: text only, in a box at least 44px tall, so the target is full size. The colour is for the dark tool cards, the only place they sit. Where the text should stay where it was, margins pull the box's 14px above and below into the space around it.
- **Stacked pairs.** Below 640px, a pair that can't fit side by side stacks full width, the step back above the step forward: the fleet result and valuation steps 2 and 3.
- **Chips** are toggles with `selected` (`aria-pressed`), filled with the pill's accent (default Deep Teal), or links with `href`; on a link, `current` marks the page the visitor is on (`aria-current="page"`, filled Deep Teal), as in pagination. There is no shadow in any state.
- **Pills inside card links** use the classes on a `<span>`, `buttonClasses({ variant, size, inCard: true })`. A `Button` never goes inside a link. With `inCard`, the pill's hover and press follow the card (`group-hover:`, `group-active:`; `Card` pattern 1 carries `group`), since the card is the control, and the card keeps its own lift and shadow: the featured project card's "Read case study" darkens and the /solutions cards' "Explore …" brightens when the card is hovered. The module has no `'use client'`, so server components can call it.
- **Overrides.** Boxed controls (`Button`, `IconButton`, `Chip`, `TextButton`) take layout-only overrides through `className`: `w-full`, margins (`mt-*`, `mb-*`, and the negative margins that centre a back `IconButton` on its heading's first line or keep a `TextButton`'s text in place), `self-*`, `shrink-0`, flex sizing (`sm:flex-1`) and `flex` for a `TextButton` that fills its row. A place that seems to need another size is a new decision, not an override. The navbar CTA's `pr-1.5` (its icon disc sits concentric with the pill's round end) is the one approved exception. `ArrowLink` is a text link with no box, so it also takes its colour through `className` or `style`, for the surface it sits on. Three places do: the Solutions menu's "View all solutions" (`text-pe-secondary-ink`, on hover too, in `Navbar.tsx`), the /tools card's arrow line (`arrowLinkClasses()` with `group-hover:text-pe-primary-hover`, since the card is the link, in `app/tools/page.tsx`) and the desktop hero's "Explore …" (the panel's accent as an inline `style`, in `HeroAccordion.tsx`).
- **Motion.** Colours ease over 200ms and a pressed button scales to 98%. An arrow link's arrow nudges 4px right on hover, the same on every `ArrowLink`. The focus ring appears at once: no primitive transitions outline or box-shadow.
- **Touch.** Compact buttons and chips carry `hit-area` (`globals.css`): under `pointer: coarse`, a transparent `::after` extends them to 44px. A strip that scrolls sideways keeps at least 4px of padding above and below its chips, so it doesn't clip the extension. A row of chips that wraps (the "Our other services" chips, the blog tags footer, the blog pagination) puts 10px between its rows (`gap-y-2.5`, 8px across), so the 44px targets of neighbouring rows stay 2px apart instead of meeting.
- **Exceptions**, kept as they are: the Solutions menu toggle (24px, inside the nav pill), progress dots (24px hit areas), the team card LinkedIn badge (24px), selection controls (`.choice-card`, `.choice-segment`, the switch), nav links and menu rows, disclosure rows, text links and the skip link.

```tsx
<Button href={cta.href}>{cta.label} <IconArrowRight /></Button>
<Button variant="accent" vertical="wheeling" href={href} className="w-full">{label} <IconArrowRight /></Button>
<IconButton variant="ghost" label="Back to the previous question" onClick={back}><IconArrowLeft /></IconButton>
<TextButton onClick={restart} className="flex w-full mt-0.5 -mb-3.5">Start over</TextButton>
<Chip selected={active} onClick={select}>Founders</Chip>
<Chip href={meta.slug} dot={meta.accent}>{meta.label}</Chip>
<span className={buttonClasses({ size: 'compact', inCard: true })}>Read case study <IconArrowRight /></span>
<ArrowLink href="/projects">View published projects</ArrowLink>
```

---

## Shared Types

```typescript
// src/types/solutions.ts
export type SolutionVertical =
  | 'ci-solar-storage'
  | 'wheeling'
  | 'energy-optimisation'
  | 'carbon-credits'
  | 'webuysolar'
  | 'ev-fleets';

export interface SolutionMeta {
  label: string;
  accent: string;     // fills, bars, dots and text on dark surfaces (--color-accent-*)
  accentText: string; // the "on" colour: text on a solid accent fill (--color-accent-*-on)
  accentInk: string;  // the accent as text on light surfaces (--color-accent-*-ink)
  slug: string;
}

export const SOLUTION_META: Record<SolutionVertical, SolutionMeta> = {
  'ci-solar-storage':    { label: 'C&I Solar & Storage',        accent: '#E3C58D', accentText: '#5E430C', accentInk: '#8A6516', slug: '/solutions/ci-solar-storage' },
  'wheeling':            { label: 'Wheeling',                   accent: '#D97C76', accentText: '#4A1E1B', accentInk: '#A8453E', slug: '/solutions/wheeling' },
  'energy-optimisation': { label: 'Energy Optimisation',        accent: '#709DA9', accentText: '#0F2E36', accentInk: '#45727E', slug: '/solutions/energy-optimisation' },
  'carbon-credits':      { label: 'Carbon Credits',             accent: '#9CAF88', accentText: '#223D12', accentInk: '#56733F', slug: '/solutions/carbon-credits' },
  'webuysolar':          { label: 'WeBuySolar',                 accent: '#C97A40', accentText: '#3A1C08', accentInk: '#9A5420', slug: '/solutions/webuysolar' },
  'ev-fleets':           { label: 'EV Fleets & Infrastructure', accent: '#A9D6CB', accentText: '#1A5A48', accentInk: '#2F7565', slug: '/solutions/ev-fleets' },
};

// Also exported: SOLUTION_VERTICALS (display order) and inkFor(accent).
```

---

## Animations

**Framer Motion** drives the scripted animation: reveals, menus, and tab and filter switches. Hovers and simple state changes are CSS transitions. There are no page transitions.

| Pattern | Implementation |
|---|---|
| Scroll reveals | `useScrollReveal` through `AnimatedSection`: fade and 16px rise over 0.5s, ease `[0.16, 1, 0.3, 1]`, once, only for elements that start below the fold |
| Staggering | Per-item `delay`, for example `i * 0.05`; the partner logo grid staggers its cards by 0.05s (`staggerChildren`) on a tab switch |
| Hover lifts | `Card` pattern 1: CSS `hover:-translate-y-1` plus shadow; partner logo cards lift 4px with a Framer spring |
| How It Works track | The fill steps forward every 2.6s with a 0.7s CSS transition (`cubic-bezier(0.4, 0, 0.2, 1)`) on its width, or its height below 768px. It plays once, only when the section starts below the fold, and never under reduced motion |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md)*

---

## Animation System (Extended — Engineering Review April 2026)

### `AnimatedSection.tsx` — full spec

```typescript
// src/components/ui/AnimatedSection.tsx
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;       // Seconds to wait after the element enters view. Default: 0
  threshold?: number;   // IntersectionObserver threshold. Default: 0.15
  as?: 'div' | 'section' | 'article' | 'li'; // Element to render. Default: 'div'
}
// Renders a plain element and calls useScrollReveal(ref, { delay, threshold }).
// The content is in the server HTML. After hydration, only an element that starts
// below the fold is hidden; it then fades up 16px once as it scrolls into view.
// useScrollReveal does nothing for reduced-motion visitors.
```

### `prefers-reduced-motion` — mandatory

```typescript
// src/hooks/useReducedMotion.ts
const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

// True when the visitor asks for reduced motion; false in the server render.
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}

// Imperative check for effects and event handlers.
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches;
}
// Framer Motion follows <MotionConfig reducedMotion="user"> in SiteShell: transform
// and layout animation drop out, opacity and colour changes stay.
// @media (prefers-reduced-motion: reduce) in globals.css stops the CSS loops
// (skeleton shimmers, the pulse, ping and spin utilities, tile and button shimmers)
// and turns smooth scrolling into a jump.
// How It Works does not play, and the home hero has no auto-cycle.
```

### Standardised card hover states

- **Full-card links** (`Card` pattern 1: project, featured project, article and /solutions cards): `hover:-translate-y-1` (4px) over 200ms. Light cards add `box-shadow: 0 12px 32px rgba(57,87,92,0.10)` and `border-color: #cccccc`; dark cards add a `rgba(13,31,34,0.25)` shadow and, unless `overlay={false}`, a teal gradient overlay.
- **Cards with a button inside** (pattern 2): shadow only. **Static cards** (pattern 3, such as team and explainer cards): no hover.
- **Partner logo cards** (`AboutTrust`): a 4px Framer spring lift, a Dusty Blue border and a soft shadow.
- **Nav links**: a 7% Deep Teal background and Deep Teal text. FAQ accordion headers have no hover state.

### Page route transitions

Removed in September 2026. There are no route transitions: `src/app/template.tsx` is gone and `SiteShell` wraps `<main>` in `MotionConfig` only, so pages render without an enter or exit animation.

### Mobile nav overlay animation

Open: `translateY(-100%) → translateY(0)` over `350ms cubic-bezier(0.4,0,0.2,1)`.
Close: `translateY(0) → translateY(-100%)` over `280ms`.
Backdrop: `opacity: 0 → 1` over `300ms`.

### Minimum tap targets

All interactive elements: minimum 44×44px touch area. If visual element is smaller, extend via padding or `::after` pseudo-element without affecting visual layout. WCAG 2.5.8. Compact buttons (40px) and chips (36px) do this with the `hit-area` utility; see Buttons and controls.

### Keyboard focus ring (added September 2026)

One rule in `src/app/globals.css` draws every focus ring: a 2px halo hugging the control, then a 2px outline. Variants set only the `--ring-*` variables, never the outline itself, because the production CSS minifier merges rules with identical declarations into one `:is()` selector, and its raised specificity once hid the inset ring on the desktop hero panels (GLB-17).

- **Default (light surfaces):** white halo, Deep Teal ring, 2px outside the control.
- **Inset (`role="tab"`, `.choice-segment`, `.focus-inset`):** drawn 4px inside, with no halo, for controls in a strip or box that clips; white over photos (`.focus-inset`) and on a filled segment.
- **On dark (`.focus-on-dark`):** a white ring on a Night Teal halo. Set it on a dark container (the dark heroes and their tools, the CTA band, the footer, the mobile menu, the photo viewer, the 404, dark cards) and every control inside inherits it. Without it, the white halo merges into light and accent-filled buttons and leaves only the teal ring, at 2.2:1 on `#0d1f22` (GLB-18). Never set it on a container that holds a light panel. In the photo viewer the arrows sit on the photo on a phone; the Night Teal halo keeps their ring visible over a light photo.
- **Scrolling strips:** Tab doesn't scroll a chip that is partly out of a sideways-scrolling strip (Chrome counts it as visible and leaves it cut off, ring included). So the strips (`FilterPills`, the team filter) call `revealFocusedChip` (`FilterPills.tsx`) on focus: a chip that takes keyboard focus scrolls fully into view, and the strip's 6px of scroll padding (`scroll-px-1.5`, beside its 6px of padding) stops it 6px inside the edge, where its 4px ring shows whole. A tap or a click scrolls nothing.


---

## Shared Component Interfaces (Engineering Review April 2026)

### `StatsStrip.tsx`
Removed in September 2026. Stats render through `CompanyStats` (home), `ProjectStatsTiles` (case studies), the `PageFooter` stats band and the blog `StatStrip` block.

### `CTABanner.tsx`
Removed in September 2026. The dark CTA band is `PageFooter` (`ctaVariant?: 'stats' | 'centered' | 'deliverables'`), which defaults to the company-level "Book a discovery meeting" CTA from `src/config/ctas.ts`.

### `VerticalBadge.tsx`
Removed in September 2026. Vertical badges are inline pills filled with `SOLUTION_META[vertical].accent` and lettered in `.accentText` (project cards, the case study hero, article cards).

### `ProjectCard.tsx`
```typescript
interface ProjectCardProps {
  project: ProjectCardType;     // ProjectCard from src/types/sanity.ts
  className?: string;
  fluid?: boolean;              // Fill the parent's width (grids) instead of the 260px carousel width
  size?: 'default' | 'large';   // Roomier padding and type when only a few projects show
  headingLevel?: 2 | 3;         // 2 on /projects, straight under the H1; 3 under a section h2. Default: 3
}
// The card is always a link to its case study (/projects/{slug}). There is no drawer.
```

### `Testimonials.tsx`
Removed in September 2026. The site has no testimonials section.

### Updated component map (authoritative)
The component map under Component Rules above is the current one, checked against `src/components` on 2026-09-24; the `ui/` button primitives were added on 2026-09-25.


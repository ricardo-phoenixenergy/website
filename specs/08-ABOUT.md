# 08 — About Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Route: `/about`
> **Approved April 2026**
> **Updated 2026-09-24:** corrected to match the build (`src/app/about/page.tsx` and the `About*` section components). The hero has no photo, the Story is "Phoenix at a glance", the mission is a single quote, Trust has two tabs, and the page ends with the company CTA band. Sizes follow `specs/01-BRAND.md`; nothing is below 12px.

---

## Section Order

The numbers match the section headings below. Sections 4 and 11 were removed.

```
1.  Navbar           site-wide solid white pill, "About" active
2.  Breadcrumb       Home / About, inside the hero
3.  Hero             Night Teal with FloatingOrbs, no photo
4.  Stats strip      removed; the company stats sit in the Story (5)
5.  Story            "Phoenix at a glance": intro, company stats, map
6.  Mission strip    centred mission quote on Night Teal
7.  Values           six static dark cards, 3 columns from md
8.  Timeline         horizontal scroll track with dots, from Sanity
9.  Team             dark cards grid with category filter tabs, from Sanity
10. Trust            two tabs, Investors & Financiers and Partners, logos from Sanity
11. Careers band     removed; the careers card ends the Team grid (9)
12. CTA band         company PageFooter band, centred, one button
13. Footer           SiteFooter
```

---

## 1. Navbar

- Navbar: see `specs/03-NAVIGATION.md`. It is the same solid white pill as on every other page, with "About" highlighted as the active link.

---

## 2. Breadcrumb

```
Home / About
```
- A `nav` labelled "Breadcrumb", inside the hero above the eyebrow, `margin-bottom: 32px`.
- Breadcrumb role (Inter 400, 14px), `on-dark-subtle`. "Home" links to `/` and turns white on hover.
- Current: "About", white, `font-weight: 600`.

---

## 3. Hero

- `background: #0d1f22` (Night Teal), `min-height: 480px`, `overflow: hidden`, with `FloatingOrbs` (`showConstellation={false}`) behind the content. There is no photo layer and no overlay.
- Content in the page container: `padding-top: 112px` (144px from md) and `padding-bottom: 80px` (112px from md). The breadcrumb comes first; the rest fades up in one `AnimatedSection`.
- Eyebrow: `The rise of Phoenix Energy` (eyebrow role, `on-dark-subtle`, `margin-bottom: 12px`).
- H1: *"Powering Africa's energy transition"*, with "energy transition" in Dusty Blue `#709DA9` and kept on one line. Plus Jakarta Sans 800, 36px, 48px from md and 60px from lg, white, `line-height: 1.1`, `max-width: 860px`.
- Subtitle: *"Meet the team, story and values behind a company on a mission to become Africa's most innovative energy service provider."* Inter 400, 16px (18px from md), `line-height: 1.75`, `rgba(255,255,255,0.60)`, `max-width: 560px`.
- Two buttons, `gap: 12px`, wrapping onto a new line when they don't fit.
  - "Book a discovery meeting" (`DISCOVERY_CTA` from `src/config/ctas.ts`): `#F5F5F5` fill, Night Teal text, arrow, pill.
  - "View our projects" (`/projects`): `rgba(255,255,255,0.08)` fill, `border: 1px solid rgba(255,255,255,0.15)`, white text at 80%, arrow, pill.

---

## 4. Stats Strip

> ~~Removed April 2026.~~ The stats strip has been removed. The hero flows directly into the Story section, which shows the four company stats from the Sanity `companyStats` singleton (section 5). The impact numbers in the April 2026 mockup (48 MW, 120+, R380M, 12kt) are not used.

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

---

## 5. Story Section

Built as "Phoenix at a glance" (`src/components/sections/AboutStory.tsx`). It replaced the April two-column story (animated stat panel, "Our story" copy and a pull quote).

- `background: #ffffff`, `padding: 64px 0` (96px from md).

### Intro (centred, `max-width: 672px`, `margin-bottom: 56px`)
- Eyebrow: `Who we are` (eyebrow role, `pe-muted`).
- H2: `Phoenix at a glance`, with "glance" in `pe-secondary-ink` (section-h2 role).
- Paragraph (body role, `pe-muted`, `max-width: 60ch`): *"Phoenix Energy is a South African commercial and industrial energy company. **Not a solar installer. Not an equipment supplier. A sophisticated energy partner** that designs, finances, acquires and optimises integrated energy ecosystems for businesses that are serious about their energy future."* The bold phrases are Inter 600 in `pe-text`.

### Stats and map
```css
/* from md; one column on phones, with the stats above the map */
display: grid;
grid-template-columns: auto minmax(0, 400px);
column-gap: 32px;
row-gap: 48px;
align-items: center;
justify-content: center;
```
- Stats column: one entry per stat, 28px apart, each with a 2px left rule (`rgba(57,87,92,0.18)`) and `padding-left: 20px`.
  - Value: Plus Jakarta Sans 800, Deep Teal, 30px (2.4rem from md), `line-height: 1`. `AnimatedStatValue` counts the numbers up once they scroll into view, 0.12s apart per stat, and shows the rest of the value in `pe-secondary-ink`.
  - Label: Inter 400, 12px, uppercase, `letter-spacing: 0.1em`, `pe-muted`, `margin-top: 8px`.
  - Caption: "As at 30 June 2026" (caption role, `pe-muted`) when an editor has set the stat's `asOf` date.
- Data: the Sanity `companyStats` singleton (its schema requires exactly four stats), fetched by `getCompanyStats()` in `about/page.tsx` and passed in as `stats`. When Sanity is empty or unreachable, `DEFAULT_COMPANY_STATS` in `src/lib/companyStats.ts` fills in.
- Map column: a square up to 400px wide holding an inline SVG outline of South Africa (`rgba(57,87,92,0.16)`, `role="img"`, labelled "Phoenix Energy footprint across South Africa") and six 18px dots, one per vertical accent colour. Their `title`s name Gauteng (three dots), KwaZulu-Natal, Gqeberha (PE) and the Western Cape.
- The stats and map fade up together in one `AnimatedSection`.
- There is no pull quote, no photo and no badge.

April 2026 mockup content that was not built: the stat panel's R380M (Client savings, featured), 48MW (Deployed), 120+ (Projects) and 12kt (CO₂ saved / yr), and the badge "Since 2019 / Our impact".

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

---

## 6. Mission Strip

`src/components/sections/AboutMission.tsx`: one centred block on Night Teal. The April two-column layout with a vision column was not built.

- `background: #0d1f22` (`pe-nav-dark`), `padding: 64px 0` (96px from md).
- Centred, `max-width: 768px`, in one `AnimatedSection`.
- Eyebrow: `What drives us` (eyebrow role, `on-dark-subtle`).
- H2: `Our mission`, with "mission" in Dusty Blue `#709DA9` (section-h2 role, white).
- A decorative opening quotation mark (Plus Jakarta Sans, 72px, `#709DA9`, `aria-hidden`), 32px below the heading.
- Quote: a `blockquote` in Plus Jakarta Sans 700 italic, 18px (24px from md), white, `line-height: 1.5`: *"To become the long-term energy partner for South African businesses, one that takes over, optimises and manages their energy strategy so they never have to think about it again."*
- There is no vision text on the page, and the April mission and vision texts (from phoenixenergy.tech) are not used.

---

## 7. Values

- `background: #F5F5F5`, `padding: 64px 0` (96px from md).
- A centred heading, 40px above the cards (48px from md).
  - Eyebrow: `What we stand for` (eyebrow role, `pe-muted`).
  - H2: `Our values`, with "values" in `pe-secondary-ink`.

### Grid: six cards, 3 columns from md
```css
/* from md; one column on phones */
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 12px;
```
The grid sits in the page container. Each card fades up in its own `AnimatedSection`, 0.04s apart.

### Value card (dark, static)
- `Card variant="dark" pattern={3}`: `background: #0d1f22`, `border-radius: 16px`, no hover of any kind. `CardBody padding="lg"` (24px).

**Anatomy:**
- Title: an `h3`, Plus Jakarta Sans 700, 18px, white, `margin-bottom: 8px`.
- Text: Inter 400, 14px, `on-dark-subtle`, `line-height: 1.75`.
- No numbers: the `num` values in the component's data (the # column below) are not rendered.

### Values content (from phoenixenergy.tech/about)
The copy lives in `VALUES` in `src/components/sections/AboutValues.tsx`. Ubuntu is the sixth card, styled like the others.

| # | Title | Text |
|---|---|---|
| 01 | Empathy | We put people first, understanding our clients' unique needs to create meaningful, impactful solutions. |
| 02 | Pioneering | We break new ground with advanced renewable solutions, setting new standards for sustainable growth in business. |
| 03 | Trust | We build lasting partnerships rooted in integrity, transparency, and unwavering reliability. |
| 04 | Conscience | Everything we do is driven by our commitment to creating positive change for the planet and future generations. |
| 05 | Inspiration | We inspire businesses by creating new opportunities to deliver efficient, sustainable services that help them inspire their own customers. |
| 06 | Ubuntu | We are rooted in the African belief that we grow stronger together with our clients, our communities and our continent. |

### Mobile: 1 column

---

## 8. Timeline Carousel

`src/components/sections/AboutTimeline.tsx`. The milestones come from Sanity: active `milestoneTimeline` documents, by `order` (`MILESTONE_TIMELINE_QUERY`), fetched in `about/page.tsx`. With no milestones the section doesn't render.

- `background: #ffffff`, `padding: 64px 0` (96px from md).
- A heading row, 32px above the track.
  - Eyebrow: `Roadmap` (eyebrow role, `pe-muted`).
  - H2: `Our story so far`, with "so far" in `pe-secondary-ink`.
  - From md, previous and next buttons on the right: 36px circles (previous white with a border, next Deep Teal), disabled and faded to 30% at either end.

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

The container is a focusable region named by the section's h2 (`role="region"`, `tabIndex={0}`, `aria-labelledby`), so keyboard users can reach it and scroll it with the arrow keys (added September 2026: axe's scrollable-region-focusable).

### Per-item top line fill
```css
/* a 2px bar at the top of each past milestone (a child element, not ::before) */
position: absolute;
top: -2px;
left: 0;
width: 0%;   /* → 100% when done/active */
height: 2px;
background: #39575C;  /* done: #709DA9 */
transition: width 0.4s;
```
Future milestones (`isFuture`) get a static dashed Dusty Blue line at 50% opacity instead.

### Dot
- `width: 12px`, `height: 12px`, `border-radius: 50%`
- `position: absolute`, `top: -7px`, `left: 20px`
- Default: `background: #E5E7EB`, `border: 2px solid #E5E7EB`
- Active: `background: #39575C`, `border-color: #39575C`, with a 3px halo (`0 0 0 3px rgba(57,87,92,0.15)`).
- Done: `background: #709DA9`, `border-color: #709DA9`
- Future: white, `border: 2px dashed #709DA9`, 70% opacity.

### Item anatomy (top to bottom)
- Gradient block in place of a photo: `height: 80px`, `border-radius: 10px`, `margin-bottom: 12px`. Active: `linear-gradient(135deg, #39575C, #0d1f22)`. Other past items: `linear-gradient(135deg, #E5E7EB, #F5F5F5)`. Future: `linear-gradient(135deg, #1a3a3e, #0d1f22)` at 45% opacity (70% when active), with a dashed Dusty Blue border.
- Vision badge, future milestones only: "✦ Vision", Inter 700, 12px, uppercase, `pe-secondary-ink` on a 10% Dusty Blue tint, pill.
- Date: Inter 700, 12px, `margin-bottom: 6px`; Deep Teal when active, otherwise `pe-secondary-ink`; italic for future milestones. It is the Sanity `date` label ("2019", "March 2026"), not a date field.
- Title: Plus Jakarta Sans 700, 14px, `line-height: 1.4`; `pe-text` when active, otherwise `pe-muted`; italic for future milestones.

### Controls (no auto-advance)
- Nothing advances on its own, at any width. The active item changes when a visitor clicks an item or a dot, uses the previous and next buttons (md and up), or swipes (an `IntersectionObserver` follows the swipe).
- Smooth scroll: `scrollTo({ left: item.offsetLeft - 20, behavior: 'smooth' })`, instant for visitors who prefer reduced motion.
- Progress dots below (`ProgressDots`): clickable, 6px dots, the active one 20px wide in Deep Teal, done dots `#C5D5D7`, each labelled "Go to milestone n".

### Milestone data (placeholders — confirm real dates)
This is the April 2026 mockup's list. The live milestones are Sanity documents.

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

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

> ⚠️ **Confirm real founding year and milestone dates with client before build.**

---

## 9. Team Section

- `background: #F5F5F5`, `padding: 64px 0` (96px from md).
- Eyebrow: `The team` (eyebrow role, `pe-muted`).
- H2: `Meet the people behind Phoenix Energy`, with "behind Phoenix Energy" in `pe-secondary-ink`, 24px above the tabs.

### Category filter tabs
```
[All]  [Founders]  [Business]  [Technical]
```
- A fixed list in the component (`ALL_CATS`). "All" always shows; each other tab shows only when at least one member has that category.
- Toggle buttons in a group named "Filter the team", each with `aria-pressed`, so a screen reader hears which filter is on. The strip keeps 4px of padding (offset by a negative margin) so the focus ring isn’t clipped.
- Default: white bg, `border: 1px solid #E5E7EB`, `pe-muted` text, Inter 500.
- Active: Deep Teal fill and border, white text, `font-weight: 600`.
- `border-radius: 9999px`, Inter 14px, `padding: 6px 16px`, 8px apart, 32px above the grid.
- Filter logic: React state (`activeCat`) filters the `members` array, so hidden cards are not rendered at all.

### Team grid
```css
/* 1 column on phones, 3 from md, 4 from lg */
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 12px;
```
With no members, the grid holds only the join card and "Team members coming soon." shows below it.

### Team card (dark, Greenlyte-style)
- `Card variant="dark" pattern={3}`: `background: #0d1f22`, `border-radius: 16px`, `overflow: hidden`, no hover.

**Photo area:** `aspect-ratio: 3 / 4`
- `next/image` fill, `object-fit: cover`, blur placeholder, under the card's dark gradient scrim. With no photo: `linear-gradient(135deg, #162630, #0d1f22)`.
- LinkedIn link, when the member has one: absolute `top: 10px`, `right: 10px`, a 24px circle, `background: rgba(255,255,255,0.1)`, `color: rgba(255,255,255,0.6)`, "in" text, opening in a new tab. Its accessible name is "LinkedIn profile of {name} (opens in a new tab)"; the URL comes from Sanity and must include `/in/`.

**Body** (`padding: 16px`):
- Name: Plus Jakarta Sans 700, 16px, white, `margin-bottom: 2px`.
- Archetype title (optional): Inter 600, 14px, `pe-secondary-ink`, `margin-bottom: 2px`.
  - *"The Strategist"*, *"The Innovator"*, *"The Trailblazer"*
- Role: Inter 400, 12px, `on-dark-subtle`.

### Confirmed team members
| Name | Archetype | Role | Filter |
|---|---|---|---|
| Erin Berman-Levy | The Strategist | Co-Founder | Founders |
| Ricardo De Sousa | The Innovator | Co-Founder | Founders |
| Russel Swanepoel | The Trailblazer | Co-Founder | Founders |
| + additional team | TBC | TBC | Business / Technical |

> ⚠️ **Team data is managed entirely through Sanity CMS — not hardcoded.** See `12-CMS.md` for the full `teamMember` schema and field guidance. Client must create team member documents in Sanity Studio before launch. Required fields per member: name, photo, role, category, order. See `14-OPEN-ITEMS.md` for the full client action checklist.

### "Join the journey" card
- The last item in the grid: `Card variant="dark" pattern={2}` (shadow-only hover) with `md:col-span-3`, so it fills the row at md and three of the four columns from lg.
- `background: #0d1f22`, `border-radius: 16px`, `padding: 24px`.
- Stacked on phones; from md a row with `align-items: center`, `justify-content: space-between`, `gap: 16px`.
- Left: title *"Become a part of our journey"* (Plus Jakarta Sans 700, 16px, white) + sub *"We're always looking for passionate, ambitious individuals who share our vision for a prosperous Africa."* (Inter 400, 14px, `on-dark-subtle`).
- Right: `See career opportunities →`, a link to the Phoenix Energy LinkedIn company page (new tab): `#F5F5F5` bg, Night Teal text, pill, white on hover.

### Mobile: 1 column, filter tabs scroll horizontally

---

## 10. Trust Section

`src/components/sections/AboutTrust.tsx` with its defaults (tabs on). The home page uses the same component without tabs.

- `background: #ffffff`, `padding: 64px 0` (96px from md), `border-top: 1px solid #E5E7EB`.
- Eyebrow: `Partners and financiers` (was "Trusted by the best").
- H2: `Who we work with`, with "work with" in `pe-secondary-ink`.

### Tab navigation (Greenlyte-style)
```
[Investors & Financiers  n]  [Partners  n]
```
- Two tabs; there is no Media & Press tab. Each tab shows a count badge when its category has partners.
- WAI-ARIA tabs, as in `SolutionTabs`: `role="tablist"` named by the H2, `role="tab"` with `aria-selected` and a roving `tabIndex`, Left and Right arrows, Home and End, and a `role="tabpanel"` around the logos. As tabs they take the inset focus ring, which the scrolling strip can’t clip.
- `border-bottom: 1px solid #E5E7EB`, `margin-top: 28px`, `margin-bottom: 32px`. The strip scrolls sideways when it doesn't fit.
- Each tab: Inter 600, 14px, `pe-muted`, `padding: 12px 20px`.
- Active: Deep Teal text, `border-bottom: 2px solid #39575C`, `margin-bottom: -1px`.
- A tab with no partners shows a dashed box with "Coming soon" and "Our {tab name} will be listed here shortly."
- Under the logos, above a 1px rule: "Partner with us" and "Talk to us about investing" (`PARTNER_CTA` and `INVESTOR_CTA` in `src/config/ctas.ts`), Deep Teal text links with an arrow. They open the contact form at step 2 as a partner or an investor, with a message of their own, so the page’s only routes are no longer the client form (JRN-22). The hero and the footer band keep "Book a discovery meeting" for clients.

### Logo cards (both tabs)
```css
display: flex;
flex-wrap: wrap;
gap: 12px;
```
Each card:
- White, `border: 1px solid #E5E7EB`, `border-radius: 12px`, a faint shadow.
- Width: `calc(50% - 6px)` on phones (two per row) and `280px` from sm.
- Logo zone: `min-height: 140px`, `background: rgba(245,245,245,0.55)`, `padding: 24px 24px 20px`. The Sanity logo fills a 96px-tall box with `object-fit: contain`. Without a logo, a 44px rounded square shows the initials in Deep Teal.
- Logo only: there is no name or role text on the card.
- Links to the partner's `website` in a new tab when one is set.
- Hover: the card lifts 4px with a Dusty Blue border and a soft shadow (Framer Motion spring). On a tab switch the cards fade in 0.05s apart.
- Data: active `partner` documents from Sanity (`PARTNERS_QUERY`, by `order`), filtered by `category`.

### Investors & Financiers panel
This is the April 2026 mockup's list. The live cards come from Sanity and show logos only.

| Mark | Name | Role |
|---|---|---|
| SB — `#1a3a6e` | Standard Bank | Finance partner |
| WEG — `#003087` | WEG | Equipment financier |
| CP — `#39575C` | Captive Power | Strategic investor |
| BE — `#5a3a1a` | Blue Echo | Technology partner |

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

### Partners panel
Standard Bank · WEG · Blue Echo · Captive Power + additional partners

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

### Media & Press panel
Not built: the page has no Media & Press tab, although the Sanity `partner` schema still offers a `media` category. The April 2026 mockup planned text-only marks (publication name in Inter 700, muted) for:
Business Day · Fin24 · Engineering News · Daily Maverick · ESI Africa · EE Publishers

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

> ⚠️ **Full partner/investor list and SVG logo files to be provided by client.**

### Mobile: two cards per row, tabs scroll horizontally

---

## 11. Careers Band

> ~~Removed April 2026.~~ The standalone careers band has been removed. The single careers touchpoint on the About page is the "Become a part of our journey" banner at the bottom of the Team section grid (section 9).

---

## 12. CTA Banner

The company CTA band: `<PageFooter ctaVariant="centered" />` (`src/components/layout/PageFooter.tsx`) with its defaults, `DISCOVERY_BAND` and `DISCOVERY_CTA` from `src/config/ctas.ts`. It replaced the April "Work with us" banner and its two buttons.

- `background: #0d1f22`, `border-top: 3px solid #709DA9`, `padding: 64px 0` (96px from md), with the inverted logo as a faint watermark (7% opacity) at the bottom right.
- Centred, `max-width: 672px`.

```
Eyebrow: "Start your energy transition"
Headline: "Find the right energy strategy for your business."
Body: "Meet with our engineers to identify the solutions that will reduce costs, generate new revenue and strengthen your energy resilience, at no cost or obligation. We reply within 1 business day."
[Book a discovery meeting →]
```
- Eyebrow: eyebrow role, `#709DA9`.
- Headline: Plus Jakarta Sans 800, 30px (36px from md), white, `line-height: 1.2`.
- Body: Inter 400, 16px, `on-dark-subtle`, `line-height: 1.75`, `margin-bottom: 32px`.
- One button: white fill, Night Teal text, arrow, pill, `#F5F5F5` on hover. There is no second button.

---

## SEO & Metadata

```typescript
// src/app/about/page.tsx
export const metadata: Metadata = {
  // The root template adds "| Phoenix Energy", so the brand appears once.
  title: 'About Us: Our Story, Mission & Team',
  description:
    "Learn about Phoenix Energy's founding story, mission to drive Net Zero across Africa, our values, and the team behind Southern Africa's leading clean energy company.",
  alternates: { canonical: 'https://phoenixenergy.solutions/about' },
  openGraph: {
    title: 'About Phoenix Energy: Our Story, Mission & Team',
    description:
      "The story, mission and team behind Southern Africa's leading integrated clean energy company.",
    url: 'https://phoenixenergy.solutions/about',
    images: [{ url: 'https://phoenixenergy.solutions/og-default.png', width: 1200, height: 630 }],
  },
};

export const revalidate = 3600; // hourly safety net in case the Sanity webhook misses a change
```

---

## Component Map

| Section | Component |
|---|---|
| Hero | `src/app/about/page.tsx` (inline, not reused), with `src/components/ui/FloatingOrbs.tsx` |
| ~~Stats strip~~ | ~~removed April 2026~~; `StatsStrip` was later deleted, and the case study uses `src/components/ui/ProjectStatsTiles.tsx` |
| Story | `src/components/sections/AboutStory.tsx` |
| Mission | `src/components/sections/AboutMission.tsx` |
| Values | `src/components/sections/AboutValues.tsx` |
| Timeline | `src/components/sections/AboutTimeline.tsx` |
| Team | `src/components/sections/AboutTeam.tsx` |
| Trust | `src/components/sections/AboutTrust.tsx` |
| ~~Careers band~~ | ~~removed April 2026~~ — `CareersBand.tsx` deleted |
| CTA | `src/components/layout/PageFooter.tsx` (shared, `ctaVariant="centered"`) |
| Footer | `src/components/layout/SiteFooter.tsx` (shared, rendered by `SiteShell` on every page) |

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
- Gradient block (there is no image): `scale(0.97 → 1)` over `400ms cubic-bezier(0.4,0,0.2,1)`.
- Title: colour `pe-muted → pe-text` + `translateY(4px → 0)` over `300ms`.

### Timeline — mobile behaviour
- Card width: `calc(80vw)` (peek pattern — 1.25 visible at any time)
- `scroll-snap-type: x mandatory` on container, `scroll-snap-align: start` on each item
- Auto-advance: **none at any width**. Visitors swipe, tap an item or a dot, or use the previous and next buttons from md.

### Trust tabs — mobile logo grid
Two cards per row on phones: each card is `w-[calc(50%-6px)]` in a `flex flex-wrap gap-3` row, and `sm:w-[280px]` from 640px. Each card has its own border; there is no shared border grid.

### Trust tabs — mobile tab scroll
`overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch`


---

## Team Section — CMS-Driven Update (April 2026)

The team grid is **fully driven by Sanity**. No team member data is hardcoded in the component. `src/app/about/page.tsx` fetches the active members server side and passes them to `AboutTeam` as the `members` prop. A `teamMember` change sent to the revalidation webhook (`src/app/api/revalidate/route.ts`) refreshes `/about`, and the page also revalidates hourly (`revalidate = 3600`).

### Data fetch
```typescript
// src/app/about/page.tsx (server component)
async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    return await sanityServerClient.fetch<TeamMember[]>(TEAM_MEMBERS_QUERY);
  } catch {
    return []; // the Team section then shows "Team members coming soon."
  }
}
// Fetched in parallel with the milestones, partners and company stats, then:
// <AboutTeam members={teamMembers} />
```
`TEAM_MEMBERS_QUERY` returns the active members: founders first, then business, then technical, each group by `order`.

### Category filter logic
The tabs come from a fixed list in the component (All / Founders / Business / Technical). If no members exist in a category, that tab is hidden automatically.

### "Join the journey" card
Always rendered as the final item in the grid, whatever the team member count. `md:col-span-3`: the full row at md, three of the four columns from lg, and one column on phones. This card is static, not CMS-managed.

### Mobile — 1-column grid, filter tabs scroll horizontally
Filter tabs: `overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; white-space: nowrap`


# Phoenix Energy — UI/UX Cohesion Design Spec
> Date: 2026-05-09 | Status: Approved | Author: Brainstorming session

---

## 1. Problem Statement

A full codebase audit identified systematic inconsistencies across card hover states, section padding, icon usage, the Partners section layout, and the card interaction model. The goal of this spec is to define a single authoritative token set and enforce it across every component on the site — eliminating drift and making the brand feel cohesive and intentional.

The Contact, Projects, and Blog pages are the established visual baseline. Everything else is brought up to their standard.

---

## 2. Global Rules (non-negotiable, apply everywhere)

### 2.1 Icon rule — no text arrows ever
`IconArrowRight` from `src/components/ui/Icons.tsx` must be used in every case where an arrow appears. Text arrow symbols (`→`, `►`, `>`) are **banned** across the entire codebase — in JSX, in string props, in button labels, in link text.

**Find and replace all instances:**
- `HowItWorks.tsx` — CTA label `"Get a Free Assessment →"` → `<>Get a Free Assessment <IconArrowRight /></>`
- `SectionCarousel.tsx` — `"View all articles →"` → `<>View all articles <IconArrowRight size={14} /></>`
- Any solution page CTA strings passed with trailing `→`
- Any `Button` or `Link` text containing `→`

### 2.2 Section padding standard
All sections use one of two padding values — no exceptions, no arbitrary `py-[Npx]` values:

| Type | Tailwind | px value | Used for |
|---|---|---|---|
| **Standard section** | `py-16 md:py-24` | 64px / 96px | All content sections (HowItWorks, Testimonials, About sections, Blog, Projects) |
| **Compact section** | `py-10 md:py-12` | 40px / 48px | Partners strip, trust bars, stats strips |

**Sections to update:**
- `PartnerCards.tsx` — currently `py-8` → `py-10 md:py-12`
- `HowItWorks.tsx` — currently `py-12 md:py-[48px]` → `py-16 md:py-24`
- `SectionCarousel` — currently `py-12 md:py-[48px]` → `py-16 md:py-24`
- `Testimonials.tsx` — currently `py-12 md:py-[52px]` → `py-16 md:py-24`
- `AboutTeam.tsx` — currently `py-[52px]` → `py-16 md:py-24`
- `AboutStory.tsx` — currently `py-[52px]` → `py-16 md:py-24`
- `AboutValues.tsx` — currently `py-[52px]` → `py-16 md:py-24`

---

## 3. Card System

### 3.1 Architecture

A shared `Card` base component (`src/components/ui/Card.tsx`) replaces all ad-hoc card implementations. It is a composition of three sub-components:

```
Card                     — base wrapper: variant, hover pattern, border-radius, border
├── CardImage (optional) — photo zone with gradient scrim + badge slots
├── CardBody             — padded content area (always present)
└── CardFooter (optional)— border-top footer: metadata + arrow icon
```

### 3.2 Two structural variants

| Variant | Has `CardImage`? | Used for |
|---|---|---|
| **With image** | Yes | ProjectCard, ArticleCard, FeaturedProjectCard, FeaturedArticleCard, AboutTeam member card |
| **Without image** | No | FinancingCards, Tools cards, Testimonials, AboutValues, AboutStory stat panel |

### 3.3 Two colour variants

| Variant | Background | Border | Text | When to use |
|---|---|---|---|---|
| **Light** | `#ffffff` | `1px solid #E5E7EB` | `#1A1A1A` | Content, data, blog, projects — default |
| **Dark** | `#0d1f22` | none | `white` | Brand identity contexts only: company values, team profiles, emphasis/stat panels |

**Dark card rule — only use dark cards for:**
- Brand values (AboutValues)
- Team member profiles (AboutTeam)
- Animated stat panels (AboutStory)
- FinancingCards OpEx panel (deliberate contrast with CapEx)
- CTABanner (full-bleed, not a card)

Never use dark cards for projects, blog articles, testimonials, or tools.

### 3.4 Three interaction patterns

This is the most important rule. A card uses exactly one interaction pattern. Never mix.

**Pattern 1 — Full-card link (no button inside)**
- The entire card is wrapped in `<Link href={...}>` or has `role="button"` + `onClick`
- No `<button>` element exists inside the card
- The only action affordance is `IconArrowRight` in the `CardFooter`
- Hover: `translateY(-4px)` lift + shadow + border highlight (light) or gradient fade-in (dark)
- `cursor-pointer` on the card

```
Used by: ProjectCard, ArticleCard, FeaturedProjectCard, FeaturedArticleCard, AboutTeam card
```

**Pattern 2 — Button inside (card is not a link)**
- The card is a `<div>` — NOT a `<Link>` or `<a>`
- A `<Button>` or `<Link>` element inside the card is the sole action
- `cursor-default` on the card itself
- Hover: subtle `box-shadow` only — card does NOT lift, does NOT change border
- `cursor-pointer` only on the button inside

```
Used by: FinancingCards (CapEx + OpEx), Tools cards, any card with an explicit CTA button
```

**Pattern 3 — Static / display only**
- No interaction. The card is purely informational.
- No hover effect of any kind — no lift, no gradient overlay, no border change, no shadow.
- `cursor-default`

```
Used by: Testimonials, AboutValues
```

> **Note:** `AboutValues.tsx` currently has a gradient overlay hover. This must be **removed** — it is inconsistent with Pattern 3 and gives the impression the card is interactive when it is not.

### 3.5 Shared hover tokens

All hover effects use these exact values — no variations:

**Light card / Pattern 1 hover:**
```css
transform: translateY(-4px);
box-shadow: 0 12px 32px rgba(57, 87, 92, 0.10);
border-color: #cccccc;
transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
```

**Dark card / Pattern 1 hover:**
```css
transform: translateY(-4px);
box-shadow: 0 12px 32px rgba(13, 31, 34, 0.25);
/* gradient overlay div: opacity 0 → 1 at 200ms ease */
transition: transform 200ms ease, box-shadow 200ms ease;
```

**Pattern 2 card hover (shadow only):**
```css
box-shadow: 0 4px 16px rgba(57, 87, 92, 0.07);
transition: box-shadow 200ms ease;
/* No transform. No border change. */
```

**Pattern 3:** No hover styles.

### 3.6 Shared structural tokens

These apply to all card types regardless of variant or pattern:

| Token | Value | Tailwind |
|---|---|---|
| Border radius | 16px | `rounded-2xl` |
| Body padding — standard | 16px | `p-4` | ProjectCard, ArticleCard, AboutTeam card |
| Body padding — content-heavy | 24px | `p-6` | Testimonials, FinancingCards, FeaturedProjectCard right panel, AboutValues |
| CardImage height — standard | 168px | `style={{ height: 168 }}` |
| CardImage height — featured | 260px min | `style={{ minHeight: 260 }}` |
| CardFooter padding | 12px 16px | `px-4 py-3` |
| CardFooter border | `1px solid #E5E7EB` | `border-t border-[#E5E7EB]` |
| Accent bar (optional top) | 3px | `h-[3px] rounded-full` | FinancingCards CapEx (dusty-blue bar) and OpEx (dusty-blue bar); not used on project or article cards |

### 3.7 `CardImage` zone spec

```tsx
// Gradient scrim — always present over image
background: linear-gradient(to top, rgba(13,31,34,0.65) 0%, rgba(13,31,34,0.08) 55%, transparent 100%)

// Image zoom on hover (Pattern 1 only)
className="transition-transform duration-500 group-hover:scale-[1.05]"

// Badge slots
// - Top-right: "★ Featured" badge — bg #39575C, white text
// - Bottom-left: vertical/category badge — VerticalBadge component
```

### 3.8 `CardFooter` arrow spec

The `IconArrowRight` in a `CardFooter` (Pattern 1 cards) uses this exact treatment:

```tsx
<div className="w-6 h-6 rounded-full border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-[#39575C] group-hover:border-[#39575C] group-hover:text-white">
  <IconArrowRight size={12} />
</div>
```

Dark card variant:
```tsx
<div className="... border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.4)] group-hover:bg-[#709DA9] group-hover:border-[#709DA9] group-hover:text-white">
  <IconArrowRight size={12} />
</div>
```

---

## 4. Partners Section Redesign

### 4.1 Layout
Replace the current broken `PartnerCards.tsx` with a clean static centred logo strip.

```
Section background: bg-white
Padding: py-10 md:py-12 (compact section token)
Border bottom: 1px solid #E5E7EB
Max-width container: page-container (960px)
```

### 4.2 Structure
```tsx
<section className="bg-white py-10 md:py-12" style={{ borderBottom: '1px solid #E5E7EB' }}>
  <div className="page-container">
    <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] text-center mb-6">
      Trusted by leading energy businesses
    </p>
    <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14">
      {partners.map(p => (
        // logo image or text initials fallback
      ))}
    </div>
  </div>
</section>
```

### 4.3 Logo sizing
```tsx
// Image logo
<Image
  height={32}
  width={140}
  className="h-8 w-auto max-w-[140px] object-contain opacity-50 hover:opacity-80 transition-opacity duration-200"
/>

// Fallback (no logo uploaded) — text initials, NOT a square block
<span className="font-display font-bold text-sm text-[#6B7280] opacity-50">
  {getInitials(p.name)}
</span>
```

**Key fix:** `h-8` (32px) with `w-auto` — logos maintain their natural proportions. The old `h-32 w-32` square placeholder is removed entirely.

### 4.4 No marquee
Static layout only. A marquee requires 10+ logos to feel premium; a handful of logos in a marquee looks like the same 4 items looping. Static centered row is cleaner.

---

## 5. Icon System Rules

### 5.1 Arrow icons
`IconArrowRight` is the only arrow used on the site. It appears in:
- `CardFooter` circle buttons (Pattern 1 cards)
- Inline text links (after link label, never before)
- CTA buttons (after button label)
- Section "View all →" links in `SectionCarousel`
- `HowItWorks` CTA button

**Never use:** `→`, `►`, `>`, `»` or any text/unicode arrow character.

### 5.2 Other icon rules
- All icons come from `src/components/ui/Icons.tsx`
- Icon size is always passed via the `size` prop — never resized via CSS `width`/`height` directly
- Default icon size in body context: `size={14}` or `size={16}`
- Arrow in `CardFooter` circle: `size={12}`

---

## 6. Section Header Patterns

Two permitted section header layouts. Use the correct one based on context.

### 6.1 Pattern A — Centred (default)
Used when the section stands alone and has no "see all" navigation.
```tsx
<div className="text-center mb-10 md:mb-12">
  <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
    {eyebrow}
  </p>
  <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
    {title}
  </h2>
</div>
```
Used by: HowItWorks, Testimonials, AboutTeam, AboutValues, AboutStory, SolutionHero

### 6.2 Pattern B — Split (carousel / paginated sections)
Used when the section has a "View all" link to a full listing page.
```tsx
<div className="flex items-end justify-between mb-8">
  <div>
    <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
      {eyebrow}
    </p>
    <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
      {title}
    </h2>
  </div>
  <Link href={viewAllHref} className="group flex items-center gap-1.5 font-body text-sm font-medium text-[#39575C] hover:text-[#2a4045] transition-colors flex-shrink-0 ml-4">
    {viewAllLabel}
    <span className="transition-transform duration-200 group-hover:translate-x-1">
      <IconArrowRight size={14} />
    </span>
  </Link>
</div>
```
Used by: SectionCarousel (LatestPosts, FeaturedProjects)

---

## 7. Dark Card Hover System

Dark Pattern 1 cards (AboutTeam) use a gradient overlay rather than a border highlight. Pattern 3 dark cards (AboutValues) have **no hover at all** — the gradient overlay currently in `AboutValues.tsx` is removed. The overlay structure for Pattern 1 dark cards is:

```tsx
// Static gradient overlay — always present, opacity-0 at rest
<div
  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
  style={{ background: 'linear-gradient(140deg, #1a4a52 0%, #0f2d33 100%)' }}
/>
// Radial teal glow — top-right corner
<span
  aria-hidden
  className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
  style={{
    top: -24, right: -24, width: 96, height: 96, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(112,157,169,0.25) 0%, transparent 70%)',
  }}
/>
```

This overlay is already in `AboutValues.tsx` and `AboutTeam.tsx`. It must be extracted into the shared `Card` dark variant — not duplicated per component.

---

## 8. Components to Create / Modify

### New files
| File | Description |
|---|---|
| `src/components/ui/Card.tsx` | Shared card base: `Card`, `CardImage`, `CardBody`, `CardFooter` exports |

### Modified files
| File | Change |
|---|---|
| `src/components/sections/PartnerCards.tsx` | Full redesign per Section 4 |
| `src/components/sections/ProjectCard.tsx` | Adopt `Card` base; fix hover to -4px |
| `src/components/ui/ArticleCard.tsx` | Adopt `Card` base; fix hover to -4px |
| `src/components/sections/FeaturedProjectCard.tsx` | Adopt `Card` base; remove text arrow |
| `src/components/ui/FeaturedArticleCard.tsx` | Adopt `Card` base |
| `src/components/sections/Testimonials.tsx` | Adopt `Card` base (Pattern 3 — no hover) |
| `src/components/sections/AboutValues.tsx` | Adopt `Card` dark base (Pattern 3 — no hover); **remove** gradient overlay and radial glow entirely |
| `src/components/sections/AboutTeam.tsx` | Adopt `Card` dark base (Pattern 1 — full-card link); fix padding |
| `src/components/sections/FinancingCards.tsx` | Adopt `Card` base (Pattern 2 — button only); fix hover to shadow-only |
| `src/components/sections/HowItWorks.tsx` | Fix padding to `py-16 md:py-24`; replace `→` with `<IconArrowRight />` |
| `src/components/ui/SectionCarousel.tsx` | Fix padding to `py-16 md:py-24`; replace `→` with `<IconArrowRight />` |
| `src/components/sections/CTABanner.tsx` | Replace any `→` text with `<IconArrowRight />` |
| `src/components/sections/SolutionHero.tsx` | Replace any `→` text with `<IconArrowRight />` |

### Audit for text arrows (grep target)
Run `grep -r "→\|►" src/` to find all remaining text arrow instances not listed above.

---

## 9. What Is NOT Changing

- Color palette — no changes to `#39575C`, `#709DA9`, `#F5F5F5`, `#0d1f22` or any accent colours
- Typography scale — no changes to font classes
- Navigation — no changes to Navbar or Footer
- Animation system — `fadeUpVariant`, `AnimatedSection`, `useReducedMotion` unchanged
- Background alternation rhythm — white/gray/teal sequence stays as-is
- Sanity schemas — no CMS changes
- Page layouts — no structural page changes

---

## 10. Success Criteria

- [ ] `Card`, `CardImage`, `CardBody`, `CardFooter` exported from `src/components/ui/Card.tsx`
- [ ] Zero text arrow characters (`→`) remain in any `.tsx` file under `src/`
- [ ] All card hover lifts are exactly `-4px` or removed (Pattern 2/3)
- [ ] All sections use `py-16 md:py-24` or `py-10 md:py-12` — no other `py-` values
- [ ] `PartnerCards.tsx` renders logos at `h-8 w-auto max-w-[140px]` with opacity treatment
- [ ] Dark cards appear only in: AboutValues, AboutTeam, AboutStory stat panel, FinancingCards OpEx
- [ ] Every `CardFooter` arrow uses `<IconArrowRight />` inside a circle button element

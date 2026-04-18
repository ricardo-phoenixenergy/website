# 01 — Brand & Design System
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0

---

## Design Reference

**Primary inspiration:** [greenlyte.tech](https://www.greenlyte.tech)

Phoenix Energy adapts Greenlyte's clean editorial aesthetic to a **light theme** (`#F5F5F5`) with a **multi-accent colour system** across 6 verticals.

### Patterns adopted from Greenlyte

| Pattern | Phoenix Energy adaptation |
|---|---|
| Pill nav with glass scroll | Same — see `specs/03-NAVIGATION.md` |
| Section eyebrow labels | Uppercase 10px labels above every heading |
| Projects auto-scroll slider | Project cards with stat callouts |
| Infinite logo marquee | Client / accreditation logo ticker |
| News/blog feed strip | Horizontal card row with category + date |
| Team photo mosaic | Full-width candid grid on About page |
| Minimal two-row footer | Adapted to Phoenix Energy nav structure |
| Scroll-triggered reveals | Framer Motion `useInView` |

---

## Colour Palette

### Core tokens

| CSS Variable | Name | Hex | Usage |
|---|---|---|---|
| `--color-bg` | Smoke White | `#F5F5F5` | Page background |
| `--color-primary` | Deep Teal | `#39575C` | Headings, primary buttons, nav logo |
| `--color-secondary` | Dusty Blue | `#709DA9` | Links, hover states, secondary buttons |
| `--color-text` | Near Black | `#1A1A1A` | Body copy |
| `--color-text-muted` | Cool Grey | `#6B7280` | Captions, metadata, muted labels |
| `--color-border` | Light Grey | `#E5E7EB` | Card borders, dividers, rules |
| `--color-card` | White | `#FFFFFF` | Card backgrounds |

### Vertical accent colours

| Vertical | Name | Hex | Text on accent |
|---|---|---|---|
| C&I Solar & Storage | Soft Amber | `#E3C58D` | `#6b4e10` (dark) |
| Wheeling | Fresh Coral | `#D97C76` | `#ffffff` (white) |
| Energy Optimisation | Dusty Blue | `#709DA9` | `#ffffff` (white) |
| Carbon Credits | Sage Green | `#9CAF88` | `#2a4a18` (dark) |
| WeBuySolar | Warm Copper | `#C97A40` | `#ffffff` (white) |
| EV Fleets & Infrastructure | Light Aqua | `#A9D6CB` | `#1a5a48` (dark) |

### Accent colour usage rule
Apply accent colours **subtly** — they are highlights, not backgrounds:
- 3px accent bar at top of project/solution cards
- Badge pills: accent bg at `10–15%` opacity, accent colour text
- Section dividers and decorative lines
- Icon backgrounds at low opacity
- Hover states on CTAs within a solution page
- Never as a full-bleed section background

### Nav-specific colours
- **Over hero (dark):** `#0d1f22` base — `rgba(13,31,34,0.6)` pill
- **Scrolled/light pages:** `rgba(255,255,255,0.85)` glass pill

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

| Role | Tailwind classes | Rendered | Usage |
|---|---|---|---|
| **page-h1** | `font-display font-extrabold text-4xl leading-[1.2]` | 36px | Page hero titles (About, Contact, Projects) |
| **section-h2** | `font-display font-extrabold text-3xl leading-[1.2]` | 30px | All section headings site-wide |
| **card-h3** | `font-display font-bold text-xl leading-[1.3]` | 20px | Card titles, drawer headings, subsection titles |
| **subheading** | `font-display font-bold text-lg leading-tight` | 18px | Smaller inline headings, form section titles |
| **body** | `font-body font-normal text-base leading-[1.75]` | 16px | Main paragraph copy |
| **body-sm** | `font-body font-normal text-sm leading-[1.6]` | 14px | Secondary descriptions, card copy, step text |
| **eyebrow** | `font-body font-bold text-xs uppercase tracking-[0.14em]` | 12px | Section labels above every heading |
| **badge** | `font-body font-semibold text-xs uppercase tracking-[0.1em]` | 12px | Vertical badges, category tags, filter pills |
| **caption** | `font-body font-normal text-xs` | 12px | Dates, locations, read-time, metadata |
| **breadcrumb** | `font-body font-normal text-sm` | 14px | Page navigation breadcrumbs (all pages) |
| **quote** | `font-display font-bold text-base italic leading-[1.5]` | 16px | Pull quotes / blockquotes |
| **stat-value** | `font-display font-extrabold text-2xl leading-none` | 24px | Stats strip numbers, metric callouts |
| **stat-label** | `font-body font-normal text-xs uppercase tracking-[0.07em]` | 12px | Stats strip labels beneath values |
| **nav-link** | `font-body font-medium text-sm` | 14px | Navbar and footer navigation links |
| **button** | `font-body font-semibold text-sm` | 14px | All buttons (primary, secondary, ghost) |
| **form-label** | `font-body font-semibold text-sm` | 14px | Form field labels |
| **form-input** | `font-body font-normal text-base` | 16px | Form input text |

### Hero accordion (home page only)
The home hero uses a fluid clamp for the primary heading — this is the **only** exception to the scale above:
```css
font-size: clamp(1.75rem, 3vw, 2.75rem);  /* ~28–44px fluid */
```

### Eyebrow colour rules
- On light backgrounds: `text-[#6B7280]` (Cool Grey)
- On dark backgrounds (`#0d1f22`, `#39575C`): `rgba(255,255,255,0.35)`
- On solution pages: use the vertical's `accentText` colour

---

## Spacing & Layout

- **Max content width:** `960px` (pages), `1280px` (full-bleed sections)
- **Page horizontal padding:** `24px` mobile → `48px` tablet → `80px` desktop
- **Section vertical padding:** `py-20 md:py-32` (80px / 128px)
- **Card padding:** `16px` inner body
- **Grid gap:** `16px` cards, `24px` sections
- **Border radius:** `16px` cards, `9999px` pills/badges, `18px` featured card, `14px` nav pill

---

## Component Rules

**Every distinct UI element is a reusable TypeScript component.** Never repeat styles inline across pages.

### Component map

```
src/components/
├── ui/
│   ├── Button.tsx          — variant: 'primary' | 'secondary' | 'ghost' | 'icon'
│   ├── Badge.tsx           — accent colour badge pills for verticals
│   ├── Card.tsx            — base card with optional accent bar
│   ├── SectionLabel.tsx    — eyebrow label component
│   ├── Divider.tsx         — hairline rule with optional accent
│   ├── ProjectDrawer.tsx   — slide-in drawer, 480px, Framer Motion, focus trap
│   └── AnimatedSection.tsx — Framer Motion scroll-reveal wrapper
├── layout/
│   ├── Navbar.tsx          — glass pill nav (see specs/03-NAVIGATION.md)
│   ├── Footer.tsx          — two-row minimal footer
│   ├── PageWrapper.tsx     — max-width container + padding
│   └── SolutionsDropdown.tsx
├── sections/
│   ├── HeroAccordion.tsx
│   ├── TrustBar.tsx
│   ├── HowItWorks.tsx
│   ├── FeaturedProjects.tsx
│   ├── Testimonials.tsx
│   ├── LatestPosts.tsx
│   ├── CTABanner.tsx
│   └── ContactForm.tsx
└── solutions/
    ├── SolutionHero.tsx
    ├── SolutionBenefits.tsx
    ├── SolutionProcess.tsx
    ├── SolutionFAQ.tsx
    └── SolutionCTA.tsx
```

### TypeScript conventions

```typescript
// Props interface defined immediately above component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

// Named exports only — never default exports
export const Button = ({ variant, size = 'md', children, ...props }: ButtonProps) => { ... }
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

export const SOLUTION_META: Record<SolutionVertical, {
  label: string;
  accent: string;
  accentText: string;
  slug: string;
}> = {
  'ci-solar-storage':    { label: 'C&I Solar & Storage',       accent: '#E3C58D', accentText: '#6b4e10', slug: '/solutions/ci-solar-storage' },
  'wheeling':            { label: 'Wheeling',                   accent: '#D97C76', accentText: '#ffffff', slug: '/solutions/wheeling' },
  'energy-optimisation': { label: 'Energy Optimisation',        accent: '#709DA9', accentText: '#ffffff', slug: '/solutions/energy-optimisation' },
  'carbon-credits':      { label: 'Carbon Credits',             accent: '#9CAF88', accentText: '#2a4a18', slug: '/solutions/carbon-credits' },
  'webuysolar':          { label: 'WeBuySolar',                 accent: '#C97A40', accentText: '#ffffff', slug: '/solutions/webuysolar' },
  'ev-fleets':           { label: 'EV Fleets & Infrastructure', accent: '#A9D6CB', accentText: '#1a5a48', slug: '/solutions/ev-fleets' },
};
```

---

## Animations

All animation via **Framer Motion**.

| Pattern | Implementation |
|---|---|
| Page transitions | `AnimatePresence` + `motion.div` with `opacity` + `y` |
| Scroll reveals | `useInView` hook — fade + slide up on enter |
| Staggered children | `variants` with `staggerChildren: 0.08` on parent |
| Hover lifts | `whileHover: { y: -4 }` on cards |
| Progress bars | CSS `transition: width linear` synced to JS timer |

Standard scroll-reveal variant:
```typescript
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};
```

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
  delay?: number;       // Stagger delay seconds. Default: 0
  once?: boolean;       // Animate once only. Default: true
  threshold?: number;   // IntersectionObserver threshold. Default: 0.15
}
// Uses fadeUpVariant. Wraps children in motion.div with useInView.
```

### `prefers-reduced-motion` — mandatory

```typescript
// src/hooks/useReducedMotion.ts
export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    mq.addEventListener('change', e => setReduced(e.matches));
  }, []);
  return reduced;
};
// All Framer Motion variants: if useReducedMotion() → duration: 0
// HowItWorks + Hero auto-cycle: disabled when reduced motion on
// All CSS transitions: @media (prefers-reduced-motion: no-preference)
```

### Standardised card hover states

- **Large cards** (project, featured): `translateY(-4px)`, `box-shadow: 0 12px 32px rgba(57,87,92,0.1)`, `border-color: #cccccc`. `0.2s ease`.
- **Small cards** (blog list items, team): background shift `#F5F5F5` only. No lift. `0.15s ease`.
- **Interactive rows** (accordion headers, trust logos, nav links): background shift only.

### Page route transitions

`AnimatePresence` wraps `<main>` in `layout.tsx`. Enter: `opacity: 0→1` over `300ms`. Exit: `opacity: 1→0` over `200ms`. Keep subtle for B2B context.

### Mobile nav overlay animation

Open: `translateY(-100%) → translateY(0)` over `350ms cubic-bezier(0.4,0,0.2,1)`.
Close: `translateY(0) → translateY(-100%)` over `280ms`.
Backdrop: `opacity: 0 → 1` over `300ms`.

### Minimum tap targets

All interactive elements: minimum 44×44px touch area. If visual element is smaller, extend via padding or `::after` pseudo-element without affecting visual layout. WCAG 2.5.8.


---

## Shared Component Interfaces (Engineering Review April 2026)

### `StatsStrip.tsx`
```typescript
interface StatItem { value: string; label: string; }
interface StatsStripProps {
  stats: StatItem[];          // 2–4 items
  background?: string;        // Default: '#39575C'
  mobileColumns?: 2 | 4;     // Default: 2
}
```

### `CTABanner.tsx`
```typescript
interface CTABannerProps {
  title: string;
  subtitle: string;
  primaryLabel?: string;      // Default: 'Get in Touch'
  primaryHref?: string;       // Default: '/contact'
  secondaryLabel?: string;
  secondaryHref?: string;
  background?: 'teal' | 'dark'; // Default: 'teal'
}
```

### `VerticalBadge.tsx`
```typescript
interface VerticalBadgeProps {
  vertical: SolutionVertical;
  label?: string;             // Default: SOLUTION_META[vertical].label
  size?: 'sm' | 'md';        // sm: 9px · md: 11px
  variant?: 'filled' | 'dot-only';
}
// All accent colour logic lives here. Never inline it across specs.
```

### `ProjectCard.tsx`
```typescript
interface ProjectCardProps {
  project: Project;
  size?: 'default' | 'compact'; // compact = 130px mobile (related projects)
  onClick?: (project: Project) => void;
  showDrawer?: boolean;       // false on solution pages → direct link
}
```

### `Testimonials.tsx`
```typescript
interface Testimonial { quote: string; name: string; role: string; company: string; initials: string; avatarColor?: string; }
interface TestimonialsProps {
  eyebrow?: string;
  title: string;
  testimonials: Testimonial[];
  background?: 'white' | 'bg'; // Default: 'white'
}
```

### Updated component map (authoritative)
```
src/components/
├── ui/
│   ├── Button.tsx
│   ├── VerticalBadge.tsx        ← replaces inline accent logic everywhere
│   ├── StatsStrip.tsx           ← shared across project, about, solutions pages
│   ├── Card.tsx
│   ├── SectionLabel.tsx         ← eyebrow label
│   ├── Divider.tsx
│   ├── ProjectDrawer.tsx
│   └── AnimatedSection.tsx      ← scroll-reveal wrapper (see spec above)
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PageWrapper.tsx
│   └── SolutionsDropdown.tsx
└── sections/
    ├── HeroAccordion.tsx
    ├── HowItWorks.tsx           ← shared: home + all solution pages
    ├── FeaturedProjects.tsx     ← shared: home + solution pages (vertical prop)
    ├── Testimonials.tsx         ← shared: solution pages + about
    ├── CTABanner.tsx            ← shared: all pages
    ├── LatestPosts.tsx
    ├── SolutionHero.tsx
    ├── SolutionPain.tsx         ← interactive calculator
    ├── SolutionTabs.tsx         ← tabs (desktop) / accordion (mobile)
    ├── FinancingCards.tsx
    ├── ContactForm.tsx
    ├── AboutStory.tsx
    ├── AboutMission.tsx
    ├── AboutValues.tsx
    ├── AboutTimeline.tsx
    ├── AboutTeam.tsx
    ├── AboutTrust.tsx
    └── CareersBand.tsx
```


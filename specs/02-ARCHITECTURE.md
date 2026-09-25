# 02 — Architecture & Stack
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0
> **Updated 2026-09-24:** corrected to match the build. It runs Next.js 16 and Tailwind v4 with tokens in `src/app/globals.css` (there is no `tailwind.config.ts`) and has ten Sanity schema types. The loading skeletons, page transitions and `useMediaQuery` hook were removed in September 2026.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19 | Pages are static with hourly ISR (`revalidate = 3600`); `/blog` reads `searchParams`, so it renders per request. `params` and `searchParams` are Promises |
| Language | TypeScript | Strict mode — all components, hooks, utilities fully typed |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) | Tokens in `@theme static` in `src/app/globals.css`; no `tailwind.config.ts` and no CSS Modules |
| Animations | Framer Motion | Scroll reveals, the navbar menus and CTA hover, the home hero accordion, count-up stats, floating orbs, tab and filter changes and the EV fleet estimator, under `MotionConfig reducedMotion="user"` in `SiteShell`; no page transitions |
| CMS | Sanity (free tier) | Ten schema types: projects, blog posts, authors, team members, timeline, partners, company stats, How It Works, hero images, EV energy prices |
| Display Font | Plus Jakarta Sans | H1–H4, logo — weights 700, 800 via `next/font/google` |
| Body Font | Inter | Body copy, UI — weights 400, 500, 600 via `next/font/google` |
| Icons | Custom inline SVGs in `src/components/ui/Icons.tsx` | Outline style, 2.5 stroke, rounded caps and joins; `lucide-react` is used only for the two Zap icons on the desktop navbar CTA |
| Email | Resend | Contact form → `info@phoenixenergy.solutions` |
| Deployment | Vercel + GitHub CI/CD | Auto-deploy on push to `main` |
| Analytics | GA4 + Google Tag Manager | GTM container in `layout.tsx` via `next/script` |

---

## File Structure

```
phoenix-energy/
├── CLAUDE.md                        ← Hub
├── specs/                           ← All spoke documents
├── docs/                            ← Audits, plans, legal drafts and content notes; the claims register is docs/content/claims-register.md
├── scripts/                         ← seedHeroImages.mjs, seedHowItWorks.mjs
├── src/
│   ├── app/                         ← Next.js App Router
│   │   ├── layout.tsx               ← Root layout: fonts, GTM, Organization JSON-LD, WebVitals, ScrollDepth; shows the blog nav link once 3 posts exist
│   │   ├── globals.css              ← Tailwind v4 import, @theme static tokens, base styles, custom utilities
│   │   ├── _components/WebVitals.tsx ← Pushes Web Vitals to the dataLayer
│   │   ├── page.tsx                 ← Home
│   │   ├── about/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx             ← Projects portfolio
│   │   │   └── [slug]/page.tsx      ← Single project case study
│   │   ├── solutions/
│   │   │   ├── page.tsx             ← Solutions overview
│   │   │   ├── ci-solar-storage/page.tsx
│   │   │   ├── wheeling/page.tsx
│   │   │   ├── energy-optimisation/page.tsx
│   │   │   ├── carbon-credits/page.tsx
│   │   │   ├── webuysolar/page.tsx
│   │   │   └── ev-fleets/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   └── authors/[slug]/page.tsx
│   │   ├── tools/
│   │   │   ├── page.tsx
│   │   │   └── solar-valuation/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── terms-of-use/page.tsx
│   │   ├── disclaimer/page.tsx
│   │   ├── studio/[[...tool]]/page.tsx ← Embedded Sanity Studio
│   │   ├── api/
│   │   │   ├── contact/route.ts     ← Contact form and valuation request: reCAPTCHA check, Zod, Resend
│   │   │   └── revalidate/route.ts  ← Sanity webhook: revalidatePath per document type
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/                  ← See specs/01-BRAND.md for full map
│   │   └── layout/SiteShell.tsx     ← Skip link, Navbar, main, SiteFooter; renders none of them on /studio
│   ├── config/                      ← CTAs, contact details, claims register (claims.ts), privacy notice, vertical SEO, page content
│   ├── emails/                      ← React Email templates: ContactEmail, WeBuySolarEmail
│   ├── hooks/                       ← useReducedMotion, useScrollReveal, useModalDialog, useDebouncedAnnouncement
│   ├── lib/
│   │   ├── sanity.ts                ← Public Sanity client and urlFor()
│   │   ├── sanity.server.ts         ← Server-only client: API token, no CDN, published documents only
│   │   ├── queries.ts               ← GROQ query library
│   │   ├── utils.ts                 ← cn(), formatDate(), formatRand(), estimateReadTime()
│   │   └── …                        ← analytics.ts, recaptcha.ts, contactLink.ts, projectResults.ts, validators/, calculator logic, Sanity fetch helpers
│   └── types/
│       ├── solutions.ts             ← SolutionVertical, SOLUTION_META
│       ├── sanity.ts                ← Project, BlogPost, TeamMember and the other document types
│       └── recaptcha.d.ts
├── sanity/
│   └── schemaTypes/                 ← project, blogPost, author, teamMember, milestoneTimeline, partner, companyStats, howItWorks, heroImages, energyPrices, index.ts
├── sanity.config.ts                 ← Studio config, at the repo root
├── public/                          ← logo.png, inverted-logo.png, og-default.png, og-solutions-*.png, proof/ (IndustryProofCard photos), five unused create-next-app SVGs
├── postcss.config.mjs               ← @tailwindcss/postcss; there is no tailwind.config.ts
├── next.config.ts
├── tsconfig.json                    ← Strict mode
└── .env.local                       ← Environment variables
```

---

## Tailwind Config

There is no `tailwind.config.ts`. Tailwind v4 reads the brand tokens from the `@theme static` block in `src/app/globals.css` (full list in `specs/01-BRAND.md`), which generates the `bg-pe-*`, `text-pe-*`, `border-pe-*`, `font-display`, `font-body`, `rounded-card`, `rounded-featured` and `rounded-nav` utilities. `static` emits every variable, so inline styles can use `var(--color-…)` as well. Differences from the April config:

- `pe-muted` is `#646B78` (was `#6B7280`).
- New tokens: `pe-primary-hover`, `pe-text-soft`, `pe-secondary-ink`, `pe-error`, the `on-dark` text tokens, and an `-ink` (text on light) and `-on` (text on a solid fill) pair for each accent.
- `max-w-content` (960px) and `max-w-wide` (1280px) are custom utilities in `@layer utilities` in the same file, and `.page-container` is the section wrapper at the wide width.

---

## Deployment Pipeline

```
Developer → feature branch
              ↓
         GitHub PR → Vercel preview deploy (auto)
              ↓
         PR approved + merged to main
              ↓
         Vercel production deploy (auto)
              ↓
         phoenixenergy.solutions (Vercel DNS)
```

### Branch strategy
- `main`: production, protected branch.
- `feat/[name]` and `fix/[name]`: branch off `main` and merge back into `main`. There is no `dev` branch.

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX       # not read by the code: the site loads GTM only, so GA4 is set up inside the GTM container
RESEND_API_KEY=re_xxxxxxxxxxxx
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=      # reCAPTCHA v3 site key (src/lib/recaptcha.ts)
RECAPTCHA_SECRET_KEY=                # server-side token check in /api/contact
REVALIDATE_SECRET=                   # Bearer token the Sanity webhook sends to /api/revalidate
```

---

## Performance Targets

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| CLS | < 0.1 |
| FID | < 100ms |
| Lighthouse score | > 90 all categories |

Key practices:
- `next/image` with `placeholder="blur"` on all above-fold images
- `next/font` for zero CLS font loading
- Static generation (`generateStaticParams`) for all `[slug]` routes
- ISR (`revalidate: 3600`) for Sanity-powered pages

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md)*

---

## Additional Files Required (Engineering Review April 2026)

### `next.config.ts`
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],   // AVIF where supported, else WebP
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async redirects() {
    return [
      // The Chepstow Properties case study was renamed to its street address.
      { source: '/projects/logistics-warehouse-chepstow-properties', destination: '/projects/31-sacks-circle', permanent: true },
    ];
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ],
    }];
  },
};

export default nextConfig;
```

### Route loading states — `loading.tsx`
Removed in September 2026. There are no route `loading.tsx` files and no skeleton screens, and nothing replaced them. The `.shimmer` keyframes and class are still in `src/app/globals.css` but no component uses them.

### `src/app/not-found.tsx`
Full-screen Night Teal (`#0d1f22`) page: eyebrow "404", H1 "Page not found", one line of body copy, then "Back to home" and "Explore solutions" (`/solutions`). Its metadata sets `noindex`.

### `src/app/error.tsx`
A light `#F5F5F5` page, not the 404 pattern: eyebrow "Something went wrong", H1 "An error occurred", then a "Try again" button (calls `reset()`) and a "Go to home" link. It logs the error to the console.

### `src/hooks/useReducedMotion.ts`
See `01-BRAND.md` animation section.

### `src/hooks/useMediaQuery.ts`
Removed in September 2026. Components render every layout on the server and switch between them with Tailwind breakpoints; for example, `SolutionTabs` renders its tab layout at `lg` and up and its accordion below `lg`. `matchMedia` is used only to read `prefers-reduced-motion` (`useReducedMotion` and `SolutionTabs`).

### `src/app/api/contact/route.ts` — unified payload type
```typescript
// src/lib/validators/contact.ts: Zod schemas (contactSchema, webBuySolarSchema); the types are inferred
type ContactInput = {
  intent: 'client' | 'partner' | 'investor';
  firstName: string; lastName: string; email: string; phone: string;
  company: string; location: string; message?: string; recaptchaToken: string;
};
type WeBuySolarInput = {
  intent: 'webuysolar';
  firstName: string; lastName?: string; email: string; phone?: string;
  valuation: {                       // every answer from the valuation request
    kw: number; bessKwh: number; installYear: number; province: string;
    inverterType?: string; inverterKw?: number; panelBrand?: string; inverterBrand?: string;
    batteryBrand?: string; batteryChemistry?: string; batteryHealth?: string;
    condition?: string; monitoring?: string; documentation?: string;
  };
  recaptchaToken?: string;
};
type ContactPayload = ContactInput | WeBuySolarInput;
```
One route handler. When `RECAPTCHA_SECRET_KEY` is set it checks reCAPTCHA first: a missing token returns `recaptcha-missing` and a rejected one `recaptcha-failed` (both 400), while a low score (under 0.5) is accepted and flagged in the email subject. It then parses with `webBuySolarSchema` when `intent` is `'webuysolar'` and `contactSchema` otherwise, and sends a React Email template through Resend.

### Mobile input font size
In `src/app/globals.css`: `@media (max-width: 768px) { input, textarea, select { font-size: 16px !important; } }`. This stops iOS Safari zooming in when a field gets focus.

### Touch carousel behaviour
Only the About timeline snaps, and only on phones (`[scroll-snap-type:x_mandatory]`, turned off from `md`). The project and article rows (`SectionCarousel`), filter pills and tab strips scroll freely. The `.scroll-snap-x` utility is still in `src/app/globals.css` but unused.


---

## SEO Infrastructure (Engineering Review April 2026)

### `src/app/sitemap.ts`
Revalidates hourly. Entries (priority, change frequency):
- Static: `/` (1.0, weekly); `/about` and `/contact` (0.8, monthly); `/solutions` (0.9, monthly); the six solution pages (0.8, monthly); `/projects` (0.8, weekly); `/tools` and `/tools/solar-valuation` (0.7, monthly); `/privacy-policy`, `/terms-of-use` and `/disclaimer` (0.3, yearly).
- Blog: `/blog` (0.8, weekly) only once a post is published (updated September 2026; until then it is `noindex`), then every `blogPost` (0.7, weekly), with `lastModified` taken from `publishedAt`.
- Projects: case studies only (0.7, monthly), meaning `CASE_STUDY_READY` from `src/lib/queries.ts` (challenge, solution and outcome all written). Any other project page is `noindex`, so it is left out.

### `src/app/robots.ts`
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] }],
    sitemap: 'https://phoenixenergy.solutions/sitemap.xml',
  };
}
```

### `Organization` JSON-LD — inject in `layout.tsx`
```typescript
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Phoenix Energy',
  url: 'https://phoenixenergy.solutions',
  logo: 'https://phoenixenergy.solutions/logo.png',
  email: 'info@phoenixenergy.solutions',
  contactPoint: { '@type': 'ContactPoint', telephone: '+27-79-892-8197', contactType: 'sales', areaServed: 'ZA' },
  sameAs: ['https://www.linkedin.com/company/105465145'],
};
```

### `WebSite` JSON-LD with SearchAction — inject in `src/app/page.tsx`
The site search is the blog search, so the `SearchAction` is included only once a post is published (updated September 2026). While there are none, `/blog` is also `noindex, follow` and left out of the sitemap (`specs/10-BLOG.md`).
```typescript
function websiteJsonLd(hasPosts: boolean) {   // hasPosts: PUBLISHED_POSTS_COUNT_QUERY > 0
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Phoenix Energy',
    url: 'https://phoenixenergy.solutions',
    ...(hasPosts && {
      potentialAction: { '@type': 'SearchAction',
        target: 'https://phoenixenergy.solutions/blog?q={search_term_string}',
        'query-input': 'required name=search_term_string' },
    }),
  };
}
```

### Blog pagination SEO — chosen approach: Option A (SSR paginated)
Route: `/blog?page=2`. The page awaits `searchParams`, so `/blog` renders per request, not statically.
`generateMetadata` sets the canonical (`/blog`, or `/blog?page=N` from page 2) and puts `prev` and `next` inside `alternates`, only where that page exists and keeping `category` and `tag`. Next.js 16 reads only `canonical`, `languages`, `media` and `types` from `alternates`, so no `<link rel="prev">` or `<link rel="next">` tag is rendered today (Next.js renders those from the `pagination: { previous, next }` field). The visible Prev and Next buttons follow the same rules.
Default page size: 6 posts. First page has no `?page=` param.

### Revalidation webhook: nine of the ten document types
```typescript
// src/app/api/revalidate/route.ts (POST from the Sanity webhook)
// Needs the header Authorization: Bearer ${REVALIDATE_SECRET}; anything else gets 401.
// Handles: blogPost     → /blog/[slug], /blog, /
//          author       → /blog/authors/[slug]
//          project      → /projects/[slug], /projects, /
//          teamMember   → /about
//          partner      → /about, /
//          companyStats → /, /about
//          howItWorks   → / for the "home" document, else /solutions/{key} from the document id
//          heroImages   → /, /solutions and the six solution pages
//          energyPrices → /solutions/ev-fleets
// Not handled: milestoneTimeline. Timeline edits reach /about with the hourly ISR refresh.
```

### `alt` text policy
Every `next/image` and `<img>` sets `alt`; decorative images use `alt=""`. As built:
- Project cards (`ProjectCard`), the home hero accordion, gallery thumbnails, the footer watermark, the logo mark beside the wordmark and the author avatar beside the name in a post header: `alt=""`.
- Case study heroes and the featured project card: the image's `alt` from Sanity, or the project title. Gallery lightbox images: the image's `alt`, or "Project photo N".
- Blog heroes and article cards: the image's `alt`, or the post title.
- Solution page heroes and the `/solutions` cards: the vertical's name.
- Team photos: the member's name. Other author photos: the author's name. Partner logos: the logo's `alt`, or the partner name. Industry proof photos: the given alt, or the client name.
- No image sets `role="presentation"`.

Never use a filename as alt text. `eslint-config-next` turns on `jsx-a11y/alt-text` as a warning for `img` and `Image`; it flags a missing `alt` but does not check the wording.


---

## Missing Page Specs (Engineering Review April 2026)

### `/solutions` — Solutions overview page
Route: `src/app/solutions/page.tsx`

```
[Navbar]
[Night Teal hero with FloatingOrbs: breadcrumb Home / Solutions, eyebrow "Our Solutions",
 H1 "Every energy challenge, solved", subtitle, "Book a discovery meeting" + "Explore solutions" (#solutions)]
[6-vertical grid: 3 columns at lg, 2 at md, 1 on phones]
[Footer; there is no CTA band on this page]
```

Each vertical card:
- A dark `Card` (pattern 1, no hover overlay) linking to `/solutions/[vertical]`; it lifts 4px with a shadow on hover.
- Image: the vertical's hero image from Sanity (`heroImages`), 180px tall, with the vertical's name as `alt`.
- Body: the vertical's SEO description from `src/config/verticals.ts`, cut to three lines, then two stats from the claims register with the value in the accent colour.
- Footer: an "Explore {vertical}" pill in the accent colour.

### `/tools` — Tools index page
Route: `src/app/tools/page.tsx`

```
[Navbar]
[Breadcrumb: Home / Tools]
[Page header: eyebrow "Tools & Resources", H1 "Make smarter energy decisions", subtitle]
[One tool card: Solar Valuation Request, in a 1, 2 or 3 column grid]
[Company CTA band (PageFooter, `centered` variant)]
[Footer]
```

Tool card:
- A dark gradient header with a "WeBuySolar" badge and the title "Solar Valuation Request", over a white body with the description, three feature chips (Solar & battery, Team-reviewed, No obligation) and "Request a valuation", linking to `/tools/solar-valuation`.
- It lifts 5px with a shadow on hover.

Coming soon cards: not built. The page lists only the valuation request.


### Form error states — canonical spec (applies to /contact and /tools/solar-valuation)
As built in `ContactForm.tsx`, `Step1SystemDetails.tsx`, `Step3Capture.tsx`, `NumberField.tsx` and `SendFailureNotice.tsx`:

- **Invalid field:** `border-2 border-pe-error` (`#C0392B`) and `aria-invalid`, with the message below in `text-pe-error`: 14px on `/contact`, 12px in the valuation request.
- **Validation timing:** validation runs on submit (Zod `contactSchema` on `/contact`; a first name and email check in the valuation request's contact step) or when the visitor presses Next in the valuation request's step 1, and focus moves to the first invalid field. On `/contact` and in the valuation contact step, a field's error clears as soon as it is edited; in step 1 the size errors re-check as the visitor types. Nothing validates on blur.
- **Send failures:** `SendFailureNotice` (`role="alert"`) sits above the submit button, with a `rgba(227,197,141,0.12)` fill, a `rgba(227,197,141,0.3)` border, a 12px radius and 14px text in `--color-accent-solar-on` (`#5E430C`). It shows one of three messages, then "You can also email info@phoenixenergy.solutions or call +27 79 892 8197."
  - `recaptcha-missing`: "We couldn't run our spam check, which some browser extensions block. Nothing was sent."
  - `recaptcha-failed`: "Our spam check didn't go through, so nothing was sent. Please try again."
  - `send-failed`: "Your message didn't send. Your details are still here, so you can try again."


---

## Team Member CMS Integration (April 2026)

### AboutTeam component — updated interface

```typescript
// src/components/sections/AboutTeam.tsx
interface AboutTeamProps {
  members: TeamMember[];   // Fetched server-side, passed as prop. Never fetched client-side.
}

// Filter tabs come from a fixed list in AboutTeam.tsx (ALL_CATS): All, Founders, Business, Technical.
// A tab shows only when a member has that category; TEAM_MEMBERS_QUERY returns active members only.
// A new category needs a code change: the schema's options list, the TeamCategory type and ALL_CATS.

// "Join the journey" card: always last item, static — not from CMS.
```

### Sanity Studio — teamMember document actions
Editors can:
- **Add** a new team member → webhook fires → `/about` revalidates within seconds
- **Edit** name, role, photo, archetype, bio, LinkedIn → same revalidation
- **Deactivate** by setting `active: false` → member hidden without record deletion
- **Reorder** by changing the `order` number → reflected immediately on next revalidation

### Sanity Studio — recommended field order in Studio UI
1. Photo (first — visual confirmation they're editing the right person)
2. Name
3. Role
4. Category
5. Archetype
6. Order
7. Active (toggle)
8. LinkedIn
9. Bio (last — least frequently edited)

This ordering should be set in `defineField` array order within the schema definition. The schema follows it, with one extra field, `slug` (its source is the name), between LinkedIn and Bio.

### Image handling
`photo` uses `hotspot: true`, so Sanity Studio shows the hotspot and crop tools, and `TEAM_MEMBERS_QUERY` returns `hotspot` and `crop`. The site does not apply them: `AboutTeam` passes `member.photo.asset.url` (the original image) to `CardImage`, which fills a 3:4 frame with `object-cover`, so every photo is cropped around its centre whatever focal point the editor marks. The photo's `alt` field is not used either; the card sets `alt` to the member's name.

```typescript
// As built in AboutTeam.tsx. CardImage wraps next/image with fill, object-cover and placeholder="blur".
<CardImage
  src={member.photo?.asset.url}
  alt={member.name}
  aspectRatio="3 / 4"
  blurDataURL={member.photo?.asset.metadata?.lqip}
  sizes="(max-width: 768px) 100vw, 320px"
/>
```


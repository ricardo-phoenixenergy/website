# 02 — Architecture & Stack
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSG + ISR for performance |
| Language | TypeScript | Strict mode — all components, hooks, utilities fully typed |
| Styling | Tailwind CSS + CSS Modules | Tailwind for layout/utilities; CSS Modules for bespoke components |
| Animations | Framer Motion | Page transitions, scroll reveals, micro-interactions |
| CMS | Sanity (free tier) | Blog posts + Projects/Portfolio content |
| Display Font | Plus Jakarta Sans | H1–H4, logo — weights 700, 800 via `next/font/google` |
| Body Font | Inter | Body copy, UI — weights 400, 500, 600 via `next/font/google` |
| Icons | Lucide React | Outline style, 2px stroke, rounded caps |
| Email | Resend | Contact form → `info@phoenixenergy.solutions` |
| Deployment | Vercel + GitHub CI/CD | Auto-deploy on push to `main` |
| Analytics | GA4 + Google Tag Manager | GTM container in `layout.tsx` via `next/script` |

---

## File Structure

```
phoenix-energy/
├── CLAUDE.md                        ← Hub
├── specs/                           ← All spoke documents
├── src/
│   ├── app/                         ← Next.js App Router
│   │   ├── layout.tsx               — Root layout: fonts, GTM, Navbar, Footer
│   │   ├── page.tsx                 — Home
│   │   ├── about/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx             — Projects portfolio
│   │   │   └── [slug]/page.tsx      — Single project case study
│   │   ├── solutions/
│   │   │   ├── page.tsx             — Solutions overview
│   │   │   ├── ci-solar-storage/page.tsx
│   │   │   ├── wheeling/page.tsx
│   │   │   ├── energy-optimisation/page.tsx
│   │   │   ├── carbon-credits/page.tsx
│   │   │   ├── webuysolar/page.tsx
│   │   │   └── ev-fleets/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── tools/
│   │   │   ├── page.tsx
│   │   │   └── solar-asset-valuation/page.tsx
│   │   └── api/
│   │       └── contact/route.ts     — Resend email handler
│   ├── components/                  ← See specs/01-BRAND.md for full map
│   ├── lib/
│   │   ├── sanity.ts                — Sanity client config
│   │   ├── queries.ts               — GROQ query library
│   │   └── utils.ts                 — cn(), formatDate(), etc.
│   ├── types/
│   │   ├── solutions.ts             — SolutionVertical, SOLUTION_META
│   │   └── sanity.ts                — Project, BlogPost, TeamMember types
│   └── styles/
│       └── globals.css              — CSS variables, base resets
├── sanity/
│   ├── schemaTypes/
│   │   ├── project.ts
│   │   ├── blogPost.ts
│   │   └── solution.ts
│   └── sanity.config.ts
├── public/
│   └── assets/                      — Static images, logo SVG
├── tailwind.config.ts               — Brand tokens
├── tsconfig.json                    — Strict mode
└── .env.local                       — Environment variables
```

---

## Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'pe-bg':           '#F5F5F5',
        'pe-primary':      '#39575C',
        'pe-secondary':    '#709DA9',
        'pe-text':         '#1A1A1A',
        'pe-muted':        '#6B7280',
        'pe-border':       '#E5E7EB',
        'pe-card':         '#FFFFFF',
        'pe-nav-dark':     '#0d1f22',
        // Vertical accents
        'accent-solar':    '#E3C58D',
        'accent-wheeling': '#D97C76',
        'accent-optim':    '#709DA9',
        'accent-carbon':   '#9CAF88',
        'accent-wbs':      '#C97A40',
        'accent-ev':       '#A9D6CB',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
      },
      borderRadius: {
        'card':     '16px',
        'featured': '18px',
        'nav':      '14px',
      },
      maxWidth: {
        'content': '960px',
        'wide':    '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
```

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
- `main` — production, protected branch
- `dev` — staging / integration
- `feature/[name]` — individual feature branches, PR into `dev`

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
RESEND_API_KEY=re_xxxxxxxxxxxx
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skxxxxxxxxxxxxxxxx
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

### `next.config.js`
```javascript
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },
};
```

### Route loading states — `loading.tsx`
Required for: `/projects/loading.tsx`, `/blog/loading.tsx`, `/solutions/[vertical]/loading.tsx`.
UI: skeleton cards matching actual card dimensions. Shimmer animation:
`background: linear-gradient(90deg, #E5E7EB 25%, #F5F5F5 50%, #E5E7EB 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;`

### `src/app/not-found.tsx`
Deep Teal hero, "Page not found", back to home + solutions links.

### `src/app/error.tsx`
Same pattern, different copy: "Something went wrong", retry button + home link.

### `src/hooks/useReducedMotion.ts`
See `01-BRAND.md` animation section.

### `src/hooks/useMediaQuery.ts`
```typescript
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
};
```

### `src/app/api/contact/route.ts` — unified payload type
```typescript
type ContactPayload =
  | { intent: 'client'|'partner'|'investor'; firstName: string; lastName: string; email: string; phone: string; company: string; location: string; message?: string; recaptchaToken: string; }
  | { intent: 'webuysolar'; firstName: string; lastName: string; email: string; phone: string; valuation: ValuationResult; recaptchaToken: string; };
```
Single route handler, discriminated union on `intent`.

### Mobile input font size
In `src/styles/globals.css`: `@media (max-width: 768px) { input, textarea, select { font-size: 16px !important; } }` — prevents iOS Safari auto-zoom on focus.

### Touch carousel behaviour
All horizontal scroll containers:
```css
-webkit-overflow-scrolling: touch;
scroll-snap-type: x mandatory;
& > * { scroll-snap-align: start; }
```


---

## SEO Infrastructure (Engineering Review April 2026)

### `src/app/sitemap.ts`
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjectSlugs();
  const posts = await getAllBlogSlugs();
  const staticPages = ['/', '/about', '/contact', '/projects', '/blog', '/tools',
    '/solutions/ci-solar-storage', '/solutions/wheeling', '/solutions/energy-optimisation',
    '/solutions/carbon-credits', '/solutions/webuysolar', '/solutions/ev-fleets'];
  return [
    ...staticPages.map(url => ({ url: `https://phoenixenergy.solutions${url}`, changeFrequency: 'monthly' as const, priority: url === '/' ? 1.0 : 0.8 })),
    ...projects.map(s => ({ url: `https://phoenixenergy.solutions/projects/${s}`, changeFrequency: 'yearly' as const, priority: 0.7 })),
    ...posts.map(s => ({ url: `https://phoenixenergy.solutions/blog/${s}`, changeFrequency: 'weekly' as const, priority: 0.6 })),
  ];
}
```

### `src/app/robots.ts`
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
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
  contactPoint: { '@type': 'ContactPoint', telephone: '+27-79-892-8197', contactType: 'sales', areaServed: 'ZA' },
  sameAs: ['https://www.linkedin.com/company/105465145'],
};
```

### `WebSite` JSON-LD with SearchAction — inject in `src/app/page.tsx`
```typescript
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Phoenix Energy',
  url: 'https://phoenixenergy.solutions',
  potentialAction: { '@type': 'SearchAction',
    target: 'https://phoenixenergy.solutions/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string' },
};
```

### Blog pagination SEO — chosen approach: Option A (SSR paginated)
Route: `/blog?page=2`. Each page statically generated via searchParams.
Add `<link rel="prev">` / `<link rel="next">` via Next.js `alternates` metadata.
Default page size: 6 posts. First page has no `?page=` param.

### Revalidation webhook — extended to cover all document types
```typescript
// src/app/api/revalidate/route.ts
// Handles: blogPost → revalidate /blog + /blog/[slug]
//          project  → revalidate /projects + /projects/[slug] + /
//          teamMember → revalidate /about
//          author   → revalidate /blog/authors/[slug]
```

### `alt` text policy
Every `next/image` must have a meaningful `alt` prop.
- Project images: `{project.title} — {project.location}`
- Team photos: `{name}, {role}, Phoenix Energy`
- Hero images: describe the scene in plain language
- Purely decorative: `alt=""` + `role="presentation"`
Never use filename as alt text. Enforced via ESLint `jsx-a11y/alt-text` rule.


---

## Missing Page Specs (Engineering Review April 2026)

### `/solutions` — Solutions overview page
Route: `src/app/solutions/page.tsx`

```
[Navbar — light glass pill]
[Breadcrumb — Home / Solutions]
[Page header — eyebrow "OUR SOLUTIONS" + H1 "Six verticals. One partner." + subtitle]
[6-vertical grid — 3×2 desktop, 2×3 tablet, 1×6 mobile]
[CTA banner — "Not sure which solution fits? Let's talk."]
[Footer]
```

Each vertical card:
- `background: #fff`, `border-radius: 16px`, `border: 1px solid #E5E7EB`, `padding: 24px`
- `3px accent bar` top, accent colour from `SOLUTION_META`
- Vertical name: Plus Jakarta Sans 700, 15px
- One-liner: Inter 400, 12px, muted
- Arrow link: `→ Learn more` in accent colour
- Hover: `translateY(-4px)` + accent `border-color`
- Links to `/solutions/[vertical]`

### `/tools` — Tools index page
Route: `src/app/tools/page.tsx`

```
[Navbar — light glass pill]
[Breadcrumb — Home / Tools]
[Page header — eyebrow "FREE TOOLS" + H1 "Energy tools for smarter decisions"]
[Featured tool card — Solar Asset Valuation]
[Coming soon placeholder card × 2]
[Footer]
```

Featured tool card:
- Full-width, Deep Teal bg, `border-radius: 16px`, `padding: 32px`
- Eyebrow: `WEBUYSOLAR TOOL`, title, description, CTA → `/tools/solar-asset-valuation`

Coming soon cards:
- `background: #F5F5F5`, `border: 1px dashed #E5E7EB`, `border-radius: 16px`, `padding: 24px`
- Label: `Coming soon`, muted title (e.g. "Energy ROI Calculator", "Wheeling Feasibility Tool")


### Form error states — canonical spec (applies to /contact and /tools/solar-valuation)
```css
/* Invalid field */
border: 1.5px solid #E05C5C;

/* Error message */
font-size: 12px;
color: #E05C5C;
margin-top: 4px;
display: block;
```

**reCAPTCHA failure banner** (above submit button):
```css
background: rgba(227,197,141,0.12);
border: 1px solid rgba(227,197,141,0.3);
border-radius: 10px;
padding: 10px 14px;
font-size: 12px;
color: #6b4e10;
margin-bottom: 12px;
```
Copy: *"We couldn't verify you're not a robot. Please try again."*

**Network error banner** (same style):
Copy: *"Something went wrong. Please try again or email us at info@phoenixenergy.solutions."*

**Validation timing:** Validate on blur (field loses focus), not on keystroke. Re-validate on submit attempt. Clear error as soon as field becomes valid again.


---

## Team Member CMS Integration (April 2026)

### AboutTeam component — updated interface

```typescript
// src/components/sections/AboutTeam.tsx
interface AboutTeamProps {
  members: TeamMember[];   // Fetched server-side, passed as prop. Never fetched client-side.
}

// Filter categories derived from members data — never hardcoded:
// const categories = ['all', ...new Set(members.map(m => m.category))] as const
// Tabs only render for categories that have at least one active member.

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

This ordering should be set in `defineField` array order within the schema definition.

### Image handling
`photo` uses `hotspot: true` so Sanity Studio shows the hotspot/crop UI. This means editors can mark the focal point (face) on upload and `next/image` will always crop to show the face regardless of the rendered aspect ratio.

```typescript
// In next/image usage:
<Image
  src={urlFor(member.photo).width(400).height(400).fit('crop').crop('focalpoint').url()}
  alt={member.photo.alt ?? `${member.name}, ${member.role}, Phoenix Energy`}
  fill
  style={{ objectFit: 'cover' }}
/>
```


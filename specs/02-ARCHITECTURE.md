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
│   │   │   └── [slug]/page.tsx      ← Single project page
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
│   │   ├── seo.ts                   ← pageMetadata(), the site constants and DEFAULT_SHARE_IMAGE
│   │   ├── structuredData.ts        ← organizationJsonLd(), websiteJsonLd(), serviceJsonLd(), breadcrumbJsonLd()
│   │   ├── sanityShareImage.ts      ← a Sanity photo as a share image or an Article image, cropped and served as a JPEG
│   │   ├── blogSeo.ts               ← a blog post's and an author page's structured data, and the blog index's canonical path
│   │   ├── utils.ts                 ← cn(), formatDate(), formatRand(), estimateReadTime()
│   │   └── …                        ← analytics.ts, recaptcha.ts, contactLink.ts, projectResults.ts, projectSeo.ts, validators/, calculator logic, Sanity fetch helpers
│   └── types/
│       ├── solutions.ts             ← SolutionVertical, SOLUTION_META
│       ├── sanity.ts                ← Project, BlogPost, TeamMember and the other document types
│       └── recaptcha.d.ts
├── sanity/
│   └── schemaTypes/                 ← project, blogPost, author, teamMember, milestoneTimeline, partner, companyStats, howItWorks, heroImages, energyPrices, index.ts
├── sanity.config.ts                 ← Studio config, at the repo root
├── public/                          ← logo.png, inverted-logo.png, og-default.png (stays a PNG), og-solutions-*.jpg, proof/ (IndustryProofCard photos), five unused create-next-app SVGs
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
      // The warehouse project was renamed to its street address.
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
Full-screen Night Teal (`#0d1f22`) page: eyebrow "404", H1 "Page not found", one line of body copy, then "Back to home" (`Button` light, starting with a left arrow) and "Explore solutions" (`/solutions`, `Button` ghost, ending with an arrow), both at the default 48px size. Its metadata sets `noindex`.

### `src/app/error.tsx`
A light `#F5F5F5` page, not the 404 pattern: eyebrow "Something went wrong", H1 "An error occurred", then a "Try again" button (`Button` primary, calls `reset()`, starting with `IconRefresh`) and a "Go to home" link (`Button` outline, ending with an arrow: on a light page the second button is outline, never ghost), both at the default 48px size. It logs the error to the console.

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

### Search and sharing tags
Every page builds its title, meta description, canonical, Open Graph and Twitter tags with `pageMetadata()` (`src/lib/seo.ts`), never with its own `openGraph` or `twitter` block. Next.js replaces the root layout's `openGraph` and `twitter` objects with a page's own rather than merging them, so a page that set only a title and an image used to lose the site name, the locale and the type; `pageMetadata()` rebuilds the full set every time, and every URL it returns is absolute. A page passes a title, an optional description (a page with none gets none, never another page's), its path, and, where they differ from the page title and description, a sharing title and description; it can also mark the page `noindex`, add `pagination` links, or make it an Open Graph article with its dates, authors and tags.

A page without its own image falls back to `DEFAULT_SHARE_IMAGE`: `og-default.png`, 1200 by 630, alt text naming the logo and the line "Powering Africa's energy transition." It stays a PNG, sharper than a JPEG for a flat graphic at 63KB. `src/lib/sanityShareImage.ts` builds a share image from a Sanity photo instead, cropped around its hotspot to 1200 by 630 and served as a JPEG (`sanityShareImage()`), or in the three shapes Google recommends for an Article's image, 16:9, 4:3 and 1:1, 1200px wide (`sanityArticleImages()`). A JPEG loads lighter than the PNG originals did, over 1MB for some, and keeps link previews that skip large images, WhatsApp's among them, from dropping the photo. A photo without alt text falls back to the title passed in.

`src/app/pageMetadata.test.ts` is a guard test: it reads every `page.tsx` under `src/app` and fails if one builds its own `openGraph` or `twitter` block instead of calling `pageMetadata()`. The Studio's page is exempt, since its metadata lives in `src/app/studio/layout.tsx`.

`next.config.ts` sets `htmlLimitedBots: /.*/`. By default Next.js streams a page's metadata into the body after the initial render, and blocks on it, in the head, only for requests it recognises as bots that can't run scripts; `htmlLimitedBots` widens that recognition to every request, so metadata never streams and always sits in the head, for AI crawlers such as GPTBot, ClaudeBot and PerplexityBot as much as for a browser. `/blog` is the only page built per request, so it is the one page with a slightly later first byte as a result. Revisit before turning on Cache Components: with it on, every request this pattern matches skips the prerendered shell, and `/.*/` matches every visitor.

The Studio's own layout (`src/app/studio/layout.tsx`) sets `robots: { index: false, follow: false }`, because its page is a client component and can't export `metadata` itself. The root layout's `robots` block covers every other page by default: `index: true, follow: true`, with a `googleBot` entry adding `max-image-preview: large` (Google Discover requires it) and unlimited snippet and video preview lengths.

`src/app/icon.png` and `src/app/apple-icon.png` are Next.js file-based icons, added alongside `src/app/favicon.ico`, which stays and is still linked first: Next serves all three as the favicon and the Apple touch icon without extra markup. The Apple touch icon has a white background, since iOS fills any transparency with black.

### `src/app/sitemap.ts`
Revalidates hourly, and at once when the webhook (`src/app/api/revalidate/route.ts`) reports a blog post, author or project change. Entries (priority, change frequency):
- Static: `/` (1.0, weekly); `/about` and `/contact` (0.8, monthly); `/solutions` (0.9, monthly); the six solution pages (0.8, monthly); `/projects` (0.8, weekly); `/tools` and `/tools/solar-valuation` (0.7, monthly); `/privacy-policy`, `/terms-of-use` and `/disclaimer` (0.3, yearly).
- Blog: only once a post is live (`BLOG_SITEMAP_QUERY`) does `/blog` (0.8, weekly) appear, followed by that post and every other live post (0.7, weekly), each dated by its "Last updated" field, else its publish date. Live authors follow: every author with a live post (`AUTHOR_SITEMAP_QUERY`), dated by their latest one (0.5, monthly). Until there is a live post, the blog routes are left out and `/blog` is `noindex` (`specs/10-BLOG.md`).
- Projects: every project (0.7, monthly), with `lastModified` from `_updatedAt` (`getProjectSitemapEntries()`, `src/lib/projectData.ts`). Every project page is indexed.

### `src/app/robots.ts`
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] }],
    sitemap: 'https://phoenixenergy.solutions/sitemap.xml',
  };
}
```

### `organizationJsonLd()` (`src/lib/structuredData.ts`), injected in `layout.tsx`
The organisation is described once, in the root layout's `<head>`, under a fixed `@id` (`${SITE_URL}/#organization`, exported as `ORGANIZATION_ID`). Every other block that needs to name Phoenix Energy points at that `@id` instead of describing the company again, through `ORGANIZATION_REF` (`{ '@type': 'Organization', '@id': ORGANIZATION_ID, name, url }`).
```typescript
function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Phoenix Energy',
    legalName: CONTACT.legalName,
    url: 'https://phoenixenergy.solutions',
    logo: { '@type': 'ImageObject', url: 'https://phoenixenergy.solutions/logo.png', width: 512, height: 512 },
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: { '@type': 'PostalAddress', ...CONTACT.address },
    areaServed: AREA_SERVED,             // { '@type': 'Country', name: 'South Africa' }
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: CONTACT.phone, email: CONTACT.email, areaServed: 'ZA', availableLanguage: 'English' },
    sameAs: [CONTACT.linkedin],          // the address that opens for anyone, not the numeric one
  };
}
```

### `websiteJsonLd()` (`src/lib/structuredData.ts`), injected on the home page
The site search is the blog search, so the `SearchAction` is included only once a post is published. While there are none, `/blog` is also `noindex, follow` and left out of the sitemap (`specs/10-BLOG.md`). Its own `@id` is `${SITE_URL}/#website`, and it names the organisation as `publisher` by `ORGANIZATION_REF`.
```typescript
function websiteJsonLd({ searchable }: { searchable: boolean }) {   // searchable: PUBLISHED_POSTS_COUNT_QUERY > 0
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Phoenix Energy',
    url: 'https://phoenixenergy.solutions',
    inLanguage: 'en-ZA',
    publisher: ORGANIZATION_REF,
    ...(searchable && {
      potentialAction: { '@type': 'SearchAction',
        target: 'https://phoenixenergy.solutions/blog?q={search_term_string}',
        'query-input': 'required name=search_term_string' },
    }),
  };
}
```

### `serviceJsonLd()` (`src/lib/structuredData.ts`), on each solution page
A `Service` block on all six solution pages, naming the vertical, pointing `provider` at the organisation by `@id` and `areaServed` at South Africa.
```typescript
function serviceJsonLd(service: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.path),
    provider: ORGANIZATION_REF,
    areaServed: AREA_SERVED,
  };
}
```

### `breadcrumbJsonLd()` (`src/lib/structuredData.ts`), on every page but home
A `BreadcrumbList` for the trail a page's visible breadcrumb shows: home first (`HOME_CRUMB`), the page itself last, numbered from 1, with absolute URLs.
```typescript
function breadcrumbJsonLd(crumbs: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, name: crumb.name, item: absoluteUrl(crumb.path) })),
  };
}
```

### Blog pagination SEO — chosen approach: Option A (SSR paginated)
Route: `/blog?page=2`. The page awaits `searchParams`, so `/blog` renders per request, not statically.
`generateMetadata` builds its metadata with `pageMetadata()`, like every page, passing the canonical path from `blogIndexPath()` (`src/lib/blogSeo.ts`): a filtered or searched view canonicalises to `/blog`, whatever its page number, and a later page of the whole list canonicalises to itself. `pageMetadata()`'s `pagination` field, a `Metadata` key in its own right rather than something nested inside `alternates`, carries the previous and next page's addresses, only where that page exists and keeping `category` and `tag`; Next.js renders `<link rel="prev">` and `<link rel="next">` from it. The visible Prev and Next buttons follow the same rules. The index is `noindex` while a search is active (`q` is set) and while there are no live posts to show.
Default page size: 6 posts. First page has no `?page=` param.

### Revalidation webhook: nine of the ten document types
```typescript
// src/app/api/revalidate/route.ts (POST from the Sanity webhook)
// Needs the header Authorization: Bearer ${REVALIDATE_SECRET}; anything else gets 401.
// Handles: blogPost     → /blog/[slug], /blog, /, every author page (/blog/authors/[slug] as a page), each solution page and /sitemap.xml
//          author       → /blog/authors/[slug], /blog/[slug] and /sitemap.xml
//          project      → /projects/[slug], /projects, /, each solution page and /sitemap.xml
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
- Project cards (`ProjectCard`), the `/solutions` cards (`SolutionCard`, whose heading names the service), the home hero accordion, the footer watermark, the logo mark beside the wordmark and the author avatar beside the name in a post header: `alt=""`.
- Project heroes and the featured project card: the image's `alt` from Sanity, or the project title. Gallery tiles and photo viewer images: the image's `alt`, or "Project photo N"; each gallery tile's button is named by a visually hidden "Open photo N of M:" before its image (`specs/06-PROJECT-SINGLE.md`).
- Blog heroes and article cards: the image's `alt`, or the post title.
- Solution page heroes: the vertical's name.
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

Each vertical card is a `SolutionCard` (`src/components/sections/SolutionCard.tsx`), light since 30 September 2026:
- A light `Card` (pattern 1), the same family as the project cards: white, a 1px border and 16px corners. The whole card is one link to `/solutions/[vertical]`, and it lifts 4px with a shadow on hover.
- Photo: the vertical's hero image from Sanity (`heroImages`), 16:10, clear of the dark gradient the project cards put over theirs (`scrim={false}`), with `alt=""` because the heading names the service. With no photo, a tint of the vertical's accent.
- A 3px line in the vertical's accent under the photo.
- Body, 24px in: the vertical's name as an H2 (Plus Jakarta Sans, 20px bold, Near Black), one line on what the service does (`VERTICAL_CONFIG[vertical].cardLine`, Inter 14px, Slate), then "Explore {vertical}" at the foot, so the Explore lines in a row line up. That line has the arrow link's look on a span (`arrowLinkClasses()`, Deep Teal, darker when the card is hovered), since the card is the link, and ends with `ArrowLinkArrow`, the arrow that nudges 4px on hover on every `ArrowLink`. The line flows as text, with its last word and the arrow held together. The one label long enough to wrap, EV Fleets & Infrastructure, wraps on phones narrower than about 340px and has only a pixel or two to spare at 1024px, where the three columns are narrowest; when it wraps, the arrow stays beside its last word.
- No figures. The dark card's SEO description and its two stats from the claims register were dropped; the register records those stats as not rendered, and a test keeps digits out of every card line.

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
- A dark gradient header with a "WeBuySolar" badge and the title "Solar Valuation Request", over a white body with the description, three feature chips (Solar & battery, Team-reviewed, No obligation) and "Request a valuation", linking to `/tools/solar-valuation`. The card is the link, so "Request a valuation" is a line in the arrow link's style (`arrowLinkClasses()`: Inter 600 14px, Deep Teal, a 14px arrow), darker when the card is hovered.
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


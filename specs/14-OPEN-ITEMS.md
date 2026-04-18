# 14 — Open Items
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0

---

## Pending Before Build

| # | Item | Status | Owner |
|---|---|---|---|
| 1 | Logo file (SVG preferred) | ⏳ Pending | Client |
| 2 | GTM Container ID | ⏳ Pending | Client |
| 3 | GA4 Measurement ID | ⏳ Pending | Client |
| 4 | Sanity project initialised + Project ID | ⏳ Pending | Dev |
| 5 | Office address for Contact page | ⏳ Pending | Client |
| 6 | Register reCAPTCHA v3 site → get site key + secret key | ⏳ Pending | Dev |

## Confirmed

| Item | Value |
|---|---|
| Domain | `phoenixenergy.solutions` |
| Contact email | `info@phoenixenergy.solutions` |
| Display font | Plus Jakarta Sans |
| Body font | Inter |
| Email provider | Resend |
| Deployment | Vercel + GitHub CI/CD |
| CMS | Sanity (free tier) |
| Photos | Unsplash placeholders during build; real photos post-launch |
| Projects: pagination | Load more (+6 per click) |
| Projects: default card count | 6 (2 rows × 3) |
| Projects: card click behaviour | **Drawer first, then full page** — card click opens a slide-in drawer with a quick project preview. Drawer contains a "View full case study →" button that navigates to `/projects/[slug]` for the complete editorial page. See `specs/05-PROJECTS.md` and `specs/06-PROJECT-SINGLE.md` for full specs. |

## Decisions Needed

*All decisions resolved. No outstanding items.*

---

*Spoke of [`/CLAUDE.md`](/CLAUDE.md)*

---

## Engineering Review Findings — Must Resolve Before Build (April 2026)

| Priority | Item | Action | Owner |
|---|---|---|---|
| 🔴 Critical | Sitemap + robots.txt | Add `src/app/sitemap.ts` + `robots.ts` | Dev |
| 🔴 Critical | CMS schema conflict (author field) | `12-CMS.md` updated to match `10-BLOG.md` | Dev |
| 🔴 Critical | iOS input font-size | `globals.css`: inputs 16px on mobile | Dev |
| 🔴 Critical | Nav dark hero detection | Expanded `DARK_HERO_PAGES` array | Dev |
| 🔴 Critical | `next.config.js` image domains | Add `cdn.sanity.io` to remotePatterns | Dev |
| 🟠 High | Organization JSON-LD | Inject in `layout.tsx` | Dev |
| 🟠 High | `api/contact` unified payload | Discriminated union type defined | Dev |
| 🟠 High | `revalidate` value standardised | All pages use `revalidate: 3600` | Dev |
| 🟠 High | `prefers-reduced-motion` | Hook + all animations respect it | Dev |
| 🟠 High | Touch carousel scroll-snap | All carousels get scroll-snap CSS | Dev |
| 🟠 High | Loading skeleton states | `loading.tsx` per async route | Dev |
| 🟠 High | Blog pagination SEO | SSR paginated `/blog?page=N` | Dev |
| 🟡 Medium | `AnimatedSection.tsx` defined | Props spec added to `01-BRAND.md` | Dev |
| 🟡 Medium | Shared component interfaces | Added to `01-BRAND.md` | Dev |
| 🟡 Medium | 404 + 500 pages | `not-found.tsx` + `error.tsx` | Dev |
| 🟡 Medium | Security headers | `next.config.js` headers spec added | Dev |
| 🟡 Medium | Sanity webhook revalidation scope | Extended to cover projects + team | Dev |
| 🟡 Medium | Solutions + Tools index pages | Simple grid page specs | Dev |
| 🟡 Medium | Solution page canonical URLs | Added to `07-SOLUTIONS.md` | Dev |
| 🟡 Medium | Resend email template | Define per intent type | Dev |
| 🟡 Medium | Form error state UI | Red border + message below field | Dev |


---

## Client Action Items Added During Engineering Review (April 2026)

| # | Item | Owner |
|---|---|---|
| 7 | Google Search Console property registered + verification token | Client/Dev |
| 8 | OG images created per page: og-home.jpg, og-about.jpg, og-tools-valuation.jpg + one per solution vertical | Design |
| 9 | Real client testimonials (3 per solution vertical + 3 for about page) | Client |
| 10 | Real hero photography per solution vertical and about page | Client |
| 11 | Confirm WeBuySolar page excludes Financing tab (it's a buyback, not an install service) | Client |


---

## Team Member CMS Data Entry (April 2026)

All team members are managed through Sanity. The following must be completed in Sanity Studio before launch:

| # | Action | Owner | Notes |
|---|---|---|---|
| TM-1 | Create Sanity team member documents for all 3 founders | Client | Required fields: name, photo, role, category (founders), archetype, order (1/2/3), active: true |
| TM-2 | Upload portrait photos for each team member | Client | Minimum 400×400px. Consistent lighting and style across all team photos. Set hotspot (face) on upload. |
| TM-3 | Add LinkedIn URLs for each team member | Client | Full URL e.g. `https://www.linkedin.com/in/username`. Optional but strongly recommended. |
| TM-4 | Write bio copy for each team member | Client | 2–4 sentences. Used for future profile pages and SEO — not shown on the grid card itself. |
| TM-5 | Add any additional Business / Technical team members | Client | Same schema. Set `category` to 'business' or 'technical'. Filter tabs appear automatically once populated. |
| TM-6 | Confirm archetype labels with founders | Client | *"The Strategist"*, *"The Innovator"*, *"The Trailblazer"* — are these correct? Optional field, can be left blank. |

**Developer note:** The Sanity webhook for `teamMember` document changes is already specified in `02-ARCHITECTURE.md` — it revalidates `/about` on any create, update, or delete event. No code changes needed to add or remove team members post-launch.


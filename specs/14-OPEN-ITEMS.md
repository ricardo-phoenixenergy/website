# 14 — Open Items
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0
> **Updated 2026-09-24:** corrected to match the build. Statuses updated, and the decisions still open are listed under Decisions Needed.

---

## Pending Before Build

| # | Item | Status | Owner |
|---|---|---|---|
| 1 | Logo file (SVG preferred) | ✅ Done: PNG logos in `public/` (`logo.png`, and `inverted-logo.png` on dark surfaces) | Client |
| 2 | GTM Container ID | ⏳ Pending | Client |
| 3 | GA4 Measurement ID | ⏳ Pending | Client |
| 4 | Sanity project initialised + Project ID | ✅ Done: pages read Sanity content and the Studio runs at `/studio` | Dev |
| 5 | Office address for Contact page | ✅ Done: shown on `/contact` under Head Office | Client |
| 6 | Register reCAPTCHA v3 site → get site key + secret key | ✅ Done: both keys are in Vercel (confirmed 25 September 2026) | Dev |

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
| Projects: card click behaviour | **Straight to the case study.** Every project card links to `/projects/[slug]` and leads with its outcomes. There is no drawer: it was removed in September 2026 (UX audit decision). See `specs/05-PROJECTS.md` and `specs/06-PROJECT-SINGLE.md` for full specs. |
| Valuation tool | **A valuation request, not a calculator** (UX audit decision, September 2026). `/tools/solar-valuation` collects system and contact details, and the WeBuySolar team prepares the valuation after a free on-site audit. No figure shows on screen. An on-screen range waits until the valuation maths is corrected (audit VAL-12: the removed model valued used systems above new ones). |

## Decisions Needed

| Item | Status | Detail | Owner |
|---|---|---|---|
| Privacy notice on the contact form and the valuation request | ⏳ Pending legal review | The draft wording is live, set in one place: `src/config/privacyNotice.ts`. The questions for counsel and the gaps in the privacy policy, including whether analytics needs a consent choice, are in `docs/legal/privacy-review-draft.md`. | Client (counsel) |
| Evidence behind the site's claims | ⏳ Pending | `docs/content/claims-register.md` lists every figure and claim the site makes, and none is confirmed yet. Still owed: answers to the conflicts it lists, and the confirmations flagged in step 8a (WeBuySolar process and timings, the no-cost wording, carbon fees and share, the EV electricity rates' source, the case study projections). | Client |

---

*Spoke of [`/CLAUDE.md`](/CLAUDE.md)*

---

## Engineering Review Findings — Must Resolve Before Build (April 2026)

| Priority | Item | Action | Owner |
|---|---|---|---|
| 🔴 Critical | Sitemap + robots.txt | Add `src/app/sitemap.ts` + `robots.ts` | Dev |
| 🔴 Critical | CMS schema conflict (author field) | `12-CMS.md` updated to match `10-BLOG.md` | Dev |
| 🔴 Critical | iOS input font-size | `globals.css`: inputs 16px on mobile | Dev |
| 🔴 Critical | Nav dark hero detection | Removed. The navbar is solid white on every page, so there is no `DARK_HERO_PAGES` list. | Dev |
| 🔴 Critical | `next.config.ts` image domains | Add `cdn.sanity.io` to remotePatterns | Dev |
| 🟠 High | Organization JSON-LD | Inject in `layout.tsx` | Dev |
| 🟠 High | `api/contact` unified payload | Discriminated union type defined | Dev |
| 🟠 High | `revalidate` value standardised | All pages use `revalidate: 3600` | Dev |
| 🟠 High | `prefers-reduced-motion` | Hook + all animations respect it | Dev |
| 🟠 High | Touch carousel scroll-snap | Only the About timeline snaps, on phones. No other carousel snaps, and the `.scroll-snap-x` utility in `globals.css` is unused. | Dev |
| 🟠 High | Loading skeleton states | Removed in September 2026. No route has a `loading.tsx`. | Dev |
| 🟠 High | Blog pagination SEO | SSR paginated `/blog?page=N` | Dev |
| 🟡 Medium | `AnimatedSection.tsx` defined | Props spec added to `01-BRAND.md` | Dev |
| 🟡 Medium | Shared component interfaces | Superseded. `StatsStrip`, `CTABanner`, `VerticalBadge` and `Testimonials` don't exist in `src/components/`, and `ProjectCard` has no drawer props. See `01-BRAND.md`. | Dev |
| 🟡 Medium | 404 + 500 pages | `not-found.tsx` + `error.tsx` | Dev |
| 🟡 Medium | Security headers | `next.config.ts` headers spec added | Dev |
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
| 8 | OG images. **As built:** each solution page has its own `og-solutions-*.png` in `public/`. Home, About, Contact, `/projects`, `/blog`, `/tools` and the valuation tool share `og-default.png`. Blog posts and projects use their Sanity image. `/solutions`, the author pages and the legal pages set none. | Design |
| 9 | Real client testimonials (3 per solution vertical + 3 for about page). **Not needed:** the site has no testimonials section. | Client |
| 10 | Real hero photography per solution vertical and about page. **As built:** the home and solution heroes take their photos from the Sanity "Hero Images" document, one per vertical. The About hero uses no photo. | Client |
| 11 | Confirm WeBuySolar page excludes Financing tab (it's a buyback, not an install service). **Not needed:** no solution page has a Financing tab. C&I, Energy Optimisation and EV Fleets show a separate financing section; WeBuySolar has none. | Client |


---

## Team Member CMS Data Entry (April 2026)

All team members are managed through Sanity. The following must be completed in Sanity Studio before launch:

| # | Action | Owner | Notes |
|---|---|---|---|
| TM-1 | Create Sanity team member documents for all 3 founders | Client | Required fields: name, photo, role, category (founders), archetype, order (1/2/3), active: true |
| TM-2 | Upload portrait photos for each team member | Client | Portrait photos: the card shows them at 3:4, cropped from the centre (the hotspot isn't applied). Consistent lighting and style across all team photos. |
| TM-3 | Add LinkedIn URLs for each team member | Client | Full URL e.g. `https://www.linkedin.com/in/username`. Optional but strongly recommended. |
| TM-4 | Write bio copy for each team member | Client | 2 to 4 sentences. Not shown anywhere on the site yet: reserved for future profile pages. |
| TM-5 | Add any additional Business / Technical team members | Client | Same schema. Set `category` to 'business' or 'technical'. Filter tabs appear automatically once populated. |
| TM-6 | Confirm archetype labels with founders | Client | *"The Strategist"*, *"The Innovator"*, *"The Trailblazer"* — are these correct? Optional field, can be left blank. |

**Developer note:** The Sanity webhook for `teamMember` document changes is already specified in `02-ARCHITECTURE.md` — it revalidates `/about` on any create, update, or delete event. No code changes needed to add or remove team members post-launch.


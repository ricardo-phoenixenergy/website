# Phoenix Energy — Master Specification Hub
> Version 3.0 | April 2026

This is the single entry point for all Claude Code tasks on the Phoenix Energy marketing website. Read this file first on every session. Navigate to spoke documents for page-specific or topic-specific detail.

---

## Project Identity

| | |
|---|---|
| **Client** | Phoenix Energy |
| **Site** | phoenixenergy.solutions |
| **Contact** | info@phoenixenergy.solutions |
| **Purpose** | Marketing website — lead generation across 6 energy verticals |
| **Design ref** | greenlyte.tech (aesthetic inspiration) |

---

## Spoke Documents

| Spoke | File | Contents |
|---|---|---|
| 🎨 Brand & Design System | `specs/01-BRAND.md` | Colors, typography, spacing, design tokens, component rules |
| 🏗️ Architecture & Stack | `specs/02-ARCHITECTURE.md` | Tech stack, TypeScript conventions, component structure, deployment |
| 🧭 Navigation | `specs/03-NAVIGATION.md` | Pill nav, glass scroll effect, mega-menu, mobile nav |
| 🏠 Home Page | `specs/04-HOME.md` | Hero accordion, partners, how it works, projects carousel, blog, CTA, footer ✅ Approved |
| 📁 Projects Page | `specs/05-PROJECTS.md` | Cinematic featured card, filter pills, project grid, load more |
| 🔍 Single Project Page | `specs/06-PROJECT-SINGLE.md` | Case study layout, split hero, stats strip, numbered sections, gallery, related projects ✅ Approved |
| 💡 Solutions Pages | `specs/07-SOLUTIONS.md` | All 6 verticals — hero, calc, tabs/accordion, How It Works, testimonials, projects, CTA ✅ Approved |
| 👥 About Page | `specs/08-ABOUT.md` | Hero, stats strip, story, mission, values, timeline, team grid, trust tabs, careers, CTA ✅ Approved |
| 📬 Contact Page | `specs/09-CONTACT.md` | Two-step intent form (Client/Partner/Investor), reCAPTCHA v3, right column info + trust ✅ Approved |
| 📝 Blog & Articles | `specs/10-BLOG.md` | Index + single post, rich content blocks, Sanity schema, GROQ queries, JSON-LD, ISR, SEO ✅ Approved |
| 🛠️ Tools & Resources | `specs/11-TOOLS.md` | Solar Asset Valuation Tool — 3-step DCF+cost+comps model, BESS valuation, soft paywall lead capture ✅ Approved |
| 🗄️ CMS Schemas | `specs/12-CMS.md` | Sanity schemas for Project, Blog Post, Solution |
| 📊 Analytics & Tracking | `specs/13-ANALYTICS.md` | GTM, GA4, conversion events |
| 📋 Open Items | `specs/14-OPEN-ITEMS.md` | Decisions pending, blocked items, owner |

---

## Site Map

```
phoenixenergy.solutions/
├── /                              → Home
├── /about                         → About
├── /projects                      → Projects portfolio
│   └── /projects/[slug]           → Single project / case study
├── /solutions                     → Solutions overview
│   ├── /solutions/ci-solar-storage
│   ├── /solutions/wheeling
│   ├── /solutions/energy-optimisation
│   ├── /solutions/carbon-credits
│   ├── /solutions/webuysolar
│   └── /solutions/ev-fleets
├── /contact                       → Contact
├── /blog                          → Blog / articles / press
│   └── /blog/[slug]               → Single post
├── /tools                         → Tools & resources
│   └── /tools/solar-asset-valuation
└── /studio                        → Sanity CMS (team only)
```

---

## Solution Verticals — Quick Reference

| Vertical | Slug | Accent Colour | Hex |
|---|---|---|---|
| C&I Solar & Storage | `ci-solar-storage` | Soft Amber | `#E3C58D` |
| Wheeling | `wheeling` | Fresh Coral | `#D97C76` |
| Energy Optimisation | `energy-optimisation` | Dusty Blue | `#709DA9` |
| Carbon Credits | `carbon-credits` | Sage Green | `#9CAF88` |
| WeBuySolar | `webuysolar` | Warm Copper | `#C97A40` |
| EV Fleets & Infrastructure | `ev-fleets` | Light Aqua | `#A9D6CB` |

---

## Core Rules (apply everywhere)

1. **TypeScript strictly** — every component, hook, and utility fully typed. No `any`.
2. **Every UI element is a component** — nothing repeated inline across pages.
3. **Never hardcode brand values** — always use Tailwind tokens from `tailwind.config.ts`.
4. **Named exports only** — no default exports from component files.
5. **Framer Motion for all animation** — scroll reveals via `useInView`, transitions via `variants`.
6. **Sanity for all dynamic content** — projects, blog posts, team members pulled via GROQ.
7. **Inter for body copy, Plus Jakarta Sans for all headings** — no exceptions.
8. **Accent colours are subtle** — never dominant backgrounds; use at 10–15% opacity or as 3px bars/dots.
9. **No dark mode** — single light theme, `#F5F5F5` background throughout.
10. **Photos use `next/image`** — always with `placeholder="blur"` for fast LCP.

---

## Environment Variables

```bash
NEXT_PUBLIC_GTM_ID=              # Google Tag Manager container ID
NEXT_PUBLIC_GA_ID=               # GA4 Measurement ID
RESEND_API_KEY=                  # Contact form → info@phoenixenergy.solutions
NEXT_PUBLIC_SANITY_PROJECT_ID=   # Sanity project ID
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                # Server-side CMS reads
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=  # reCAPTCHA v3 public site key
RECAPTCHA_SECRET_KEY=            # reCAPTCHA v3 secret key (server-side only)
```

---

*Hub document — Phoenix Energy Website v3.0 | See `specs/14-OPEN-ITEMS.md` for pending decisions*

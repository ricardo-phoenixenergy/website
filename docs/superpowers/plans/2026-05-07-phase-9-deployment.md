# Phase 9 — Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the Phoenix Energy website to production at phoenixenergy.solutions via Vercel, with all env vars, custom domain, Sanity webhook, and post-deploy checks complete.

**Architecture:** Next.js 16 app deployed to Vercel (auto-deploy from `main` branch on GitHub). Sanity CMS runs separately at sanity.io; a webhook fires to `/api/revalidate` on content changes. reCAPTCHA, Resend, GTM/GA4 all rely on env vars set in Vercel dashboard.

**Tech Stack:** Next.js 16 · Vercel · GitHub CI/CD · Sanity · Resend · reCAPTCHA v3 · GA4/GTM

---

## Project State — Full Audit (May 2026)

### ✅ Complete (Phases 0–8)

| Area | Status |
|---|---|
| All 14 app routes (pages + API) | ✅ Built |
| All components (UI, sections, solutions, tools, blog, analytics) | ✅ Built |
| Sanity schemas (blogPost, author, project, teamMember, partner, milestoneTimeline) | ✅ Built |
| next.config.ts (security headers, Sanity image domain) | ✅ Done |
| globals.css (brand tokens, iOS font-size fix) | ✅ Done |
| sitemap.ts + robots.ts | ✅ Done |
| Organization JSON-LD in layout.tsx | ✅ Done |
| WebSite JSON-LD in home page | ✅ Done |
| HowTo JSON-LD in solar-valuation page | ✅ Done |
| Blog SSR pagination with prev/next alternates | ✅ Done |
| Unified /api/contact (discriminated union) | ✅ Done |
| React Email templates (ContactEmail + WeBuySolarEmail) | ✅ Done |
| reCAPTCHA v3 site key + secret key | ✅ In .env.local |
| GTM container (GTM-NT85F7DX) + GA4 (G-DE5CEEXBBX) | ✅ In .env.local |
| Sanity project ID 478nwzw2 | ✅ In .env.local |
| Resend API key | ✅ In .env.local |
| All Phase 8 analytics events | ✅ Done |
| not-found.tsx + error.tsx | ✅ Done |
| Loading skeletons for all async routes | ✅ Done |
| useReducedMotion hook + AnimatedSection | ✅ Done |

### ❌ Missing (this plan covers these)

| Item | Task |
|---|---|
| REVALIDATE_SECRET missing from .env.local | Task 1 |
| aria-hidden on blurred results layer (accessibility) | Task 2 |
| Solution vertical loading.tsx files (×6) | Task 3 |
| Production build verification | Task 4 |
| GitHub remote push | Task 5 |
| Vercel project creation + env vars | Task 6 |
| Custom domain (phoenixenergy.solutions) | Task 7 |
| Sanity CORS origin for production URL | Task 8 |
| Sanity webhook configuration | Task 9 |
| Google Search Console verification | Task 10 |
| Production smoke test | Task 11 |
| OG images (client/design action) | Task 12 |
| Sanity content seeding (client action) | Task 13 |

---

## Task 1: Add REVALIDATE_SECRET to .env.local

**Files:**
- Modify: `.env.local`

The `/api/revalidate` route (`src/app/api/revalidate/route.ts:16`) checks `process.env.REVALIDATE_SECRET` and returns 401 if absent or mismatched. Without this, all Sanity webhook calls will fail silently.

- [ ] **Step 1: Generate a secure secret**

Run in PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
```

Copy the output (e.g. `abc123XYZ...`). This is your `REVALIDATE_SECRET`.

- [ ] **Step 2: Append to .env.local**

Open `.env.local` and add at the bottom:
```bash
# ─── Sanity Webhook Revalidation ──────────────────────────────────────────────
# Used by /api/revalidate — must match the secret set in Sanity webhook config
REVALIDATE_SECRET=<paste-generated-value-here>
```

- [ ] **Step 3: Save the secret value**

Write it down or save to your password manager — you will need to enter the exact same value in:
- Vercel environment variables (Task 6)
- Sanity webhook HTTP header (Task 9): `Authorization: Bearer <value>`

---

## Task 2: Fix aria-hidden on Blurred Results Layer

**Files:**
- Modify: `src/components/tools/Step3Results.tsx`

Spec 11 (Engineering Review) requires `aria-hidden="true"` on the blurred div before unlock, and `aria-live="polite"` after. Without this, screen readers announce blurred (unreadable) content to visually impaired users.

- [ ] **Step 1: Read the current Step3Results.tsx**

Open `src/components/tools/Step3Results.tsx` and find the `div` wrapping `<ResultsGrid>`, `<DCFBarChart>`, and `<BreakdownRows>` — this is the blurred results container. Look for the style with `filter: blur(7px)` or similar.

- [ ] **Step 2: Add aria-hidden prop**

Find the results container div (the one that gets blurred). Change it to pass `aria-hidden` and `aria-live` based on `unlocked` prop:

```tsx
export function Step3Results({ solar, bess, cond, result, unlocked, onUnlock, onBack }: Step3ResultsProps) {
  return (
    <div className="relative">
      {/* Blurred results layer */}
      <div
        aria-hidden={!unlocked}
        aria-live={unlocked ? 'polite' : undefined}
        style={{
          filter: unlocked ? 'none' : 'blur(7px)',
          userSelect: unlocked ? 'auto' : 'none',
          pointerEvents: unlocked ? 'auto' : 'none',
          transition: 'filter 0.4s',
        }}
      >
        <ResultsGrid result={result} />
        <DCFBarChart result={result} solar={solar} cond={cond} />
        <BreakdownRows result={result} solar={solar} bess={bess} cond={cond} />
      </div>

      {/* Paywall overlay — shown when not unlocked */}
      {!unlocked && (
        <SoftPaywall
          result={result}
          solar={solar}
          bess={bess}
          cond={cond}
          onUnlock={onUnlock}
        />
      )}

      {/* What happens next — shown after unlock */}
      {unlocked && <WhatHappensNext />}
    </div>
  );
}
```

- [ ] **Step 3: Verify visually**

Run `npm run dev`, navigate to `/tools/solar-valuation`, complete steps 1 and 2, and reach step 3. Confirm the results are blurred before submitting the paywall form, then smoothly un-blur after submitting.

- [ ] **Step 4: Commit**

```bash
git add src/components/tools/Step3Results.tsx
git commit -m "fix(a11y): add aria-hidden to blurred results layer in solar valuation tool"
```

---

## Task 3: Add Solution Vertical Loading Skeletons

**Files:**
- Create: `src/app/solutions/ci-solar-storage/loading.tsx`
- Create: `src/app/solutions/wheeling/loading.tsx`
- Create: `src/app/solutions/energy-optimisation/loading.tsx`
- Create: `src/app/solutions/carbon-credits/loading.tsx`
- Create: `src/app/solutions/webuysolar/loading.tsx`
- Create: `src/app/solutions/ev-fleets/loading.tsx`

Spec 02-ARCHITECTURE.md requires `loading.tsx` for solution vertical routes. All 6 files use the same skeleton — a hero shimmer block + content placeholder.

- [ ] **Step 1: Create the shared skeleton (all 6 files are identical)**

Create `src/app/solutions/ci-solar-storage/loading.tsx`:
```tsx
export default function SolutionLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[460px] bg-[#E5E7EB] w-full" />
      {/* Stats strip */}
      <div className="h-20 bg-[#d1d5db] w-full" />
      {/* Content blocks */}
      <div className="max-w-[960px] mx-auto px-6 py-16 space-y-8">
        <div className="h-6 bg-[#E5E7EB] rounded w-1/4" />
        <div className="h-10 bg-[#E5E7EB] rounded w-2/3" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-[#E5E7EB] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Duplicate for remaining 5 verticals**

Copy the identical content to:
- `src/app/solutions/wheeling/loading.tsx`
- `src/app/solutions/energy-optimisation/loading.tsx`
- `src/app/solutions/carbon-credits/loading.tsx`
- `src/app/solutions/webuysolar/loading.tsx`
- `src/app/solutions/ev-fleets/loading.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/app/solutions/*/loading.tsx
git commit -m "feat(ux): add loading skeletons for solution vertical pages"
```

---

## Task 4: Production Build Verification

**Files:** none (diagnostic only)

A build failure in Vercel is harder to debug than locally. Catch TypeScript and config errors before pushing.

- [ ] **Step 1: Run the production build**

```powershell
cd "C:\Users\ricar\OneDrive\Desktop\Phoenix Energy\Phoenix Website V3\website\phoenix-energy"
npm run build
```

Expected output: `✓ Compiled successfully` with a route size table. No TypeScript errors.

- [ ] **Step 2: Fix any build errors**

Common failures:
- **Type error in a page** — check the file listed in the error, fix the type
- **Missing env var during build** — add a fallback or check the variable is set
- **Image import error** — ensure `next/image` has `width`/`height` or `fill` on all usages
- **`use client` directive missing** — any component using `useState`/`useEffect` needs `'use client'` at top

Re-run `npm run build` after each fix until it passes.

- [ ] **Step 3: Check bundle sizes**

In the build output, flag any route over 250 kB (First Load JS). If any exists, report to user before proceeding.

- [ ] **Step 4: Commit any fixes**

```bash
git add -p   # stage only build-fix files
git commit -m "fix(build): resolve TypeScript/config errors for production build"
```

---

## Task 5: Ensure Code Is Pushed to GitHub

**Files:** none (git operation)

Vercel deploys from GitHub. The repo must be pushed and up to date on the `main` branch.

- [ ] **Step 1: Check remote status**

```powershell
git remote -v
git status
git log --oneline -5
```

If output of `git remote -v` is empty → the repo has no remote yet. Go to Step 2. If a remote exists → go to Step 3.

- [ ] **Step 2: (If no remote) Create GitHub repo and add remote**

1. Go to github.com → New repository
2. Name: `phoenix-energy-website`
3. Set to **Private**, no README, no .gitignore (project already has both)
4. Copy the remote URL (e.g. `https://github.com/RicardoDS7/phoenix-energy-website.git`)

```powershell
git remote add origin https://github.com/RicardoDS7/phoenix-energy-website.git
git branch -M main
```

- [ ] **Step 3: Push to main**

```powershell
git push -u origin main
```

Expected: all commits uploaded. Confirm at github.com/RicardoDS7/phoenix-energy-website.

---

## Task 6: Create Vercel Project + Configure Environment Variables

**Files:** none (Vercel dashboard)

This task is entirely in the Vercel web dashboard — no code changes.

- [ ] **Step 1: Create Vercel project**

1. Go to vercel.com → New Project
2. Import GitHub repository: `phoenix-energy-website`
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: leave as `/` (the package.json is at root)
5. Do **not** deploy yet — configure env vars first

- [ ] **Step 2: Add environment variables**

In the Vercel project → Settings → Environment Variables, add **all** of the following. Set scope to **Production, Preview, Development** for all:

| Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | `GTM-NT85F7DX` | |
| `NEXT_PUBLIC_GA_ID` | `G-DE5CEEXBBX` | |
| `RESEND_API_KEY` | `re_BBt1JQFY_DNeKVrz41LYuKRyTgmFnhYWS` | |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `478nwzw2` | |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | |
| `SANITY_API_TOKEN` | (from .env.local) | |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | `6Ldy18UsAAAAAHGkV7iNNjfltqImpi8ALP9IFtV-` | |
| `RECAPTCHA_SECRET_KEY` | `6Ldy18UsAAAAAM2vxlWRZqVfSTpre8l9DHH2cP45` | |
| `REVALIDATE_SECRET` | (value from Task 1) | **Keep secret — Production only** |

⚠️ `REVALIDATE_SECRET` should only be scoped to **Production** (not Preview/Development) since the webhook will only target the production URL.

- [ ] **Step 3: Trigger first deploy**

Click **Deploy** in Vercel. The first deploy takes ~2–3 minutes. Monitor the build log for errors. If it fails, check the log, fix the issue in code, and push again.

Expected: Build log ends with `✓ Build Completed` and the deployment URL (e.g. `phoenix-energy-abc.vercel.app`) is accessible.

- [ ] **Step 4: Smoke-test the preview URL**

Open the Vercel deployment URL. Check:
- [ ] Home page loads
- [ ] Navbar renders correctly
- [ ] `/contact` — step 1 intent selector shows
- [ ] `/tools/solar-valuation` — tool loads and steps work

---

## Task 7: Configure Custom Domain (phoenixenergy.solutions)

**Files:** none (Vercel + DNS provider)

- [ ] **Step 1: Add domain in Vercel**

Vercel project → Settings → Domains → Add `phoenixenergy.solutions` and `www.phoenixenergy.solutions`.

Vercel will show the required DNS records:
- **A record**: `@` → Vercel IP (e.g. `76.76.21.21`)
- **CNAME record**: `www` → `cname.vercel-dns.com`

- [ ] **Step 2: Update DNS at your domain registrar**

Log into wherever `phoenixenergy.solutions` is registered. In DNS settings:
1. Add/update the **A record** for `@` to the Vercel IP shown
2. Add/update the **CNAME** for `www` to `cname.vercel-dns.com`
3. Remove any conflicting A/CNAME records for `@` or `www`

DNS propagation takes 5 minutes to 48 hours. Vercel shows a green ✓ when verified.

- [ ] **Step 3: Verify domain in Vercel dashboard**

Wait for Vercel to show `phoenixenergy.solutions` → ✓ Valid Configuration. Then confirm in browser: `https://phoenixenergy.solutions` loads the site with a valid SSL cert.

---

## Task 8: Add Production URL to Sanity CORS Origins

**Files:** none (Sanity dashboard)

Without this, browser requests from `phoenixenergy.solutions` to the Sanity API will be blocked by CORS.

- [ ] **Step 1: Open Sanity project settings**

Go to: sanity.io/manage → Project `478nwzw2` → API → CORS Origins

- [ ] **Step 2: Add production origins**

Click **Add CORS Origin** and add each:
1. `https://phoenixenergy.solutions` — Allow credentials: ✓
2. `https://www.phoenixenergy.solutions` — Allow credentials: ✓

(The Vercel preview domain `*.vercel.app` may also be useful to add for testing.)

---

## Task 9: Configure Sanity Webhook

**Files:** none (Sanity dashboard)

This wires up automatic ISR invalidation — when a blog post or project is published in Sanity Studio, the live site rebuilds those pages within seconds.

- [ ] **Step 1: Open Sanity webhook settings**

Go to: sanity.io/manage → Project `478nwzw2` → API → Webhooks → Create Webhook

- [ ] **Step 2: Configure the webhook**

| Setting | Value |
|---|---|
| Name | `Phoenix Energy Revalidation` |
| URL | `https://phoenixenergy.solutions/api/revalidate` |
| Trigger on | Create, Update, Delete |
| Filter | Leave blank (all document types) |
| Projection | `{ _type, "slug": slug.current }` |
| HTTP method | POST |
| HTTP headers | `Authorization: Bearer <REVALIDATE_SECRET value from Task 1>` |

- [ ] **Step 3: Test the webhook**

Sanity provides a "Send test notification" button. Click it and check:
1. Sanity shows HTTP 200 response
2. Vercel Functions log (project → Logs → Functions → `/api/revalidate`) shows the request was received

If you get 401: double-check the `Authorization` header value matches `REVALIDATE_SECRET` exactly.

---

## Task 10: Google Search Console Verification

**Files:**
- Modify: `src/app/layout.tsx`

⚠️ **Blocked on client** — the client must first register the property at search.google.com/search-console → Add Property → `https://phoenixenergy.solutions`. They will receive a verification token.

- [ ] **Step 1: Client registers Search Console property**

Client action: go to search.google.com/search-console → Add Property → Domain → enter `phoenixenergy.solutions` → Copy the verification token string.

- [ ] **Step 2: Add token to layout.tsx metadata**

In `src/app/layout.tsx`, add to the `metadata` export:

```typescript
export const metadata: Metadata = {
  title: { ... },
  description: '...',
  metadataBase: new URL('https://phoenixenergy.solutions'),
  // ... existing fields ...
  verification: {
    google: 'PASTE_ACTUAL_TOKEN_HERE',
  },
};
```

Replace `PASTE_ACTUAL_TOKEN_HERE` with the actual token from Search Console.

- [ ] **Step 3: Push and deploy**

```bash
git add src/app/layout.tsx
git commit -m "feat(seo): add Google Search Console verification token"
git push
```

Wait for Vercel to deploy (~1 min), then click **Verify** in Search Console.

- [ ] **Step 4: Submit sitemap**

In Search Console → Sitemaps → Add: `https://phoenixenergy.solutions/sitemap.xml` → Submit.

---

## Task 11: Production Smoke Test

**Files:** none (browser testing)

A structured check of every major user flow on the live site.

- [ ] **Step 1: Navigation**
  - [ ] All 6 nav links work
  - [ ] Logo links to home
  - [ ] "Get a Quote" CTA links to `/contact`
  - [ ] Mobile hamburger opens/closes

- [ ] **Step 2: Home page**
  - [ ] Hero accordion cycles through all 6 verticals
  - [ ] Projects carousel scrolls
  - [ ] Blog articles load (or show placeholder if no content)

- [ ] **Step 3: Contact form**
  - [ ] Step 1 intent selector works (all 3 intents)
  - [ ] Step 2 form validates on blur
  - [ ] Submit sends email to `info@phoenixenergy.solutions` (check inbox)
  - [ ] Success state appears after submit

- [ ] **Step 4: Solar valuation tool**
  - [ ] All 3 steps navigate correctly
  - [ ] Step 3 results are blurred
  - [ ] Paywall form submits and un-blurs results
  - [ ] Email received at `info@phoenixenergy.solutions`

- [ ] **Step 5: SEO checks**
  - [ ] `https://phoenixenergy.solutions/sitemap.xml` renders XML
  - [ ] `https://phoenixenergy.solutions/robots.txt` renders correctly
  - [ ] Page source of home page contains Organization JSON-LD and WebSite JSON-LD

- [ ] **Step 6: Performance (optional but recommended)**
  - Run Lighthouse on home page (Chrome DevTools → Lighthouse → Mobile)
  - Target: Performance > 85, Accessibility > 90, SEO > 95

---

## Task 12: OG Images (Client/Design Action)

**Files:**
- Create: `public/og-home.jpg` (1200×630px)
- Create: `public/og-about.jpg` (1200×630px)
- Create: `public/og-tools-valuation.jpg` (1200×630px)
- Create: `public/og-solutions-ci-solar.jpg` (1200×630px)
- Create: `public/og-solutions-wheeling.jpg` (1200×630px)
- Create: `public/og-solutions-energy-optimisation.jpg` (1200×630px)
- Create: `public/og-solutions-carbon-credits.jpg` (1200×630px)
- Create: `public/og-solutions-webuysolar.jpg` (1200×630px)
- Create: `public/og-solutions-ev-fleets.jpg` (1200×630px)

⚠️ **Client/design action** — these are social sharing preview images. Without them, social shares will have no image thumbnail.

- [ ] **Step 1: Create OG images**

Each image: 1200×630px JPEG. Recommended content per image:
- **og-home.jpg**: Phoenix Energy logo + "Clean Energy Solutions for SA Businesses" on #39575C background
- **og-about.jpg**: Team photo or office + Phoenix Energy branding
- **og-tools-valuation.jpg**: Screenshot of step 3 results (blurred) + "What is your solar worth?"
- **Per-solution**: Hero photo of that vertical + solution name + vertical accent colour bar

- [ ] **Step 2: Place in /public and commit**

```bash
git add public/og-*.jpg
git commit -m "feat(seo): add OG images for social sharing"
git push
```

---

## Task 13: Sanity Content Seeding (Client Action)

⚠️ **Client action** — team data entry, blog content, and project data must come from Phoenix Energy.

All content is entered at `https://phoenixenergy.solutions/studio` (Sanity Studio embedded in the site).

- [ ] **Team members** (from TM-1 through TM-6 in `specs/14-OPEN-ITEMS.md`)
  - Create document for each founder: name, photo (400×400px min, set hotspot), role, category: `founders`, archetype, order (1/2/3), active: true, LinkedIn URL, bio (2–4 sentences)

- [ ] **Projects** (minimum 3 to populate grid)
  - Per project: title, slug, vertical, location, completion date, value, stats (4 key metrics), challenge summary, full body, hero image, gallery images

- [ ] **Blog posts** (minimum 3 to populate index)
  - Per post: title, slug, author (must create author first), category, tags, heroImage, excerpt, readTime, body content, featured (true for 1 post), seoTitle, seoDescription

- [ ] **Authors** (created before blog posts)
  - Per author: name, slug, role, photo, bio, LinkedIn URL

---

## Post-Plan Checklist

After all tasks complete, confirm:

- [ ] `https://phoenixenergy.solutions` loads with SSL
- [ ] Vercel shows all env vars set
- [ ] Sanity webhook returns 200
- [ ] Contact form email arrives at inbox
- [ ] Valuation tool paywall email arrives at inbox
- [ ] Google Search Console shows property verified
- [ ] Sitemap submitted and indexed
- [ ] At least 1 blog post, 1 project, 3 team members visible on live site

---

## Environment Variables — Vercel Checklist

Copy this list into Vercel Settings → Environment Variables:

```
NEXT_PUBLIC_GTM_ID          = GTM-NT85F7DX
NEXT_PUBLIC_GA_ID           = G-DE5CEEXBBX
RESEND_API_KEY              = re_BBt1JQFY_...
NEXT_PUBLIC_SANITY_PROJECT_ID = 478nwzw2
NEXT_PUBLIC_SANITY_DATASET  = production
SANITY_API_TOKEN            = skvsGZT5...
NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 6Ldy18UsAAAAAHGkV7...
RECAPTCHA_SECRET_KEY        = 6Ldy18UsAAAAAM2vxlWR...
REVALIDATE_SECRET           = <generated in Task 1>
```

---

*Phoenix Energy Website v3.0 — Phase 9 Deployment Plan | 2026-05-07*

# Phase 8 — Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire all GTM/GA4 analytics events and WebVitals reporting into the Phoenix Energy site.

**Architecture:** A single typed helper `src/lib/analytics.ts` is the only place that touches `window.dataLayer`. All components import `dlPush()` from there — never inline. Scroll depth and blog read completion use `IntersectionObserver`-backed client components that emit events into the same pipeline.

**Tech Stack:** Next.js App Router, TypeScript strict, GTM via `next/script` (already wired), `next/web-vitals`

---

## Already in Place (skip these)

- GTM `<Script>` + noscript in `src/app/layout.tsx` ✅
- Organization JSON-LD in `src/app/layout.tsx` ✅
- Security headers in `next.config.ts` ✅
- `src/app/sitemap.ts` ✅
- `src/app/robots.ts` ✅

---

## Files

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/lib/analytics.ts` | Typed `dlPush()` helper — single touch-point for dataLayer |
| Create | `src/app/_components/WebVitals.tsx` | `useReportWebVitals` → dataLayer |
| Create | `src/components/analytics/ScrollDepth.tsx` | 25/50/75/90% IntersectionObserver sentinels |
| Create | `src/components/analytics/BlogReadDepth.tsx` | 90% read sentinel → `blog_read_complete` |
| Modify | `src/app/layout.tsx` | Mount `<WebVitals>` and `<ScrollDepth>` |
| Modify | `src/app/page.tsx` | Add WebSite + SearchAction JSON-LD |
| Modify | `src/components/sections/ContactForm.tsx` | `form_submit` event on success |
| Modify | `src/components/ui/ProjectDrawer.tsx` | `drawer_open` event when project opens |
| Modify | `src/components/tools/SolarValuationTool.tsx` | `valuation_complete` event on step→3 |
| Modify | `src/components/tools/SoftPaywall.tsx` | `paywall_unlock` event after successful submit |
| Modify | `src/components/sections/SolutionTabs.tsx` | `tab_change` event on tab/accordion change |
| Modify | `src/components/sections/ProjectsGrid.tsx` | `filter_change` event on filter pill select |
| Modify | `src/app/blog/[slug]/page.tsx` | Mount `<BlogReadDepth>` with post slug |

---

### Task 1: Analytics helper

**Files:**
- Create: `src/lib/analytics.ts`

- [ ] **Step 1: Create the typed helper**

```typescript
// src/lib/analytics.ts

type DlEvent =
  | { event: 'form_submit';         form_name: 'contact'; service_interest: string }
  | { event: 'cta_click';           cta_label: string; cta_location: string }
  | { event: 'drawer_open';         project_slug: string; project_vertical: string }
  | { event: 'valuation_complete';  kw: number; bess_kwh: number; install_year: number }
  | { event: 'paywall_unlock';      estimated_value_band: string }
  | { event: 'blog_read_complete';  post_slug: string; post_category?: string }
  | { event: 'tab_change';          vertical: string; tab_label: string }
  | { event: 'filter_change';       filter_value: string }
  | { event: 'scroll_depth';        depth_percentage: 25 | 50 | 75 | 90; page_path: string }
  | { event: 'web_vitals';          metric_name: string; metric_value: number; metric_rating: string };

export function dlPush(payload: DlEvent): void {
  if (typeof window === 'undefined') return;
  (window as unknown as { dataLayer?: object[] }).dataLayer ??= [];
  ((window as unknown as { dataLayer: object[] }).dataLayer).push(payload);
}
```

- [ ] **Step 2: Confirm TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/analytics.ts
git commit -m "feat(analytics): add typed dlPush helper"
```

---

### Task 2: WebVitals component

**Files:**
- Create: `src/app/_components/WebVitals.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create WebVitals component**

```typescript
// src/app/_components/WebVitals.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { dlPush } from '@/lib/analytics';

export function WebVitals() {
  useReportWebVitals(metric => {
    dlPush({
      event: 'web_vitals',
      metric_name: metric.name,
      metric_value: Math.round(metric.value),
      metric_rating: metric.rating,
    });
  });
  return null;
}
```

- [ ] **Step 2: Mount in layout.tsx**

In `src/app/layout.tsx`, add the import after the existing imports:
```typescript
import { WebVitals } from './_components/WebVitals';
```

Inside `<body>`, directly after the `<SiteShell>` closing tag and before the GTM `<Script>`:
```tsx
<WebVitals />
```

- [ ] **Step 3: Confirm TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/_components/WebVitals.tsx src/app/layout.tsx
git commit -m "feat(analytics): add WebVitals reporting to dataLayer"
```

---

### Task 3: Scroll depth sentinels

**Files:**
- Create: `src/components/analytics/ScrollDepth.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create ScrollDepth component**

```typescript
// src/components/analytics/ScrollDepth.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { dlPush } from '@/lib/analytics';

const DEPTHS = [25, 50, 75, 90] as const;

export function ScrollDepth() {
  const pathname = usePathname();
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    firedRef.current = new Set();

    const sentinels = DEPTHS.map(depth => {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;top:${depth}%;left:0;width:1px;height:1px;pointer-events:none;`;
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('data-scroll-sentinel', String(depth));
      document.body.appendChild(el);
      return { el, depth };
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const depth = Number(
          (entry.target as HTMLElement).dataset.scrollSentinel
        ) as (typeof DEPTHS)[number];
        if (firedRef.current.has(depth)) return;
        firedRef.current.add(depth);
        dlPush({ event: 'scroll_depth', depth_percentage: depth, page_path: pathname });
      });
    });

    sentinels.forEach(({ el }) => observer.observe(el));

    return () => {
      observer.disconnect();
      sentinels.forEach(({ el }) => el.remove());
    };
  }, [pathname]);

  return null;
}
```

- [ ] **Step 2: Mount in layout.tsx**

Add import:
```typescript
import { ScrollDepth } from '@/components/analytics/ScrollDepth';
```

Place `<ScrollDepth />` directly after `<WebVitals />` inside `<body>`.

- [ ] **Step 3: Confirm TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/analytics/ScrollDepth.tsx src/app/layout.tsx
git commit -m "feat(analytics): add scroll depth tracking at 25/50/75/90%"
```

---

### Task 4: form_submit event in ContactForm

**Files:**
- Modify: `src/components/sections/ContactForm.tsx`

The form sets `setStatus('success')` at line ~148. Add the `dlPush` call immediately before it.

- [ ] **Step 1: Add import**

At the top of `src/components/sections/ContactForm.tsx`, after existing imports:
```typescript
import { dlPush } from '@/lib/analytics';
```

- [ ] **Step 2: Add event push**

Find the line `setStatus('success');` inside `handleSubmit` (the success branch after `if (!res.ok)` check). Replace it with:
```typescript
dlPush({ event: 'form_submit', form_name: 'contact', service_interest: intent ?? '' });
setStatus('success');
```

- [ ] **Step 3: Confirm TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ContactForm.tsx
git commit -m "feat(analytics): fire form_submit event on contact form success"
```

---

### Task 5: drawer_open event in ProjectDrawer

**Files:**
- Modify: `src/components/ui/ProjectDrawer.tsx`

The drawer receives `project: ProjectPreview | null`. It should fire `drawer_open` once each time `project` transitions from `null` to a non-null value.

- [ ] **Step 1: Add import**

```typescript
import { dlPush } from '@/lib/analytics';
```

- [ ] **Step 2: Add useEffect after existing useEffects**

```typescript
useEffect(() => {
  if (!project) return;
  dlPush({
    event: 'drawer_open',
    project_slug: project.slug.current,
    project_vertical: project.vertical ?? '',
  });
}, [project]);
```

- [ ] **Step 3: Confirm TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ProjectDrawer.tsx
git commit -m "feat(analytics): fire drawer_open event when project drawer opens"
```

---

### Task 6: valuation_complete event in SolarValuationTool

**Files:**
- Modify: `src/components/tools/SolarValuationTool.tsx`

When the user moves to step 3, fire `valuation_complete`. The transition happens at `onNext={() => setStep(3)}` prop of `Step2Condition`.

- [ ] **Step 1: Add import**

```typescript
import { dlPush } from '@/lib/analytics';
```

- [ ] **Step 2: Replace the step transition**

In `SolarValuationTool`, the `Step2Condition` receives `onNext={() => setStep(3)}`. Replace with a named handler:

```typescript
const handleValuationComplete = () => {
  setStep(3);
  dlPush({
    event: 'valuation_complete',
    kw: solar.kw,
    bess_kwh: bess.enabled ? bess.kWh : 0,
    install_year: solar.installYear,
  });
};
```

Then pass `onNext={handleValuationComplete}` to `Step2Condition`.

- [ ] **Step 3: Confirm TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/tools/SolarValuationTool.tsx
git commit -m "feat(analytics): fire valuation_complete event on tool step 3"
```

---

### Task 7: paywall_unlock event in SoftPaywall

**Files:**
- Modify: `src/components/tools/SoftPaywall.tsx`

The paywall calls `onUnlock()` after a successful API response. Fire `paywall_unlock` with the estimated value band just before `onUnlock()`.

- [ ] **Step 1: Add import**

```typescript
import { dlPush } from '@/lib/analytics';
```

- [ ] **Step 2: Add event before onUnlock()**

Find `onUnlock();` inside `handleSubmit` in `SoftPaywall` (after `if (!res.ok) throw new Error('Submission failed');`). Replace with:

```typescript
const band = result.rangeLow >= 1_000_000
  ? `R${Math.round(result.rangeLow / 1_000_000)}M–R${Math.round(result.rangeHigh / 1_000_000)}M`
  : `R${Math.round(result.rangeLow / 1_000)}k–R${Math.round(result.rangeHigh / 1_000)}k`;
dlPush({ event: 'paywall_unlock', estimated_value_band: band });
onUnlock();
```

- [ ] **Step 3: Confirm TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/tools/SoftPaywall.tsx
git commit -m "feat(analytics): fire paywall_unlock event on valuation tool submit"
```

---

### Task 8: tab_change event in SolutionTabs

**Files:**
- Modify: `src/components/sections/SolutionTabs.tsx`

`SolutionTabs` has `setActiveTab` (desktop) and `setOpenIndex` (mobile). Both should fire `tab_change`. The component receives a `tabs` array and needs the vertical from context — but `SolutionTabs` doesn't currently receive a `vertical` prop. Add an optional `vertical` prop (defaults to `''`).

- [ ] **Step 1: Add import and update props**

```typescript
import { dlPush } from '@/lib/analytics';
```

Update `SolutionTabsProps`:
```typescript
export interface SolutionTabsProps {
  tabs: TabItem[];
  accent: string;
  id?: string;
  vertical?: string;
}
```

Destructure the new prop:
```typescript
export function SolutionTabs({ tabs, accent, id, vertical = '' }: SolutionTabsProps) {
```

- [ ] **Step 2: Wrap tab setters with event push**

Find where `setActiveTab` is called on desktop tab click and where `setOpenIndex` is called in accordion click. In both places, add the event.

For desktop tabs (find the `onClick` on the tab button):
```typescript
onClick={() => {
  setActiveTab(i);
  dlPush({ event: 'tab_change', vertical, tab_label: tab.label });
}}
```

For mobile accordion (find `setOpenIndex` call in accordion header):
```typescript
onClick={() => {
  const next = openIndex === i ? -1 : i;
  setOpenIndex(next);
  if (next !== -1) {
    dlPush({ event: 'tab_change', vertical, tab_label: tabs[i].label });
  }
}}
```

- [ ] **Step 3: Pass vertical from all 6 solution pages**

Each solution page renders `<SolutionTabs ... />`. Add `vertical="ci-solar-storage"` (etc.) to each call. The vertical strings are already defined as the page slugs.

Check each of these files and add the `vertical` prop matching the page slug:
- `src/app/solutions/ci-solar-storage/page.tsx` → `vertical="ci-solar-storage"`
- `src/app/solutions/wheeling/page.tsx` → `vertical="wheeling"`
- `src/app/solutions/energy-optimisation/page.tsx` → `vertical="energy-optimisation"`
- `src/app/solutions/carbon-credits/page.tsx` → `vertical="carbon-credits"`
- `src/app/solutions/webuysolar/page.tsx` → `vertical="webuysolar"`
- `src/app/solutions/ev-fleets/page.tsx` → `vertical="ev-fleets"`

- [ ] **Step 4: Confirm TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/SolutionTabs.tsx src/app/solutions/*/page.tsx
git commit -m "feat(analytics): fire tab_change event on SolutionTabs interaction"
```

---

### Task 9: filter_change event in ProjectsGrid

**Files:**
- Modify: `src/components/sections/ProjectsGrid.tsx`

- [ ] **Step 1: Add import**

```typescript
import { dlPush } from '@/lib/analytics';
```

- [ ] **Step 2: Update handleFilterChange**

```typescript
const handleFilterChange = useCallback((filter: SolutionVertical | 'all') => {
  if (filter === activeFilter) return;
  setActiveFilter(filter);
  setVisibleCount(6);
  dlPush({ event: 'filter_change', filter_value: filter });
}, [activeFilter]);
```

- [ ] **Step 3: Confirm TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ProjectsGrid.tsx
git commit -m "feat(analytics): fire filter_change event on projects grid filter"
```

---

### Task 10: blog_read_complete event

**Files:**
- Create: `src/components/analytics/BlogReadDepth.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create BlogReadDepth component**

```typescript
// src/components/analytics/BlogReadDepth.tsx
'use client';

import { useEffect, useRef } from 'react';
import { dlPush } from '@/lib/analytics';

interface BlogReadDepthProps {
  slug: string;
  category?: string;
}

export function BlogReadDepth({ slug, category }: BlogReadDepthProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;bottom:10%;left:0;width:1px;height:1px;pointer-events:none;';
    sentinel.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || firedRef.current) return;
      firedRef.current = true;
      dlPush({ event: 'blog_read_complete', post_slug: slug, post_category: category });
    });

    observer.observe(sentinel);
    return () => { observer.disconnect(); sentinel.remove(); };
  }, [slug, category]);

  return null;
}
```

- [ ] **Step 2: Mount in blog/[slug]/page.tsx**

In `src/app/blog/[slug]/page.tsx`, add import at the top:
```typescript
import { BlogReadDepth } from '@/components/analytics/BlogReadDepth';
```

Find the `return (` in the page's default export function. Add `<BlogReadDepth>` as the first child element inside the outermost fragment/element, passing the post's slug and category:
```tsx
<BlogReadDepth slug={post.slug.current} category={post.category} />
```

(The `post` object is already fetched via `getPost(slug)` before the return.)

- [ ] **Step 3: Confirm TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/analytics/BlogReadDepth.tsx src/app/blog/\[slug\]/page.tsx
git commit -m "feat(analytics): fire blog_read_complete at 90% scroll on blog posts"
```

---

### Task 11: WebSite JSON-LD in home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add the JSON-LD constant and script tag**

In `src/app/page.tsx`, add after the `metadata` export and before `HOME_HIW_STEPS`:

```typescript
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Phoenix Energy',
  url: 'https://phoenixenergy.solutions',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://phoenixenergy.solutions/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};
```

In the `return (` of `HomePage`, wrap the existing `<main>` in a fragment and add the script tag before it:

```tsx
return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
    />
    <main>
      {/* existing content unchanged */}
    </main>
  </>
);
```

- [ ] **Step 2: Confirm TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(seo): add WebSite JSON-LD with SearchAction to home page"
```

---

### Task 12: Smoke-test and final build check

- [ ] **Step 1: Run full type check**

```bash
npx tsc --noEmit
```
Expected: 0 errors

- [ ] **Step 2: Run production build**

```bash
npm run build
```
Expected: Exits with code 0. No type errors, no missing module errors.

- [ ] **Step 3: Spot-check in browser**

```bash
npm run dev
```

Open browser DevTools → Console. Navigate to each of these and verify `dataLayer` receives events:
- `/contact` — fill and submit form → check `form_submit` in `window.dataLayer`
- `/projects` → click a filter pill → check `filter_change`
- `/solutions/ci-solar-storage` → click a tab → check `tab_change`
- `/tools/solar-valuation` → complete steps 1+2 → check `valuation_complete`

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(analytics): Phase 8 complete — all GA4 events, WebVitals, scroll depth wired"
```

---

## Phase 9 — Deployment (Manual Steps)

These steps are performed in the Vercel dashboard and GitHub — no additional code files needed.

### Pre-deploy checklist (code side — already done)
- [x] `next.config.ts` — security headers ✅
- [x] `src/app/sitemap.ts` ✅
- [x] `src/app/robots.ts` ✅

### Vercel project setup

1. Go to [vercel.com](https://vercel.com) → New Project → Import Git Repository
2. Select the `Phoenix-Website-V3` repo → Framework preset: **Next.js** (auto-detected)
3. Root directory: `website/phoenix-energy` (if monorepo) — or root if standalone
4. Build command: `npm run build` (default)
5. Output directory: `.next` (default)

### Environment variables to set in Vercel dashboard

| Variable | Value source |
|----------|-------------|
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager → container ID (e.g. `GTM-XXXXXXX`) |
| `NEXT_PUBLIC_GA_ID` | GA4 Measurement ID (e.g. `G-XXXXXXXXXX`) |
| `RESEND_API_KEY` | Resend dashboard → API Keys |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `478nwzw2` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | Sanity → API → Tokens (viewer token for SSR reads) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 → site key |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 → secret key |
| `REVALIDATE_SECRET` | Any long random string (used by Sanity webhook) |

### Custom domain

1. Vercel → Project Settings → Domains → Add `phoenixenergy.solutions`
2. At your DNS provider, add:
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`
3. Wait for SSL cert to provision (~2 min)

### Sanity webhook (after domain is live)

1. Sanity → API → Webhooks → Create webhook
2. URL: `https://phoenixenergy.solutions/api/revalidate`
3. Trigger on: Create, Update, Delete for all document types
4. HTTP Method: POST
5. Secret header: `REVALIDATE_SECRET` value

### Post-deploy verification

```bash
# Check sitemap is reachable
curl https://phoenixenergy.solutions/sitemap.xml

# Check robots.txt
curl https://phoenixenergy.solutions/robots.txt

# Check security headers
curl -I https://phoenixenergy.solutions | grep -E "X-Frame|X-Content|Referrer"
```

---

*Phoenix Energy Website v3 | Phase 8 Analytics + Phase 9 Deployment*

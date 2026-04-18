# 13 — Analytics & Tracking
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0

---

## Setup

- **Google Tag Manager** — container ID in `NEXT_PUBLIC_GTM_ID`
- **Google Analytics 4** — property connected via GTM (not directly)
- GTM script injected via `next/script` in `src/app/layout.tsx`

```tsx
// GTM snippet in layout.tsx
<Script id="gtm" strategy="afterInteractive">
  {`(function(w,d,s,l,i){...})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
</Script>
```

---

## Conversion Events

| Event | Trigger | GTM tag |
|---|---|---|
| `form_submit` | Contact form success | GA4 Event |
| `cta_click` | Any "Get a Quote" button | GA4 Event |
| `tool_interaction` | Calculator input change | GA4 Event |
| `solution_view` | Solution page visit | GA4 Page View |
| `project_view` | Single project page visit | GA4 Page View |
| `filter_change` | Projects filter pill click | GA4 Event |

---

## dataLayer Push (contact form)

```typescript
window.dataLayer?.push({
  event: 'form_submit',
  form_name: 'contact',
  service_interest: formData.service,
});
```

---

*Spoke of [`/CLAUDE.md`](/CLAUDE.md)*

---

## Extended Analytics Spec (Engineering Review April 2026)

### Google Search Console verification
Add to `src/app/layout.tsx` metadata:
```typescript
verification: { google: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' }
// Replace with actual verification token from Search Console → Settings → Ownership verification
```
⚠️ Add verification token to `14-OPEN-ITEMS.md` — requires client to register property.

### Web Vitals reporting
```typescript
// src/app/_components/WebVitals.tsx ('use client')
import { useReportWebVitals } from 'next/web-vitals';
export function WebVitals() {
  useReportWebVitals(metric => {
    window.dataLayer?.push({ event: 'web_vitals', metric_name: metric.name, metric_value: Math.round(metric.value), metric_rating: metric.rating });
  });
  return null;
}
// Mount in layout.tsx
```

### Additional conversion events
```typescript
// Add to existing dataLayer push library:
'drawer_open'         // ProjectDrawer opens: { project_slug, project_vertical }
'valuation_complete'  // WeBuySolar tool reaches step 3: { kw, bess_kwh, install_year }
'paywall_unlock'      // WeBuySolar user submits details to unlock results: { estimated_value_band }
'blog_read_complete'  // 90% scroll depth on /blog/[slug]: { post_slug, post_category }
'tab_change'          // Solution page tab switch: { vertical, tab_label }
'filter_change'       // Already in spec — add: { filter_value }
```

### Scroll depth milestones
Triggered at 25%, 50%, 75%, 90% on all pages:
```typescript
// Push to dataLayer: { event: 'scroll_depth', depth_percentage: 25|50|75|90, page_path: pathname }
// Implement via IntersectionObserver on hidden sentinel divs at each threshold
```

### Funnel definition (for GA4 exploration report)
```
Step 1: Session start (any page)
Step 2: Solution page view (/solutions/*)
Step 3: Contact form start (Step 1 intent selection)
Step 4: Contact form submit (form_submit event)
```
Secondary funnel for WeBuySolar:
```
Step 1: /tools/solar-valuation page view
Step 2: valuation_complete (step 3 reached)
Step 3: paywall_unlock (details submitted)
```


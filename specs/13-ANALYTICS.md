# 13 — Analytics & Tracking
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0
> **Updated 2026-09-24:** corrected to match the build. Event names and payloads come from `src/lib/analytics.ts` and the `dlPush()` calls in `src/`.

---

## Setup

- **Google Tag Manager** — container ID in `NEXT_PUBLIC_GTM_ID`
- **Google Analytics 4** — property connected via GTM (not directly)
- GTM script injected via `next/script` in `src/app/layout.tsx`, only when `NEXT_PUBLIC_GTM_ID` is set, with a `<noscript>` iframe fallback.
- Every event goes through `dlPush()` in `src/lib/analytics.ts`, which types each event and its payload (`DlEvent`) and pushes it to `window.dataLayer`.

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
| `cta_click` | A result button in one of the four solution tools: Strategy Finder, wheeling eligibility check, carbon estimator, fleet estimator | GA4 Event |
| `strategy_finder_start`, `strategy_finder_complete`, `strategy_learn_more` | Strategy Finder on C&I Solar & Storage: first goal picked; result shown; a strategy chip under "Learn more" on the result clicked | GA4 Event |
| `wheeling_eligibility_start`, `wheeling_eligibility_complete` | Wheeling eligibility check: first supply point picked; result shown | GA4 Event |
| `carbon_estimate_used` | Carbon Credits estimator: first move of the system size slider | GA4 Event |
| `fleet_estimate_used` | EV Fleets estimator: first change to any input | GA4 Event |
| `solution_view` | Solution page visit | GA4 Page View |
| `project_view` | Single project page visit | GA4 Page View |
| `filter_change` | Projects filter pill click | GA4 Event |

The build has no `tool_interaction` event; each tool pushes the events above instead. Nothing in `src/` pushes `solution_view` or `project_view`: if they exist, they are page-view triggers set up in the GTM container. Payloads are listed under Additional conversion events below.

---

## dataLayer Push (contact form)

```typescript
// src/components/sections/ContactForm.tsx, after /api/contact returns OK
dlPush({
  event: 'form_submit',
  form_name: 'contact',
  service_interest: intent ?? '',  // 'client' | 'partner' | 'investor'
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

Not added yet: the `layout.tsx` metadata has no `verification` field (open item 7).

### Web Vitals reporting
```typescript
// src/app/_components/WebVitals.tsx ('use client')
import { useReportWebVitals } from 'next/web-vitals';
import { dlPush } from '@/lib/analytics';
export function WebVitals() {
  useReportWebVitals(metric => {
    dlPush({ event: 'web_vitals', metric_name: metric.name, metric_value: Math.round(metric.value), metric_rating: metric.rating });
  });
  return null;
}
// Mounted in layout.tsx, beside <ScrollDepth />
```

### Additional conversion events
```typescript
// src/lib/analytics.ts (DlEvent), pushed with dlPush():
'cta_click'                     // tool result button: { cta_label, cta_location }
                                // cta_location: 'strategy_finder_result:<strategy>', 'wheeling_eligibility_result:<status>',
                                // 'carbon_estimator_result' or 'fleet_estimator_result'
'valuation_complete'            // WeBuySolar tool reaches step 3, once per page load: { kw, bess_kwh, install_year }
'valuation_lead'                // valuation request sent (Step3Capture, after the API returns OK): { kw, has_battery }
'blog_read_complete'            // 90% scroll depth on /blog/[slug]: { post_slug, post_category }
'tab_change'                    // Solution page tab switch, or an accordion panel opened on phones: { vertical, tab_label }
'filter_change'                 // /projects filter pill: { filter_value }
'strategy_finder_start'         // first goal picked: { vertical }
'strategy_finder_complete'      // result shown: { vertical, goal, energy_rate, demand_charge, usage, strategy }
'strategy_learn_more'           // strategy chip under "Learn more": { vertical, strategy }
'wheeling_eligibility_start'    // first supply point picked: { vertical }
'wheeling_eligibility_complete' // result shown: { vertical, tou, supply_point, status }
'carbon_estimate_used'          // first slider move: { vertical, size_kwp }
'fleet_estimate_used'           // first input change: { vertical, vehicles, charging }, as they are after that change
```

`drawer_open` and `paywall_unlock` are still in the `DlEvent` type, but nothing pushes them: the project drawer was removed in September 2026, and the valuation tool has no paywall.

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
Step 3: /contact page view (no event marks the form start or the intent choice)
Step 4: Contact form submit (form_submit event)
```
Secondary funnel for WeBuySolar:
```
Step 1: /tools/solar-valuation page view
Step 2: valuation_complete (step 3 reached)
Step 3: valuation_lead (request sent)
```


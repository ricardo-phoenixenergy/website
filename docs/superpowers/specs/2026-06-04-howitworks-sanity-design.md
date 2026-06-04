# Design: Sanity-driven "How It Works" sections

> Date: 2026-06-04
> Status: Approved (pending spec review)

## Goal

Make the **How It Works** section content-managed from Sanity for the **home page**
and all **6 solutions pages** (7 instances total), so non-technical editors can
configure the eyebrow, title, subtitle, steps and CTA from the Studio. Today this
content is hardcoded in React (`HOME_HIW_STEPS` in `src/app/page.tsx` and an inline
`steps` array on each solution page).

Also: delete the dead `SolutionSubNav` component and its orphaned anchor IDs.

## Decisions (from brainstorming)

1. **Editable fields:** everything that is content — eyebrow, title (with `<em>` accent),
   subtitle, steps (`label` / `description` / `tag`), and the CTA (`showCta` / `ctaLabel` /
   `ctaHref`). Auto-advance timing, animations and colours stay in code.
2. **Fallback behaviour:** **hide the section** when its Sanity doc is missing/empty or
   Sanity errors. No hardcoded fallback content at runtime.
3. **Schema model:** **Approach A — fixed singleton panels.** One `howItWorks` document
   type surfaced in the Studio as 7 pre-defined, fixed-ID panels (no create/delete),
   mirroring the existing `companyStats` singleton pattern.
4. **Sub-nav:** `SolutionSubNav.tsx` is dead code (never imported). Delete it **and**
   remove the now-orphaned anchor wrappers (`#tabs`, `#how-it-works`, `#projects`) from
   the solution pages.

## Page keys

Reuse the existing `SolutionVertical` slugs plus `home`. Each maps to a fixed Sanity
document ID `howItWorks.<key>`:

| Key | Document ID | Page path |
|---|---|---|
| `home` | `howItWorks.home` | `/` |
| `ci-solar-storage` | `howItWorks.ci-solar-storage` | `/solutions/ci-solar-storage` |
| `wheeling` | `howItWorks.wheeling` | `/solutions/wheeling` |
| `energy-optimisation` | `howItWorks.energy-optimisation` | `/solutions/energy-optimisation` |
| `carbon-credits` | `howItWorks.carbon-credits` | `/solutions/carbon-credits` |
| `webuysolar` | `howItWorks.webuysolar` | `/solutions/webuysolar` |
| `ev-fleets` | `howItWorks.ev-fleets` | `/solutions/ev-fleets` |

## Architecture

### 1. Schema — `sanity/schemaTypes/howItWorks.ts` (new)

`defineType` document `howItWorks` with fields:

| Field | Type | Validation / notes |
|---|---|---|
| `eyebrow` | `string` | `initialValue: 'How it works'` |
| `title` | `string` | required. Description: wrap the accent word in `<em>…</em>`, e.g. `From assessment to <em>savings in weeks</em>`. |
| `subtitle` | `text` (rows: 2) | optional. Replaces the currently-hardcoded paragraph. |
| `steps` | `array` | required, `min(2)`. `of` an inline object `{ label: string (req), description: text (req), tag: string (optional) }`, with a preview (`title: label`, `subtitle: tag`). |
| `showCta` | `boolean` | `initialValue: true` |
| `ctaLabel` | `string` | shown via `hidden: ({parent}) => !parent?.showCta` |
| `ctaHref` | `string` | shown via `hidden: ({parent}) => !parent?.showCta` |

Document `preview`: `title` field + step count as subtitle.

Register in `sanity/schemaTypes/index.ts`.

### 2. Studio structure — `sanity.config.ts`

Add a "How It Works" group to the structure list, containing 7 `S.document().schemaType('howItWorks').documentId('howItWorks.<key>')` entries with friendly titles (Home, C&I Solar & Storage, Wheeling, Energy Optimisation, Carbon Credits, WeBuySolar, EV Fleets). Because the structure list enumerates types explicitly, `howItWorks` will not appear as a separately-creatable type elsewhere.

### 3. Component — `src/components/sections/HowItWorks.tsx`

Add one prop: `subtitle?: string`. Replace the hardcoded paragraph
("A simple, transparent process…") with `{subtitle && <p …>{subtitle}</p>}`.
No other changes; the existing `<em>` title parsing, animation, props and layout stay.

### 4. Types — `src/types/sanity.ts`

```ts
export interface HowItWorksStep {
  label: string;
  description: string;
  tag?: string;
}
export interface HowItWorksContent {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: HowItWorksStep[];
  showCta?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}
```

### 5. Query — `src/lib/queries.ts`

```groq
HOW_IT_WORKS_QUERY =
*[_id == $id][0]{
  eyebrow, title, subtitle,
  steps[]{ label, description, tag },
  showCta, ctaLabel, ctaHref
}
```

### 6. Fetch helper — `src/lib/getHowItWorks.ts` (new)

```ts
export async function getHowItWorks(pageKey: string): Promise<HowItWorksContent | null>
```

- Builds id `howItWorks.${pageKey}`, fetches with `HOW_IT_WORKS_QUERY`.
- Returns `null` when: doc missing, `title` empty, or `steps` empty/absent → drives "hide if empty".
- `try/catch` → returns `null` (never throws), matching the graceful pattern in `getCompanyStats`.

### 7. Page wiring

- **`src/app/page.tsx`** (already `async`): `const hiw = await getHowItWorks('home')`; render
  `{hiw && <HowItWorks {...hiw} autoAdvanceInterval={2600} />}`. Remove `HOME_HIW_STEPS`.
- **Each of the 6 `src/app/solutions/<vertical>/page.tsx`**:
  - Make the page component `async`.
  - `const hiw = await getHowItWorks('<vertical>')`; render `{hiw && <HowItWorks {...hiw} />}`.
  - Remove the inline `steps` array.
  - Add `export const revalidate = 3600` (home already has it) so edits surface without redeploy.
  - Remove the orphaned anchor wrappers: the `<div id="how-it-works">` and `<div id="projects">`
    wrappers (render children directly) and the `id="tabs"` prop on `<SolutionTabs>`
    (confirm `id` is optional on `SolutionTabs`; make optional if not).

### 8. Revalidation — `src/app/api/revalidate/route.ts`

Add a branch keyed on `_type === 'howItWorks'` that derives the path from the document `_id`:
`howItWorks.home` → `revalidatePath('/')`; `howItWorks.<vertical>` →
`revalidatePath('/solutions/<vertical>')`. Requires the Sanity webhook projection to include
`_id` and `_type` (it already sends `_type`).

### 9. Seeding — `scripts/seedHowItWorks.ts` (new, one-off)

A Node script using `@sanity/client` with `SANITY_API_TOKEN` that `createOrReplace`s the 7
`howItWorks.<key>` documents with **today's exact content** (the current `HOME_HIW_STEPS`, and
each solution's current `title` / `steps` / CTA). Because empty docs hide the section, this
**must run before or at deploy** so no How It Works section disappears in production.
Document the run command (e.g. `npx tsx scripts/seedHowItWorks.ts`).

## Data flow

```
Editor (Studio singleton panel)
        │  writes howItWorks.<key>
        ▼
Sanity ──(webhook _id,_type)──▶ /api/revalidate ─▶ revalidatePath(page)
        ▲
        │ HOW_IT_WORKS_QUERY ($id = howItWorks.<key>)
getHowItWorks(key) ──▶ HowItWorksContent | null
        │
        ▼
Page (server component): { content && <HowItWorks {...content} /> }
```

## Files touched

**New:** `sanity/schemaTypes/howItWorks.ts`, `src/lib/getHowItWorks.ts`,
`scripts/seedHowItWorks.ts`.
**Edited:** `sanity/schemaTypes/index.ts`, `sanity.config.ts`,
`src/components/sections/HowItWorks.tsx`, `src/lib/queries.ts`, `src/types/sanity.ts`,
`src/app/page.tsx`, `src/app/solutions/<6 verticals>/page.tsx`,
`src/app/api/revalidate/route.ts`.
**Deleted:** `src/components/sections/SolutionSubNav.tsx`.

## Out of scope (YAGNI)

- Modelling the rest of the solutions page (hero, tabs, calculators) in Sanity.
- Making `autoAdvanceInterval` editable.
- A friendlier title-accent editor (keep the `<em>` string convention with a field note).

## Risks / notes

- **Go-live ordering:** "hide if empty" means the seed (step 9) must land before the new
  page code is live, or sections vanish. Implementation plan will sequence this.
- **`<em>` convention:** editors must type `<em>…</em>` for the accent word; mitigated with a
  clear field description and example.

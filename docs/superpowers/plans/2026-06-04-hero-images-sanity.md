# Sanity-managed Hero Images — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the per-vertical hero images (home accordion + solution pages) editable from Sanity via a single `heroImages` document, with the 6 existing PNGs seeded in.

**Architecture:** A `heroImages` singleton (6 image fields, one per vertical) read server-side through the authenticated `sanityServerClient`. The home page passes the resolved image map into the client `HeroAccordion`; each solution page passes its vertical's image to `SolutionHero`. Missing images fall back to the existing gradient.

**Tech Stack:** Next.js 16 App Router (RSC + a client accordion), Sanity v5 (`next-sanity` / `@sanity/client`), `next/image`.

**Verification note:** No unit-test runner exists (scripts are only dev/build/start/lint). Verify with `npx tsc --noEmit`, `npm run lint`, `npm run build`, and a manual check — do NOT add a test framework.

**Sequencing (require-Sanity):** Tasks 1–6 are non-breaking. **Task 7 seeds + uploads the 6 images** and must run **before** the page-wiring (Tasks 8–10) is deployed, or heroes render as gradients. Do all work on a feature branch; run the seed against production before merging.

**Branch:** create `feat/hero-images-sanity` before starting.

---

## Vertical ↔ field ↔ file

| Vertical | Field | File |
|---|---|---|
| `ci-solar-storage` | `ciSolarStorage` | `public/hero-solar.png` |
| `wheeling` | `wheeling` | `public/hero-wheeling.png` |
| `energy-optimisation` | `energyOptimisation` | `public/hero-optimisation.png` |
| `carbon-credits` | `carbonCredits` | `public/hero-carbon.png` |
| `webuysolar` | `webuysolar` | `public/hero-webuysolar.png` |
| `ev-fleets` | `evFleets` | `public/hero-ev.png` |

---

## Task 1: Add hero image types

**Files:** Modify `src/types/sanity.ts`

- [ ] **Step 1: Append** to `src/types/sanity.ts` (imports `SolutionVertical` — add the import at top if not present: `import type { SolutionVertical } from '@/types/solutions';`):

```ts
export interface HeroImageAsset {
  url: string;
  lqip?: string;
}

export type HeroImages = Partial<Record<SolutionVertical, HeroImageAsset | null>>;
```

- [ ] **Step 2:** `npx tsc --noEmit` → no errors.
- [ ] **Step 3:** Commit: `git add src/types/sanity.ts && git commit -m "feat(types): add HeroImages types"`

---

## Task 2: Create `heroImages` schema + register

**Files:** Create `sanity/schemaTypes/heroImages.ts`; Modify `sanity/schemaTypes/index.ts`

- [ ] **Step 1: Create `sanity/schemaTypes/heroImages.ts`:**

```ts
import { defineType, defineField } from 'sanity';

/**
 * Singleton holding the per-vertical hero images, used in the home-page
 * HeroAccordion and on each solution page hero. Edited via the "Hero Images"
 * panel in sanity.config.ts. A missing image falls back to the page's gradient.
 */
const verticalField = (name: string, title: string) =>
  defineField({ name, title, type: 'image', options: { hotspot: true } });

export const heroImages = defineType({
  name: 'heroImages',
  title: 'Hero Images',
  type: 'document',
  fields: [
    verticalField('ciSolarStorage', 'C&I Solar & Storage'),
    verticalField('wheeling', 'Wheeling'),
    verticalField('energyOptimisation', 'Energy Optimisation'),
    verticalField('carbonCredits', 'Carbon Credits'),
    verticalField('webuysolar', 'WeBuySolar'),
    verticalField('evFleets', 'EV Fleets'),
  ],
  preview: { prepare: () => ({ title: 'Hero Images' }) },
});
```

- [ ] **Step 2: Register** in `sanity/schemaTypes/index.ts` — add import and append to the array:

```ts
import { project } from './project';
import { blogPost } from './blogPost';
import { author } from './author';
import { teamMember } from './teamMember';
import { milestoneTimeline } from './milestoneTimeline';
import { partner } from './partner';
import { companyStats } from './companyStats';
import { howItWorks } from './howItWorks';
import { heroImages } from './heroImages';

export const schemaTypes = [project, blogPost, author, teamMember, milestoneTimeline, partner, companyStats, howItWorks, heroImages];
```

- [ ] **Step 3:** `npx tsc --noEmit` → no errors.
- [ ] **Step 4:** Commit: `git add sanity/schemaTypes/heroImages.ts sanity/schemaTypes/index.ts && git commit -m "feat(sanity): add heroImages singleton schema"`

---

## Task 3: Add the Studio panel

**Files:** Modify `sanity.config.ts`

- [ ] **Step 1:** In `sanity.config.ts`, inside the `.items([ ... ])` array, after the Company Stats `listItem` (and the How It Works group if present), add:

```ts
            S.divider(),
            S.listItem()
              .title('Hero Images')
              .id('heroImages')
              .child(S.document().schemaType('heroImages').documentId('heroImages')),
```

- [ ] **Step 2:** `npx tsc --noEmit` → no errors.
- [ ] **Step 3:** Commit: `git add sanity.config.ts && git commit -m "feat(sanity): add Hero Images studio panel"`

---

## Task 4: Add the GROQ query

**Files:** Modify `src/lib/queries.ts`

- [ ] **Step 1: Append** to `src/lib/queries.ts`:

```ts
export const HERO_IMAGES_QUERY = `
  *[_id == "heroImages"][0]{
    "ci-solar-storage":    ciSolarStorage{ "url": asset->url, "lqip": asset->metadata.lqip },
    "wheeling":            wheeling{ "url": asset->url, "lqip": asset->metadata.lqip },
    "energy-optimisation": energyOptimisation{ "url": asset->url, "lqip": asset->metadata.lqip },
    "carbon-credits":      carbonCredits{ "url": asset->url, "lqip": asset->metadata.lqip },
    "webuysolar":          webuysolar{ "url": asset->url, "lqip": asset->metadata.lqip },
    "ev-fleets":           evFleets{ "url": asset->url, "lqip": asset->metadata.lqip }
  }
`;
```

- [ ] **Step 2:** `npx tsc --noEmit` → no errors.
- [ ] **Step 3:** Commit: `git add src/lib/queries.ts && git commit -m "feat(queries): add HERO_IMAGES_QUERY"`

---

## Task 5: Create `getHeroImages` helper

**Files:** Create `src/lib/getHeroImages.ts`

- [ ] **Step 1: Create `src/lib/getHeroImages.ts`:**

```ts
import { sanityServerClient } from '@/lib/sanity.server';
import { HERO_IMAGES_QUERY } from '@/lib/queries';
import type { HeroImages } from '@/types/sanity';

/**
 * Fetches the per-vertical hero images. Returns a map keyed by vertical slug
 * ({ url, lqip } or null per vertical), or {} on error — callers then fall back
 * to the page gradient. Never throws.
 */
export async function getHeroImages(): Promise<HeroImages> {
  try {
    const data = await sanityServerClient.fetch<HeroImages | null>(HERO_IMAGES_QUERY);
    return data ?? {};
  } catch {
    return {};
  }
}
```

- [ ] **Step 2:** `npx tsc --noEmit` → no errors.
- [ ] **Step 3:** Commit: `git add src/lib/getHeroImages.ts && git commit -m "feat(lib): add getHeroImages helper"`

---

## Task 6: Revalidate on heroImages changes

**Files:** Modify `src/app/api/revalidate/route.ts`

- [ ] **Step 1:** After the existing `if (type === 'howItWorks' && id) { ... }` block (before the final `return`), add:

```ts
  if (type === 'heroImages') {
    revalidatePath('/');
    for (const v of ['ci-solar-storage', 'wheeling', 'energy-optimisation', 'carbon-credits', 'webuysolar', 'ev-fleets']) {
      revalidatePath(`/solutions/${v}`);
    }
  }
```

- [ ] **Step 2:** `npx tsc --noEmit` → no errors.
- [ ] **Step 3:** Commit: `git add src/app/api/revalidate/route.ts && git commit -m "feat(revalidate): revalidate hero pages on heroImages change"`

---

## Task 7: Seed — upload the 6 images and create the doc

**Files:** Create `scripts/seedHeroImages.mjs`

> Requires `SANITY_API_TOKEN` with write permission (already confirmed available).

- [ ] **Step 1: Create `scripts/seedHeroImages.mjs`:**

```js
import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';

try {
  const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* env may already be set */ }

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// field name -> public file
const MAP = {
  ciSolarStorage: 'hero-solar.png',
  wheeling: 'hero-wheeling.png',
  energyOptimisation: 'hero-optimisation.png',
  carbonCredits: 'hero-carbon.png',
  webuysolar: 'hero-webuysolar.png',
  evFleets: 'hero-ev.png',
};

const run = async () => {
  const doc = { _id: 'heroImages', _type: 'heroImages' };
  for (const [field, file] of Object.entries(MAP)) {
    const buffer = readFileSync(new URL(`../public/${file}`, import.meta.url));
    const asset = await client.assets.upload('image', buffer, { filename: file });
    doc[field] = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    console.log('uploaded', file, '->', asset._id);
  }
  await client.createOrReplace(doc);
  console.log('created heroImages doc with', Object.keys(MAP).length, 'images.');
};

run().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Run it**

Run: `node scripts/seedHeroImages.mjs`
Expected: prints `uploaded hero-solar.png -> image-…` for all 6, then `created heroImages doc with 6 images.`

- [ ] **Step 3: Verify in Studio (manual).** `npm run dev`, open `/studio` → "Hero Images" → confirm all 6 fields show an image. Stop the dev server.

- [ ] **Step 4:** Commit the script: `git add scripts/seedHeroImages.mjs && git commit -m "chore(sanity): add seed script for hero images"`

---

## Task 8: Add `heroBlur` prop to SolutionHero

**Files:** Modify `src/components/sections/SolutionHero.tsx`

- [ ] **Step 1: Add the prop** to `SolutionHeroProps` (after `heroImage?: string;`):

```ts
  heroImage?: string;  // photo URL (Sanity) — falls back to heroBg gradient
  heroBlur?: string;   // LQIP blur placeholder for heroImage
```

- [ ] **Step 2: Destructure** `heroBlur` in the component params (after `heroImage,`):

```ts
export function SolutionHero({
  title,
  subtitle,
  accent,
  badge,
  heroImage,
  heroBlur,
  heroBg,
  primaryCta,
  children,
}: SolutionHeroProps) {
```

- [ ] **Step 3: Use the blur** in the `<Image>` — replace the existing image branch:

```tsx
      {heroImage ? (
        <Image
          src={heroImage}
          alt={badge}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          {...(heroBlur ? { placeholder: 'blur' as const, blurDataURL: heroBlur } : {})}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: heroBg }} />
      )}
```

- [ ] **Step 4:** `npx tsc --noEmit` → no errors.
- [ ] **Step 5:** Commit: `git add src/components/sections/SolutionHero.tsx && git commit -m "feat(solution-hero): support Sanity image blur placeholder"`

---

## Task 9: Make HeroAccordion image-driven from a prop

**Files:** Modify `src/components/sections/HeroAccordion.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Update imports + types** in `HeroAccordion.tsx`. Add to the top imports:

```ts
import type { HeroImages } from '@/types/sanity';
```

- [ ] **Step 2: Remove `image` from the `Panel` interface:**

```ts
interface Panel {
  vertical: SolutionVertical;
  number: string;
  href: string;
  title: string;
  description: string;
}
```

- [ ] **Step 3: Remove the `image:` line from all 6 `PANELS` entries.** The array becomes:

```ts
const PANELS: Panel[] = [
  {
    vertical: 'ci-solar-storage',
    number: '01',
    href: '/solutions/ci-solar-storage',
    title: 'Power your business with solar & storage',
    description: 'Design, finance, install and operate solar + BESS systems for C&I clients across Southern Africa.',
  },
  {
    vertical: 'wheeling',
    number: '02',
    href: '/solutions/wheeling',
    title: 'Buy cheaper renewable energy via the grid',
    description: 'Access clean, cost-effective electricity through our established wheeling network — no equipment required.',
  },
  {
    vertical: 'webuysolar',
    number: '03',
    href: '/solutions/webuysolar',
    title: 'Sell your solar system fast & fair',
    description: 'Get an instant valuation and formal offer within 5 business days. Phoenix Energy buys and redeploys solar assets.',
  },
  {
    vertical: 'energy-optimisation',
    number: '04',
    href: '/solutions/energy-optimisation',
    title: 'Eliminate energy waste intelligently',
    description: 'Expert audit, tariff restructuring and demand management — maximise every kilowatt at zero cost.',
  },
  {
    vertical: 'ev-fleets',
    number: '05',
    href: '/solutions/ev-fleets',
    title: 'Electrify your fleet from day one',
    description: 'End-to-end fleet electrification — infrastructure, vehicles, financing and management in one solution.',
  },
  {
    vertical: 'carbon-credits',
    number: '06',
    href: '/solutions/carbon-credits',
    title: 'Turn clean energy into certified revenue',
    description: 'Register, certify and monetise carbon credits from your renewable assets under the Gold Standard.',
  },
];
```

- [ ] **Step 4: Add a shared `PanelBackground` component** (place it just above `ActivePanelContent`):

```tsx
function PanelBackground({
  img, alt, accent, isActive, sizes, priority,
}: {
  img: { url: string; lqip?: string } | null | undefined;
  alt: string;
  accent: string;
  isActive: boolean;
  sizes: string;
  priority: boolean;
}) {
  if (!img?.url) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, #0d1f22 0%, ${accent} 160%)` }}
      />
    );
  }
  return (
    <Image
      src={img.url}
      alt={alt}
      fill
      className={`object-cover transition-transform duration-[800ms] ease-in-out ${isActive ? 'scale-105' : 'scale-100'}`}
      sizes={sizes}
      priority={priority}
      quality={85}
      {...(img.lqip ? { placeholder: 'blur' as const, blurDataURL: img.lqip } : {})}
    />
  );
}
```

- [ ] **Step 5: Thread `heroImages` through the sub-components.** Change `DesktopAccordion` and `MobileAccordion` signatures to accept it:

```tsx
function DesktopAccordion({ heroImages }: { heroImages: HeroImages }) {
```
```tsx
function MobileAccordion({ heroImages }: { heroImages: HeroImages }) {
```

- [ ] **Step 6: Replace the desktop `<Image …>`** (the block currently `<Image src={panel.image} … sizes="(max-width: 768px) 100vw, 50vw" priority={i === 0} quality={85} />`) with:

```tsx
            <PanelBackground
              img={heroImages[panel.vertical]}
              alt={panel.title}
              accent={meta.accent}
              isActive={isActive}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
```

- [ ] **Step 7: Replace the mobile `<Image …>`** (the block currently `<Image src={panel.image} … sizes="100vw" priority={i === 0} quality={85} />`) with:

```tsx
              <PanelBackground
                img={heroImages[panel.vertical]}
                alt={panel.title}
                accent={meta.accent}
                isActive={isActive}
                sizes="100vw"
                priority={i === 0}
              />
```

- [ ] **Step 8: Update the public export** to take the prop and pass it down:

```tsx
export function HeroAccordion({ heroImages }: { heroImages: HeroImages }) {
  return (
    <>
      <div className="hidden xl:block">
        <DesktopAccordion heroImages={heroImages} />
      </div>
```
(and pass `heroImages={heroImages}` to `<MobileAccordion … />` in the same export — find the `<MobileAccordion` usage and add the prop.)

- [ ] **Step 9: Wire the home page.** In `src/app/page.tsx`: add `import { getHeroImages } from '@/lib/getHeroImages';`, then inside `HomePage` after the other awaits add `const heroImages = await getHeroImages();`, and change `<HeroAccordion />` to `<HeroAccordion heroImages={heroImages} />`.

- [ ] **Step 10:** `npx tsc --noEmit` → no errors.
- [ ] **Step 11:** Commit: `git add src/components/sections/HeroAccordion.tsx src/app/page.tsx && git commit -m "feat(home): drive HeroAccordion images from Sanity"`

---

## Task 10: Wire the 6 solution-page heroes

**Files (identical edit each):** `src/app/solutions/{ci-solar-storage,wheeling,energy-optimisation,carbon-credits,webuysolar,ev-fleets}/page.tsx`

Each page is already `async` and declares `const vertical = '<key>' as const;`.

- [ ] **Step 1: Add the import** alongside the others: `import { getHeroImages } from '@/lib/getHeroImages';`
- [ ] **Step 2: Fetch the image.** After the existing `const howItWorks = await getHowItWorks(vertical);` line, add:

```ts
  const hero = (await getHeroImages())[vertical];
```

- [ ] **Step 3: Pass it to `<SolutionHero>`.** Replace the existing hardcoded `heroImage="/hero-*.png"` attribute with:

```tsx
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
```
Leave `heroBg`, `title`, `subtitle`, `accent`, `badge`, `primaryCta`, and the calculator child unchanged.

- [ ] **Step 4: After editing all six**, `npx tsc --noEmit` → no errors.
- [ ] **Step 5:** Commit: `git add src/app/solutions && git commit -m "feat(solutions): drive hero images from Sanity"`

---

## Task 11: Final integration check

- [ ] **Step 1:** `npm run lint` — no NEW errors in the changed files (pre-existing lint debt in unrelated files may remain).
- [ ] **Step 2:** `npm run build` — succeeds; `/` and all 6 `/solutions/*` compile.
- [ ] **Step 3: Manual smoke test.** `npm run dev`; visit `/` (accordion shows the seeded photos) and a solution page (hero shows the seeded photo). Stop the dev server.
- [ ] **Step 4: Push** and open a PR (deploy gate: the seed in Task 7 must have run against the production dataset before this merges to production).

---

## Done when
- All 6 hero images render from Sanity on the home accordion and the solution pages.
- Uploading a new image in the Studio "Hero Images" panel updates the heroes (instantly via the working webhook, else within the ISR hour).
- A missing image falls back to the gradient (no broken `<Image>`).
- `npm run build` passes.

# Design: Sanity-managed hero images

> Date: 2026-06-04
> Status: Approved (pending spec review)

## Goal

Make the per-vertical hero images editable from Sanity. Today they're hardcoded
`/public/hero-*.png` paths in two places: the home-page `HeroAccordion` `PANELS`
array and each solution page's `<SolutionHero heroImage=… />`. One image per
vertical is shared by both; that stays true — a single Sanity image per vertical
feeds both the accordion panel and the solution-page hero.

## Decisions (from brainstorming)

1. **Sharing:** one shared hero image per vertical, used in both the home accordion
   and the solution page (matches today).
2. **Source of truth:** **require Sanity** — the 6 existing PNGs are seeded into
   Sanity, and the site reads only from Sanity. A vertical with no image falls back
   to the existing `heroBg` **gradient** (never blank).
3. **Schema model:** **single `heroImages` singleton** doc with 6 image fields
   (one per vertical), surfaced as one Studio panel (companyStats-style).
4. **Reads:** via the authenticated `sanityServerClient` so uploads appear
   immediately (consistent with the rest of the site).

## Vertical ↔ field ↔ seed source

| Vertical slug | Sanity field | Studio label | Seed source |
|---|---|---|---|
| `ci-solar-storage` | `ciSolarStorage` | C&I Solar & Storage | `/public/hero-solar.png` |
| `wheeling` | `wheeling` | Wheeling | `/public/hero-wheeling.png` |
| `energy-optimisation` | `energyOptimisation` | Energy Optimisation | `/public/hero-optimisation.png` |
| `carbon-credits` | `carbonCredits` | Carbon Credits | `/public/hero-carbon.png` |
| `webuysolar` | `webuysolar` | WeBuySolar | `/public/hero-webuysolar.png` |
| `ev-fleets` | `evFleets` | EV Fleets | `/public/hero-ev.png` |

## Architecture

### 1. Schema — `sanity/schemaTypes/heroImages.ts` (new)

`defineType` document `heroImages` (singleton). Six `defineField`s, each
`type: 'image'`, `options: { hotspot: true }`, titled per the table above.
Document `preview` shows a static title "Hero Images". Register in
`sanity/schemaTypes/index.ts`.

### 2. Studio structure — `sanity.config.ts`

Add a single-document panel after Company Stats:
`S.listItem().title('Hero Images').id('heroImages').child(S.document().schemaType('heroImages').documentId('heroImages'))`.

### 3. Types — `src/types/sanity.ts`

```ts
export interface HeroImageAsset {
  url: string;
  lqip?: string;
}
export type HeroImages = Partial<Record<SolutionVertical, HeroImageAsset | null>>;
```
(`SolutionVertical` is already exported from `@/types/solutions`.)

### 4. Query — `src/lib/queries.ts`

```groq
HERO_IMAGES_QUERY =
*[_id == "heroImages"][0]{
  "ci-solar-storage":    ciSolarStorage{ "url": asset->url, "lqip": asset->metadata.lqip },
  "wheeling":            wheeling{ "url": asset->url, "lqip": asset->metadata.lqip },
  "energy-optimisation": energyOptimisation{ "url": asset->url, "lqip": asset->metadata.lqip },
  "carbon-credits":      carbonCredits{ "url": asset->url, "lqip": asset->metadata.lqip },
  "webuysolar":          webuysolar{ "url": asset->url, "lqip": asset->metadata.lqip },
  "ev-fleets":           evFleets{ "url": asset->url, "lqip": asset->metadata.lqip }
}
```
Each key is the vertical slug; value is `{ url, lqip }` or `null` if unset.

### 5. Fetch helper — `src/lib/getHeroImages.ts` (new)

```ts
export async function getHeroImages(): Promise<HeroImages>
```
Fetches `HERO_IMAGES_QUERY` via `sanityServerClient`. Returns the map, or `{}` on
error (each vertical then falls back to its gradient). Never throws.

### 6. Component wiring

- **`src/components/sections/HeroAccordion.tsx`** (client): add a prop
  `heroImages: HeroImages`. Remove the hardcoded `image` from each `PANELS` entry
  (keep `vertical`, `number`, `href`, `title`, `description`). When rendering a
  panel, use `heroImages[panel.vertical]?.url`; if absent, render a gradient
  background (dark hero gradient) instead of an `<Image>`. Use the `lqip` as
  `blurDataURL` when present.
- **`src/app/page.tsx`** (server): `const heroImages = await getHeroImages();`
  pass `<HeroAccordion heroImages={heroImages} />`.
- **`src/components/sections/SolutionHero.tsx`**: add optional `heroBlur?: string`
  prop; when `heroImage` and `heroBlur` are present, pass `placeholder="blur"`
  and `blurDataURL={heroBlur}` to the `<Image>`. Existing
  `{heroImage ? <Image/> : <div heroBg/>}` branch is unchanged otherwise.
- **Each `src/app/solutions/<vertical>/page.tsx`** (server, already `async`):
  `const hero = (await getHeroImages())['<vertical>'];` then
  `heroImage={hero?.url}` and `heroBlur={hero?.lqip}` on `<SolutionHero>`. Remove
  the hardcoded `heroImage="/hero-*.png"`. `heroBg` gradient stays as the fallback.

### 7. Alt text

Auto-derived from the vertical label (`SOLUTION_META[vertical].label`). No alt
field in the schema (YAGNI). `SolutionHero` already uses `badge` as the alt;
`HeroAccordion` will use the panel's vertical label.

### 8. Revalidation — `src/app/api/revalidate/route.ts`

Add a branch: `if (type === 'heroImages') { revalidatePath('/'); revalidatePath('/solutions/<each vertical>'); }`
— one doc affects the accordion and all 6 solution heroes. The existing webhook
(empty projection) fires on publish.

### 9. Seed — `scripts/seedHeroImages.mjs` (new, one-off)

For each vertical: `const asset = await client.assets.upload('image', readFileSync('<public path>'), { filename })`,
collect the asset `_id`s, then `client.createOrReplace({ _id: 'heroImages', _type: 'heroImages', ciSolarStorage: { _type: 'image', asset: { _type: 'reference', _ref: <id> } }, … })`.
Uses `SANITY_API_TOKEN` (write). Run once: `node scripts/seedHeroImages.mjs`.
Because the site now reads only from Sanity, this must run before/at deploy so
heroes don't fall back to gradients in production.

## Data flow

```
Editor uploads image (Studio "Hero Images" panel)
        │  publishes heroImages doc
        ▼
Sanity ──(webhook)──▶ /api/revalidate ─▶ revalidate / + /solutions/*
        ▲
        │ HERO_IMAGES_QUERY (authenticated, perspective:'published')
getHeroImages() ──▶ { 'ci-solar-storage': {url,lqip}, … }
        │
        ├─▶ home page → <HeroAccordion heroImages={…} />
        └─▶ solution page → <SolutionHero heroImage={url} heroBlur={lqip} />
```

## Files touched

**New:** `sanity/schemaTypes/heroImages.ts`, `src/lib/getHeroImages.ts`,
`scripts/seedHeroImages.mjs`.
**Edited:** `sanity/schemaTypes/index.ts`, `sanity.config.ts`, `src/lib/queries.ts`,
`src/types/sanity.ts`, `src/app/page.tsx`, `src/components/sections/HeroAccordion.tsx`,
`src/components/sections/SolutionHero.tsx`, `src/app/solutions/<6 verticals>/page.tsx`,
`src/app/api/revalidate/route.ts`.

## Out of scope (YAGNI)

- Per-vertical editable bg gradients or alt text (alt auto-derives; gradient stays in code).
- Separate accordion vs solution-page images (one shared image per vertical).
- Making the accordion's title/description editable (this is images only).

## Risks / notes

- **Go-live ordering:** "require Sanity" means the seed (step 9) must run before the
  new code is live, or heroes render as gradients. Implementation plan will sequence this.
- `next.config.ts` already whitelists `cdn.sanity.io`, so `next/image` needs no change.
- `HeroAccordion` is a client component; it must receive images as a prop from the
  server home page (it cannot fetch Sanity itself).

# 06 — Single Project Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Route: `/projects/[slug]`
> **Approved April 2026** — Concept A split hero + Deep Teal stats strip + Concept B numbered body

---

## Entry Points

- "View full case study →" button inside `ProjectDrawer` (see `specs/05-PROJECTS.md`)
- Direct URL / search engine (SEO-indexed via `generateStaticParams`)
- Related project cards on other single project pages

---

## Page Structure

```
[Navbar — light glass pill, "Projects" active]
[Breadcrumb — Home / Projects / [Project name]]
[Hero — split layout desktop / full-bleed mobile]
[Stats strip — Deep Teal, flush below hero, NO overlap]
[Body — intro paragraph + 3 numbered sections]
[Results strip — dark, full-width]
[Photo gallery]
[Related projects]
[CTA banner]
[Footer]
```

---

## Navbar State

- Light glass pill: `background: rgba(255,255,255,0.92)`, `backdrop-filter: blur(12px)`
- `border: 1px solid rgba(57,87,92,0.15)`
- Logo: Deep Teal `#39575C` + Dusty Blue dot
- Active link: "Projects" — Deep Teal, `font-weight: 600`
- CTA button: Deep Teal fill + white text

---

## Breadcrumb

```
Home / Projects / [Project title ~30 chars max]
```
- Inter 400, 9px, `#6B7280`
- Current item: `#39575C`, `font-weight: 600`
- Padding: `8px 20px 0`

---

## Hero

### Desktop (>= 768px) — Concept A Split

Two equal columns side by side, `min-height: 280px`:

**Left panel:**
- `background: #0d1f22`, `padding: 28px`, flex column, `justify-content: flex-end`
- Eyebrow: `CASE STUDY` — Inter 700, 9px, `#709DA9`, `letter-spacing: 0.14em`, uppercase
- Vertical badge pill: accent bg at 20% opacity + accent colour text + 6px dot, `margin-bottom: 12px`
- Project title: Plus Jakarta Sans 800, 18px, `#ffffff`, `line-height: 1.2`, `margin-bottom: 16px`
- Metadata list, `display: flex`, `flex-direction: column`, `gap: 5px`:
  - Each row: Inter 400, 10px, `rgba(255,255,255,0.5)`, flex row
  - Label: `min-width: 64px`, `color: rgba(255,255,255,0.8)`, `font-weight: 600`
  - Fields: Client · Location · Completed · Value · Status

**Right panel:**
- `position: relative`, `overflow: hidden`
- `next/image` fill, `object-fit: cover`, `object-position: center`
- `placeholder="blur"` for fast LCP
- Left-edge veil: `linear-gradient(270deg, transparent 50%, rgba(13,31,34,0.2) 100%)`
- Hover: photo `scale(1.03)` over `0.8s cubic-bezier(0.4,0,0.2,1)`

### Mobile (< 768px) — Full-bleed

- `height: 210px`, full-width, `overflow: hidden`
- `next/image` fill, `object-fit: cover`
- Overlay: `linear-gradient(180deg, rgba(13,31,34,0.1) 0%, rgba(13,31,34,0.92) 100%)`
- Bottom-anchored content, `padding: 14px`:
  - Badge pill: 8px text, `padding: 2px 8px`
  - Title: Plus Jakarta Sans 800, 13px, white, `line-height: 1.2`, `margin-bottom: 6px`
  - Meta row: location · date · value — 8px, `rgba(255,255,255,0.55)`, flex, `gap: 8px`

> Note: The split layout requires ~500px minimum width. Below that, full-bleed is the correct pattern. All project metadata is still immediately accessible via the stats strip below.

---

## Stats Strip — Concept A

Sits **flush directly below the hero**. No negative margins, no z-index, no overlap.

- `background: #39575C`
- `padding: 14px 20px`

### Desktop — 4-column horizontal
```css
display: grid;
grid-template-columns: repeat(4, 1fr);
```
- Each stat: `text-align: center`
- Vertical divider: `::after` pseudo, `width: 1px`, `height: 60%`, `background: rgba(255,255,255,0.15)`, `position: absolute`, right edge, vertically centred
- Last stat: `::after { display: none }`

### Mobile — 2×2 grid
```css
display: grid;
grid-template-columns: repeat(2, 1fr);
```
- Each stat: `padding: 10px 0`, centred
- Internal dividers via same `::after` approach on col 1 items

### Stat anatomy
- Value: Plus Jakarta Sans 800, `20px` desktop / `16px` mobile, `#ffffff`, `line-height: 1`
- Label: Inter 400, `8px`, `rgba(255,255,255,0.5)`, uppercase, `letter-spacing: 0.08em`, `margin-top: 3px`

### Default stat fields (per project in Sanity `metrics[]` array)
| Position | Default label (desktop) | Default label (mobile) |
|---|---|---|
| 1 | System size | System size |
| 2 | Battery storage | Battery |
| 3 | Annual saving | Annual saving |
| 4 | CO₂ saved / yr | CO₂ / yr |

---

## Body

Max-width: `760px`, `margin: 0 auto`, `padding: 22px 20px 0` desktop / `16px 14px 0` mobile.

### Intro paragraph
- Desktop: Inter 500, 13px, `#1A1A1A`, `line-height: 1.7`
- Mobile: Inter 500, 11px
- `margin-bottom: 22px`, `padding-bottom: 22px`, `border-bottom: 1px solid #E5E7EB`
- 2–3 sentences — sets scene before the numbered sections

---

## Numbered Sections (01 / 02 / 03)

Sections: **The Challenge** · **Our Solution** · **The Outcome**

Each section: `padding: 18px 0`, `border-bottom: 1px solid #E5E7EB`. Last section: no border.

### Desktop (>= 768px) — Two column
```css
display: grid;
grid-template-columns: 96px 1fr;
gap: 20px;
align-items: start;
```

**Left column:**
- Number: Plus Jakarta Sans 800, 34px, `#E5E7EB` (deliberately light — decorative), `line-height: 1`, `margin-bottom: 3px`
- Tag: Inter 700, 8px, `#709DA9`, uppercase, `letter-spacing: 0.12em`

**Right column:**
- Title: Plus Jakarta Sans 700, 14px, `#1A1A1A`, `line-height: 1.35`, `margin-bottom: 8px`
- Body text: Inter 400, 11px, `#6B7280`, `line-height: 1.8`
- Optional inline image (used in Solution section):
  - `width: 100%`, `height: 90px`, `border-radius: 10px`, `margin-top: 10px`
  - `next/image` fill, `object-fit: cover`

### Mobile (< 768px) — Stacked
```
[flex row: number + tag]   gap: 8px, margin-bottom: 8px
[title]
[body text]
[optional image]
```
- Number: Plus Jakarta Sans 800, 22px, `#E5E7EB`
- Tag: Inter 700, 8px, `#709DA9`, uppercase
- Title: Plus Jakarta Sans 700, 12px, `#1A1A1A`, `line-height: 1.35`, `margin-bottom: 6px`
- Body: Inter 400, 10px, `#6B7280`, `line-height: 1.75`
- Optional image: `height: 70px`, `border-radius: 8px`, `margin-top: 8px`

---

## Results Strip

- `background: #0d1f22`
- `border-radius: 14px` desktop / `12px` mobile
- `padding: 18px 20px` desktop / `14px` mobile
- `margin: 20px 0` desktop / `14px 0` mobile
- Eyebrow: `PROJECT RESULTS` — Inter 700, 8px, `#709DA9`, uppercase, `letter-spacing: 0.14em`, `margin-bottom: 12px`

### Desktop — 4-column horizontal
```css
display: grid;
grid-template-columns: repeat(4, 1fr);
```
- First stat: left-aligned. Last stat: right-aligned. Others: centred.
- Dividers: `border-right: 1px solid rgba(255,255,255,0.08)`. Last: none.

### Mobile — 2×2 tinted boxes
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 8px;
```
- Each stat in: `background: rgba(255,255,255,0.06)`, `border-radius: 8px`, `padding: 10px`

### Stat anatomy
- Value: Plus Jakarta Sans 800, `18px` desktop / `15px` mobile, `#ffffff`
- Label: Inter 400, 8px, `rgba(255,255,255,0.4)`, uppercase, `letter-spacing: 0.07em`, `margin-top: 2px`

### Default result fields (per project in Sanity `results[]` array)
`Generated yr 1` · `Annual saving` · `Outages survived` · `Payback period`

---

## Photo Gallery

### Desktop — 3×2 grid
```css
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-rows: 88px 88px;
gap: 8px;
```
- First photo: `grid-column: span 2` (wide)
- All: `border-radius: 10px`, `overflow: hidden`
- Hover: `scale(1.04)` over `0.4s`
- Click: opens `yet-another-react-lightbox`

### Mobile — 2-column grid
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 6px;
```
- First photo: `grid-column: span 2`
- Photo height: `68px`

---

## Related Projects

### Desktop — 3-column grid
- White bg section, `padding: 18px 20px`
- Header row: `SIMILAR PROJECTS` eyebrow left + `View all projects →` right
- 3 `ProjectCard` components — same vertical, Sanity `related` field

### Mobile — Horizontal scroll row
```css
display: flex;
gap: 8px;
overflow-x: auto;
scrollbar-width: none;
```
- Cards: `width: 130px`, `flex-shrink: 0`

---

## CTA Banner

- `background: #39575C`, `border-radius: 14px` desktop / `12px` mobile
- `padding: 22px 20px` desktop / `18px 14px` mobile
- `margin: 16px 20px` desktop / `12px 14px` mobile
- `text-align: center`

**Elements:**
- Headline: Plus Jakarta Sans 800, `17px` / `14px`, white — *"Ready for a similar project?"*
- Subtext: Inter 400, `11px` / `10px`, `rgba(255,255,255,0.6)` — *"Get a free assessment for your facility in under 48 hours."*
- Button row: `display: flex`, `gap: 8px`, `justify-content: center`
  - `Get a Quote`: `#F5F5F5` bg, Deep Teal text, pill shape
  - `View all projects`: `rgba(255,255,255,0.1)` bg, `border: 1px solid rgba(255,255,255,0.2)`, white text
  - Mobile: both `flex: 1` — equal width, full-width row

---

## SEO & Metadata

```typescript
// src/app/projects/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  return {
    title: `${project.title} | Phoenix Energy`,
    description: project.summary,
    openGraph: {
      images: [{ url: urlFor(project.heroImage).width(1200).height(630).url() }],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map(slug => ({ slug }));
}

export const revalidate = 3600; // ISR — re-fetch Sanity content hourly
```

---

## TypeScript Interfaces

```typescript
// src/types/sanity.ts

interface ProjectPageData {
  title: string;
  slug: string;
  vertical: SolutionVertical;
  clientName: string;
  location: string;
  completionDate: string;
  projectValue: string;
  status: 'operational' | 'in-progress' | 'planned';
  heroImage: SanityImage;
  gallery: SanityImage[];
  summary: string;                              // 2-3 sentence intro
  challenge: PortableTextBlock[];
  solution: PortableTextBlock[];
  outcome: PortableTextBlock[];
  metrics: { label: string; value: string }[];  // 4 items — stats strip
  results: { label: string; value: string }[];  // 4 items — results strip
  related: ProjectCard[];
}
```

---

## Sanity GROQ Query

```groq
*[_type == "project" && slug.current == $slug][0] {
  title,
  slug,
  vertical,
  clientName,
  location,
  completionDate,
  projectValue,
  status,
  heroImage { asset->, alt },
  gallery[] { asset->, alt },
  summary,
  challenge[] { ... },
  solution[] { ... },
  outcome[] { ... },
  metrics,
  results,
  "related": *[
    _type == "project" &&
    vertical == ^.vertical &&
    slug.current != $slug
  ] | order(completionDate desc) [0..2] {
    title, slug, vertical, location, systemSize,
    heroImage { asset->, alt }
  }
}
```

---

## Responsive Breakpoints Summary

| Element | Desktop (>= 768px) | Mobile (< 768px) |
|---|---|---|
| Hero | 50/50 split — dark left + photo right | Full-bleed photo + gradient overlay |
| Stats strip | 4-column horizontal | 2×2 grid |
| Body sections | 2-col (96px number col + content col) | Stacked, inline number+tag header |
| Results strip | 4-column horizontal | 2×2 tinted boxes |
| Gallery | 3-col × 2-row, first photo spans 2 cols | 2-col, first photo spans 2 cols |
| Related projects | 3-column grid | Horizontal scroll, 130px cards |
| CTA buttons | Side by side, centred | `flex: 1` equal-width full-row |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.1 | Approved April 2026*

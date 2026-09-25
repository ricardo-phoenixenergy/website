# 06 — Single Project Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Route: `/projects/[slug]`
> **Approved April 2026** — Concept A split hero + Deep Teal stats strip + Concept B numbered body
> **Updated 2026-09-24:** corrected to match the build (`src/app/projects/[slug]/page.tsx`). The hero is a rounded card in the page container, the Deep Teal stats strip became `ProjectStatsTiles`, the story sections are unnumbered and show only when written, and the gallery opens a built-in photo dialog.

---

## Entry Points

Updated 2026-09-24. There is no project drawer: every project card links straight to this page.

- Project cards (`ProjectCard`) on `/projects`, on home and on the solution pages (`FeaturedProjects`).
- The related projects section at the foot of other case studies ("Next project", "Similar projects" or "More projects").
- A direct URL or a search result. Pages are prerendered with `generateStaticParams`. Only complete case studies (`caseStudyReady`) are indexed and listed in the sitemap; a project page that isn't written up yet is `noindex, follow`.

---

## Page Structure

```
[Navbar: the site-wide solid white pill, "Projects" active]
[Breadcrumb: Home / Projects / [Project name]]
[Hero: rounded card in the page container; split from md, photo with overlay on phones]
[Stats tiles: ProjectStatsTiles, from metrics[]]
[Summary paragraph]
[Story sections: only the written ones, unnumbered]
[Results strip: rounded Night Teal panel in the container]
[Photo gallery]
[Related projects: "Next project", "Similar projects" or "More projects"]
[CTA banner]
[Footer: SiteFooter]
```

---

## Navbar State

- Navbar: see `specs/03-NAVIGATION.md`. It is the same solid white pill as on every other page, with "Projects" highlighted as the active link.

---

## Breadcrumb

```
Home / Projects / [Project title]
```
- A `nav` labelled "Breadcrumb", in the page container, 96px from the top of the page so it clears the fixed navbar.
- Breadcrumb role (Inter 400, 14px), `pe-muted`. "Home" and "Projects" are links that turn Deep Teal on hover.
- Current item: the project title, Deep Teal, `font-weight: 600`, truncated at 200px.

---

## Hero

The hero is a rounded card (`border-radius: 16px`, `overflow: hidden`) inside the page container, 12px below the breadcrumb.

### Desktop (>= 768px): split

A flex row, `min-height: 380px`:

**Left panel (44% wide):**
- `background: linear-gradient(155deg, #1a3a3e 0%, #0d1f22 100%)`, `padding: 32px`, flex column, `justify-content: flex-end`: the eyebrow, badge, title and metadata sit together at the bottom, so a project with few details leaves space above them rather than a gap under the eyebrow (updated September 2026).
- Eyebrow, `on-dark-muted` (eyebrow role), `margin-bottom: 16px`: **"Case study"** when the challenge, solution and outcome are all written, otherwise **"Project"**. It was `#709DA9`, which measured 4.2:1 on the lighter end of the gradient; `on-dark-muted` measures 7.1:1.
- Vertical badge: a solid accent fill with the accent's "on" colour (`SOLUTION_META[vertical].accent` and `.accentText`), badge role, no dot, `margin-bottom: 16px`.
- Project title: an `h1`, Plus Jakarta Sans 800, 24px, white, `line-height: 1.2`, `margin-bottom: 24px`.
- Metadata rows: each row a grid of `80px 1fr` with `padding: 8px 0`, and a `rgba(255,255,255,0.08)` rule between rows.
  - Label: Inter 700, 12px, uppercase, `letter-spacing: 0.1em`, `on-dark-subtle`.
  - Value: Inter 400, 12px, `rgba(255,255,255,0.75)`.
  - Fields: Client · Location · Completed · Value · Status. A field with no value is left out. Status reads Operational, In progress or Planned.

**Right panel (photo):**
- `flex: 1`, `position: relative`, `overflow: hidden`.
- `next/image` fill, `object-fit: cover`, `priority`, `placeholder="blur"` with the Sanity LQIP.
- With no hero image: an accent gradient, `linear-gradient(135deg, {accent}44 0%, #0d1f22 100%)`.
- Left-edge veil: `linear-gradient(270deg, transparent 55%, rgba(13,31,34,0.25) 100%)`.
- Hover: photo `scale(1.03)` over 800ms.

### Mobile (< 768px): photo with overlay

- The left panel is hidden. The photo panel is `height: 280px`, the full width of the card.
- Overlay: `linear-gradient(180deg, rgba(13,31,34,0.05) 0%, rgba(13,31,34,0.88) 100%)`.
- The content sits at the bottom of the photo, `padding: 20px`, in this order.
  - Badge: as on desktop, `margin-bottom: 12px`.
  - Title: its own `h1`, Plus Jakarta Sans 800, 18px, white, `line-height: 1.2`, `margin-bottom: 8px`. Only one of the two titles shows at a time.
  - Meta line: location · date · value, Inter 12px, `on-dark-subtle`, `gap: 8px`, wrapping.

> Note: on phones the Client and Status rows are not shown. The meta line carries the location, date and value, and the stats tiles below carry the system facts.

---

## Stats Tiles

`ProjectStatsTiles` (`src/components/ui/ProjectStatsTiles.tsx`) sits in the page container, 8px below the hero, and replaced the April Deep Teal strip. It renders only when the project has metrics.

- Container: `background: #0d1f22` (Night Teal), `border-radius: 12px`, `padding: 3px`, `gap: 3px`.
- Grid: 2 columns on phones; from md, one column per stat (1 to 4). With an odd number of stats, the last tile spans both columns on phones, so no cell is left empty.
- Tiles: `border-radius: 9px`, `padding: 22px 12px`, centred. The first tile is highlighted with `linear-gradient(140deg, #1a4a52 0%, #0f2d33 100%)` and a soft Dusty Blue glow; the others are `rgba(255,255,255,0.04)`. Each tile has the `.shimmer-tile` sweep from `globals.css`, staggered with `--shimmer-delay`.

### Stat anatomy
- Value: Plus Jakarta Sans 800, white, `line-height: 1`, 28px on the first tile and 24px on the others.
- Label: Inter 400, 12px, `on-dark-subtle`, uppercase, `letter-spacing: 0.09em`, `margin-top: 5px`.

### Stat fields (Sanity `metrics[]`)
Editors enter each label and value; there are no default labels. `metrics[]` holds system facts (kWp, kWh, inverter, deal structure), as the comment in `src/types/sanity.ts` says. The page shows the first four. `ProjectCard` joins the same values with " · " for its spec line.

---

## Body

The body sits in the page container (up to 1280px wide), 32px below the stats tiles. There is no 760px column: the summary and each section's text are held to `max-width: 56ch`, about 75 characters a line (updated September 2026 from `60ch`, which measured 80 to 83). Sizes follow `specs/01-BRAND.md`; nothing is below 12px.

### Summary paragraph
- Inter 500, 18px, `#1A1A1A` (`pe-text`), `line-height: 1.7`, `max-width: 56ch`.
- `margin-bottom: 24px`, `padding-bottom: 24px`, `border-bottom: 1px solid #E5E7EB`.
- From the project's `summary` field (2 to 3 sentences). Left out when empty.

---

## Story Sections

Up to three sections, in this order: **The challenge** · **Our solution** · **The outcome**. Only the ones with content render, and they are not numbered. The eyebrow reads "Case study", and the page is indexed, only when all three are written.

Each section is a `section` labelled by its `h2` (`id="section-challenge"`, `section-solution` or `section-outcome`), with `padding: 24px 0` and `border-bottom: 1px solid #E5E7EB` on all but the last.

### Desktop (>= 768px): two columns
```css
display: grid;
grid-template-columns: 160px 1fr;
gap: 32px;
```

- Left: the `h2` label, Plus Jakarta Sans 700, 18px, `#1A1A1A`, `line-height: 1.375`.
- Right: the Portable Text body in a `max-width: 56ch` column. Paragraphs are Inter 400, 16px, `#374151` (`pe-text-soft`), `line-height: 1.75`, 16px apart.
- The page's Portable Text components style paragraphs only. There is no separate title and no inline image.

### Mobile (< 768px): stacked
```
[h2 label]   margin-bottom: 12px
[body text]
```

---

## Results Strip

A `section` labelled by its heading (`aria-labelledby="results-heading"`), inside the body container, so it is not full width. It renders only when the project has results.

- `background: #0d1f22` (`pe-nav-dark`), `border-radius: 16px`, `padding: 20px`, `margin: 24px 0`.
- Heading: an `h2` with `id="results-heading"`, styled as a label (Inter 700, 12px, `#709DA9`, uppercase, `letter-spacing: 0.14em`, `margin-bottom: 16px`). It reads **"Projected results"** by default and **"Measured results"** only when the project's `resultsBasis` is `measured`. Never "Project results": today's figures come from the financial model, not metered data.
- As-of date: when `resultsAsOf` is set, "As of 30 June 2026" sits beside the heading (Inter 12px, `on-dark-subtle`) and wraps under it on narrow screens.
- Note under the figures (Inter 12px, `on-dark-muted`, max 60ch): the project's `resultsAssumptions` when set. Otherwise, for projected results only, the default note: *"Projections from our financial model for this site, not measured results. Actual figures depend on energy use, weather and future tariffs."* Measured results without a note show no note.
- Project cards (`ProjectCard`) caption their two outcomes "Projected results" (Inter 12px, `pe-muted`) unless the basis is measured.
- The labelling rules live in `src/lib/projectResults.ts`, with unit tests. The Sanity fields are in `specs/12-CMS.md`.

### Desktop (>= 768px): 4 columns
```css
display: grid;
grid-template-columns: repeat(4, 1fr);
```
- Every stat is centred, with `padding: 0 16px` so a long label never runs up to a divider.
- Dividers: `border-right: 1px solid rgba(255,255,255,0.08)` on all but the last.

### Mobile (< 768px): 2 columns of tinted boxes
```css
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 12px;
```
- Each stat sits in a box: `background: rgba(255,255,255,0.06)`, `border-radius: 12px`, `padding: 12px`, centred.

### Stat anatomy
- Value: Plus Jakarta Sans 800, 18px on phones and 20px from md, white, `line-height: 1`.
- Label: Inter 400, 12px, `on-dark-subtle`, uppercase, `letter-spacing: 0.07em`, `margin-top: 6px`.

### Result fields (Sanity `results[]`)
Editors enter each label and value; there are no default labels. `results[]` holds outcomes (payback, bill reduction). The page shows the first four, and `ProjectCard` leads with the first two that have a value.

---

## Photo Gallery

`ProjectGallery` (`src/components/sections/ProjectGallery.tsx`), in the page container. It renders only when the project has gallery photos. The grid shows the first six, and every tile is a button.

### Desktop (>= 768px): 3 columns
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 8px;
```
- First photo: `grid-column: span 2` (wide), or all three columns when it is the only photo. A last photo left short of a full row spans the rest of it, so no cell is left empty. With six photos the grid runs to three rows.
- Every tile: `height: 88px`, `border-radius: 10px`, `overflow: hidden`.
- Hover: `scale(1.04)` over 400ms.
- Click: opens the built-in photo dialog (below). No lightbox package is installed.

### Mobile (< 768px): 2 columns
```css
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 6px;
```
- First photo: `grid-column: span 2`. A last photo left alone on its row spans both columns, so with two photos both are full width.
- Tiles are 88px tall, as on desktop. Each tile's `sizes` follows its span.

### Photo dialog
- A modal (`role="dialog"`, `aria-modal="true"`) over a `rgba(13,31,34,0.92)` backdrop. The photo is `object-fit: contain`, up to 900px wide and `min(600px, 80vh)` tall.
- A close button (focused on open), previous and next buttons when there is more than one photo, and a live "n / total" counter. The three buttons are 44px ghost `IconButton`s with 20px glyphs: a translucent white disc with a faint edge, so they read over the photo.
- The dialog carries `focus-on-dark` (updated September 2026): a white focus ring on a Night Teal halo. On a phone the previous and next buttons sit on the photo, where the default white halo and teal ring fell to 1.2 to 3.0:1 over a light one.
- The left and right arrow keys page through the photos and Escape closes. `useModalDialog` keeps Tab inside the dialog, locks page scroll and returns focus to the tile that opened it. A click on the backdrop also closes it.
- The dialog pages through every gallery photo, including any after the first six.

---

## Related Projects

A `section` labelled by its heading (`aria-labelledby="similar-projects"`), white background, `padding: 32px 0`. The id stays `similar-projects` whatever the heading says. The rules come from `docs/plans/2026-09-24-case-study-and-proof-strip-brief.md` (6A.3) and live in `selectRelated()` in `src/lib/relatedProjects.ts`, with unit tests. Updated September 2026: one related project used to sit alone in a three-column grid.

| Other projects | Layout | Heading |
|---|---|---|
| 3 or more in the same vertical | Three `ProjectCard`s (`fluid`): 1 column on phones, 2 from sm (640px), 3 from md, `gap: 16px` | Similar projects |
| 2 in the same vertical | Two large `ProjectCard`s (`size="large"`): 1 column, 2 from md, `gap: 24px` | Similar projects |
| 1 in the same vertical | One wide `FeaturedProjectCard`: heading level 3, its pill the project’s service (for example "C&I Solar & Storage"), no `priority` image | Next project |
| None in the same vertical, some elsewhere | Up to two from other verticals as large cards, or one wide card when there is only one | More projects |
| None anywhere | The section is left out | (none) |

- The `h2` (eyebrow role, `pe-muted`) on its own, 20px above the cards. The wide card’s pill names the service, so "Next project" appears once, and the one link to `/projects` is the CTA banner’s (PSP-30).
- The lists are GROQ sub-queries in `PROJECT_BY_SLUG_QUERY`, not Sanity fields: `related` (same vertical, up to three) and `otherProjects` (other verticals, up to two, used only when `related` is empty). Both put complete case studies first, then the newest by `_createdAt`, until projects carry a commissioning date.
- The wide card stacks on phones with its photo on top, like `ProjectCard`. Its footer reads "Read case study" for a complete case study and "View project" otherwise. There is no horizontal scroll row.
- Today each case study has one other C&I project, so both show one wide "Next project" card.

---

## CTA Banner

- A card in the page container, 20px above and below: `background: linear-gradient(135deg, #1a3a3e 0%, #0d1f22 100%)`, `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 16px`, `padding: 32px 28px` on phones and `40px` from md.
- Layout: text on the left and buttons on the right from md, stacked 24px apart on phones. The text is left-aligned, not centred.

**Elements:**
- Eyebrow: *"Start your project"*, `on-dark-subtle` (eyebrow role). `#709DA9` measured 4.2:1 on this gradient; `on-dark-subtle` measures 5.0:1.
- Headline: the `h2` *"Ready for a similar project?"*, Plus Jakarta Sans 800, 20px on phones and 24px from md, white, `line-height: 1.2`.
- Subtext: Inter 400, 14px, `on-dark-subtle`: *"Tell us about your site. We reply within 1 business day."* (updated September 2026: the old "in under 48 hours" contradicted the site's one response time, `REPLY_PROMISE` in `src/config/contact.ts`, whose no-break spaces keep "1 business day" on one line)
- Buttons, `gap: 12px`: stacked on phones and at md (768 to 1023px), side by side at sm (640 to 767px) and from lg (1024px).
  - The project's service CTA, `projectCta(vertical, title)` from `src/config/ctas.ts` (was `Get a Quote`): the service's label, for C&I "Book a discovery meeting", linking to the contact form with the service and the project named in the message. `Button`, light, default size: a 48px pill, `#F5F5F5` fill, Night Teal text, white on hover.
  - `View published projects` (`PROJECTS_CTA`): links to `/projects`. `Button`, ghost, default size: the same 48px box, white at 8% with a white 20% edge, white text.
  - Stacked, the buttons share one width (the full card width on phones). Side by side, each takes its text width.

---

## SEO & Metadata

```typescript
// src/app/projects/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityServerClient.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug });
  if (!project) return { title: 'Project not found', robots: { index: false } };
  const description = snippet(project.summary); // whole words, at most 155 characters
  const ready = [project.challenge, project.solution, project.outcome].every((b) => b && b.length > 0);
  return {
    title: project.title, // the root template adds "| Phoenix Energy"
    description,
    alternates: { canonical: `/projects/${slug}` },
    // A project whose story isn't written yet stays out of search until it is.
    ...(!ready && { robots: { index: false, follow: true } }),
    openGraph: {
      title: project.title,
      description,
      url: `/projects/${slug}`,
      ...(project.heroImage && {
        images: [{ url: urlFor(project.heroImage).width(1200).height(630).url() }],
      }),
    },
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await sanityServerClient.fetch<Array<{ slug: string }>>(ALL_PROJECT_SLUGS_QUERY);
    return slugs.map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

export const revalidate = 3600; // ISR: re-fetch Sanity content hourly
```

- Only a missing project is a 404 (`notFound()`). A Sanity error throws instead, so visitors get the error page, or on revalidation the last good static page, rather than a cached 404.
- A `project` change sent to the revalidation webhook (`src/app/api/revalidate/route.ts`) refreshes `/projects/[slug]`, `/projects` and `/`.

---

## TypeScript Interfaces

```typescript
// src/types/sanity.ts: the page's data is `Project`, which extends `ProjectCard`.
// The fields the case study reads:

interface Project extends ProjectCard {
  _id: string;
  title: string;
  slug: SanitySlug;                             // { current: string }
  vertical: SolutionVertical;
  clientName: string;
  location: string;
  completionDate: string;                       // free text, e.g. "Q3 2024"
  projectValue: string;
  status: 'completed' | 'in-progress' | 'planned'; // shown as Operational, In progress, Planned
  heroImage?: SanityImage;                      // none: an accent gradient fills the photo panel
  gallery: SanityImage[];
  summary: string;                              // 2 to 3 sentence intro
  challenge: PortableTextBlock[];
  solution: PortableTextBlock[];
  outcome: PortableTextBlock[];
  metrics: ProjectMetric[];                     // { label, value }: system facts; first 4 fill the stats tiles
  results: ProjectMetric[];                     // { label, value }: outcomes; first 4 fill the results strip
  resultsBasis?: 'projected' | 'measured';      // empty means projected
  resultsAsOf?: string;                         // YYYY-MM-DD: model date or end of measured period
  resultsAssumptions?: string;                  // replaces the default note
  related: ProjectCard[];                       // same vertical, case studies first; card fields include resultsBasis
  otherProjects?: ProjectCard[];                // other verticals, shown only when related is empty
}
```

---

## Sanity GROQ Query

`PROJECT_BY_SLUG_QUERY` in `src/lib/queries.ts`:

```groq
*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  "slug": { "current": slug.current },
  vertical,
  clientName,
  location,
  completionDate,
  projectValue,
  status,
  "heroImage": heroImage { asset->, alt, hotspot, crop },
  "gallery": gallery[] { asset->, alt, hotspot, crop },
  summary,
  challenge[] { ... },
  solution[] { ... },
  outcome[] { ... },
  metrics,
  results,
  resultsBasis,
  resultsAsOf,
  resultsAssumptions,
  "related": *[
    _type == "project" &&
    vertical == ^.vertical &&
    slug.current != $slug
  ] | order((defined(challenge[0]) && defined(solution[0]) && defined(outcome[0])) desc, _createdAt desc) [0..2] {
    // ...PROJECT_CARD_FIELDS:
    _id, title, "slug": { "current": slug.current }, vertical, location, systemSize,
    "heroImage": heroImage { asset->, alt, hotspot, crop },
    clientName, status, metrics, results, resultsBasis,
    "caseStudyReady": defined(challenge[0]) && defined(solution[0]) && defined(outcome[0])
  },
  "otherProjects": *[
    _type == "project" &&
    vertical != ^.vertical &&
    slug.current != $slug
  ] | order((defined(challenge[0]) && defined(solution[0]) && defined(outcome[0])) desc, _createdAt desc) [0..1] {
    // ...PROJECT_CARD_FIELDS
  }
}
```

---

## Responsive Breakpoints Summary

| Element | Desktop (>= 768px) | Mobile (< 768px) |
|---|---|---|
| Hero | Rounded card: 44% dark gradient panel beside the photo, min 380px | 280px photo with gradient overlay; badge, title and meta line at the bottom |
| Stats tiles | One column per stat, up to 4 | 2 columns; an odd last tile spans both |
| Story sections | 160px heading column beside a 56ch text column | Heading above text, unnumbered |
| Results strip | 4 centred, padded columns with dividers | 2 columns of tinted boxes |
| Gallery | 3 columns, first photo spans 2, no empty cells, 88px tiles | 2 columns, first photo spans 2, no empty cells, 88px tiles |
| Related projects | By count: one wide card, two large cards or three cards | The wide card stacks; cards in 1 column (2 from sm for three) |
| CTA buttons | Text left, buttons right; buttons stacked at md, side by side from lg | Stacked, full width; side by side at sm (640px) |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.1 | Approved April 2026*

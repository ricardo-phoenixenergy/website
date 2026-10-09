# 06: Single Project Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 4.2
> Route: `/projects/[slug]`
> **Rebuilt 2026-09-29 (steps 1 and 2):** one template for every project, from the design spec `docs/superpowers/specs/2026-09-29-project-page-design.md`. Step 2 added the CMS fields: headline, site type, financing, figure notes, chapter headlines, equipment, delivery, captions and a search description. Each part shows a new field only when it's set, and falls back to the older fields otherwise.
> **Simplified 2026-10-09:** the results card became the Impact card (the figures and their notes only), the project has one date (the completion date), and the consent and rand switches and the project value are gone. The client's name shows wherever it is set, and rand amounts show as written.

---

## Entry Points

- Project cards (`ProjectCard`) on `/projects`, on home and on the solution pages (`FeaturedProjects`), and the wide `FeaturedProjectCard`. Every card says "View project".
- The next project section at the foot of other project pages.
- A direct URL or a search result. Every project page is indexed and listed in the sitemap (`lastModified` from `_updatedAt`), and prerendered with `generateStaticParams` (ISR, `revalidate = 3600`).

---

## Page Structure

```
[Navbar: the site-wide pill, "Projects" active]
[Breadcrumb row: Home / Projects / title, Copy link at the right]
[Hero: full-bleed photo from 768px; 4:3 photo with the text below on phones]
[Impact card: overlaps the hero by 60px from 768px; only with figures]
[The site in photos: 4:3 mosaic and the photo viewer; only with photos besides the hero]
[Story and facts: lead and chapters beside the facts panel from 1024px; facts full width when there is no story]
[Next project: "Similar projects", "Next project" or "More projects"]
[Closing band: "Ready for a similar project?"]
[Footer: SiteFooter]
```

From the Impact card to the next project, or from the hero when there are no figures, parts are 64px apart from 1024px, 48px from 768px and 40px on phones.

The page file only reads the project and composes the parts in `src/components/project/`.

---

## Data

- **One module for every read:** every read of project content goes through `src/lib/projectData.ts`:
  - `getProjectBySlug`, cached per request with React `cache`, so the page and its metadata share one read;
  - `getAllProjects`, `getFeaturedProjects`, `getProjectsByVertical`, `getProjectSlugs` and `getProjectSitemapEntries`.

  An ESLint rule (`eslint.config.mjs`) stops any other file importing the project queries. Every read drops a results figure or System row without both a label and a value, so a label never shows without its figure.
- **Shown as written:** everything a project holds shows on the site as written. The client's name shows wherever it is set: on the cards, in the line under the headline and in the facts. The Studio's Client name help text asks editors to fill it in only once the client has agreed in writing to be named. A rand amount in a figure or a System row ("R276k") shows as written too.
- **Images:** project images select only the URL, the LQIP, the dimensions, the asset id, the alt text, the caption, and the hotspot and crop, never the whole asset document, whose file name can name a client who hasn't agreed to be named.
- **Old fields:** documents written before 9 October 2026 may still hold `showClientName`, `clientConsentOn`, `showRandAmounts`, `projectValue`, `completionDate`, `resultsBasis`, `resultsAsOf`, `resultsAssumptions` and `resultsInputs` until they are cleared. The queries return none of them, so they never reach the page.
- **Order:** newest first, meaning the completion date (`commissionedOn`), falling back to the date the project was added to the CMS (`_createdAt`). A planned or in-progress project's date is the day it's due, and it sorts by that day too. `/projects` puts featured projects first, in their featured order: numbered ones lowest first, then unnumbered ones. The home carousel uses the same featured order.

---

## Breadcrumb Row

- **Trail:** `nav aria-label="Breadcrumb"` with an ordered list: Home / Projects / the title. Phones drop Home. The separators are `aria-hidden`, and the current item has `aria-current="page"` and truncates.
- **Copy link** (`CopyLinkButton`) sits at the right end: 14px semibold `pe-primary` text with `IconLink`, on a 44px target.
  - It copies the canonical URL and reads "Link copied" for three seconds, through a polite live region.
  - If copying is refused, a read-only field holding the URL appears on a line under the row, focused and selected, labelled "Copy the link from this box."

---

## Hero

`ProjectHero`: one image and one H1 (`#project-title`) at every width.

**The H1** is the headline, else the project title (`projectTitle()` in `src/lib/projectSeo.ts`).

**From 768px**
- The photo is full-bleed: 400px tall, and 470px from 1024px. There's no hover zoom.
- A Night Teal scrim runs from 5% at 20% of the height, through 66% at 58%, to 92% at the foot.
- A headline of two lines or more lifts the text higher, where that scrim is lighter, so a second layer on the text block darkens behind whatever rises above a one-line title's text. It is Night Teal at 50%, fades in over the badge row, and is masked off the text's lowest 115px (124px from 1024px), the height of that text with a one-line title. So a one-line title keeps the first scrim alone, exactly as before.
- The text is aligned to the page container: the service badge (a link to the solution page), the H1 and the line under the headline.
- The H1 is Plus Jakarta Sans 800: 36px, and 44px from 1024px, with a line height of 1.08, `max-width: 25ch`, balanced wrapping, `break-words`, in white.
- The line under the headline is 16px `on-dark-muted`, with its items joined by a middle dot.
- The text sits 92px above the photo's foot when the Impact card overlaps it, and 40px when not.
- On the hero text, the focus ring turns white on a Night Teal halo.

**Below 768px**
- The photo is 4:3 inside the page margins, with a 16px radius.
- Under it: the badge, the H1 at 28px in `pe-text`, and the line under the headline at 14px in `pe-muted` on two lines (who or what and where, then the status and date).

**The line under the headline** (`metaLine()` in `src/lib/projectMeta.ts`):
1. the client's name when it is set, otherwise the site type;
2. the city;
3. the status and the completion date, as the month and year: "Completed June 2026", "In progress, due September 2027" or "Planned for September 2027"; the status alone ("Completed", "In progress", "Planned") without a date, and nothing without a status.

**The photo** (`src/lib/projectHeroImage.ts`): one `<picture>` with one `<img>`, both crops centred on the Studio hotspot and kept inside the editor's crop.
- From Tailwind's md, 48rem (768px at the default 16px font size), a 5:2 crop (`<source media="(min-width: 48rem)">`), at most 3072px wide. Its `sizes` is the width a cover fit needs: the window, or 1175px from lg (64rem) and 1000px below it where that's wider (the height times 2.5; the heights are in px, so those two widths are too).
- Below md (`not all and (min-width: 48rem)`), a 4:3 crop, at most 1600px wide, with `sizes` of the window less the page margins, which widen at sm (40rem). The media queries are in rem, as the layout's breakpoints are, so with a larger default font size each width still gets the crop its layout shows.
- Sanity cuts each crop (`rect=`) and never enlarges it; next/image's `getImageProps()` gives each its srcset, and its `object-position` keeps the hotspot in view.
- Loading: the photo is the LCP element. The `<img>` is `loading="eager"` with `fetchPriority="high"`, and `preload()` adds one preload link per crop, each with its own `media`. `getImageProps()` can't take a blur placeholder, so the LQIP sits blurred behind the photo instead.

**No hero photo, one whose size can't be read, or one whose Studio crop leaves too little of it for the hero's shape:** phones show no photo block, and wider screens show the service's colour gradient.

---

## Impact Card

`ProjectResults`, shown only with figures:
- **The card:** white with a 16px radius, as wide as the page container.
  - From 768px it overlaps the hero by 60px, with a soft Night Teal shadow.
  - On phones it sits 24px under the hero text, with a border.
- **Heading:** the h2 `#results-heading`, "Impact", in 12px uppercase `pe-muted`.
- **Figures:** up to four, as a `<dl>`. Each value is Plus Jakarta Sans 800, 28px, and 36px from 1024px, over its 14px label, then its note (the period and baseline) at 12px in `pe-muted` when set. Four sit across from 1024px, and two by two below.
- **The card ends after the figures:** no basis ("Projected" or "Measured"), no "as of" date, no note under the figures, no "How we calculated this" and no disclaimer link.

---

## The Site in Photos

`ProjectPhotos` (client):
- **Heading:** the h2 `#project-photos`, "The site in photos". With two or more photos, "View all N photos" opens the viewer at the first.
- **Which photos:** the gallery without any photo whose asset is the hero's, and without deleted images.
- **Tiles:** every tile is 4:3 with a 12px radius. Gaps are 12px from 768px and 8px on phones. The layout comes from `mosaicLayout()`:
  - 1 photo: a half-width tile (full width on phones);
  - 2: two equal tiles;
  - 3 or 4: a lead tile two thirds wide and two rows tall, with two beside it;
  - 5 or more: four columns, a lead tile two columns wide and two rows tall, with four beside it.
- **Phones:** at most three tiles: the lead full width with two below.
- **"+N":** the last tile shown at each width carries "+N" for the photos not shown.
- **Tile names:** each tile's image carries the photo's alt text, or "Project photo N" without one, so image search reads it there; the button adds a visually hidden "Open photo i of N: " before it, so its accessible name reads "Open photo i of N: alt".
- **The viewer** (`PhotoViewer`):
  - a full-screen dialog, "Photo i of N";
  - each photo is shown whole, with "i of N" visible in a polite live region, and its caption under it when set (`photoCaption()`), inside the dialog;
  - the arrow buttons, the arrow keys and a sideways swipe of at least 50px page through the photos, wrapping at the ends;
  - pinch-zoom works on the photo (`touch-action: pan-y pinch-zoom`), and a swipe doesn't page while the visitor is zoomed in (`isPinchZoomed()`);
  - `useModalDialog` handles Escape, the focus trap and returning focus to the tile.

---

## Story and Facts

`ProjectStory`, with the chapters from `projectChapters()` (`src/lib/projectStory.ts`). A chapter shows only when a text block has words in it, so image-only or empty chapters, or a headline without text, don't count.

**With a story, from 1024px**
- **Columns:** the story column, and the 340px facts panel beside it, 56px apart.
- **The panel stays in view** (`StickyWhenFits`, 96px from the top) only when it fits in the window with a 24px margin. Otherwise it scrolls with the page.

**With a story, below 1024px:** one column: the lead paragraph, the compact facts, then the chapters.

**The story**
- **Lead paragraph:** the summary, at 20px, with a line height of 1.6, up to 34em wide.
- **Chapters:** "The challenge", "Our solution" and "The outcome", 40px apart and up to 38rem wide. Each starts with its label in 12px uppercase `pe-muted`. With a headline, the headline is the chapter's h2 (`#chapter-{key}`), in Plus Jakarta Sans 800 at 26px with a line height of 1.2. Without one, the label is the h2.
- **Chapter text:** `projectTextComponents`: 17px paragraphs, subheadings as h3, lists and links. Images inside the text aren't shown, and the Studio no longer offers them.

**Facts** (`ProjectFacts`, with rows from `projectFacts()` in `src/lib/projectFacts.ts`)
- **Groups,** each row only when it's set and each group only when it has a row:
  - Project: Site; Client (when the name is set); Location; Service, linked to the solution page; Status, worded as in the line under the headline; Financing, each option on its own line, linked to the financing section (`#financing`) of the C&I Solar & Storage, Energy Optimisation or EV Fleets page, and to the solution page for the other services.
  - System: the System rows, in order.
  - Equipment: one row per component, for example "Inverter" with "[Brand] [model], 3 units"; one is "1 unit".
  - Delivery: On site ("6 weeks", or "1 week"), and the approvals, one per line.
- **The three versions:**
  - `panel`: every group, with an 18px h2 and 24px padding;
  - `compact`: below 1024px, the same 18px h2, with 20px padding on phones and 24px from 640px. The main rows show open: Client when the client is named, else Site; Location; the first two System rows; Financing. The rest sit under "All project facts", a native `<details>`, in their groups;
  - `columns`: full width from 1024px when there's no story: a column per group (`factColumnsClass()`), so one group sits in a column up to 28rem wide, two or three share the width, and four sit two by two until 1280px, then four across.

  Both versions for a width range are rendered and each is hidden at the other widths, so only one is ever in the accessibility tree.
- **Booking:** each version ends with the service's booking button (`projectCta(vertical, title)`, `TrackedButton`, `cta_location: project_facts:{slug}`) with no reply line under it. The `columns` version shows "Planning something similar?" beside the button.

---

## Next Project

`ProjectNext`, following `selectRelated()` (`src/lib/relatedProjects.ts`):

| Other projects | Shows | Heading |
|---|---|---|
| 3 or more in the same service | Three cards | Similar projects |
| 2 in the same service | Two large cards | Similar projects |
| 1 in the same service | One wide card | Next project |
| None in the same service | Up to two from other services, or one wide card | More projects |
| None at all | No section | (none) |

- **Styling:** a white section, keeping the id `similar-projects`.
- **The wide card** is `FeaturedProjectCard`, with an h3 title and its pill naming the service.
- **Cards:** the place line is the city, then the client's name when it is set (`cardPlace()`).
- **Order:** newest first.

---

## Closing Band

`ProjectBand`, unchanged in look:
- "Start your project" and "Ready for a similar project?", with no line under the heading (October 2026);
- the service's booking button (`TrackedButton`, light, `cta_location: project_band:{slug}`);
- "View published projects" (ghost).

With no next project above it, it keeps the gap between parts itself.

---

## SEO and Structured Data

- **Title:** the headline, else the project title (`projectTitle()`); the root template adds "| Phoenix Energy". The Open Graph title is the same.
- **Description:** the search description, else the summary cut to 155 characters at a word boundary (`projectDescription()`).
- **Metadata:** built with `pageMetadata()` (`src/lib/seo.ts`, `specs/02-ARCHITECTURE.md`), which gives the page `og:type` `article`, with `publishedTime` (`_createdAt`) and `modifiedTime` (`_updatedAt`).
- **Canonical and sharing:** the canonical URL is `/projects/{slug}`. The share image is the hero, cropped to 1200 by 630 and served as a JPEG (`sanityShareImage()`, `src/lib/sanityShareImage.ts`), with the hero's alt text, or, when it has none, the page title.
- **Indexing:** every project is indexed.
- **Structured data:** `projectArticleJsonLd()` and `projectBreadcrumbJsonLd()` in `src/lib/projectSeo.ts`, rendered through `JsonLd` (`src/components/layout/JsonLd.tsx`), which escapes "<".
  - **Article:** the headline (the page title), the description (the meta description), the image, `datePublished` (`_createdAt`), `dateModified` (`_updatedAt`), the organisation as author and publisher by its `@id`, `about` (the service) and `contentLocation` (the city).
  - It never holds the client's name field, an `address` property, or a results figure or System value.
  - **Breadcrumb:** `projectBreadcrumbJsonLd()` builds a `BreadcrumbList` with `breadcrumbJsonLd()` (`src/lib/structuredData.ts`): Home, Projects, then the project.
- **Errors:** only a missing project is a 404. A CMS error throws, so ISR keeps serving the last good page.

---

## Revalidation

When a project changes, the Sanity webhook (`src/app/api/revalidate/route.ts`) refreshes every project page (`revalidatePath('/projects/[slug]', 'page')`), `/projects`, home and the six solution pages, because a project's card appears on other projects' pages and on solution pages. A change, such as a client name removed, takes effect everywhere at once.

---

## Files

| File | Role |
|---|---|
| `src/app/projects/[slug]/page.tsx` | Reads the project; metadata, structured data and composition |
| `src/components/project/*` | `ProjectBreadcrumb`, `ProjectHero`, `ProjectResults`, `ProjectPhotos` (with `PhotoViewer`), `ProjectStory`, `ProjectFacts`, `StickyWhenFits`, `ProjectNext`, `ProjectBand` |
| `src/components/ui/PageBreadcrumb.tsx`, `PageHero.tsx`, `SidePanel.tsx`, `ClosingBand.tsx` | The shared parts under the project page (October 2026): `ProjectBreadcrumb`, `ProjectHero` and `ProjectBand` are thin wrappers over them, with the same markup, and `ProjectFacts` sits in `SidePanel`. The blog post page (`specs/10-BLOG.md`) is built on the same parts, with `StickyWhenFits` for its sidebar |
| `src/lib/projectData.ts` | Every project read, dropping figure and System rows without both a label and a value |
| `src/lib/projectMeta.ts`, `projectStory.ts`, `projectFacts.ts`, `projectPhotos.ts`, `projectHeroImage.ts`, `projectOptions.ts`, `stickyFit.ts`, `projectSeo.ts`, `projectOrder.ts`, `sanityDate.ts` | Pure logic, each with vitest tests |
| `src/components/ui/CopyLinkButton.tsx` and `TrackedButton.tsx` | Page actions. `CopyLinkButton` also exports its hook and parts (`useCopyLink`, `CopyLinkAction`, `CopyLinkStatus`, `CopyLinkField`), which the post's share group uses; its own markup is unchanged |
| `sanity/schemaTypes/project.ts` and `projectRules.ts` | The Studio's project form and the checks behind its warnings (`specs/12-CMS.md`) |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 4.2 | Rebuilt September 2026, simplified October 2026*

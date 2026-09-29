# 06: Single Project Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 4.0
> Route: `/projects/[slug]`
> **Rebuilt 2026-09-29 (step 1):** one template for every project, from the design spec `docs/superpowers/specs/2026-09-29-project-page-design.md`. Step 2 adds CMS fields: headline, site type, consent switches, commissioning date, financing, notes, calculation inputs, chapter headlines, equipment, delivery, captions and a search description. Until then, each part shows today's fields.

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
[Results card: overlaps the hero by 60px from 768px; only with results]
[The site in photos: 4:3 mosaic and the photo viewer; only with photos besides the hero]
[Story and facts: lead and chapters beside the facts panel from 1024px; facts full width when there is no story]
[Next project: "Similar projects", "Next project" or "More projects"]
[Closing band: "Ready for a similar project?"]
[Footer: SiteFooter]
```

From the results card to the next project, or from the hero when there are no results, parts are 64px apart from 1024px, 48px from 768px and 40px on phones.

The page file only reads the project and composes the parts in `src/components/project/`.

---

## Data and Disclosure

- **One module for every read:** every read of project content goes through `src/lib/projectData.ts`:
  - `getProjectBySlug`, cached per request with React `cache`, so the page and its metadata share one read;
  - `getAllProjects`, `getFeaturedProjects`, `getProjectsByVertical`, `getProjectSlugs` and `getProjectSitemapEntries`.
- **What the queries leave out:** the project queries in `src/lib/queries.ts` leave out the client's name and the project value, which may show only with the client's consent. The CMS can't record that consent until step 2. Project images select only the URL, the LQIP, the dimensions, the asset id, the alt text, and the hotspot and crop, never the whole asset document, whose file name can name the client.
- **Rand amounts:** `discloseProject()` (`src/lib/projectDisclosure.ts`) drops any results figure or System row that looks like a rand amount, label and value together: an R before a number, R written as a unit ("(R)", "(R/kWh)", "(R'000)", "2.10 R/kWh", "450 000 R"), "ZAR", the word "rand", or a price in cents ("180c/kWh", "(c/kWh)", "95 cents").
- **Prose:** the summary and the story are prose, and aren't filtered.
- **Order:** newest first, meaning the date a project was added to the CMS (`_createdAt`) until step 2 adds a commissioning date. `/projects` puts featured projects first, in their featured order.

---

## Breadcrumb Row

- **Trail:** `nav aria-label="Breadcrumb"` with an ordered list: Home / Projects / the title. Phones drop Home. The separators are `aria-hidden`, and the current item has `aria-current="page"` and truncates.
- **Copy link** (`CopyLinkButton`) sits at the right end: 14px semibold `pe-primary` text with `IconLink`, on a 44px target.
  - It copies the canonical URL and reads "Link copied" for three seconds, through a polite live region.
  - If copying is refused, a read-only field holding the URL appears on a line under the row, focused and selected, labelled "Copy the link from this box."

---

## Hero

`ProjectHero`: one image and one H1 (`#project-title`) at every width.

**From 768px**
- The photo is full-bleed: 400px tall, and 470px from 1024px. `object-position` follows the Studio hotspot, and there's no hover zoom.
- A Night Teal scrim runs from 5% at 20% of the height, through 66% at 58%, to 92% at the foot.
- The text is aligned to the page container: the service badge (a link to the solution page), the H1 and the line under the headline.
- The H1 is Plus Jakarta Sans 800: 36px, and 44px from 1024px, with a line height of 1.08, `max-width: 25ch`, balanced wrapping, `break-words`, in white.
- The line under the headline is 16px `on-dark-muted`, with its items joined by a middle dot.
- The text sits 92px above the photo's foot when the results card overlaps it, and 40px when not.
- On the hero text, the focus ring turns white on a Night Teal halo.

**Below 768px**
- The photo is 4:3 inside the page margins, with a 16px radius.
- Under it: the badge, the H1 at 28px in `pe-text`, and the line under the headline at 14px in `pe-muted` on two lines (the city, then the status and date).

**The line under the headline** (`metaLine()` in `src/lib/projectMeta.ts`): the city, then the status and date:
- "Completed Q2 2026";
- "In progress, due Q3 2027";
- "Planned for Q3 2027";
- the status alone without a date, and nothing without a status.

**No hero photo:** phones show no photo block, and wider screens show the service's colour gradient.

**Loading:** the photo is the LCP element: `preload`, a blur placeholder from its LQIP, and `sizes` of `100vw` from 768px.

---

## Results Card

`ProjectResults`, shown only with results:
- **The card:** white with a 16px radius, as wide as the page container.
  - From 768px it overlaps the hero by 60px, with a soft Night Teal shadow.
  - On phones it sits 24px under the hero text, with a border.
- **Heading:** the h2 `#results-heading`, "Projected results" or "Measured results" (`describeResults()`), in 12px uppercase `pe-muted`, then "as of [date]" when set.
- **Measured or projected:** figures are measured only when an editor marks them so and the project is completed.
- **Figures:** up to four, as a `<dl>`. Each value is Plus Jakarta Sans 800, 28px, and 36px from 1024px, over its 14px label. Four sit across from 1024px, and two by two below.
- **Foot row:** the editor's "Results note" (else the default sentence for projections), then "Read the disclaimer" (`ArrowLink` to `/disclaimer`).

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
- **Tile names:** each tile is a button named "Open photo i of N: alt", or "Project photo N" without alt text.
- **The viewer:**
  - a full-screen dialog, "Photo i of N";
  - each photo is shown whole, with "i of N" visible in a polite live region;
  - the arrow buttons, the arrow keys and a sideways swipe of at least 50px page through the photos, wrapping at the ends;
  - pinch-zoom works on the photo (`touch-action: pan-y pinch-zoom`), and a swipe doesn't page while the visitor is zoomed in (`isPinchZoomed()`);
  - `useModalDialog` handles Escape, the focus trap and returning focus to the tile.

---

## Story and Facts

`ProjectStory`, with the chapters from `projectChapters()` (`src/lib/projectStory.ts`). A chapter shows only when a text block has words in it, so image-only or empty chapters don't count.

**With a story, from 1024px**
- **Columns:** the story column, and the 340px facts panel beside it, 56px apart.
- **The panel stays in view** (`StickyWhenFits`, 96px from the top) only when it fits in the window with a 24px margin. Otherwise it scrolls with the page.

**With a story, below 1024px:** one column: the lead paragraph, the compact facts, then the chapters.

**The story**
- **Lead paragraph:** the summary, at 20px, with a line height of 1.6, up to 34em wide.
- **Chapters:** "The challenge", "Our solution" and "The outcome", 40px apart and up to 38rem wide. Each label is the chapter's h2 (`#chapter-{key}`), in 12px uppercase `pe-muted`, until chapters get headlines in step 2.
- **Chapter text:** `projectTextComponents`: 17px paragraphs, headings as h3, lists and links. Images inside the text aren't shown.

**Facts** (`ProjectFacts`, with rows from `projectFacts()` in `src/lib/projectFacts.ts`)
- **Groups:**
  - Project: Location; Service, linked to the solution page; Status.
  - System: the "Stats strip metrics" rows, in order.

  A row shows only when it's set, and a group only when it has a row.
- **The three versions:**
  - `panel`: every group;
  - `compact`: below 1024px, Location and the first two System rows open, and the rest under "All project facts", a native `<details>`;
  - `columns`: full width from 1024px when there's no story, with the groups in columns of at least 240px.

  Both versions for a width range are rendered and each is hidden at the other widths, so only one is ever in the accessibility tree.
- **Booking:** each version ends with the service's booking button (`projectCta(vertical, title)`, `TrackedButton`, `cta_location: project_facts:{slug}`) and "We reply within 1 business day." The `columns` version shows "Planning something similar? We reply within 1 business day." beside the button.

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
- **Order:** newest first.

---

## Closing Band

`ProjectBand`, unchanged in look:
- "Start your project" and "Ready for a similar project?";
- "Tell us about your site. We reply within 1 business day.";
- the service's booking button (`TrackedButton`, light, `cta_location: project_band:{slug}`);
- "View published projects" (ghost).

With no next project above it, it keeps the gap between parts itself.

---

## SEO and Structured Data

- **Title and description:** the title is the project title, and the root template adds "| Phoenix Energy". The description is the summary cut to 155 characters at a word boundary (`projectDescription()`).
- **Canonical and sharing:** the canonical URL is `/projects/{slug}`. Open Graph holds the title, the description and the hero at 1200 by 630.
- **Indexing:** every project is indexed.
- **Structured data:** `projectArticleJsonLd()` and `projectBreadcrumbJsonLd()` in `src/lib/projectSeo.ts`, written with `serializeJsonLd()`, which escapes "<".
  - **Article:** the headline, the description, the image, `datePublished` (`_createdAt`), `dateModified` (`_updatedAt`), Phoenix Energy as author and publisher, `about` (the service) and `contentLocation` (the city).
  - It never holds the client's name field, an `address` property, or a results figure or System value.
- **Errors:** only a missing project is a 404. A CMS error throws, so ISR keeps serving the last good page.

---

## Files

| File | Role |
|---|---|
| `src/app/projects/[slug]/page.tsx` | Reads the project; metadata, structured data and composition |
| `src/components/project/*` | `ProjectBreadcrumb`, `ProjectHero`, `ProjectResults`, `ProjectPhotos`, `ProjectStory`, `ProjectFacts`, `StickyWhenFits`, `ProjectNext`, `ProjectBand` |
| `src/lib/projectData.ts` | Every project read, with the disclosure rules |
| `src/lib/projectDisclosure.ts`, `projectMeta.ts`, `projectStory.ts`, `projectFacts.ts`, `projectPhotos.ts`, `stickyFit.ts`, `projectSeo.ts`, `projectOrder.ts`, `projectResults.ts` | Pure logic, each with vitest tests |
| `src/components/ui/CopyLinkButton.tsx` and `TrackedButton.tsx` | Page actions |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 4.0 | Rebuilt September 2026*

# 12 — CMS Schemas (Sanity)
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0
> **Updated 2026-09-24:** corrected to match the build. All ten schemas in `sanity/schemaTypes/` are now described here.

---

## Project Schema

```typescript
// sanity/schemaTypes/project.ts
{
  title:           string
  slug:            slug (unique)
  vertical:        string (enum: SolutionVertical)
  featured:        boolean  // home "Projects" carousel; on /projects (once filters show) the first featured complete case study gets the large card
  featuredOrder:   number   // optional; lower first in the home carousel and on /projects (complete case studies still lead)
  location:        string
  clientName:      string
  systemSize:      string   // e.g. "4.8 MW"
  completionDate:  string
  projectValue:    string   // e.g. "R42M"
  status:          'completed' | 'in-progress' | 'planned'
  heroImage:       image (with alt)
  gallery:         image[]
  summary:         text (short)
  challenge:       portable text
  solution:        portable text
  outcome:         portable text
  metrics: [{
    label: string
    value: string
  }]
  results: [{                // results strip, up to 4; the first two lead the project card
    label: string
    value: string
  }]
  resultsBasis:       'projected' | 'measured'  // optional; empty means projected
  resultsAsOf:        date                      // optional; model date or end of the measured period
  resultsAssumptions: text                      // optional; one or two sentences, max 300 characters (warning)
  // No related field: PROJECT_BY_SLUG_QUERY returns up to three other projects from the same vertical,
  // and up to two from other verticals for when the vertical has none (specs/06-PROJECT-SINGLE.md).
}
```

### Results basis fields (added September 2026)

The results strip used to be titled "Project results" although its figures were forecasts. These three optional fields let editors say what the figures rest on:

| Field | Studio title | Type | Effect on the site |
|---|---|---|---|
| `resultsBasis` | Results basis | radio: Projected (financial model) or Measured (metered or billed data) | The strip heading reads "Measured results" only when this is Measured. Empty or Projected gives "Projected results", and project cards caption their outcomes "Projected results". |
| `resultsAsOf` | Results as of | date | Shown beside the strip heading as "As of 30 June 2026". |
| `resultsAssumptions` | Results note | text | Shown under the strip, replacing the default note for projections. Measured results show a note only when this is set. |

No existing document sets them, so every project currently shows "Projected results" with the default note. The GROQ projections in `src/lib/queries.ts` return `resultsBasis` with the card fields and all three on the single project query; the types are in `src/types/sanity.ts` and the labelling rules in `src/lib/projectResults.ts`.

---

## Company Stats Schema

```typescript
// sanity/schemaTypes/companyStats.ts (singleton)
{
  stats: [{                  // exactly four; home "By the numbers" and About "Phoenix at a glance"
    value:      string       // required, e.g. "40+"
    label:      string       // required, max 60, e.g. "Projects completed"
    definition: text         // optional: what counts towards the figure, and its scope
    basis:      text         // optional: counted, measured or estimated, and from what
    source:     string       // optional: where the evidence is kept
    asOf:       date         // optional: the date the figure was true
  }]
}
```

### Claims register fields (added September 2026)

The four stats are the company-level rows of the claims register (`docs/content/claims-register.md`). The four optional fields let editors record what each figure rests on:

| Field | Studio title | Type | Effect on the site |
|---|---|---|---|
| `definition` | What it counts | text | None. For whoever has to stand behind the figure. |
| `basis` | How it was worked out | text | None. |
| `source` | Evidence | string | None. |
| `asOf` | As at | date | When set, a caption "As at 30 June 2026" shows under the stat on home, About and the footer's stats variant. Nothing shows when it's empty. |

No document sets them yet, so no caption shows. `COMPANY_STATS_QUERY` returns all six fields; the type is `CompanyStat` in `src/types/sanity.ts` and the caption rule is `statAsOfCaption()` in `src/lib/companyStats.ts`. The code fallback (`DEFAULT_COMPANY_STATS`, shown only when Sanity is unreachable) still differs from the published figures; the register lists the differences.

Every other figure the site states in code (vertical stats, estimator bands, FAQ figures, response times) is in the typed register `src/config/claims.ts`.

---

## How It Works Schema

`sanity/schemaTypes/howItWorks.ts`. Seven documents with fixed IDs, one per page: `howItWorks.home` and `howItWorks.<vertical slug>` (for example `howItWorks.wheeling`). Studio lists them under "How It Works". `getHowItWorks()` in `src/lib/getHowItWorks.ts` reads one by ID, and the page hides the section when the document is missing or has no title or no steps.

| Field | Type | What the site uses it for |
|---|---|---|
| `eyebrow` | string, default "How it works" | Small label above the title. |
| `title` | string, required | Section title. Words wrapped in `<em></em>` show in the accent colour. |
| `subtitle` | text | Short sentence under the title. |
| `steps` | array of `{ label, description, tag }`, at least 2 | The step track. `label` and `description` are required; `tag` is an optional pill such as "Free". |
| `showCta` | boolean, default true | Shows or hides the button under the steps. |
| `ctaLabel`, `ctaHref` | string, deprecated and read-only | Not queried. See the next section. |

Home and five solution pages read their document. The WeBuySolar page doesn't: its steps are in `src/config/webuysolarContent.ts` and it shows no button, so editing `howItWorks.webuysolar` changes nothing on the site.

---

## How It Works: CTA fields retired (September 2026)

The How It Works singletons keep `showCta`, which still hides or shows the button. `ctaLabel` and `ctaHref` are marked deprecated and read-only in Studio and are no longer queried: the button's label and link come from `src/config/ctas.ts`, so every page uses the same small set of labels and a link that opens the contact form with the service already named. Home uses "Book a discovery meeting"; each solution page that reads its document passes its own CTA.

---

## Hero Images Schema

`sanity/schemaTypes/heroImages.ts`. One document, ID `heroImages` (Studio: "Hero Images"). `getHeroImages()` in `src/lib/getHeroImages.ts` returns each image's URL and blur placeholder (LQIP), keyed by vertical slug.

| Field | Type | What the site uses it for |
|---|---|---|
| `ciSolarStorage`, `wheeling`, `energyOptimisation`, `carbonCredits`, `webuysolar`, `evFleets` | image (hotspot on) | That vertical's photo in the home hero accordion, on its solution page hero and on its card on /solutions. |

A missing image falls back to a gradient in the home accordion and the solution hero, and to a plain grey block on the /solutions card. The query returns the full image URL, so the hotspot doesn't change the crop; the site crops with CSS.

---

## Energy & Fuel Prices Schema

`sanity/schemaTypes/energyPrices.ts`. One document, ID `energyPrices` (Studio: "Energy & Fuel Prices"). It feeds the EV Fleets savings estimator (`FleetSavingsEstimator`) through `getEnergyPrices()` in `src/lib/getEnergyPrices.ts`.

| Field | Type | What the site uses it for |
|---|---|---|
| `dieselPricePerL` | number, required, positive | Fuel cost of a diesel vehicle in the estimate. |
| `petrol93PricePerL` | number, required, positive | Fuel cost when the visitor picks petrol, for vehicle types that offer it. |
| `gridPricePerKwh` | number, required, positive | Electricity cost when charging from the grid. |
| `solarPricePerKwh` | number, required, positive | Electricity cost when charging from solar. |
| `effectiveDate` | date | Shown on the rates line as "effective" with the month and year. |
| `sourceLabel` | string | Shown on the rates line as "source:" with the label. |

Each missing or invalid price falls back to its constant in `src/lib/evfleet/estimate.ts`. The source and date show only when all four prices come from the document; otherwise the rates line says the rates are estimates, not live prices.

---

## Blog Post Schema

```typescript
// sanity/schemaTypes/blogPost.ts
{
  title:          string
  slug:           slug (unique)
  author:         reference → author   // required; see Author Schema below
  publishedAt:    datetime
  updatedAt:      datetime             // optional; JSON-LD dateModified, falls back to publishedAt
  featured:       boolean              // pinned to the top of the blog index
  category:       'Industry Insights' | 'Project Spotlight' | 'Company News' | 'Press Release'
  tags:           string[]             // vertical tags from a fixed list of six; filter pills, related posts, solution page articles
  heroImage:      image (with alt)
  excerpt:        text (155 characters max)
  readTime:       number (minutes)
  body:           portable text (with image, callout, stat strip and inline CTA blocks)
  seoTitle:       string
  seoDescription: text
  ogImage:        image
  canonicalUrl:   url                  // only when the post was first published elsewhere
}
```

The full blogPost schema, with the body block fields and the Studio descriptions, is in `10-BLOG.md` (Sanity Schema, blogPost).

---

## Author Schema

`sanity/schemaTypes/author.ts`. One document per blog author; each post's `author` field references one. Studio lists authors under Blog.

| Field | Type | What the site uses it for |
|---|---|---|
| `name` | string, required | The post byline, the featured card on /blog, the author card, the author page heading, and the author in the Article JSON-LD. |
| `slug` | slug from `name`, required | The author page URL, `/blog/authors/[slug]`. |
| `role` | string | Under the name on the author card and the author page; `jobTitle` in the JSON-LD. |
| `photo` | image (hotspot, alt) | The avatar on the byline, the featured card on /blog, the author card and the author page. Initials show when it is empty. |
| `bio` | text, 2 to 4 sentences | The author card on each post and the author page, and the author page's meta description. |
| `linkedin` | url | A LinkedIn link on the author page. |

---

## Team Member Schema

> **Authoritative.** This is the canonical schema. `08-ABOUT.md` is the authoritative UI spec. The team grid on the About page is fully CMS-driven — no team member data is hardcoded anywhere.

```typescript
// sanity/schemaTypes/teamMember.ts
{
  // ── Identity ──────────────────────────────────────────────
  name:           string                          // Full name. Required.
  slug:           slug (unique, from name)        // Reserved for future profile pages
  photo:          image (with alt, hotspot: true) // Portrait. Required. The grid crops it from the centre; the hotspot isn't applied.
  
  // ── Role & category ───────────────────────────────────────
  role:           string                          // Job title e.g. "Co-Founder & CEO". Required.
  category:       'founders' | 'business' | 'technical'  // Drives filter tabs. Required.
  archetype:      string                          // One-line descriptor e.g. "The Strategist". Optional.
                                                  // Shown between the name and the role, in pe-secondary-ink.
  
  // ── Bio ───────────────────────────────────────────────────
  bio:            text                            // 2 to 4 sentences. Queried but not rendered anywhere yet.
                                                  // Reserved for future profile pages.

  // ── Contact & social ──────────────────────────────────────
  linkedin:       url                             // Optional. Renders LinkedIn icon on card.

  // ── Display control ───────────────────────────────────────
  order:          number                          // Sort order within category. Lower = earlier. Required.
                                                  // Founders always render before Business before Technical
                                                  // regardless of order value — category is the primary sort.
  active:         boolean                         // Default: true. Set false to hide without deleting.
                                                  // Lets client deactivate departed team members instantly
                                                  // without a code change.
}
```

### Field guidance for Sanity Studio

| Field | Required | Notes for content editor |
|---|---|---|
| Name | ✅ | Full name as it should appear publicly |
| Photo | ✅ | Portrait photo. The card shows it at 3:4, cropped from the centre; the hotspot isn't applied. |
| Role | ✅ | Job title. Keep concise — max ~40 chars fits cleanly on the dark card |
| Category | ✅ | Controls which filter tab this person appears under |
| Archetype | — | Optional flavour descriptor. If blank, only role is shown. Examples: *"The Strategist"*, *"The Builder"*, *"The Operator"* |
| Bio | — | 2–4 sentences. Not shown on the grid — reserved for future team profile pages |
| LinkedIn | — | Full URL e.g. `https://www.linkedin.com/in/username` |
| Order | ✅ | Integer. Controls position within the category. Founders: 1, 2, 3. Business: 1, 2... etc. |
| Active | ✅ | Default true. Uncheck to hide a departed member without deleting their record |

### Initial team members to create in Sanity

| Name | Role | Category | Archetype | Order |
|---|---|---|---|---|
| Erin Berman-Levy | Co-Founder | founders | The Strategist | 1 |
| Ricardo De Sousa | Co-Founder | founders | The Innovator | 2 |
| Russel Swanepoel | Co-Founder | founders | The Trailblazer | 3 |

> ⚠️ Photos, LinkedIn URLs, bio copy, and any additional team members to be supplied by client before launch.

### TypeScript type

```typescript
// src/types/sanity.ts
export interface TeamMember {
  _id:        string;
  name:       string;
  slug:       { current: string };
  photo:      SanityImage;           // with alt + hotspot
  role:       string;
  category:   'founders' | 'business' | 'technical';
  archetype?: string;
  bio?:       string;
  linkedin?:  string;
  order:      number;
  active:     boolean;
}
```

---

## Timeline Milestone Schema

`sanity/schemaTypes/milestoneTimeline.ts`. One document per milestone (Studio: "Timeline Milestones"). `MILESTONE_TIMELINE_QUERY` feeds the About timeline (`AboutTimeline`), which is hidden when no milestone is active.

| Field | Type | What the site uses it for |
|---|---|---|
| `date` | string, required | The date label exactly as shown, for example "March 2026". Not a date picker. |
| `title` | string, required, max 120 | The milestone text. |
| `isFuture` | boolean, default false | Marks a vision milestone: a faded card with a dashed border, italic text and a "Vision" badge. |
| `order` | number, required | Position on the timeline, lower first. |
| `active` | boolean, default true | Unchecked milestones are hidden. |

---

## Partner Schema

`sanity/schemaTypes/partner.ts`. One document per logo (Studio: "Partners & Investors"). `PARTNERS_QUERY` feeds the partners section (`AboutTrust`, eyebrow "Partners and financiers") on home and About.

| Field | Type | What the site uses it for |
|---|---|---|
| `name` | string, required | The logo's alt text, and the initials shown when there is no logo. |
| `logo` | image | The logo on a light card. Upload a PNG or SVG with a transparent background. |
| `website` | url | When set, the card links to it in a new tab. |
| `category` | `investors`, `partners` or `media`, required | About shows two tabs, "Investors & Financiers" and "Partners". `media` has no tab, so those logos show only on home. |
| `order` | number, required | Sort order, lower first. |
| `active` | boolean, default true | Unchecked partners are hidden. |

Home shows every active partner in one centred grid, with no tabs.

---

## GROQ Query Library

```typescript
// src/lib/queries.ts (field projections shortened to { ... })

// Fragment, not a query: a project is a case study once challenge, solution and outcome all have content.
// Cards receive it as caseStudyReady; src/app/sitemap.ts lists only these projects.
export const CASE_STUDY_READY = `defined(challenge[0]) && defined(solution[0]) && defined(outcome[0])`;

// All projects (/projects)
export const ALL_PROJECTS_QUERY = `*[_type == "project"] | order(completionDate desc) { ... }`;

// Featured projects (home "Projects" carousel), no limit
export const FEATURED_PROJECTS_QUERY = `*[_type == "project" && featured == true] | order(coalesce(featuredOrder, 99) asc, completionDate desc) { ... }`;

// Projects by vertical (the "Projects" section on each solution page), up to six
export const PROJECTS_BY_VERTICAL_QUERY = `*[_type == "project" && vertical == $vertical] | order(completionDate desc) [0..5] { ... }`;

// One featured project per vertical. Exported, but no page uses it.
export const FLAGSHIP_BY_VERTICAL_QUERY = `*[_type == "project" && vertical == $vertical && featured == true] | order(coalesce(featuredOrder, 99) asc, completionDate desc) [0] { ... }`;

// Single project, with up to three related projects from the same vertical and, for when it has none,
// up to two from other verticals; both put complete case studies first, then the newest (/projects/[slug])
export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0] { ..., "related": *[_type == "project" && vertical == ^.vertical && slug.current != $slug] | order((${CASE_STUDY_READY}) desc, _createdAt desc) [0..2] { ... }, "otherProjects": *[_type == "project" && vertical != ^.vertical && slug.current != $slug] | order((${CASE_STUDY_READY}) desc, _createdAt desc) [0..1] { ... } }`;

// Project slugs (generateStaticParams)
export const ALL_PROJECT_SLUGS_QUERY = `*[_type == "project"]{ "slug": slug.current }`;

// Blog index: category, tag and search filters, featured first, six per page (/blog)
export const BLOG_INDEX_QUERY = `*[_type == "blogPost" && ($category == "" || category == $category) && ($tag == "" || $tag in tags) && ($q == "" || title match $q || excerpt match $q)] | order(featured desc, publishedAt desc) [$offset...$offset+6] { ... }`;

// Post count under the same filters (/blog pagination)
export const BLOG_COUNT_QUERY = `count(*[_type == "blogPost" && ...same filters as BLOG_INDEX_QUERY])`;

// Every published post, whatever the filters (home SearchAction; /blog noindex while it is 0)
export const PUBLISHED_POSTS_COUNT_QUERY = `count(*[_type == "blogPost"])`;

// Featured article card (/blog)
export const FEATURED_POST_QUERY = `*[_type == "blogPost"] | order(featured desc, publishedAt desc) [0] { ... }`;

// Tags for the filter pills (/blog)
export const ALL_BLOG_TAGS_QUERY = `array::unique(*[_type == "blogPost"].tags[])`;

// Latest 3 posts (home)
export const LATEST_POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) [0..2] { ... }`;

// Up to three posts tagged with a vertical (RelatedArticles on solution pages)
export const POSTS_BY_VERTICAL_QUERY = `*[_type == "blogPost" && $tag in tags] | order(publishedAt desc) [0..2] { ... }`;

// Single post, with its author and up to three related posts sharing its category or a tag (/blog/[slug])
export const POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] { ..., "author": author->{ ... }, "related": *[ ... ] | order(publishedAt desc) [0..2] { ... } }`;

// Post slugs (generateStaticParams)
export const ALL_BLOG_SLUGS_QUERY = `*[_type == "blogPost"]{ "slug": slug.current }`;

// Author page (/blog/authors/[slug]): the author, their posts, and every author slug
export const AUTHOR_BY_SLUG_QUERY = `*[_type == "author" && slug.current == $slug][0] { ... }`;
export const POSTS_BY_AUTHOR_QUERY = `*[_type == "blogPost" && references(*[_type == "author" && slug.current == $slug]._id)] | order(publishedAt desc) { ... }`;
export const ALL_AUTHOR_SLUGS_QUERY = `*[_type == "author"]{ "slug": slug.current }`;

// About timeline, and the partners section on home and About (TEAM_MEMBERS_QUERY: see GROQ Queries, Team Members below)
export const MILESTONE_TIMELINE_QUERY = `*[_type == "milestoneTimeline" && active == true] | order(order asc) { ... }`;
export const PARTNERS_QUERY = `*[_type == "partner" && active == true] | order(order asc) { ... }`;

// Singletons, each read through a helper in src/lib/ that never throws
export const COMPANY_STATS_QUERY = `*[_type == "companyStats"][0] { "stats": stats[]{ value, label, definition, basis, source, asOf } }`; // getCompanyStats()
export const HOW_IT_WORKS_QUERY = `*[_id == $id][0]{ eyebrow, title, subtitle, steps[]{ label, description, tag }, "showCTA": showCta }`; // getHowItWorks(), $id = "howItWorks.<page>"
export const HERO_IMAGES_QUERY = `*[_id == "heroImages"][0]{ ... }`; // getHeroImages(): { url, lqip } per vertical slug
export const ENERGY_PRICES_QUERY = `*[_id == "energyPrices"][0]{ ... }`; // getEnergyPrices()
```

Three queries sit outside this file: the navbar's post count in `src/app/layout.tsx` (the blog link appears once three posts exist) and the blog and project lists in `src/app/sitemap.ts`.

---

*Spoke of [`/CLAUDE.md`](/CLAUDE.md)*

---

## ⚠️ Deprecation Notice (Engineering Review April 2026)

Withdrawn on 24 September 2026. Every schema here was checked against `sanity/schemaTypes/` that day, and the file holds rules found nowhere else (results basis, company stats evidence fields, the retired How It Works CTA fields). The April corrections this notice listed (`blogPost.author` as a reference, `tags`, `featured`, `updatedAt`, and the author schema) are applied in the sections above. `10-BLOG.md` keeps the fuller blogPost schema, with the body block fields.


---

## GROQ Queries — Team Members

```typescript
// src/lib/queries.ts

// All active team members: founders, then business, then technical; by order within each
export const TEAM_MEMBERS_QUERY = `
  *[_type == "teamMember" && active == true]
  | order(
    select(category == "founders" => 1, category == "business" => 2, 3) asc,
    order asc
  ) {
    _id,
    name,
    "slug": { "current": slug.current },
    "photo": photo { asset->, alt, hotspot, crop },
    role,
    category,
    archetype,
    bio,
    linkedin,
    order,
    active
  }
`;

// Filter tabs: AboutTeam keeps a fixed list (All, Founders, Business, Technical)
// and shows only the categories that the returned members use.
// If no 'technical' members exist, that tab simply doesn't appear.
```


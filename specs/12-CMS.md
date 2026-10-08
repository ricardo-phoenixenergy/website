# 12 — CMS Schemas (Sanity)
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0
> **Updated 2026-09-29:** the project schema's step 2 fields, consent switches and Studio warnings. All ten schemas in `sanity/schemaTypes/` are described here.

---

## Project Schema

```typescript
// sanity/schemaTypes/project.ts: six groups, Overview first (the default)
{
  // Overview
  title:             string    // required
  slug:              slug      // required, from the title
  headline:          string    // max 90; the H1, page title and sharing title; empty uses the title
  vertical:          string    // required (enum: SolutionVertical)
  siteType:          string    // max 40; the line under the headline (when the client isn't named) and the Site row
  location:          string
  status:            'completed' | 'in-progress' | 'planned'
  commissionedOn:    date      // shown as "June 2026" and used for the order; a warning when completed and empty
  completionDate:    string    // free text: a planned or in-progress project's target, e.g. "Q3 2027"
  financing:         string[]  // up to 3: outright-purchase, ppa, pla, energy-efficiency-lease, other (src/lib/projectOptions.ts)
  clientName:        string    // shown only with "Show client name" on and a readable consent date (YYYY-MM-DD)
  showClientName:    boolean   // off by default
  clientConsentOn:   date      // required when showClientName is on, hidden when it's off; never shown or returned (the queries only read it to check it's a readable date)
  showRandAmounts:   boolean   // off by default; off drops every rand amount from the figures and withholds projectValue
  projectValue:      string    // e.g. "R[x]M excl. VAT"; shown only with "Show rand amounts" on
  featured:          boolean   // home "Projects" carousel; featured projects lead /projects
  featuredOrder:     number    // optional; lower first on home and /projects, unnumbered ones after numbered ones
  systemSize:        string    // hidden in the Studio and never shown; the data stays
  // Results
  results: [{                  // "Results (up to 4)": a warning above four; the first two lead the project card
    label: string
    value: string
    note:  string              // max 70; the period and baseline, shown under the figure
  }]
  resultsBasis:       'projected' | 'measured'  // empty means projected; a warning when measured and not completed
  resultsAsOf:        date                      // a warning when results exist and it's empty
  resultsAssumptions: text                      // the Results note: max 300 characters (warning)
  resultsInputs: [{            // "Calculation inputs": up to 8; a warning when results exist without them
    label: string              // required, max 40
    value: string              // required, max 80
  }]
  // Story
  summary:           text      // the lead paragraph, and the search description's fallback
  challengeHeadline: string    // max 90; the chapter's h2
  challenge:         portable text   // Normal and Subheading styles, bullet and numbered lists, bold, italic, links
  solutionHeadline:  string    // max 90
  solution:          portable text   // the same; the inline image option is gone (the site never showed it)
  outcomeHeadline:   string    // max 90
  outcome:           portable text   // the same
  // Facts
  metrics: [{                  // "System (2 to 4 rows)": a warning outside 2 to 4
    label: string
    value: string
  }]
  equipment: [{                // up to 12
    component: string          // required: Solar panels, Inverter, Battery, Mounting, Monitoring, EV charger, Motor, Variable speed drive or Other
    brand:     string          // required
    model:     string
    quantity:  number          // a whole number, at least 1
  }]
  installationWeeks: number    // a whole number, 1 to 104: weeks from starting on site to commissioning
  approvals:         string[]  // up to 6, max 100 each
  // Photos
  heroImage:         image     // hotspot; alt required; a warning under 2400px wide
  gallery:           image[]   // hotspot; alt required; caption max 120
  // Search
  seoDescription:    string    // max 155; empty uses the summary
  // No related field: PROJECT_BY_SLUG_QUERY returns up to three other projects from the same vertical,
  // and up to two from other verticals for when the vertical has none (specs/06-PROJECT-SINGLE.md).
}
```

### Consent, warnings and help text (step 2, September 2026)

The fields, their groups, validation and Studio help text follow the table in `docs/superpowers/specs/2026-09-29-project-page-design.md` ("CMS fields (step 2)"), and every one is optional with a fallback on the site, so a project that doesn't set them keeps working.

- **Consent:** "Show client name" and "Show rand amounts" are off by default. The queries in `src/lib/queries.ts` return `clientName` only while "Show client name" is on and `clientConsentOn` is a readable date (YYYY-MM-DD, the form the Studio's date field writes), and `projectValue` only while "Show rand amounts" is on; a switch that is off leaves the field out of the data. The queries read the consent date in that condition and never return it.
- **One consent test:** the Studio decides whether the name may show by the queries' test (`nameMayShow()` in `sanity/schemaTypes/projectRules.ts`): the switch on and a consent date in YYYY-MM-DD form. It stops a document being published with "Show client name" on and no consent date in that form, so an imported "TBC" or "12 June 2026" blocks publishing as an empty date does, and the name warnings stay on until the name may show.
- **Warnings on text shown as written:** the title, the site type, the location, the completion date, the summary, the story, the headline and chapter headlines, the figure notes, the Results note, each approval, each equipment brand and model, alt text, captions and the search description show on the site as written. Each warns while it holds what looks like a rand amount and "Show rand amounts" is off, or the client's name before the name may show (`sanity/schemaTypes/projectRules.ts`, which uses the site's own `isRandAmount()`). The slug warns when it names the client before the name may show, its hyphens read as spaces; a slug can't hold a rand amount.
- **Row warnings:** the site drops a results figure, System row or calculation input whose label, value or note looks like a rand amount while "Show rand amounts" is off. Such a row warns that it won't show, and asks for it to be reworded or the switch turned on once the client agrees; the Studio uses the site's own test (`isRandRow()` in `src/lib/projectDisclosure.ts`). Otherwise a row warns when it names the client before the name may show.
- **Other warnings:** a hero photo under 2400px wide ("Photos under 2400px wide look soft on large screens."), more than four results, System rows outside 2 to 4, Measured results on a project that isn't completed, results without an as-of date or calculation inputs, a completed project without a commissioning date, and a commissioning date on a project that isn't completed: the project lists are ordered by that date, so it would move the project ahead of completed ones.
- **Tests:** `sanity/schemaTypes/project.test.ts` checks the groups, the help text, the limits and the warnings; `projectRules.test.ts` checks the rules.

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

A missing image falls back to a gradient in the home accordion and the solution hero, and to a tint of the vertical's accent on the /solutions card. The query returns the full image URL, so the hotspot doesn't change the crop; the site crops with CSS.

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
  publishedAt:    datetime             // a future date holds the post back; see "Live posts" below
  updatedAt:      datetime             // optional, "Last updated"; JSON-LD dateModified, falls back to publishedAt
  featured:       boolean              // pinned to the top of the blog index
  category:       'Industry Insights' | 'Project Spotlight' | 'Company News' | 'Press Release'
  tags:           string[]             // vertical tags from a fixed list of six; filter pills, related posts, solution page articles
  heroImage:      image (with alt)     // required, but only a Studio warning: without one the post shares the site's default image and has no image in its search data
  excerpt:        text                 // a Studio warning past 155 characters, not a block
  readTime:       number (minutes)
  body:           portable text        // Normal, Heading 2 and Heading 3 text, a quote, and image, callout, stat strip and inline CTA blocks; only two heading levels, so the title stays the post's only H1
  seoTitle:       string               // a Studio warning past 60 characters
  seoDescription: text                 // a Studio warning past 155 characters
  ogImage:        image
  canonicalUrl:   url                  // only when the post was first published elsewhere
}
```

The full blogPost schema, with the body block fields and the Studio descriptions, is in `10-BLOG.md` (Sanity Schema, blogPost).

**Live posts:** every read of blog content filters on slug and `publishedAt`: a post needs a slug and a publish date that has come, or it appears in no list, count, sitemap entry or lookup, whatever else is filled in. A post scheduled for later appears once its date comes, at the next hourly refresh of the page it would show on, except on `/blog` itself, which renders per request.

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

// Project queries return clientName only with showClientName on and clientConsentOn a readable date
// (YYYY-MM-DD, read in the condition and never returned), and projectValue only with showRandAmounts
// on, as conditional projections, so a switch that is off leaves the field out. Every project
// carries "showRandAmounts": showRandAmounts == true. Project
// images carry only { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }, and
// gallery photos their caption too. Read them through src/lib/projectData.ts, which drops rand
// amounts from results, System rows and calculation inputs while "Show rand amounts" is off; an
// ESLint rule stops any other file importing them. NEWEST_FIRST, below, is
// coalesce(dateTime(commissionedOn + "T00:00:00Z"), dateTime(_createdAt)) desc: the commissioning
// date, else the date added, both compared as datetimes (dateTime() of a bare date is null).

// All projects (/projects), newest first; getAllProjects() then puts featured projects first
export const ALL_PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)] | order(NEWEST_FIRST) { ... }`;

// Featured projects (home "Projects" carousel), no limit: numbered first, lowest first, then the rest newest first
export const FEATURED_PROJECTS_QUERY = `*[_type == "project" && featured == true && defined(slug.current)] | order(defined(featuredOrder) desc, featuredOrder asc, NEWEST_FIRST) { ... }`;

// Projects by vertical (the "Projects" section on each solution page), the newest six
export const PROJECTS_BY_VERTICAL_QUERY = `*[_type == "project" && vertical == $vertical && defined(slug.current)] | order(NEWEST_FIRST) [0..5] { ... }`;

// Single project, with up to three from the same vertical and, for when it has none,
// up to two from other verticals, both newest first (/projects/[slug])
export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0] { ..., _createdAt, _updatedAt, "related": *[...same vertical...] | order(NEWEST_FIRST) [0..2] { ... }, "otherProjects": *[...other verticals...] | order(NEWEST_FIRST) [0..1] { ... } }`;

// Project slugs (generateStaticParams), as strings
export const ALL_PROJECT_SLUGS_QUERY = `*[_type == "project" && defined(slug.current)].slug.current`;

// Sitemap entries
export const PROJECT_SITEMAP_QUERY = `*[_type == "project" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`;

// Every blog query below reads only live posts, through LIVE_POST:
// _type == "blogPost" && defined(slug.current) && PUBLISHED_AT <= dateTime(now())
// PUBLISHED_AT reads a publish date written as a full date-time, one without a
// zone (read as UTC), or a bare date (read as midnight UTC); any other form
// keeps the post off the site. A post without a slug, or dated in the future,
// is left out of every list, count, sitemap entry and lookup below, until its
// date comes.

// Every live post, dated by "Last updated" else the publish date (also the
// fallback when "Last updated" is set but can't be read as a date)
export const BLOG_SITEMAP_QUERY = `*[LIVE_POST]{ "slug": slug.current, "lastModified": coalesce(dateTime(updatedAt), PUBLISHED_AT) }`;

// Every author with a live post, dated by their latest one
export const AUTHOR_SITEMAP_QUERY = `*[_type == "author" && defined(slug.current) && count(*[LIVE_POST && references(^._id)]) > 0]{ "slug": slug.current, "lastModified": *[LIVE_POST && references(^._id)] | order(publishedAt desc) [0].publishedAt }`;

// Blog index: category, tag and search filters, featured first, six per page (/blog)
export const BLOG_INDEX_QUERY = `*[LIVE_POST && _id != $exclude && ($category == "" || category == $category) && ($tag == "" || $tag in tags) && ($q == "" || title match $q || excerpt match $q)] | order(featured desc, publishedAt desc) [$offset...$offset+6] { ... }`;

// Post count under the same filters (/blog pagination)
export const BLOG_COUNT_QUERY = `count(*[LIVE_POST && ...same filters as BLOG_INDEX_QUERY])`;

// Every live post, whatever the filters (home SearchAction; /blog noindex while it is 0)
export const PUBLISHED_POSTS_COUNT_QUERY = `count(*[LIVE_POST])`;

// Featured article card (/blog): shown only when the post it returns is marked featured
export const FEATURED_POST_QUERY = `*[LIVE_POST] | order(featured desc, publishedAt desc) [0] { ... }`;

// Each live post's category and tags, for the /blog pills and their counts
export const BLOG_FILTER_ROWS_QUERY = `*[LIVE_POST]{ category, tags }`;

// Latest 3 posts (home)
export const LATEST_POSTS_QUERY = `*[LIVE_POST] | order(publishedAt desc) [0..2] { ... }`;

// Up to three posts tagged with a vertical (RelatedArticles on solution pages)
export const POSTS_BY_VERTICAL_QUERY = `*[LIVE_POST && $tag in tags] | order(publishedAt desc) [0..2] { ... }`;

// Single post, with its author and up to three related posts sharing its category or a tag (/blog/[slug])
export const POST_BY_SLUG_QUERY = `*[LIVE_POST && slug.current == $slug][0] { ..., "author": author->{ ... }, "related": *[LIVE_POST && ... ] | order(publishedAt desc) [0..2] { ... } }`;

// Post slugs (generateStaticParams)
export const ALL_BLOG_SLUGS_QUERY = `*[LIVE_POST]{ "slug": slug.current }`;

// Author page (/blog/authors/[slug]): the author, their posts, and every author slug
export const AUTHOR_BY_SLUG_QUERY = `*[_type == "author" && slug.current == $slug][0] { ... }`;
export const POSTS_BY_AUTHOR_QUERY = `*[LIVE_POST && references(*[_type == "author" && slug.current == $slug]._id)] | order(publishedAt desc) { ... }`;
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

No blog or author query sits outside this file. The navbar's post count in `src/app/layout.tsx` reads `PUBLISHED_POSTS_COUNT_QUERY` (the blog link appears once a post is live; the rule is in `src/lib/blogNav.ts`), and `src/app/sitemap.ts` reads `BLOG_SITEMAP_QUERY` and `AUTHOR_SITEMAP_QUERY`.

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


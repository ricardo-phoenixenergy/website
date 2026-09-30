/* ─── Shared field fragments ──────────────────────────────────────────────── */

// The asset fields every image needs to draw and to blur up while it loads:
// never the whole asset document, whose file name can name a client or a
// partner ("WEG-logo.png", "Standard_Bank_Logo.svg").
const IMAGE_ASSET_FIELDS = `"asset": asset->{ _id, url, "metadata": metadata { lqip, dimensions } }`;

const IMAGE_FIELDS = `{ ${IMAGE_ASSET_FIELDS}, alt, hotspot, crop }`;

// Gallery photos also carry their caption, which the photo viewer shows.
const GALLERY_IMAGE_FIELDS = `{ ${IMAGE_ASSET_FIELDS}, alt, caption, hotspot, crop }`;

// The consent switches apply here, so nothing withheld leaves the CMS
// (docs/superpowers/specs/2026-09-29-project-page-design.md, "Consent and rand
// amounts"). The client's name comes only with "Show client name" on and the
// date of the client's written consent set, and the project value only with
// "Show rand amounts" on. A switch that is off leaves its field out entirely,
// with a conditional projection rather than a null, so not even the field's
// name reaches the page data. showRandAmounts itself comes with every project,
// because discloseProject() needs it to decide whether figures in rands may
// show. Read projects through src/lib/projectData.ts, which applies that rule.
// defined(clientConsentOn) alone would accept "" or free text such as "TBC"
// (a document written through the API or import, not the Studio, which
// requires a real date): dateTime() of an unreadable string is null, and
// defined(null) is false, so only a date that actually parses names the
// client, the same test NEWEST_FIRST already applies to commissionedOn.
const CLIENT_NAME_WITH_CONSENT = `showClientName == true && defined(dateTime(clientConsentOn + "T00:00:00Z")) => { clientName }`;
const PROJECT_VALUE_WITH_CONSENT = `showRandAmounts == true => { projectValue }`;

// "Newest" is the commissioning date, falling back to the date a project was
// added to the CMS. commissionedOn is a date ("2026-06-12") and _createdAt a
// datetime ("2026-01-10T08:00:00Z"): dateTime() of a bare date is null, and a
// string never compares with a datetime, so the date gets midnight UTC and both
// are compared as datetimes. A date that can't be read falls back to _createdAt.
// The free-text completion date is never sorted on: "Q3 2024" sorts above "Q2 2026".
const NEWEST_FIRST = `coalesce(dateTime(commissionedOn + "T00:00:00Z"), dateTime(_createdAt)) desc`;

const PROJECT_CARD_FIELDS = `
  _id,
  title,
  "slug": { "current": slug.current },
  vertical,
  location,
  ${CLIENT_NAME_WITH_CONSENT},
  "showRandAmounts": showRandAmounts == true,
  "heroImage": heroImage ${IMAGE_FIELDS},
  status,
  "metrics": metrics[]{ label, value },
  "results": results[]{ label, value, note },
  resultsBasis
`;

const BLOG_CARD_FIELDS = `
  _id,
  title,
  "slug": { "current": slug.current },
  category,
  tags,
  excerpt,
  readTime,
  publishedAt,
  featured,
  "heroImage": heroImage ${IMAGE_FIELDS},
  "author": author->{ name, "slug": { "current": slug.current }, "photo": photo ${IMAGE_FIELDS} }
`;

/* ─── Projects ────────────────────────────────────────────────────────────── */

export const ALL_PROJECTS_QUERY = `
  *[_type == "project" && defined(slug.current)] | order(${NEWEST_FIRST}) {
    ${PROJECT_CARD_FIELDS},
    featured,
    featuredOrder,
    summary
  }
`;

// The featured order, as /projects has it (src/lib/projectOrder.ts): numbered
// projects first, lowest number first, then those without a number, newest
// first. coalesce(featuredOrder, 99) would put an unnumbered project before one
// numbered 100 on home but after it on /projects.
export const FEATURED_PROJECTS_QUERY = `
  *[_type == "project" && featured == true && defined(slug.current)]
  | order(defined(featuredOrder) desc, featuredOrder asc, ${NEWEST_FIRST}) {
    ${PROJECT_CARD_FIELDS}
  }
`;

export const PROJECTS_BY_VERTICAL_QUERY = `
  *[_type == "project" && vertical == $vertical && defined(slug.current)] | order(${NEWEST_FIRST}) [0..5] {
    ${PROJECT_CARD_FIELDS}
  }
`;

export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    ${PROJECT_CARD_FIELDS},
    _createdAt,
    _updatedAt,
    headline,
    siteType,
    completionDate,
    commissionedOn,
    financing,
    ${PROJECT_VALUE_WITH_CONSENT},
    "gallery": gallery[] ${GALLERY_IMAGE_FIELDS},
    summary,
    challenge[] { ... },
    challengeHeadline,
    solution[] { ... },
    solutionHeadline,
    outcome[] { ... },
    outcomeHeadline,
    resultsAsOf,
    resultsAssumptions,
    "resultsInputs": resultsInputs[]{ label, value },
    "equipment": equipment[]{ component, brand, model, quantity },
    installationWeeks,
    approvals,
    seoDescription,
    "related": *[
      _type == "project" &&
      vertical == ^.vertical &&
      slug.current != $slug &&
      defined(slug.current)
    ] | order(${NEWEST_FIRST}) [0..2] {
      ${PROJECT_CARD_FIELDS}
    },
    "otherProjects": *[
      _type == "project" &&
      vertical != ^.vertical &&
      slug.current != $slug &&
      defined(slug.current)
    ] | order(${NEWEST_FIRST}) [0..1] {
      ${PROJECT_CARD_FIELDS}
    }
  }
`;

export const ALL_PROJECT_SLUGS_QUERY = `
  *[_type == "project" && defined(slug.current)].slug.current
`;

export const PROJECT_SITEMAP_QUERY = `
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
`;

/* ─── Blog ───────────────────────────────────────────────────────────────── */

// A post is live once it has a slug and its publish date has come. A post given
// a future date in the Studio stays off the site until then, and appears at the
// first hourly refresh after it. Every blog query reads posts through this
// filter. dateTime() compares the two as times, whatever their written form.
const LIVE_POST = `_type == "blogPost" && defined(slug.current) && dateTime(publishedAt) <= dateTime(now())`;

export const POSTS_BY_VERTICAL_QUERY = `
  *[${LIVE_POST} && $tag in tags] | order(publishedAt desc) [0..2] {
    ${BLOG_CARD_FIELDS}
  }
`;

export const BLOG_INDEX_QUERY = `
  *[${LIVE_POST}
    && ($category == "" || category == $category)
    && ($tag == "" || $tag in tags)
    && ($q == "" || title match $q || excerpt match $q)
  ] | order(featured desc, publishedAt desc) [$offset...$offset+6] {
    ${BLOG_CARD_FIELDS}
  }
`;

export const FEATURED_POST_QUERY = `
  *[${LIVE_POST}] | order(featured desc, publishedAt desc) [0] {
    ${BLOG_CARD_FIELDS}
  }
`;

export const LATEST_POSTS_QUERY = `
  *[${LIVE_POST}] | order(publishedAt desc) [0..2] {
    ${BLOG_CARD_FIELDS}
  }
`;

export const POST_BY_SLUG_QUERY = `
  *[${LIVE_POST} && slug.current == $slug][0] {
    _id,
    title,
    "slug": { "current": slug.current },
    category,
    tags,
    excerpt,
    readTime,
    publishedAt,
    updatedAt,
    "heroImage": heroImage ${IMAGE_FIELDS},
    body[] {
      ...,
      _type == "image" => { ..., ${IMAGE_ASSET_FIELDS} }
    },
    seoTitle,
    seoDescription,
    "ogImage": ogImage ${IMAGE_FIELDS},
    canonicalUrl,
    featured,
    "author": author->{ _id, name, "slug": { "current": slug.current }, role, bio, linkedin, "photo": photo ${IMAGE_FIELDS} },
    "related": *[
      ${LIVE_POST}
      && slug.current != $slug
      && (category == ^.category || count((tags)[@ in ^.tags]) > 0)
    ] | order(publishedAt desc) [0..2] {
      ${BLOG_CARD_FIELDS}
    }
  }
`;

export const ALL_BLOG_SLUGS_QUERY = `
  *[${LIVE_POST}]{ "slug": slug.current }
`;

/** Each live post's address and last change: its "Last updated" date, else its publish date. */
export const BLOG_SITEMAP_QUERY = `
  *[${LIVE_POST}]{ "slug": slug.current, "lastModified": coalesce(updatedAt, publishedAt) }
`;

/** Each author with a live post, dated by their latest one. */
export const AUTHOR_SITEMAP_QUERY = `
  *[_type == "author" && defined(slug.current) && count(*[${LIVE_POST} && references(^._id)]) > 0]{
    "slug": slug.current,
    "lastModified": *[${LIVE_POST} && references(^._id)] | order(publishedAt desc) [0].publishedAt
  }
`;

export const ALL_BLOG_TAGS_QUERY = `
  array::unique(*[${LIVE_POST}].tags[])
`;

/** Every live post, whatever the filters: while it is 0, the blog index stays out of search. */
export const PUBLISHED_POSTS_COUNT_QUERY = `count(*[${LIVE_POST}])`;

export const BLOG_COUNT_QUERY = `
  count(*[${LIVE_POST}
    && ($category == "" || category == $category)
    && ($tag == "" || $tag in tags)
    && ($q == "" || title match $q || excerpt match $q)
  ])
`;

export const AUTHOR_BY_SLUG_QUERY = `
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    "slug": { "current": slug.current },
    role,
    bio,
    linkedin,
    "photo": photo ${IMAGE_FIELDS}
  }
`;

export const POSTS_BY_AUTHOR_QUERY = `
  *[${LIVE_POST} && references(*[_type == "author" && slug.current == $slug]._id)]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": { "current": slug.current },
    category,
    tags,
    excerpt,
    readTime,
    publishedAt,
    featured,
    "heroImage": heroImage ${IMAGE_FIELDS},
    "author": author->{ name, "slug": { "current": slug.current }, "photo": photo ${IMAGE_FIELDS} }
  }
`;

export const ALL_AUTHOR_SLUGS_QUERY = `
  *[_type == "author"]{ "slug": slug.current }
`;

/* ─── Team ───────────────────────────────────────────────────────────────── */

export const TEAM_MEMBERS_QUERY = `
  *[_type == "teamMember" && active == true]
  | order(
    select(category == "founders" => 1, category == "business" => 2, 3) asc,
    order asc
  ) {
    _id,
    name,
    "slug": { "current": slug.current },
    "photo": photo ${IMAGE_FIELDS},
    role,
    category,
    archetype,
    bio,
    linkedin,
    order,
    active
  }
`;

/* ─── Timeline Milestones ─────────────────────────────────────────────────────── */

export const MILESTONE_TIMELINE_QUERY = `
  *[_type == "milestoneTimeline" && active == true]
  | order(order asc) {
    _id,
    date,
    title,
    isFuture,
    order,
    active
  }
`;

/* ─── Company Stats ─────────────────────────────────────────────────────────── */

export const COMPANY_STATS_QUERY = `
  *[_type == "companyStats"][0] {
    "stats": stats[]{ value, label, definition, basis, source, asOf }
  }
`;

/* ─── Partners & Investors ──────────────────────────────────────────────────── */

export const PARTNERS_QUERY = `
  *[_type == "partner" && active == true]
  | order(order asc) {
    _id,
    name,
    category,
    website,
    order,
    active,
    "logo": logo { ${IMAGE_ASSET_FIELDS}, alt }
  }
`;

/* ─── How It Works ──────────────────────────────────────────────────────────── */

export const HOW_IT_WORKS_QUERY = `
  *[_id == $id][0]{
    eyebrow,
    title,
    subtitle,
    steps[]{ label, description, tag },
    "showCTA": showCta
  }
`;

/* ─── Hero Images ───────────────────────────────────────────────────────────── */

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

/* ─── Energy & Fuel Prices ───────────────────────────────────────────────── */

export const ENERGY_PRICES_QUERY = `
  *[_id == "energyPrices"][0]{
    dieselPricePerL,
    petrol93PricePerL,
    gridPricePerKwh,
    solarPricePerKwh,
    effectiveDate,
    sourceLabel
  }
`;

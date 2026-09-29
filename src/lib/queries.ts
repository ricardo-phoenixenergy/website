/* ─── Shared field fragments ──────────────────────────────────────────────── */

// The asset fields every image needs to draw and to blur up while it loads:
// never the whole asset document, whose file name can name a client or a
// partner ("WEG-logo.png", "Standard_Bank_Logo.svg").
const IMAGE_ASSET_FIELDS = `"asset": asset->{ _id, url, "metadata": metadata { lqip, dimensions } }`;

const IMAGE_FIELDS = `{ ${IMAGE_ASSET_FIELDS}, alt, hotspot, crop }`;

// Every project query also leaves out the client's name and the project value.
// They may show only with the client's consent, which the CMS can't record yet
// (docs/superpowers/specs/2026-09-29-project-page-design.md). Read projects
// through src/lib/projectData.ts, which also drops rand amounts.
const PROJECT_CARD_FIELDS = `
  _id,
  title,
  "slug": { "current": slug.current },
  vertical,
  location,
  "heroImage": heroImage ${IMAGE_FIELDS},
  status,
  "metrics": metrics[]{ label, value },
  "results": results[]{ label, value },
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
// "Newest" is the date a project was added to the CMS until projects carry a
// commissioning date (step 2): the free-text completion date can't be sorted.

export const ALL_PROJECTS_QUERY = `
  *[_type == "project" && defined(slug.current)] | order(_createdAt desc) {
    ${PROJECT_CARD_FIELDS},
    featured,
    featuredOrder,
    summary
  }
`;

export const FEATURED_PROJECTS_QUERY = `
  *[_type == "project" && featured == true && defined(slug.current)]
  | order(coalesce(featuredOrder, 99) asc, _createdAt desc) {
    ${PROJECT_CARD_FIELDS}
  }
`;

export const PROJECTS_BY_VERTICAL_QUERY = `
  *[_type == "project" && vertical == $vertical && defined(slug.current)] | order(_createdAt desc) [0..5] {
    ${PROJECT_CARD_FIELDS}
  }
`;

export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    ${PROJECT_CARD_FIELDS},
    _createdAt,
    _updatedAt,
    completionDate,
    "gallery": gallery[] ${IMAGE_FIELDS},
    summary,
    challenge[] { ... },
    solution[] { ... },
    outcome[] { ... },
    resultsAsOf,
    resultsAssumptions,
    "related": *[
      _type == "project" &&
      vertical == ^.vertical &&
      slug.current != $slug &&
      defined(slug.current)
    ] | order(_createdAt desc) [0..2] {
      ${PROJECT_CARD_FIELDS}
    },
    "otherProjects": *[
      _type == "project" &&
      vertical != ^.vertical &&
      slug.current != $slug &&
      defined(slug.current)
    ] | order(_createdAt desc) [0..1] {
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

export const POSTS_BY_VERTICAL_QUERY = `
  *[_type == "blogPost" && $tag in tags] | order(publishedAt desc) [0..2] {
    ${BLOG_CARD_FIELDS}
  }
`;

export const BLOG_INDEX_QUERY = `
  *[_type == "blogPost"
    && ($category == "" || category == $category)
    && ($tag == "" || $tag in tags)
    && ($q == "" || title match $q || excerpt match $q)
  ] | order(featured desc, publishedAt desc) [$offset...$offset+6] {
    ${BLOG_CARD_FIELDS}
  }
`;

export const FEATURED_POST_QUERY = `
  *[_type == "blogPost"] | order(featured desc, publishedAt desc) [0] {
    ${BLOG_CARD_FIELDS}
  }
`;

export const LATEST_POSTS_QUERY = `
  *[_type == "blogPost"] | order(publishedAt desc) [0..2] {
    ${BLOG_CARD_FIELDS}
  }
`;

export const POST_BY_SLUG_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0] {
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
      _type == "blogPost"
      && slug.current != $slug
      && (category == ^.category || count((tags)[@ in ^.tags]) > 0)
    ] | order(publishedAt desc) [0..2] {
      ${BLOG_CARD_FIELDS}
    }
  }
`;

export const ALL_BLOG_SLUGS_QUERY = `
  *[_type == "blogPost"]{ "slug": slug.current }
`;

export const ALL_BLOG_TAGS_QUERY = `
  array::unique(*[_type == "blogPost"].tags[])
`;

/** Every published post, whatever the filters: while it is 0, the blog index stays out of search. */
export const PUBLISHED_POSTS_COUNT_QUERY = `count(*[_type == "blogPost"])`;

export const BLOG_COUNT_QUERY = `
  count(*[_type == "blogPost"
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
  *[_type == "blogPost" && references(*[_type == "author" && slug.current == $slug]._id)]
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

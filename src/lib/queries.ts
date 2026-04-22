/* ─── Shared field fragments ──────────────────────────────────────────────── */

const IMAGE_FIELDS = `{ asset->, alt, hotspot, crop }`;

const PROJECT_CARD_FIELDS = `
  _id,
  title,
  "slug": { "current": slug.current },
  vertical,
  location,
  systemSize,
  "heroImage": heroImage ${IMAGE_FIELDS}
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
  *[_type == "project"] | order(completionDate desc) {
    ${PROJECT_CARD_FIELDS},
    featured,
    clientName,
    completionDate,
    projectValue,
    status,
    metrics,
    summary
  }
`;

export const FEATURED_PROJECTS_QUERY = `
  *[_type == "project" && featured == true] | order(completionDate desc) [0..5] {
    ${PROJECT_CARD_FIELDS},
    clientName,
    completionDate,
    projectValue,
    status,
    metrics
  }
`;

export const PROJECTS_BY_VERTICAL_QUERY = `
  *[_type == "project" && vertical == $vertical] | order(completionDate desc) [0..5] {
    ${PROJECT_CARD_FIELDS},
    clientName,
    completionDate,
    projectValue,
    status,
    metrics
  }
`;

export const PROJECT_BY_SLUG_QUERY = `
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
    "heroImage": heroImage ${IMAGE_FIELDS},
    "gallery": gallery[] ${IMAGE_FIELDS},
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
      ${PROJECT_CARD_FIELDS}
    }
  }
`;

export const ALL_PROJECT_SLUGS_QUERY = `
  *[_type == "project"]{ "slug": slug.current }
`;

/* ─── Blog ───────────────────────────────────────────────────────────────── */

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
      _type == "image" => { ..., asset-> }
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
    "photo": photo { asset->, alt, hotspot, crop }
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
    "heroImage": heroImage { asset->, alt, hotspot, crop },
    "author": author->{ name, "slug": { "current": slug.current }, "photo": photo { asset->, alt, hotspot, crop } }
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

# 12 — CMS Schemas (Sanity)
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0

---

## Project Schema

```typescript
// sanity/schemaTypes/project.ts
{
  title:           string
  slug:            slug (unique)
  vertical:        string (enum: SolutionVertical)
  featured:        boolean  // appears on homepage
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
  relatedProjects: reference[] → project
}
```

---

## Blog Post Schema

```typescript
// sanity/schemaTypes/blogPost.ts
{
  title:          string
  slug:           slug (unique)
  author:         string
  publishedAt:    datetime
  category:       'company-news' | 'industry-insights' | 'project-spotlights' | 'press-releases'
  heroImage:      image (with alt)
  excerpt:        text (max 160 chars)
  readTime:       number (minutes)
  body:           portable text (with image blocks)
  seoTitle:       string
  seoDescription: string
  ogImage:        image
}
```

---

## Team Member Schema

> **Authoritative.** This is the canonical schema. `08-ABOUT.md` is the authoritative UI spec. The team grid on the About page is fully CMS-driven — no team member data is hardcoded anywhere.

```typescript
// sanity/schemaTypes/teamMember.ts
{
  // ── Identity ──────────────────────────────────────────────
  name:           string                          // Full name. Required.
  slug:           slug (unique, from name)        // Reserved for future profile pages
  photo:          image (with alt, hotspot: true) // Portrait. Required. hotspot enables smart cropping.
  
  // ── Role & category ───────────────────────────────────────
  role:           string                          // Job title e.g. "Co-Founder & CEO". Required.
  category:       'founders' | 'business' | 'technical'  // Drives filter tabs. Required.
  archetype:      string                          // One-line descriptor e.g. "The Strategist". Optional.
                                                  // Shown below role on the card in Dusty Blue.
  
  // ── Bio ───────────────────────────────────────────────────
  bio:            text                            // 2–4 sentences. Shown in expanded card or future profile page.
                                                  // Not shown on the grid card itself — used for SEO + future use.

  // ── Contact & social ──────────────────────────────────────
  linkedin:       url                             // Optional. Renders LinkedIn icon on card.
  email:          string                          // Optional. Internal use only — never rendered on frontend.

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
| Photo | ✅ | Minimum 400×400px, square crop preferred. Studio will auto-crop if hotspot is set. |
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

## GROQ Query Library

```typescript
// src/lib/queries.ts

// All projects
export const ALL_PROJECTS_QUERY = `*[_type == "project"] | order(completionDate desc) { ... }`;

// Projects by vertical
export const PROJECTS_BY_VERTICAL = `*[_type == "project" && vertical == $vertical] { ... }`;

// Featured projects (homepage)
export const FEATURED_PROJECTS = `*[_type == "project" && featured == true][0..2] { ... }`;

// Single project
export const PROJECT_BY_SLUG = `*[_type == "project" && slug.current == $slug][0] { ..., "related": *[_type == "project" && vertical == ^.vertical && slug.current != $slug][0..2] }`;

// Blog posts
export const ALL_POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) { ... }`;

// Latest 3 posts (homepage)
export const LATEST_POSTS = `*[_type == "blogPost"] | order(publishedAt desc)[0..2] { ... }`;
```

---

*Spoke of [`/CLAUDE.md`](/CLAUDE.md)*

---

## ⚠️ Deprecation Notice (Engineering Review April 2026)

This file is **superseded** by the detailed schemas in `10-BLOG.md` (blogPost + author) and `05-PROJECTS.md` + `06-PROJECT-SINGLE.md` (project). Use those as authoritative references for Sanity schema implementation. This file is retained for historical context only.

**Key corrections vs this file:**
- `blogPost.author` → `reference → author document` (not a plain string)
- `blogPost.tags` → `array of string` (required for filter pills)
- `blogPost.featured` → `boolean` (required for featured article card)
- `blogPost.updatedAt` → `datetime` (required for JSON-LD dateModified)
- Full author schema: name, slug, role, photo, bio, linkedin


---

## GROQ Queries — Team Members

```typescript
// src/lib/queries.ts

// All active team members — primary sort by category order, secondary by order field
export const TEAM_MEMBERS_QUERY = `
  *[_type == "teamMember" && active == true]
  | order(
    category == "founders" desc,
    category == "business" desc,
    order asc
  ) {
    _id,
    name,
    slug,
    "photo": photo { asset, alt, hotspot },
    role,
    category,
    archetype,
    bio,
    linkedin,
    order,
    active
  }
`;

// Available filter categories — derived from data, not hardcoded
// Component derives this from the returned members array:
// const categories = ['all', ...new Set(members.map(m => m.category))]
// If no 'technical' members exist, that tab simply doesn't appear.
```


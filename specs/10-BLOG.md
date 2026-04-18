# 10 — Blog & Articles
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Routes: `/blog` (index) · `/blog/[slug]` (single post) · `/blog/authors/[slug]` (author profile)
> **Approved April 2026**

---

## Section Order — Blog Index (`/blog`)

```
1. Navbar            — light glass pill, "Blog" active
2. Breadcrumb        — Home / Blog & Insights
3. Page header       — eyebrow + H1 + subtitle + search bar
4. Filter pills      — category + vertical tag pills
5. Featured article  — 2-col card, first pinned post
6. Article grid      — 3-col, 6 cards default
7. Load more         — +6 per click, Sanity pagination
8. Footer
```

## Section Order — Single Post (`/blog/[slug]`)

```
1. Navbar            — light glass pill, "Blog" active
2. Post hero         — full-bleed photo + gradient + tags + title + meta
3. Breadcrumb + share bar
4. Two-column layout — Article body (left) + Sidebar (right)
5. Footer
```

---

## Blog Index

### Navbar & Breadcrumb
- Active link: "Blog"
- Breadcrumb: `Home / Blog & Insights`

---

### Page Header

- `padding: 36px 24px 0`, `max-width: 960px`, `margin: 0 auto`

```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 32px;
align-items: end;
margin-bottom: 28px;
```

**Left:**
- Eyebrow: `INSIGHTS & NEWS`
- H1: `Energy intelligence, delivered` — "delivered" in Dusty Blue `#709DA9`
- Subtitle: Inter 400, 13px, muted — *"Expert perspectives on clean energy, SA market trends, project spotlights and company news."*

**Right — search bar:**
- `border-radius: 9999px`, `border: 1px solid #E5E7EB`, `background: #fff`
- `padding: 10px 16px 10px 38px` (space for 🔍 icon left)
- `placeholder: "Search articles..."`
- On input: filter article grid client-side by title + excerpt match
- Inter 400, 12px

**Mobile:** search bar stacks below heading, full-width

---

### Filter Pills

- `display: flex`, `gap: 8px`, `flex-wrap: wrap`
- `padding: 0 24px 20px`, `max-width: 960px`, `margin: 0 auto`

**Default state:** white bg, `border: 1px solid #E5E7EB`, muted text, Inter 500, 11px, pill shape
**Active state:** Deep Teal bg + border, white text, `font-weight: 600`
**Hover:** `border-color: #aaa`, text → `#1A1A1A`

**Pills (two tiers):**

Category pills:
```
All articles  |  Industry Insights  |  Project Spotlights  |  Company News  |  Press Releases
```

Vertical tag pills (pulled dynamically from Sanity `tags[]`):
```
Solar & Storage  |  Wheeling  |  Carbon Credits  |  Energy Optimisation  |  EV Fleets  |  WeBuySolar
```

**Filter logic:**
- `All articles` → show all posts
- Category pill → filter by `category` field
- Vertical tag pill → filter by `tags[]` array contains
- Both can be active simultaneously (AND logic)
- URL updates: `/blog?category=insights&tag=wheeling` — shareable + crawlable by Google

---

### Featured Article Card

- `margin: 0 24px 20px`, `max-width: 960px`, `margin-left: auto`, `margin-right: auto`

```css
display: grid;
grid-template-columns: 1fr 1fr;
border-radius: 16px;
overflow: hidden;
background: #fff;
border: 1px solid #E5E7EB;
cursor: pointer;
```

Hover: `translateY(-3px)`, `box-shadow: 0 12px 32px rgba(57,87,92,0.1)`

**Left — photo:**
- `next/image` fill, `object-fit: cover`, `min-height: 220px`
- `FEATURED` badge: absolute top-left, Deep Teal fill, white text, Inter 700, 9px, pill

**Right — body** (`padding: 24px`):
- Tag row: category pill + vertical tag pill
- Title: Plus Jakarta Sans 800, 18px, `line-height: 1.3`
- Excerpt: Inter 400, 12px, muted, `line-height: 1.75`, `-webkit-line-clamp: 3`
- Meta row: author avatar (24px circle, initials) + author name + `·` + date + `·` + read time

**Sanity source:** post with `featured: true` field, or most recent post as fallback

**Mobile:** stacks to photo top, body below

---

### Article Grid

```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 14px;
padding: 0 24px;
max-width: 960px;
margin: 0 auto;
```

**Each card:**
- `background: #fff`, `border-radius: 14px`, `overflow: hidden`, `border: 1px solid #E5E7EB`
- Hover: `translateY(-3px)`, `border-color: #cccccc`

**Card anatomy:**
- Photo: `height: 130px`, `next/image` fill, `object-fit: cover`
- Body: `padding: 14px`
- Tags row: category + vertical tags, `gap: 5px`, `margin-bottom: 8px`
- Title: Plus Jakarta Sans 700, 13px, `line-height: 1.4`
- Excerpt: Inter 400, 11px, muted, `line-height: 1.65`, `-webkit-line-clamp: 2`
- Footer: date (left) + read time in Dusty Blue (right), `border-top: 1px solid #E5E7EB`, `padding-top: 10px`

**Tag pill anatomy:**
```css
font-size: 9px;
font-weight: 600;
padding: 2px 8px;
border-radius: 9999px;
```
Each category has its own accent colour bg (10% opacity) + text:
| Category | Bg | Text |
|---|---|---|
| Industry Insights | `rgba(57,87,92,0.1)` | `#39575C` |
| Project Spotlight | `rgba(227,197,141,0.1)` | `#6b4e10` |
| Company News | `rgba(169,214,203,0.1)` | `#1a5a48` |
| Press Release | `rgba(217,124,118,0.1)` | `#7a2a20` |

Vertical tags use matching vertical accent at 10% opacity.

**Default load:** 6 cards (excluding featured). +6 per "Load more" click.

**Mobile:** 1-column stack

---

### Load More

```css
display: flex;
justify-content: center;
padding: 24px 0 40px;
```
Button: Inter 500, 13px, muted, white bg, `border: 1px solid #E5E7EB`, pill, `padding: 10px 28px`
On click: fetch next 6 posts from Sanity, append to grid (no full page reload)

---

## Single Post

### Post Hero

- `position: relative`, `height: 280px`, `overflow: hidden`
- `next/image` fill, `object-fit: cover`, `placeholder="blur"`
- Overlay: `linear-gradient(180deg, rgba(13,31,34,0.2) 0%, rgba(13,31,34,0.85) 100%)`

**Bottom-anchored content** (`padding: 24px`, `max-width: 760px`, `margin: 0 auto`):
- Tag row: category + vertical tags (white bg at 35–40% opacity, white text)
- Title: Plus Jakarta Sans 800, 22px, white, `line-height: 1.25`, `margin-bottom: 12px`
- Meta row: author avatar (26px, `border: 2px solid rgba(255,255,255,0.3)`) + name + `·` + date + `·` + read time
  - All: Inter 400, 10px, `rgba(255,255,255,0.55)`

---

### Breadcrumb + Share Bar

```css
display: flex;
align-items: center;
justify-content: space-between;
padding: 12px 24px;
max-width: 960px;
margin: 0 auto;
border-bottom: 1px solid #E5E7EB;
```

**Left:** `Home / Blog / [post title truncated ~35 chars]` — standard breadcrumb style

**Right — share buttons:**
- Label: `Share:` — Inter 400, 10px, muted
- Three icon circles: LinkedIn (`in`), X (`𝕏`), Copy link (`🔗`)
- Each: 28px circle, `border: 1px solid #E5E7EB`, `background: #fff`
- Hover: Deep Teal bg + white icon

**Share behaviour:**
- LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url={canonicalUrl}`
- X: `https://x.com/intent/tweet?url={canonicalUrl}&text={seoTitle}`
- Copy link: `navigator.clipboard.writeText(canonicalUrl)` + tooltip "Copied!"

---

### Two-Column Post Layout

```css
display: grid;
grid-template-columns: 1fr 280px;
gap: 32px;
max-width: 960px;
margin: 0 auto;
padding: 32px 24px 48px;
```

**Mobile:** single column — sidebar sections reorder to: ToC → Article body → Author → Related

---

## Article Body (left column)

`max-width: 680px` — constrains prose width for readability

### Intro paragraph
- Inter 500, 14px, `#1A1A1A`, `line-height: 1.8`
- `margin-bottom: 20px`, `padding-bottom: 20px`, `border-bottom: 1px solid #E5E7EB`

### Standard prose
- H2: Plus Jakarta Sans 800, 17px, `#1A1A1A`, `margin: 24px 0 10px`
- H3: Plus Jakarta Sans 700, 14px, `#1A1A1A`, `margin: 18px 0 8px`
- Body paragraph: Inter 400, 12px, `#6B7280`, `line-height: 1.85`, `margin-bottom: 14px`

---

### Rich Content Blocks

All blocks are custom Portable Text components in `src/lib/portableTextComponents.tsx`.

#### 1. Callout block (3 variants)

```
type: 'info'    → Dusty Blue tint bg + border
type: 'warning' → Amber tint bg + border
type: 'stat'    → Dark (#0d1f22) bg
```

Layout: `display: flex`, `gap: 12px`, `padding: 16px 18px`, `border-radius: 12px`, `margin: 20px 0`
- Icon: 18px emoji, `flex-shrink: 0`
- Title: Plus Jakarta Sans 700, 12px — dark for light variants, white for stat variant
- Text: Inter 400, 11px, `line-height: 1.7` — muted for light, `rgba(255,255,255,0.6)` for stat

**Sanity fields:** `type` (enum), `icon` (string, optional), `title` (string), `text` (text)

#### 2. Stat strip

```css
display: grid;
grid-template-columns: repeat(3, 1fr);
background: #39575C;
border-radius: 12px;
overflow: hidden;
margin: 20px 0;
```

Each stat: `padding: 14px`, `text-align: center`, `border-right: 1px solid rgba(255,255,255,0.1)`
- Value: Plus Jakarta Sans 800, 18px, white
- Label: Inter 400, 9px, `rgba(255,255,255,0.5)`, uppercase

**Sanity fields:** `stats[]` — array of `{ value: string, label: string }` (max 4)

#### 3. Inline image with caption

- `next/image`, `border-radius: 12px`, `width: 100%`, `margin: 20px 0`
- Caption: Inter 400, 10px, muted, `text-align: center`, italic, `margin-top: -12px`

**Sanity fields:** `image` (Sanity image asset), `alt` (string, required), `caption` (string, optional)

#### 4. Blockquote

```css
border-left: 3px solid #709DA9;
padding: 12px 16px;
background: rgba(112,157,169,0.06);
border-radius: 0 8px 8px 0;
margin: 20px 0;
```
- Quote text: Plus Jakarta Sans 700, 13px, `#1A1A1A`, italic, `line-height: 1.5`
- Source: Inter 400, 10px, muted, `margin-top: 6px`

**Sanity fields:** `quote` (text), `source` (string, optional)

#### 5. Inline CTA banner

```css
background: #39575C;
border-radius: 14px;
padding: 20px;
text-align: center;
margin: 24px 0;
```
- Title: Plus Jakarta Sans 800, 15px, white
- Subtitle: Inter 400, 11px, `rgba(255,255,255,0.65)`
- Button: white bg, Deep Teal text, pill, `border: none`, `padding: 9px 20px`

**Sanity fields:** `title`, `subtitle`, `btnText`, `btnHref` (internal route or external URL)

---

### Tags Footer

```css
display: flex;
gap: 6px;
flex-wrap: wrap;
padding-top: 20px;
border-top: 1px solid #E5E7EB;
margin-top: 28px;
```
- "Tags:" label: Inter 600, 11px, `#1A1A1A`
- Each tag: Deep Teal bg at 10%, Deep Teal text, `padding: 4px 10px`, pill
- Each tag links to `/blog?tag={tag}` — drives internal linking

---

## Sidebar (right column, sticky)

```css
position: sticky;
top: 24px;
display: flex;
flex-direction: column;
gap: 16px;
```

All sidebar cards:
- `background: #fff`, `border-radius: 14px`, `border: 1px solid #E5E7EB`, `padding: 18px`

### 1. Table of Contents

- Title: `In this article` — Plus Jakarta Sans 700, 13px
- Auto-generated from H2 and H3 headings in article body
- Each item: number (Inter 700, 10px, Dusty Blue) + heading text (Inter 400, 11px)
- `border-bottom: 1px solid #E5E7EB` between items
- Click → smooth scroll to heading anchor
- Active heading: text → Deep Teal (tracked via IntersectionObserver)

### 2. Author Card

- Author avatar: 44px circle, Deep Teal bg, white initials
- Name: Plus Jakarta Sans 700, 13px
- Role: Inter 500, 10px, Dusty Blue (e.g. *"The Strategist · Co-Founder"*)
- Bio: Inter 400, 11px, muted, `line-height: 1.65` (from Sanity `author.bio`)
- Links to `/blog/authors/[slug]`

### 3. Related Posts (3 articles)

Pulled via GROQ: posts sharing at least one tag OR same category, ordered by `publishedAt desc`, excluding current post.

Each item:
- Thumbnail: `52×44px`, `border-radius: 8px`, `next/image`
- Title: Plus Jakarta Sans 700, 11px, `line-height: 1.35`
- Meta: Inter 400, 9px, muted — date + read time
- `border-bottom: 1px solid #E5E7EB`. Last: none
- Full card links to `/blog/[slug]`

---

## SEO Implementation

### generateMetadata (per post)

```typescript
// src/app/blog/[slug]/page.tsx
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.seoTitle || `${post.title} | Phoenix Energy`,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: post.canonicalUrl || `https://phoenixenergy.solutions/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      url: `https://phoenixenergy.solutions/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [{
        url: urlFor(post.ogImage || post.heroImage).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: post.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: [urlFor(post.ogImage || post.heroImage).width(1200).height(630).url()],
    },
  };
}
```

### JSON-LD Article Schema (per post)

```typescript
// Injected via <script type="application/ld+json"> in page.tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.seoTitle || post.title,
  description: post.seoDescription || post.excerpt,
  image: urlFor(post.heroImage).width(1200).height(630).url(),
  datePublished: post.publishedAt,
  dateModified: post.updatedAt || post.publishedAt,
  author: {
    '@type': 'Person',
    name: post.author.name,
    url: `https://phoenixenergy.solutions/blog/authors/${post.author.slug}`,
    jobTitle: post.author.role,
    worksFor: {
      '@type': 'Organization',
      name: 'Phoenix Energy',
    },
  },
  publisher: {
    '@type': 'Organization',
    name: 'Phoenix Energy',
    url: 'https://phoenixenergy.solutions',
    logo: {
      '@type': 'ImageObject',
      url: 'https://phoenixenergy.solutions/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://phoenixenergy.solutions/blog/${post.slug}`,
  },
};
```

### BreadcrumbList schema (blog index + single post)

```typescript
// Injected on both /blog and /blog/[slug]
{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://phoenixenergy.solutions' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://phoenixenergy.solutions/blog' },
    // Single post only:
    { '@type': 'ListItem', position: 3, name: post.title, item: `https://phoenixenergy.solutions/blog/${post.slug}` },
  ]
}
```

### ISR + Sanity webhook

```typescript
// Rebuild strategy
export const revalidate = 3600; // Background ISR every hour

// On-demand revalidation via Sanity webhook
// Webhook URL: https://phoenixenergy.solutions/api/revalidate
// Trigger: on publish/update of blogPost document
// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
export async function POST(req: Request) {
  const { slug } = await req.json();
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/blog');
  return Response.json({ revalidated: true });
}
```

### generateStaticParams (pre-render all posts at build time)

```typescript
export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs(); // GROQ: *[_type == "blogPost"]{ "slug": slug.current }
  return slugs.map(({ slug }) => ({ slug }));
}
```

---

## Sanity Schema

### blogPost

```typescript
{
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title',          type: 'string',   title: 'Display title' },
    { name: 'slug',           type: 'slug',     options: { source: 'title' } },
    { name: 'author',         type: 'reference', to: [{ type: 'author' }] },
    { name: 'publishedAt',    type: 'datetime' },
    { name: 'updatedAt',      type: 'datetime' },
    { name: 'featured',       type: 'boolean',  description: 'Pin to top of blog index' },
    { name: 'category',       type: 'string',
      options: { list: [
        'Industry Insights', 'Project Spotlight', 'Company News', 'Press Release'
      ]}},
    { name: 'tags',           type: 'array', of: [{ type: 'string' }],
      description: 'Vertical tags e.g. Solar, Wheeling, Carbon Credits' },
    { name: 'heroImage',      type: 'image', options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text', isHighlighted: true }] },
    { name: 'excerpt',        type: 'text', rows: 3,
      description: 'Used in cards and as meta description fallback (155 chars max)' },
    { name: 'readTime',       type: 'number', description: 'Minutes — set manually' },
    { name: 'body',           type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true },
          fields: [
            { name: 'alt',     type: 'string' },
            { name: 'caption', type: 'string' },
          ]},
        { name: 'callout', type: 'object',
          fields: [
            { name: 'type',  type: 'string', options: { list: ['info','warning','stat'] }},
            { name: 'icon',  type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'text',  type: 'text' },
          ]},
        { name: 'statStrip', type: 'object',
          fields: [{ name: 'stats', type: 'array',
            of: [{ type: 'object', fields: [
              { name: 'value', type: 'string' },
              { name: 'label', type: 'string' },
            ]}]}]},
        { name: 'inlineCta', type: 'object',
          fields: [
            { name: 'title',    type: 'string' },
            { name: 'subtitle', type: 'string' },
            { name: 'btnText',  type: 'string' },
            { name: 'btnHref',  type: 'string' },
          ]},
      ]},
    // SEO fields
    { name: 'seoTitle',       type: 'string',
      description: 'Google headline — 60 chars max. Leave blank to use display title.' },
    { name: 'seoDescription', type: 'text', rows: 2,
      description: 'Meta description — 155 chars max. Leave blank to use excerpt.' },
    { name: 'ogImage',        type: 'image',
      description: 'Social share image — 1200×630px. Leave blank to use hero image.' },
    { name: 'canonicalUrl',   type: 'url',
      description: 'Optional. Only set if this content was originally published elsewhere.' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'heroImage' },
  },
}
```

### author

```typescript
{
  name: 'author',
  type: 'document',
  fields: [
    { name: 'name',      type: 'string' },
    { name: 'slug',      type: 'slug', options: { source: 'name' } },
    { name: 'role',      type: 'string', description: 'e.g. The Strategist · Co-Founder' },
    { name: 'photo',     type: 'image', options: { hotspot: true } },
    { name: 'bio',       type: 'text', rows: 3 },
    { name: 'linkedin',  type: 'url' },
  ],
}
```

---

## GROQ Queries

```groq
// Blog index — paginated, filterable
*[_type == "blogPost"
  && ($category == "" || category == $category)
  && ($tag == "" || $tag in tags)
] | order(featured desc, publishedAt desc) [$offset...$offset+6] {
  title, slug, category, tags, excerpt, readTime, publishedAt,
  heroImage { asset->, alt },
  featured,
  "author": author->{ name, slug, photo { asset-> } }
}

// Single post — full content
*[_type == "blogPost" && slug.current == $slug][0] {
  title, slug, category, tags, excerpt, readTime,
  publishedAt, updatedAt,
  heroImage { asset->, alt },
  body[] {
    ...,
    _type == "image" => { ..., asset-> }
  },
  seoTitle, seoDescription, ogImage { asset-> }, canonicalUrl,
  "author": author->{ name, slug, role, bio, linkedin, photo { asset-> } },
  "related": *[
    _type == "blogPost"
    && slug.current != $slug
    && (category == ^.category || count((tags)[@ in ^.tags]) > 0)
  ] | order(publishedAt desc) [0..2] {
    title, slug, excerpt, readTime, publishedAt,
    heroImage { asset->, alt },
    "author": author->{ name }
  }
}

// All unique tags (for filter pills)
array::unique(*[_type == "blogPost"].tags[])

// All slugs (for generateStaticParams)
*[_type == "blogPost"]{ "slug": slug.current }
```

---

## Domain Authority Content Strategy

### SA keyword targets per article category

| Category | Target keywords |
|---|---|
| Industry Insights | energy wheeling South Africa, NERSA PPA 2025, Section 12B tax incentive, NRS097 compliance, loadshedding solutions business |
| Project Spotlights | commercial solar installation Gauteng, C&I solar case study South Africa, BESS project South Africa |
| EV content | electric fleet South Africa, EV charging depot Gauteng, fleet electrification ROI |
| Carbon | carbon credits South Africa business, Gold Standard carbon offset SA, carbon tax offset |

### E-E-A-T signals built into template
- Named authors with photos, roles, and LinkedIn links on every post
- Author profile pages at `/blog/authors/[slug]` with post archive
- `datePublished` and `dateModified` visible on page and in JSON-LD
- JSON-LD `Article` schema with `publisher` organisation markup
- Internal links from every post to relevant solution pages

### Internal linking rules for editors
- Every post must link to at least one solution page relevant to its tags
- Project spotlight posts must link to the full project case study
- Use tag footer links — these pass equity to `/blog?tag={tag}` archive pages
- Related posts sidebar drives further depth signals

---

## Responsive Breakpoints Summary

| Element | Desktop (≥ 768px) | Mobile (< 768px) |
|---|---|---|
| Page header | 2-col (heading + search) | Stacked |
| Filter pills | Horizontal wrap | Horizontal scroll |
| Featured card | 2-col (photo + body) | Stacked |
| Article grid | 3 columns | 1 column |
| Post hero | 280px, bottom-anchored | 220px |
| Post layout | 2-col (body + sidebar) | 1-col, sidebar reordered |
| Share bar | Inline right of breadcrumb | Below breadcrumb |

---

## Component Map

| Component | Path |
|---|---|
| Blog index page | `src/app/blog/page.tsx` |
| Single post page | `src/app/blog/[slug]/page.tsx` |
| Author profile page | `src/app/blog/authors/[slug]/page.tsx` |
| Article card | `src/components/ui/ArticleCard.tsx` |
| Featured article card | `src/components/ui/FeaturedArticleCard.tsx` |
| Filter pills | `src/components/ui/FilterPills.tsx` |
| Portable Text renderer | `src/lib/portableTextComponents.tsx` |
| Callout block | `src/components/blog/Callout.tsx` |
| Stat strip block | `src/components/blog/StatStrip.tsx` |
| Inline CTA block | `src/components/blog/InlineCta.tsx` |
| Table of contents | `src/components/blog/TableOfContents.tsx` |
| Share buttons | `src/components/blog/ShareButtons.tsx` |
| Author card | `src/components/blog/AuthorCard.tsx` |
| Related posts | `src/components/blog/RelatedPosts.tsx` |
| Revalidation API | `src/app/api/revalidate/route.ts` |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.1 | Approved April 2026*

---

## Engineering Review Fixes (April 2026)

### Animations
Apply `AnimatedSection` wrapper (see `01-BRAND.md`) to:
- Page header (eyebrow + H1 + subtitle + search bar) — `delay: 0`
- Filter pills row — `delay: 0.05`
- Featured article card — `delay: 0.1`
- Article grid — staggered, `0.04s` per card via Framer Motion `staggerChildren`

Blog article card hover: `translateY(-3px)` + `border-color: #cccccc` over `0.2s ease`.

### Blog ToC — active state
Tracked via `IntersectionObserver` with `rootMargin: '-80px 0px -70% 0px'` (accounts for fixed nav).

Active ToC item:
```css
color: #39575C;
border-left: 3px solid #39575C;
padding-left: 10px;   /* shift to accommodate the border */
transition: color 0.2s ease, border-color 0.2s ease;
```
Inactive items: no left border, `color: var(--txt)`.

### Blog pagination — SSR paginated (approved fix for 5.6)
Route strategy: `/blog?page=2` via Next.js `searchParams`.

```typescript
// src/app/blog/page.tsx
export default async function BlogPage({ searchParams }: { searchParams: { page?: string; category?: string; tag?: string } }) {
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * 6;
  // Fetch posts with offset
}

// Metadata for paginated pages:
export async function generateMetadata({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  return {
    alternates: {
      ...(page > 1 && { prev: `https://phoenixenergy.solutions/blog${page > 2 ? `?page=${page-1}` : ''}` }),
      next: `https://phoenixenergy.solutions/blog?page=${page+1}`,
    },
  };
}
```
UI: replace "Load more" button with page number pills at bottom of grid. Keep "Load more" pattern on mobile only (simpler UX on touch).


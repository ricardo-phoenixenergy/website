# 10 — Blog & Articles
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Routes: `/blog` (index) · `/blog/[slug]` (single post) · `/blog/authors/[slug]` (author profile)
> **Approved April 2026**
> **Updated 2026-09-24:** corrected to match the build. Type sizes follow the scale in `specs/01-BRAND.md`: nothing renders below 12px, so where a line below gives 9 to 11px, the build uses 12px or more.

---

## Section Order — Blog Index (`/blog`)

```
1. Navbar: solid white pill; "News & Insights" highlighted once the link shows (3 or more posts)
2. Breadcrumb: Home / News & Insights
3. Page header: eyebrow + H1 + subtitle, one column
4. Search bar: above the pills; ?q= filters on the server
5. Filter pills: one scrolling row, one active pill at a time
6. Featured article: 2-col card, the most recent pinned post (or the latest post)
7. Article grid: 1, 2 or 3 columns, 6 cards a page
8. Pagination: Prev, page numbers, Next (no Load more)
9. CTA band: PageFooter with ctaVariant="centered"
10. Footer
```

## Section Order — Single Post (`/blog/[slug]`)

```
1. Navbar: solid white pill; "News & Insights" highlighted once the link shows
2. Post hero: 360px full-bleed photo + gradient + tags + title + meta
3. Breadcrumb + share bar
4. Two-column layout: article body (left) + sidebar (right), from 1024px
5. CTA band: PageFooter with ctaVariant="centered"
6. Footer
```

---

## Blog Index

### Navbar & Breadcrumb
- The section is named "News & Insights" everywhere: the navbar link, the breadcrumbs, the eyebrow, the page title and the BreadcrumbList JSON-LD.
- Active link: "News & Insights". The root layout adds it to the navbar only once 3 or more posts with a slug exist (`BLOG_NAV_MIN_POSTS` in `src/app/layout.tsx`; see `specs/03-NAVIGATION.md`).
- Breadcrumb: `Home / News & Insights`.

---

### Page Header

- Inside `page-container` (up to 1280px wide), with `padding-top: 96px`.
- One column at every width: breadcrumb, then the title block (`margin-bottom: 24px`), then the search bar, then the filter pills. There is no two-column header.

**Title block:**
- Eyebrow: `NEWS & INSIGHTS`
- H1: `Energy intelligence, delivered`, 36px, with "delivered" in Dusty Blue ink `#45727E` (`text-pe-secondary-ink`).
- Subtitle: Inter 400, 16px, muted, `max-width: 512px`: *"Expert perspectives on clean energy, SA market trends, project spotlights and company news."*

**Search bar** (`BlogSearchInput`, below the title block and above the pills):
- `border-radius: 9999px`, `border: 1px solid #E5E7EB`, `background: #fff`
- `padding: 10px 16px 10px 38px` (space for a 14px SVG search icon on the left).
- `placeholder: "Search articles..."`, with a visually hidden label "Search articles" and `role="search"`.
- Typing sets `?q=` after a 400ms pause (`router.replace`, so a pause doesn't add a history entry). It keeps any category or tag and drops `page`, so results start at page 1.
- A new `?q=` in the URL (Back, a filter or a link) replaces the text, except while the field has focus: a navigation for an earlier pause that lands late never overwrites what the visitor has typed since (audit BLG-10). The text follows the URL during render, not in an effect. A search still waiting when the visitor leaves the page is dropped.
- The server does the filtering: `title match $q || excerpt match $q`, where `$q` is the trimmed text plus `*` (a GROQ prefix match). The post count and the page numbers use the same filter.
- Inter 400, 14px.
- Full width, and one third of the row from 1024px.

---

### Filter Pills

`BlogFilterPills` (`src/components/blog/BlogFilterPills.tsx`) wraps the shared `FilterPills` (`src/components/ui/FilterPills.tsx`).

- One row that scrolls sideways with a hidden scrollbar, at every width: `display: flex`, `gap: 8px`, `overflow-x: auto`, no wrapping. It keeps 6px of padding and 6px of scroll padding, and a pill that takes keyboard focus scrolls fully into view, so it keeps its whole focus ring (see `specs/05-PROJECTS.md`, Filter bar).
- In the same `page-container` as the search bar, with `padding-bottom: 24px` under the pair.

Each pill is a `Chip` toggle (`src/components/ui/Chip.tsx`, updated September 2026, the button programme): 36px tall, `padding: 0 16px`, pill shape, Inter 500, 14px, in both states.
**Default state:** white bg, `border: 1px solid #E5E7EB`, muted text
**Active state:** Deep Teal bg and edge, white text, no shadow, `aria-pressed="true"`
**Hover:** the default text turns Deep Teal

**Pills (one row):**

Category pills, with the singular names stored in Sanity:
```
All articles  |  Industry Insights  |  Project Spotlight  |  Company News  |  Press Release
```

Then one pill per tag used on a published post (`ALL_BLOG_TAGS_QUERY`). The Studio offers these tags:
```
Solar & Storage  |  Wheeling  |  Carbon Credits  |  Energy Optimisation  |  EV Fleets  |  WeBuySolar
```

**Filter logic:**
- `All articles` → show all posts (clears the category and tag, keeps the search).
- Category pill → filter by `category` field.
- Vertical tag pill → filter by `$tag in tags`.
- One pill is active at a time: choosing a pill clears the other filter and resets to page 1. The search term stays. The query still applies both if a hand-typed URL has a category and a tag.
- URL: `/blog?category=Industry+Insights` or `/blog?tag=Wheeling`, with the full name (`router.push`). The URL can be shared. The pills are buttons, not links, so crawlers reach tag pages only through the tag links on posts.

---

### Featured Article Card

- In the `page-container`, with `padding-bottom: 20px` below it.
- Shown on every page of the index, whatever the filter or search: `FEATURED_POST_QUERY` takes no parameters.

```css
display: grid;
grid-template-columns: 1fr;        /* phones: photo on top */
grid-template-columns: 1fr 1fr;    /* from 640px (sm) */
min-height: 240px;
border-radius: 16px;
overflow: hidden;
background: #fff;
border: 1px solid #E5E7EB;
cursor: pointer;
```

Hover (the shared `Card`, pattern 1): `translateY(-4px)`, `box-shadow: 0 12px 32px rgba(57,87,92,0.1)`, `border-color: #cccccc`; the photo zooms to 105%.

**Left — photo:**
- `next/image` fill, `object-fit: cover`, `min-height: 240px`, `priority`, blur placeholder.
- `FEATURED` badge: absolute top-left (12px in), Deep Teal fill, white text, Inter 700, 12px, uppercase, pill.

**Right — body** (`padding: 24px`):
- Tag row: category pill (solid fill, see Tag pill anatomy) + up to two tag pills (`rgba(112,157,169,0.10)` with Deep Teal text).
- Title: Plus Jakarta Sans 800, 20px, `line-height: 1.3`, `-webkit-line-clamp: 3`.
- Excerpt: Inter 400, 14px, muted, `line-height: 1.7`, `-webkit-line-clamp: 3`.
- Meta row: author photo, or initials on Deep Teal (26px circle) + author name + `·` + date + `·` + read time, in 12px muted text.

**Sanity source:** the most recent post with `featured: true`, or the most recent post when none is pinned (`order(featured desc, publishedAt desc) [0]`).

**Mobile:** below 640px the photo stacks above the body (`grid-cols-1 sm:grid-cols-2` in `FeaturedArticleCard.tsx`, updated September 2026; it used to hold a fixed `1fr 1fr` at every width).

---

### Article Grid

```css
display: grid;
grid-template-columns: repeat(3, 1fr); /* from 768px; 2 columns from 640px, 1 below */
gap: 16px;
/* inside page-container */
```

**Each card** (`ArticleCard`, on the shared `Card`):
- `background: #fff`, `border-radius: 16px`, `overflow: hidden`, `border: 1px solid #E5E7EB`.
- Hover: `translateY(-4px)`, `box-shadow: 0 12px 32px rgba(57,87,92,0.1)`, `border-color: #cccccc`.

**Card anatomy:**
- Photo: `height: 160px`, `next/image` fill, `object-fit: cover`, with a dark gradient scrim from the bottom.
- On the photo: the category badge top right, and the first tag bottom left when that tag names a vertical.
- Body: `padding: 16px`, with no tags row.
- Title: Plus Jakarta Sans 700, 14px, `line-height: 1.4`, `-webkit-line-clamp: 2`.
- Excerpt: Inter 400, 12px, muted, `line-height: 1.65`, `-webkit-line-clamp: 2`.
- Footer: date (left) + read time in Dusty Blue ink `#45727E` (right), `border-top: 1px solid #E5E7EB`, `padding: 12px 16px`.

**Tag pill anatomy:**
```css
font-size: 12px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.08em;
padding: 4px 10px;
border-radius: 9999px;
```
Each category has a solid fill with text that passes 4.5:1 on it (`CATEGORY_STYLES` in `src/lib/blogUtils.ts`; an unknown category falls back to Deep Teal). Project Spotlight takes a dark "on" colour, like the accent badges, because white on its gold measured 2.9:1:
| Category | Bg | Text |
|---|---|---|
| Industry Insights | `#39575C` | `#FFFFFF` |
| Project Spotlight | `#B8923A` | `#3A2806` (4.9:1) |
| Company News | `#2E7D6B` | `#FFFFFF` |
| Press Release | `#B85450` | `#FFFFFF` |

On article cards the vertical tag uses its vertical's solid accent with the accent's "on" text colour (`SOLUTION_META[vertical].accent` and `.accentText`, found with `tagMeta()`), with `letter-spacing: 0.1em`. On the featured card, tags use a 10% Dusty Blue tint with Deep Teal text.

**Default load:** 6 cards a page (`PAGE_SIZE`), featured post included. `BLOG_INDEX_QUERY` doesn't exclude the featured post and also sorts pinned posts first, so on page 1 the featured post appears again as the first card whenever it matches the current filter and search (always, with none set). Numbered pagination replaces "Load more" (see below).

**Mobile:** 1-column stack below 640px, 2 columns from 640px.

**Empty:** *"No articles found."* when nothing matches.

---

### Pagination

Load more is not built. As approved in the Engineering Review Fixes below, the index uses numbered pagination at every width, phones included. It is `BlogPagination` (`src/components/blog/BlogPagination.tsx`):
- It shows when there is more than one page: Prev (from page 2), the page numbers, then Next (before the last page), `padding: 40px 0`.
- Up to 7 pages, every page number shows. Past 7, it shows the first and last pages, the current page and one either side, with an ellipsis (`…`, hidden from screen readers) for each run of hidden pages; a run of one page shows that page instead. That is 7 numbers at most: page 5 of 10 reads Prev, 1, …, 4, 5, 6, …, 10, Next.
- The row sits in the page container, centred, and wraps rather than running off a phone (updated September 2026): chips 8px apart, wrapped rows 10px apart, so the 44px touch targets stay clear of each other. From 3 to 10 pages the row takes one or two rows at 320 to 414px, never three.
- Each is a link to `/blog?page=N` that keeps the category and tag but drops the search term (`buildBlogHref` in `src/app/blog/page.tsx`, passed in as `hrefFor`).
- Every one is a `Chip` link (updated September 2026), so the row is one height, 36px: Inter 500, 14px, white with a `#E5E7EB` border and muted text. The current page is `current`: Deep Teal with white text and `aria-current="page"`. Prev and Next keep their 14px arrows.

---

## Single Post

### Post Hero

- `position: relative`, `height: 360px` at every width, `overflow: hidden`, with Night Teal behind the photo.
- `next/image` fill, `object-fit: cover`, `priority`, and `placeholder="blur"` when the image has an LQIP.
- Overlay: `linear-gradient(180deg, rgba(13,31,34,0.15) 0%, rgba(13,31,34,0.88) 100%)`.

**Bottom-anchored content** (`padding: 0 24px 28px`, `max-width: 1024px`, `margin: 0 auto`):
- Tag row: the category (white text on white at 25%, bold, uppercase) + up to two tags (white text on white at 15%).
- Title: Plus Jakarta Sans 800, 24px (30px from 768px), white, `line-height: 1.2`, `margin-bottom: 12px`.
- Meta row: author photo, or initials on Deep Teal (28px, `border: 2px solid rgba(255,255,255,0.3)`) + name + `·` + date + `·` + read time.
  - All: Inter 400, 12px, `rgba(255,255,255,0.6)`.

---

### Breadcrumb + Share Bar

```css
display: flex; /* a column with an 8px gap below 640px */
align-items: center;
justify-content: space-between;
padding: 12px 24px;
max-width: 1024px;
margin: 0 auto;
border-bottom: 1px solid #E5E7EB;
```

**Left:** `Home / News & Insights / {post title}`, 12px, muted. The title is cut with an ellipsis to fit the line (CSS `truncate`), not at a set length.

**Right — share buttons:**
- Label: `Share:` in Inter 400, 12px, muted.
- Three 44px outline `IconButton`s (updated September 2026, the button programme) with drawn glyphs in Deep Teal: LinkedIn (`IconLinkedIn`), X (`IconXLogo`) and Copy link (`IconLink`). They replaced the text `in`, the letter `X` and the `🔗` emoji. The X and link glyphs are 20px; the LinkedIn mark, a filled square that reads larger and darker at the same size, is 16px, the same height as the X.
- Each: white, `border: 1px solid #E5E7EB`, which turns Deep Teal on hover over a `#F5F5F5` fill.
- After a copy, the link glyph turns into a check (`IconCheck`) for 2 seconds.

**Share behaviour:**
- LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url={canonicalUrl}`
- X: `https://x.com/intent/tweet?url={canonicalUrl}&text={seoTitle}`
- Copy link: `navigator.clipboard.writeText(canonicalUrl)`; the button's `title` reads "Copied!" for 2 seconds.

---

### Two-Column Post Layout

```css
display: grid;
grid-template-columns: 1fr 280px; /* from 1024px; 1fr below */
gap: 32px;
max-width: 1024px;
margin: 0 auto;
padding: 32px 24px 48px;
```

**Mobile (below 1024px):** a single column in source order: article body, then ToC, author card and related posts. The sidebar is sticky only from 1024px.

---

## Article Body (left column)

`max-width: 42rem` (672px), about 70 characters a line at the 18px body size. Reading copy never drops below 18px here; the smallest text anywhere is 12px (see `specs/01-BRAND.md`).

### Intro paragraph
No separate intro style. The first paragraph renders like every other body paragraph (Inter 400, 18px, `text-pe-text-soft`; see Standard prose), with no rule under it.

### Standard prose
- H2: Plus Jakarta Sans 800, 24px, `#1A1A1A`, `line-height: 1.25`, `margin: 48px 0 16px`
- H3: Plus Jakarta Sans 700, 20px, `#1A1A1A`, `line-height: 1.3`, `margin: 36px 0 12px`
- Body paragraph: Inter 400, 18px, `#374151` (`text-pe-text-soft`), `line-height: 1.75`, `margin-bottom: 24px`
- Lists: same size and colour as body, markers outside the text (`list-outside`, 24px indent), 8px between items
- Blockquote text: Plus Jakarta Sans 700 italic, 20px, `line-height: 1.45`
- Image caption: Inter 400, 14px, muted, centred, not italic

The previous values (12px `#6B7280` body, 17px H2) set about 117 characters a line in grey at a size below any reading floor; they were replaced in the September 2026 UX audit fixes.

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
- Title: Plus Jakarta Sans 700, 12px, dark on the light variants and white on the stat variant
- Text: Inter 400, 12px minimum, `line-height: 1.7`, muted on the light variants and `var(--color-on-dark-subtle)` or lighter on the stat variant

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
- Label: Inter 400, 12px, `var(--color-on-dark-subtle)`, uppercase

**Sanity fields:** `stats[]` — array of `{ value: string, label: string }` (max 4)

#### 3. Inline image with caption

- `next/image`, `border-radius: 12px`, `width: 100%`, `margin: 20px 0`
- Caption: Inter 400, 14px, muted, `text-align: center`

**Sanity fields:** `image` (Sanity image asset), `alt` (string, required), `caption` (string, optional)

#### 4. Blockquote

```css
border-left: 3px solid #709DA9;
padding: 16px 16px 16px 20px;
background: rgba(112,157,169,0.06);
border-radius: 0 8px 8px 0;
margin: 32px 0;
```
- Quote text: Plus Jakarta Sans 700, 20px, `#1A1A1A`, italic, `line-height: 1.45`
- There is no source line.

**Sanity fields:** none of its own. A blockquote is the editor's standard Portable Text "Quote" style on a text block, rendered by `block.blockquote` in `src/lib/portableTextComponents.tsx`. There is no quote object and no source field.

#### 5. Inline CTA banner

```css
background: #39575C;
border-radius: 14px;
padding: 20px;
text-align: center;
margin: 24px 0;
```
- Title: Plus Jakarta Sans 800, 16px (`text-base`), white
- Subtitle: Inter 400, 12px, `rgba(255,255,255,0.65)`
- Button: `Button`, light, compact size (updated September 2026): a 40px pill, `#F5F5F5` fill, Night Teal Inter 600 14px, white on hover. An external link opens in a new tab.
- The block carries `focus-on-dark`, so the focus ring is white on it: the default Deep Teal ring vanished on the Deep Teal block.

**Sanity fields:** `title`, `subtitle`, `btnText`, `btnHref` (internal route or external URL)

---

### Tags Footer

```css
display: flex;
align-items: center;
gap: 10px 8px; /* each chip's touch target reaches 4px above and below, so wrapped rows keep 2px between them */
flex-wrap: wrap;
padding-top: 20px;
border-top: 1px solid #E5E7EB;
margin-top: 28px;
```
- "Tags:" label: Inter 600, 12px, `#1A1A1A`
- Each tag: a `Chip` link (updated September 2026), like the /blog tag pills: 36px, white with a `#E5E7EB` border, muted Inter 500 14px text that turns Deep Teal on hover
- Each tag links to `/blog?tag={tag}`, which drives internal linking

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

- Title: `In this article`, Plus Jakarta Sans 700, 14px (`text-sm`)
- Auto-generated from H2 and H3 headings in article body
- Each item: number (Inter 700, 12px, `pe-secondary-ink`) + heading text (Inter 12px; 500 for H2, 400 for H3)
- `border-bottom: 1px solid #E5E7EB` between items
- Click → smooth scroll to heading anchor
- Active heading: text → Deep Teal (tracked via IntersectionObserver)

### 2. Author Card

- Author avatar: 44px circle, Deep Teal bg, white initials
- Name: Plus Jakarta Sans 700, 14px (`text-sm`)
- Role: Inter 500, 12px, `pe-secondary-ink` (e.g. *"The Strategist · Co-Founder"*)
- Bio: Inter 400, 12px, muted, `line-height: 1.65` (from Sanity `author.bio`)
- Links to `/blog/authors/[slug]`

### 3. Related Posts (3 articles)

Pulled via GROQ: posts sharing at least one tag OR same category, ordered by `publishedAt desc`, excluding current post.

- Card title: `Related articles`, Plus Jakarta Sans 700, 14px (`text-sm`)

Each item:
- Thumbnail: `52×44px`, `border-radius: 8px`, `next/image`
- Title: Plus Jakarta Sans 700, 12px, `line-height: 1.35`, clamped to two lines
- Meta: Inter 400, 12px, muted: date + read time
- `border-bottom: 1px solid #E5E7EB`. Last: none
- Full card links to `/blog/[slug]`

---

## SEO Implementation

### `generateMetadata` (per post)

```typescript
// src/app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  // The social share image when the post has one, else its hero, as a JPEG; it has no alt text of its own.
  const image = sanityShareImage(post.ogImage, post.title) ?? sanityShareImage(post.heroImage, post.title);
  return pageMetadata({
    title: post.seoTitle ?? post.title,   // an editor's SEO title is used as written; otherwise the template adds the brand
    absoluteTitle: Boolean(post.seoTitle),
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug.current}`,
    canonical: post.canonicalUrl,         // a syndicated post's canonical points there; og:url stays on this site
    shareTitle: post.seoTitle ?? post.title,
    image,
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [authorUrl(post.author.slug.current)],
      tags: post.tags,
    },
  });
}
```

`pageMetadata()` (`src/lib/seo.ts`) builds the title, description, canonical, Open Graph and Twitter tags from these few lines, the same helper every page uses (`specs/02-ARCHITECTURE.md`, "Search and sharing tags").

### JSON-LD Article schema (per post)

`blogArticleJsonLd()` (`src/lib/blogSeo.ts`):
```typescript
{
  '@context': 'https://schema.org',
  '@type': articleType(post.category),          // NewsArticle for Company News and Press Release; BlogPosting otherwise
  headline: post.title,                         // the display title, even beside an SEO title that names the brand
  description: post.seoDescription || post.excerpt,
  image: sanityArticleImages(post.heroImage),   // the hero in three shapes, 16:9, 4:3 and 1:1, 1200px wide, as JPEGs
  datePublished: post.publishedAt,
  dateModified: post.updatedAt || post.publishedAt,
  inLanguage: 'en-ZA',
  articleSection: post.category,
  keywords: post.tags?.join(', '),
  author: {                                     // personJsonLd(): a Person under an @id their page and their posts share
    '@type': 'Person',
    '@id': `${authorUrl}#person`,
    name: post.author.name,
    url: authorUrl,
    jobTitle: post.author.role,
    image: post.author.photoUrl,
    sameAs: [post.author.linkedin],
    worksFor: ORGANIZATION_REF,                 // the organisation by its @id, not restated
  },
  publisher: ORGANIZATION_REF,
  mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
}
```
A field the post has nothing for (no tags, no category, no author LinkedIn or photo) is left out rather than sent empty.

### BreadcrumbList schema (blog index + single post)

`breadcrumbJsonLd()` (`src/lib/structuredData.ts`): Home, then News & Insights, and, on a single post, the post itself, named by its on-site path (`/blog/{slug}`), even when `canonicalUrl` points a syndicated post elsewhere. The canonical points there; `og:url`, the breadcrumb and the site's own links stay on this site.

### Author page metadata and ProfilePage schema

```typescript
// src/app/blog/authors/[slug]/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [author, posts] = await Promise.all([getAuthor(slug), getAuthorPosts(slug)]);
  if (!author) return {};
  return pageMetadata({
    title: `${author.name}, News & Insights`,
    description: author.bio ?? (author.role ? `Articles by ${author.name}, ${author.role}.` : `Articles by ${author.name}.`),
    path: `/blog/authors/${slug}`,
    noindex: posts.length === 0,   // nothing published yet: a page with nothing on it for search
  });
}
```
`authorProfileJsonLd()` makes the page a `ProfilePage`, its `mainEntity` the author as a Person (`personJsonLd()`, the same block a post's Article names as author), with their bio as its description.

### ISR + Sanity webhook

```typescript
// Rebuild strategy (/blog/[slug] and the author pages; /blog itself renders per request)
export const revalidate = 3600; // Background ISR every hour

// On-demand revalidation via the Sanity webhook: src/app/api/revalidate/route.ts
// Webhook URL: https://phoenixenergy.solutions/api/revalidate
// Needs the header `Authorization: Bearer ${REVALIDATE_SECRET}` (401 without it).
// For the blog:
//   blogPost → /blog/[slug], /blog, / (latest posts), the author page, each solution page's
//              related articles, and /sitemap.xml
//   author   → /blog/authors/[slug], /blog/[slug] and /sitemap.xml
```
A post that goes live only because its scheduled date has passed, with nothing edited in Sanity, fires no webhook: it appears on `/blog` at once, since that page renders per request, and everywhere else, including the sitemap, at the next hourly refresh.

### `generateStaticParams` (pre-render every live post at build time)

```typescript
export async function generateStaticParams() {
  const slugs = await sanityServerClient.fetch<{ slug: string }[]>(ALL_BLOG_SLUGS_QUERY);   // live posts only
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
    { name: 'title',          type: 'string',   title: 'Display title', validation: required },
    { name: 'slug',           type: 'slug',     options: { source: 'title' }, validation: required },
    { name: 'author',         type: 'reference', to: [{ type: 'author' }], validation: required },
    { name: 'publishedAt',    type: 'datetime', title: 'Published at', validation: required },   // a future date holds the post back; see "Live posts" below
    { name: 'updatedAt',      type: 'datetime', title: 'Last updated' },   // JSON-LD dateModified, falls back to publishedAt
    { name: 'featured',       type: 'boolean',  title: 'Pinned to top of index', initialValue: false },
    { name: 'category',       type: 'string',
      options: { list: [
        'Industry Insights', 'Project Spotlight', 'Company News', 'Press Release'
      ]}, validation: required },
    { name: 'tags',           type: 'array', of: [{ type: 'string' }],
      options: { list: ['Solar & Storage', 'Wheeling', 'Carbon Credits', 'Energy Optimisation', 'EV Fleets', 'WeBuySolar'] } },
    { name: 'heroImage',      type: 'image', options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: required }],
      // required(), but a warning rather than a block: the post can still be published without one.
      validation: required.warning("Without a hero image, the post is shared with the site's default image and its search data has no image.") },
    { name: 'excerpt',        type: 'text', rows: 3,
      description: 'Used in cards and as meta description fallback (155 chars max)',
      validation: max(155).warning('Search results show about 155 characters of a description; the rest is cut.') },
    { name: 'readTime',       type: 'number', description: 'Minutes — set manually' },
    { name: 'body',           type: 'array',
      of: [
        // Normal text, two heading levels and a quote: the post's title is its only H1.
        { type: 'block', styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'Heading 2', value: 'h2' },
          { title: 'Heading 3', value: 'h3' },
          { title: 'Quote', value: 'blockquote' },
        ]},
        { type: 'image', options: { hotspot: true },
          fields: [
            { name: 'alt',     type: 'string', validation: required },
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
      description: 'Google headline, 60 chars max. Leave blank to use display title.',
      validation: max(60).warning('Search results show about 60 characters of a title; the rest is cut.') },
    { name: 'seoDescription', type: 'text', rows: 2,
      description: 'Meta description, 155 chars max. Leave blank to use excerpt.',
      validation: max(155).warning('Search results show about 155 characters of a description; the rest is cut.') },
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

Every warning above (`heroImage`, `excerpt`, `seoTitle`, `seoDescription`) lets the editor publish past it; nothing here blocks saving. `sanity/schemaTypes/blogPost.test.ts` pins the body's four styles and each warning's field and threshold.

**Live posts:** every read of blog content filters on slug and `publishedAt`: a post needs a slug and a publish date that has come, or it appears in no list, count, sitemap entry or lookup, whatever else is filled in (`specs/12-CMS.md`). A post scheduled for later appears once its date comes, at the next hourly refresh of the page it would show on, except on `/blog` itself, which renders per request.

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

Every query below filters on `LIVE_POST` (`_type == "blogPost" && defined(slug.current) && dateTime(publishedAt) <= dateTime(now())`, `src/lib/queries.ts`): a post needs a slug and a publish date that has come, or it is left out of every list, count, sitemap entry and lookup, whatever else is filled in. A post scheduled for later appears once its date comes: at once on `/blog`, which renders per request, and at the next hourly refresh everywhere else, since nothing edits the post in Sanity to fire the webhook.

```groq
// Blog index, paginated and filterable (BLOG_INDEX_QUERY in src/lib/queries.ts)
*[LIVE_POST
  && ($category == "" || category == $category)
  && ($tag == "" || $tag in tags)
  && ($q == "" || title match $q || excerpt match $q)
] | order(featured desc, publishedAt desc) [$offset...$offset+6] {
  title, slug, category, tags, excerpt, readTime, publishedAt,
  heroImage { asset->, alt },
  featured,
  "author": author->{ name, slug, photo { asset-> } }
}
// BLOG_COUNT_QUERY wraps the same filter in count(...) for the page numbers
// PUBLISHED_POSTS_COUNT_QUERY is count(*[LIVE_POST]): 0 keeps /blog noindex and out of the sitemap

// Featured card (FEATURED_POST_QUERY): no filters besides LIVE_POST, so it is the same on every page
*[LIVE_POST] | order(featured desc, publishedAt desc) [0] { ... }

// Single post — full content
*[LIVE_POST && slug.current == $slug][0] {
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
    LIVE_POST
    && slug.current != $slug
    && (category == ^.category || count((tags)[@ in ^.tags]) > 0)
  ] | order(publishedAt desc) [0..2] {
    title, slug, excerpt, readTime, publishedAt,
    heroImage { asset->, alt },
    "author": author->{ name }
  }
}
// A future post's own page (POST_BY_SLUG_QUERY with its slug) returns null until its date comes.

// All unique tags (for filter pills)
array::unique(*[LIVE_POST].tags[])

// Live post slugs (for generateStaticParams)
*[LIVE_POST]{ "slug": slug.current }

// Sitemap entries: live posts, dated by "Last updated" else the publish date
*[LIVE_POST]{ "slug": slug.current, "lastModified": coalesce(updatedAt, publishedAt) }
// Authors with a live post, dated by their latest one
*[_type == "author" && defined(slug.current) && count(*[LIVE_POST && references(^._id)]) > 0]{
  "slug": slug.current,
  "lastModified": *[LIVE_POST && references(^._id)] | order(publishedAt desc) [0].publishedAt
}
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
- Named authors on every post: the author card shows the photo (or initials), role and bio, and links to the author's profile, which carries the LinkedIn link when one is set.
- Author profile pages at `/blog/authors/[slug]` with post archive, `noindex` while the author has no live post. The dark hero shows the LinkedIn link, when one is set, as a compact ghost `Button` (40px, white at 8% with a white 20% edge, opens in a new tab). The page publishes `ProfilePage` JSON-LD, its `mainEntity` the author as a Person.
- The published date shows on the page. `datePublished` and `dateModified` (which falls back to the published date) are in the JSON-LD.
- JSON-LD `NewsArticle` (Company News and Press Release) or `BlogPosting` (every other category), the author as a Person with `sameAs` and `worksFor`, and `publisher` naming the organisation by its `@id`
- Internal links from every post to relevant solution pages

### Internal linking rules for editors
- Every post must link to at least one solution page relevant to its tags
- Project spotlight posts must link to the full project case study
- Use tag footer links — these pass equity to `/blog?tag={tag}` archive pages
- Related posts sidebar drives further depth signals

---

## Responsive Breakpoints Summary

| Element | Desktop | Mobile |
|---|---|---|
| Page header | One column; search bar one third wide from 1024px | One column; search bar full width |
| Filter pills | One row that scrolls sideways | Same |
| Featured card | 2-col (photo + body) | 2-col as well; stacking is not built |
| Article grid | 3 columns from 768px | 2 columns from 640px, 1 below |
| Post hero | 360px, bottom-anchored | 360px |
| Post layout | 2-col (body + 280px sidebar) from 1024px | 1-col below 1024px: body, ToC, author, related |
| Share bar | Right of the breadcrumb from 640px | Below the breadcrumb under 640px |

---

## Component Map

| Component | Path |
|---|---|
| Blog index page | `src/app/blog/page.tsx` |
| Single post page | `src/app/blog/[slug]/page.tsx` |
| Author profile page | `src/app/blog/authors/[slug]/page.tsx` |
| Article card | `src/components/ui/ArticleCard.tsx` |
| Featured article card | `src/components/ui/FeaturedArticleCard.tsx` |
| Blog filter pills | `src/components/blog/BlogFilterPills.tsx` (wraps the shared `src/components/ui/FilterPills.tsx`) |
| Blog search input | `src/components/blog/BlogSearchInput.tsx` |
| Pagination | `src/components/blog/BlogPagination.tsx` |
| Read-depth analytics (`blog_read_complete`) | `src/components/analytics/BlogReadDepth.tsx` |
| CTA band before the footer | `src/components/layout/PageFooter.tsx` |
| Category colours, tag to vertical, dates | `src/lib/blogUtils.ts` |
| GROQ queries | `src/lib/queries.ts` |
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
- Page header (breadcrumb + eyebrow + H1 + subtitle): `delay: 0`.
- Search bar and filter pills: `delay: 0.05`.
- Featured article card: `delay: 0.1`.
- Article grid: staggered by `0.04s` per card, with each card in its own `AnimatedSection` at `delay: i * 0.04` (not `staggerChildren`).

Blog article card hover: `translateY(-4px)`, `box-shadow: 0 12px 32px rgba(57,87,92,0.1)` and `border-color: #cccccc` over `0.2s` (the shared `Card`, pattern 1).

### Blog ToC — active state
Tracked via `IntersectionObserver` with `rootMargin: '-80px 0px -70% 0px'` (accounts for fixed nav).

Active ToC item:
```css
color: #39575C;
border-left: 3px solid #39575C;
padding-left: 10px;   /* shift to accommodate the border */
transition: color 0.2s ease, border-color 0.2s ease;
```
Inactive items: a transparent 3px left border, so the text doesn't shift, and `color: var(--color-pe-muted)`.

### Blog pagination — SSR paginated (approved fix for 5.6)
Route strategy: `/blog?page=2` via Next.js `searchParams`.

```typescript
// src/app/blog/page.tsx: it awaits searchParams, so it renders per request
type BlogSearchParams = Promise<{ page?: string; category?: string; tag?: string; q?: string }>;

export default async function BlogPage({ searchParams }: { searchParams: BlogSearchParams }) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const offset = (page - 1) * PAGE_SIZE; // PAGE_SIZE = 6
  // Fetch posts, count, featured post and tags in parallel
}

// Metadata for paginated pages, built with pageMetadata() like every page
export async function generateMetadata({ searchParams }: { searchParams: BlogSearchParams }) {
  const { page: pageParam, category, tag, q: qParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const search = qParam?.trim() ?? '';
  const [total, published] = await Promise.all([
    sanityServerClient.fetch<number>(BLOG_COUNT_QUERY, { category: category ?? '', tag: tag ?? '', q: search }),
    sanityServerClient.fetch<number>(PUBLISHED_POSTS_COUNT_QUERY),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  return pageMetadata({
    title: 'News & Insights',
    description: 'Expert perspectives on clean energy, SA market trends, project spotlights and company news.',
    // A filtered or searched view canonicalises to /blog, whatever its page number; a later page of the whole list canonicalises to itself.
    path: blogIndexPath({ page, category: category ?? '', tag: tag ?? '', q: search }),
    noindex: published === 0 || search !== '',
    pagination: {
      previous: page > 1 ? buildBlogHref(page - 1, category, tag) : undefined,
      next: page < totalPages ? buildBlogHref(page + 1, category, tag) : undefined,
    },
  });
}
```
`pagination` is a `Metadata` field in its own right, not nested inside `alternates`; Next.js renders `<link rel="prev">` and `<link rel="next">` from it.

**With no live posts:** `/blog` is `noindex, follow`, the sitemap leaves out `/blog` until the first post is live (`src/app/sitemap.ts`), and the home page's `WebSite` JSON-LD carries its `SearchAction` (which targets `/blog?q=`) only when a live post exists. A search result page (`q` set) is `noindex, follow` too, whatever it finds, with its canonical pointing at plain `/blog`. Publishing a post fires the webhook, which refreshes `/`, `/blog` and the sitemap at once; a post that only goes live because its scheduled date has passed refreshes them within the hour instead.
UI as built: page number chips with Prev and Next at the bottom of the grid, at every width, all `Chip` links, wrapping on a phone, with a window of numbers past 7 pages (`BlogPagination`; see Pagination above). There is no Load more, on mobile or anywhere else.


# 10 — Blog & Articles
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Routes: `/blog` (index) · `/blog/[slug]` (single post) · `/blog/authors/[slug]` (author profile)
> **Approved April 2026**
> **Updated 2026-10-08:** the article cards, the blog index, the carousels and the author page follow the project cards and `/projects` (Blog Index below).
> **Updated 2026-09-24:** corrected to match the build. Type sizes follow the scale in `specs/01-BRAND.md`: nothing renders below 12px, so where a line below gives 9 to 11px, the build uses 12px or more.

---

## Section Order — Blog Index (`/blog`)

```
1. Navbar: solid white pill; "News & Insights" highlighted once the link shows (from the first live post)
2. Breadcrumb: Home / News & Insights
3. Page header (IndexHeader): eyebrow + H1 + intro, one column
   Below 4 live posts: every post as a large card, 2 columns from 768px, and nothing else
   From 4 live posts:
4. Search bar: above the pills; ?q= filters on the server
5. Filter pills: from the data, with counts; one scrolling row, one active pill at a time
6. Featured article: only a post marked featured, page 1, no filter or search
7. Article grid: 1, 2 or 3 columns, 6 cards a page, without the featured post
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

> **Rebuilt 2026-10-08** to follow `/projects` (`specs/05-PROJECTS.md`). The rule lives in `src/lib/blogIndex.ts` (tested in `blogIndex.test.ts`), so the page and its metadata read the URL the same way.

### The rule: a few posts, or four and more

`BLOG_FILTER_THRESHOLD = 4` (`src/lib/blogUtils.ts`), counted over every live post (`PUBLISHED_POSTS_COUNT_QUERY`).

| | Below 4 live posts ("few") | 4 or more |
|---|---|---|
| Search and pills | None | The search, then the pills from the data |
| Featured card | None | Only a post marked featured, on page 1, with no category, tag or search |
| Grid | Every live post, newest first, as large cards: `grid-cols-1 md:grid-cols-2`, `gap-6` | 6 a page, `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`, `gap-4`, without the featured post |
| URL parameters | Ignored: `page`, `category`, `tag` and `q`. A shared `?tag=` link still shows every post | Read |
| Pagination | None (one page) | `BlogPagination` |

Metadata follows the same view: below 4, every URL's canonical is `/blog` and there are no `prev` or `next` links. A search URL (`q` set) stays `noindex, follow` at any post count, and `/blog` with no live posts is `noindex` too.

### Navbar & Breadcrumb
- The section is named "News & Insights" everywhere: the navbar link, the breadcrumbs, the eyebrow, the page title and the BreadcrumbList JSON-LD.
- Active link: "News & Insights". The root layout adds it to the navbar once a live post exists, meaning a slug and a publish date that has come (`BLOG_NAV_MIN_POSTS = 1` in `src/lib/blogNav.ts`; see `specs/03-NAVIGATION.md`).
- Breadcrumb: `Home / News & Insights`, from `IndexHeader`.

---

### Page Header (`IndexHeader`)

`src/components/ui/IndexHeader.tsx`, shared with `/projects`. Inside `page-container` with `padding-top: 96px` (`pt-24`), one column at every width:
- Breadcrumb (`BreadcrumbTrail` from `PageBreadcrumb.tsx`: an `ol`, `aria-current="page"` on the current crumb, separators hidden from screen readers), 14px, `margin-bottom: 20px`.
- Eyebrow `NEWS & INSIGHTS`: Inter 700, 12px, uppercase, `tracking-[0.14em]`, `pe-muted`.
- H1 `Energy intelligence, delivered`: Plus Jakarta Sans 800, 36px, `leading-[1.2]`, with "delivered" in Deep Teal (`text-pe-primary`).
- Intro: Inter 400, 16px, `pe-muted`, `leading-[1.7]`, `max-width: 60ch`: *"Expert perspectives on clean energy, SA market trends, project spotlights and company news."*
- The block ends `margin-bottom: 32px`.

**Search bar** (`BlogSearchInput`, from 4 live posts, above the pills):
- `border-radius: 9999px`, a `pe-border` edge, white.
- `padding: 10px 16px 10px 38px` (space for a 14px SVG search icon on the left).
- `placeholder: "Search articles..."`, with a visually hidden label "Search articles" and `role="search"`.
- Typing sets `?q=` after a 400ms pause (`router.replace`, so a pause doesn't add a history entry). It keeps any category or tag and drops `page`, so results start at page 1.
- A new `?q=` in the URL (Back, a filter or a link) replaces the text, except while the field has focus: a navigation for an earlier pause that lands late never overwrites what the visitor has typed since (audit BLG-10). The text follows the URL during render, not in an effect. A search still waiting when the visitor leaves the page is dropped.
- The server does the filtering: `title match $q || excerpt match $q`, where `$q` is the trimmed text plus `*` (a GROQ prefix match). The post count and the page numbers use the same filter.
- Inter 400, 14px. Full width, and one third of the row from 1024px.

---

### Filter Pills

`BlogFilterPills` (`src/components/blog/BlogFilterPills.tsx`) wraps the shared `FilterPills` (`src/components/ui/FilterPills.tsx`). Shown from 4 live posts only.

- One row that scrolls sideways with a hidden scrollbar, at every width: `display: flex`, `gap: 8px`, `overflow-x: auto`, no wrapping. It keeps 6px of padding and 6px of scroll padding, and a pill that takes keyboard focus scrolls fully into view, so it keeps its whole focus ring (see `specs/05-PROJECTS.md`, Filter bar).
- The search and the pills sit in a column 12px apart, with `margin-bottom: 24px` under the pair.

Each pill is a `Chip` toggle (`src/components/ui/Chip.tsx`): 36px tall, `padding: 0 16px`, pill shape, Inter 500, 14px. Default: white, `pe-border` edge, muted text. Active: Deep Teal fill and edge, white text, `aria-pressed="true"`. Hover: the default text turns Deep Teal.

**Pills come from the data, with counts**, as on `/projects`, so no pill leads to an empty grid. `BLOG_FILTER_ROWS_QUERY` returns each live post's `{ category, tags }`, and `blogFilterOptions(rows)` counts them: categories first, then tags, each by count (most first) then name. For example:
```
All articles (7)  |  Industry Insights (4)  |  Company News (3)  |  Energy Optimisation (5)  |  Wheeling (2)
```

**Filter logic:**
- `All articles` clears the category and tag and keeps the search.
- A category pill filters by `category`; a tag pill by `$tag in tags`.
- One pill is active at a time: choosing a pill clears the other filter and resets to page 1. The search term stays. The query still applies both if a hand-typed URL has a category and a tag.
- URL: `/blog?category=Industry+Insights` or `/blog?tag=Wheeling`, with the full name (`router.push`). The pills are buttons, not links, so crawlers reach tag pages only through the tag links on posts.

---

### Featured Article Card

`FeaturedArticleCard` (`src/components/ui/FeaturedArticleCard.tsx`), built like `FeaturedProjectCard`. On `/blog` it shows from 4 live posts, only for a post marked `featured` (`FEATURED_POST_QUERY` returns the newest pinned post, else the newest post; the page shows it only when `featured == true`), on page 1 with no category, tag or search. It sits `margin-bottom: 16px` above the grid and is the page's first image, so it takes `priority`.

- The shared `Card` (pattern 1: lifts 4px with a shadow on hover). The photo does not zoom.
- `grid-cols-1 sm:grid-cols-[3fr_2fr]`: photo on top on phones, three fifths beside the panel from 640px.
- **Photo column**: `min-height: 260px`, `next/image` fill with `alt=""` and a blur placeholder; with no photo, the service accent's gradient (or Deep Teal to Dusty Blue). A scrim from `pe-nav-dark` at 82% to clear. Top left, the `Featured article` pill: Deep Teal, white text, a white 20% hairline, Inter 700, 12px, uppercase. Bottom, over the scrim: the title (`h2` by default, `h3` on request), Plus Jakarta Sans 800, 24px, white, `leading-[1.2]`; under it the meta line in white 14px.
- **Panel** (`padding: 24px`, white, a `pe-border` rule between it and the photo): the excerpt (14px, muted, `leading-[1.7]`, 4 lines at most); the author (26px photo with `alt=""`, or initials on Deep Teal, then the name in 14px `pe-text`); then a footer row over a `pe-border` rule with the action drawn as a compact button, `Read article` and an arrow (`buttonClasses({ size: 'compact', inCard: true })`).

---

### Article Grid and the Article Card

`ArticleCard` (`src/components/ui/ArticleCard.tsx`) has `ProjectCard`'s anatomy, on the shared `Card` (pattern 1). The whole card is one link; it carries no reveal wrapper, so each caller wraps it (`AnimatedSection as="li"` in the `/blog` and author grids, `as="div"` in the carousels).

- **Photo**: `CardImage`, `aspect-ratio: 16 / 10`, `alt=""` (the title names the link), the Sanity URL at 1200px wide with the LQIP. With no photo, the service accent's gradient, or `pe-border`.
- **One badge**, bottom left on the photo: the service the post's tags name (`postVertical(tags)`, the first tag that names one), in its accent with its "on" ink, Inter 700, 12px, uppercase, `tracking-[0.1em]`. No service tag, no badge. The category is not a badge.
- **Body** (`padding: 16px`, large `24px`): the title as a heading (`h3` by default, `h2` straight under the page's H1 on `/blog`), Plus Jakarta Sans 700, 18px (large 20px), `leading-[1.3]`, 3 lines at most; the meta line, 14px muted, `margin-top: 4px`: `Industry Insights · 8 Oct 2026 · 6 min read` (`postMetaLine`; a missing read time is left out); the excerpt, 14px muted, `leading-[1.65]`, `margin-top: 12px`, 3 lines at most.
- **Footer**: `Read article` in 14px semibold Deep Teal, and the card arrow, over a `pe-border` rule.
- `size="large"` where only a few cards sit in two columns (the few-posts `/blog`, a carousel of one or two, an author with fewer than three posts).

The category colours (`CATEGORY_STYLES`) are gone: the category is text in the meta line.

**Empty states** (`BlogEmptyState`, in place of the grid, in a white `rounded-card` box): no live posts, *"Articles are on their way."* with no link; a search that matches nothing, *"No articles match “{q}”."*; a filter that matches nothing, *"No articles match this filter."*; a page past the end, *"There are no articles on this page."* Each but the first ends in an `ArrowLink` "Show all articles" to `/blog`. No featured card shows above an empty grid.

The section ends `padding-bottom: 64px` before `PageFooter`, as `/projects`.

---

### Pagination

Load more is not built. As approved in the Engineering Review Fixes below, the index uses numbered pagination at every width, phones included, from 4 live posts. It is `BlogPagination` (`src/components/blog/BlogPagination.tsx`):
- It shows when there is more than one page: Prev (from page 2), the page numbers, then Next (before the last page), `padding: 40px 0`.
- Up to 7 pages, every page number shows. Past 7, it shows the first and last pages, the current page and one either side, with an ellipsis (`…`, hidden from screen readers) for each run of hidden pages; a run of one page shows that page instead. That is 7 numbers at most: page 5 of 10 reads Prev, 1, …, 4, 5, 6, …, 10, Next.
- The row sits in the page container, centred, and wraps rather than running off a phone: chips 8px apart, wrapped rows 10px apart, so the 44px touch targets stay clear of each other.
- Each is a link to `/blog?page=N` that keeps the category, the tag and the search (`blogIndexHref` in `src/lib/blogIndex.ts`).
- The featured post is left out of the grid and the page count on every page of the whole list (`$exclude`), not only page 1, so page 2 starts where page 1's grid ended.
- Every one is a `Chip` link, 36px: Inter 500, 14px, white with a `pe-border` edge and muted text. The current page is `current`: Deep Teal with white text and `aria-current="page"`. Prev and Next keep their 14px arrows.

---

### Author Page (`/blog/authors/[slug]`)

Rebuilt 2026-10-08 on the project page's grammar:
- `PageBreadcrumb` first: `Home / News & Insights / {name}`, no action (Home drops below 640px, as on every trail of three).
- A light header in `page-container`, `margin-top: 24px`: the 88px photo (`alt=""`) or the initials on Deep Teal, beside the text from 640px and above it on phones; the name as the H1 (Plus Jakarta Sans 800, 36px, `pe-text`); the role (14px, 500, `pe-secondary-ink`); the bio (16px, muted, `leading-[1.7]`, `max-width: 60ch`) and LinkedIn (a compact ghost `Button` with the LinkedIn icon, new tab), each only when set.
- The articles in a `section`, `margin-top: 40px` (48px from 768px, 64px from 1024px), `padding-bottom: 64px`: an `h2` in the eyebrow style, "Articles by {name}", then a `ul` of `ArticleCard`s (`h3`), each in `AnimatedSection as="li"`: fewer than three posts, large cards two a row from 768px; otherwise `sm:grid-cols-2 md:grid-cols-3`; `gap-4`. With none, "No articles yet."
- Then `PageFooter ctaVariant="centered"`. No inline colours.

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
A post that goes live only because its scheduled date has passed, with nothing edited in Sanity, fires no webhook: it appears on `/blog` at once, since that page renders per request, and everywhere else, including the sitemap, at the next hourly refresh. Documented, not fixed: if someone opened that post's own address before its date, the not-found render is cached with its 404 status for up to that same hour, so `/blog` can list the post while its own address still 404s, until `/blog/[slug]`'s revalidate catches up.

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

Every query below filters on `LIVE_POST` (`_type == "blogPost" && defined(slug.current) && PUBLISHED_AT <= dateTime(now())`, `src/lib/queries.ts`): a post needs a slug and a publish date that has come, or it is left out of every list, count, sitemap entry and lookup, whatever else is filled in. `PUBLISHED_AT` reads a publish date written as a full date-time, one without a zone (read as UTC), or a bare date (read as midnight UTC); any other form keeps the post off the site. A post scheduled for later appears once its date comes: at once on `/blog`, which renders per request, and at the next hourly refresh everywhere else, since nothing edits the post in Sanity to fire the webhook. `BLOG_SITEMAP_QUERY` dates each post by its "Last updated" field, falling back to the publish date when that field is missing or can't be read as a date.

```groq
// Blog index, paginated and filterable (BLOG_INDEX_QUERY in src/lib/queries.ts).
// $exclude is the featured post's _id while /blog shows its card (the whole list, any page), else "".
*[LIVE_POST
  && _id != $exclude
  && ($category == "" || category == $category)
  && ($tag == "" || $tag in tags)
  && ($q == "" || title match $q || excerpt match $q)
] | order(featured desc, publishedAt desc) [$offset...$offset+6] {
  title, slug, category, tags, excerpt, readTime, publishedAt,
  heroImage { asset->, alt },
  featured,
  "author": author->{ name, slug, photo { asset-> } }
}
// BLOG_COUNT_QUERY wraps the same filter (with $exclude) in count(...) for the page numbers
// PUBLISHED_POSTS_COUNT_QUERY is count(*[LIVE_POST]): 0 keeps /blog noindex and out of the sitemap

// Featured card (FEATURED_POST_QUERY): the newest pinned post, else the newest post;
// /blog shows it only when it is marked featured (src/lib/blogIndex.ts)
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

// Each live post's category and tags, for the pills and their counts (BLOG_FILTER_ROWS_QUERY)
*[LIVE_POST]{ category, tags }

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
- Author profile pages at `/blog/authors/[slug]` with post archive, `noindex` while the author has no live post. The light header shows the LinkedIn link, when one is set, as a compact ghost `Button` with the LinkedIn icon (opens in a new tab; see Author Page above). The page publishes `ProfilePage` JSON-LD, its `mainEntity` the author as a Person.
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
| Filter pills (4 or more posts) | One row that scrolls sideways | Same |
| Featured card (4 or more posts) | Photo three fifths beside the panel from 640px | Photo above the panel |
| Article grid, below 4 posts | 2 large cards a row from 768px | 1 column |
| Article grid, 4 or more | 3 columns from 768px | 2 columns from 640px, 1 below |
| Author page header | Photo beside the text from 640px | Photo above the text |
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
| Index header (shared with /projects) | `src/components/ui/IndexHeader.tsx` |
| Breadcrumb row and trail | `src/components/ui/PageBreadcrumb.tsx` (`PageBreadcrumb`, `BreadcrumbTrail`) |
| Index rule: view, page links, featured card, empty reason | `src/lib/blogIndex.ts` |
| Empty grid message | `src/components/blog/BlogEmptyState.tsx` |
| Tag to service, dates, meta line, headings, filter options, carousel and related layouts | `src/lib/blogUtils.ts` |
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
As built from 2026-10-08, as `/projects`: the page header, the search, the pills and the featured card render in place, with no reveal. The grid's cards reveal one by one, each `li` an `AnimatedSection` at `delay: i * 0.04` (not `staggerChildren`).

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
// src/app/blog/page.tsx: it awaits searchParams, so it renders per request.
// loadIndex (React's cache) fetches once for the metadata and the page:
// PUBLISHED_POSTS_COUNT_QUERY, then blogIndexView(params, published) (src/lib/blogIndex.ts).
// Below 4 live posts the view ignores page, category, tag and q, and the page
// lists LATEST_POSTS_QUERY. From 4: FEATURED_POST_QUERY (unless filtered) and
// BLOG_FILTER_ROWS_QUERY, then BLOG_INDEX_QUERY and BLOG_COUNT_QUERY with
// $exclude = blogExclude(view, featured) and offset = (page - 1) * BLOG_PAGE_SIZE (6).

export async function generateMetadata({ searchParams }: { searchParams: Promise<BlogIndexParams> }) {
  const { page, category, tag, q } = await searchParams;
  const { published, view, total } = await loadIndex(page, category, tag, q);
  const totalPages = view.few ? 1 : Math.ceil(total / BLOG_PAGE_SIZE);
  return pageMetadata({
    title: 'News & Insights',
    description: DESCRIPTION,
    // A filtered or searched view canonicalises to /blog, whatever its page number; a later page of
    // the whole list canonicalises to itself. Below 4 posts the view is always page 1, unfiltered.
    path: blogIndexPath({ page: view.page, category: view.category, tag: view.tag, q: view.search }),
    noindex: published === 0 || (q?.trim() ?? '') !== '',
    pagination: {
      previous: view.page > 1 ? blogIndexHref(view, view.page - 1) : undefined,
      next: view.page < totalPages ? blogIndexHref(view, view.page + 1) : undefined,
    },
  });
}
```
`pagination` is a `Metadata` field in its own right, not nested inside `alternates`; Next.js renders `<link rel="prev">` and `<link rel="next">` from it.

**With no live posts:** `/blog` is `noindex, follow`, the sitemap leaves out `/blog` until the first post is live (`src/app/sitemap.ts`), and the home page's `WebSite` JSON-LD carries its `SearchAction` (which targets `/blog?q=`) only when a live post exists. A search result page (`q` set) is `noindex, follow` too, whatever it finds, with its canonical pointing at plain `/blog`. Publishing a post fires the webhook, which refreshes `/`, the post's own page and the sitemap at once; `/blog` needs none of that, since it renders per request and always shows the current live posts. A post that only goes live because its scheduled date has passed reaches `/`, its own page and the sitemap at the next hourly refresh instead, though `/blog` already lists it. Documented, not fixed: if that post's own address was opened before its date, the cached 404 from then can outlast the date by up to the same hour, so a card `/blog` already shows can still lead to a 404 until the page's own revalidate catches up (see "ISR + Sanity webhook" above).
UI as built: page number chips with Prev and Next at the bottom of the grid, at every width, all `Chip` links, wrapping on a phone, with a window of numbers past 7 pages (`BlogPagination`; see Pagination above). There is no Load more, on mobile or anywhere else.


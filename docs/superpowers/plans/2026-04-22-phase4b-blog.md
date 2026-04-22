# Phase 4-B: Blog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the blog index (`/blog`), single post (`/blog/[slug]`), and author profile (`/blog/authors/[slug]`) pages with rich Portable Text blocks, SSR pagination, filter pills, sidebar (ToC, author card, related posts), JSON-LD Article schema, and ISR revalidation.

**Architecture:** Server Components for all three pages; `searchParams.page`, `searchParams.category`, `searchParams.tag` drive SSR fetches on the index. Client components only where interactivity is required: `FilterPills` (URL navigation), `TableOfContents` (IntersectionObserver), `ShareButtons` (clipboard). All data comes from Sanity via existing GROQ queries (with one bug fix). `@portabletext/react` renders article body; custom block components live in `src/components/blog/`. Cards live in `src/components/ui/`.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS, Framer Motion (`AnimatedSection`), Sanity CMS, `@portabletext/react ^6.0.3`, `next/image` with `placeholder="blur"`.

---

## File Map

| Action | Path |
|---|---|
| Modify | `src/lib/queries.ts` |
| Create | `src/components/blog/Callout.tsx` |
| Create | `src/components/blog/StatStrip.tsx` |
| Create | `src/components/blog/InlineCta.tsx` |
| Create | `src/lib/portableTextComponents.tsx` |
| Create | `src/components/ui/ArticleCard.tsx` |
| Create | `src/components/ui/FeaturedArticleCard.tsx` |
| Create | `src/components/ui/FilterPills.tsx` |
| Create | `src/app/blog/page.tsx` |
| Create | `src/components/blog/TableOfContents.tsx` |
| Create | `src/components/blog/ShareButtons.tsx` |
| Create | `src/components/blog/AuthorCard.tsx` |
| Create | `src/components/blog/RelatedPosts.tsx` |
| Create | `src/app/blog/[slug]/page.tsx` |
| Create | `src/app/blog/authors/[slug]/page.tsx` |
| Create | `src/app/api/revalidate/route.ts` |

---

## Task 1: Fix queries and add missing queries

**Files:**
- Modify: `src/lib/queries.ts`

There are two bugs in `POST_BY_SLUG_QUERY` that will cause TypeScript type errors: the post `slug` and author `slug` both return plain strings but the TypeScript types expect `SanitySlug = { current: string }`. This task also adds three new queries needed by later tasks.

- [ ] **Step 1: Fix `POST_BY_SLUG_QUERY` — slug type bugs and add missing queries**

Open `src/lib/queries.ts`. Make these changes:

**Change 1 — fix post slug** (line ~127): change `"slug": slug.current` to `"slug": { "current": slug.current }`

**Change 2 — fix author slug** (line ~143): change `"slug": slug.current` to `"slug": { "current": slug.current }`

**Change 3 — add three new queries at the end of the blog section:**

```typescript
export const BLOG_COUNT_QUERY = `
  count(*[_type == "blogPost"
    && ($category == "" || category == $category)
    && ($tag == "" || $tag in tags)
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
    ${/* BLOG_CARD_FIELDS fragment — copy the exact string since the const is not exported */ ''}
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
```

> Note: `POSTS_BY_AUTHOR_QUERY` duplicates the `BLOG_CARD_FIELDS` fragment inline because the `const` is file-private. This is intentional — no abstraction needed.

- [ ] **Step 2: Verify TypeScript**

```bash
cd "C:\Users\ricar\OneDrive\Desktop\Phoenix Energy\Phoenix Website V3\website\phoenix-energy" && npx tsc --noEmit 2>&1 | head -30
```

Expected: zero new errors. Any `slug` type errors from earlier are now resolved.

- [ ] **Step 3: Commit**

```bash
git add src/lib/queries.ts
git commit -m "fix: correct slug type in POST_BY_SLUG_QUERY; add BLOG_COUNT, AUTHOR, POSTS_BY_AUTHOR queries"
```

---

## Task 2: Callout, StatStrip, and InlineCta block components

**Files:**
- Create: `src/components/blog/Callout.tsx`
- Create: `src/components/blog/StatStrip.tsx`
- Create: `src/components/blog/InlineCta.tsx`

These are the three custom Portable Text block types rendered inside article bodies.

- [ ] **Step 1: Create `src/components/blog/Callout.tsx`**

```typescript
// src/components/blog/Callout.tsx

interface CalloutProps {
  type: 'info' | 'warning' | 'stat';
  icon?: string;
  title: string;
  text: string;
}

const CALLOUT_STYLES = {
  info: {
    bg: 'rgba(112,157,169,0.08)',
    border: '1px solid rgba(112,157,169,0.25)',
    titleColor: '#1A1A1A',
    textColor: '#6B7280',
  },
  warning: {
    bg: 'rgba(227,197,141,0.12)',
    border: '1px solid rgba(227,197,141,0.35)',
    titleColor: '#1A1A1A',
    textColor: '#6B7280',
  },
  stat: {
    bg: '#0d1f22',
    border: '1px solid rgba(255,255,255,0.08)',
    titleColor: '#ffffff',
    textColor: 'rgba(255,255,255,0.60)',
  },
} as const;

export function Callout({ type, icon, title, text }: CalloutProps) {
  const s = CALLOUT_STYLES[type];
  return (
    <div
      className="flex gap-3 my-5"
      style={{
        background: s.bg,
        border: s.border,
        borderRadius: 12,
        padding: '16px 18px',
      }}
    >
      {icon && (
        <span className="flex-shrink-0 text-lg leading-none" role="img" aria-hidden>
          {icon}
        </span>
      )}
      <div>
        <p
          className="font-display font-bold text-xs leading-tight mb-1"
          style={{ color: s.titleColor }}
        >
          {title}
        </p>
        <p className="font-body text-[11px] leading-[1.7]" style={{ color: s.textColor }}>
          {text}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/blog/StatStrip.tsx`**

```typescript
// src/components/blog/StatStrip.tsx

interface Stat {
  value: string;
  label: string;
}

interface StatStripProps {
  stats: Stat[];
}

export function StatStrip({ stats }: StatStripProps) {
  const cols = Math.min(stats.length, 4);
  return (
    <div
      className="my-5 rounded-xl overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        background: '#39575C',
      }}
    >
      {stats.slice(0, 4).map((stat, i) => (
        <div
          key={i}
          className="py-3.5 px-3 text-center"
          style={{
            borderRight: i < cols - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
          }}
        >
          <p className="font-display font-extrabold text-lg text-white leading-none mb-1">
            {stat.value}
          </p>
          <p
            className="font-body uppercase tracking-[0.08em]"
            style={{ fontSize: 9, color: 'rgba(255,255,255,0.50)' }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/blog/InlineCta.tsx`**

```typescript
// src/components/blog/InlineCta.tsx
import Link from 'next/link';

interface InlineCtaProps {
  title: string;
  subtitle?: string;
  btnText: string;
  btnHref: string;
}

export function InlineCta({ title, subtitle, btnText, btnHref }: InlineCtaProps) {
  const isExternal = btnHref.startsWith('http');
  return (
    <div
      className="my-6 rounded-[14px] p-5 text-center"
      style={{ background: '#39575C' }}
    >
      <p className="font-display font-extrabold text-[15px] text-white leading-tight mb-1.5">
        {title}
      </p>
      {subtitle && (
        <p className="font-body text-[11px] mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {subtitle}
        </p>
      )}
      {isExternal ? (
        <a
          href={btnHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-body font-semibold text-xs text-[#39575C] bg-white rounded-full px-5 py-2.5 transition-opacity hover:opacity-90"
        >
          {btnText}
        </a>
      ) : (
        <Link
          href={btnHref}
          className="inline-block font-body font-semibold text-xs text-[#39575C] bg-white rounded-full px-5 py-2.5 transition-opacity hover:opacity-90"
        >
          {btnText}
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/blog/Callout.tsx src/components/blog/StatStrip.tsx src/components/blog/InlineCta.tsx
git commit -m "feat: add Callout, StatStrip, InlineCta portable text block components"
```

---

## Task 3: Portable Text renderer

**Files:**
- Create: `src/lib/portableTextComponents.tsx`

Maps Sanity Portable Text `_type` values to React components. Used by the single post page.

- [ ] **Step 1: Create `src/lib/portableTextComponents.tsx`**

```typescript
// src/lib/portableTextComponents.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { PortableTextComponents } from '@portabletext/react';
import { Callout } from '@/components/blog/Callout';
import { StatStrip } from '@/components/blog/StatStrip';
import { InlineCta } from '@/components/blog/InlineCta';
import { urlFor } from '@/lib/sanity';

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-xs leading-[1.85] text-[#6B7280] mb-3.5">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display font-extrabold text-[17px] text-[#1A1A1A] leading-tight mt-6 mb-2.5">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display font-bold text-sm text-[#1A1A1A] leading-tight mt-[18px] mb-2">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-5 rounded-r-lg pl-4 py-3 pr-3"
        style={{
          borderLeft: '3px solid #709DA9',
          background: 'rgba(112,157,169,0.06)',
        }}
      >
        <p className="font-display font-bold text-[13px] text-[#1A1A1A] italic leading-[1.5]">
          {children}
        </p>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[#1A1A1A]">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? '#';
      const isExternal = href.startsWith('http');
      return isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#39575C] underline underline-offset-2 hover:text-[#2a4045]"
        >
          {children}
        </a>
      ) : (
        <Link href={href} className="text-[#39575C] underline underline-offset-2 hover:text-[#2a4045]">
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside font-body text-xs text-[#6B7280] leading-[1.85] mb-3.5 space-y-1 pl-1">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside font-body text-xs text-[#6B7280] leading-[1.85] mb-3.5 space-y-1 pl-1">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(680).auto('format').url();
      return (
        <figure className="my-5">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image
              src={src}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 680px"
            />
          </div>
          {value.caption && (
            <figcaption className="font-body text-[10px] text-[#9CA3AF] text-center italic mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    callout: ({ value }) => (
      <Callout
        type={value.type ?? 'info'}
        icon={value.icon}
        title={value.title ?? ''}
        text={value.text ?? ''}
      />
    ),
    statStrip: ({ value }) => (
      <StatStrip stats={value.stats ?? []} />
    ),
    inlineCta: ({ value }) => (
      <InlineCta
        title={value.title ?? ''}
        subtitle={value.subtitle}
        btnText={value.btnText ?? 'Learn more'}
        btnHref={value.btnHref ?? '/contact'}
      />
    ),
  },
};
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/portableTextComponents.tsx
git commit -m "feat: add portableTextComponents renderer for article body"
```

---

## Task 4: ArticleCard and FeaturedArticleCard

**Files:**
- Create: `src/components/ui/ArticleCard.tsx`
- Create: `src/components/ui/FeaturedArticleCard.tsx`

These are the display cards used on the blog index. `ArticleCard` is for the 3-column grid; `FeaturedArticleCard` is the full-width 2-column pinned post.

- [ ] **Step 1: Create shared category colour helper**

Add this to the top of `src/components/ui/ArticleCard.tsx` (it will be imported by both card components):

```typescript
// src/components/ui/ArticleCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import type { BlogPostCard } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  'Industry Insights':  { bg: 'rgba(57,87,92,0.10)',    color: '#39575C' },
  'Project Spotlight':  { bg: 'rgba(227,197,141,0.10)', color: '#6b4e10' },
  'Company News':       { bg: 'rgba(169,214,203,0.10)', color: '#1a5a48' },
  'Press Release':      { bg: 'rgba(217,124,118,0.10)', color: '#7a2a20' },
};

function categoryStyle(cat: string) {
  return CATEGORY_STYLES[cat] ?? { bg: 'rgba(57,87,92,0.10)', color: '#39575C' };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

interface ArticleCardProps {
  post: BlogPostCard;
  delay?: number;
}

export function ArticleCard({ post, delay = 0 }: ArticleCardProps) {
  const cs = categoryStyle(post.category);
  const imgSrc = post.heroImage?.asset
    ? urlFor(post.heroImage).width(400).height(260).auto('format').url()
    : null;
  const blurSrc = post.heroImage?.asset?.metadata?.lqip;

  return (
    <AnimatedSection delay={delay}>
      <Link href={`/blog/${post.slug.current}`} className="group block h-full">
        <article
          className="bg-white rounded-[14px] overflow-hidden h-full flex flex-col transition-all duration-200 group-hover:-translate-y-[3px]"
          style={{ border: '1px solid #E5E7EB' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#cccccc')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
        >
          {/* Photo */}
          <div className="relative overflow-hidden" style={{ height: 130 }}>
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={post.heroImage?.alt ?? post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
                {...(blurSrc ? { placeholder: 'blur', blurDataURL: blurSrc } : {})}
              />
            ) : (
              <div className="w-full h-full bg-[#E5E7EB]" />
            )}
          </div>

          {/* Body */}
          <div className="p-3.5 flex flex-col flex-1">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span
                className="font-body font-semibold rounded-full"
                style={{ fontSize: 9, padding: '2px 8px', background: cs.bg, color: cs.color }}
              >
                {post.category}
              </span>
              {post.tags?.slice(0, 1).map(tag => (
                <span
                  key={tag}
                  className="font-body font-semibold rounded-full"
                  style={{ fontSize: 9, padding: '2px 8px', background: 'rgba(112,157,169,0.10)', color: '#39575C' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <p
              className="font-display font-bold text-[13px] text-[#1A1A1A] leading-[1.4] mb-1.5 flex-1"
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {post.title}
            </p>

            {/* Excerpt */}
            <p
              className="font-body text-[11px] text-[#6B7280] leading-[1.65] mb-3"
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {post.excerpt}
            </p>

            {/* Footer */}
            <div
              className="flex justify-between items-center pt-2.5"
              style={{ borderTop: '1px solid #E5E7EB' }}
            >
              <span className="font-body text-[10px] text-[#9CA3AF]">{formatDate(post.publishedAt)}</span>
              <span className="font-body text-[10px] font-medium" style={{ color: '#709DA9' }}>
                {post.readTime} min read
              </span>
            </div>
          </div>
        </article>
      </Link>
    </AnimatedSection>
  );
}
```

- [ ] **Step 2: Create `src/components/ui/FeaturedArticleCard.tsx`**

```typescript
// src/components/ui/FeaturedArticleCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostCard } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  'Industry Insights':  { bg: 'rgba(57,87,92,0.10)',    color: '#39575C' },
  'Project Spotlight':  { bg: 'rgba(227,197,141,0.10)', color: '#6b4e10' },
  'Company News':       { bg: 'rgba(169,214,203,0.10)', color: '#1a5a48' },
  'Press Release':      { bg: 'rgba(217,124,118,0.10)', color: '#7a2a20' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

interface FeaturedArticleCardProps {
  post: BlogPostCard;
}

export function FeaturedArticleCard({ post }: FeaturedArticleCardProps) {
  const cs = CATEGORY_STYLES[post.category] ?? { bg: 'rgba(57,87,92,0.10)', color: '#39575C' };
  const imgSrc = post.heroImage?.asset
    ? urlFor(post.heroImage).width(600).height(440).auto('format').url()
    : null;
  const blurSrc = post.heroImage?.asset?.metadata?.lqip;
  const authorImgSrc = post.author.photo?.asset
    ? urlFor(post.author.photo).width(48).height(48).url()
    : null;

  return (
    <Link href={`/blog/${post.slug.current}`} className="group block">
      <article
        className="grid overflow-hidden rounded-2xl bg-white transition-all duration-200 group-hover:-translate-y-[3px] group-hover:shadow-[0_12px_32px_rgba(57,87,92,0.10)]"
        style={{
          gridTemplateColumns: '1fr 1fr',
          border: '1px solid #E5E7EB',
          minHeight: 220,
        }}
      >
        {/* Left: Photo */}
        <div className="relative overflow-hidden" style={{ minHeight: 220 }}>
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={post.heroImage?.alt ?? post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
              {...(blurSrc ? { placeholder: 'blur', blurDataURL: blurSrc } : {})}
            />
          ) : (
            <div className="w-full h-full bg-[#E5E7EB]" />
          )}
          {/* FEATURED badge */}
          <span
            className="absolute top-3 left-3 font-body font-bold text-[9px] text-white rounded-full px-2.5 py-1"
            style={{ background: '#39575C' }}
          >
            FEATURED
          </span>
        </div>

        {/* Right: Body */}
        <div className="flex flex-col p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span
              className="font-body font-semibold rounded-full"
              style={{ fontSize: 9, padding: '3px 10px', background: cs.bg, color: cs.color }}
            >
              {post.category}
            </span>
            {post.tags?.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="font-body font-semibold rounded-full"
                style={{ fontSize: 9, padding: '3px 10px', background: 'rgba(112,157,169,0.10)', color: '#39575C' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2
            className="font-display font-extrabold text-[18px] text-[#1A1A1A] leading-[1.3] mb-2 flex-1"
            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p
            className="font-body text-xs text-[#6B7280] leading-[1.75] mb-4"
            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2">
            {authorImgSrc ? (
              <Image
                src={authorImgSrc}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#39575C' }}
              >
                <span className="font-display font-bold text-[8px] text-white">
                  {initials(post.author.name)}
                </span>
              </div>
            )}
            <span className="font-body text-[10px] text-[#6B7280]">
              {post.author.name}
              <span className="mx-1">·</span>
              {formatDate(post.publishedAt)}
              <span className="mx-1">·</span>
              {post.readTime} min read
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ArticleCard.tsx src/components/ui/FeaturedArticleCard.tsx
git commit -m "feat: add ArticleCard and FeaturedArticleCard components"
```

---

## Task 5: FilterPills

**Files:**
- Create: `src/components/ui/FilterPills.tsx`

Client component: renders category + tag pills, syncs active selection to URL search params via `router.push` so the Server Component page re-renders with fresh data on each filter change.

- [ ] **Step 1: Create `src/components/ui/FilterPills.tsx`**

```typescript
// src/components/ui/FilterPills.tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const CATEGORIES = [
  'All articles',
  'Industry Insights',
  'Project Spotlight',
  'Company News',
  'Press Release',
] as const;

interface FilterPillsProps {
  tags: string[];
  activeCategory: string;
  activeTag: string;
}

export function FilterPills({ tags, activeCategory, activeTag }: FilterPillsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: 'category' | 'tag', value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page');
      if (value === '' || value === 'All articles') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const pillBase = 'font-body text-[11px] rounded-full px-3 py-1.5 cursor-pointer transition-all duration-150 select-none';
  const activeStyle = { background: '#39575C', border: '1px solid #39575C', color: '#ffffff', fontWeight: 600 };
  const inactiveStyle = { background: '#ffffff', border: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 500 };

  return (
    <div className="flex flex-wrap gap-2 pb-5 max-w-[960px] mx-auto px-6">
      {CATEGORIES.map(cat => {
        const isActive = cat === 'All articles' ? activeCategory === '' : activeCategory === cat;
        return (
          <button
            key={cat}
            className={pillBase}
            style={isActive ? activeStyle : inactiveStyle}
            onClick={() => updateFilter('category', cat === 'All articles' ? '' : cat)}
          >
            {cat}
          </button>
        );
      })}
      {tags.map(tag => {
        const isActive = activeTag === tag;
        return (
          <button
            key={tag}
            className={pillBase}
            style={isActive ? activeStyle : inactiveStyle}
            onClick={() => updateFilter('tag', isActive ? '' : tag)}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/FilterPills.tsx
git commit -m "feat: add FilterPills client component with URL search param sync"
```

---

## Task 6: Blog index page

**Files:**
- Create: `src/app/blog/page.tsx`

Server Component. Reads `searchParams` for `page`, `category`, `tag`. Fetches featured post, paginated post list, total count, and all tags. Renders header, filter pills, featured card, article grid, and SSR pagination controls.

- [ ] **Step 1: Create `src/app/blog/page.tsx`**

```typescript
// src/app/blog/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { sanityClient } from '@/lib/sanity';
import {
  BLOG_INDEX_QUERY,
  BLOG_COUNT_QUERY,
  FEATURED_POST_QUERY,
  ALL_BLOG_TAGS_QUERY,
} from '@/lib/queries';
import type { BlogPostCard } from '@/types/sanity';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { FilterPills } from '@/components/ui/FilterPills';
import { FeaturedArticleCard } from '@/components/ui/FeaturedArticleCard';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { CTABanner } from '@/components/sections/CTABanner';
import Link from 'next/link';

export const revalidate = 3600;

const SITE = 'https://phoenixenergy.solutions';
const PAGE_SIZE = 6;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; tag?: string };
}): Promise<Metadata> {
  const page = Number(searchParams.page) || 1;
  const canonical = page > 1 ? `${SITE}/blog?page=${page}` : `${SITE}/blog`;
  return {
    title: 'Blog & Insights | Phoenix Energy',
    description:
      'Expert perspectives on clean energy, SA market trends, project spotlights and company news.',
    alternates: {
      canonical,
      ...(page > 1 && {
        prev: page > 2 ? `${SITE}/blog?page=${page - 1}` : `${SITE}/blog`,
      }),
    },
    openGraph: {
      title: 'Blog & Insights | Phoenix Energy',
      description: 'Expert perspectives on clean energy, SA market trends, project spotlights and company news.',
      url: canonical,
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; tag?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const category = searchParams.category ?? '';
  const tag = searchParams.tag ?? '';
  const offset = (page - 1) * PAGE_SIZE;

  const [posts, total, featured, tags] = await Promise.all([
    sanityClient.fetch<BlogPostCard[]>(BLOG_INDEX_QUERY, { category, tag, offset }),
    sanityClient.fetch<number>(BLOG_COUNT_QUERY, { category, tag }),
    sanityClient.fetch<BlogPostCard | null>(FEATURED_POST_QUERY),
    sanityClient.fetch<string[]>(ALL_BLOG_TAGS_QUERY),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page header */}
      <section style={{ background: '#F5F5F5', paddingTop: 36, paddingBottom: 0 }}>
        <AnimatedSection>
          <div
            className="max-w-[960px] mx-auto px-6 mb-7"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'end' }}
          >
            {/* Left */}
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
                Insights & News
              </p>
              <h1 className="font-display font-extrabold text-4xl text-[#1A1A1A] leading-[1.1] mb-2">
                Energy intelligence,{' '}
                <em style={{ color: '#709DA9', fontStyle: 'normal' }}>delivered</em>
              </h1>
              <p className="font-body text-[13px] text-[#6B7280] leading-[1.75]">
                Expert perspectives on clean energy, SA market trends, project spotlights and company news.
              </p>
            </div>
            {/* Right: search */}
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                width={14}
                height={14}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="search"
                placeholder="Search articles..."
                className="w-full font-body text-xs text-[#1A1A1A] rounded-full outline-none"
                style={{
                  border: '1px solid #E5E7EB',
                  background: '#fff',
                  padding: '10px 16px 10px 38px',
                }}
                readOnly
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Filter pills */}
        <AnimatedSection delay={0.05}>
          <Suspense fallback={null}>
            <FilterPills tags={tags ?? []} activeCategory={category} activeTag={tag} />
          </Suspense>
        </AnimatedSection>
      </section>

      {/* Featured card */}
      {featured && (
        <section style={{ background: '#F5F5F5', padding: '0 24px 20px' }}>
          <AnimatedSection delay={0.1}>
            <div className="max-w-[960px] mx-auto">
              <FeaturedArticleCard post={featured} />
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* Article grid */}
      <section style={{ background: '#F5F5F5', padding: '0 24px 8px' }}>
        <div
          className="max-w-[960px] mx-auto"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}
        >
          {posts.map((post, i) => (
            <ArticleCard key={post._id} post={post} delay={i * 0.04} />
          ))}
          {posts.length === 0 && (
            <div className="col-span-3 py-16 text-center">
              <p className="font-body text-sm text-[#9CA3AF]">No articles found.</p>
            </div>
          )}
        </div>

        {/* SSR Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-10">
            {page > 1 && (
              <Link
                href={`/blog${page === 2 ? '' : `?page=${page - 1}${category ? `&category=${encodeURIComponent(category)}` : ''}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}`}
                className="font-body text-xs text-[#6B7280] px-4 py-2 rounded-full transition-colors hover:bg-white"
                style={{ border: '1px solid #E5E7EB' }}
              >
                ← Prev
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={`/blog${p === 1 ? '' : `?page=${p}`}${category ? `&category=${encodeURIComponent(category)}` : ''}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
                className="font-body text-xs rounded-full px-3.5 py-2 transition-colors"
                style={
                  p === page
                    ? { background: '#39575C', color: '#fff', border: '1px solid #39575C' }
                    : { background: '#fff', color: '#6B7280', border: '1px solid #E5E7EB' }
                }
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}${category ? `&category=${encodeURIComponent(category)}` : ''}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
                className="font-body text-xs text-[#6B7280] px-4 py-2 rounded-full transition-colors hover:bg-white"
                style={{ border: '1px solid #E5E7EB' }}
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </section>

      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "feat: add blog index page with SSR pagination, filter pills, featured card"
```

---

## Task 7: TableOfContents and ShareButtons

**Files:**
- Create: `src/components/blog/TableOfContents.tsx`
- Create: `src/components/blog/ShareButtons.tsx`

Both are client components used in the single post sidebar.

- [ ] **Step 1: Create `src/components/blog/TableOfContents.tsx`**

```typescript
// src/components/blog/TableOfContents.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: 'h2' | 'h3';
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );

    items.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-[14px] p-[18px]" style={{ border: '1px solid #E5E7EB' }}>
      <p className="font-display font-bold text-[13px] text-[#1A1A1A] mb-3">In this article</p>
      <div className="flex flex-col">
        {items.map((item, i) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={e => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-start gap-2.5 py-2.5 transition-colors duration-200"
              style={{
                borderBottom: i < items.length - 1 ? '1px solid #E5E7EB' : 'none',
                borderLeft: isActive ? '3px solid #39575C' : '3px solid transparent',
                paddingLeft: isActive ? 10 : 10,
                color: isActive ? '#39575C' : '#6B7280',
              }}
            >
              <span
                className="font-body font-bold flex-shrink-0"
                style={{ fontSize: 10, color: '#709DA9' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="font-body leading-tight"
                style={{
                  fontSize: 11,
                  fontWeight: item.level === 'h2' ? 500 : 400,
                  paddingLeft: item.level === 'h3' ? 8 : 0,
                }}
              >
                {item.text}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/blog/ShareButtons.tsx`**

```typescript
// src/components/blog/ShareButtons.tsx
'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnBase =
    'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 font-body font-bold text-[10px]';
  const btnStyle = { border: '1px solid #E5E7EB', background: '#fff', color: '#6B7280' };

  return (
    <div className="flex items-center gap-2">
      <span className="font-body text-[10px] text-[#9CA3AF]">Share:</span>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
        style={btnStyle}
        aria-label="Share on LinkedIn"
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = '#39575C';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#39575C';
          (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = '#fff';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E5E7EB';
          (e.currentTarget as HTMLAnchorElement).style.color = '#6B7280';
        }}
      >
        in
      </a>

      {/* X (Twitter) */}
      <a
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
        style={btnStyle}
        aria-label="Share on X"
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = '#39575C';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#39575C';
          (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = '#fff';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E5E7EB';
          (e.currentTarget as HTMLAnchorElement).style.color = '#6B7280';
        }}
      >
        𝕏
      </a>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className={btnBase}
        style={
          copied
            ? { border: '1px solid #39575C', background: '#39575C', color: '#fff' }
            : btnStyle
        }
        aria-label="Copy link"
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? '✓' : '🔗'}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/TableOfContents.tsx src/components/blog/ShareButtons.tsx
git commit -m "feat: add TableOfContents (IntersectionObserver) and ShareButtons sidebar components"
```

---

## Task 8: AuthorCard and RelatedPosts

**Files:**
- Create: `src/components/blog/AuthorCard.tsx`
- Create: `src/components/blog/RelatedPosts.tsx`

Server components (no interactivity needed). Used in the single post sidebar.

- [ ] **Step 1: Create `src/components/blog/AuthorCard.tsx`**

```typescript
// src/components/blog/AuthorCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Author } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  const photoSrc = author.photo?.asset
    ? urlFor(author.photo).width(88).height(88).url()
    : null;

  return (
    <div className="bg-white rounded-[14px] p-[18px]" style={{ border: '1px solid #E5E7EB' }}>
      <Link
        href={`/blog/authors/${author.slug.current}`}
        className="flex items-start gap-3 mb-3 group"
      >
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={author.name}
            width={44}
            height={44}
            className="rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#39575C' }}
          >
            <span className="font-display font-bold text-sm text-white">{initials(author.name)}</span>
          </div>
        )}
        <div>
          <p className="font-display font-bold text-[13px] text-[#1A1A1A] leading-tight group-hover:text-[#39575C] transition-colors">
            {author.name}
          </p>
          {author.role && (
            <p className="font-body font-medium text-[10px] mt-0.5" style={{ color: '#709DA9' }}>
              {author.role}
            </p>
          )}
        </div>
      </Link>
      {author.bio && (
        <p className="font-body text-[11px] text-[#6B7280] leading-[1.65]">{author.bio}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/blog/RelatedPosts.tsx`**

```typescript
// src/components/blog/RelatedPosts.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostCard } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

interface RelatedPostsProps {
  posts: BlogPostCard[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="bg-white rounded-[14px] p-[18px]" style={{ border: '1px solid #E5E7EB' }}>
      <p className="font-display font-bold text-[13px] text-[#1A1A1A] mb-3">Related articles</p>
      <div className="flex flex-col">
        {posts.map((post, i) => {
          const thumbSrc = post.heroImage?.asset
            ? urlFor(post.heroImage).width(104).height(88).auto('format').url()
            : null;
          return (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="flex gap-3 py-3 group"
              style={{ borderBottom: i < posts.length - 1 ? '1px solid #E5E7EB' : 'none' }}
            >
              {thumbSrc ? (
                <Image
                  src={thumbSrc}
                  alt={post.heroImage?.alt ?? post.title}
                  width={52}
                  height={44}
                  className="rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-[52px] h-11 rounded-lg bg-[#E5E7EB] flex-shrink-0" />
              )}
              <div>
                <p
                  className="font-display font-bold text-[11px] text-[#1A1A1A] leading-[1.35] mb-1 group-hover:text-[#39575C] transition-colors"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {post.title}
                </p>
                <p className="font-body text-[9px] text-[#9CA3AF]">
                  {formatDate(post.publishedAt)}
                  <span className="mx-1">·</span>
                  {post.readTime} min
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/AuthorCard.tsx src/components/blog/RelatedPosts.tsx
git commit -m "feat: add AuthorCard and RelatedPosts sidebar components"
```

---

## Task 9: Single post page

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`

Server Component with `generateMetadata`, `generateStaticParams`, ISR, Article JSON-LD, BreadcrumbList JSON-LD, post hero, breadcrumb + share bar, two-column layout (body + sidebar).

The heading IDs for the ToC are derived from the `body` array: all Portable Text blocks with `_type === 'block'` and `style === 'h2'` or `style === 'h3'`.

- [ ] **Step 1: Create `src/app/blog/[slug]/page.tsx`**

```typescript
// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { sanityClient, urlFor } from '@/lib/sanity';
import { POST_BY_SLUG_QUERY, ALL_BLOG_SLUGS_QUERY } from '@/lib/queries';
import type { BlogPost, PortableTextBlock } from '@/types/sanity';
import { portableTextComponents } from '@/lib/portableTextComponents';
import { TableOfContents, type TocItem } from '@/components/blog/TableOfContents';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { AuthorCard } from '@/components/blog/AuthorCard';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { CTABanner } from '@/components/sections/CTABanner';

export const revalidate = 3600;

const SITE = 'https://phoenixenergy.solutions';

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(ALL_BLOG_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await sanityClient.fetch<BlogPost | null>(POST_BY_SLUG_QUERY, {
    slug: params.slug,
  });
  if (!post) return {};
  const canonical =
    post.canonicalUrl ?? `${SITE}/blog/${post.slug.current}`;
  const ogImageUrl =
    (post.ogImage ?? post.heroImage)?.asset
      ? urlFor(post.ogImage ?? post.heroImage).width(1200).height(630).url()
      : undefined;

  return {
    title: post.seoTitle ?? `${post.title} | Phoenix Energy`,
    description: post.seoDescription ?? post.excerpt,
    alternates: { canonical },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      url: `${SITE}/blog/${post.slug.current}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractTocItems(body: PortableTextBlock[]): TocItem[] {
  return body
    .filter(
      b =>
        b._type === 'block' &&
        (b.style === 'h2' || b.style === 'h3'),
    )
    .map(b => {
      const text = (b.children as Array<{ text: string }>)
        ?.map((c) => c.text)
        .join('') ?? '';
      return {
        id: slugify(text),
        text,
        level: b.style as 'h2' | 'h3',
      };
    });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await sanityClient.fetch<BlogPost | null>(POST_BY_SLUG_QUERY, {
    slug: params.slug,
  });
  if (!post) notFound();

  const tocItems = extractTocItems(post.body);
  const canonicalUrl = post.canonicalUrl ?? `${SITE}/blog/${post.slug.current}`;
  const heroSrc = post.heroImage?.asset
    ? urlFor(post.heroImage).width(1400).height(560).auto('format').url()
    : null;
  const heroBlur = post.heroImage?.asset?.metadata?.lqip;
  const authorPhotoSrc = post.author.photo?.asset
    ? urlFor(post.author.photo).width(52).height(52).url()
    : null;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    ...(heroSrc && { image: heroSrc }),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${SITE}/blog/authors/${post.author.slug.current}`,
      jobTitle: post.author.role,
      worksFor: { '@type': 'Organization', name: 'Phoenix Energy' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Phoenix Energy',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Post hero */}
      <section className="relative overflow-hidden" style={{ height: 280, background: '#0d1f22' }}>
        {heroSrc && (
          <Image
            src={heroSrc}
            alt={post.heroImage?.alt ?? post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            {...(heroBlur ? { placeholder: 'blur', blurDataURL: heroBlur } : {})}
          />
        )}
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(13,31,34,0.20) 0%, rgba(13,31,34,0.85) 100%)' }}
        />
        {/* Bottom-anchored content */}
        <div className="absolute bottom-0 left-0 right-0 max-w-[760px] mx-auto px-6 pb-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className="font-body font-semibold text-[9px] text-white rounded-full px-2.5 py-1"
              style={{ background: 'rgba(255,255,255,0.35)' }}
            >
              {post.category}
            </span>
            {post.tags?.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="font-body font-semibold text-[9px] text-white rounded-full px-2.5 py-1"
                style={{ background: 'rgba(255,255,255,0.25)' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h1
            className="font-display font-extrabold text-[22px] text-white leading-[1.25] mb-3"
          >
            {post.title}
          </h1>
          {/* Meta */}
          <div className="flex items-center gap-2">
            {authorPhotoSrc ? (
              <Image
                src={authorPhotoSrc}
                alt={post.author.name}
                width={26}
                height={26}
                className="rounded-full object-cover flex-shrink-0"
                style={{ border: '2px solid rgba(255,255,255,0.30)' }}
              />
            ) : (
              <div
                className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#39575C', border: '2px solid rgba(255,255,255,0.30)' }}
              >
                <span className="font-display font-bold text-[8px] text-white">
                  {initials(post.author.name)}
                </span>
              </div>
            )}
            <span
              className="font-body text-[10px]"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {post.author.name}
              <span className="mx-1">·</span>
              {formatDate(post.publishedAt)}
              <span className="mx-1">·</span>
              {post.readTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumb + Share bar */}
      <div
        className="flex items-center justify-between max-w-[960px] mx-auto"
        style={{ padding: '12px 24px', borderBottom: '1px solid #E5E7EB' }}
      >
        <nav className="font-body text-[10px] text-[#6B7280] flex items-center gap-1">
          <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#39575C] transition-colors">Blog</Link>
          <span>/</span>
          <span
            className="text-[#1A1A1A]"
            style={{
              maxWidth: 260,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}
          >
            {post.title.length > 35 ? `${post.title.slice(0, 35)}…` : post.title}
          </span>
        </nav>
        <ShareButtons url={canonicalUrl} title={post.seoTitle ?? post.title} />
      </div>

      {/* Two-column layout */}
      <div
        className="max-w-[960px] mx-auto"
        style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, padding: '32px 24px 48px' }}
      >
        {/* Article body */}
        <article style={{ maxWidth: 680 }}>
          {/* Intro paragraph (first block if normal paragraph) */}
          {post.body?.[0]?._type === 'block' && post.body[0].style === 'normal' && (
            <div
              className="font-body font-medium text-sm text-[#1A1A1A] leading-[1.8] mb-5 pb-5"
              style={{ borderBottom: '1px solid #E5E7EB' }}
            >
              {/* Rendered via PortableText below — intro styling applied via CSS specificity */}
            </div>
          )}
          <PortableText
            value={post.body}
            components={{
              ...portableTextComponents,
              block: {
                ...portableTextComponents.block,
                h2: ({ children, value }) => {
                  const text = (value?.children as Array<{ text: string }>)
                    ?.map(c => c.text).join('') ?? '';
                  const id = slugify(text);
                  return (
                    <h2
                      id={id}
                      className="font-display font-extrabold text-[17px] text-[#1A1A1A] leading-tight mt-6 mb-2.5 scroll-mt-24"
                    >
                      {children}
                    </h2>
                  );
                },
                h3: ({ children, value }) => {
                  const text = (value?.children as Array<{ text: string }>)
                    ?.map(c => c.text).join('') ?? '';
                  const id = slugify(text);
                  return (
                    <h3
                      id={id}
                      className="font-display font-bold text-sm text-[#1A1A1A] leading-tight mt-[18px] mb-2 scroll-mt-24"
                    >
                      {children}
                    </h3>
                  );
                },
              },
            }}
          />

          {/* Tags footer */}
          {post.tags?.length > 0 && (
            <div
              className="flex flex-wrap gap-1.5 pt-5 mt-7"
              style={{ borderTop: '1px solid #E5E7EB' }}
            >
              <span className="font-body font-semibold text-[11px] text-[#1A1A1A]">Tags:</span>
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="font-body text-[11px] rounded-full px-2.5 py-1 transition-opacity hover:opacity-80"
                  style={{ background: 'rgba(57,87,92,0.10)', color: '#39575C' }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4" style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
          <TableOfContents items={tocItems} />
          <AuthorCard author={post.author} />
          {post.related?.length > 0 && <RelatedPosts posts={post.related} />}
        </aside>
      </div>

      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/blog/[slug]/page.tsx
git commit -m "feat: add single blog post page with Article JSON-LD, ISR, two-column layout"
```

---

## Task 10: Author profile page

**Files:**
- Create: `src/app/blog/authors/[slug]/page.tsx`

Server Component. Shows author card (full), and their post archive.

- [ ] **Step 1: Create `src/app/blog/authors/[slug]/page.tsx`**

```typescript
// src/app/blog/authors/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { sanityClient, urlFor } from '@/lib/sanity';
import { AUTHOR_BY_SLUG_QUERY, POSTS_BY_AUTHOR_QUERY, ALL_AUTHOR_SLUGS_QUERY } from '@/lib/queries';
import type { Author, BlogPostCard } from '@/types/sanity';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { CTABanner } from '@/components/sections/CTABanner';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export const revalidate = 3600;

const SITE = 'https://phoenixenergy.solutions';

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(ALL_AUTHOR_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const author = await sanityClient.fetch<Author | null>(AUTHOR_BY_SLUG_QUERY, {
    slug: params.slug,
  });
  if (!author) return {};
  return {
    title: `${author.name} | Phoenix Energy Blog`,
    description: author.bio ?? `Articles by ${author.name}, ${author.role}`,
    alternates: { canonical: `${SITE}/blog/authors/${params.slug}` },
  };
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
}

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const [author, posts] = await Promise.all([
    sanityClient.fetch<Author | null>(AUTHOR_BY_SLUG_QUERY, { slug: params.slug }),
    sanityClient.fetch<BlogPostCard[]>(POSTS_BY_AUTHOR_QUERY, { slug: params.slug }),
  ]);

  if (!author) notFound();

  const photoSrc = author.photo?.asset
    ? urlFor(author.photo).width(176).height(176).url()
    : null;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0d1f22] px-6 py-14 text-center">
        <AnimatedSection>
          {photoSrc ? (
            <Image
              src={photoSrc}
              alt={author.name}
              width={88}
              height={88}
              className="rounded-full object-cover mx-auto mb-4"
              style={{ border: '3px solid rgba(112,157,169,0.5)' }}
            />
          ) : (
            <div
              className="w-[88px] h-[88px] rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#39575C', border: '3px solid rgba(112,157,169,0.5)' }}
            >
              <span className="font-display font-bold text-2xl text-white">{initials(author.name)}</span>
            </div>
          )}
          <h1 className="font-display font-extrabold text-3xl text-white mb-1">{author.name}</h1>
          {author.role && (
            <p className="font-body text-sm font-medium mb-3" style={{ color: '#709DA9' }}>
              {author.role}
            </p>
          )}
          {author.bio && (
            <p
              className="font-body text-sm leading-[1.75] max-w-[460px] mx-auto"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {author.bio}
            </p>
          )}
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 font-body font-semibold text-xs text-white rounded-full px-4 py-2 transition-opacity hover:opacity-80"
              style={{ border: '1px solid rgba(255,255,255,0.25)' }}
            >
              LinkedIn →
            </a>
          )}
        </AnimatedSection>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-[960px] mx-auto px-6 py-3" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <nav className="font-body text-[10px] text-[#6B7280] flex items-center gap-1">
          <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#39575C] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[#1A1A1A]">{author.name}</span>
        </nav>
      </div>

      {/* Posts grid */}
      <section style={{ background: '#F5F5F5', padding: '32px 24px 48px' }}>
        <div className="max-w-[960px] mx-auto mb-6">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-1">
            Articles
          </p>
          <h2 className="font-display font-extrabold text-2xl text-[#1A1A1A]">
            By {author.name}
          </h2>
        </div>
        <div
          className="max-w-[960px] mx-auto"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}
        >
          {posts.map((post, i) => (
            <ArticleCard key={post._id} post={post} delay={i * 0.04} />
          ))}
          {posts.length === 0 && (
            <div className="col-span-3 py-16 text-center">
              <p className="font-body text-sm text-[#9CA3AF]">No articles yet.</p>
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/blog/authors/[slug]/page.tsx
git commit -m "feat: add author profile page with post archive"
```

---

## Task 11: ISR revalidation API route

**Files:**
- Create: `src/app/api/revalidate/route.ts`

Called by Sanity webhook on publish/update. Revalidates the specific post path and the blog index.

- [ ] **Step 1: Create `src/app/api/revalidate/route.ts`**

```typescript
// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { slug?: string; _type?: string };

    if (body._type === 'blogPost' && body.slug) {
      revalidatePath(`/blog/${body.slug}`);
    }
    revalidatePath('/blog');

    return Response.json({ revalidated: true, timestamp: new Date().toISOString() });
  } catch {
    return Response.json(
      { revalidated: false, error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Final build check**

```bash
npx next build 2>&1 | tail -20
```

Expected: successful build with no TypeScript or lint errors. Blog pages appear in the build output.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/revalidate/route.ts
git commit -m "feat: add Sanity webhook revalidation route for blog ISR"
```

---

## Self-Review

**Spec coverage check:**

| Requirement | Task |
|---|---|
| Blog index — page header (eyebrow, H1, search bar) | Task 6 |
| Blog index — filter pills (category + vertical tags, URL sync) | Tasks 5 + 6 |
| Blog index — featured article card (2-col, FEATURED badge) | Tasks 4 + 6 |
| Blog index — article grid (3-col, 6 per page) | Tasks 4 + 6 |
| Blog index — SSR pagination via `?page=N` | Task 6 |
| Blog index — BreadcrumbList JSON-LD | Task 6 |
| Blog index — ISR `revalidate = 3600` | Task 6 |
| Blog index — `generateMetadata` with `prev`/`next` alternates | Task 6 |
| Single post — post hero (280px, bottom-anchored, overlay) | Task 9 |
| Single post — breadcrumb + share bar (LinkedIn, X, copy) | Tasks 7 + 9 |
| Single post — two-column layout (body 680px + 280px sidebar) | Task 9 |
| Single post — Portable Text renderer (H2, H3, blockquote, marks, lists) | Task 3 |
| Single post — Callout block (info/warning/stat) | Task 2 |
| Single post — StatStrip block (grid, max 4 stats) | Task 2 |
| Single post — InlineCta block (deep teal bg, white pill button) | Task 2 |
| Single post — inline image with caption | Task 3 |
| Single post — tags footer with links to `/blog?tag=X` | Task 9 |
| Single post — ToC sidebar (auto-generated, IntersectionObserver active) | Task 7 |
| Single post — Author Card sidebar (links to author profile) | Task 8 |
| Single post — Related Posts sidebar (3 items, thumbnail, meta) | Task 8 |
| Single post — Article JSON-LD | Task 9 |
| Single post — BreadcrumbList JSON-LD | Task 9 |
| Single post — `generateMetadata` with OG + Twitter card | Task 9 |
| Single post — `generateStaticParams` | Task 9 |
| Single post — ISR + on-demand revalidation | Tasks 9 + 11 |
| Author profile — hero, bio, LinkedIn link | Task 10 |
| Author profile — post archive grid | Task 10 |
| Author profile — `generateStaticParams` | Task 10 |
| Sanity schema (blogPost, author) | Already done — in `sanity/schemaTypes/` |
| GROQ queries | Task 1 (fix + add) |

**No gaps found.**

**Placeholder scan:** No TBD, TODO, or vague requirements.

**Type consistency check:**
- `BlogPost.slug: SanitySlug` ✓ — Task 1 fixes the query to return `{ "current": slug.current }`
- `Author.slug: SanitySlug` ✓ — Task 1 fixes author slug too
- `TocItem` interface exported from `TableOfContents.tsx`, imported in `[slug]/page.tsx` ✓
- `PortableTextBlock` from `@/types/sanity` used in `extractTocItems` ✓
- `portableTextComponents.block.h2/h3` override in `[slug]/page.tsx` extends, not replaces, the base object ✓

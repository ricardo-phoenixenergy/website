# Phoenix Energy UI/UX Cohesion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce a consistent, token-based UI system across all card components, section padding, the Partners section, and icon usage — eliminating the visual inconsistencies identified in the May 2026 audit.

**Architecture:** Create a shared `Card` base component (`Card`, `CardImage`, `CardBody`, `CardFooter`, `CardArrow`) that all card-like UI elements derive from. Three interaction patterns govern whether cards lift on hover, show shadow only, or have no hover at all. All text arrows (`→`) are replaced with `<IconArrowRight />`. Section padding is standardised to two values site-wide (`py-16 md:py-24` or `py-10 md:py-12`). Card is the group anchor for hover — consuming components wrap it in `<Link className="block">` for Pattern 1 cards, with no special group setup needed.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, `next/image`

**Spec:** `docs/superpowers/specs/2026-05-09-ui-cohesion-design.md`

**Spec correction (documented here):** The spec lists `AboutTeam` member cards as Pattern 1 (full-card link). There is no team member detail page. Corrected to **Pattern 3** (static display — LinkedIn icon stays as a badge inside, no full-card navigation). The "Join the journey" card in AboutTeam has a `<Link>` button inside → **Pattern 2** (shadow-only hover, card is not a link).

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| **Create** | `src/components/ui/Card.tsx` | 5 exports: `Card`, `CardImage`, `CardBody`, `CardFooter`, `CardArrow` |
| **Replace** | `src/components/sections/PartnerCards.tsx` | Static logo strip, eyebrow only, correct sizing |
| **Refactor** | `src/components/sections/ProjectCard.tsx` | Use `Card` base, fix -5px → -4px lift |
| **Refactor** | `src/components/ui/ArticleCard.tsx` | Use `Card` base, fix -5px → -4px lift |
| **Refactor** | `src/components/sections/FeaturedProjectCard.tsx` | Use `Card` as outer shell, swap text `→` |
| **Refactor** | `src/components/ui/FeaturedArticleCard.tsx` | Use `Card` as outer shell |
| **Refactor** | `src/components/sections/Testimonials.tsx` | Pattern 3 (no hover), padding fix |
| **Refactor** | `src/components/sections/AboutValues.tsx` | Dark Pattern 3, remove gradient overlay, padding fix |
| **Refactor** | `src/components/sections/AboutTeam.tsx` | Dark Pattern 3 member cards, padding fix |
| **Refactor** | `src/components/sections/FinancingCards.tsx` | Pattern 2 (shadow-only hover) |
| **Edit** | `src/components/sections/HowItWorks.tsx` | Padding fix, CTA label arrow fix |
| **Edit** | `src/components/ui/SectionCarousel.tsx` | Padding fix, view-all arrow fix |
| **Edit** | `src/components/sections/CTABanner.tsx` | Padding fix |
| **Edit** | `src/components/sections/AboutStory.tsx` | Padding fix |
| **Edit** | `src/components/sections/ProjectGallery.tsx` | Replace `→` in lightbox nav |
| **Edit** | `src/app/blog/page.tsx` | Replace `→` in pagination |
| **Edit** | `src/app/blog/authors/[slug]/page.tsx` | Replace `→` in LinkedIn link |
| **Edit** | `src/components/sections/ContactForm.tsx` | Replace `→` in submit labels |
| **Edit** | `src/components/tools/SoftPaywall.tsx` | Replace `→` in unlock button |
| **Edit** | `src/components/tools/Step1SystemDetails.tsx` | Replace `→` in next button |
| **Edit** | `src/components/tools/Step2Condition.tsx` | Replace `→` in submit button |
| **Edit** | `src/app/solutions/*/page.tsx` (6 files) | Remove `→` from `ctaLabel` strings |

---

## Task 1: Create `src/components/ui/Card.tsx`

**Files:**
- Create: `src/components/ui/Card.tsx`

This is the foundation. All subsequent tasks depend on it. The `Card` component is its own `group` anchor — consuming Pattern 1 components wrap it in `<Link className="block">` for navigation; the hover styles fire on the `Card` element itself.

- [ ] **Step 1: Create the file with all five exports**

```tsx
// src/components/ui/Card.tsx
import Image from 'next/image';
import { IconArrowRight } from './Icons';

const DEFAULT_LQIP =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// ── Card ─────────────────────────────────────────────────────────────
export interface CardProps {
  variant?: 'light' | 'dark';
  /**
   * 1 = full-card link: lift + shadow on hover. Card has `group` class.
   * 2 = button inside: shadow-only hover, card is NOT a link wrapper.
   * 3 = static display: no hover of any kind.
   */
  pattern?: 1 | 2 | 3;
  className?: string;
  children: React.ReactNode;
}

export function Card({ variant = 'light', pattern = 1, className = '', children }: CardProps) {
  const base = 'relative flex flex-col overflow-hidden rounded-2xl transition-all duration-200';

  const variantClass =
    variant === 'light' ? 'bg-white border border-[#E5E7EB]' : 'bg-[#0d1f22]';

  const patternClass =
    pattern === 1
      ? variant === 'light'
        ? 'group cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(57,87,92,0.10)] hover:border-[#cccccc]'
        : 'group cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(13,31,34,0.25)]'
      : pattern === 2
      ? 'cursor-default hover:shadow-[0_4px_16px_rgba(57,87,92,0.07)]'
      : 'cursor-default';

  return (
    <div className={`${base} ${variantClass} ${patternClass} ${className}`}>
      {/* Dark gradient overlay — Pattern 1 dark cards only */}
      {variant === 'dark' && pattern === 1 && (
        <>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-0"
            style={{ background: 'linear-gradient(140deg, #1a4a52 0%, #0f2d33 100%)' }}
          />
          <span
            aria-hidden
            className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-0"
            style={{
              top: -24,
              right: -24,
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(112,157,169,0.25) 0%, transparent 70%)',
            }}
          />
        </>
      )}
      {children}
    </div>
  );
}

// ── CardImage ─────────────────────────────────────────────────────────
export interface CardImageProps {
  /** When omitted, renders placeholderStyle div instead of an image. */
  src?: string;
  alt?: string;
  height?: number;
  blurDataURL?: string;
  sizes?: string;
  priority?: boolean;
  /** CSS background for the placeholder div shown when src is absent. */
  placeholderStyle?: React.CSSProperties;
  /** Badge overlays — use absolute positioning classes on children. */
  children?: React.ReactNode;
}

export function CardImage({
  src,
  alt = '',
  height = 168,
  blurDataURL,
  sizes = '400px',
  priority = false,
  placeholderStyle,
  children,
}: CardImageProps) {
  return (
    <div className="relative overflow-hidden flex-shrink-0 z-10" style={{ height }}>
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            sizes={sizes}
            placeholder="blur"
            blurDataURL={blurDataURL ?? DEFAULT_LQIP}
          />
          {/* Gradient scrim over real image */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(to top, rgba(13,31,34,0.65) 0%, rgba(13,31,34,0.08) 55%, transparent 100%)',
            }}
          />
        </>
      ) : (
        <div
          className="w-full h-full"
          style={placeholderStyle ?? { background: '#E5E7EB' }}
        />
      )}
      {/* Badge slots — rendered above scrim */}
      {children && (
        <div className="absolute inset-0 z-20 pointer-events-none">{children}</div>
      )}
    </div>
  );
}

// ── CardBody ─────────────────────────────────────────────────────────
export interface CardBodyProps {
  /** 'sm' = p-4 (16px). 'lg' = p-6 (24px) for content-heavy cards. */
  padding?: 'sm' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export function CardBody({ padding = 'sm', className = '', children }: CardBodyProps) {
  return (
    <div
      className={`${padding === 'sm' ? 'p-4' : 'p-6'} flex flex-col flex-1 relative z-10 ${className}`}
    >
      {children}
    </div>
  );
}

// ── CardFooter ───────────────────────────────────────────────────────
export interface CardFooterProps {
  variant?: 'light' | 'dark';
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ variant = 'light', className = '', children }: CardFooterProps) {
  return (
    <div
      className={`px-4 py-3 flex items-center justify-between relative z-10 ${
        variant === 'light'
          ? 'border-t border-[#E5E7EB]'
          : 'border-t border-[rgba(255,255,255,0.08)]'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ── CardArrow ─────────────────────────────────────────────────────────
export interface CardArrowProps {
  variant?: 'light' | 'dark';
}

export function CardArrow({ variant = 'light' }: CardArrowProps) {
  if (variant === 'dark') {
    return (
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.4)] group-hover:bg-[#709DA9] group-hover:border-[#709DA9] group-hover:text-white">
        <IconArrowRight size={12} />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-[#39575C] group-hover:border-[#39575C] group-hover:text-white">
      <IconArrowRight size={12} />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Card.tsx
git commit -m "feat(ui): add shared Card base component with CardImage, CardBody, CardFooter, CardArrow"
```

---

## Task 2: Redesign `PartnerCards.tsx`

**Files:**
- Modify: `src/components/sections/PartnerCards.tsx`

Fixes: broken `h-32` sizing → `h-8 w-auto`, adds `page-container`, changes padding to compact token, removes square placeholder.

- [ ] **Step 1: Replace the entire file**

```tsx
// src/components/sections/PartnerCards.tsx
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import type { Partner } from '@/types/sanity';

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

interface PartnerCardsProps {
  partners: Partner[];
}

export function PartnerCards({ partners }: PartnerCardsProps) {
  if (partners.length === 0) return null;

  return (
    <section className="bg-white py-10 md:py-12" style={{ borderBottom: '1px solid #E5E7EB' }}>
      <div className="page-container">
        <AnimatedSection>
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] text-center mb-6">
            Trusted by leading energy businesses
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14">
            {partners.map((p) =>
              p.logo ? (
                <Image
                  key={p._id}
                  src={p.logo.asset.url}
                  alt={p.logo.alt ?? p.name}
                  height={32}
                  width={140}
                  className="h-8 w-auto max-w-[140px] object-contain opacity-50 hover:opacity-80 transition-opacity duration-200"
                />
              ) : (
                <span
                  key={p._id}
                  className="font-body font-bold text-sm text-[#6B7280] opacity-50"
                >
                  {getInitials(p.name)}
                </span>
              )
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/PartnerCards.tsx
git commit -m "fix(partners): correct logo sizing, add page-container, fix padding to compact token"
```

---

## Task 3: Update `ProjectCard.tsx`

**Files:**
- Modify: `src/components/sections/ProjectCard.tsx`

Fixes: lift -5px → -4px (via Card base), removes ad-hoc hover classes, uses `CardImage`/`CardBody`/`CardFooter`/`CardArrow`.

- [ ] **Step 1: Replace the entire file**

```tsx
// src/components/sections/ProjectCard.tsx
import Link from 'next/link';
import { SOLUTION_META } from '@/types/solutions';
import type { ProjectCard as ProjectCardType } from '@/types/sanity';
import { Card, CardImage, CardBody, CardFooter, CardArrow } from '@/components/ui/Card';

type ProjectCardWithMetrics = ProjectCardType & {
  metrics?: { label: string; value: string }[];
};

interface ProjectCardProps {
  project: ProjectCardWithMetrics;
  className?: string;
  onClick?: () => void;
  fluid?: boolean;
}

export function ProjectCard({ project, className, onClick, fluid }: ProjectCardProps) {
  const meta = project.vertical ? SOLUTION_META[project.vertical] : null;
  const cardStyle = !fluid ? { width: 260, flexShrink: 0 } : undefined;

  const inner = (
    <Card variant="light" pattern={1} className={`h-full ${className ?? ''}`}>
      <CardImage
        src={project.heroImage?.asset.url}
        alt={project.heroImage?.alt ?? project.title}
        height={168}
        blurDataURL={project.heroImage?.asset.metadata?.lqip}
        sizes={
          fluid
            ? '(max-width:640px) 100vw, (max-width:768px) 50vw, 33vw'
            : '260px'
        }
        placeholderStyle={
          meta
            ? { background: `linear-gradient(135deg, ${meta.accent}55 0%, ${meta.accent}22 100%)` }
            : { background: '#E5E7EB' }
        }
      >
        {/* Featured badge — top-right */}
        {project.featured && (
          <span
            className="absolute top-3 right-3 font-body font-bold text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full text-white"
            style={{ background: '#39575C' }}
          >
            ★ Featured
          </span>
        )}
        {/* Category badge — bottom-left */}
        {meta && project.vertical && (
          <span
            className="absolute bottom-3 left-3 font-body font-bold text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
            style={{ background: meta.accent, color: meta.accentText }}
          >
            {meta.label}
          </span>
        )}
      </CardImage>

      <CardBody padding="sm">
        <p className="font-display font-bold text-base text-[#1A1A1A] leading-[1.35] mb-3 line-clamp-2 flex-1">
          {project.title}
        </p>
        {project.metrics && project.metrics.length >= 2 && (
          <div className="flex gap-5 mb-3">
            {project.metrics.slice(0, 2).map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-display font-bold text-base text-[#39575C] leading-none">
                  {stat.value}
                </span>
                <span className="font-body text-xs text-[#6B7280] mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardBody>

      <CardFooter variant="light">
        <span className="font-body text-xs text-[#6B7280] truncate pr-2">
          {project.location ?? ''}
        </span>
        <CardArrow variant="light" />
      </CardFooter>
    </Card>
  );

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick();
        }}
        style={cardStyle}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link href={`/projects/${project.slug.current}`} className="block" style={cardStyle}>
      {inner}
    </Link>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ProjectCard.tsx
git commit -m "refactor(project-card): adopt Card base, standardise hover to -4px lift"
```

---

## Task 4: Update `ArticleCard.tsx`

**Files:**
- Modify: `src/components/ui/ArticleCard.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
// src/components/ui/ArticleCard.tsx
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import type { BlogPostCard } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';
import { categoryStyle, formatDate } from '@/lib/blogUtils';
import { Card, CardImage, CardBody, CardFooter } from '@/components/ui/Card';

interface ArticleCardProps {
  post: BlogPostCard;
  delay?: number;
  className?: string;
}

export function ArticleCard({ post, delay = 0, className }: ArticleCardProps) {
  const cs = categoryStyle(post.category);
  const imgSrc = post.heroImage?.asset
    ? urlFor(post.heroImage).width(400).height(320).auto('format').url()
    : undefined;
  const blurSrc = post.heroImage?.asset?.metadata?.lqip;

  return (
    <AnimatedSection delay={delay} className={className}>
      <Link href={`/blog/${post.slug.current}`} className="block h-full">
        <Card variant="light" pattern={1} className="h-full">
          <CardImage
            src={imgSrc}
            alt={post.heroImage?.alt ?? post.title}
            height={160}
            blurDataURL={blurSrc}
            sizes="(max-width: 768px) 100vw, 400px"
          />

          <CardBody padding="sm">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <span
                className="font-body font-bold text-[10px] uppercase tracking-[0.08em] rounded-full px-2.5 py-1"
                style={{ background: cs.bg, color: cs.color }}
              >
                {post.category}
              </span>
              {post.tags?.slice(0, 1).map((tag) => (
                <span
                  key={tag}
                  className="font-body font-semibold text-[10px] rounded-full px-2.5 py-1"
                  style={{ background: 'rgba(112,157,169,0.10)', color: '#39575C' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <p className="font-display font-bold text-sm text-[#1A1A1A] leading-[1.4] mb-2 flex-1 line-clamp-2">
              {post.title}
            </p>

            {/* Excerpt */}
            <p className="font-body text-xs text-[#6B7280] leading-[1.65] mb-3 line-clamp-2">
              {post.excerpt}
            </p>
          </CardBody>

          <CardFooter variant="light">
            <span className="font-body text-xs text-[#9CA3AF]">{formatDate(post.publishedAt)}</span>
            <span className="font-body text-xs font-medium" style={{ color: '#709DA9' }}>
              {post.readTime} min read
            </span>
          </CardFooter>
        </Card>
      </Link>
    </AnimatedSection>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ArticleCard.tsx
git commit -m "refactor(article-card): adopt Card base, standardise hover to -4px lift"
```

---

## Task 5: Update `FeaturedProjectCard.tsx`

**Files:**
- Modify: `src/components/sections/FeaturedProjectCard.tsx`

Uses `Card` as the outer shell only (the split grid layout stays custom). Replaces the text `→` "View case study" span with `<IconArrowRight />`.

- [ ] **Step 1: Replace the entire file**

```tsx
// src/components/sections/FeaturedProjectCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { SOLUTION_META } from '@/types/solutions';
import type { ProjectPreview } from '@/types/sanity';
import { IconArrowRight } from '@/components/ui/Icons';
import { Card } from '@/components/ui/Card';

const DEFAULT_LQIP =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

interface FeaturedProjectCardProps {
  project: ProjectPreview;
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const meta = project.vertical ? SOLUTION_META[project.vertical] : null;

  return (
    <Link href={`/projects/${project.slug.current}`} className="block">
      <Card variant="light" pattern={1}>
        <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr]">
          {/* Left: photo column — custom layout, not CardImage */}
          <div className="relative overflow-hidden z-10" style={{ minHeight: 260 }}>
            {project.heroImage ? (
              <Image
                src={project.heroImage.asset.url}
                alt={project.heroImage.alt ?? project.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                sizes="(max-width: 640px) 100vw, 60vw"
                placeholder="blur"
                blurDataURL={project.heroImage.asset.metadata?.lqip ?? DEFAULT_LQIP}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: meta
                    ? `linear-gradient(135deg, ${meta.accent}88 0%, ${meta.accent}33 100%)`
                    : 'linear-gradient(135deg, #39575C 0%, #709DA9 100%)',
                }}
              />
            )}
            {/* Gradient scrim */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(13,31,34,0.82) 0%, rgba(13,31,34,0.15) 55%, transparent 100%)',
              }}
            />
            {/* Featured badge */}
            <div className="absolute top-4 left-4 z-10">
              <span
                className="font-body font-bold text-[10px] uppercase tracking-[0.08em] px-3 py-1.5 rounded-full text-white"
                style={{ background: '#39575C', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                ★ Featured
              </span>
            </div>
            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
              <h2 className="font-display font-extrabold text-2xl text-white leading-[1.2] mb-1">
                {project.title}
              </h2>
              {project.location && (
                <p className="font-body text-sm text-white/60">{project.location}</p>
              )}
            </div>
          </div>

          {/* Right: stats panel */}
          <div
            className="flex flex-col p-6 justify-between border-t border-[#E5E7EB] sm:border-t-0 sm:border-l relative z-10"
            style={{ background: '#fafafa' }}
          >
            <div>
              {project.summary && (
                <p className="font-body text-sm text-[#6B7280] leading-[1.7] mb-5 line-clamp-4">
                  {project.summary}
                </p>
              )}
              {project.metrics && project.metrics.length >= 2 && (
                <div className="flex flex-col gap-3 mb-5">
                  {project.metrics.slice(0, 2).map((metric, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3.5"
                      style={{ background: '#fff', border: '1px solid #E5E7EB' }}
                    >
                      <p className="font-display font-extrabold text-xl text-[#39575C] leading-none mb-1">
                        {metric.value}
                      </p>
                      <p className="font-body text-xs text-[#6B7280]">{metric.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end pt-4 border-t border-[#E5E7EB]">
              <span
                className="font-body font-bold text-xs text-white rounded-full px-4 py-2 flex items-center gap-1.5"
                style={{ background: '#39575C' }}
              >
                View case study <IconArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/FeaturedProjectCard.tsx
git commit -m "refactor(featured-project-card): adopt Card shell, replace text arrow with IconArrowRight"
```

---

## Task 6: Update `FeaturedArticleCard.tsx`

**Files:**
- Modify: `src/components/ui/FeaturedArticleCard.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
// src/components/ui/FeaturedArticleCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostCard } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';
import { categoryStyle, formatDate, initials } from '@/lib/blogUtils';
import { Card } from '@/components/ui/Card';

const DEFAULT_LQIP =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

interface FeaturedArticleCardProps {
  post: BlogPostCard;
}

export function FeaturedArticleCard({ post }: FeaturedArticleCardProps) {
  const cs = categoryStyle(post.category);
  const imgSrc = post.heroImage?.asset
    ? urlFor(post.heroImage).width(600).height(440).auto('format').url()
    : null;
  const blurSrc = post.heroImage?.asset?.metadata?.lqip;
  const authorImgSrc = post.author.photo?.asset
    ? urlFor(post.author.photo).width(48).height(48).url()
    : null;

  return (
    <Link href={`/blog/${post.slug.current}`} className="block">
      <Card variant="light" pattern={1}>
        <div className="grid overflow-hidden" style={{ gridTemplateColumns: '1fr 1fr', minHeight: 240 }}>
          {/* Left: Photo */}
          <div className="relative overflow-hidden z-10" style={{ minHeight: 240 }}>
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={post.heroImage?.alt ?? post.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 100vw, 480px"
                placeholder="blur"
                blurDataURL={blurSrc ?? DEFAULT_LQIP}
              />
            ) : (
              <div className="w-full h-full bg-[#E5E7EB]" />
            )}
            <span
              className="absolute top-3 left-3 z-10 font-body font-bold text-[10px] uppercase tracking-[0.08em] text-white rounded-full px-2.5 py-1"
              style={{ background: '#39575C' }}
            >
              Featured
            </span>
          </div>

          {/* Right: Body */}
          <div className="flex flex-col p-6 relative z-10">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span
                className="font-body font-bold text-[10px] uppercase tracking-[0.08em] rounded-full px-2.5 py-1"
                style={{ background: cs.bg, color: cs.color }}
              >
                {post.category}
              </span>
              {post.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="font-body font-semibold text-[10px] rounded-full px-2.5 py-1"
                  style={{ background: 'rgba(112,157,169,0.10)', color: '#39575C' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="font-display font-extrabold text-xl text-[#1A1A1A] leading-[1.3] mb-2 flex-1 line-clamp-3">
              {post.title}
            </h2>

            <p className="font-body text-sm text-[#6B7280] leading-[1.7] mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-2">
              {authorImgSrc ? (
                <Image
                  src={authorImgSrc}
                  alt={post.author.name}
                  width={26}
                  height={26}
                  className="rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#39575C' }}
                >
                  <span className="font-display font-bold text-[10px] text-white">
                    {initials(post.author.name)}
                  </span>
                </div>
              )}
              <span className="font-body text-xs text-[#6B7280]">
                {post.author.name}
                <span className="mx-1">·</span>
                {formatDate(post.publishedAt)}
                <span className="mx-1">·</span>
                {post.readTime} min read
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/FeaturedArticleCard.tsx
git commit -m "refactor(featured-article-card): adopt Card shell for consistent hover tokens"
```

---

## Task 7: Update `Testimonials.tsx`

**Files:**
- Modify: `src/components/sections/Testimonials.tsx`

Changes: Pattern 3 (no hover), padding `py-12 md:py-[52px]` → `py-16 md:py-24`.

- [ ] **Step 1: Replace the entire file**

```tsx
// src/components/sections/Testimonials.tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Card, CardBody } from '@/components/ui/Card';

export interface TestimonialQuote {
  text: string;
  author: string;
  role: string;
  company: string;
}

export interface TestimonialsProps {
  quotes: TestimonialQuote[];
  accent: string;
  id?: string;
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function Testimonials({ quotes, accent, id }: TestimonialsProps) {
  return (
    <section id={id} className="bg-[#F5F5F5] py-16 md:py-24">
      <div className="page-container">
        <AnimatedSection className="text-center mb-10 md:mb-12">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
            What clients say
          </p>
          <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
            Results that{' '}
            <em style={{ color: accent, fontStyle: 'normal' }}>speak for themselves</em>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((q, i) => (
            <AnimatedSection key={`${q.author}-${i}`} delay={i * 0.07}>
              <Card variant="light" pattern={3} className="h-full">
                <CardBody padding="lg" className="h-full">
                  {/* Quote mark */}
                  <p
                    className="font-display font-extrabold leading-none mb-3 select-none"
                    style={{ fontSize: 44, color: accent, lineHeight: 1 }}
                  >
                    &ldquo;
                  </p>
                  <p className="font-body text-sm leading-[1.75] text-[#374151] flex-1 mb-5">
                    {q.text}
                  </p>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: '#39575C' }}
                    >
                      <span className="font-display font-bold text-xs text-white">
                        {initials(q.author)}
                      </span>
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-[#1A1A1A] leading-none mb-0.5">
                        {q.author}
                      </p>
                      <p className="font-body text-xs text-[#6B7280]">
                        {q.role} · {q.company}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Testimonials.tsx
git commit -m "refactor(testimonials): adopt Card Pattern 3, fix section padding"
```

---

## Task 8: Update `AboutValues.tsx`

**Files:**
- Modify: `src/components/sections/AboutValues.tsx`

Changes: dark Pattern 3 (removes gradient overlay entirely), padding fix.

- [ ] **Step 1: Replace the entire file**

```tsx
// src/components/sections/AboutValues.tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Card, CardBody } from '@/components/ui/Card';

const VALUES = [
  {
    num: '01',
    title: 'Empathy',
    text: "We put people first, understanding our clients' unique needs to create meaningful, impactful solutions.",
  },
  {
    num: '02',
    title: 'Pioneering',
    text: 'We break new ground with advanced renewable solutions, setting new standards for sustainable growth in business.',
  },
  {
    num: '03',
    title: 'Trust',
    text: 'We build lasting partnerships rooted in integrity, transparency, and unwavering reliability.',
  },
  {
    num: '04',
    title: 'Conscience',
    text: 'Everything we do is driven by our commitment to creating positive change for the planet and future generations.',
  },
  {
    num: '05',
    title: 'Inspiration',
    text: 'We inspire businesses by creating new opportunities to deliver efficient, sustainable services — empowering them to inspire their own customers.',
  },
  {
    num: '06',
    title: 'Ubuntu',
    text: 'We are rooted in the African belief that we grow stronger together — alongside our clients, our communities, and our continent.',
  },
];

export function AboutValues() {
  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24">
      <AnimatedSection className="page-container text-center mb-10 md:mb-12">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          What we stand for
        </p>
        <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
          Our <em style={{ color: '#709DA9', fontStyle: 'normal' }}>values</em>
        </h2>
      </AnimatedSection>

      <div className="page-container grid gap-3 grid-cols-1 md:grid-cols-3">
        {VALUES.map((v, i) => (
          <AnimatedSection key={v.num} delay={i * 0.04} as="div">
            <Card variant="dark" pattern={3} className="h-full">
              <CardBody padding="lg" className="h-full">
                <p
                  className="font-display font-extrabold text-4xl leading-none mb-3"
                  style={{ color: 'rgba(255,255,255,0.08)' }}
                >
                  {v.num}
                </p>
                <p className="font-display font-bold text-base text-white mb-2">{v.title}</p>
                <p className="font-body text-sm leading-[1.75]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {v.text}
                </p>
              </CardBody>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/AboutValues.tsx
git commit -m "refactor(about-values): adopt Card dark Pattern 3, remove hover overlay, fix padding"
```

---

## Task 9: Update `AboutTeam.tsx`

**Files:**
- Modify: `src/components/sections/AboutTeam.tsx`

Changes: member cards → dark Pattern 3 (no hover, LinkedIn badge stays inside), "Join the journey" card → Pattern 2 (shadow-only hover, gradient overlay removed), padding fix.

- [ ] **Step 1: Replace the entire file**

```tsx
// src/components/sections/AboutTeam.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { TeamMember } from '@/types/sanity';
import type { TeamCategory } from '@/types/sanity';
import { IconArrowRight } from '../ui/Icons';
import { Card, CardImage, CardBody } from '../ui/Card';

interface AboutTeamProps {
  members: TeamMember[];
}

const ALL_CATS: { value: 'all' | TeamCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'founders', label: 'Founders' },
  { value: 'business', label: 'Business' },
  { value: 'technical', label: 'Technical' },
];

export function AboutTeam({ members }: AboutTeamProps) {
  const [activeCat, setActiveCat] = useState<'all' | TeamCategory>('all');

  const availableCats = ALL_CATS.filter(
    (c) => c.value === 'all' || members.some((m) => m.category === c.value),
  );

  const visible =
    activeCat === 'all' ? members : members.filter((m) => m.category === activeCat);

  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24">
      <div className="page-container">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          The team
        </p>
        <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2] mb-6">
          Meet the people{' '}
          <em style={{ color: '#709DA9', fontStyle: 'normal' }}>behind Phoenix Energy</em>
        </h2>

        {/* Filter tabs */}
        <div
          className="flex gap-2 mb-8 overflow-x-auto scrollbar-none pb-1"
          style={{ WebkitOverflowScrolling: 'touch', whiteSpace: 'nowrap' }}
        >
          {availableCats.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCat(cat.value)}
              className="cursor-pointer rounded-full font-body font-medium text-sm px-4 py-1.5 transition-all duration-200 flex-shrink-0"
              style={{
                background: activeCat === cat.value ? '#39575C' : '#ffffff',
                color: activeCat === cat.value ? '#ffffff' : '#6B7280',
                border: activeCat === cat.value ? '1px solid #39575C' : '1px solid #E5E7EB',
                fontWeight: activeCat === cat.value ? 600 : 500,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {visible.map((member) => (
            <Card key={member._id} variant="dark" pattern={3}>
              <CardImage
                src={member.photo?.asset.url}
                alt={member.name}
                height={150}
                blurDataURL={member.photo?.asset.metadata?.lqip}
                sizes="(max-width: 768px) 100vw, 320px"
                placeholderStyle={{ background: 'linear-gradient(135deg, #162630, #0d1f22)' }}
              >
                {/* LinkedIn badge — pointer-events-auto since parent is pointer-events-none */}
                {member.linkedin && (
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center font-body text-xs font-bold transition-colors duration-150 pointer-events-auto"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    in
                  </Link>
                )}
              </CardImage>
              <CardBody padding="sm">
                <p className="font-display font-bold text-base text-white mb-0.5">{member.name}</p>
                {member.archetype && (
                  <p className="font-body font-semibold text-sm mb-0.5" style={{ color: '#709DA9' }}>
                    {member.archetype}
                  </p>
                )}
                <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {member.role}
                </p>
              </CardBody>
            </Card>
          ))}

          {/* Join the journey — Pattern 2: has button inside, shadow-only hover */}
          <Card variant="dark" pattern={2} className="md:col-span-3">
            <CardBody padding="lg" className="md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display font-bold text-base text-white mb-1">
                  Become a part of our journey
                </p>
                <p className="font-body text-sm leading-[1.7]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  We&apos;re always looking for passionate, ambitious individuals who share our vision
                  for a prosperous Africa.
                </p>
              </div>
              <Link
                href="https://linkedin.com/company/105465145"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row gap-2 items-center self-start md:self-auto flex-shrink-0 rounded-full px-4 py-2 font-body font-semibold text-sm text-[#0d1f22] bg-[#F5F5F5] hover:bg-white transition-colors duration-200"
              >
                See career opportunities <IconArrowRight size={14} />
              </Link>
            </CardBody>
          </Card>
        </div>

        {members.length === 0 && (
          <p className="font-body text-base text-[#6B7280] text-center py-12">
            Team members coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/AboutTeam.tsx
git commit -m "refactor(about-team): adopt Card dark Pattern 3/2, remove hover overlays, fix padding"
```

---

## Task 10: Update `FinancingCards.tsx`

**Files:**
- Modify: `src/components/sections/FinancingCards.tsx`

Changes: Pattern 2 (shadow-only hover, no lift), accent bar on both cards, consistent padding.

- [ ] **Step 1: Replace the entire file**

```tsx
// src/components/sections/FinancingCards.tsx
import { Card, CardBody } from '@/components/ui/Card';

export function FinancingCards() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* CapEx — light card */}
      <Card variant="light" pattern={2} className="flex-1">
        {/* 3px dusty-blue accent bar */}
        <div className="h-[3px] rounded-full" style={{ background: '#709DA9' }} />
        <CardBody padding="lg">
          <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280] mb-1">
            CapEx
          </p>
          <h3 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-3">
            Purchase outright
          </h3>
          <ul className="space-y-2">
            {[
              'Full asset ownership from day one',
              'Section 12B tax depreciation (125%)',
              'Highest long-term ROI',
              'No monthly payment obligations',
              'Balance-sheet asset',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 font-body text-sm text-[#374151]">
                <span className="mt-0.5 text-[#39575C] flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {/* OpEx — dark card */}
      <Card variant="dark" pattern={2} className="flex-1">
        {/* 3px dusty-blue accent bar */}
        <div className="h-[3px] rounded-full" style={{ background: '#709DA9' }} />
        <CardBody padding="lg">
          <p
            className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-1"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            OpEx
          </p>
          <h3 className="font-display font-extrabold text-xl text-white mb-3">PPA or lease</h3>
          <ul className="space-y-2">
            {[
              'R0 capital — no upfront cost',
              'Fixed tariff below Eskom rate',
              'Operations & maintenance included',
              'Off-balance-sheet financing',
              '10–25 year agreement, purchase option',
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 font-body text-sm"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                <span className="mt-0.5 text-[#709DA9] flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/FinancingCards.tsx
git commit -m "refactor(financing-cards): adopt Card Pattern 2, shadow-only hover, add accent bars"
```

---

## Task 11: Fix remaining section padding

**Files:**
- Modify: `src/components/sections/HowItWorks.tsx`
- Modify: `src/components/ui/SectionCarousel.tsx`
- Modify: `src/components/sections/CTABanner.tsx`
- Modify: `src/components/sections/AboutStory.tsx`

- [ ] **Step 1: Update `HowItWorks.tsx` padding**

Find: `className="bg-[#F5F5F5] px-6 py-12 md:py-[48px]"`
Replace with: `className="bg-[#F5F5F5] px-6 py-16 md:py-24"`

- [ ] **Step 2: Update `SectionCarousel.tsx` padding**

Find: `` `${bg === 'gray' ? 'bg-[#F5F5F5]' : 'bg-white'} py-12 md:py-[48px]` ``
Replace with: `` `${bg === 'gray' ? 'bg-[#F5F5F5]' : 'bg-white'} py-16 md:py-24` ``

- [ ] **Step 3: Update `CTABanner.tsx` padding**

Find: `className="py-12 md:py-[48px]"`
Replace with: `className="py-16 md:py-24"`

- [ ] **Step 4: Update `AboutStory.tsx` padding**

Find: `className="bg-white py-[52px]"`
Replace with: `className="bg-white py-16 md:py-24"`

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/HowItWorks.tsx src/components/ui/SectionCarousel.tsx src/components/sections/CTABanner.tsx src/components/sections/AboutStory.tsx
git commit -m "fix(padding): standardise all sections to py-16 md:py-24 or py-10 md:py-12"
```

---

## Task 12: Global text arrow sweep

**Files:**
- Modify: `src/components/sections/HowItWorks.tsx`
- Modify: `src/components/ui/SectionCarousel.tsx`
- Modify: `src/components/sections/ProjectGallery.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/authors/[slug]/page.tsx`
- Modify: `src/components/sections/ContactForm.tsx`
- Modify: `src/components/tools/SoftPaywall.tsx`
- Modify: `src/components/tools/Step1SystemDetails.tsx`
- Modify: `src/components/tools/Step2Condition.tsx`
- Modify: `src/app/solutions/ci-solar-storage/page.tsx`
- Modify: `src/app/solutions/energy-optimisation/page.tsx`
- Modify: `src/app/solutions/ev-fleets/page.tsx`
- Modify: `src/app/solutions/wheeling/page.tsx`
- Modify: `src/app/solutions/carbon-credits/page.tsx`
- Modify: `src/app/solutions/webuysolar/page.tsx`

- [ ] **Step 1: Fix `HowItWorks.tsx` — CTA default label and Button children**

In `HowItWorks.tsx`, make two changes:

Change the default prop:
```tsx
// Before
ctaLabel = 'Get a Free Assessment →',

// After
ctaLabel = 'Get a Free Assessment',
```

Change the Button render (add import for IconArrowRight if not already present):
```tsx
// Add to imports at top of file:
import { IconArrowRight } from '@/components/ui/Icons';

// Before
<Button variant="primary" href={ctaHref}>
  {ctaLabel}
</Button>

// After
<Button variant="primary" href={ctaHref}>
  {ctaLabel} <IconArrowRight size={14} />
</Button>
```

- [ ] **Step 2: Fix `SectionCarousel.tsx` — view-all link**

```tsx
// Add to imports:
import { IconArrowRight } from './Icons';

// Before
{viewAllLabel}
<span className="transition-transform duration-200 group-hover:translate-x-1">
  →
</span>

// After
{viewAllLabel}
<span className="transition-transform duration-200 group-hover:translate-x-1">
  <IconArrowRight size={14} />
</span>
```

- [ ] **Step 3: Fix `ProjectGallery.tsx` — lightbox next button**

Find the "Next" lightbox button (line ~118):
```tsx
// Before
<button ... aria-label="Next photo">
  →
</button>

// After — add import first:
import { IconArrowRight } from '@/components/ui/Icons';

<button ... aria-label="Next photo">
  <IconArrowRight size={16} />
</button>
```

- [ ] **Step 4: Fix `blog/page.tsx` — pagination**

Find `Next →` in the pagination area:
```tsx
// Before
Next →

// After — add import first if needed:
import { IconArrowRight } from '@/components/ui/Icons';

// Then replace:
Next <IconArrowRight size={14} />
```

- [ ] **Step 5: Fix `blog/authors/[slug]/page.tsx` — LinkedIn link**

Find `LinkedIn →`:
```tsx
// Before
LinkedIn →

// After
LinkedIn <IconArrowRight size={14} />
```

- [ ] **Step 6: Fix `ContactForm.tsx` — submit labels**

`ContactForm.tsx` already has `<IconArrowRight size={16} />` appended after `config.submitLabel` in its submit button render (line 360). The `→` in the strings is redundant — remove it from the two `submitLabel` strings only. No render change needed.

```tsx
// src/components/sections/ContactForm.tsx

// Before (line 51)
submitLabel: 'Send partnership enquiry →',
// After
submitLabel: 'Send partnership enquiry',

// Before (line 62)
submitLabel: 'Send investor enquiry →',
// After
submitLabel: 'Send investor enquiry',
```

- [ ] **Step 7: Fix `SoftPaywall.tsx` — unlock button**

```tsx
// Before
{submitting ? 'Sending…' : 'Unlock my full valuation →'}

// After
{submitting ? 'Sending…' : <>Unlock my full valuation <IconArrowRight size={14} /></>}
```

Add `import { IconArrowRight } from '@/components/ui/Icons';` if not already present.

- [ ] **Step 8: Fix `Step1SystemDetails.tsx` — next button**

Find `Next: System condition →`:
```tsx
// Before
Next: System condition →

// After
Next: System condition <IconArrowRight size={14} />
```

Add import.

- [ ] **Step 9: Fix `Step2Condition.tsx` — view valuation button**

Find `View my valuation →`:
```tsx
// Before
View my valuation →

// After
View my valuation <IconArrowRight size={14} />
```

Add import.

- [ ] **Step 10: Fix all 6 solution pages — remove `→` from `ctaLabel` strings**

In each of these files, find the `ctaLabel` prop passed to `HowItWorks` and remove the trailing `→`. The `HowItWorks` component now always appends `<IconArrowRight />` automatically.

```tsx
// src/app/solutions/ci-solar-storage/page.tsx
// Before: ctaLabel="Get a Free Assessment →"
// After:  ctaLabel="Get a Free Assessment"

// src/app/solutions/energy-optimisation/page.tsx
// Before: ctaLabel="Book a Free Audit →"
// After:  ctaLabel="Book a Free Audit"

// src/app/solutions/ev-fleets/page.tsx
// Before: ctaLabel="Get a Fleet Assessment →"
// After:  ctaLabel="Get a Fleet Assessment"

// src/app/solutions/wheeling/page.tsx
// Before: ctaLabel="Get a Wheeling Quote →"
// After:  ctaLabel="Get a Wheeling Quote"

// src/app/solutions/carbon-credits/page.tsx
// Before: ctaLabel="Check Eligibility →"
// After:  ctaLabel="Check Eligibility"

// src/app/solutions/webuysolar/page.tsx
// Before: ctaLabel="Get a Valuation →"
// After:  ctaLabel="Get a Valuation"
```

- [ ] **Step 11: Verify zero `→` remain in UI-facing TSX (excluding code comments)**

```bash
grep -rn "→" src/ --include="*.tsx" | grep -v "//.*→"
```

Expected: no output (or only comment lines which are acceptable).

- [ ] **Step 12: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 13: Commit**

```bash
git add src/
git commit -m "fix(icons): replace all text arrow symbols with IconArrowRight across the codebase"
```

---

## Final Verification

- [ ] **Run full build to confirm no regressions**

```bash
npm run build
```

Expected: successful build, no TypeScript errors, no missing module errors.

- [ ] **Visual check — open dev server and verify**

```bash
npm run dev
```

Check each page:
- `/` — Partners section: logos correct size/opacity; HowItWorks: arrow icon on CTA; FeaturedProjects: card hover lifts -4px
- `/projects` — ProjectCard hover: -4px lift, border highlight, arrow circle fills teal
- `/blog` — ArticleCard hover: same as ProjectCard; pagination: icon arrow
- `/about` — Values cards: no hover; Team cards: no hover; AboutStory padding correct
- `/solutions/ci-solar-storage` — FinancingCards: shadow-only hover; HowItWorks CTA icon
- `/contact` — Submit buttons: no text arrows

- [ ] **Verify no `→` symbols visible in browser (check DevTools if unsure)**

---

## Success Criteria Checklist

- [ ] `Card`, `CardImage`, `CardBody`, `CardFooter`, `CardArrow` exported from `src/components/ui/Card.tsx`
- [ ] Zero text arrow characters (`→`) remain in any UI-facing `.tsx` file
- [ ] All card hover lifts are exactly `-4px` (`-translate-y-1`) or removed (Pattern 2/3)
- [ ] All sections use `py-16 md:py-24` or `py-10 md:py-12` — no other `py-` values
- [ ] `PartnerCards.tsx` renders logos at `h-8 w-auto max-w-[140px]` with opacity treatment
- [ ] Dark cards appear only in: AboutValues, AboutTeam, AboutStory stat panel, FinancingCards OpEx
- [ ] Every Pattern 1 `CardFooter` arrow uses `<CardArrow />` (wraps `<IconArrowRight />`)
- [ ] `npm run build` succeeds with no errors

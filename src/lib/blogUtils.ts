// src/lib/blogUtils.ts
import { SOLUTION_META } from '@/types/solutions';
import type { SolutionMeta, SolutionVertical } from '@/types/solutions';
import type { BlogPostCard, PortableTextBlock } from '@/types/sanity';

const TAG_VERTICAL_MAP: Record<string, SolutionVertical> = {
  'Solar & Storage':      'ci-solar-storage',
  'Wheeling':             'wheeling',
  'Energy Optimisation':  'energy-optimisation',
  'Carbon Credits':       'carbon-credits',
  'WeBuySolar':           'webuysolar',
  'EV Fleets':            'ev-fleets',
};

export function tagMeta(tag: string): SolutionMeta | null {
  const vertical = TAG_VERTICAL_MAP[tag];
  return vertical ? SOLUTION_META[vertical] : null;
}

export type DateStyle = 'short' | 'long';

/**
 * "8 Oct 2026" (short, the cards) or "8 October 2026" (long, the post hero),
 * in Johannesburg time. Built from parts because Node's en-ZA short form pads
 * the day ("08 Oct 2026").
 */
export function formatDate(iso: string, style: DateStyle = 'short'): string {
  const parts = new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'Africa/Johannesburg',
  }).formatToParts(new Date(iso));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return `${Number(part('day'))} ${part('month').replace(/\.$/, '')} ${part('year')}`;
}

/** "Ricardo De Sousa" gives "RD": the first letter of the first two words. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/** The service of the first tag that names one, or null. */
export function postVertical(tags: readonly string[] | null | undefined): SolutionVertical | null {
  for (const tag of tags ?? []) {
    const vertical = TAG_VERTICAL_MAP[tag];
    if (vertical) return vertical;
  }
  return null;
}

/** "Industry Insights · 8 Oct 2026 · 6 min read". A missing read time is left out. */
export function postMetaLine(
  post: Pick<BlogPostCard, 'category' | 'publishedAt' | 'readTime'>,
  style: DateStyle = 'short',
): string {
  const parts: string[] = [];
  if (post.category) parts.push(post.category);
  parts.push(formatDate(post.publishedAt, style));
  if (post.readTime) parts.push(`${post.readTime} min read`);
  return parts.join(' · ');
}

/** A heading's anchor: lower case, runs of other characters to "-", no "-" at the ends. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export interface PostHeading {
  key: string;
  id: string;
  text: string;
  level: 'h2' | 'h3';
}

/**
 * The post's h2 and h3 blocks, for the table of contents and the heading ids.
 * A repeated heading gets "-2", "-3" and so on, so each link finds its own.
 */
export function postHeadings(body: PortableTextBlock[] | null | undefined): PostHeading[] {
  const seen = new Map<string, number>();
  const headings: PostHeading[] = [];
  (body ?? []).forEach((b, index) => {
    if (b._type !== 'block' || (b.style !== 'h2' && b.style !== 'h3')) return;
    const children = Array.isArray(b.children) ? (b.children as { text?: unknown }[]) : [];
    const text = children
      .map((c) => (typeof c.text === 'string' ? c.text : ''))
      .join('')
      .trim();
    const base = slugify(text);
    if (!base) return;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    headings.push({
      key: typeof b._key === 'string' && b._key ? b._key : String(index),
      id: n === 1 ? base : `${base}-${n}`,
      text,
      level: b.style,
    });
  });
  return headings;
}

/** The line a heading's top must pass to be the current one: just below a jump's landing (112px). */
export const TOC_ACTIVE_LINE = 120;

/**
 * The table of contents' current heading: the last one whose top has passed
 * the line. None while the first heading is still below it, so a jump back to
 * the top clears the highlight.
 */
export function activeHeadingId(tops: { id: string; top: number }[], line = TOC_ACTIVE_LINE): string | null {
  let current: string | null = null;
  for (const { id, top } of tops) {
    if (top <= line) current = id;
    else break;
  }
  return current;
}

/** From this many live posts, /blog shows the featured card, the pills and the search. */
export const BLOG_FILTER_THRESHOLD = 4;

export interface BlogFilterOption {
  kind: 'category' | 'tag';
  value: string;
  count: number;
}

/** Most posts first, then by name. */
function sortedOptions(kind: BlogFilterOption['kind'], counts: Map<string, number>): BlogFilterOption[] {
  return [...counts]
    .map(([value, count]) => ({ kind, value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

/** The /blog pills: only categories and tags that have live posts, categories first. */
export function blogFilterOptions(rows: { category: string | null; tags: string[] | null }[]): BlogFilterOption[] {
  const categories = new Map<string, number>();
  const tags = new Map<string, number>();
  for (const row of rows) {
    if (row.category) categories.set(row.category, (categories.get(row.category) ?? 0) + 1);
    for (const tag of new Set(row.tags ?? [])) tags.set(tag, (tags.get(tag) ?? 0) + 1);
  }
  return [...sortedOptions('category', categories), ...sortedOptions('tag', tags)];
}

export type RelatedPostsLayout = 'three' | 'two' | 'wide';

/** "More articles" follows ProjectNext: three cards, two large, or one wide card. */
export function relatedLayout(count: number): RelatedPostsLayout | null {
  if (count <= 0) return null;
  if (count === 1) return 'wide';
  if (count === 2) return 'two';
  return 'three';
}

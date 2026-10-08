// src/lib/blogIndex.ts
// What /blog shows for a request, as pure functions, so the page and its
// metadata read the URL the same way. /blog follows /projects: below
// BLOG_FILTER_THRESHOLD live posts it shows them all as equal cards, with no
// featured card, pills or search, and ignores the URL's page, filters and
// search (a shared ?tag= link still shows every post). From the threshold it
// reads them, and a post marked featured leads page 1 of the whole list.
import { BLOG_FILTER_THRESHOLD } from './blogUtils';

export const BLOG_PAGE_SIZE = 6;

export interface BlogIndexParams {
  page?: string;
  category?: string;
  tag?: string;
  q?: string;
}

export interface BlogIndexView {
  /** Below the threshold: equal cards, nothing to filter. */
  few: boolean;
  page: number;
  category: string;
  tag: string;
  /** The search as typed, trimmed. */
  search: string;
  /** A category, a tag or a search narrows the list. */
  filtered: boolean;
}

export function blogIndexView(params: BlogIndexParams, published: number): BlogIndexView {
  if (published < BLOG_FILTER_THRESHOLD) {
    return { few: true, page: 1, category: '', tag: '', search: '', filtered: false };
  }
  const category = params.category ?? '';
  const tag = params.tag ?? '';
  const search = params.q?.trim() ?? '';
  return {
    few: false,
    page: Math.max(1, Math.floor(Number(params.page)) || 1),
    category,
    tag,
    search,
    filtered: Boolean(category || tag || search),
  };
}

/** A page of the current view: the filters and the search carry over. */
export function blogIndexHref(view: Pick<BlogIndexView, 'category' | 'tag' | 'search'>, page: number): string {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (view.category) params.set('category', view.category);
  if (view.tag) params.set('tag', view.tag);
  if (view.search) params.set('q', view.search);
  const qs = params.toString();
  return qs ? `/blog?${qs}` : '/blog';
}

type FeaturedCandidate = { _id: string; featured?: boolean | null } | null | undefined;

/** The featured card: a post marked featured, on page 1 of the whole list. */
export function showFeaturedCard(view: BlogIndexView, post: FeaturedCandidate): boolean {
  return !view.few && view.page === 1 && !view.filtered && post?.featured === true;
}

/**
 * The post the grid leaves out: the featured one, on every page of the whole
 * list (not only page 1), so page 2 starts where page 1's grid ended.
 */
export function blogExclude(view: BlogIndexView, post: FeaturedCandidate): string {
  return !view.few && !view.filtered && post?.featured === true ? post._id : '';
}

export type BlogEmptyReason = 'none' | 'search' | 'filter' | 'page';

/** Why the grid is empty: no live posts, a search or a filter that matches none, or a page past the end. */
export function blogEmptyReason(view: BlogIndexView, published: number): BlogEmptyReason {
  if (published === 0) return 'none';
  if (view.search) return 'search';
  if (view.category || view.tag) return 'filter';
  return 'page';
}

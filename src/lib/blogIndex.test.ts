import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { blogEmptyReason, blogExclude, blogIndexHref, blogIndexView, showFeaturedCard } from './blogIndex';
import { BlogEmptyState } from '@/components/blog/BlogEmptyState';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);
const filters = { page: '2', category: 'Company News', tag: 'Wheeling', q: ' solar ' };

describe('blogIndexView', () => {
  it('ignores every URL parameter below four live posts', () => {
    expect(blogIndexView(filters, 3)).toEqual({ few: true, page: 1, category: '', tag: '', search: '', filtered: false });
    expect(blogIndexView(filters, 0).few).toBe(true);
  });

  it('reads the page, the filters and the trimmed search from four', () => {
    expect(blogIndexView(filters, 4)).toEqual({ few: false, page: 2, category: 'Company News', tag: 'Wheeling', search: 'solar', filtered: true });
    expect(blogIndexView({ page: 'x' }, 4)).toEqual({ few: false, page: 1, category: '', tag: '', search: '', filtered: false });
  });
});

describe('blogIndexHref', () => {
  it('keeps the filters and the search on every page link', () => {
    expect(blogIndexHref({ category: '', tag: '', search: '' }, 1)).toBe('/blog');
    expect(blogIndexHref({ category: '', tag: '', search: '' }, 3)).toBe('/blog?page=3');
    expect(blogIndexHref({ category: 'Company News', tag: '', search: 'solar' }, 2)).toBe('/blog?page=2&category=Company+News&q=solar');
  });
});

describe('the featured card', () => {
  const lead = { _id: 'lead', featured: true };
  const newest = { _id: 'newest', featured: false };
  const many = blogIndexView({}, 6);

  it('shows only a post marked featured, on page 1 with no filter or search', () => {
    expect(showFeaturedCard(many, lead)).toBe(true);
    expect(showFeaturedCard(many, newest)).toBe(false);
    expect(showFeaturedCard(many, null)).toBe(false);
    expect(showFeaturedCard(blogIndexView({ page: '2' }, 6), lead)).toBe(false);
    expect(showFeaturedCard(blogIndexView({ tag: 'Wheeling' }, 6), lead)).toBe(false);
    expect(showFeaturedCard(blogIndexView({}, 3), lead)).toBe(false);
  });

  it('is left out of the grid on every page of the whole list, so the pages never shift', () => {
    expect(blogExclude(many, lead)).toBe('lead');
    expect(blogExclude(blogIndexView({ page: '2' }, 6), lead)).toBe('lead');
    expect(blogExclude(blogIndexView({ q: 'solar' }, 6), lead)).toBe('');
    expect(blogExclude(many, newest)).toBe('');
  });
});

describe('the empty state', () => {
  it('names why the grid is empty', () => {
    expect(blogEmptyReason(blogIndexView({}, 0), 0)).toBe('none');
    expect(blogEmptyReason(blogIndexView({ q: 'zzz', tag: 'Wheeling' }, 6), 6)).toBe('search');
    expect(blogEmptyReason(blogIndexView({ tag: 'Nothing' }, 6), 6)).toBe('filter');
    expect(blogEmptyReason(blogIndexView({ page: '99' }, 6), 6)).toBe('page');
  });

  it('offers a way back to every article, except when there are none', () => {
    const search = html(createElement(BlogEmptyState, { reason: 'search', search: 'zzz' }));
    expect(search).toContain('No articles match “zzz”.');
    expect(search).toMatch(/<a [^>]*href="\/blog"[^>]*>Show all articles/);
    const filter = html(createElement(BlogEmptyState, { reason: 'filter', search: '' }));
    expect(filter).toContain('No articles match this filter.');
    expect(filter).toContain('Show all articles');
    expect(html(createElement(BlogEmptyState, { reason: 'page', search: '' }))).toContain('Show all articles');
    const none = html(createElement(BlogEmptyState, { reason: 'none', search: '' }));
    expect(none).toContain('Articles are on their way.');
    expect(none).not.toContain('<a ');
  });
});

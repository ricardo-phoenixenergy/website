import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTHOR_SITEMAP_QUERY, BLOG_SITEMAP_QUERY } from '@/lib/queries';

const { fetchMock, entriesMock } = vi.hoisted(() => ({ fetchMock: vi.fn(), entriesMock: vi.fn() }));
vi.mock('@/lib/sanity.server', () => ({ sanityServerClient: { fetch: fetchMock } }));
vi.mock('@/lib/projectData', () => ({ getProjectSitemapEntries: entriesMock }));

import sitemap from './sitemap';

beforeEach(() => {
  fetchMock.mockReset();
  entriesMock.mockReset();
});

describe('sitemap', () => {
  it('lists every project page, with its last update', async () => {
    fetchMock.mockResolvedValue([]);
    entriesMock.mockResolvedValue([{ slug: 'st-andrews-office-park', updatedAt: '2026-09-20T10:00:00Z' }]);
    expect(await sitemap()).toContainEqual({
      url: 'https://phoenixenergy.solutions/projects/st-andrews-office-park',
      lastModified: new Date('2026-09-20T10:00:00Z'),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  it('still lists the static pages when the CMS fails', async () => {
    fetchMock.mockRejectedValue(new Error('down'));
    entriesMock.mockRejectedValue(new Error('down'));
    const entries = await sitemap();
    expect(entries.some((e) => e.url === 'https://phoenixenergy.solutions/projects')).toBe(true);
    expect(entries.some((e) => e.url.includes('/projects/'))).toBe(false);
  });

  it('lists the blog, each live post by its last change, and each author with a post', async () => {
    fetchMock.mockImplementation(async (query: string) => {
      if (query === BLOG_SITEMAP_QUERY) return [{ slug: 'a-post', lastModified: '2026-09-25T08:00:00Z' }];
      if (query === AUTHOR_SITEMAP_QUERY) return [{ slug: 'an-author', lastModified: '2026-09-20T08:00:00Z' }];
      return null;
    });
    entriesMock.mockResolvedValue([]);
    const entries = await sitemap();
    expect(entries).toContainEqual({ url: 'https://phoenixenergy.solutions/blog', priority: 0.8, changeFrequency: 'weekly' });
    expect(entries).toContainEqual({ url: 'https://phoenixenergy.solutions/blog/a-post', lastModified: new Date('2026-09-25T08:00:00Z'), changeFrequency: 'weekly', priority: 0.7 });
    expect(entries).toContainEqual({ url: 'https://phoenixenergy.solutions/blog/authors/an-author', lastModified: new Date('2026-09-20T08:00:00Z'), changeFrequency: 'monthly', priority: 0.5 });
  });

  it('leaves the blog and its authors out until a post is live', async () => {
    fetchMock.mockResolvedValue([]);
    entriesMock.mockResolvedValue([]);
    const entries = await sitemap();
    expect(entries.some((e) => e.url.includes('/blog'))).toBe(false);
  });
});

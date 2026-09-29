import { beforeEach, describe, expect, it, vi } from 'vitest';

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
});

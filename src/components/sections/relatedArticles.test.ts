import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));
vi.mock('@/lib/sanity.server', () => ({ sanityServerClient: { fetch: fetchMock } }));

import { RelatedArticles } from './RelatedArticles';
import { POSTS_BY_SLUGS_QUERY, POSTS_BY_VERTICAL_QUERY } from '@/lib/queries';
import type { BlogPostCard, SanityImage } from '@/types/sanity';

const image: SanityImage = {
  _type: 'image',
  asset: { _id: 'image-abc-1200x800-jpg', url: 'https://cdn.sanity.io/images/p/production/abc-1200x800.jpg', metadata: { lqip: 'data:image/jpeg;base64,x' } },
  alt: 'A switchboard',
};

const post: BlogPostCard = {
  _id: 'p1',
  title: 'Ekurhuleni Tariff C 2026/27',
  slug: { current: 'a-post' },
  category: 'Industry Insights',
  tags: ['Tariffs', 'Energy Optimisation'],
  excerpt: 'What the new tariff means for your site.',
  readTime: 6,
  publishedAt: '2026-10-08T08:00:00.000Z',
  heroImage: image,
  featured: false,
  author: { name: 'Ricardo De Sousa', slug: { current: 'ricardo' }, photo: image },
};

beforeEach(() => fetchMock.mockReset());

describe('RelatedArticles', () => {
  it('keeps the solution pages’ behaviour without slugs', async () => {
    fetchMock.mockResolvedValueOnce([]);
    await RelatedArticles({ vertical: 'ci-solar-storage' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(POSTS_BY_VERTICAL_QUERY, { tag: 'Solar & Storage' });
  });

  it('keeps the default heading without a heading prop', async () => {
    fetchMock.mockResolvedValueOnce([post]);
    const el = await RelatedArticles({ vertical: 'ci-solar-storage' });
    expect(renderToStaticMarkup(el!)).toContain('Further reading on');
  });

  it('shows only the chosen articles when a page names them', async () => {
    fetchMock.mockResolvedValueOnce([]);
    await RelatedArticles({ vertical: 'ci-solar-storage', slugs: ['a-post'] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(POSTS_BY_SLUGS_QUERY, { slugs: ['a-post'] });
  });

  it('renders nothing, and fetches nothing, when a page names no articles', async () => {
    expect(await RelatedArticles({ vertical: 'ci-solar-storage', slugs: [] })).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uses the page’s heading when given', async () => {
    fetchMock.mockResolvedValueOnce([post]);
    const el = await RelatedArticles({ vertical: 'ci-solar-storage', slugs: ['a-post'], heading: 'Further reading' });
    const markup = renderToStaticMarkup(el!);
    expect(markup).toContain('Further reading');
    expect(markup).not.toContain('Further reading on');
  });
});

// The article cards are server components, rendered to markup here.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ArticleCard } from './ArticleCard';
import { FeaturedArticleCard } from './FeaturedArticleCard';
import { SOLUTION_META } from '@/types/solutions';
import type { BlogPostCard, SanityImage } from '@/types/sanity';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);

const image: SanityImage = {
  _type: 'image',
  asset: { _id: 'image-abc-1200x800-jpg', url: 'https://cdn.sanity.io/images/p/production/abc-1200x800.jpg', metadata: { lqip: 'data:image/jpeg;base64,x' } },
  alt: 'A switchboard',
};

const post = (extra: Partial<BlogPostCard> = {}): BlogPostCard => ({
  _id: 'p1',
  title: 'Ekurhuleni Tariff C 2026/27',
  slug: { current: 'ekurhuleni-tariff-c' },
  category: 'Industry Insights',
  tags: ['Tariffs', 'Energy Optimisation'],
  excerpt: 'What the new tariff means for your site.',
  readTime: 6,
  publishedAt: '2026-10-08T08:00:00.000Z',
  heroImage: image,
  featured: false,
  author: { name: 'Ricardo De Sousa', slug: { current: 'ricardo' }, photo: image },
  ...extra,
});

const noService = post({ tags: ['Tariffs'] });

// Every hex in the markup must be a service accent (or its "on" ink), with an
// optional alpha: the badge fill and the placeholder gradient. The shared Card
// draws its hover edge in an arbitrary class (hover:border-[#cccccc]), which is
// the primitive's, not the article card's, so it is left out of the scan.
const ALLOWED = new Set(Object.values(SOLUTION_META).flatMap((m) => [m.accent, m.accentText].map((c) => c.toLowerCase())));
function strayHex(markup: string): string[] {
  const scanned = markup.replaceAll('hover:border-[#cccccc]', '');
  return (scanned.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).filter((hex) => !ALLOWED.has(hex.slice(0, 7).toLowerCase()));
}

describe('ArticleCard', () => {
  const markup = html(createElement(ArticleCard, { post: post() }));

  it('titles the card with an h3 by default and an h2 on request', () => {
    expect(markup).toMatch(/<h3 [^>]*>Ekurhuleni Tariff C 2026\/27<\/h3>/);
    expect(html(createElement(ArticleCard, { post: post(), headingLevel: 2 }))).toMatch(/<h2 [^>]*>Ekurhuleni Tariff C 2026\/27<\/h2>/);
  });

  it('gives every image an empty alt: the title names the link', () => {
    const imgs = markup.match(/<img\b[^>]*>/g) ?? [];
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) expect(img).toContain('alt=""');
  });

  it('ends in "Read article" and carries the category in the meta line', () => {
    expect(markup).toContain('Read article');
    expect(markup).toContain('Industry Insights · 8 Oct 2026 · 6 min read');
  });

  it("wears one badge, the service the tags name, and none when no tag names one", () => {
    expect(markup.match(/>Energy Optimisation</g)).toHaveLength(1);
    expect(markup).toContain('absolute bottom-3 left-3');
    const plain = html(createElement(ArticleCard, { post: noService }));
    expect(plain).not.toContain('absolute bottom-3 left-3');
    expect(plain).not.toContain('top-3 right-3');
  });

  it('uses no colour outside the tokens but the service accents', () => {
    expect(strayHex(markup)).toEqual([]);
    expect(strayHex(html(createElement(ArticleCard, { post: post({ heroImage: undefined as unknown as SanityImage }) })))).toEqual([]);
    expect(strayHex(html(createElement(ArticleCard, { post: { ...noService, heroImage: undefined as unknown as SanityImage } })))).toEqual([]);
  });

  it('carries no reveal wrapper: callers wrap it', () => {
    expect(markup.startsWith('<a ')).toBe(true);
  });
});

describe('FeaturedArticleCard', () => {
  const markup = html(createElement(FeaturedArticleCard, { post: post({ featured: true }) }));

  it('titles the card with an h2 by default and an h3 on request', () => {
    expect(markup).toMatch(/<h2 [^>]*>Ekurhuleni Tariff C 2026\/27<\/h2>/);
    expect(html(createElement(FeaturedArticleCard, { post: post(), headingLevel: 3 }))).toMatch(/<h3 [^>]*>Ekurhuleni Tariff C 2026\/27<\/h3>/);
  });

  it('carries the "Featured article" pill, the meta line, the author and "Read article"', () => {
    expect(markup).toContain('Featured article');
    expect(markup).toContain('Industry Insights · 8 Oct 2026 · 6 min read');
    expect(markup).toContain('Ricardo De Sousa');
    expect(markup).toContain('Read article');
  });

  it('gives every image an empty alt', () => {
    const imgs = markup.match(/<img\b[^>]*>/g) ?? [];
    expect(imgs.length).toBe(2);
    for (const img of imgs) expect(img).toContain('alt=""');
  });

  it('does not zoom the photo, and preloads it only when asked', () => {
    // The action pill presses (group-active:scale), but nothing zooms on hover.
    expect(markup).not.toMatch(/hover:scale-/);
    // next/image marks a priority photo with a preload link (and drops loading="lazy").
    expect(markup).not.toMatch(/fetchpriority="high"|rel="preload"/i);
    expect(html(createElement(FeaturedArticleCard, { post: post(), priority: true }))).toContain('rel="preload"');
  });

  it('draws a missing photo as the hero does, the service accent fading into Night Teal', () => {
    const solar = html(createElement(FeaturedArticleCard, { post: post({ tags: ['Solar & Storage'], heroImage: undefined as unknown as SanityImage }) }));
    expect(solar).toContain('linear-gradient(135deg, #E3C58D44 0%, var(--color-pe-nav-dark) 100%), var(--color-pe-nav-dark)');
    const plain = html(createElement(FeaturedArticleCard, { post: { ...noService, heroImage: undefined as unknown as SanityImage } }));
    expect(plain).toMatch(/background:var\(--color-pe-nav-dark\)/);
  });

  it('shows the initials when the author has no photo, and uses no colour outside the tokens', () => {
    const plain = html(createElement(FeaturedArticleCard, { post: { ...noService, heroImage: undefined as unknown as SanityImage, author: { name: 'Ricardo De Sousa', slug: { current: 'r' } } } }));
    expect(plain).toContain('>RD<');
    expect(strayHex(plain)).toEqual([]);
    expect(strayHex(markup)).toEqual([]);
  });
});

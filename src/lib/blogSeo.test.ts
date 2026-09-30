import { describe, expect, it } from 'vitest';
import { articleType, authorProfileJsonLd, authorUrl, blogArticleJsonLd, blogIndexPath, type BlogArticleSource } from './blogSeo';

const ORG = { '@type': 'Organization', '@id': 'https://phoenixenergy.solutions/#organization', name: 'Phoenix Energy' };
const author = { name: 'An Author', slug: 'an-author', role: 'Head of Wheeling', linkedin: 'https://www.linkedin.com/in/an-author', photoUrl: 'https://cdn.sanity.io/a.jpg' };
const post: BlogArticleSource = {
  title: 'How wheeling works',
  category: 'Industry Insights',
  tags: ['Wheeling', 'Solar & Storage'],
  excerpt: 'An excerpt.',
  seoDescription: null,
  publishedAt: '2026-10-01T08:00:00Z',
  updatedAt: null,
  author,
};
const page = { url: 'https://phoenixenergy.solutions/blog/how-wheeling-works', images: ['https://cdn.sanity.io/a-16x9.jpg'] };

describe('articleType', () => {
  it('calls company news and press releases news, and the rest blog posts', () => {
    expect(articleType('Company News')).toBe('NewsArticle');
    expect(articleType('Press Release')).toBe('NewsArticle');
    expect(articleType('Industry Insights')).toBe('BlogPosting');
    expect(articleType('Project Spotlight')).toBe('BlogPosting');
    expect(articleType(null)).toBe('BlogPosting');
  });
});

describe('blogArticleJsonLd', () => {
  it('describes the post by its author, for the organisation, on its own page', () => {
    expect(blogArticleJsonLd(post, page)).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'How wheeling works',
      description: 'An excerpt.',
      image: page.images,
      datePublished: '2026-10-01T08:00:00Z',
      dateModified: '2026-10-01T08:00:00Z',
      inLanguage: 'en-ZA',
      articleSection: 'Industry Insights',
      keywords: 'Wheeling, Solar & Storage',
      author: {
        '@type': 'Person',
        '@id': `${authorUrl('an-author')}#person`,
        name: 'An Author',
        url: 'https://phoenixenergy.solutions/blog/authors/an-author',
        jobTitle: 'Head of Wheeling',
        image: 'https://cdn.sanity.io/a.jpg',
        sameAs: ['https://www.linkedin.com/in/an-author'],
        worksFor: ORG,
      },
      publisher: ORG,
      mainEntityOfPage: { '@type': 'WebPage', '@id': page.url },
    });
  });

  it('keeps the display title as the headline, even beside an SEO title that names the brand', () => {
    const withSeoTitle = { ...post, seoTitle: 'How wheeling works | Phoenix Energy' };
    expect(blogArticleJsonLd(withSeoTitle, page).headline).toBe('How wheeling works');
  });

  it('prefers the meta description, and leaves out what is missing', () => {
    expect(blogArticleJsonLd({ ...post, seoDescription: 'A search line.' }, page).description).toBe('A search line.');
    const bare = blogArticleJsonLd({ ...post, excerpt: '  ', tags: [], category: null, updatedAt: '2026-10-02T08:00:00Z', author: { name: 'An Author', slug: 'an-author' } }, { url: page.url, images: [] });
    expect(bare).not.toHaveProperty('description');
    expect(bare).not.toHaveProperty('image');
    expect(bare).not.toHaveProperty('keywords');
    expect(bare).not.toHaveProperty('articleSection');
    expect(bare.dateModified).toBe('2026-10-02T08:00:00Z');
    expect(bare.author).not.toHaveProperty('sameAs');
    expect(bare.author).not.toHaveProperty('jobTitle');
  });
});

describe('authorProfileJsonLd', () => {
  it("makes the author's page a profile of them", () => {
    expect(authorProfileJsonLd({ ...author, bio: 'Leads wheeling.' })).toMatchObject({
      '@type': 'ProfilePage',
      url: 'https://phoenixenergy.solutions/blog/authors/an-author',
      mainEntity: { '@type': 'Person', name: 'An Author', description: 'Leads wheeling.', worksFor: ORG },
    });
  });
});

describe('blogIndexPath', () => {
  it('points a filtered or searched view at /blog, and a later page of the whole list at itself', () => {
    expect(blogIndexPath({ page: 1 })).toBe('/blog');
    expect(blogIndexPath({ page: 3 })).toBe('/blog?page=3');
    expect(blogIndexPath({ page: 2, category: 'Company News' })).toBe('/blog');
    expect(blogIndexPath({ page: 2, tag: 'Wheeling' })).toBe('/blog');
    expect(blogIndexPath({ page: 1, q: 'solar' })).toBe('/blog');
    expect(blogIndexPath({ page: 2, q: '   ' })).toBe('/blog?page=2');
  });
});

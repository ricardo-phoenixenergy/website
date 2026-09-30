import { describe, expect, it } from 'vitest';
import { DEFAULT_SHARE_IMAGE, SITE_URL, absoluteUrl, pageMetadata } from './seo';

describe('absoluteUrl', () => {
  it('gives the bare domain for home, the domain and path otherwise, and a URL as it is', () => {
    expect(absoluteUrl('/')).toBe(SITE_URL);
    expect(absoluteUrl('/about')).toBe(`${SITE_URL}/about`);
    expect(absoluteUrl('blog?page=2')).toBe(`${SITE_URL}/blog?page=2`);
    expect(absoluteUrl('https://example.org/a-post')).toBe('https://example.org/a-post');
  });
});

describe('pageMetadata', () => {
  it('gives a page every tag search and sharing need, with the default image', () => {
    const m = pageMetadata({ title: 'Contact Us', description: 'Reach out.', path: '/contact' });
    expect(m.title).toBe('Contact Us');
    expect(m.description).toBe('Reach out.');
    expect(m.alternates).toEqual({ canonical: `${SITE_URL}/contact` });
    expect(m.openGraph).toEqual({
      title: 'Contact Us | Phoenix Energy',
      description: 'Reach out.',
      url: `${SITE_URL}/contact`,
      siteName: 'Phoenix Energy',
      locale: 'en_ZA',
      type: 'website',
      images: [DEFAULT_SHARE_IMAGE],
    });
    expect(m.twitter).toEqual({
      card: 'summary_large_image',
      title: 'Contact Us | Phoenix Energy',
      description: 'Reach out.',
      images: [{ url: DEFAULT_SHARE_IMAGE.url, alt: DEFAULT_SHARE_IMAGE.alt }],
    });
    expect(m).not.toHaveProperty('robots');
    expect(m).not.toHaveProperty('pagination');
  });

  it('uses a title that already names the brand as written, and a sharing title and description when given', () => {
    const m = pageMetadata({
      title: 'Carbon Credit Solutions | Phoenix Energy',
      absoluteTitle: true,
      description: 'Earn from your solar.',
      path: '/solutions/carbon-credits',
      shareTitle: 'Earn from carbon',
      shareDescription: 'A short line.',
    });
    expect(m.title).toEqual({ absolute: 'Carbon Credit Solutions | Phoenix Energy' });
    expect(m.openGraph).toMatchObject({ title: 'Earn from carbon', description: 'A short line.' });
    expect(m.twitter).toMatchObject({ title: 'Earn from carbon', description: 'A short line.' });
    expect(pageMetadata({ title: 'A | Phoenix Energy', absoluteTitle: true, path: '/a' }).openGraph).toMatchObject({ title: 'A | Phoenix Energy' });
  });

  it("never lets a page without a description inherit another page's", () => {
    for (const description of [undefined, null, '   ']) {
      const m = pageMetadata({ title: 'St Andrews Office Park', description, path: '/projects/st-andrews-office-park' });
      expect(m.description).toBeNull();
      expect(m.openGraph).not.toHaveProperty('description');
      expect(m.twitter).not.toHaveProperty('description');
    }
  });

  it('makes a project or a post an article, with its dates, authors and tags', () => {
    const m = pageMetadata({
      title: 'A post',
      path: '/blog/a-post',
      article: { publishedTime: '2026-01-01T08:00:00Z', modifiedTime: null, authors: [`${SITE_URL}/blog/authors/a`], tags: ['Wheeling'] },
    });
    expect(m.openGraph).toMatchObject({ type: 'article', publishedTime: '2026-01-01T08:00:00Z', authors: [`${SITE_URL}/blog/authors/a`], tags: ['Wheeling'] });
    expect(m.openGraph).not.toHaveProperty('modifiedTime');
  });

  it('keeps a page out of search when asked, still following its links', () => {
    expect(pageMetadata({ title: 'News & Insights', path: '/blog', noindex: true }).robots).toEqual({ index: false, follow: true });
  });

  it('links the previous and next pages of a list', () => {
    expect(pageMetadata({ title: 'News & Insights', path: '/blog?page=2', pagination: { previous: '/blog', next: '/blog?page=3' } }).pagination).toEqual({
      previous: `${SITE_URL}/blog`,
      next: `${SITE_URL}/blog?page=3`,
    });
    expect(pageMetadata({ title: 'News & Insights', path: '/blog', pagination: { next: '/blog?page=2' } }).pagination).toEqual({ next: `${SITE_URL}/blog?page=2` });
    expect(pageMetadata({ title: 'News & Insights', path: '/blog', pagination: {} })).not.toHaveProperty('pagination');
  });

  it('points the canonical at the first publisher of a syndicated post, and keeps og:url on this site', () => {
    const m = pageMetadata({ title: 'A post', path: '/blog/a-post', canonical: 'https://example.org/original' });
    expect(m.alternates).toEqual({ canonical: 'https://example.org/original' });
    expect(m.openGraph).toMatchObject({ url: `${SITE_URL}/blog/a-post` });
  });

  it('gives the home page the bare domain', () => {
    const m = pageMetadata({ title: 'Home', absoluteTitle: true, path: '/' });
    expect(m.alternates).toEqual({ canonical: SITE_URL });
    expect(m.openGraph).toMatchObject({ url: SITE_URL });
  });

  it("shares a page's own image when it has one", () => {
    const image = { url: `${SITE_URL}/og-solutions-wheeling.jpg`, width: 1200, height: 630, alt: 'Pylons at dusk.' };
    const m = pageMetadata({ title: 'Wheeling', path: '/solutions/wheeling', image });
    expect(m.openGraph).toMatchObject({ images: [image] });
    expect(m.twitter).toMatchObject({ images: [{ url: image.url, alt: image.alt }] });
  });
});

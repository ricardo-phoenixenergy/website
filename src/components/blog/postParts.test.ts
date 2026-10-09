// The post page's parts, rendered to markup. Only one post is live, so the
// layouts a single post can't show (no bio, one, two or three related posts)
// are checked here.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PortableText } from '@portabletext/react';
import { describe, expect, it } from 'vitest';
import { postHeadings } from '@/lib/blogUtils';
import { postTextComponents } from '@/lib/postTextComponents';
import { STICKY_BOTTOM_GAP, STICKY_TOP } from '@/lib/stickyFit';
import type { Author, BlogPostCard, PortableTextBlock, SanityImage } from '@/types/sanity';
import { TableOfContents } from './TableOfContents';
import { AuthorCard } from './AuthorCard';
import { PostNext } from './PostNext';
import { StatStrip } from './StatStrip';
import { InlineCta } from './InlineCta';
import { Callout } from './Callout';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);

const block = (key: string, style: string, text: string) =>
  ({ _type: 'block', _key: key, style, markDefs: [], children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }] }) as unknown as PortableTextBlock;

const image: SanityImage = {
  _type: 'image',
  asset: { _id: 'image-abc-1200x800-jpg', url: 'https://cdn.sanity.io/images/p/production/abc-1200x800.jpg', metadata: { lqip: 'data:image/jpeg;base64,x' } },
  alt: 'A switchboard',
};

const post = (n: number): BlogPostCard => ({
  _id: `p${n}`,
  title: `Post number ${n}`,
  slug: { current: `post-${n}` },
  category: 'Industry Insights',
  tags: ['Energy Optimisation'],
  excerpt: 'What the new tariff means for your site.',
  readTime: 6,
  publishedAt: '2026-10-08T08:00:00.000Z',
  heroImage: image,
  featured: false,
  author: { name: 'Ricardo De Sousa', slug: { current: 'ricardo' } },
});

const author = (extra: Partial<Author> = {}): Author => ({
  _id: 'a1',
  name: 'Ricardo De Sousa',
  slug: { current: 'ricardo-de-sousa' },
  role: 'Founder',
  ...extra,
});

describe('postTextComponents', () => {
  const body = [block('a', 'h2', 'Summary'), block('b', 'normal', 'Body text.'), block('c', 'h2', 'Summary'), block('d', 'h3', 'Low season')];
  const markup = html(createElement(PortableText, { value: body, components: postTextComponents(postHeadings(body)) }));

  it('gives repeated headings their own ids', () => {
    expect(markup).toContain('<h2 id="summary"');
    expect(markup).toContain('<h2 id="summary-2"');
    expect(markup).toContain('<h3 id="low-season"');
  });

  it('sets the h2 at 26px, as the project chapter headline', () => {
    expect(markup).toMatch(/<h2 id="summary" class="[^"]*\btext-\[26px\][^"]*\bleading-\[1\.2\]/);
  });

  it('renders a heading it has no entry for without an id', () => {
    const plain = html(createElement(PortableText, { value: [block('x', 'h2', 'Orphan')], components: postTextComponents([]) }));
    expect(plain).toMatch(/^<h2 class="/);
  });
});

describe('TableOfContents', () => {
  const items = postHeadings([block('a', 'h2', 'Why Tariff C is a legacy tariff'), block('b', 'h3', 'Low season')]);

  it('renders the panel as a nav labelled by its h2, with an ordered list of links to the ids', () => {
    const markup = html(createElement(TableOfContents, { items, variant: 'panel' }));
    expect(markup).toMatch(/^<nav aria-labelledby="toc-title"/);
    expect(markup).toMatch(/<h2 id="toc-title"[^>]*>In this article<\/h2>/);
    expect(markup).toContain('<ol');
    expect([...markup.matchAll(/href="([^"]+)"/g)].map((m) => m[1])).toEqual(['#why-tariff-c-is-a-legacy-tariff', '#low-season']);
    expect(markup).not.toContain('style=');
  });

  it('renders the disclosure as a closed details inside a named nav', () => {
    const markup = html(createElement(TableOfContents, { items, variant: 'disclosure' }));
    expect(markup).toMatch(/^<nav aria-label="In this article"/);
    expect(markup).toMatch(/<details\b(?![^>]*\bopen\b)[^>]*>\s*<summary\b[^>]*>In this article/);
    expect([...markup.matchAll(/href="([^"]+)"/g)]).toHaveLength(2);
  });

  it('gives each number a fixed width in tabular figures, so the item text lines up', () => {
    const markup = html(createElement(TableOfContents, { items, variant: 'panel' }));
    const numbers = [...markup.matchAll(/<span class="([^"]*)">0\d<\/span>/g)].map((m) => m[1].split(' '));
    expect(numbers).toHaveLength(2);
    for (const classes of numbers) expect(classes).toEqual(expect.arrayContaining(['w-5', 'shrink-0', 'tabular-nums']));
  });

  it('caps the panel at the window less the sticky top and margin, with the list scrolling inside it', () => {
    const markup = html(createElement(TableOfContents, { items, variant: 'panel' }));
    const nav = markup.match(/^<nav [^>]*class="([^"]*)"/)?.[1].split(' ') ?? [];
    expect(nav).toEqual(expect.arrayContaining(['flex', 'flex-col', `max-h-[calc(100vh-${STICKY_TOP + STICKY_BOTTOM_GAP}px)]`]));
    const list = markup.match(/<div class="([^"]*)"[^>]*>\s*<ol/)?.[1].split(' ') ?? [];
    expect(list).toEqual(expect.arrayContaining(['min-h-0', 'overflow-y-auto', 'relative']));
    // Every item is a link, so Tab reaches each one and scrolls the list: the list adds no tab stop of its own.
    expect(markup).not.toContain('tabindex');
    expect([...markup.matchAll(/<li\b[^>]*>\s*<a href=/g)]).toHaveLength(2);
  });

  it('leaves the disclosure uncapped: it opens in the page flow', () => {
    const markup = html(createElement(TableOfContents, { items, variant: 'disclosure' }));
    expect(markup).not.toMatch(/max-h-|overflow-y-auto/);
  });

  it('renders nothing without headings', () => {
    expect(html(createElement(TableOfContents, { items: [], variant: 'panel' }))).toBe('');
    expect(html(createElement(TableOfContents, { items: [], variant: 'disclosure' }))).toBe('');
  });
});

describe('AuthorCard', () => {
  it('is a panel headed "About the author", linking the name to the author page', () => {
    const markup = html(createElement(AuthorCard, { author: author({ bio: 'Writes about tariffs.' }) }));
    expect(markup).toMatch(/aria-labelledby="author-title"/);
    expect(markup).toMatch(/<h2 id="author-title"[^>]*>About the author<\/h2>/);
    expect(markup).toContain('href="/blog/authors/ricardo-de-sousa"');
    expect(markup).toMatch(/<p class="[^"]*\bmt-3\b[^"]*">Writes about tariffs\.<\/p>/);
  });

  it('leaves no gap without a bio, and the photo has empty alt text beside the name', () => {
    const markup = html(createElement(AuthorCard, { author: author({ photo: image }) }));
    expect(markup).not.toMatch(/<p class="[^"]*\bmt-3\b/);
    expect(markup).toMatch(/<img[^>]*alt=""/);
    expect(markup).not.toMatch(/#39575C|#E5E7EB/i);
  });

  it("links the author's LinkedIn profile in a new tab, named for where it goes", () => {
    const markup = html(createElement(AuthorCard, { author: author({ linkedin: 'https://www.linkedin.com/in/ricardo-de-sousa-za' }) }));
    const link = markup.match(/<a [^>]*href="https:\/\/www\.linkedin\.com\/in\/ricardo-de-sousa-za"[^>]*>/)?.[0] ?? '';
    expect(link).toContain('target="_blank"');
    expect(link).toMatch(/rel="[^"]*\bnoopener\b[^"]*"/);
    expect(link).toContain('aria-label="Ricardo De Sousa on LinkedIn (opens in a new tab)"');
  });

  it('shows no LinkedIn link without a profile', () => {
    expect(html(createElement(AuthorCard, { author: author() }))).not.toContain('linkedin.com');
  });
});

describe('PostNext', () => {
  it('renders nothing without related posts', () => {
    expect(html(createElement(PostNext, { posts: [] }))).toBe('');
  });

  it('shows three cards with h3 titles under "More articles"', () => {
    const markup = html(createElement(PostNext, { posts: [post(1), post(2), post(3)] }));
    expect(markup).toMatch(/^<section aria-labelledby="more-articles"/);
    expect(markup).toMatch(/<h2 id="more-articles"[^>]*>More articles<\/h2>/);
    expect(markup.match(/<h3\b/g)).toHaveLength(3);
    expect(markup).toContain('md:grid-cols-3');
  });

  it('shows two large cards for two posts', () => {
    const markup = html(createElement(PostNext, { posts: [post(1), post(2)] }));
    expect(markup.match(/<h3\b/g)).toHaveLength(2);
    expect(markup).toContain('md:grid-cols-2');
    expect(markup).not.toContain('md:grid-cols-3');
    expect(markup).toContain('text-xl');
  });

  it('shows one wide card, its pill naming the service, for one post', () => {
    const markup = html(createElement(PostNext, { posts: [post(1)] }));
    expect(markup.match(/<h3\b/g)).toHaveLength(1);
    expect(markup).toContain('sm:grid-cols-[3fr_2fr]');
    expect(markup).toContain('>Energy Optimisation</span>');
    expect(markup).not.toContain('Featured article');
  });
});

describe('rich blocks', () => {
  it('draws the stat strip on Night Teal with 24px values and on-dark-muted labels', () => {
    const markup = html(createElement(StatStrip, { stats: [{ value: 'R321/kVA', label: 'Demand charge' }, { value: '+33%', label: 'Increase' }] }));
    expect(markup).toContain('bg-pe-nav-dark');
    expect(markup).toMatch(/class="[^"]*\btext-2xl\b[^"]*">R321\/kVA</);
    expect(markup).toMatch(/class="[^"]*\btext-on-dark-muted\b[^"]*">Demand charge</);
    expect(markup).not.toMatch(/on-dark-subtle|rgba\(|#[0-9a-fA-F]{3,6}\b/);
  });

  it('draws the inline CTA with an 18px title and a 14px on-dark-muted subtitle', () => {
    const markup = html(createElement(InlineCta, { title: 'Still on Tariff C?', subtitle: 'Send us your bills.', btnText: 'Request a review', btnHref: '/contact' }));
    expect(markup).toMatch(/<p class="[^"]*\btext-lg\b[^"]*\btext-white\b[^"]*">Still on Tariff C\?<\/p>/);
    expect(markup).toMatch(/<p class="[^"]*\btext-sm\b[^"]*\btext-on-dark-muted\b[^"]*">Send us your bills\.<\/p>/);
    expect(markup).not.toMatch(/on-dark-subtle|rgba\(|#[0-9a-fA-F]{3,6}\b/);
  });

  it('sets the callout at 16px, in token colours', () => {
    for (const type of ['info', 'warning', 'stat'] as const) {
      const markup = html(createElement(Callout, { type, title: 'Illustrative figures', text: 'Costs exclude VAT.' }));
      expect(markup).toMatch(/class="[^"]*\btext-base\b[^"]*\bfont-bold\b[^"]*">Illustrative figures</);
      expect(markup).toMatch(/class="[^"]*\btext-base\b[^"]*">Costs exclude VAT\.</);
      expect(markup).not.toMatch(/style=|rgba\(|#[0-9a-fA-F]{3,6}\b/);
    }
  });
});

import { describe, expect, it } from 'vitest';
import { activeHeadingId, blogFilterOptions, formatDate, initials, postDateLine, postHeadings, postMetaLine, postVertical, postWordCount, relatedLayout } from './blogUtils';
import { articleCta } from '@/config/ctas';
import type { PortableTextBlock } from '@/types/sanity';

const block = (key: string, style: string, text: string) =>
  ({ _type: 'block', _key: key, style, children: [{ _type: 'span', text }] }) as unknown as PortableTextBlock;

describe('formatDate', () => {
  it('writes the short form by default and the long form on request', () => {
    expect(formatDate('2026-10-08T08:00:00.000Z')).toBe('8 Oct 2026');
    expect(formatDate('2026-10-08T08:00:00.000Z', 'long')).toBe('8 October 2026');
  });
});

describe('initials', () => {
  it('takes the first letter of the first two words', () => {
    expect(initials('Ricardo De Sousa')).toBe('RD');
    expect(initials('  ')).toBe('');
  });
});

describe('postVertical', () => {
  it('returns the service of the first tag that names one', () => {
    expect(postVertical(['Tariffs', 'Energy Optimisation', 'Wheeling'])).toBe('energy-optimisation');
  });
  it('returns null when no tag names a service, or there are no tags', () => {
    expect(postVertical(['Tariffs'])).toBeNull();
    expect(postVertical(null)).toBeNull();
  });
});

describe('postMetaLine', () => {
  it('joins the category, the date and the read time with middle dots', () => {
    expect(postMetaLine({ category: 'Industry Insights', publishedAt: '2026-10-08T08:00:00.000Z', readTime: 6 })).toBe('Industry Insights · 8 Oct 2026 · 6 min read');
  });
  it('leaves out a missing read time instead of printing " min read"', () => {
    expect(postMetaLine({ category: 'Company News', publishedAt: '2026-10-08T08:00:00.000Z', readTime: 0 })).toBe('Company News · 8 Oct 2026');
  });
});

describe('postHeadings', () => {
  it('lists h2 and h3 blocks with ids from their text', () => {
    expect(postHeadings([block('a', 'h2', 'Why Tariff C is a legacy tariff'), block('b', 'normal', 'Body'), block('c', 'h3', 'Low season')])).toEqual([
      { key: 'a', id: 'why-tariff-c-is-a-legacy-tariff', text: 'Why Tariff C is a legacy tariff', level: 'h2' },
      { key: 'c', id: 'low-season', text: 'Low season', level: 'h3' },
    ]);
  });
  it('gives repeated headings distinct ids', () => {
    expect(postHeadings([block('a', 'h2', 'Summary'), block('b', 'h2', 'Summary')]).map((h) => h.id)).toEqual(['summary', 'summary-2']);
  });
  it('skips empty headings and survives a missing body', () => {
    expect(postHeadings([block('a', 'h2', '   ')])).toEqual([]);
    expect(postHeadings(undefined)).toEqual([]);
  });
});

describe('blogFilterOptions', () => {
  it('offers only categories and tags that have posts, with counts, categories first', () => {
    const rows = [
      { category: 'Industry Insights', tags: ['Energy Optimisation'] },
      { category: 'Industry Insights', tags: ['Wheeling', 'Energy Optimisation'] },
      { category: 'Company News', tags: null },
    ];
    expect(blogFilterOptions(rows)).toEqual([
      { kind: 'category', value: 'Industry Insights', count: 2 },
      { kind: 'category', value: 'Company News', count: 1 },
      { kind: 'tag', value: 'Energy Optimisation', count: 2 },
      { kind: 'tag', value: 'Wheeling', count: 1 },
    ]);
  });
});

describe('relatedLayout', () => {
  it('follows the project rule: three cards, two large, or one wide', () => {
    expect(relatedLayout(0)).toBeNull();
    expect(relatedLayout(1)).toBe('wide');
    expect(relatedLayout(2)).toBe('two');
    expect(relatedLayout(3)).toBe('three');
  });
});

describe('articleCta', () => {
  it("uses the service's booking label and names the article in the message", () => {
    const cta = articleCta('energy-optimisation', 'Ekurhuleni Tariff C 2026/27');
    expect(cta.label).toBe('Book a free energy audit');
    // contactHref encodes with URLSearchParams (spaces as "+"), so read the message back the same way.
    const message = new URL(cta.href, 'https://phoenixenergy.solutions').searchParams.get('message');
    expect(message).toContain('I read your article "Ekurhuleni Tariff C 2026/27".');
  });
  it('falls back to the discovery meeting when no tag names a service', () => {
    expect(articleCta(null, 'A post').label).toBe('Book a discovery meeting');
  });
});

describe('activeHeadingId', () => {
  it('picks the last heading whose top has passed the line under the navbar', () => {
    expect(activeHeadingId([{ id: 'a', top: -400 }, { id: 'b', top: 112 }, { id: 'c', top: 600 }])).toBe('b');
  });
  it('picks none while the first heading is still below the line, as after a jump back to the top', () => {
    expect(activeHeadingId([{ id: 'a', top: 300 }, { id: 'b', top: 900 }])).toBeNull();
    expect(activeHeadingId([])).toBeNull();
  });
});

describe('postDateLine', () => {
  it('shows the update date beside the publish date when the post changed on a later day', () => {
    expect(postDateLine({ publishedAt: '2026-10-08T08:00:00.000Z', updatedAt: '2026-10-09T12:00:00.000Z', readTime: 6 })).toBe('8 October 2026 · Updated 9 October 2026 · 6 min read');
  });

  it('leaves the update out when it is missing, unreadable, the same day or earlier', () => {
    const line = '8 October 2026 · 6 min read';
    expect(postDateLine({ publishedAt: '2026-10-08T08:00:00.000Z', updatedAt: null, readTime: 6 })).toBe(line);
    expect(postDateLine({ publishedAt: '2026-10-08T08:00:00.000Z', updatedAt: 'not a date', readTime: 6 })).toBe(line);
    expect(postDateLine({ publishedAt: '2026-10-08T08:00:00.000Z', updatedAt: '2026-10-08T15:00:00.000Z', readTime: 6 })).toBe(line);
    expect(postDateLine({ publishedAt: '2026-10-08T08:00:00.000Z', updatedAt: '2026-10-01T08:00:00.000Z', readTime: 6 })).toBe(line);
  });

  it('compares days in South African time, and leaves out a missing read time', () => {
    // 23:30 UTC on 8 October is already 9 October in Johannesburg.
    expect(postDateLine({ publishedAt: '2026-10-08T08:00:00.000Z', updatedAt: '2026-10-08T23:30:00.000Z', readTime: 0 })).toBe('8 October 2026 · Updated 9 October 2026');
  });
});

describe('postWordCount', () => {
  it('counts the words in the text blocks and the list items, and nothing else', () => {
    const body = [block('a', 'h2', 'Why it pays'), block('b', 'normal', 'One short peak sets the charge.'), { _type: 'statStrip', _key: 'c' } as unknown as PortableTextBlock];
    expect(postWordCount(body)).toBe(9);
    expect(postWordCount(undefined)).toBe(0);
  });
});

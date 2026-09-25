// The blog post template has no published post to render in a browser, so its
// buttons are checked here, rendered to markup.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ShareButtons } from './ShareButtons';
import { InlineCta } from './InlineCta';
import { BlogPagination, pageSlots } from './BlogPagination';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);
const controls = (markup: string) => [...markup.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/g)];
const attr = (attrs: string, name: string) => attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

describe('ShareButtons', () => {
  const markup = html(createElement(ShareButtons, { url: 'https://phoenixenergy.solutions/blog/a-post', title: 'A post' }));
  const found = controls(markup);

  it('draws three 44px outline icon buttons, named for what they do', () => {
    expect(found.map(([, , attrs]) => attr(attrs, 'aria-label'))).toEqual(['Share on LinkedIn', 'Share on X', 'Copy link']);
    for (const [, , attrs] of found) {
      expect(attr(attrs, 'class')?.split(' ')).toEqual(expect.arrayContaining(['size-11', 'rounded-full', 'border', 'bg-white']));
    }
  });

  it('shows a drawn glyph in each, not a letter or an emoji', () => {
    for (const [, , , inner] of found) {
      expect(inner).toMatch(/^<svg\b[\s\S]*<\/svg>$/);
    }
    expect(markup).not.toMatch(/🔗|✓|>in<|>X</);
  });

  it('draws the filled LinkedIn square at 16px, so it matches the open 20px glyphs beside it', () => {
    const svgClass = found.map(([, , , inner]) => attr(inner.match(/^<svg\b[^>]*>/)?.[0] ?? '', 'class'));
    expect(svgClass).toEqual(['size-4', undefined, undefined]);
  });

  it('opens the two share links in a new tab and keeps the copy button out of any form', () => {
    const [linkedIn, x, copy] = found;
    for (const [, tag, attrs] of [linkedIn, x]) {
      expect(tag).toBe('a');
      expect(attr(attrs, 'target')).toBe('_blank');
      expect(attr(attrs, 'rel')).toBe('noopener noreferrer');
    }
    expect(attr(linkedIn[2], 'href')).toContain('linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fphoenixenergy.solutions');
    expect(attr(x[2], 'href')).toContain('x.com/intent/tweet?url=');
    expect(copy[1]).toBe('button');
    expect(attr(copy[2], 'type')).toBe('button');
    expect(attr(copy[2], 'title')).toBe('Copy link');
  });
});

describe('InlineCta', () => {
  it('draws the light compact button, ending with an arrow, on a dark block that turns the focus ring white', () => {
    const markup = html(createElement(InlineCta, { title: 'Talk to us', btnText: 'Book a call', btnHref: '/contact' }));
    expect(markup).toMatch(/^<div class="focus-on-dark /);
    const [[, tag, attrs, inner]] = controls(markup);
    expect(tag).toBe('a');
    expect(inner).toMatch(/^Book a call <svg\b[\s\S]*<\/svg>$/);
    expect(attr(attrs, 'href')).toBe('/contact');
    expect(attr(attrs, 'target')).toBeUndefined();
    expect(attr(attrs, 'class')?.split(' ')).toEqual(
      expect.arrayContaining(['min-h-10', 'px-4', 'hit-area', 'bg-pe-bg', 'text-pe-nav-dark', 'text-sm', 'font-semibold']),
    );
  });

  it('opens an external link in a new tab', () => {
    const markup = html(createElement(InlineCta, { title: 'Read more', btnText: 'Open the report', btnHref: 'https://example.com/report' }));
    const [[, , attrs]] = controls(markup);
    expect(attr(attrs, 'href')).toBe('https://example.com/report');
    expect(attr(attrs, 'target')).toBe('_blank');
    expect(attr(attrs, 'rel')).toBe('noopener noreferrer');
  });
});

describe('BlogPagination', () => {
  const pagination = (page: number, totalPages: number) =>
    html(createElement(BlogPagination, { page, totalPages, hrefFor: (p: number) => `/blog?page=${p}` }));
  const labels = (markup: string) => controls(markup).map(([, , , inner]) => inner.replace(/<svg[\s\S]*?<\/svg>/g, '').trim());

  it('shows every page up to 7, then the first, the last and the current page with one either side', () => {
    expect(pageSlots(2, 3)).toEqual([1, 2, 3]);
    expect(pageSlots(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(pageSlots(1, 10)).toEqual([1, 2, 'gap', 10]);
    expect(pageSlots(4, 10)).toEqual([1, 2, 3, 4, 5, 'gap', 10]);
    expect(pageSlots(5, 10)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10]);
    expect(pageSlots(7, 10)).toEqual([1, 'gap', 6, 7, 8, 9, 10]);
    expect(pageSlots(10, 10)).toEqual([1, 'gap', 9, 10]);
    for (let total = 8; total <= 10; total++) {
      for (let page = 1; page <= total; page++) expect(pageSlots(page, total).length).toBeLessThanOrEqual(7);
    }
  });

  it('wraps, centred, inside the page container, with 10px between wrapped rows', () => {
    const cls = pagination(2, 10).match(/^<div class="([^"]*)"/)?.[1].split(' ');
    expect(cls).toEqual(expect.arrayContaining(['page-container', 'flex', 'flex-wrap', 'justify-center', 'gap-x-2', 'gap-y-2.5']));
  });

  it('draws Prev, the numbers and Next as chip links, with the current page filled', () => {
    const markup = pagination(5, 10);
    const found = controls(markup);
    expect(labels(markup)).toEqual(['Prev', '1', '4', '5', '6', '10', 'Next']);
    expect(found.map(([, , attrs]) => attr(attrs, 'href'))).toEqual(
      [4, 1, 4, 5, 6, 10, 6].map((p) => `/blog?page=${p}`),
    );
    expect(found.map(([, , attrs]) => attr(attrs, 'aria-current'))).toEqual([undefined, undefined, undefined, 'page', undefined, undefined, undefined]);
    for (const [, tag, attrs] of found) {
      expect(tag).toBe('a');
      expect(attr(attrs, 'class')?.split(' ')).toEqual(expect.arrayContaining(['h-9', 'hit-area', 'rounded-full']));
    }
    expect(markup.match(/<span aria-hidden="true"[^>]*>…<\/span>/g)).toHaveLength(2);
  });

  it('leaves out Prev on the first page, Next on the last, and the whole row for one page', () => {
    expect(labels(pagination(1, 3))).toEqual(['1', '2', '3', 'Next']);
    expect(labels(pagination(3, 3))).toEqual(['Prev', '1', '2', '3']);
    expect(pagination(1, 1)).toBe('');
  });
});

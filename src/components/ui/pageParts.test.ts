import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PageBreadcrumb } from './PageBreadcrumb';
import { ClosingBand } from './ClosingBand';
import { SidePanel } from './SidePanel';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);

describe('PageBreadcrumb', () => {
  const trail = [{ label: 'Home', href: '/' }, { label: 'News & Insights', href: '/blog' }, { label: 'A long post title' }];
  const markup = html(createElement(PageBreadcrumb, { trail, action: createElement('button', { type: 'button' }, 'Act') }));

  it('marks the current crumb, truncates it and hides the separators from screen readers', () => {
    expect(markup).toContain('aria-label="Breadcrumb"');
    expect(markup).toMatch(/aria-current="page" class="[^"]*\btruncate\b[^"]*">A long post title</);
    expect(markup.match(/aria-hidden="true">\/</g)).toHaveLength(2);
    expect(markup).toContain('href="/blog"');
  });

  it('hides the first crumb below sm when the trail has three or more', () => {
    const firstLi = markup.match(/<li class="([^"]*)"/)?.[1] ?? '';
    expect(firstLi).toMatch(/\bhidden\b/);
    expect(firstLi).toMatch(/\bsm:flex\b/);
  });

  it('puts the action after the nav', () => {
    expect(markup.indexOf('</nav>')).toBeLessThan(markup.indexOf('>Act</button>'));
  });

  it('keeps the first crumb on a two-crumb trail', () => {
    const two = html(createElement(PageBreadcrumb, { trail: [{ label: 'Home', href: '/' }, { label: 'Projects' }] }));
    const firstLi = two.match(/<li class="([^"]*)"/)?.[1] ?? '';
    expect(firstLi).not.toMatch(/\bhidden\b/);
    expect(two.match(/aria-hidden="true">\/</g)).toHaveLength(1);
    expect(two).toMatch(/aria-current="page"[^>]*>Projects</);
  });
});

describe('ClosingBand', () => {
  const props = {
    eyebrow: 'Start your project',
    heading: 'Want to know what this means for your site?',
    body: 'Tell us about your site.',
    primary: { label: 'Book a free energy audit', href: '/contact?m=x' },
    primaryLocation: 'post_band:a',
    secondary: { label: 'View all articles', href: '/blog' },
  };

  it('has one h2 with the heading, then the primary and the secondary links in that order', () => {
    const markup = html(createElement(ClosingBand, props));
    expect(markup.match(/<h2\b/g)).toHaveLength(1);
    expect(markup).toMatch(/<h2[^>]*>Want to know what this means for your site\?<\/h2>/);
    expect([...markup.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1])).toEqual(['/contact?m=x', '/blog']);
  });

  it('keeps the gap above itself only after content', () => {
    expect(html(createElement(ClosingBand, props))).not.toMatch(/\bmt-5\b/);
    expect(html(createElement(ClosingBand, { ...props, afterContent: true }))).toMatch(/\bmt-5\b/);
  });

  it('takes its colours from tokens', () => {
    expect(html(createElement(ClosingBand, props))).not.toMatch(/#[0-9a-f]{3,8}\b|rgba\(/i);
  });
});

describe('SidePanel', () => {
  it('is labelled by its h2, in the panel frame', () => {
    const markup = html(createElement(SidePanel, { title: 'In this article', titleId: 'toc-title' }, 'Body'));
    expect(markup).toMatch(/^<section aria-labelledby="toc-title" class="[^"]*\brounded-card\b[^"]*\bp-6\b/);
    expect(markup).toMatch(/<h2 id="toc-title"[^>]*>In this article<\/h2>Body/);
  });

  it('can be a nav', () => {
    expect(html(createElement(SidePanel, { title: 'In this article', titleId: 'toc-title', as: 'nav' }, 'Body'))).toMatch(/^<nav aria-labelledby="toc-title"/);
  });
});

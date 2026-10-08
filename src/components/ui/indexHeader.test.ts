import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { IndexHeader } from './IndexHeader';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);

describe('IndexHeader', () => {
  const markup = html(
    createElement(IndexHeader, {
      crumb: 'News & Insights',
      eyebrow: 'News & Insights',
      title: createElement('span', null, 'Energy intelligence, ', createElement('em', { className: 'not-italic text-pe-primary' }, 'delivered')),
      intro: 'Expert perspectives on clean energy.',
    }),
  );

  it('has one H1 and the intro', () => {
    expect(markup.match(/<h1\b/g)).toHaveLength(1);
    expect(markup).toMatch(/<h1 [^>]*>.*Energy intelligence, .*delivered.*<\/h1>/);
    expect(markup).toContain('Expert perspectives on clean energy.');
  });

  it('opens with a two-crumb breadcrumb: Home, then the current page', () => {
    expect(markup.indexOf('aria-label="Breadcrumb"')).toBeLessThan(markup.indexOf('<h1'));
    expect(markup).toContain('href="/"');
    expect(markup).toMatch(/aria-current="page"[^>]*>News &amp; Insights</);
    expect(markup.match(/aria-hidden="true">\/</g)).toHaveLength(1);
    // Two crumbs: Home stays on phones.
    expect(markup.match(/<li class="([^"]*)"/)?.[1]).not.toMatch(/\bhidden\b/);
  });

  it('draws the eyebrow in pe-muted', () => {
    expect(markup).toMatch(/<p class="[^"]*\btext-pe-muted\b[^"]*\buppercase\b[^"]*">News &amp; Insights<\/p>|<p class="[^"]*\buppercase\b[^"]*\btext-pe-muted\b[^"]*">News &amp; Insights<\/p>/);
    expect(markup).not.toContain('text-pe-secondary-ink');
  });
});

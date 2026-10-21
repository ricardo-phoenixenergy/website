import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from './SiteFooter';

const render = (showBlog: boolean) => renderToStaticMarkup(createElement(SiteFooter, { showBlog }));

describe('SiteFooter', () => {
  it('links every solution page and the Gauteng page from the server HTML', () => {
    const markup = render(true);
    for (const href of [
      '/solutions/ci-solar-storage',
      '/solutions/wheeling',
      '/solutions/energy-optimisation',
      '/solutions/carbon-credits',
      '/solutions/webuysolar',
      '/solutions/ev-fleets',
      '/solutions/ci-solar-storage/gauteng',
    ]) {
      expect(markup).toContain(`href="${href}"`);
    }
  });

  it('links the company pages and keeps the legal links', () => {
    const markup = render(true);
    for (const href of ['/projects', '/tools', '/about', '/contact', '/privacy-policy', '/terms-of-use', '/disclaimer']) {
      expect(markup).toContain(`href="${href}"`);
    }
  });

  it('links News & Insights only when the layout says a post is live', () => {
    expect(render(true)).toContain('href="/blog"');
    expect(render(false)).not.toContain('href="/blog"');
  });
});

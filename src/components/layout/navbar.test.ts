// The navbar is a client component; it is rendered to markup here, on /blog, with
// the pathname hook stubbed.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from './Navbar';

vi.mock('next/navigation', () => ({ usePathname: () => '/blog' }));

const render = (showBlog: boolean) => renderToStaticMarkup(createElement(Navbar, { showBlog }));
/** The classes of the first link to `href`: the nav link, ahead of the "Get in touch" button. */
const classOf = (markup: string, href: string) => {
  const tag = (markup.match(/<a [^>]*>/g) ?? []).find((t) => t.includes(`href="${href}"`)) ?? '';
  return tag.match(/class="([^"]*)"/)?.[1] ?? '';
};

describe('Navbar', () => {
  it('links to News & Insights only when the layout says a post is live', () => {
    expect(render(true)).toContain('href="/blog"');
    expect(render(false)).not.toContain('href="/blog"');
  });

  it('keeps every label on one line in a pill wide enough for them, so the blog link never wraps', () => {
    const markup = render(true);
    // The current page's link (bold) and the others (medium) alike.
    expect(classOf(markup, '/blog').split(' ')).toContain('whitespace-nowrap');
    expect(classOf(markup, '/projects').split(' ')).toContain('whitespace-nowrap');
    expect(classOf(markup, '/contact').split(' ')).toContain('whitespace-nowrap');
    // Measured: with News & Insights in bold, the desktop pill's content needs 935px.
    expect(markup).toMatch(/<nav [^>]*class="[^"]*xl:max-w-\[960px\]/);
  });
});

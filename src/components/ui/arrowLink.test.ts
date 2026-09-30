// ArrowLink is a server component, rendered to markup here.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ArrowLink } from './ArrowLink';

describe('ArrowLink', () => {
  it('ends with an arrow that nudges right when the link is hovered', () => {
    const markup = renderToStaticMarkup(createElement(ArrowLink, { href: '/projects' }, 'View published projects'));
    expect(markup).toMatch(/^<a [^>]*href="\/projects"[^>]*>View published projects<span aria-hidden="true" class="[^"]*group-hover:translate-x-1[^"]*"><svg/);
  });
});

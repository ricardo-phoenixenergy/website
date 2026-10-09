// The projects and articles rows on home and the solution pages: three items or
// fewer sit in a static grid that reaches three a row on wide screens.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SectionCarousel } from './SectionCarousel';

const row = (grid: boolean) =>
  renderToStaticMarkup(
    // eslint-disable-next-line react/no-children-prop
    createElement(SectionCarousel, {
      label: 'Our work',
      title: 'Projects',
      viewAllHref: '/projects',
      viewAllLabel: 'View published projects',
      grid,
      children: createElement('div', null, 'card'),
    }),
  );

describe('SectionCarousel', () => {
  it('lays a few items out as the /projects grid: one column, two from 640px, three from 768px', () => {
    expect(row(true)).toContain('class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"');
    expect(row(true)).not.toContain('md:grid-cols-2');
  });

  it('scrolls sideways otherwise', () => {
    expect(row(false)).toContain('overflow-x-auto');
    expect(row(false)).not.toContain('grid-cols');
  });
});

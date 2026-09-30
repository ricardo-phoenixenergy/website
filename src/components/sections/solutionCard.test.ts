// SolutionCard is a server component, rendered to markup here like the project cards.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CardImage } from '@/components/ui/Card';
import { SOLUTION_META } from '@/types/solutions';
import { SolutionCard } from './SolutionCard';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);
const text = (markup: string) => markup.replace(/<[^>]+>/g, '');
const wheeling = SOLUTION_META.wheeling;
const line = 'Buy renewable power from a generator elsewhere, delivered through the grid.';
const photo = { url: 'https://cdn.sanity.io/images/p/production/abc123-1448x1086.png', lqip: 'data:image/jpeg;base64,x' };

describe('SolutionCard', () => {
  it('links the whole card to the solution page, headed by the service name', () => {
    const markup = html(createElement(SolutionCard, { meta: wheeling, line, image: photo }));
    expect(markup).toMatch(/^<a [^>]*href="\/solutions\/wheeling"/);
    expect(markup.match(/<a /g)).toHaveLength(1);
    expect(markup).toMatch(/<h2 [^>]*>Wheeling<\/h2>/);
    expect(markup).toContain(line);
    expect(text(markup)).toContain('Explore Wheeling');
  });

  it('keeps the arrow with the last word, so a label that wraps on a narrow phone keeps its arrow beside it', () => {
    const markup = html(createElement(SolutionCard, { meta: SOLUTION_META['ev-fleets'], line, image: photo }));
    // The last word and the arrow share one inline-flex group, which never breaks inside.
    expect(markup).toMatch(/Explore EV Fleets &amp; <span class="inline-flex[^"]*">Infrastructure<span aria-hidden="true"/);
    // The line itself flows as text: as a flex box, its first words would squeeze into a column beside the group.
    expect(markup).toMatch(/<span class="(?![^"]*inline-flex)[^"]*\bblock\b[^"]*">Explore EV Fleets &amp; /);
  });

  it('nudges the arrow on hover, like every arrow link', () => {
    const markup = html(createElement(SolutionCard, { meta: wheeling, line, image: photo }));
    expect(markup).toMatch(/<span aria-hidden="true" class="[^"]*group-hover:translate-x-1[^"]*"><svg/);
  });

  it('shows the photo clear of the dark gradient the old cards had, with empty alt text beside the heading', () => {
    const markup = html(createElement(SolutionCard, { meta: wheeling, line, image: photo }));
    expect(markup).toMatch(/<img [^>]*alt=""/);
    expect(markup).not.toContain('rgba(13,31,34,0.92)');
  });

  it("marks the card with the service's accent, in a line under the photo", () => {
    const markup = html(createElement(SolutionCard, { meta: wheeling, line, image: photo }));
    // The photo, then the 3px accent line, then the body that opens with the heading.
    expect(markup).toMatch(/<img [^>]*>[\s\S]*<div aria-hidden="true" class="h-\[3px\][^"]*" style="background:#D97C76"><\/div><div class="[^"]*"><h2/);
  });

  it("falls back to a tint of the service's accent when it has no photo", () => {
    const markup = html(createElement(SolutionCard, { meta: wheeling, line, image: undefined }));
    expect(markup).not.toContain('<img');
    expect(markup).toContain('#D97C7655');
  });
});

describe('CardImage', () => {
  it('keeps its dark gradient by default, for the project cards whose badge sits on the photo', () => {
    const markup = html(createElement(CardImage, { src: photo.url }));
    expect(markup).toContain('rgba(13,31,34,0.92)');
  });
});

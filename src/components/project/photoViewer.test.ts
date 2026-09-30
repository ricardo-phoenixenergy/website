import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { SanityImage } from '@/types/sanity';

// next/image needs Next's runtime; a plain <img> is enough to check the mosaic's markup.
vi.mock('next/image', async () => {
  const { createElement: h } = await import('react');
  return { default: ({ alt, src }: { alt?: string; src?: string }) => h('img', { alt, src }) };
});

import { PhotoViewer, ProjectPhotos, SWIPE_AREA_CLASS } from './ProjectPhotos';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);
const photo = (n: number, alt?: string): SanityImage => ({
  _type: 'image',
  asset: { _id: `image-${n}`, url: `https://cdn.sanity.io/images/p/production/${n}.jpg` },
  alt: alt ?? `Photo ${n}`,
});

describe('ProjectPhotos', () => {
  it('shows the heading, "View all 8 photos" and five named tiles for eight photos', () => {
    const markup = html(createElement(ProjectPhotos, { photos: Array.from({ length: 8 }, (_, i) => photo(i + 1)) }));
    expect(markup).toMatch(/<h2 id="project-photos"[^>]*>The site in photos<\/h2>/);
    expect(markup).toContain('View all 8 photos');
    expect(markup.match(/aria-label="Open photo \d of 8: Photo \d"/g)).toHaveLength(5);
    expect(markup).toContain('>+5</span>');
    expect(markup).toContain('>+3</span>');
    expect(markup).not.toContain('role="dialog"');
  });

  it('shows one tile and no "View all" for a single photo', () => {
    const markup = html(createElement(ProjectPhotos, { photos: [photo(1)] }));
    expect(markup).not.toContain('View all');
    expect(markup.match(/aria-label="Open photo/g)).toHaveLength(1);
  });

  it('names a photo without alt text by its number', () => {
    const markup = html(createElement(ProjectPhotos, { photos: [photo(1), photo(2, '  ')] }));
    expect(markup).toContain('aria-label="Open photo 2 of 2: Project photo 2"');
  });

  it('renders nothing without photos', () => {
    expect(html(createElement(ProjectPhotos, { photos: [] }))).toBe('');
  });

  it("lets the viewer's swipe area pan up and down and pinch-zoom", () => {
    // The static markup has no viewer until a tile is clicked, so the swipe area takes
    // its classes from SWIPE_AREA_CLASS. touch-pan-y alone would turn pinch-zoom off.
    const classes = SWIPE_AREA_CLASS.split(/\s+/);
    expect(classes).toContain('touch-pan-y');
    expect(classes).toContain('touch-pinch-zoom');
  });
});

describe('PhotoViewer', () => {
  const noop = () => {};
  const photos = [photo(1), { ...photo(2), caption: 'The inverters, before commissioning' }, photo(3)];

  it('names the dialog by its place in the set, shows the count, and puts the caption under the photo', () => {
    const markup = html(createElement(PhotoViewer, { photos, index: 1, onClose: noop, onPrev: noop, onNext: noop }));
    expect(markup).toMatch(/<div [^>]*role="dialog" aria-modal="true" aria-label="Photo 2 of 3"/);
    expect(markup).toMatch(/<p aria-live="polite"[^>]*>2 of 3<\/p>/);
    expect(markup).toMatch(/<figcaption[^>]*>The inverters, before commissioning<\/figcaption>/);
    expect(markup.indexOf('<img')).toBeLessThan(markup.indexOf('<figcaption'));
  });

  it('shows no caption line for a photo without one', () => {
    const markup = html(createElement(PhotoViewer, { photos, index: 0, onClose: noop, onPrev: noop, onNext: noop }));
    expect(markup).not.toContain('<figcaption');
    expect(markup).toContain('aria-label="Photo 1 of 3"');
  });

  it("keeps the close button on screen on a short screen, inside the photo's top corner", () => {
    const markup = html(createElement(PhotoViewer, { photos, index: 1, onClose: noop, onPrev: noop, onNext: noop }));
    const close = markup.match(/<button [^>]*aria-label="Close photo viewer"[^>]*>/)?.[0] ?? '';
    // Above the photo on taller screens; inside its top-right corner up to 640px tall, where there's no room above.
    expect(close).toContain('-top-12');
    expect(close).toContain('[@media(max-height:640px)]:top-2');
    expect(close).toContain('[@media(max-height:640px)]:right-2');
  });
});

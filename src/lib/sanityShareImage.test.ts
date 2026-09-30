import { describe, expect, it, vi } from 'vitest';
import type { SanityImage } from '@/types/sanity';

// The real URL builder, without the client @/lib/sanity creates.
vi.mock('@/lib/sanity', async () => {
  const { createImageUrlBuilder } = await import('@sanity/image-url');
  const builder = createImageUrlBuilder({ projectId: 'p', dataset: 'production' });
  return { urlFor: (source: SanityImage) => builder.image(source) };
});

import { sanityArticleImages, sanityShareImage } from './sanityShareImage';

const photo = (extra: Partial<SanityImage> = {}): SanityImage => ({
  _type: 'image',
  asset: { _id: 'image-abc123-1200x900-png', url: 'https://cdn.sanity.io/images/p/production/abc123-1200x900.png' },
  alt: 'A warehouse roof with solar panels',
  ...extra,
});

const params = (url: string) => Object.fromEntries(new URL(url).searchParams);

describe('sanityShareImage', () => {
  it('crops the photo to 1200 by 630 and serves it as a JPEG, with its alt text', () => {
    const image = sanityShareImage(photo(), 'The title');
    expect(image).toMatchObject({ width: 1200, height: 630, alt: 'A warehouse roof with solar panels' });
    expect(params(image!.url)).toMatchObject({ w: '1200', h: '630', fm: 'jpg', q: '80' });
    expect(params(image!.url).rect).toBeDefined();
  });

  it('falls back to the given alt text, and gives nothing without a photo', () => {
    expect(sanityShareImage(photo({ alt: '  ' }), 'The title')?.alt).toBe('The title');
    expect(sanityShareImage(undefined, 'The title')).toBeUndefined();
    expect(sanityShareImage({ _type: 'image' } as unknown as SanityImage, 'The title')).toBeUndefined();
  });
});

describe('sanityArticleImages', () => {
  it('gives the three shapes Google recommends, 1200px wide, as JPEGs', () => {
    const urls = sanityArticleImages(photo());
    expect(urls.map((url) => [params(url).w, params(url).h])).toEqual([
      ['1200', '675'],
      ['1200', '900'],
      ['1200', '1200'],
    ]);
    expect(urls.every((url) => params(url).fm === 'jpg')).toBe(true);
    expect(sanityArticleImages(null)).toEqual([]);
  });
});

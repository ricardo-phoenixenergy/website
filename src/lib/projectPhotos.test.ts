import { describe, expect, it } from 'vitest';
import { galleryWithoutHero, isPinchZoomed, moreBadges, mosaicLayout, mosaicTile, objectPositionFor, photoAlt, swipeDirection } from './projectPhotos';
import type { SanityImage } from '@/types/sanity';

const img = (id: string, alt?: string): SanityImage => ({ _type: 'image', asset: { _id: id, url: `https://cdn.sanity.io/images/p/production/${id}.jpg` }, alt });

describe('galleryWithoutHero', () => {
  it('leaves out the hero photo, matched by its asset', () => {
    expect(galleryWithoutHero([img('image-a'), img('image-b')], img('image-a')).map((p) => p.asset._id)).toEqual(['image-b']);
  });

  it('skips entries whose image was deleted, and copes with no gallery or hero', () => {
    const deleted = { _type: 'image', asset: null } as unknown as SanityImage;
    expect(galleryWithoutHero([deleted, img('image-b')], undefined).map((p) => p.asset._id)).toEqual(['image-b']);
    expect(galleryWithoutHero(null, null)).toEqual([]);
  });
});

describe('mosaicLayout', () => {
  it.each([
    [0, null],
    [1, { variant: 'single', wide: { shown: 1, more: 0 }, narrow: { shown: 1, more: 0 } }],
    [2, { variant: 'pair', wide: { shown: 2, more: 0 }, narrow: { shown: 2, more: 0 } }],
    [3, { variant: 'lead-two', wide: { shown: 3, more: 0 }, narrow: { shown: 3, more: 0 } }],
    [4, { variant: 'lead-two', wide: { shown: 3, more: 1 }, narrow: { shown: 3, more: 1 } }],
    [5, { variant: 'lead-four', wide: { shown: 5, more: 0 }, narrow: { shown: 3, more: 2 } }],
    [6, { variant: 'lead-four', wide: { shown: 5, more: 1 }, narrow: { shown: 3, more: 3 } }],
    [7, { variant: 'lead-four', wide: { shown: 5, more: 2 }, narrow: { shown: 3, more: 4 } }],
    [8, { variant: 'lead-four', wide: { shown: 5, more: 3 }, narrow: { shown: 3, more: 5 } }],
    [9, { variant: 'lead-four', wide: { shown: 5, more: 4 }, narrow: { shown: 3, more: 6 } }],
  ])('lays out %i photos', (total, expected) => {
    expect(mosaicLayout(total)).toEqual(expected);
  });
});

describe('mosaicTile', () => {
  it('makes the first photo the lead tile once there are three or more', () => {
    expect(mosaicTile(mosaicLayout(3)!, 0).className).toBe('col-span-2 aspect-[4/3] md:aspect-auto md:row-span-2');
    expect(mosaicTile(mosaicLayout(2)!, 0).className).toBe('aspect-[4/3]');
  });

  it('hides the fourth and fifth tiles on phones', () => {
    const layout = mosaicLayout(8)!;
    expect(mosaicTile(layout, 2).className).toBe('aspect-[4/3]');
    expect(mosaicTile(layout, 3).className).toBe('aspect-[4/3] hidden md:block');
    expect(mosaicTile(layout, 4).className).toBe('aspect-[4/3] hidden md:block');
  });
});

describe('moreBadges', () => {
  it('puts "+N" on the last tile shown at each width', () => {
    const layout = mosaicLayout(8)!;
    expect(moreBadges(layout, 2)).toEqual([{ count: 5, className: 'flex md:hidden' }]);
    expect(moreBadges(layout, 4)).toEqual([{ count: 3, className: 'hidden md:flex' }]);
    expect(moreBadges(layout, 0)).toEqual([]);
  });

  it('shows the same "+1" at every width for four photos, and no badge when all fit', () => {
    expect(moreBadges(mosaicLayout(4)!, 2)).toEqual([
      { count: 1, className: 'flex md:hidden' },
      { count: 1, className: 'hidden md:flex' },
    ]);
    expect(moreBadges(mosaicLayout(5)!, 4)).toEqual([]);
    expect(moreBadges(mosaicLayout(3)!, 2)).toEqual([]);
  });
});

describe('swipeDirection', () => {
  it('pages on a sideways swipe of 50px or more', () => {
    expect(swipeDirection(-80, 10)).toBe('next');
    expect(swipeDirection(80, -10)).toBe('prev');
  });

  it('ignores short swipes and mostly vertical ones', () => {
    expect(swipeDirection(-30, 0)).toBeNull();
    expect(swipeDirection(-80, 100)).toBeNull();
  });
});

describe('isPinchZoomed', () => {
  it('is true while the visitor has pinched the page in', () => {
    expect(isPinchZoomed({ scale: 1.5 })).toBe(true);
    expect(isPinchZoomed({ scale: 3 })).toBe(true);
  });

  it('is false at normal size, zoomed out, a rounding hair above 1, or without the Visual Viewport API', () => {
    expect(isPinchZoomed({ scale: 1 })).toBe(false);
    expect(isPinchZoomed({ scale: 0.8 })).toBe(false);
    expect(isPinchZoomed({ scale: 1.005 })).toBe(false);
    expect(isPinchZoomed(null)).toBe(false);
    expect(isPinchZoomed(undefined)).toBe(false);
  });
});

describe('objectPositionFor', () => {
  it('turns the Studio hotspot into an object position, centred without one', () => {
    expect(objectPositionFor({ hotspot: { x: 0.25, y: 0.6, width: 1, height: 1 } })).toBe('25% 60%');
    expect(objectPositionFor({})).toBe('50% 50%');
    expect(objectPositionFor(null)).toBe('50% 50%');
  });

  it('centres when the hotspot has non-finite values', () => {
    expect(objectPositionFor({ hotspot: { x: Number.NaN, y: 0.5, width: 1, height: 1 } })).toBe('50% 50%');
    expect(objectPositionFor({ hotspot: { x: 0.5, y: Number.POSITIVE_INFINITY, width: 1, height: 1 } })).toBe('50% 50%');
  });
});

describe('photoAlt', () => {
  it('uses the alt text, or names the photo by its number', () => {
    expect(photoAlt(img('image-a', 'Inverters in the plant room'), 0)).toBe('Inverters in the plant room');
    expect(photoAlt(img('image-a', '  '), 2)).toBe('Project photo 3');
  });
});

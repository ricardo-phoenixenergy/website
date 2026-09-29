import { describe, expect, it } from 'vitest';
import {
  HERO_PHONE_MAX_WIDTH,
  HERO_PHONE_RATIO,
  HERO_WIDE_MAX_WIDTH,
  HERO_WIDE_RATIO,
  HERO_WIDE_SIZES,
  heroCrop,
  heroCrops,
  hotspotCropRect,
  imageDimensions,
} from './projectHeroImage';
import type { SanityImage } from '@/types/sanity';

const photo = (width: number, height: number, extra: Partial<SanityImage> = {}): SanityImage => ({
  _type: 'image',
  asset: { _id: `image-abc-${width}x${height}-jpg`, url: `https://cdn.sanity.io/images/p/production/abc-${width}x${height}.jpg` },
  ...extra,
});
// A photo whose size is in neither its metadata nor its URL.
const unsized: SanityImage = { _type: 'image', asset: { _id: 'x', url: 'https://example.com/photo.jpg' } };

describe('imageDimensions', () => {
  it('reads the metadata, else the size in the asset URL', () => {
    expect(imageDimensions(photo(4000, 2250, { asset: { _id: 'x', url: 'https://cdn.sanity.io/x.jpg', metadata: { dimensions: { width: 3000, height: 2000, aspectRatio: 1.5 } } } }))).toEqual({ width: 3000, height: 2000 });
    expect(imageDimensions(photo(4000, 2250))).toEqual({ width: 4000, height: 2250 });
    expect(imageDimensions(unsized)).toBeNull();
  });
});

describe('hotspotCropRect', () => {
  it('cuts the top and bottom from a photo taller than the shape, centred on the hotspot', () => {
    expect(hotspotCropRect(photo(4000, 2250), HERO_WIDE_RATIO)).toEqual({ left: 0, top: 325, width: 4000, height: 1600 });
  });

  it('cuts the sides from a photo wider than the shape, centred on the hotspot', () => {
    expect(hotspotCropRect(photo(4000, 2250), HERO_PHONE_RATIO)).toEqual({ left: 500, top: 0, width: 3000, height: 2250 });
  });

  it('keeps the crop inside the photo when the hotspot sits near an edge', () => {
    const nearTop = photo(4000, 2250, { hotspot: { x: 0.5, y: 0.05, width: 0.2, height: 0.1 } });
    expect(hotspotCropRect(nearTop, HERO_WIDE_RATIO)).toEqual({ left: 0, top: 0, width: 4000, height: 1600 });
    const nearRight = photo(4000, 2250, { hotspot: { x: 0.95, y: 0.5, width: 0.1, height: 0.1 } });
    expect(hotspotCropRect(nearRight, HERO_PHONE_RATIO)).toEqual({ left: 1000, top: 0, width: 3000, height: 2250 });
  });

  it("stays inside the editor's crop", () => {
    const cropped = photo(4000, 2250, { crop: { left: 0.1, right: 0.1, top: 0, bottom: 0 } });
    expect(hotspotCropRect(cropped, HERO_WIDE_RATIO)).toEqual({ left: 400, top: 485, width: 3200, height: 1280 });
  });

  it('gives nothing for a photo whose size is unknown', () => {
    expect(hotspotCropRect(unsized, HERO_WIDE_RATIO)).toBeNull();
  });
});

describe('heroCrop', () => {
  it('asks Sanity for the crop at up to its widest useful size, and never larger than the photo', () => {
    expect(heroCrop(photo(4000, 2250), HERO_WIDE_RATIO, HERO_WIDE_MAX_WIDTH)).toEqual({
      src: 'https://cdn.sanity.io/images/p/production/abc-4000x2250.jpg?rect=0,325,4000,1600&w=3072&h=1229&q=90',
      width: 3072,
      height: 1229,
      objectPosition: '50% 50%',
    });
    expect(heroCrop(photo(1200, 900), HERO_WIDE_RATIO, HERO_WIDE_MAX_WIDTH)).toMatchObject({ width: 1200, height: 480 });
    expect(heroCrop(photo(4000, 2250), HERO_PHONE_RATIO, HERO_PHONE_MAX_WIDTH)).toMatchObject({ width: 1600, height: 1200 });
  });

  it('places the hotspot where it sits in the crop, so a cover fit keeps it in view', () => {
    const nearTop = photo(4000, 2250, { hotspot: { x: 0.25, y: 0.05, width: 0.2, height: 0.1 } });
    expect(heroCrop(nearTop, HERO_WIDE_RATIO, HERO_WIDE_MAX_WIDTH)?.objectPosition).toBe('25% 7%');
  });
});

describe('heroCrops', () => {
  it('gives the wide crop, the phone crop and the blur image', () => {
    const withBlur = photo(4000, 2250, {
      asset: { _id: 'image-abc-4000x2250-jpg', url: 'https://cdn.sanity.io/images/p/production/abc-4000x2250.jpg', metadata: { lqip: 'data:image/jpeg;base64,x' } },
    });
    const crops = heroCrops(withBlur);
    if (!crops) throw new Error('expected crops');
    expect(crops.wide.width / crops.wide.height).toBeCloseTo(HERO_WIDE_RATIO, 1);
    expect(crops.phone.width / crops.phone.height).toBeCloseTo(HERO_PHONE_RATIO, 1);
    expect(crops.lqip).toBe('data:image/jpeg;base64,x');
  });

  it('gives nothing without a photo that can be cropped', () => {
    expect(heroCrops(undefined)).toBeNull();
    expect(heroCrops(unsized)).toBeNull();
  });
});

describe('HERO_WIDE_SIZES', () => {
  it('asks for the width a cover fit needs: the window, or the height times 2.5 where that is wider', () => {
    expect(HERO_WIDE_SIZES).toBe('(min-width: 1175px) 100vw, (min-width: 1024px) 1175px, (min-width: 1000px) 100vw, 1000px');
  });
});

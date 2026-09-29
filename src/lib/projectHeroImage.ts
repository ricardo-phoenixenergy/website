// src/lib/projectHeroImage.ts
// The hero photo, cut near the shape each width shows it
// (docs/superpowers/specs/2026-09-29-project-page-design.md, "Decided after step 1"):
// - From 768px, a 5:2 crop. The full-bleed hero is 400px tall from 768px and
//   470px from 1024px, across the whole window, so it runs from about 1.9:1 (a
//   768px window) to 4:1 (1920px). 5:2 is its shape at 1175px (470px tall) and
//   at 1000px (400px tall), in the middle of that range. HERO_WIDE_SIZES tells
//   the browser the width a cover fit needs, the window or the height times
//   2.5, whichever is wider, so it never fetches a file too short for the box.
//   A 3:1 crop saves more on a 1440px laptop at 1x, but needs a 1410px-wide
//   file for every window from 1024px, which jumps to the 3840px file at 1.5x
//   and 2x; 2:1 saves little on desktops.
// - Below 768px, a 4:3 crop, the phone box's own shape.
// Both crops centre on the Studio hotspot and stay inside the editor's crop,
// the way @sanity/image-url fits a crop. Sanity cuts them (rect=), and
// next/image's optimiser (ProjectHero, getImageProps()) sizes them for each
// srcset width. Neither is ever asked for more pixels than the photo has.
import type { SanityImage } from '@/types/sanity';

/** The wide crop's width to height, from 768px. */
export const HERO_WIDE_RATIO = 2.5;
/** The widest wide crop: sharp at 2x up to a 1536px window, the widest common laptop. */
export const HERO_WIDE_MAX_WIDTH = 3072;
/** The phone crop's width to height: the phone hero's 4:3 box. */
export const HERO_PHONE_RATIO = 4 / 3;
/** The widest phone crop: a 767px window at 2x, and any phone at 3x. */
export const HERO_PHONE_MAX_WIDTH = 1600;

export const HERO_WIDE_MEDIA = '(min-width: 768px)';
export const HERO_PHONE_MEDIA = '(max-width: 767px)';

/**
 * The CSS width the wide crop needs under a cover fit: the window, or its
 * height (400px, and 470px from 1024px) times 2.5 where that's wider.
 * 470 x 2.5 = 1175 and 400 x 2.5 = 1000.
 */
export const HERO_WIDE_SIZES = '(min-width: 1175px) 100vw, (min-width: 1024px) 1175px, (min-width: 1000px) 100vw, 1000px';
/** The phone crop fills the page margins: 16px a side below 640px, 24px from 640px. */
export const HERO_PHONE_SIZES = '(max-width: 639px) calc(100vw - 32px), calc(100vw - 48px)';

export interface CropRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface HeroCrop {
  /** The Sanity CDN URL of the crop, the source next/image sizes. */
  src: string;
  width: number;
  height: number;
  /** Where the hotspot sits in the crop, as a CSS object-position. */
  objectPosition: string;
}

export interface HeroCrops {
  wide: HeroCrop;
  phone: HeroCrop;
  /** The photo's blur placeholder, when Sanity gave one. */
  lqip?: string;
}

/** The photo's size: the metadata's, else the one in its CDN URL ("…-4000x2250.jpg"). */
export function imageDimensions(image: Pick<SanityImage, 'asset'>): { width: number; height: number } | null {
  const size = image.asset?.metadata?.dimensions;
  if (size && size.width > 0 && size.height > 0) return { width: size.width, height: size.height };
  const match = image.asset?.url?.match(/-(\d+)x(\d+)\.[A-Za-z0-9]+(?:\?|$)/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const finite = (value: unknown, fallback: number) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback);
/** A crop edge's share of the photo, held to 0 to 1: an import or an API write can store any number. */
const edge = (value: unknown) => clamp(finite(value, 0), 0, 1);

/**
 * The largest `ratio` rectangle inside the editor's crop, centred on the hotspot, in the photo's own pixels.
 * Null when the photo's size is unknown or the crop leaves too little of it for the shape.
 */
export function hotspotCropRect(image: Pick<SanityImage, 'asset' | 'crop' | 'hotspot'>, ratio: number): CropRect | null {
  const size = imageDimensions(image);
  if (!size || !(ratio > 0)) return null;
  const left0 = Math.round(edge(image.crop?.left) * size.width);
  const top0 = Math.round(edge(image.crop?.top) * size.height);
  const cropWidth = Math.round(size.width - edge(image.crop?.right) * size.width - left0);
  const cropHeight = Math.round(size.height - edge(image.crop?.bottom) * size.height - top0);
  if (cropWidth <= 0 || cropHeight <= 0) return null;
  const centreX = finite(image.hotspot?.x, 0.5) * size.width;
  const centreY = finite(image.hotspot?.y, 0.5) * size.height;
  if (cropWidth / cropHeight > ratio) {
    const width = Math.round(cropHeight * ratio);
    if (width < 1) return null;
    return { left: clamp(Math.round(centreX - width / 2), left0, left0 + cropWidth - width), top: top0, width, height: cropHeight };
  }
  const height = Math.round(cropWidth / ratio);
  if (height < 1) return null;
  return { left: left0, top: clamp(Math.round(centreY - height / 2), top0, top0 + cropHeight - height), width: cropWidth, height };
}

/** One crop of the hero: its Sanity URL, its size (at most `maxWidth` wide, never upscaled) and the hotspot's place in it. */
export function heroCrop(image: SanityImage, ratio: number, maxWidth: number): HeroCrop | null {
  const url = image.asset?.url;
  const size = imageDimensions(image);
  const rect = hotspotCropRect(image, ratio);
  if (!url || !size || !rect) return null;
  const width = Math.min(maxWidth, rect.width);
  const height = Math.round(width / ratio);
  const x = clamp((finite(image.hotspot?.x, 0.5) * size.width - rect.left) / rect.width, 0, 1);
  const y = clamp((finite(image.hotspot?.y, 0.5) * size.height - rect.top) / rect.height, 0, 1);
  const query = `rect=${rect.left},${rect.top},${rect.width},${rect.height}&w=${width}&h=${height}&q=90`;
  return {
    src: `${url}${url.includes('?') ? '&' : '?'}${query}`,
    width,
    height,
    objectPosition: `${Math.round(x * 100)}% ${Math.round(y * 100)}%`,
  };
}

/** Both crops of a hero photo, or null when there's no photo or its size can't be read. */
export function heroCrops(image: SanityImage | null | undefined): HeroCrops | null {
  if (!image?.asset?.url) return null;
  const wide = heroCrop(image, HERO_WIDE_RATIO, HERO_WIDE_MAX_WIDTH);
  const phone = heroCrop(image, HERO_PHONE_RATIO, HERO_PHONE_MAX_WIDTH);
  if (!wide || !phone) return null;
  const lqip = image.asset.metadata?.lqip;
  return lqip ? { wide, phone, lqip } : { wide, phone };
}

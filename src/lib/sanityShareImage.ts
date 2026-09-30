// src/lib/sanityShareImage.ts
// A Sanity photo as a share image or an Article image: cropped around its
// hotspot to the shape asked for and served as a JPEG. A PNG original was
// shared as a PNG before, 1.2MB for one project's hero, and some link previews,
// WhatsApp's among them, are reported to skip images over about 300KB.
import { urlFor } from '@/lib/sanity';
import type { ShareImage } from '@/lib/seo';
import type { SanityImage } from '@/types/sanity';

const QUALITY = 80;
const SHARE_WIDTH = 1200;
const SHARE_HEIGHT = 630;
/** The three shapes Google recommends for an Article's image: 16:9, 4:3 and 1:1. */
const ARTICLE_SHAPES: ReadonlyArray<readonly [number, number]> = [
  [1200, 675],
  [1200, 900],
  [1200, 1200],
];

const jpeg = (image: SanityImage, width: number, height: number): string =>
  urlFor(image).width(width).height(height).format('jpg').quality(QUALITY).url();

/** The photo as a 1200 by 630 share image, with its alt text or, when it has none, the fallback. Nothing without a photo. */
export function sanityShareImage(image: SanityImage | null | undefined, fallbackAlt: string): ShareImage | undefined {
  if (!image?.asset) return undefined;
  return { url: jpeg(image, SHARE_WIDTH, SHARE_HEIGHT), width: SHARE_WIDTH, height: SHARE_HEIGHT, alt: image.alt?.trim() || fallbackAlt };
}

/** The photo in the three Article shapes, 1200px wide. Empty without a photo. */
export function sanityArticleImages(image: SanityImage | null | undefined): string[] {
  if (!image?.asset) return [];
  return ARTICLE_SHAPES.map(([width, height]) => jpeg(image, width, height));
}

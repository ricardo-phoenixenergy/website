// src/lib/projectPhotos.ts
// "The site in photos" on a project page: which photos show, how the 4:3 tiles
// are laid out for their number, and the viewer's swipe. From 768px: one photo is
// a half-width tile; two are two equal tiles; three or four are a lead tile (two
// thirds wide, two rows tall) with two beside it; five or more are a lead tile
// (half wide, two rows tall) with four beside it. Phones show at most three: two
// photos side by side, or the lead full width with two below it. The last tile
// shown carries "+N" for the photos not shown.
import type { SanityImage } from '@/types/sanity';

/** The gallery without broken entries or any photo that is the hero's own asset. */
export function galleryWithoutHero(
  gallery: readonly SanityImage[] | null | undefined,
  hero: SanityImage | null | undefined,
): SanityImage[] {
  const heroId = hero?.asset?._id;
  return (gallery ?? []).filter((image) => Boolean(image?.asset?.url) && (!heroId || image.asset._id !== heroId));
}

export type MosaicVariant = 'single' | 'pair' | 'lead-two' | 'lead-four';

export interface MosaicCount {
  shown: number;
  more: number;
}

export interface MosaicLayout {
  variant: MosaicVariant;
  /** From 768px. */
  wide: MosaicCount;
  /** Below 768px. */
  narrow: MosaicCount;
}

export function mosaicLayout(total: number): MosaicLayout | null {
  if (total <= 0) return null;
  if (total === 1) return { variant: 'single', wide: { shown: 1, more: 0 }, narrow: { shown: 1, more: 0 } };
  if (total === 2) return { variant: 'pair', wide: { shown: 2, more: 0 }, narrow: { shown: 2, more: 0 } };
  const narrow = { shown: 3, more: total - 3 };
  if (total <= 4) return { variant: 'lead-two', wide: { shown: 3, more: total - 3 }, narrow };
  return { variant: 'lead-four', wide: { shown: 5, more: total - 5 }, narrow };
}

const GRID: Record<MosaicVariant, string> = {
  single: 'grid-cols-1 md:grid-cols-2',
  pair: 'grid-cols-2',
  'lead-two': 'grid-cols-2 md:grid-cols-3',
  'lead-four': 'grid-cols-2 md:grid-cols-4',
};

/** The mosaic's grid: 12px gaps from 768px, 8px on phones. */
export function mosaicGridClass(variant: MosaicVariant): string {
  return `grid gap-2 md:gap-3 ${GRID[variant]}`;
}

const TILE_SIZES: Record<MosaicVariant, { lead: string; tile: string }> = {
  single: { lead: '(max-width: 767px) 100vw, 50vw', tile: '(max-width: 767px) 100vw, 50vw' },
  pair: { lead: '50vw', tile: '50vw' },
  'lead-two': { lead: '(max-width: 767px) 100vw, 66vw', tile: '(max-width: 767px) 50vw, 33vw' },
  'lead-four': { lead: '(max-width: 767px) 100vw, 50vw', tile: '(max-width: 767px) 50vw, 25vw' },
};

export interface TileSpec {
  className: string;
  sizes: string;
}

/** A tile's shape and visibility, and the `sizes` for its image. */
export function mosaicTile(layout: MosaicLayout, index: number): TileSpec {
  const lead = index === 0 && (layout.variant === 'lead-two' || layout.variant === 'lead-four');
  const shape = lead ? 'col-span-2 aspect-[4/3] md:aspect-auto md:row-span-2' : 'aspect-[4/3]';
  const visibility = index >= layout.narrow.shown ? 'hidden md:block' : '';
  return { className: [shape, visibility].filter(Boolean).join(' '), sizes: TILE_SIZES[layout.variant][lead ? 'lead' : 'tile'] };
}

/** The "+N" counts a tile carries: on the last tile shown on phones, and on the last shown from 768px. */
export function moreBadges(layout: MosaicLayout, index: number): Array<{ count: number; className: string }> {
  const badges: Array<{ count: number; className: string }> = [];
  if (layout.narrow.more > 0 && index === layout.narrow.shown - 1) badges.push({ count: layout.narrow.more, className: 'flex md:hidden' });
  if (layout.wide.more > 0 && index === layout.wide.shown - 1) badges.push({ count: layout.wide.more, className: 'hidden md:flex' });
  return badges;
}

/** Which way a swipe pages: at least `threshold` px sideways, and more sideways than up or down. */
export function swipeDirection(dx: number, dy: number, threshold = 50): 'next' | 'prev' | null {
  if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return null;
  return dx < 0 ? 'next' : 'prev';
}

/** The photo's Studio hotspot as a CSS object-position, so a crop keeps what the editor marked. */
export function objectPositionFor(image: Pick<SanityImage, 'hotspot'> | null | undefined): string {
  const spot = image?.hotspot;
  if (!spot || !Number.isFinite(spot.x) || !Number.isFinite(spot.y)) return '50% 50%';
  return `${Math.round(spot.x * 100)}% ${Math.round(spot.y * 100)}%`;
}

/** The photo's alt text, or "Project photo N" until an editor writes one. */
export function photoAlt(image: SanityImage, index: number): string {
  return image.alt?.trim() || `Project photo ${index + 1}`;
}

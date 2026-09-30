'use client';

// "The site in photos": the 4:3 mosaic, whose layout src/lib/projectPhotos.ts
// sets from the number of photos, and the photo viewer.
// - Every tile opens the viewer at its photo, and "View all N photos" opens it
//   at the first.
// - The viewer (PhotoViewer) shows each photo whole, with its caption under it
//   when there is one, and "2 of 8".
// - Its arrow buttons, the arrow keys and a sideways swipe page through the
//   photos, wrapping at the ends.
// - Pinch-zoom works on the photo, and a swipe doesn't page while zoomed in.
// - useModalDialog handles Escape, the focus trap and returning focus to the tile.
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { SanityImage } from '@/types/sanity';
import { IconArrowLeft, IconArrowRight, IconX } from '@/components/ui/Icons';
import { IconButton } from '@/components/ui/IconButton';
import { arrowLinkClasses } from '@/components/ui/buttonStyles';
import { useModalDialog } from '@/hooks/useModalDialog';
import {
  isPinchZoomed,
  mosaicGridClass,
  mosaicLayout,
  mosaicTile,
  moreBadges,
  objectPositionFor,
  photoAlt,
  photoCaption,
  swipeDirection,
} from '@/lib/projectPhotos';

/**
 * The viewer's swipe area. touch-pan-y leaves up-and-down drags to the browser and
 * sideways ones to the swipe; touch-pinch-zoom keeps pinch-zoom, which touch-pan-y
 * alone turns off, so visitors can still zoom in to read a label.
 */
export const SWIPE_AREA_CLASS = 'relative touch-pan-y touch-pinch-zoom';

interface PhotoViewerProps {
  photos: SanityImage[];
  /** The photo on show. */
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * The full-screen viewer, shown while a photo is open. The dialog is named
 * "Photo 2 of 8"; the caption sits under the photo, inside the dialog. A
 * caption takes some of the photo's height so both fit on a short screen.
 */
export function PhotoViewer({ photos, index, onClose, onPrev, onNext }: PhotoViewerProps) {
  const dialogRef = useModalDialog<HTMLDivElement>(true, onClose);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const total = photos.length;
  const current = photos[index];
  const caption = current ? photoCaption(current) : null;

  // The arrow keys page through the photos; Escape, Tab and focus belong to useModalDialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onPrev, onNext]);

  if (!current) return null;

  // focus-on-dark: the white ring on a Night Teal halo shows over light and dark photos alike.
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${total}`}
      className="focus-on-dark fixed inset-0 z-[90] flex items-center justify-center bg-pe-nav-dark/[0.92]"
      onClick={onClose}
    >
      <figure className="w-full" style={{ maxWidth: 'min(900px, 95vw)' }} onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <div
            data-swipe-area
            className={SWIPE_AREA_CLASS}
            style={{ height: caption ? 'min(560px, 70vh)' : 'min(600px, 80vh)' }}
            onPointerDown={(e) => {
              if (e.pointerType !== 'mouse') swipeStart.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              const start = swipeStart.current;
              swipeStart.current = null;
              // Zoomed in, a sideways drag means to move around the photo, so it doesn't page.
              if (!start || total < 2 || isPinchZoomed(window.visualViewport)) return;
              const direction = swipeDirection(e.clientX - start.x, e.clientY - start.y);
              if (direction === 'next') onNext();
              if (direction === 'prev') onPrev();
            }}
            onPointerCancel={() => {
              swipeStart.current = null;
            }}
          >
            <Image
              src={current.asset.url}
              alt={photoAlt(current, index)}
              fill
              className="object-contain"
              sizes="(max-width: 960px) 95vw, 900px"
              placeholder={current.asset.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={current.asset.metadata?.lqip}
            />
          </div>

          {/* Above the photo's top-right corner. A screen up to 640px tall (a landscape phone) has no room above a
              centred photo, so there it sits inside the corner, like the arrows. */}
          <IconButton
            variant="overlay"
            label="Close photo viewer"
            data-autofocus
            onClick={onClose}
            className="absolute -top-12 right-0 [@media(max-height:640px)]:right-2 [@media(max-height:640px)]:top-2"
          >
            <IconX />
          </IconButton>
          {total > 1 && (
            <IconButton variant="overlay" label="Previous photo" onClick={onPrev} className="absolute left-2 top-1/2 -translate-y-1/2">
              <IconArrowLeft />
            </IconButton>
          )}
          {total > 1 && (
            <IconButton variant="overlay" label="Next photo" onClick={onNext} className="absolute right-2 top-1/2 -translate-y-1/2">
              <IconArrowRight />
            </IconButton>
          )}
          <p aria-live="polite" className="absolute bottom-3 left-1/2 -translate-x-1/2 font-body text-sm text-on-dark-muted">
            {index + 1} of {total}
          </p>
        </div>
        {caption && (
          <figcaption className="mx-auto mt-3 max-w-[70ch] px-4 text-center font-body text-sm leading-relaxed text-on-dark">
            {caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

interface ProjectPhotosProps {
  /** The gallery without the hero (galleryWithoutHero). */
  photos: SanityImage[];
}

export function ProjectPhotos({ photos }: ProjectPhotosProps) {
  const [index, setIndex] = useState<number | null>(null);
  const total = photos.length;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => setIndex((i) => (i === null ? null : (i - 1 + total) % total)), [total]);
  const next = useCallback(() => setIndex((i) => (i === null ? null : (i + 1) % total)), [total]);

  const layout = mosaicLayout(total);
  if (!layout) return null;
  const tiles = photos.slice(0, layout.wide.shown);

  return (
    <section aria-labelledby="project-photos" className="page-container mt-10 md:mt-12 lg:mt-16">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h2 id="project-photos" className="font-display text-xl font-extrabold text-pe-text md:text-2xl">
          The site in photos
        </h2>
        {total >= 2 && (
          <button type="button" onClick={() => setIndex(0)} className={arrowLinkClasses({ className: 'min-h-11' })}>
            View all {total} photos
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
              <IconArrowRight />
            </span>
          </button>
        )}
      </div>

      <ul className={mosaicGridClass(layout.variant)}>
        {tiles.map((photo, i) => {
          const tile = mosaicTile(layout, i);
          return (
            <li key={`${photo.asset._id}-${i}`} className={tile.className}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block h-full w-full overflow-hidden rounded-xl"
              >
                {/* The button is named by this line and the photo's alt text, as it
                    was; the alt text sits on the image, where image search reads it. */}
                <span className="sr-only">{`Open photo ${i + 1} of ${total}: `}</span>
                <Image
                  src={photo.asset.url}
                  alt={photoAlt(photo, i)}
                  fill
                  sizes={tile.sizes}
                  className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  style={{ objectPosition: objectPositionFor(photo) }}
                  placeholder={photo.asset.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={photo.asset.metadata?.lqip}
                />
                {moreBadges(layout, i).map((badge) => (
                  <span
                    key={badge.className}
                    aria-hidden="true"
                    className={`absolute inset-0 items-center justify-center bg-pe-nav-dark/70 font-body text-base font-bold text-white ${badge.className}`}
                  >
                    +{badge.count}
                  </span>
                ))}
              </button>
            </li>
          );
        })}
      </ul>

      {index !== null && <PhotoViewer photos={photos} index={index} onClose={close} onPrev={prev} onNext={next} />}
    </section>
  );
}

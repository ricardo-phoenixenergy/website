'use client';

// "The site in photos": the 4:3 mosaic, whose layout src/lib/projectPhotos.ts
// sets from the number of photos, and the photo viewer.
// - Every tile opens the viewer at its photo, and "View all N photos" opens it
//   at the first.
// - The viewer shows each photo whole, with "2 of 8".
// - Its arrow buttons, the arrow keys and a sideways swipe page through the
//   photos, wrapping at the ends.
// - useModalDialog handles Escape, the focus trap and returning focus to the tile.
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { SanityImage } from '@/types/sanity';
import { IconArrowLeft, IconArrowRight, IconX } from '@/components/ui/Icons';
import { IconButton } from '@/components/ui/IconButton';
import { arrowLinkClasses } from '@/components/ui/buttonStyles';
import { useModalDialog } from '@/hooks/useModalDialog';
import { mosaicGridClass, mosaicLayout, mosaicTile, moreBadges, objectPositionFor, photoAlt, swipeDirection } from '@/lib/projectPhotos';

interface ProjectPhotosProps {
  /** The gallery without the hero (galleryWithoutHero). */
  photos: SanityImage[];
}

export function ProjectPhotos({ photos }: ProjectPhotosProps) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const total = photos.length;
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const dialogRef = useModalDialog<HTMLDivElement>(open, close);
  const prev = useCallback(() => setIndex((i) => (i === null ? null : (i - 1 + total) % total)), [total]);
  const next = useCallback(() => setIndex((i) => (i === null ? null : (i + 1) % total)), [total]);

  // The arrow keys page through the photos; Escape, Tab and focus belong to useModalDialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, prev, next]);

  const layout = mosaicLayout(total);
  if (!layout) return null;
  const tiles = photos.slice(0, layout.wide.shown);
  const current = index !== null ? photos[index] : null;

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
                aria-label={`Open photo ${i + 1} of ${total}: ${photoAlt(photo, i)}`}
                className="group relative block h-full w-full overflow-hidden rounded-xl"
              >
                <Image
                  src={photo.asset.url}
                  alt=""
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

      {/* The viewer. focus-on-dark: the white ring on a Night Teal halo shows over light and dark photos alike. */}
      {current && index !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} of ${total}`}
          className="focus-on-dark fixed inset-0 z-[90] flex items-center justify-center bg-pe-nav-dark/[0.92]"
          onClick={close}
        >
          <div className="relative w-full" style={{ maxWidth: 'min(900px, 95vw)', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <div
              data-swipe-area
              className="relative touch-pan-y"
              style={{ height: 'min(600px, 80vh)' }}
              onPointerDown={(e) => {
                if (e.pointerType !== 'mouse') swipeStart.current = { x: e.clientX, y: e.clientY };
              }}
              onPointerUp={(e) => {
                const start = swipeStart.current;
                swipeStart.current = null;
                if (!start || total < 2) return;
                const direction = swipeDirection(e.clientX - start.x, e.clientY - start.y);
                if (direction === 'next') next();
                if (direction === 'prev') prev();
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

            <IconButton variant="ghost" label="Close photo viewer" data-autofocus onClick={close} className="absolute -top-12 right-0">
              <IconX />
            </IconButton>
            {total > 1 && (
              <IconButton variant="ghost" label="Previous photo" onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2">
                <IconArrowLeft />
              </IconButton>
            )}
            {total > 1 && (
              <IconButton variant="ghost" label="Next photo" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2">
                <IconArrowRight />
              </IconButton>
            )}
            <p aria-live="polite" className="absolute bottom-3 left-1/2 -translate-x-1/2 font-body text-sm text-on-dark-muted">
              {index + 1} of {total}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

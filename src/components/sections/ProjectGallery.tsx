'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { SanityImage } from '@/types/sanity';
import { IconArrowLeft, IconArrowRight, IconX } from '@/components/ui/Icons';
import { useModalDialog } from '@/hooks/useModalDialog';

interface ProjectGalleryProps {
  images: SanityImage[];
}

/**
 * Grid spans that leave no empty cells: two columns on phones, three from
 * 768px. The first photo is wide (the full row when it's alone), and a last
 * photo left short of a full row fills the rest of it.
 */
function tileLayout(i: number, n: number): { className: string; sizes: string } {
  const last = i === n - 1;
  const phoneFull = i === 0 || (last && (n - 1) % 2 === 1);
  let wide = 1;
  if (i === 0) wide = n === 1 ? 3 : 2;
  else if (last && n > 2) wide = [1, 3, 2][(n - 2) % 3];
  const wideClass = wide === 3 ? 'md:col-span-3' : wide === 2 ? 'md:col-span-2' : 'md:col-span-1';
  return {
    className: `${phoneFull ? 'col-span-2' : ''} ${wideClass}`.trim(),
    sizes: `(max-width:768px) ${phoneFull ? '100vw' : '50vw'}, ${Math.round((wide / 3) * 100)}vw`,
  };
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const open = lightboxIndex !== null;

  const close = useCallback(() => setLightboxIndex(null), []);
  const dialogRef = useModalDialog<HTMLDivElement>(open, close);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  // Arrow keys page through the photos; Escape, Tab and focus are handled by useModalDialog.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, prev, next]);

  if (!images || images.length === 0) return null;

  const total = images.length;
  const shown = images.slice(0, 6);
  const altFor = (img: SanityImage, i: number) => img.alt ?? `Project photo ${i + 1}`;

  return (
    <>
      {/* Gallery grid */}
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-2">
        {shown.map((img, i) => {
          const tile = tileLayout(i, shown.length);
          return (
            <li key={i} className={tile.className}>
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-label={`Open photo ${i + 1} of ${total}: ${altFor(img, i)}`}
                className="relative block w-full overflow-hidden rounded-[10px] group"
                style={{ height: 88 }}
              >
                <Image
                  src={img.asset.url}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.04]"
                  placeholder={img.asset.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={img.asset.metadata?.lqip}
                  sizes={tile.sizes}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Lightbox */}
      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${lightboxIndex + 1} of ${total}`}
          className="fixed inset-0 z-[90] flex items-center justify-center"
          style={{ background: 'rgba(13,31,34,0.92)' }}
          onClick={close}
        >
          <div
            className="relative"
            style={{ maxWidth: 'min(900px, 95vw)', maxHeight: '90vh', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative" style={{ height: 'min(600px, 80vh)' }}>
              <Image
                src={images[lightboxIndex].asset.url}
                alt={altFor(images[lightboxIndex], lightboxIndex)}
                fill
                className="object-contain"
                placeholder={images[lightboxIndex].asset.metadata?.lqip ? 'blur' : 'empty'}
                blurDataURL={images[lightboxIndex].asset.metadata?.lqip}
                sizes="(max-width: 960px) 95vw, 900px"
              />
            </div>

            {/* Close */}
            <button
              type="button"
              data-autofocus
              onClick={close}
              className="absolute -top-12 right-0 w-11 h-11 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/20"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              aria-label="Close photo viewer"
            >
              <IconX size={20} />
            </button>

            {/* Prev */}
            {total > 1 && (
              <button
                type="button"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/20"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                aria-label="Previous photo"
              >
                <IconArrowLeft size={18} />
              </button>
            )}

            {/* Next */}
            {total > 1 && (
              <button
                type="button"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/20"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                aria-label="Next photo"
              >
                <IconArrowRight size={18} />
              </button>
            )}

            {/* Counter */}
            <p
              aria-live="polite"
              className="absolute bottom-3 left-1/2 -translate-x-1/2 font-body text-sm"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <span className="sr-only">Photo </span>
              {lightboxIndex + 1}
              <span aria-hidden="true"> / </span>
              <span className="sr-only"> of </span>
              {total}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { SanityImage } from '@/types/sanity';

interface ProjectGalleryProps {
  images: SanityImage[];
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [lightboxIndex, close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-2">
        {images.slice(0, 6).map((img, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-[10px] cursor-pointer group ${i === 0 ? 'col-span-2' : ''}`}
            style={{ height: i === 0 ? 88 : 88 }}
            onClick={() => setLightboxIndex(i)}
          >
            <Image
              src={img.asset.url}
              alt={img.alt ?? `Gallery photo ${i + 1}`}
              fill
              className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.04]"
              placeholder={img.asset.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={img.asset.metadata?.lqip}
              sizes="(max-width:768px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
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
                alt={images[lightboxIndex].alt ?? `Photo ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="900px"
              />
            </div>

            {/* Close */}
            <button
              onClick={close}
              className="absolute -top-10 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-body text-base"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              aria-label="Close lightbox"
            >
              ✕
            </button>

            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white font-body text-base transition-colors hover:bg-white/20"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                aria-label="Previous photo"
              >
                ←
              </button>
            )}

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white font-body text-base transition-colors hover:bg-white/20"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                aria-label="Next photo"
              >
                →
              </button>
            )}

            {/* Counter */}
            <p
              className="absolute bottom-3 left-1/2 -translate-x-1/2 font-body text-sm"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

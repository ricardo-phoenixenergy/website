// src/components/ui/PageHero.tsx
// A page's hero (a project or a post): one photo and one H1 at every width,
// laid out by CSS.
// - From 768px the photo runs edge to edge (400px tall, 470px from 1024px)
//   under a Night Teal scrim. The badge, H1 and the line under the headline sit
//   over it: 92px above its foot when a card overlaps it, 40px when not.
//   A headline of two lines or more lifts the text higher, where the scrim is
//   lighter, so the text block darkens behind whatever rises above a one-line title.
// - Below 768px the photo is 4:3 inside the page margins, with the text under it
//   on the page background.
// - The photo is one <picture> holding one <img>: a 5:2 crop from 768px and a
//   4:3 crop below, both centred on the Studio hotspot (src/lib/projectHeroImage.ts),
//   so no width fetches far more photo than it shows. next/image's
//   getImageProps() gives each crop its srcset. It can't take a blur
//   placeholder, so the LQIP sits blurred behind the photo instead, and
//   preload() adds one preload link per crop, each for its own widths.
// - Without a photo, or one whose size can't be read, phones show no photo
//   block and wider screens show the fallback accent fading into Night Teal
//   (src/lib/noPhotoBackground.ts, shared with the wide article card).
// - The line under the headline has two parts: on phones each takes its own
//   line; from 768px they share one, joined by " · ".
import { getImageProps } from 'next/image';
import Link from 'next/link';
import { preload } from 'react-dom';
import type { SanityImage } from '@/types/sanity';
import { noPhotoBackground } from '@/lib/noPhotoBackground';
import { HERO_PHONE_MEDIA, HERO_PHONE_SIZES, HERO_WIDE_MEDIA, HERO_WIDE_SIZES, heroCrops, type HeroCrops } from '@/lib/projectHeroImage';

/** The service badge over the photo: a link to its page, in its accent colours. */
export interface HeroBadge {
  label: string;
  href: string;
  accent: string;
  accentText: string;
}

interface PageHeroProps {
  image: SanityImage | null | undefined;
  alt: string;
  title: string;
  /** The H1's id, which labels the section: "project-title" or "post-title". */
  titleId: string;
  badge?: HeroBadge;
  line?: { first: string; second?: string };
  /** The gradient's accent when there is no photo. */
  fallbackAccent?: string;
  /** A card overlaps the photo's foot, so the text sits higher. */
  overlapped?: boolean;
}

// Clear at the top to Night Teal at 92% at the foot. The 66% middle stop keeps the line under
// the headline (on-dark-muted) at 4.5:1 or more over both live projects' photos from 768px.
const SCRIM =
  'linear-gradient(180deg, color-mix(in srgb, var(--color-pe-nav-dark) 5%, transparent) 20%, color-mix(in srgb, var(--color-pe-nav-dark) 66%, transparent) 58%, color-mix(in srgb, var(--color-pe-nav-dark) 92%, transparent) 100%)';

// The scrim grows with a long headline. A layer on the text block covers the badge, the H1 and
// the line under the headline (the block less its bottom padding), fading in over the badge row
// to Night Teal at 50%. Its mask hides the layer's lowest --scrim-from (a mask reads only alpha,
// so its black means shown): the height of that text with a one-line title. That is 76px (the
// badge's 26px line, the 14px and 12px gaps and the 24px line under the headline) plus one H1
// line, 36px x 1.08 or, from lg, 44px x 1.08, rounded up. So a one-line title keeps SCRIM alone,
// exactly as before, and each line above it gets the extra darkness.
const TEXT_SCRIM = 'linear-gradient(180deg, transparent 0, color-mix(in srgb, var(--color-pe-nav-dark) 50%, transparent) 40px)';
const TEXT_SCRIM_MASK = 'linear-gradient(0deg, transparent var(--scrim-from), black calc(var(--scrim-from) + 24px))';

function HeroPicture({ crops, alt }: { crops: HeroCrops; alt: string }) {
  const shared = { alt, loading: 'eager', fetchPriority: 'high' } as const;
  const { props: wide } = getImageProps({ ...shared, src: crops.wide.src, width: crops.wide.width, height: crops.wide.height, sizes: HERO_WIDE_SIZES });
  const { props: phone } = getImageProps({ ...shared, src: crops.phone.src, width: crops.phone.width, height: crops.phone.height, sizes: HERO_PHONE_SIZES });
  // The photo is the page's LCP element: each preload fetches only at its own widths.
  preload(wide.src, { as: 'image', imageSrcSet: wide.srcSet, imageSizes: wide.sizes, media: HERO_WIDE_MEDIA, fetchPriority: 'high' });
  preload(phone.src, { as: 'image', imageSrcSet: phone.srcSet, imageSizes: phone.sizes, media: HERO_PHONE_MEDIA, fetchPriority: 'high' });

  return (
    <>
      {crops.lqip && (
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-110 blur-xl"
          style={{ backgroundImage: `url("${crops.lqip}")`, backgroundSize: 'cover', backgroundPosition: crops.wide.objectPosition }}
        />
      )}
      <picture>
        <source media={HERO_WIDE_MEDIA} srcSet={wide.srcSet} sizes={wide.sizes} />
        {/* Art direction needs a <picture>, so next/image's props go on a plain <img>
            (node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md, "Art direction"). */}
        <img
          {...phone}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ ...phone.style, objectPosition: crops.wide.objectPosition }}
        />
      </picture>
    </>
  );
}

export function PageHero({ image, alt, title, titleId, badge, line, fallbackAccent, overlapped = false }: PageHeroProps) {
  const crops = heroCrops(image);

  return (
    <section aria-labelledby={titleId} className="relative mt-3 md:mt-4">
      <div
        className={`relative mx-4 aspect-[4/3] overflow-hidden rounded-card sm:mx-6 md:mx-0 md:aspect-auto md:h-[400px] md:rounded-none lg:h-[470px] ${crops ? '' : 'hidden md:block'}`}
      >
        {crops ? (
          <HeroPicture crops={crops} alt={alt} />
        ) : (
          <div className="absolute inset-0" style={{ background: noPhotoBackground(fallbackAccent) }} />
        )}
        <div aria-hidden="true" className="absolute inset-0 hidden md:block" style={{ background: SCRIM }} />
      </div>

      {/* From 768px the text sits over the photo, where the focus ring turns white, as .focus-on-dark does. */}
      <div
        className={`md:absolute md:inset-x-0 md:bottom-0 md:[--ring-color:#FFFFFF] md:[--ring-halo:var(--color-pe-nav-dark)] ${overlapped ? 'md:pb-[92px]' : 'md:pb-10'}`}
      >
        {/* It ends where the padding starts; the text's container is positioned and comes after it, so it paints over it. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 hidden md:block md:[--scrim-from:115px] lg:[--scrim-from:124px] ${overlapped ? 'md:bottom-[92px]' : 'md:bottom-10'}`}
          style={{ background: TEXT_SCRIM, maskImage: TEXT_SCRIM_MASK, WebkitMaskImage: TEXT_SCRIM_MASK }}
        />
        <div className="page-container relative pt-4 md:pt-0">
          {badge && (
            <Link
              href={badge.href}
              className="hit-area relative inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-bold uppercase tracking-[0.08em] transition-[filter] duration-200 hover:brightness-95"
              style={{ background: badge.accent, color: badge.accentText }}
            >
              {badge.label}
            </Link>
          )}
          <h1
            id={titleId}
            className="mt-3 max-w-[25ch] break-words text-balance font-display text-[28px] font-extrabold leading-[1.15] text-pe-text md:mt-3.5 md:text-4xl md:leading-[1.08] md:text-white lg:text-[44px]"
          >
            {title}
          </h1>
          {line && (line.first || line.second) && (
            <p className="mt-2 font-body text-sm text-pe-muted md:mt-3 md:text-base md:text-on-dark-muted">
              {line.first && <span className="block md:inline">{line.first}</span>}
              {line.second && (
                <span className="block md:inline">
                  {line.first && <span className="hidden md:inline"> · </span>}
                  {line.second}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

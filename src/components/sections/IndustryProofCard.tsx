// src/components/sections/IndustryProofCard.tsx
// An industry example beside an EV Fleets industry tab: what a South African
// fleet operator has done. Nothing on the card may read as Phoenix Energy's own
// work: a neutral "Industry example" heading, the operator named in body text,
// no accent and no Phoenix call to action (docs/plans/2026-09-24-case-study-
// and-proof-strip-brief.md, 6B.6). Phoenix Energy took no part in any of them
// (confirmed by the business, 25 September 2026): they show that commercial EV
// fleets already run in South Africa, and every card says so. Sources and photo
// rights are still the business's to confirm (D15); a source line shows once
// one is recorded.
import Image from 'next/image';

const DEFAULT_LQIP =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export interface IndustryExampleSource {
  publisher: string;
  url: string;
  /** Month and year of publication, e.g. "March 2025". */
  date: string;
}

interface IndustryProofCardProps {
  /** The fleet operator, or the organisation behind the example. */
  operator: string;
  stat: string;
  detail: string;
  image?: string;          // path under /public, e.g. '/proof/woolworths-ev.jpg'
  imageAlt?: string;       // falls back to the operator's name
  imagePosition?: string;  // object-position for the crop; defaults to 'center'
  source?: IndustryExampleSource;
}

export function IndustryProofCard({
  operator, stat, detail, image, imageAlt, imagePosition, source,
}: IndustryProofCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-pe-bg border border-pe-border">
      <div className="p-6">
        {/* One heading, label first, so it reads "Industry example: …" by heading too. */}
        <h4 className="mb-1">
          <span className="block font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-3">
            Industry example<span className="sr-only">:</span>
          </span>
          <span className="block font-display font-extrabold text-2xl text-pe-text leading-tight">
            {stat}
          </span>
        </h4>
        <p className="font-body text-sm font-semibold text-pe-text-soft mb-3">
          {operator}
        </p>
        {image && (
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-pe-border">
            <Image
              src={image}
              alt={imageAlt ?? operator}
              fill
              className="object-cover"
              style={{ objectPosition: imagePosition ?? 'center' }}
              sizes="(max-width: 1024px) 100vw, 33vw"
              placeholder="blur"
              blurDataURL={DEFAULT_LQIP}
            />
          </div>
        )}
        <p className="font-body text-sm text-pe-text-soft leading-[1.7]">
          {detail}
        </p>
        <p className="font-body text-xs text-pe-muted leading-[1.6] mt-4">
          Shown as an example of commercial electric fleets in South Africa. Phoenix Energy was not involved.
        </p>
        {source && (
          <p className="font-body text-xs text-pe-muted leading-[1.6] mt-1">
            Source:{' '}
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              {source.publisher}
            </a>
            , {source.date}
          </p>
        )}
      </div>
    </div>
  );
}

// src/components/sections/IndustryProofCard.tsx
// Right-column proof example shown in an EV Fleets industry tab panel.
import Image from 'next/image';

const DEFAULT_LQIP =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

interface IndustryProofCardProps {
  client: string;
  stat: string;
  detail: string;
  accent: string;
  accentText: string;
  image?: string;          // path under /public, e.g. '/proof/woolworths-ev.jpg'
  imageAlt?: string;       // falls back to the client name
  imagePosition?: string;  // object-position for the crop; defaults to 'center'
  kicker?: string;         // small uppercase label; defaults to 'Proven in South Africa'
}

export function IndustryProofCard({
  client, stat, detail, accent, accentText, image, imageAlt, imagePosition, kicker,
}: IndustryProofCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#F5F5F5] border border-[#E5E7EB]">
      <div className="h-[3px]" style={{ background: accent }} />
      <div className="p-6">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          {kicker ?? 'Proven in South Africa'}
        </p>
        <p className="font-display font-extrabold text-2xl text-[#1A1A1A] leading-tight mb-1">
          {stat}
        </p>
        <p className="font-body text-sm font-semibold mb-3" style={{ color: accentText }}>
          {client}
        </p>
        {image && (
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-[#E5E7EB]">
            <Image
              src={image}
              alt={imageAlt ?? client}
              fill
              className="object-cover"
              style={{ objectPosition: imagePosition ?? 'center' }}
              sizes="(max-width: 1024px) 100vw, 33vw"
              placeholder="blur"
              blurDataURL={DEFAULT_LQIP}
            />
          </div>
        )}
        <p className="font-body text-sm text-[#374151] leading-[1.7]">
          {detail}
        </p>
      </div>
    </div>
  );
}

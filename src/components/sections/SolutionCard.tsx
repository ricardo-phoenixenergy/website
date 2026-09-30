// src/components/sections/SolutionCard.tsx
import Link from 'next/link';
import { ArrowLinkArrow } from '@/components/ui/ArrowLink';
import { Card, CardBody, CardImage } from '@/components/ui/Card';
import { arrowLinkClasses } from '@/components/ui/buttonStyles';
import type { HeroImageAsset } from '@/types/sanity';
import type { SolutionMeta } from '@/types/solutions';

interface SolutionCardProps {
  meta: SolutionMeta;
  /** What the service does, in one line (VERTICAL_CONFIG[vertical].cardLine). */
  line: string;
  /** The service's hero photo; without one the card shows a tint of its accent. */
  image?: HeroImageAsset | null;
}

/**
 * A service on /solutions as a light card, the same family as the project cards:
 * its photo, a line in the service's accent, its name as the heading, one line on
 * what it does, and "Explore {service}". The whole card is one link.
 */
export function SolutionCard({ meta, line, image }: SolutionCardProps) {
  const words = `Explore ${meta.label}`.split(' ');
  const lastWord = words.pop();

  return (
    <Link href={meta.slug} className="block h-full rounded-2xl">
      <Card variant="light" pattern={1} className="h-full">
        {/* The heading names the service, so the photo's alt text stays empty. */}
        <CardImage
          src={image?.url}
          alt=""
          aspectRatio="16 / 10"
          blurDataURL={image?.lqip}
          scrim={false}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"
          placeholderStyle={{ background: `linear-gradient(135deg, ${meta.accent}55 0%, ${meta.accent}22 100%)` }}
        />
        <div aria-hidden className="h-[3px] shrink-0" style={{ background: meta.accent }} />
        <CardBody padding="lg">
          <h2 className="font-display font-bold text-xl text-pe-text leading-[1.3]">{meta.label}</h2>
          <p className="font-body text-sm leading-[1.6] text-pe-text-soft mt-2">{line}</p>
          {/* The card is the link, so this line only takes the arrow link's look. It flows as
              text, and its last word and the arrow form one group that never breaks, so a label
              that wraps on a narrow phone keeps the arrow beside it. */}
          <span className={arrowLinkClasses({ className: 'block mt-auto pt-5 self-start group-hover:text-pe-primary-hover' })}>
            {`${words.join(' ')} `}
            <span className="inline-flex items-center gap-1.5">
              {lastWord}
              <ArrowLinkArrow />
            </span>
          </span>
        </CardBody>
      </Card>
    </Link>
  );
}

// src/components/ui/FeaturedArticleCard.tsx
// One article as a wide card, built like FeaturedProjectCard: the photo takes
// three fifths with the title and meta line over a scrim, and the panel beside
// it holds the excerpt, the author and the action. On phones the photo sits on
// top. The photo does not zoom on hover (the card lifts, as every card does).
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostCard } from '@/types/sanity';
import { SOLUTION_META } from '@/types/solutions';
import { urlFor } from '@/lib/sanity';
import { noPhotoBackground } from '@/lib/noPhotoBackground';
import { initials, postMetaLine, postVertical } from '@/lib/blogUtils';
import { Card } from '@/components/ui/Card';
import { IconArrowRight } from '@/components/ui/Icons';
import { buttonClasses } from '@/components/ui/buttonStyles';

const DEFAULT_LQIP =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// FeaturedProjectCard's scrim, drawn from the nav-dark token.
const SCRIM =
  'linear-gradient(to top, color-mix(in srgb, var(--color-pe-nav-dark) 82%, transparent) 0%, color-mix(in srgb, var(--color-pe-nav-dark) 15%, transparent) 55%, transparent 100%)';

interface FeaturedArticleCardProps {
  post: BlogPostCard;
  /** 2 where the card sits straight under the page's H1 (/blog); 3 under a section h2. */
  headingLevel?: 2 | 3;
  /** Preload the photo: only where the card is the first image on the page. */
  priority?: boolean;
  /** The pill over the photo. Under a heading that names the section ("More articles"), the post's service. */
  kicker?: string;
}

export function FeaturedArticleCard({ post, headingLevel = 2, priority = false, kicker = 'Featured article' }: FeaturedArticleCardProps) {
  const vertical = postVertical(post.tags);
  const meta = vertical ? SOLUTION_META[vertical] : null;
  const Title = headingLevel === 2 ? 'h2' : 'h3';
  const src = post.heroImage?.asset ? urlFor(post.heroImage).width(1200).auto('format').url() : undefined;
  const authorSrc = post.author?.photo?.asset ? urlFor(post.author.photo).width(52).height(52).url() : null;

  return (
    <Link href={`/blog/${post.slug.current}`} className="block rounded-2xl">
      <Card variant="light" pattern={1}>
        <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr]">
          {/* Photo column, with the title over it */}
          <div className="relative z-10 min-h-[260px] overflow-hidden">
            {src ? (
              <Image
                src={src}
                alt=""
                fill
                priority={priority}
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 60vw"
                placeholder="blur"
                blurDataURL={post.heroImage?.asset?.metadata?.lqip ?? DEFAULT_LQIP}
              />
            ) : (
              // No photo: drawn as the post hero draws it, so the white title and meta line stay readable.
              <div className="h-full w-full" style={{ background: noPhotoBackground(meta?.accent) }} />
            )}
            <div className="absolute inset-0" style={{ background: SCRIM }} />
            <div className="absolute left-4 top-4 z-10">
              <span className="rounded-full border border-white/20 bg-pe-primary px-3 py-1.5 font-body text-xs font-bold uppercase tracking-[0.08em] text-white">
                {kicker}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
              <Title className="mb-1 font-display text-2xl font-extrabold leading-[1.2] text-white">{post.title}</Title>
              {/* Full white: over a light photo, 60% white measured 3.1:1 */}
              <p className="font-body text-sm text-white">{postMetaLine(post)}</p>
            </div>
          </div>

          {/* Panel: the excerpt, the author and the action, on the card's own white */}
          <div className="relative z-10 flex flex-col justify-between border-t border-pe-border p-6 sm:border-l sm:border-t-0">
            <div>
              {post.excerpt && (
                <p className="mb-5 line-clamp-4 font-body text-sm leading-[1.7] text-pe-muted">{post.excerpt}</p>
              )}
              {post.author?.name && (
                <div className="mb-5 flex items-center gap-2">
                  {authorSrc ? (
                    <Image src={authorSrc} alt="" width={26} height={26} className="size-[26px] shrink-0 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-pe-primary font-display text-[10px] font-bold text-white">
                      {initials(post.author.name)}
                    </span>
                  )}
                  <span className="font-body text-sm text-pe-text">{post.author.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end border-t border-pe-border pt-4">
              {/* The card is the link, so its action is drawn as a button, not built as one. */}
              <span className={buttonClasses({ size: 'compact', inCard: true })}>
                Read article <IconArrowRight />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

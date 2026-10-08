// src/components/ui/ArticleCard.tsx
// An article as a link to its post, built like ProjectCard: the photo with one
// badge (the service the post's tags name), the title as a heading, a meta line
// with the category, date and read time, the excerpt, and a footer that says
// what the link does. Callers wrap it in their own reveal (AnimatedSection), so
// a grid or carousel item is the wrapper and the card stays a plain link.
import Link from 'next/link';
import type { BlogPostCard } from '@/types/sanity';
import { SOLUTION_META } from '@/types/solutions';
import { urlFor } from '@/lib/sanity';
import { postMetaLine, postVertical } from '@/lib/blogUtils';
import { Card, CardImage, CardBody, CardFooter, CardArrow } from '@/components/ui/Card';

interface ArticleCardProps {
  post: BlogPostCard;
  className?: string;
  /** Roomier padding and type for layouts with only a few posts. */
  size?: 'default' | 'large';
  /** 2 where the cards sit straight under the page's H1 (/blog); 3 under a section h2. */
  headingLevel?: 2 | 3;
  /** next/image sizes; the large default is set from `size`. */
  sizes?: string;
}

const DEFAULT_SIZES = '(max-width:640px) 100vw, (max-width:768px) 50vw, 33vw';
const LARGE_SIZES = '(max-width:768px) 100vw, 50vw';

export function ArticleCard({ post, className, size = 'default', headingLevel = 3, sizes }: ArticleCardProps) {
  const vertical = postVertical(post.tags);
  const meta = vertical ? SOLUTION_META[vertical] : null;
  const large = size === 'large';
  const Title = headingLevel === 2 ? 'h2' : 'h3';
  const src = post.heroImage?.asset ? urlFor(post.heroImage).width(1200).auto('format').url() : undefined;

  return (
    <Link href={`/blog/${post.slug.current}`} className="block h-full rounded-2xl">
      <Card variant="light" pattern={1} className={`h-full ${className ?? ''}`}>
        <CardImage
          src={src}
          alt=""
          aspectRatio="16 / 10"
          blurDataURL={post.heroImage?.asset?.metadata?.lqip}
          sizes={sizes ?? (large ? LARGE_SIZES : DEFAULT_SIZES)}
          placeholderStyle={
            meta
              ? { background: `linear-gradient(135deg, ${meta.accent}55 0%, ${meta.accent}22 100%)` }
              : { background: 'var(--color-pe-border)' }
          }
        >
          {meta && (
            <span
              className="absolute bottom-3 left-3 font-body font-bold text-xs uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
              style={{ background: meta.accent, color: meta.accentText }}
            >
              {meta.label}
            </span>
          )}
        </CardImage>

        <CardBody padding={large ? 'lg' : 'sm'}>
          <Title className={`font-display font-bold text-pe-text leading-[1.3] line-clamp-3 ${large ? 'text-xl' : 'text-lg'}`}>
            {post.title}
          </Title>
          <p className="font-body text-sm text-pe-muted mt-1">{postMetaLine(post)}</p>
          {post.excerpt && (
            <p className="font-body text-sm text-pe-muted leading-[1.65] mt-3 line-clamp-3">{post.excerpt}</p>
          )}
        </CardBody>

        <CardFooter variant="light">
          <span className="font-body text-sm font-semibold text-pe-primary">Read article</span>
          <CardArrow variant="light" />
        </CardFooter>
      </Card>
    </Link>
  );
}

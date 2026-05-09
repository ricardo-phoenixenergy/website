// src/components/ui/ArticleCard.tsx
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import type { BlogPostCard } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';
import { categoryStyle, formatDate } from '@/lib/blogUtils';
import { Card, CardImage, CardBody, CardFooter } from '@/components/ui/Card';

interface ArticleCardProps {
  post: BlogPostCard;
  delay?: number;
  className?: string;
}

export function ArticleCard({ post, delay = 0, className }: ArticleCardProps) {
  const cs = categoryStyle(post.category);
  const imgSrc = post.heroImage?.asset
    ? urlFor(post.heroImage).width(400).height(320).auto('format').url()
    : undefined;
  const blurSrc = post.heroImage?.asset?.metadata?.lqip;

  return (
    <AnimatedSection delay={delay} className={className}>
      <Link href={`/blog/${post.slug.current}`} className="block h-full">
        <Card variant="light" pattern={1} className="h-full">
          <CardImage
            src={imgSrc}
            alt={post.heroImage?.alt ?? post.title}
            height={160}
            blurDataURL={blurSrc}
            sizes="(max-width: 768px) 100vw, 400px"
          >
            {/* Category badge — bottom-left over gradient scrim */}
            <span
              className="absolute bottom-3 left-3 font-body font-bold text-[10px] uppercase tracking-[0.08em] rounded-full px-2.5 py-1"
              style={{ background: cs.bg, color: cs.color }}
            >
              {post.category}
            </span>
          </CardImage>

          <CardBody padding="sm">
            {/* Secondary tags — only rendered if present */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {post.tags.slice(0, 1).map((tag) => (
                  <span
                    key={tag}
                    className="font-body font-semibold text-[10px] rounded-full px-2.5 py-1"
                    style={{ background: 'rgba(112,157,169,0.10)', color: '#39575C' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <p className="font-display font-bold text-sm text-[#1A1A1A] leading-[1.4] mb-2 flex-1 line-clamp-2">
              {post.title}
            </p>

            {/* Excerpt */}
            <p className="font-body text-xs text-[#6B7280] leading-[1.65] mb-3 line-clamp-2">
              {post.excerpt}
            </p>
          </CardBody>

          <CardFooter variant="light">
            <span className="font-body text-xs text-[#9CA3AF]">{formatDate(post.publishedAt)}</span>
            <span className="font-body text-xs font-medium" style={{ color: '#709DA9' }}>
              {post.readTime} min read
            </span>
          </CardFooter>
        </Card>
      </Link>
    </AnimatedSection>
  );
}

// src/components/ui/FeaturedArticleCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostCard } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';
import { categoryStyle, formatDate, initials } from '@/lib/blogUtils';
import { Card } from '@/components/ui/Card';

const DEFAULT_LQIP =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

interface FeaturedArticleCardProps {
  post: BlogPostCard;
}

export function FeaturedArticleCard({ post }: FeaturedArticleCardProps) {
  const cs = categoryStyle(post.category);
  const imgSrc = post.heroImage?.asset
    ? urlFor(post.heroImage).width(600).height(440).auto('format').url()
    : undefined;
  const blurSrc = post.heroImage?.asset?.metadata?.lqip;
  const authorImgSrc = post.author.photo?.asset
    ? urlFor(post.author.photo).width(48).height(48).url()
    : null;

  return (
    <Link href={`/blog/${post.slug.current}`} className="block">
      <Card variant="light" pattern={1}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', minHeight: 240 }}>
          {/* Left: Photo */}
          <div className="relative overflow-hidden z-10" style={{ minHeight: 240 }}>
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={post.heroImage?.alt ?? post.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 100vw, 480px"
                placeholder="blur"
                blurDataURL={blurSrc ?? DEFAULT_LQIP}
              />
            ) : (
              <div className="w-full h-full bg-[#E5E7EB]" />
            )}
            <span
              className="absolute top-3 left-3 z-10 font-body font-bold text-[10px] uppercase tracking-[0.08em] text-white rounded-full px-2.5 py-1"
              style={{ background: '#39575C' }}
            >
              Featured
            </span>
          </div>

          {/* Right: Body */}
          <div className="flex flex-col p-6 relative z-10">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span
                className="font-body font-bold text-[10px] uppercase tracking-[0.08em] rounded-full px-2.5 py-1"
                style={{ background: cs.bg, color: cs.color }}
              >
                {post.category}
              </span>
              {post.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="font-body font-semibold text-[10px] rounded-full px-2.5 py-1"
                  style={{ background: 'rgba(112,157,169,0.10)', color: '#39575C' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="font-display font-extrabold text-xl text-[#1A1A1A] leading-[1.3] mb-2 flex-1 line-clamp-3">
              {post.title}
            </h2>

            <p className="font-body text-sm text-[#6B7280] leading-[1.7] mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-2">
              {authorImgSrc ? (
                <Image
                  src={authorImgSrc}
                  alt={post.author.name}
                  width={26}
                  height={26}
                  className="rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#39575C' }}
                >
                  <span className="font-display font-bold text-[10px] text-white">
                    {initials(post.author.name)}
                  </span>
                </div>
              )}
              <span className="font-body text-xs text-[#6B7280]">
                {post.author.name}
                <span className="mx-1">·</span>
                {formatDate(post.publishedAt)}
                <span className="mx-1">·</span>
                {post.readTime} min read
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// src/components/ui/FeaturedArticleCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostCard } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';
import { categoryStyle, formatDate, initials } from '@/lib/blogUtils';

interface FeaturedArticleCardProps {
  post: BlogPostCard;
}

export function FeaturedArticleCard({ post }: FeaturedArticleCardProps) {
  const cs = categoryStyle(post.category);
  const imgSrc = post.heroImage?.asset
    ? urlFor(post.heroImage).width(600).height(440).auto('format').url()
    : null;
  const blurSrc = post.heroImage?.asset?.metadata?.lqip;
  const authorImgSrc = post.author.photo?.asset
    ? urlFor(post.author.photo).width(48).height(48).url()
    : null;

  return (
    <Link href={`/blog/${post.slug.current}`} className="group block">
      <article
        className="grid overflow-hidden rounded-2xl bg-white transition-all duration-200 group-hover:-translate-y-[3px] group-hover:shadow-[0_12px_32px_rgba(57,87,92,0.10)]"
        style={{
          gridTemplateColumns: '1fr 1fr',
          border: '1px solid #E5E7EB',
          minHeight: 220,
        }}
      >
        {/* Left: Photo */}
        <div className="relative overflow-hidden" style={{ minHeight: 220 }}>
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={post.heroImage?.alt ?? post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
              {...(blurSrc ? { placeholder: 'blur', blurDataURL: blurSrc } : {})}
            />
          ) : (
            <div className="w-full h-full bg-[#E5E7EB]" />
          )}
          {/* FEATURED badge */}
          <span
            className="absolute top-3 left-3 font-body font-bold text-[9px] text-white rounded-full px-2.5 py-1"
            style={{ background: '#39575C' }}
          >
            FEATURED
          </span>
        </div>

        {/* Right: Body */}
        <div className="flex flex-col p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span
              className="font-body font-semibold rounded-full"
              style={{ fontSize: 9, padding: '3px 10px', background: cs.bg, color: cs.color }}
            >
              {post.category}
            </span>
            {post.tags?.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="font-body font-semibold rounded-full"
                style={{ fontSize: 9, padding: '3px 10px', background: 'rgba(112,157,169,0.10)', color: '#39575C' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2
            className="font-display font-extrabold text-[18px] text-[#1A1A1A] leading-[1.3] mb-2 flex-1"
            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p
            className="font-body text-xs text-[#6B7280] leading-[1.75] mb-4"
            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2">
            {authorImgSrc ? (
              <Image
                src={authorImgSrc}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#39575C' }}
              >
                <span className="font-display font-bold text-[8px] text-white">
                  {initials(post.author.name)}
                </span>
              </div>
            )}
            <span className="font-body text-[10px] text-[#6B7280]">
              {post.author.name}
              <span className="mx-1">·</span>
              {formatDate(post.publishedAt)}
              <span className="mx-1">·</span>
              {post.readTime} min read
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

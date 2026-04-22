// src/components/ui/ArticleCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import type { BlogPostCard } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';
import { categoryStyle, formatDate } from '@/lib/blogUtils';

interface ArticleCardProps {
  post: BlogPostCard;
  delay?: number;
}

export function ArticleCard({ post, delay = 0 }: ArticleCardProps) {
  const cs = categoryStyle(post.category);
  const imgSrc = post.heroImage?.asset
    ? urlFor(post.heroImage).width(400).height(260).auto('format').url()
    : null;
  const blurSrc = post.heroImage?.asset?.metadata?.lqip;

  return (
    <AnimatedSection delay={delay}>
      <Link href={`/blog/${post.slug.current}`} className="group block h-full">
        <article
          className="bg-white rounded-[14px] overflow-hidden h-full flex flex-col transition-all duration-200 group-hover:-translate-y-[3px] hover:border-[#cccccc]"
          style={{ border: '1px solid #E5E7EB' }}
        >
          {/* Photo */}
          <div className="relative overflow-hidden" style={{ height: 130 }}>
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={post.heroImage?.alt ?? post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                {...(blurSrc ? { placeholder: 'blur', blurDataURL: blurSrc } : {})}
              />
            ) : (
              <div className="w-full h-full bg-[#E5E7EB]" />
            )}
          </div>

          {/* Body */}
          <div className="p-3.5 flex flex-col flex-1">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span
                className="font-body font-semibold rounded-full"
                style={{ fontSize: 9, padding: '2px 8px', background: cs.bg, color: cs.color }}
              >
                {post.category}
              </span>
              {post.tags?.slice(0, 1).map(tag => (
                <span
                  key={tag}
                  className="font-body font-semibold rounded-full"
                  style={{ fontSize: 9, padding: '2px 8px', background: 'rgba(112,157,169,0.10)', color: '#39575C' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <p
              className="font-display font-bold text-[13px] text-[#1A1A1A] leading-[1.4] mb-1.5 flex-1"
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {post.title}
            </p>

            {/* Excerpt */}
            <p
              className="font-body text-[11px] text-[#6B7280] leading-[1.65] mb-3"
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {post.excerpt}
            </p>

            {/* Footer */}
            <div
              className="flex justify-between items-center pt-2.5"
              style={{ borderTop: '1px solid #E5E7EB' }}
            >
              <span className="font-body text-[10px] text-[#9CA3AF]">{formatDate(post.publishedAt)}</span>
              <span className="font-body text-[10px] font-medium" style={{ color: '#709DA9' }}>
                {post.readTime} min read
              </span>
            </div>
          </div>
        </article>
      </Link>
    </AnimatedSection>
  );
}

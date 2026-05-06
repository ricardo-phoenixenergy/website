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
  className?: string;
}

export function ArticleCard({ post, delay = 0, className }: ArticleCardProps) {
  const cs = categoryStyle(post.category);
  const imgSrc = post.heroImage?.asset
    ? urlFor(post.heroImage).width(400).height(320).auto('format').url()
    : null;
  const blurSrc = post.heroImage?.asset?.metadata?.lqip;

  return (
    <AnimatedSection delay={delay} className={className}>
      <Link href={`/blog/${post.slug.current}`} className="group block h-full">
        <article
          className="bg-white rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-200 group-hover:-translate-y-[5px] group-hover:shadow group-hover:border-[#cccccc]"
          style={{ border: '1px solid #E5E7EB' }}
        >
          {/* Photo */}
          <div className="relative overflow-hidden flex-shrink-0" style={{ height: 160 }}>
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={post.heroImage?.alt ?? post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 100vw, 400px"
                {...(blurSrc ? { placeholder: 'blur', blurDataURL: blurSrc } : {})}
              />
            ) : (
              <div className="w-full h-full bg-[#E5E7EB]" />
            )}
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col flex-1">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <span
                className="font-body font-bold text-[10px] uppercase tracking-[0.08em] rounded-full px-2.5 py-1"
                style={{ background: cs.bg, color: cs.color }}
              >
                {post.category}
              </span>
              {post.tags?.slice(0, 1).map(tag => (
                <span
                  key={tag}
                  className="font-body font-semibold text-[10px] rounded-full px-2.5 py-1"
                  style={{ background: 'rgba(112,157,169,0.10)', color: '#39575C' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <p
              className="font-display font-bold text-sm text-[#1A1A1A] leading-[1.4] mb-2 flex-1 line-clamp-2"
            >
              {post.title}
            </p>

            {/* Excerpt */}
            <p className="font-body text-xs text-[#6B7280] leading-[1.65] mb-3 line-clamp-2">
              {post.excerpt}
            </p>

            {/* Footer */}
            <div
              className="flex justify-between items-center pt-3"
              style={{ borderTop: '1px solid #E5E7EB' }}
            >
              <span className="font-body text-xs text-[#9CA3AF]">{formatDate(post.publishedAt)}</span>
              <span className="font-body text-xs font-medium" style={{ color: '#709DA9' }}>
                {post.readTime} min read
              </span>
            </div>
          </div>
        </article>
      </Link>
    </AnimatedSection>
  );
}

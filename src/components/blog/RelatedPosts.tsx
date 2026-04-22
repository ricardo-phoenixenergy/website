import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostCard } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

interface RelatedPostsProps {
  posts: BlogPostCard[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="bg-white rounded-[14px] p-[18px]" style={{ border: '1px solid #E5E7EB' }}>
      <p className="font-display font-bold text-[13px] text-[#1A1A1A] mb-3">Related articles</p>
      <div className="flex flex-col">
        {posts.map((post, i) => {
          const thumbSrc = post.heroImage?.asset
            ? urlFor(post.heroImage).width(104).height(88).auto('format').url()
            : null;
          return (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="flex gap-3 py-3 group"
              style={{ borderBottom: i < posts.length - 1 ? '1px solid #E5E7EB' : 'none' }}
            >
              {thumbSrc ? (
                <Image
                  src={thumbSrc}
                  alt={post.heroImage?.alt ?? post.title}
                  width={52}
                  height={44}
                  className="rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-[52px] h-11 rounded-lg bg-[#E5E7EB] flex-shrink-0" />
              )}
              <div>
                <p
                  className="font-display font-bold text-[11px] text-[#1A1A1A] leading-[1.35] mb-1 group-hover:text-[#39575C] transition-colors"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {post.title}
                </p>
                <p className="font-body text-[9px] text-[#9CA3AF]">
                  {formatDate(post.publishedAt)}
                  <span className="mx-1">·</span>
                  {post.readTime} min
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { sanityClient } from '@/lib/sanity';
import { LATEST_POSTS_QUERY } from '@/lib/queries';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { formatDate } from '@/lib/utils';
import type { BlogPostCard } from '@/types/sanity';
import { IconArrowRight } from '../ui/Icons';

async function getLatestPosts(): Promise<BlogPostCard[]> {
  try {
    return await sanityClient.fetch<BlogPostCard[]>(LATEST_POSTS_QUERY);
  } catch {
    return [];
  }
}

export async function LatestPosts() {
  const posts = await getLatestPosts();

  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;
  const listPosts = rest.slice(0, 3);

  return (
    <section className="bg-[#F5F5F5] py-12 md:py-[48px]">
      {/* Header row */}
      <AnimatedSection>
        <div className="page-container flex items-end justify-between mb-6">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
              Latest insights
            </p>
            <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
              News, views &{' '}
              <em style={{ color: '#709DA9', fontStyle: 'normal' }}>analysis</em>
            </h2>
          </div>
          <Link
            href="/blog"
            className="group flex items-center gap-1.5 font-body text-sm font-medium text-[#39575C] hover:text-[#2a4045] transition-colors flex-shrink-0 ml-4"
          >
            View all articles
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              <IconArrowRight size={14} />
            </span>
          </Link>
        </div>
      </AnimatedSection>

      {/* Desktop 2-col grid */}
      <div className="page-container grid gap-5 md:grid-cols-2">
        {/* Featured article */}
        {featured && (
          <AnimatedSection delay={0}>
            <Link
              href={`/blog/${featured.slug.current}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] transition-all duration-200 hover:-translate-y-[5px] hover:shadow-[0_16px_40px_rgba(57,87,92,0.12)] hover:border-[#cccccc]"
            >
              {featured.heroImage && (
                <div className="relative overflow-hidden" style={{ height: 180 }}>
                  <Image
                    src={featured.heroImage.asset.url}
                    alt={featured.heroImage.alt ?? featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    placeholder="blur"
                    blurDataURL={featured.heroImage.asset.metadata?.lqip ?? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-[18px]">
                {featured.category && (
                  <span
                    className="inline-block font-body font-bold text-xs uppercase tracking-[0.1em] px-2.5 py-1 rounded-full mb-3"
                    style={{ background: 'rgba(57,87,92,0.1)', color: '#39575C' }}
                  >
                    {featured.category}
                  </span>
                )}
                <h3 className="font-display font-extrabold text-lg text-[#1A1A1A] leading-[1.35] mb-2">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="font-body text-sm text-[#6B7280] leading-[1.7] mb-3 line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}
                <p className="font-body text-xs text-[#6B7280]">
                  {formatDate(featured.publishedAt)}
                  {featured.readTime && ` · ${featured.readTime} min read`}
                </p>
              </div>
            </Link>
          </AnimatedSection>
        )}

        {/* List of 3 articles */}
        {listPosts.length > 0 && (
          <AnimatedSection delay={0.08}>
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB]">
              {listPosts.map((post, i) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group flex gap-3 px-4 py-3.5 hover:bg-[#F5F5F5] transition-all duration-200"
                  style={i < listPosts.length - 1 ? { borderBottom: '1px solid #E5E7EB' } : undefined}
                >
                  {/* Thumbnail */}
                  {post.heroImage && (
                    <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 60, height: 52 }}>
                      <Image
                        src={post.heroImage.asset.url}
                        alt={post.heroImage.alt ?? post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        sizes="60px"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center min-w-0">
                    {post.category && (
                      <span className="font-body font-semibold text-xs uppercase tracking-[0.1em] text-[#709DA9] mb-1">
                        {post.category}
                      </span>
                    )}
                    <p className="font-display font-bold text-sm text-[#1A1A1A] leading-[1.4] line-clamp-2">
                      {post.title}
                    </p>
                    <p className="font-body text-xs text-[#6B7280] mt-1">
                      {formatDate(post.publishedAt)}
                      {post.readTime && ` · ${post.readTime} min`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}

// src/app/blog/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { sanityClient } from '@/lib/sanity';
import {
  BLOG_INDEX_QUERY,
  BLOG_COUNT_QUERY,
  FEATURED_POST_QUERY,
  ALL_BLOG_TAGS_QUERY,
} from '@/lib/queries';
import type { BlogPostCard } from '@/types/sanity';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { FilterPills } from '@/components/ui/FilterPills';
import { FeaturedArticleCard } from '@/components/ui/FeaturedArticleCard';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { CTABanner } from '@/components/sections/CTABanner';
import Link from 'next/link';

export const revalidate = 3600;

const SITE = 'https://phoenixenergy.solutions';
const PAGE_SIZE = 6;

function buildBlogHref(p: number, cat: string, t: string): string {
  const params = new URLSearchParams();
  if (p > 1) params.set('page', String(p));
  if (cat) params.set('category', cat);
  if (t) params.set('tag', t);
  const qs = params.toString();
  return qs ? `/blog?${qs}` : '/blog';
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; tag?: string };
}): Promise<Metadata> {
  const page = Number(searchParams.page) || 1;
  const category = searchParams.category ?? '';
  const tag = searchParams.tag ?? '';
  const canonical = page > 1 ? `${SITE}/blog?page=${page}` : `${SITE}/blog`;

  const total = await sanityClient.fetch<number>(BLOG_COUNT_QUERY, { category, tag } as Record<string, string>);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return {
    title: 'Blog & Insights | Phoenix Energy',
    description:
      'Expert perspectives on clean energy, SA market trends, project spotlights and company news.',
    alternates: {
      canonical,
      ...(page > 1 && {
        prev: `${SITE}${buildBlogHref(page - 1, category, tag)}`,
      }),
      ...(page < totalPages && {
        next: `${SITE}${buildBlogHref(page + 1, category, tag)}`,
      }),
    },
    openGraph: {
      title: 'Blog & Insights | Phoenix Energy',
      description: 'Expert perspectives on clean energy, SA market trends, project spotlights and company news.',
      url: canonical,
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; tag?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const category = searchParams.category ?? '';
  const tag = searchParams.tag ?? '';
  const offset = (page - 1) * PAGE_SIZE;

  // `tag` is a reserved key in Sanity's QueryParams interface (typed `never`),
  // so we cast the params objects to bypass the deprecation guard.
  type GroqParams = { [key: string]: string | number };
  const [posts, total, featured, tags] = await Promise.all([
    sanityClient.fetch<BlogPostCard[]>(BLOG_INDEX_QUERY, { category, tag, offset } as GroqParams),
    sanityClient.fetch<number>(BLOG_COUNT_QUERY, { category, tag } as GroqParams),
    sanityClient.fetch<BlogPostCard | null>(FEATURED_POST_QUERY),
    sanityClient.fetch<string[]>(ALL_BLOG_TAGS_QUERY),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page header */}
      <section style={{ background: '#F5F5F5', paddingTop: 36, paddingBottom: 0 }}>
        <AnimatedSection>
          <div
            className="max-w-[960px] mx-auto px-6 mb-7"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'end' }}
          >
            {/* Left */}
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
                Insights & News
              </p>
              <h1 className="font-display font-extrabold text-4xl text-[#1A1A1A] leading-[1.1] mb-2">
                Energy intelligence,{' '}
                <em style={{ color: '#709DA9', fontStyle: 'normal' }}>delivered</em>
              </h1>
              <p className="font-body text-[13px] text-[#6B7280] leading-[1.75]">
                Expert perspectives on clean energy, SA market trends, project spotlights and company news.
              </p>
            </div>
            {/* Right: search */}
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                width={14}
                height={14}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="search"
                placeholder="Search articles..."
                className="w-full font-body text-xs text-[#1A1A1A] rounded-full outline-none"
                style={{
                  border: '1px solid #E5E7EB',
                  background: '#fff',
                  padding: '10px 16px 10px 38px',
                }}
                readOnly
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Filter pills */}
        <AnimatedSection delay={0.05}>
          <Suspense fallback={null}>
            <FilterPills tags={tags ?? []} activeCategory={category} activeTag={tag} />
          </Suspense>
        </AnimatedSection>
      </section>

      {/* Featured card */}
      {featured && (
        <section style={{ background: '#F5F5F5', padding: '0 24px 20px' }}>
          <AnimatedSection delay={0.1}>
            <div className="max-w-[960px] mx-auto">
              <FeaturedArticleCard post={featured} />
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* Article grid */}
      <section style={{ background: '#F5F5F5', padding: '0 24px 8px' }}>
        <div
          className="max-w-[960px] mx-auto"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}
        >
          {posts.map((post, i) => (
            <ArticleCard key={post._id} post={post} delay={i * 0.04} />
          ))}
          {posts.length === 0 && (
            <div className="col-span-3 py-16 text-center">
              <p className="font-body text-sm text-[#9CA3AF]">No articles found.</p>
            </div>
          )}
        </div>

        {/* SSR Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-10">
            {page > 1 && (
              <Link
                href={buildBlogHref(page - 1, category, tag)}
                className="font-body text-xs text-[#6B7280] px-4 py-2 rounded-full transition-colors hover:bg-white"
                style={{ border: '1px solid #E5E7EB' }}
              >
                ← Prev
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={buildBlogHref(p, category, tag)}
                className="font-body text-xs rounded-full px-3.5 py-2 transition-colors"
                style={
                  p === page
                    ? { background: '#39575C', color: '#fff', border: '1px solid #39575C' }
                    : { background: '#fff', color: '#6B7280', border: '1px solid #E5E7EB' }
                }
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={buildBlogHref(page + 1, category, tag)}
                className="font-body text-xs text-[#6B7280] px-4 py-2 rounded-full transition-colors hover:bg-white"
                style={{ border: '1px solid #E5E7EB' }}
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </section>

      <CTABanner />
    </>
  );
}

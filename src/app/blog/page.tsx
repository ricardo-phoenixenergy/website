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
import { FeaturedArticleCard } from '@/components/ui/FeaturedArticleCard';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { CTABanner } from '@/components/sections/CTABanner';
import { IconArrowLeft, IconArrowRight } from '@/components/ui/Icons';
import { BlogSearchInput } from '@/components/blog/BlogSearchInput';
import { BlogFilterPills } from '@/components/blog/BlogFilterPills';
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
  searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string }>;
}): Promise<Metadata> {
  const { page: pageParam, category: catParam, tag: tagParam, q: qParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const category = catParam ?? '';
  const tag = tagParam ?? '';
  const q = qParam ? `${qParam.trim()}*` : '';
  const canonical = page > 1 ? `${SITE}/blog?page=${page}` : `${SITE}/blog`;

  const total = await sanityClient.fetch<number>(BLOG_COUNT_QUERY, { category, tag, q } as Record<string, string>);
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
      images: [{ url: 'https://phoenixenergy.solutions/og-default.png', width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string }>;
}) {
  const { page: pageParam, category: categoryParam, tag: tagParam, q: qParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const category = categoryParam ?? '';
  const tag = tagParam ?? '';
  const q = qParam ? `${qParam.trim()}*` : '';
  const offset = (page - 1) * PAGE_SIZE;

  // `tag` is a reserved key in Sanity's QueryParams interface (typed `never`),
  // so we cast the params objects to bypass the deprecation guard.
  type GroqParams = { [key: string]: string | number };
  const [posts, total, featured, tags] = await Promise.all([
    sanityClient.fetch<BlogPostCard[]>(BLOG_INDEX_QUERY, { category, tag, offset, q } as GroqParams),
    sanityClient.fetch<number>(BLOG_COUNT_QUERY, { category, tag, q } as GroqParams),
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

      <div className="bg-[#F5F5F5] min-h-screen flex flex-col">

        {/* Page header */}
        <section className="bg-[#F5F5F5]">
          <AnimatedSection>
            <div className="page-container pt-24">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 font-body text-sm text-[#6B7280] mb-6">
                <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
                <span>/</span>
                <span className="font-semibold text-[#39575C]">Blog</span>
              </nav>

              {/* Title block */}
              <div className="mb-6">
                <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
                  Insights &amp; News
                </p>
                <h1 className="font-display font-extrabold text-4xl text-[#1A1A1A] leading-[1.2] mb-3">
                  Energy intelligence,{' '}
                  <em style={{ color: '#709DA9', fontStyle: 'normal' }}>delivered</em>
                </h1>
                <p className="font-body text-base text-[#6B7280] leading-[1.7] max-w-lg">
                  Expert perspectives on clean energy, SA market trends, project spotlights and company news.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Filter pills + search bar */}
          <AnimatedSection delay={0.05}>
            <div className="page-container pb-6">
              <div className="flex flex-col gap-3">
                <div className="flex justify-start sm:justify-between items-center">
                  <Suspense fallback={null}>
                    <BlogSearchInput defaultValue={qParam ?? ''} />
                  </Suspense>
                </div>
                <Suspense fallback={null}>
                  <BlogFilterPills tags={tags ?? []} activeCategory={category} activeTag={tag} />
                </Suspense>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Featured card */}
        {featured && (
          <section className="bg-[#F5F5F5] pb-5">
            <AnimatedSection delay={0.1}>
              <div className="page-container">
                <FeaturedArticleCard post={featured} />
              </div>
            </AnimatedSection>
          </section>
        )}

        {/* Article grid */}
        <section className="flex-1 bg-[#F5F5F5] pb-2">
          <div className="page-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
                  className="font-body text-xs text-[#6B7280] px-4 py-2 rounded-full border border-[#E5E7EB] transition-colors hover:bg-white"
                >
                  <IconArrowLeft size={14} /> Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={buildBlogHref(p, category, tag)}
                  className={`font-body text-xs rounded-full px-3.5 py-2 transition-colors border ${
                    p === page
                      ? 'bg-[#39575C] text-white border-[#39575C]'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                  }`}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  href={buildBlogHref(page + 1, category, tag)}
                  className="font-body text-xs text-[#6B7280] px-4 py-2 rounded-full border border-[#E5E7EB] transition-colors hover:bg-white"
                >
                  Next <IconArrowRight size={14} />
                </Link>
              )}
            </div>
          )}
        </section>

      </div>

      <CTABanner />
    </>
  );
}

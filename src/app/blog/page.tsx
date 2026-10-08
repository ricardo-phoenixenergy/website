// src/app/blog/page.tsx
// /blog follows /projects (src/lib/blogIndex.ts has the rule): below four live
// posts, equal large cards in two columns and nothing to filter; from four,
// the search and the pills, the featured card on page 1 of the whole list, and
// a paged grid without it.
import type { Metadata } from 'next';
import { Suspense, cache } from 'react';
import { sanityServerClient } from '@/lib/sanity.server';
import {
  BLOG_INDEX_QUERY,
  BLOG_COUNT_QUERY,
  PUBLISHED_POSTS_COUNT_QUERY,
  FEATURED_POST_QUERY,
  BLOG_FILTER_ROWS_QUERY,
  LATEST_POSTS_QUERY,
} from '@/lib/queries';
import type { BlogPostCard } from '@/types/sanity';
import { pageMetadata } from '@/lib/seo';
import { blogIndexPath } from '@/lib/blogSeo';
import { blogFilterOptions } from '@/lib/blogUtils';
import {
  BLOG_PAGE_SIZE,
  blogEmptyReason,
  blogExclude,
  blogIndexHref,
  blogIndexView,
  showFeaturedCard,
  type BlogIndexParams,
} from '@/lib/blogIndex';
import { breadcrumbJsonLd, HOME_CRUMB } from '@/lib/structuredData';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { FeaturedArticleCard } from '@/components/ui/FeaturedArticleCard';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { IndexHeader } from '@/components/ui/IndexHeader';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageFooter } from '@/components/layout/PageFooter';
import { BlogSearchInput } from '@/components/blog/BlogSearchInput';
import { BlogFilterPills } from '@/components/blog/BlogFilterPills';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { BlogEmptyState } from '@/components/blog/BlogEmptyState';

export const revalidate = 3600;

const DESCRIPTION = 'Expert perspectives on clean energy, SA market trends, project spotlights and company news.';

// `tag` is a reserved key in Sanity's QueryParams interface (typed `never`),
// so the params objects are cast to bypass the deprecation guard.
type GroqParams = { [key: string]: string | number };

/**
 * Everything the page shows for a request, fetched once and shared by the
 * metadata and the page (React's cache, keyed by the URL's parameters).
 */
const loadIndex = cache(async (pageParam?: string, category?: string, tag?: string, q?: string) => {
  const published = await sanityServerClient.fetch<number>(PUBLISHED_POSTS_COUNT_QUERY);
  const view = blogIndexView({ page: pageParam, category, tag, q }, published);

  if (view.few) {
    // Fewer live posts than the threshold, so the three newest are all of them.
    const posts = published > 0 ? await sanityServerClient.fetch<BlogPostCard[]>(LATEST_POSTS_QUERY) : [];
    return { published, view, posts, total: posts.length, featured: null, options: [] };
  }

  const [lead, rows] = await Promise.all([
    view.filtered ? Promise.resolve(null) : sanityServerClient.fetch<BlogPostCard | null>(FEATURED_POST_QUERY),
    sanityServerClient.fetch<{ category: string | null; tags: string[] | null }[]>(BLOG_FILTER_ROWS_QUERY),
  ]);
  const filters = {
    category: view.category,
    tag: view.tag,
    q: view.search ? `${view.search}*` : '',
    exclude: blogExclude(view, lead),
  };
  const [posts, total] = await Promise.all([
    sanityServerClient.fetch<BlogPostCard[]>(BLOG_INDEX_QUERY, { ...filters, offset: (view.page - 1) * BLOG_PAGE_SIZE } as GroqParams),
    sanityServerClient.fetch<number>(BLOG_COUNT_QUERY, filters as GroqParams),
  ]);
  return {
    published,
    view,
    posts,
    total,
    featured: showFeaturedCard(view, lead) ? lead : null,
    options: blogFilterOptions(rows),
  };
});

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<BlogIndexParams>;
}): Promise<Metadata> {
  const { page, category, tag, q } = await searchParams;
  const { published, view, total } = await loadIndex(page, category, tag, q);
  const totalPages = view.few ? 1 : Math.ceil(total / BLOG_PAGE_SIZE);

  return pageMetadata({
    title: 'News & Insights',
    description: DESCRIPTION,
    // A few posts: every URL shows the same list, so every one points at /blog.
    path: blogIndexPath({ page: view.page, category: view.category, tag: view.tag, q: view.search }),
    // An index with no posts has nothing for search engines, and search results
    // shouldn't be indexed, even below the threshold, where the search is
    // ignored. The sitemap (src/app/sitemap.ts) leaves out both.
    noindex: published === 0 || (q?.trim() ?? '') !== '',
    pagination: {
      previous: view.page > 1 ? blogIndexHref(view, view.page - 1) : undefined,
      next: view.page < totalPages ? blogIndexHref(view, view.page + 1) : undefined,
    },
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<BlogIndexParams>;
}) {
  const { page, category, tag, q } = await searchParams;
  const { published, view, posts, total, featured, options } = await loadIndex(page, category, tag, q);
  const totalPages = view.few ? 1 : Math.ceil(total / BLOG_PAGE_SIZE);

  const jsonLd = breadcrumbJsonLd([HOME_CRUMB, { name: 'News & Insights', path: '/blog' }]);

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="bg-pe-bg pb-16">
        <div className="page-container pt-24">
          <IndexHeader
            crumb="News & Insights"
            eyebrow="News & Insights"
            title={<>Energy intelligence, <em className="not-italic text-pe-primary">delivered</em></>}
            intro={DESCRIPTION}
          />

          {!view.few && (
            <div className="mb-6 flex flex-col gap-3">
              <Suspense fallback={null}>
                <BlogSearchInput defaultValue={view.search} />
              </Suspense>
              <Suspense fallback={null}>
                <BlogFilterPills options={options} total={published} activeCategory={view.category} activeTag={view.tag} />
              </Suspense>
            </div>
          )}

          {featured && (
            <div className="mb-4">
              <FeaturedArticleCard post={featured} priority />
            </div>
          )}

          {posts.length === 0 ? (
            <BlogEmptyState reason={blogEmptyReason(view, published)} search={view.search} />
          ) : view.few ? (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {posts.map((post, i) => (
                <AnimatedSection key={post._id} as="li" delay={i * 0.04}>
                  <ArticleCard post={post} size="large" headingLevel={2} />
                </AnimatedSection>
              ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {posts.map((post, i) => (
                <AnimatedSection key={post._id} as="li" delay={i * 0.04}>
                  <ArticleCard post={post} headingLevel={2} />
                </AnimatedSection>
              ))}
            </ul>
          )}
        </div>

        {/* SSR pagination: chip links, the current page filled; nothing for a single page */}
        <BlogPagination page={view.page} totalPages={totalPages} hrefFor={(p) => blogIndexHref(view, p)} />
      </div>

      <PageFooter ctaVariant="centered" />
    </>
  );
}

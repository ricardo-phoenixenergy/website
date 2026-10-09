// src/app/blog/[slug]/page.tsx
// One template for every post, on the project page's parts: the breadcrumb row
// with the share actions, the shared hero (the service badge when a tag names
// one, the title, then the author, date and read time), the article beside a
// sidebar (the sticky contents, then the author) from 1024px, "More articles" and the
// rounded closing band. The site footer comes from the layout.
// From 1024px only the contents panel stays in view (it is capped to the window,
// so it sticks on a laptop window of any common height): it opens the sidebar, beside the article's first
// lines, and stays there while the article is read; the author card sits at the
// sidebar's foot, beside the tags, and scrolls with the page. That is the order
// phones get too: contents before the article, the author after it.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';
import { sanityServerClient } from '@/lib/sanity.server';
import { POST_BY_SLUG_QUERY, ALL_BLOG_SLUGS_QUERY } from '@/lib/queries';
import type { BlogPost } from '@/types/sanity';
import { pageMetadata, SITE_URL } from '@/lib/seo';
import { breadcrumbJsonLd, HOME_CRUMB } from '@/lib/structuredData';
import { authorUrl, blogArticleJsonLd } from '@/lib/blogSeo';
import { sanityArticleImages, sanityShareImage } from '@/lib/sanityShareImage';
import { postTextComponents } from '@/lib/postTextComponents';
import { postDateLine, postHeadings, postVertical, postWordCount } from '@/lib/blogUtils';
import { articleCta, BLOG_CTA } from '@/config/ctas';
import { SOLUTION_META, type SolutionMeta } from '@/types/solutions';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { Chip } from '@/components/ui/Chip';
import { AuthorCard } from '@/components/blog/AuthorCard';
import { PostNext } from '@/components/blog/PostNext';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageBreadcrumb } from '@/components/ui/PageBreadcrumb';
import { PageHero } from '@/components/ui/PageHero';
import { ClosingBand } from '@/components/ui/ClosingBand';
import { StickyWhenFits } from '@/components/project/StickyWhenFits';
import { BlogReadDepth } from '@/components/analytics/BlogReadDepth';
import { cache } from 'react';

const getPost = cache((slug: string) =>
  sanityServerClient.fetch<BlogPost | null>(POST_BY_SLUG_QUERY, { slug }),
);

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await sanityServerClient.fetch<{ slug: string }[]>(ALL_BLOG_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  // The social share image when the post has one, else its hero. The share image has no alt text of its own.
  const image = sanityShareImage(post.ogImage, post.title) ?? sanityShareImage(post.heroImage, post.title);
  const seoTitle = post.seoTitle?.trim();
  return pageMetadata({
    // An editor's SEO title is used as written; otherwise the template adds the brand.
    title: seoTitle || post.title,
    absoluteTitle: Boolean(seoTitle),
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug.current}`,
    canonical: post.canonicalUrl,
    shareTitle: seoTitle || post.title,
    image,
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [authorUrl(post.author.slug.current)],
      section: post.category,
      tags: post.tags,
    },
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const body = post.body ?? [];
  const headings = postHeadings(body);
  const related = post.related ?? [];
  const tags = post.tags ?? [];
  const canonicalUrl = post.canonicalUrl ?? `${SITE_URL}/blog/${post.slug.current}`;
  const vertical = postVertical(tags);
  const meta: SolutionMeta | null = vertical ? SOLUTION_META[vertical] : null;
  const when = postDateLine(post);

  const articleJsonLd = blogArticleJsonLd(
    {
      title: post.title,
      category: post.category,
      tags: post.tags,
      excerpt: post.excerpt,
      seoDescription: post.seoDescription,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      wordCount: postWordCount(body),
      author: {
        name: post.author.name,
        slug: post.author.slug.current,
        role: post.author.role,
        linkedin: post.author.linkedin,
        photoUrl: post.author.photo?.asset ? urlFor(post.author.photo).width(400).height(400).url() : null,
      },
    },
    { url: canonicalUrl, images: sanityArticleImages(post.heroImage) },
  );
  const breadcrumb = breadcrumbJsonLd([
    HOME_CRUMB,
    { name: 'News & Insights', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug.current}` },
  ]);

  return (
    <div className="min-h-screen bg-pe-bg">
      <BlogReadDepth slug={post.slug.current} category={post.category} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumb} />

      <PageBreadcrumb
        trail={[{ label: 'Home', href: '/' }, { label: 'News & Insights', href: '/blog' }, { label: post.title }]}
        action={<ShareButtons url={canonicalUrl} title={post.seoTitle?.trim() || post.title} />}
      />

      <PageHero
        image={post.heroImage}
        alt={post.heroImage?.alt?.trim() || post.title}
        title={post.title}
        titleId="post-title"
        badge={meta ? { label: meta.label, href: meta.slug, accent: meta.accent, accentText: meta.accentText } : undefined}
        line={{ first: post.author.name, second: when }}
        fallbackAccent={meta?.accent}
      />

      {/* From 1024px the article sits beside the 340px sidebar, as a project's story beside its
          facts; below that the contents come first as a closed disclosure and the author after,
          both no wider than the article (42rem). The author card is rendered once: on phones it
          follows the article, and from 1024px the grid places it at the foot of the sidebar.
          The article spans both rows; the contents panel's cell fills the first (1fr), so the
          panel stays in view down to the author card. */}
      <div className="page-container mt-10 md:mt-12 lg:mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[1fr_auto] lg:gap-x-14 lg:gap-y-4">
        <div className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <TableOfContents items={headings} variant="disclosure" className="mb-8 max-w-[42rem] lg:hidden" />
          <article className="max-w-[42rem]" aria-labelledby="post-title">
            <PortableText value={body} components={postTextComponents(headings)} />

            {/* Wrapped chip rows sit 10px apart, so each chip's 44px touch target stays clear of the next. */}
            {(post.category || tags.length > 0) && (
              <footer className="mt-7 border-t border-pe-border pt-5">
                <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted">Filed under</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2.5">
                  {post.category && <span className="mr-2 font-body text-sm font-semibold text-pe-text">{post.category}</span>}
                  {tags.map((tag) => (
                    <Chip key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                      {tag}
                    </Chip>
                  ))}
                </div>
              </footer>
            )}
          </article>
        </div>
        {/* The panel sticks within its own cell, which ends above the author card, so it stops
            there instead of sliding over the card. */}
        {headings.length > 0 && (
          <div className="hidden lg:col-start-2 lg:row-start-1 lg:block">
            <StickyWhenFits>
              <TableOfContents items={headings} variant="panel" />
            </StickyWhenFits>
          </div>
        )}
        <AuthorCard
          author={post.author}
          className={`mt-8 max-w-[42rem] lg:col-start-2 lg:mt-0 lg:max-w-none lg:self-start ${headings.length > 0 ? 'lg:row-start-2' : 'lg:row-start-1'}`}
        />
      </div>

      <PostNext posts={related} />
      <ClosingBand
        eyebrow="Start your project"
        heading="Want to know what this means for your site?"
        primary={articleCta(vertical, post.title)}
        primaryLocation={`post_band:${post.slug.current}`}
        secondary={BLOG_CTA}
        afterContent={related.length === 0}
      />
    </div>
  );
}

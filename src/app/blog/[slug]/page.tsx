// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';
import { sanityServerClient } from '@/lib/sanity.server';
import { POST_BY_SLUG_QUERY, ALL_BLOG_SLUGS_QUERY } from '@/lib/queries';
import type { BlogPost, PortableTextBlock } from '@/types/sanity';
import { portableTextComponents } from '@/lib/portableTextComponents';
import { TableOfContents, type TocItem } from '@/components/blog/TableOfContents';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { AuthorCard } from '@/components/blog/AuthorCard';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { PageFooter } from '@/components/layout/PageFooter';
import { BlogReadDepth } from '@/components/analytics/BlogReadDepth';
import { cache } from 'react';

const getPost = cache((slug: string) =>
  sanityServerClient.fetch<BlogPost | null>(POST_BY_SLUG_QUERY, { slug }),
);

export const revalidate = 3600;

const SITE = 'https://phoenixenergy.solutions';

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
  const canonical =
    post.canonicalUrl ?? `${SITE}/blog/${post.slug.current}`;
  const ogImageUrl =
    (post.ogImage ?? post.heroImage)?.asset
      ? urlFor(post.ogImage ?? post.heroImage).width(1200).height(630).url()
      : undefined;

  return {
    title: post.seoTitle ?? `${post.title} | Phoenix Energy`,
    description: post.seoDescription ?? post.excerpt,
    alternates: { canonical },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      url: `${SITE}/blog/${post.slug.current}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractTocItems(body: PortableTextBlock[]): TocItem[] {
  return body
    .filter(
      b =>
        b._type === 'block' &&
        (b.style === 'h2' || b.style === 'h3'),
    )
    .map(b => {
      const text = (b.children as Array<{ text: string }>)
        ?.map((c) => c.text)
        .join('') ?? '';
      return {
        id: slugify(text),
        text,
        level: b.style as 'h2' | 'h3',
      };
    });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const tocItems = extractTocItems(post.body);
  const canonicalUrl = post.canonicalUrl ?? `${SITE}/blog/${post.slug.current}`;
  const heroSrc = post.heroImage?.asset
    ? urlFor(post.heroImage).width(1400).height(560).auto('format').url()
    : null;
  const heroBlur = post.heroImage?.asset?.metadata?.lqip;
  const authorPhotoSrc = post.author.photo?.asset
    ? urlFor(post.author.photo).width(52).height(52).url()
    : null;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    ...(heroSrc && { image: heroSrc }),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${SITE}/blog/authors/${post.author.slug.current}`,
      jobTitle: post.author.role,
      worksFor: { '@type': 'Organization', name: 'Phoenix Energy' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Phoenix Energy',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'News & Insights', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <BlogReadDepth slug={post.slug.current} category={post.category} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Post hero */}
      <section className="relative overflow-hidden" style={{ height: 360, background: '#0d1f22' }}>
        {heroSrc && (
          <Image
            src={heroSrc}
            alt={post.heroImage?.alt ?? post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            {...(heroBlur ? { placeholder: 'blur', blurDataURL: heroBlur } : {})}
          />
        )}
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(13,31,34,0.15) 0%, rgba(13,31,34,0.88) 100%)' }}
        />
        {/* Bottom-anchored content */}
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-7">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className="font-body font-bold text-[10px] uppercase tracking-[0.08em] text-white rounded-full px-2.5 py-1"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              {post.category}
            </span>
            {post.tags?.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="font-body font-semibold text-[10px] text-white rounded-full px-2.5 py-1"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white leading-[1.2] mb-3">
            {post.title}
          </h1>
          {/* Meta */}
          <div className="flex items-center gap-2">
            {authorPhotoSrc ? (
              <Image
                src={authorPhotoSrc}
                alt=""
                width={28}
                height={28}
                className="rounded-full object-cover flex-shrink-0"
                style={{ border: '2px solid rgba(255,255,255,0.30)' }}
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#39575C', border: '2px solid rgba(255,255,255,0.30)' }}
              >
                <span className="font-display font-bold text-[10px] text-white">
                  {initials(post.author.name)}
                </span>
              </div>
            )}
            <span className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {post.author.name}
              <span className="mx-1.5">·</span>
              {formatDate(post.publishedAt)}
              <span className="mx-1.5">·</span>
              {post.readTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumb + Share bar */}
      <div
        className="max-w-5xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3 px-6"
        style={{ borderBottom: '1px solid #E5E7EB' }}
      >
        <nav aria-label="Breadcrumb" className="font-body text-xs text-[#6B7280] flex items-center gap-1.5 min-w-0">
          <Link href="/" className="hover:text-[#39575C] transition-colors shrink-0">Home</Link>
          <span className="shrink-0">/</span>
          <Link href="/blog" className="hover:text-[#39575C] transition-colors shrink-0">News &amp; Insights</Link>
          <span className="shrink-0">/</span>
          <span className="text-[#1A1A1A] truncate">
            {post.title}
          </span>
        </nav>
        <ShareButtons url={canonicalUrl} title={post.seoTitle ?? post.title} />
      </div>

      {/* Body — single col on mobile, sidebar on lg+ */}
      <div className="max-w-5xl mx-auto pt-8 pb-12 px-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">

        {/* Article body */}
        <article className="min-w-0">
          <PortableText
            value={post.body}
            components={{
              ...(portableTextComponents as object),
              block: {
                ...((portableTextComponents.block ?? {}) as object),
                h2: ({ children, value }) => {
                  const text = (value?.children as Array<{ text: string }>)
                    ?.map(c => c.text).join('') ?? '';
                  const id = slugify(text);
                  return (
                    <h2
                      id={id}
                      className="font-display font-extrabold text-lg text-[#1A1A1A] leading-tight mt-7 mb-3 scroll-mt-24"
                    >
                      {children}
                    </h2>
                  );
                },
                h3: ({ children, value }) => {
                  const text = (value?.children as Array<{ text: string }>)
                    ?.map(c => c.text).join('') ?? '';
                  const id = slugify(text);
                  return (
                    <h3
                      id={id}
                      className="font-display font-bold text-base text-[#1A1A1A] leading-tight mt-5 mb-2 scroll-mt-24"
                    >
                      {children}
                    </h3>
                  );
                },
              },
            }}
          />

          {/* Tags footer */}
          {post.tags?.length > 0 && (
            <div
              className="flex flex-wrap gap-1.5 pt-5 mt-7"
              style={{ borderTop: '1px solid #E5E7EB' }}
            >
              <span className="font-body font-semibold text-xs text-[#1A1A1A]">Tags:</span>
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="font-body text-xs rounded-full px-2.5 py-1 transition-opacity hover:opacity-80"
                  style={{ background: 'rgba(57,87,92,0.10)', color: '#39575C' }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar — stacks below article on mobile, sticky column on lg+ */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <TableOfContents items={tocItems} />
          <AuthorCard author={post.author} />
          {post.related.length > 0 && <RelatedPosts posts={post.related} />}
        </aside>
      </div>

      <PageFooter ctaVariant="centered" />
    </>
  );
}

// src/app/blog/authors/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { initials } from '@/lib/blogUtils';
import { sanityServerClient } from '@/lib/sanity.server';
import { AUTHOR_BY_SLUG_QUERY, POSTS_BY_AUTHOR_QUERY, ALL_AUTHOR_SLUGS_QUERY } from '@/lib/queries';
import type { Author, BlogPostCard } from '@/types/sanity';
import { pageMetadata } from '@/lib/seo';
import { authorProfileJsonLd } from '@/lib/blogSeo';
import { breadcrumbJsonLd, HOME_CRUMB } from '@/lib/structuredData';
import { JsonLd } from '@/components/layout/JsonLd';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { PageFooter } from '@/components/layout/PageFooter';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Button } from '@/components/ui/Button';
import { IconLinkedIn } from '@/components/ui/Icons';
import { PageBreadcrumb } from '@/components/ui/PageBreadcrumb';
import { cache } from 'react';

const getAuthor = cache((slug: string) =>
  sanityServerClient.fetch<Author | null>(AUTHOR_BY_SLUG_QUERY, { slug }),
);

const getAuthorPosts = cache((slug: string) =>
  sanityServerClient.fetch<BlogPostCard[]>(POSTS_BY_AUTHOR_QUERY, { slug }),
);

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await sanityServerClient.fetch<{ slug: string }[]>(ALL_AUTHOR_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [author, posts] = await Promise.all([getAuthor(slug), getAuthorPosts(slug)]);
  if (!author) return {};
  return pageMetadata({
    title: `${author.name}, News & Insights`,
    description: author.bio ?? (author.role ? `Articles by ${author.name}, ${author.role}.` : `Articles by ${author.name}.`),
    path: `/blog/authors/${slug}`,
    // An author with nothing published yet has a page with nothing on it for search.
    noindex: posts.length === 0,
  });
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [author, posts] = await Promise.all([getAuthor(slug), getAuthorPosts(slug)]);

  if (!author) notFound();

  const photoSrc = author.photo?.asset
    ? urlFor(author.photo).width(176).height(176).url()
    : null;
  const photoLqip = author.photo?.asset?.metadata?.lqip ?? null;

  return (
    <>
      <JsonLd
        data={authorProfileJsonLd({
          name: author.name,
          slug: author.slug.current,
          role: author.role,
          bio: author.bio,
          linkedin: author.linkedin,
          photoUrl: author.photo?.asset ? urlFor(author.photo).width(400).height(400).url() : null,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          HOME_CRUMB,
          { name: 'News & Insights', path: '/blog' },
          { name: author.name, path: `/blog/authors/${author.slug.current}` },
        ])}
      />

      <PageBreadcrumb
        trail={[{ label: 'Home', href: '/' }, { label: 'News & Insights', href: '/blog' }, { label: author.name }]}
      />

      {/* A light header, as the index pages: the photo beside the text from sm, above it on phones */}
      <header className="page-container mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt=""
            width={88}
            height={88}
            className="size-[88px] shrink-0 rounded-full object-cover"
            {...(photoLqip ? { placeholder: 'blur' as const, blurDataURL: photoLqip } : {})}
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-[88px] shrink-0 items-center justify-center rounded-full bg-pe-primary font-display text-2xl font-bold text-white"
          >
            {initials(author.name)}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="font-display text-4xl font-extrabold leading-[1.2] text-pe-text">{author.name}</h1>
          {author.role && <p className="mt-1 font-body text-sm font-medium text-pe-secondary-ink">{author.role}</p>}
          {author.bio && <p className="mt-3 max-w-[60ch] font-body text-base leading-[1.7] text-pe-muted">{author.bio}</p>}
          {author.linkedin && (
            <Button
              variant="ghost"
              size="compact"
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4"
            >
              <IconLinkedIn /> LinkedIn
            </Button>
          )}
        </div>
      </header>

      <section aria-labelledby="author-articles" className="page-container mt-10 pb-16 md:mt-12 lg:mt-16">
        <h2 id="author-articles" className="mb-5 font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted">
          Articles by {author.name}
        </h2>
        {posts.length === 0 ? (
          <p className="font-body text-base text-pe-muted">No articles yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((post, i) => (
              <AnimatedSection key={post._id} as="li" delay={i * 0.04}>
                <ArticleCard post={post} headingLevel={3} />
              </AnimatedSection>
            ))}
          </ul>
        )}
      </section>

      <PageFooter ctaVariant="centered" />
    </>
  );
}

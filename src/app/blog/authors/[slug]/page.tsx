// src/app/blog/authors/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { sanityClient, urlFor } from '@/lib/sanity';
import { AUTHOR_BY_SLUG_QUERY, POSTS_BY_AUTHOR_QUERY, ALL_AUTHOR_SLUGS_QUERY } from '@/lib/queries';
import type { Author, BlogPostCard } from '@/types/sanity';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { CTABanner } from '@/components/sections/CTABanner';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { cache } from 'react';

const getAuthor = cache((slug: string) =>
  sanityClient.fetch<Author | null>(AUTHOR_BY_SLUG_QUERY, { slug }),
);

export const revalidate = 3600;

const SITE = 'https://phoenixenergy.solutions';

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(ALL_AUTHOR_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const author = await getAuthor(params.slug);
  if (!author) return {};
  return {
    title: `${author.name} | Phoenix Energy Blog`,
    description: author.bio ?? `Articles by ${author.name}, ${author.role}`,
    alternates: { canonical: `${SITE}/blog/authors/${params.slug}` },
  };
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
}

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const [author, posts] = await Promise.all([
    getAuthor(params.slug),
    sanityClient.fetch<BlogPostCard[]>(POSTS_BY_AUTHOR_QUERY, { slug: params.slug }),
  ]);

  if (!author) notFound();

  const photoSrc = author.photo?.asset
    ? urlFor(author.photo).width(176).height(176).url()
    : null;
  const photoLqip = author.photo?.asset?.metadata?.lqip ?? null;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0d1f22] px-6 py-14 text-center">
        <AnimatedSection>
          {photoSrc ? (
            <Image
              src={photoSrc}
              alt={author.name}
              width={88}
              height={88}
              className="rounded-full object-cover mx-auto mb-4"
              style={{ border: '3px solid rgba(112,157,169,0.5)' }}
              {...(photoLqip ? { placeholder: 'blur' as const, blurDataURL: photoLqip } : {})}
            />
          ) : (
            <div
              className="w-[88px] h-[88px] rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#39575C', border: '3px solid rgba(112,157,169,0.5)' }}
            >
              <span className="font-display font-bold text-2xl text-white">{initials(author.name)}</span>
            </div>
          )}
          <h1 className="font-display font-extrabold text-3xl text-white mb-1">{author.name}</h1>
          {author.role && (
            <p className="font-body text-sm font-medium mb-3" style={{ color: '#709DA9' }}>
              {author.role}
            </p>
          )}
          {author.bio && (
            <p
              className="font-body text-sm leading-[1.75] max-w-[460px] mx-auto"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {author.bio}
            </p>
          )}
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 font-body font-semibold text-xs text-white rounded-full px-4 py-2 transition-opacity hover:opacity-80"
              style={{ border: '1px solid rgba(255,255,255,0.25)' }}
            >
              LinkedIn →
            </a>
          )}
        </AnimatedSection>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-[960px] mx-auto px-6 py-3" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <nav aria-label="Breadcrumb" className="font-body text-[10px] text-[#6B7280] flex items-center gap-1">
          <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#39575C] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[#1A1A1A]">{author.name}</span>
        </nav>
      </div>

      {/* Posts grid */}
      <section style={{ background: '#F5F5F5', padding: '32px 24px 48px' }}>
        <div className="max-w-[960px] mx-auto mb-6">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-1">
            Articles
          </p>
          <h2 className="font-display font-extrabold text-2xl text-[#1A1A1A]">
            By {author.name}
          </h2>
        </div>
        {posts.length === 0 ? (
          <div className="max-w-[960px] mx-auto py-16 text-center">
            <p className="font-body text-sm text-[#9CA3AF]">No articles yet.</p>
          </div>
        ) : (
          <div className="max-w-[960px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {posts.map((post, i) => (
              <ArticleCard key={post._id} post={post} delay={i * 0.04} />
            ))}
          </div>
        )}
      </section>

      <CTABanner />
    </>
  );
}

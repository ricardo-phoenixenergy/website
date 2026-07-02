import { sanityServerClient } from '@/lib/sanity.server';
import { LATEST_POSTS_QUERY } from '@/lib/queries';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { SectionCarousel } from '@/components/ui/SectionCarousel';
import type { BlogPostCard } from '@/types/sanity';

async function getLatestPosts(): Promise<BlogPostCard[]> {
  try {
    return await sanityServerClient.fetch<BlogPostCard[]>(LATEST_POSTS_QUERY);
  } catch {
    return [];
  }
}

interface LatestPostsProps {
  /** Collapse top padding when stacked under a same-background section. */
  flushTop?: boolean;
}

export async function LatestPosts({ flushTop = false }: LatestPostsProps = {}) {
  const posts = await getLatestPosts();
  if (posts.length === 0) return null;

  return (
    <SectionCarousel
      label="Latest insights"
      title={<>News, views & <em style={{ color: '#709DA9', fontStyle: 'normal' }}>analysis</em></>}
      viewAllHref="/blog"
      viewAllLabel="View all articles"
      bg="gray"
      flushTop={flushTop}
    >
      {posts.map((post, i) => (
        <ArticleCard
          key={post._id}
          post={post}
          delay={i * 0.05}
          className="flex-shrink-0 w-[82vw] md:w-[calc((min(100vw,80rem)-4rem-28px)/3)]"
        />
      ))}
    </SectionCarousel>
  );
}

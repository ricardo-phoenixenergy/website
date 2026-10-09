import { sanityServerClient } from '@/lib/sanity.server';
import { LATEST_POSTS_QUERY } from '@/lib/queries';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { SectionCarousel } from '@/components/ui/SectionCarousel';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import type { BlogPostCard } from '@/types/sanity';

// Four or more: the scroller, each card a third of the container on md+ (as FeaturedProjects).
const CAROUSEL_ITEM = 'flex-shrink-0 w-[82vw] md:w-[calc((min(100vw,80rem)-4rem-28px)/3)]';

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
  // Three or fewer: a static grid, three a row from 768px, as FeaturedProjects.
  const few = posts.length <= 3;

  return (
    <SectionCarousel
      label="Latest insights"
      title={<>News, views & <em className="not-italic text-pe-secondary-ink">analysis</em></>}
      viewAllHref="/blog"
      viewAllLabel="View all articles"
      bg="gray"
      grid={few}
      flushTop={flushTop}
    >
      {posts.map((post, i) => (
        <AnimatedSection key={post._id} as="div" delay={i * 0.05} className={few ? undefined : CAROUSEL_ITEM}>
          <ArticleCard post={post} />
        </AnimatedSection>
      ))}
    </SectionCarousel>
  );
}

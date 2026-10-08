import { sanityServerClient } from '@/lib/sanity.server';
import { LATEST_POSTS_QUERY } from '@/lib/queries';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { SectionCarousel } from '@/components/ui/SectionCarousel';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { carouselLayout } from '@/lib/blogUtils';
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
  // Three or fewer: a static grid, as FeaturedProjects; one or two take large cards.
  const { gridColumns, size } = carouselLayout(posts.length);

  return (
    <SectionCarousel
      label="Latest insights"
      title={<>News, views & <em className="not-italic text-pe-secondary-ink">analysis</em></>}
      viewAllHref="/blog"
      viewAllLabel="View all articles"
      bg="gray"
      gridColumns={gridColumns}
      flushTop={flushTop}
    >
      {posts.map((post, i) => (
        <AnimatedSection key={post._id} as="div" delay={i * 0.05} className={gridColumns ? undefined : CAROUSEL_ITEM}>
          <ArticleCard post={post} size={size} />
        </AnimatedSection>
      ))}
    </SectionCarousel>
  );
}

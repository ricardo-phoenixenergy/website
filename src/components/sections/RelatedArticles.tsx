import { sanityServerClient } from '@/lib/sanity.server';
import { POSTS_BY_VERTICAL_QUERY } from '@/lib/queries';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { SectionCarousel } from '@/components/ui/SectionCarousel';
import type { BlogPostCard } from '@/types/sanity';
import type { SolutionVertical } from '@/types/solutions';
import { SOLUTION_META } from '@/types/solutions';

const VERTICAL_CATEGORY_MAP = {
  'ci-solar-storage':    'Solar & Storage',
  'wheeling':            'Wheeling',
  'energy-optimisation': 'Energy Optimisation',
  'carbon-credits':      'Carbon Credits',
  'webuysolar':          'WeBuySolar',
  'ev-fleets':           'EV Fleets',
} as const satisfies Record<SolutionVertical, string>;

interface RelatedArticlesProps {
  vertical: SolutionVertical;
}

async function getPosts(vertical: SolutionVertical): Promise<BlogPostCard[]> {
  try {
    const tag = VERTICAL_CATEGORY_MAP[vertical];
    return await sanityServerClient.fetch<BlogPostCard[]>(POSTS_BY_VERTICAL_QUERY, { tag } as Record<string, string>);
  } catch {
    return [];
  }
}

export async function RelatedArticles({ vertical }: RelatedArticlesProps) {
  const posts = await getPosts(vertical);
  if (posts.length === 0) return null;

  const meta = SOLUTION_META[vertical];

  return (
    <SectionCarousel
      label="Industry insights"
      title={
        <>
          Further reading on{' '}
          <em style={{ color: meta.accent, fontStyle: 'normal' }}>{meta.label}</em>
        </>
      }
      viewAllHref="/blog"
      viewAllLabel="View all articles"
      bg="gray"
    >
      {posts.map((post, i) => (
        <ArticleCard
          key={post._id}
          post={post}
          delay={i * 0.06}
          className="flex-shrink-0 w-[82vw] md:w-[calc((min(100vw,80rem)-4rem-28px)/3)]"
        />
      ))}
    </SectionCarousel>
  );
}

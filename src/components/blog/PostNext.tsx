// src/components/blog/PostNext.tsx
// "More articles" after the post, on ProjectNext's pattern (relatedLayout):
// - three cards, or two large ones, in a grid;
// - one wide card, whose pill names the post's service (else its category),
//   since the heading already names the section.
// Card titles are h3s under the section's h2. Nothing renders without posts.
import type { BlogPostCard } from '@/types/sanity';
import { SOLUTION_META } from '@/types/solutions';
import { postVertical, relatedLayout } from '@/lib/blogUtils';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { FeaturedArticleCard } from '@/components/ui/FeaturedArticleCard';

export function PostNext({ posts }: { posts: BlogPostCard[] }) {
  const layout = relatedLayout(posts.length);
  if (!layout) return null;
  const first = posts[0];
  const vertical = postVertical(first.tags);

  return (
    <section aria-labelledby="more-articles" className="mt-10 bg-white py-8 md:mt-12 lg:mt-16">
      <div className="page-container">
        <h2 id="more-articles" className="mb-5 font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted">
          More articles
        </h2>
        {layout === 'wide' ? (
          <FeaturedArticleCard post={first} headingLevel={3} kicker={vertical ? SOLUTION_META[vertical].label : first.category} />
        ) : (
          <ul className={layout === 'three' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3' : 'grid grid-cols-1 gap-6 md:grid-cols-2'}>
            {posts.map((post) => (
              <li key={post._id}>
                <ArticleCard post={post} headingLevel={3} size={layout === 'two' ? 'large' : 'default'} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

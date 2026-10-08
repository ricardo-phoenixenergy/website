// src/components/blog/BlogEmptyState.tsx
// What /blog says in place of the grid when it is empty, with a way back to
// every article. With no live posts at all there is nothing to go back to.
import { ArrowLink } from '@/components/ui/ArrowLink';
import type { BlogEmptyReason } from '@/lib/blogIndex';

interface BlogEmptyStateProps {
  reason: BlogEmptyReason;
  /** The search as typed, for the search message. */
  search: string;
}

const MESSAGE: Record<Exclude<BlogEmptyReason, 'search'>, string> = {
  none: 'Articles are on their way.',
  filter: 'No articles match this filter.',
  page: 'There are no articles on this page.',
};

export function BlogEmptyState({ reason, search }: BlogEmptyStateProps) {
  const message = reason === 'search' ? `No articles match “${search}”.` : MESSAGE[reason];
  return (
    <div className="rounded-card border border-pe-border bg-white px-6 py-12 text-center">
      <p className="font-body text-base text-pe-text">{message}</p>
      {reason !== 'none' && (
        <ArrowLink href="/blog" className="mt-3">
          Show all articles
        </ArrowLink>
      )}
    </div>
  );
}

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { FilterPills, type FilterPill } from '@/components/ui/FilterPills';
import type { BlogFilterOption } from '@/lib/blogUtils';

interface BlogFilterPillsProps {
  /** The categories and tags that have live posts, with counts (blogFilterOptions). */
  options: BlogFilterOption[];
  /** Every live post, for the "All articles" pill. */
  total: number;
  activeCategory: string;
  activeTag: string;
}

/** Pills come from the data, with counts, as on /projects, so no pill leads to an empty grid. */
export function BlogFilterPills({ options, total, activeCategory, activeTag }: BlogFilterPillsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pills: FilterPill[] = useMemo(() => [
    { key: '', label: `All articles (${total})` },
    ...options.map((o) => ({ key: `${o.kind === 'category' ? 'cat' : 'tag'}:${o.value}`, label: `${o.value} (${o.count})` })),
  ], [options, total]);

  const activeKey = activeTag
    ? `tag:${activeTag}`
    : activeCategory
    ? `cat:${activeCategory}`
    : '';

  const handleSelect = useCallback((key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    params.delete('category');
    params.delete('tag');
    if (key.startsWith('cat:')) params.set('category', key.slice(4));
    else if (key.startsWith('tag:')) params.set('tag', key.slice(4));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [router, pathname, searchParams]);

  return <FilterPills pills={pills} activeKey={activeKey} onSelect={handleSelect} />;
}

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { FilterPills, type FilterPill } from '@/components/ui/FilterPills';

const CATEGORIES = [
  'Industry Insights',
  'Project Spotlight',
  'Company News',
  'Press Release',
];

interface BlogFilterPillsProps {
  tags: string[];
  activeCategory: string;
  activeTag: string;
}

export function BlogFilterPills({ tags, activeCategory, activeTag }: BlogFilterPillsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pills: FilterPill[] = useMemo(() => [
    { key: '', label: 'All articles' },
    ...CATEGORIES.map(c => ({ key: `cat:${c}`, label: c })),
    ...tags.map(t => ({ key: `tag:${t}`, label: t })),
  ], [tags]);

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

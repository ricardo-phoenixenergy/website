'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const CATEGORIES = [
  'All articles',
  'Industry Insights',
  'Project Spotlight',
  'Company News',
  'Press Release',
] as const;

interface FilterPillsProps {
  tags: string[];
  activeCategory: string;
  activeTag: string;
}

export function FilterPills({ tags, activeCategory, activeTag }: FilterPillsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: 'category' | 'tag', value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page');
      if (value === '' || value === 'All articles') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const pillBase = 'font-body text-[11px] rounded-full px-3 py-1.5 cursor-pointer transition-all duration-150 select-none';
  const activeStyle = { background: '#39575C', border: '1px solid #39575C', color: '#ffffff', fontWeight: 600 };
  const inactiveStyle = { background: '#ffffff', border: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 500 };

  return (
    <div className="flex flex-wrap gap-2 pb-5 max-w-[960px] mx-auto px-6">
      {CATEGORIES.map(cat => {
        const isActive = cat === 'All articles' ? activeCategory === '' : activeCategory === cat;
        return (
          <button
            key={cat}
            className={pillBase}
            style={isActive ? activeStyle : inactiveStyle}
            onClick={() => updateFilter('category', cat === 'All articles' ? '' : cat)}
          >
            {cat}
          </button>
        );
      })}
      {tags.map(tag => {
        const isActive = activeTag === tag;
        return (
          <button
            key={tag}
            className={pillBase}
            style={isActive ? activeStyle : inactiveStyle}
            onClick={() => updateFilter('tag', isActive ? '' : tag)}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

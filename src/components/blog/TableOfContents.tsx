// src/components/blog/TableOfContents.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: 'h2' | 'h3';
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );

    items.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-[14px] p-[18px]" style={{ border: '1px solid #E5E7EB' }}>
      <p className="font-display font-bold text-[13px] text-[#1A1A1A] mb-3">In this article</p>
      <div className="flex flex-col">
        {items.map((item, i) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={e => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-start gap-2.5 py-2.5 transition-colors duration-200"
              style={{
                borderBottom: i < items.length - 1 ? '1px solid #E5E7EB' : 'none',
                borderLeft: isActive ? '3px solid #39575C' : '3px solid transparent',
                paddingLeft: 10,
                color: isActive ? '#39575C' : '#6B7280',
              }}
            >
              <span
                className="font-body font-bold flex-shrink-0"
                style={{ fontSize: 10, color: '#709DA9' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="font-body leading-tight"
                style={{
                  fontSize: 11,
                  fontWeight: item.level === 'h2' ? 500 : 400,
                  paddingLeft: item.level === 'h3' ? 8 : 0,
                }}
              >
                {item.text}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

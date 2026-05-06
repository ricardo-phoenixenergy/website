'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { dlPush } from '@/lib/analytics';

const DEPTHS = [25, 50, 75, 90] as const;

export function ScrollDepth() {
  const pathname = usePathname();
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    firedRef.current = new Set();

    const sentinels = DEPTHS.map(depth => {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;top:${depth}%;left:0;width:1px;height:1px;pointer-events:none;`;
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('data-scroll-sentinel', String(depth));
      document.body.appendChild(el);
      return { el, depth };
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const depth = Number(
          (entry.target as HTMLElement).dataset.scrollSentinel
        ) as (typeof DEPTHS)[number];
        if (firedRef.current.has(depth)) return;
        firedRef.current.add(depth);
        dlPush({ event: 'scroll_depth', depth_percentage: depth, page_path: pathname });
      });
    });

    sentinels.forEach(({ el }) => observer.observe(el));

    return () => {
      observer.disconnect();
      sentinels.forEach(({ el }) => el.remove());
    };
  }, [pathname]);

  return null;
}

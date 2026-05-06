'use client';

import { useEffect, useRef } from 'react';
import { dlPush } from '@/lib/analytics';

interface BlogReadDepthProps {
  slug: string;
  category?: string;
}

export function BlogReadDepth({ slug, category }: BlogReadDepthProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;bottom:10%;left:0;width:1px;height:1px;pointer-events:none;';
    sentinel.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || firedRef.current) return;
      firedRef.current = true;
      dlPush({ event: 'blog_read_complete', post_slug: slug, post_category: category });
    });

    observer.observe(sentinel);
    return () => { observer.disconnect(); sentinel.remove(); };
  }, [slug, category]);

  return null;
}

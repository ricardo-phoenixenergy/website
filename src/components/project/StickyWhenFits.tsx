'use client';

// Makes its child stay in view below the navbar while the page scrolls, but only
// while the child fits in the window, with a margin under it. A taller child
// scrolls with the page, so nothing at its foot is out of reach. Without
// JavaScript it simply scrolls.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { fitsInWindow, STICKY_TOP } from '@/lib/stickyFit';

export function StickyWhenFits({ children, top = STICKY_TOP }: { children: ReactNode; top?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const check = () => setSticky(fitsInWindow(element.offsetHeight, window.innerHeight, top));
    check();
    const observer = new ResizeObserver(check);
    observer.observe(element);
    window.addEventListener('resize', check);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', check);
    };
  }, [top]);

  return (
    <div ref={ref} className={sticky ? 'sticky' : undefined} style={sticky ? { top } : undefined}>
      {children}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

interface MountWhenVisibleProps {
  children: React.ReactNode;
  /** Rendered until the wrapper first comes near the viewport. */
  placeholder?: React.ReactNode;
  rootMargin?: string;
}

/**
 * Mounts heavy children (charts) only once the wrapper nears the viewport.
 * A wrapper inside a `display: none` branch never intersects, so a hidden
 * responsive variant never pays for what it contains.
 */
export function MountWhenVisible({ children, placeholder = null, rootMargin = '200px' }: MountWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return <div ref={ref}>{visible ? children : placeholder}</div>;
}

'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  as?: 'div' | 'section' | 'article' | 'li';
}

/**
 * Wrapper whose content fades up once as it scrolls into view. Visible in the
 * server HTML and for reduced-motion visitors; see useScrollReveal.
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
  threshold = 0.15,
  as = 'div',
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { delay, threshold });

  const Tag = as as 'div';
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

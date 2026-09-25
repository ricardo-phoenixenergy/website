'use client';

import { useEffect, type RefObject } from 'react';
import { animate } from 'framer-motion';
import { prefersReducedMotion } from './useReducedMotion';

interface ScrollRevealOptions {
  /** Seconds to wait after the element enters view. */
  delay?: number;
  /** Starting offset in px; the element rises this far as it fades in. */
  y?: number;
  /** Fraction of the element that must be visible before it reveals. */
  threshold?: number;
}

/**
 * Fades an element up as it scrolls into view, but only when it starts below
 * the fold. The server HTML is never hidden, so content does not depend on
 * JavaScript and anything on screen at load stays exactly as rendered.
 * Reduced-motion visitors get no reveal at all.
 */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  { delay = 0, y = 16, threshold = 0.15 }: ScrollRevealOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.style.opacity = '0';
    el.style.transform = `translateY(${y}px)`;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        animate(
          el,
          { opacity: 1, transform: 'translateY(0px)' },
          { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
        );
      },
      { threshold },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      el.style.opacity = '';
      el.style.transform = '';
    };
  }, [ref, delay, y, threshold]);
}

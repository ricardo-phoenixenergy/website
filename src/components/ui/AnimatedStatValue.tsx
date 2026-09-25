'use client';

import { useEffect, useMemo, useRef } from 'react';
import { animate } from 'framer-motion';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';

/**
 * A number that renders its final value, then, if it starts off-screen, counts
 * up from 0 the first time it scrolls into view. The server HTML and screen
 * readers always get the real value.
 */
function CountUpNumber({
  value, delay = 0, duration = 1.2,
}: { value: number; delay?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    node.textContent = '0';
    let controls: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        controls = animate(0, value, {
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (latest) => { node.textContent = String(Math.round(latest)); },
        });
      },
      { rootMargin: '0px 0px -80px 0px' },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      controls?.stop();
      node.textContent = String(value);
    };
  }, [value, delay, duration]);

  return <span ref={ref}>{value}</span>;
}

/**
 * Splits a stat string ("12 MWp", "40+") into text and numbers; numbers count
 * up once they scroll into view, the rest renders in `accent`.
 */
export function AnimatedStatValue({
  value, delay = 0, accent = 'var(--color-pe-secondary-ink)',
}: { value: string; delay?: number; accent?: string }) {
  // Precompute tokens (and each number's stagger index) immutably — no mutation during render.
  const tokens = useMemo(() => {
    const parts = value.split(/(\d+)/).filter((p) => p !== '');
    const isNum = (p: string) => /^\d+$/.test(p);
    return parts.map((part, idx) => ({
      part,
      isNumber: isNum(part),
      numIndex: isNum(part) ? parts.slice(0, idx).filter(isNum).length : -1,
    }));
  }, [value]);

  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {tokens.map((t, i) =>
          t.isNumber ? (
            <CountUpNumber key={i} value={parseInt(t.part, 10)} delay={delay + t.numIndex * 0.18} />
          ) : (
            <span key={i} style={{ color: accent }}>{t.part}</span>
          ),
        )}
      </span>
    </>
  );
}

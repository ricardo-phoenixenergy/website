'use client';

import { useEffect, useMemo, useRef } from 'react';
import { animate } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* Counts a single integer from 0 → value once it scrolls into view. */
function CountUpNumber({
  value, inView, delay = 0, duration = 1.2,
}: { value: number; inView: boolean; delay?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced) { node.textContent = String(value); return; }
    if (!inView) { node.textContent = '0'; return; }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => { node.textContent = String(Math.round(latest)); },
    });
    return () => controls.stop();
  }, [inView, reduced, value, delay, duration]);

  return <span ref={ref}>0</span>;
}

/**
 * Splits a stat string into text + numeric tokens and counts each number up
 * from 0 once `inView` is true. Non-numeric tokens render in `accent`.
 */
export function AnimatedStatValue({
  value, inView, delay = 0, accent = '#709DA9',
}: { value: string; inView: boolean; delay?: number; accent?: string }) {
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
      {tokens.map((t, i) =>
        t.isNumber ? (
          <CountUpNumber key={i} value={parseInt(t.part, 10)} inView={inView} delay={delay + t.numIndex * 0.18} />
        ) : (
          <span key={i} style={{ color: accent }}>{t.part}</span>
        ),
      )}
    </>
  );
}

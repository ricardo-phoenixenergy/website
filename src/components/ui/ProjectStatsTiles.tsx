'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Stat {
  value: string;
  label: string;
}

interface ProjectStatsTilesProps {
  stats: Stat[];
  className?: string;
}

const SHIMMER_DELAYS = ['0s', '0.55s', '1.1s', '1.65s'] as const;
const STAGGER_DELAYS = [0, 0.1, 0.2, 0.3] as const;

const MD_COLS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

export function ProjectStatsTiles({ stats, className }: ProjectStatsTilesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const count = Math.min(stats.length, 4);

  return (
    <div
      ref={ref}
      className={cn('grid grid-cols-2 gap-[3px] rounded-xl overflow-hidden p-[3px]', MD_COLS[count] ?? 'md:grid-cols-4', className)}
      style={{ background: '#0d1f22' }}
    >
      {stats.slice(0, count).map((stat, i) => (
        <motion.div
          key={i}
          className="shimmer-tile"
          initial={reduced ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 24, delay: STAGGER_DELAYS[i] }}
          style={{
            borderRadius: 9,
            background: i === 0
              ? 'linear-gradient(140deg, #1a4a52 0%, #0f2d33 100%)'
              : 'rgba(255,255,255,0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '22px 12px',
            position: 'relative',
            overflow: 'hidden',
            '--shimmer-delay': SHIMMER_DELAYS[i],
          } as React.CSSProperties}
        >
          {i === 0 && (
            <span
              aria-hidden
              style={{
                position: 'absolute',
                top: -24, left: -24,
                width: 96, height: 96,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(112,157,169,0.25) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          )}
          <span
            className="font-display font-extrabold text-white leading-none relative z-10"
            style={{ fontSize: i === 0 ? 28 : 24 }}
          >
            {stat.value}
          </span>
          <span
            className="font-body relative z-10 text-center"
            style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.38)',
              textTransform: 'uppercase',
              letterSpacing: '0.09em',
              marginTop: 5,
            }}
          >
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const STORY_STATS = [
  { value: 'R380M', label: 'Client savings', featured: true  },
  { value: '48MW',  label: 'Deployed',        featured: false },
  { value: '120+',  label: 'Projects',         featured: false },
  { value: '12kt',  label: 'CO₂ saved / yr',   featured: false },
] as const;

const SHIMMER_DELAYS  = ['0.2s', '0.8s', '1.4s', '2.0s'] as const;
const STAGGER_DELAYS  = [0, 0.15, 0.3, 0.45] as const;

export function AboutStory() {
  const panelRef = useRef<HTMLDivElement>(null);
  const inView   = useInView(panelRef, { once: true, margin: '-60px' });
  const reduced  = useReducedMotion();

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="page-container grid gap-11 md:grid-cols-2 md:items-start">

        {/* ── Left — animated stat panel ────────────────────────────────────── */}
        <div
          ref={panelRef}
          className="relative rounded-2xl overflow-hidden"
          style={{ height: 230, background: '#0d1f22' }}
        >
          {/* 2×2 tile grid */}
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: 3,
              padding: 3,
            }}
          >
            {STORY_STATS.map((stat, i) => (
              <motion.div
                key={stat.value}
                className="shimmer-tile"
                initial={reduced ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 24, delay: STAGGER_DELAYS[i] }}
                style={{
                  borderRadius: 8,
                  background: stat.featured
                    ? 'linear-gradient(140deg, #1a4a52 0%, #0f2d33 100%)'
                    : 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 8px',
                  position: 'relative',
                  overflow: 'hidden',
                  '--shimmer-delay': SHIMMER_DELAYS[i],
                } as React.CSSProperties}
              >
                {/* Radial glow on featured tile only */}
                {stat.featured && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: -20, left: -20,
                      width: 80, height: 80,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(112,157,169,0.25) 0%, transparent 70%)',
                    }}
                  />
                )}
                <span
                  className="font-display font-extrabold text-white leading-none relative z-10"
                  style={{ fontSize: stat.featured ? 26 : 24 }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-body relative z-10"
                  style={{
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.38)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginTop: 4,
                    textAlign: 'center',
                  }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

        </div>

        {/* ── Right — copy ────────────────────────────────────────────────────── */}
        <AnimatedSection delay={0.6}>
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
            Who we are
          </p>
          <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2] mb-4">
            Phoenix at a <em style={{ color: '#709DA9', fontStyle: 'normal' }}>glance</em>
          </h2>
          <p className="font-body text-sm leading-[1.8] text-[#6B7280]">
            Phoenix Energy is a South African commercial and industrial energy company.{' '}
            <strong className="font-semibold text-[#1A1A1A]">Not a solar installer. Not an equipment supplier.</strong>{' '}
            A sophisticated energy partner that designs, finances, acquires and optimises
            integrated energy ecosystems for businesses that are serious about their energy future.
          </p>
        </AnimatedSection>

      </div>
    </section>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { SOLUTION_META } from '@/types/solutions';
import type { SolutionVertical } from '@/types/solutions';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Panel {
  vertical: SolutionVertical;
  number: string;
  bgTint: string;
  href: string;
  title: string;
  description: string;
}

const PANELS: Panel[] = [
  {
    vertical: 'ci-solar-storage',
    number: '01',
    bgTint: '#2a3d28',
    href: '/solutions/ci-solar-storage',
    title: 'Power your business with solar & storage',
    description: 'Design, finance, install and operate solar + BESS systems for C&I clients across Southern Africa.',
  },
  {
    vertical: 'wheeling',
    number: '02',
    bgTint: '#3d2a28',
    href: '/solutions/wheeling',
    title: 'Buy cheaper renewable energy via the grid',
    description: 'Access clean, cost-effective electricity through our established wheeling network — no equipment required.',
  },
  {
    vertical: 'carbon-credits',
    number: '03',
    bgTint: '#28352a',
    href: '/solutions/carbon-credits',
    title: 'Turn clean energy into certified revenue',
    description: 'Register, certify and monetise carbon credits from your renewable assets under the Gold Standard.',
  },
  {
    vertical: 'energy-optimisation',
    number: '04',
    bgTint: '#1e2e38',
    href: '/solutions/energy-optimisation',
    title: 'Eliminate energy waste intelligently',
    description: 'Expert audit, tariff restructuring and demand management — maximise every kilowatt at zero cost.',
  },
  {
    vertical: 'ev-fleets',
    number: '05',
    bgTint: '#1e3230',
    href: '/solutions/ev-fleets',
    title: 'Electrify your fleet from day one',
    description: 'End-to-end fleet electrification — infrastructure, vehicles, financing and management in one solution.',
  },
  {
    vertical: 'webuysolar',
    number: '06',
    bgTint: '#2e1e10',
    href: '/solutions/webuysolar',
    title: 'Sell your solar system fast & fair',
    description: 'Get an instant valuation and formal offer within 5 business days. Phoenix Energy buys and redeploys solar assets.',
  },
];

const INTERVAL = 4000;

const revealVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay, ease: 'easeOut' as const },
  }),
  exit: { opacity: 0, transition: { duration: 0.15 } },
} as const;

const barVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.3, delay: 0.18, ease: 'easeOut' as const },
  },
  exit: { scaleX: 0, opacity: 0, transition: { duration: 0.1 } },
} as const;

export function HeroAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const isPausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduced = useReducedMotion();

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setActiveIndex((prev) => (prev + 1) % PANELS.length);
        setProgressKey((k) => k + 1);
      }
    }, INTERVAL);
  }, []);

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startInterval]);

  const handlePanelEnter = (i: number) => {
    isPausedRef.current = true;
    setActiveIndex(i);
    setProgressKey((k) => k + 1);
  };

  const handleWrapperLeave = () => {
    isPausedRef.current = false;
    startInterval();
    setProgressKey((k) => k + 1);
  };

  return (
    <div
      className="relative flex w-full overflow-hidden"
      style={{ height: 'calc(100vh - 60px)', minHeight: 500 }}
      onMouseLeave={handleWrapperLeave}
    >
      {PANELS.map((panel, i) => {
        const meta = SOLUTION_META[panel.vertical];
        const isActive = i === activeIndex;

        return (
          <div
            key={panel.vertical}
            className="relative overflow-hidden cursor-pointer transition-all duration-[600ms]"
            style={{
              flex: isActive ? 5 : 1,
              transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
              borderRight: i < PANELS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : undefined,
            }}
            onMouseEnter={() => handlePanelEnter(i)}
          >
            {/* Background gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${panel.bgTint}, #0d1f22)`,
              }}
            />

            {/* Active gradient overlay */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background: isActive
                  ? 'linear-gradient(180deg, rgba(13,31,34,0.1) 0%, rgba(13,31,34,0.82) 60%, rgba(13,31,34,0.95) 100%)'
                  : 'rgba(13,31,34,0.72)',
                opacity: 1,
              }}
            />

            {/* Panel number */}
            <div
              className="absolute top-4 left-3 font-display font-extrabold text-sm transition-opacity duration-300"
              style={{ color: 'rgba(255,255,255,0.2)', opacity: isActive ? 0 : 1 }}
            >
              {panel.number}
            </div>

            {/* Collapsed eyebrow — vertical */}
            {!isActive && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <p
                  className="font-body text-xs font-bold uppercase tracking-[0.14em] whitespace-nowrap"
                  style={{
                    color: 'rgba(255,255,255,0.45)',
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                  }}
                >
                  {meta.label}
                </p>
              </div>
            )}

            {/* Active panel content */}
            {isActive && (
              <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-8 md:pb-12">
                <AnimatePresence mode="wait">
                  <motion.div key={`content-${i}`}>
                    {/* Accent bar */}
                    <motion.div
                      variants={barVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="h-0.5 mb-4 origin-left"
                      style={{
                        width: 40,
                        background: meta.accent,
                      }}
                    />

                    {/* Eyebrow */}
                    <motion.p
                      custom={0.18}
                      variants={revealVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-2"
                      style={{ color: meta.accent }}
                    >
                      {meta.label}
                    </motion.p>

                    {/* Title */}
                    <motion.h2
                      custom={0.2}
                      variants={revealVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="font-display font-extrabold text-white leading-[1.15] mb-3"
                      style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', maxWidth: 520 }}
                    >
                      {panel.title}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                      custom={0.28}
                      variants={revealVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="font-body text-base font-normal leading-[1.75] mb-5"
                      style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 440 }}
                    >
                      {panel.description}
                    </motion.p>

                    {/* CTA link */}
                    <motion.div
                      custom={0.36}
                      variants={revealVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Link
                        href={panel.href}
                        className="inline-flex items-center gap-2 font-body font-semibold text-base transition-colors duration-150"
                        style={{ color: meta.accent }}
                      >
                        Explore {meta.label}
                        <span className="text-sm">→</span>
                      </Link>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Progress bar at bottom */}
            {isActive && !reduced && (
              <div className="absolute bottom-0 inset-x-0 h-0.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  key={`bar-${progressKey}`}
                  className="h-full origin-left"
                  style={{
                    background: meta.accent,
                    animation: `fillProgress ${INTERVAL}ms linear forwards`,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

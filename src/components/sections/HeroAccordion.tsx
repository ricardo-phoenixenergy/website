'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { SOLUTION_META } from '@/types/solutions';
import type { SolutionVertical } from '@/types/solutions';
import type { HeroImages } from '@/types/sanity';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { IconArrowRight } from '@/components/ui/Icons';

interface Panel {
  vertical: SolutionVertical;
  number: string;
  href: string;
  title: string;
  description: string;
}

const PANELS: Panel[] = [
  {
    vertical: 'ci-solar-storage',
    number: '01',
    href: '/solutions/ci-solar-storage',
    title: 'Reduce your electricity costs with solar & storage',
    description: 'Design, finance, install and operate commercial solar and battery systems that lower energy costs, improve energy resilience and maximise long-term savings.',
  },
  {
    vertical: 'wheeling',
    number: '02',
    href: '/solutions/wheeling',
    title: 'Buy cheaper renewable energy via the grid',
    description: 'Choose from flexible wheeling solutions that give your business access to lower-cost renewable electricity through the grid.',
  },
  {
    vertical: 'webuysolar',
    number: '03',
    href: '/solutions/webuysolar',
    title: 'Cash in your solar investment',
    description: 'Sell your existing solar system while continuing to buy the electricity it generates at a lower cost than your utility—unlocking capital without losing the benefits.',
  },
  {
    vertical: 'energy-optimisation',
    number: '04',
    href: '/solutions/energy-optimisation',
    title: 'Reduce energy costs before adding generation',
    description: 'Identify and eliminate energy waste through efficiency upgrades, tariff optimisation, demand management and intelligent energy monitoring.',
  },
  {
    vertical: 'ev-fleets',
    number: '05',
    href: '/solutions/ev-fleets',
    title: 'Electrify your fleet from day one',
    description: 'End-to-end fleet electrification — infrastructure, vehicles, financing and management in one solution.',
  },
  {
    vertical: 'carbon-credits',
    number: '06',
    href: '/solutions/carbon-credits',
    title: 'Turn your solar into a new revenue stream',
    description: 'We register, verify and trade carbon credits on your behalf, creating additional revenue from the clean energy your system already generates.',
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

// ─── Shared panel content (active state) ─────────────────────────────────────

function PanelBackground({
  img, alt, accent, isActive, sizes, priority,
}: {
  img: { url: string; lqip?: string } | null | undefined;
  alt: string;
  accent: string;
  isActive: boolean;
  sizes: string;
  priority: boolean;
}) {
  if (!img?.url) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, #0d1f22 0%, ${accent} 160%)` }}
      />
    );
  }
  return (
    <Image
      src={img.url}
      alt={alt}
      fill
      className={`object-cover transition-transform duration-[800ms] ease-in-out ${isActive ? 'scale-105' : 'scale-100'}`}
      sizes={sizes}
      priority={priority}
      quality={85}
      {...(img.lqip ? { placeholder: 'blur' as const, blurDataURL: img.lqip } : {})}
    />
  );
}

function ActivePanelContent({ panel, i }: { panel: Panel; i: number }) {
  const meta = SOLUTION_META[panel.vertical];
  return (
    <AnimatePresence mode="wait">
      <motion.div key={`content-${i}`}>
        <motion.div
          variants={barVariants}
          initial="hidden" animate="visible" exit="exit"
          className="h-0.5 mb-4 origin-left"
          style={{ width: 40, background: meta.accent }}
        />
        <motion.p
          custom={0.18} variants={revealVariants} initial="hidden" animate="visible" exit="exit"
          className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-2"
          style={{ color: meta.accent }}
        >
          {meta.label}
        </motion.p>
        <motion.h2
          custom={0.22} variants={revealVariants} initial="hidden" animate="visible" exit="exit"
          className="font-display font-extrabold text-white leading-[1.15] mb-3"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', maxWidth: 520 }}
        >
          {panel.title}
        </motion.h2>
        <motion.p
          custom={0.3} variants={revealVariants} initial="hidden" animate="visible" exit="exit"
          className="font-body text-base font-normal leading-[1.75] mb-5"
          style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 440 }}
        >
          {panel.description}
        </motion.p>
        <motion.div
          custom={0.38} variants={revealVariants} initial="hidden" animate="visible" exit="exit"
        >
          <Link
            href={panel.href}
            className="group inline-flex items-center gap-2 font-body font-semibold text-base transition-colors duration-150"
            style={{ color: meta.accent }}
            onClick={(e) => e.stopPropagation()}
          >
            Explore {meta.label}
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              <IconArrowRight size={14} />
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Desktop: horizontal accordion (hover + auto-advance) ────────────────────

function DesktopAccordion({ heroImages }: { heroImages: HeroImages }) {
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
            <PanelBackground
              img={heroImages[panel.vertical]}
              alt={panel.title}
              accent={meta.accent}
              isActive={isActive}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background: isActive
                  ? 'linear-gradient(180deg, rgba(13,31,34,0.1) 0%, rgba(13,31,34,0.82) 60%, rgba(13,31,34,0.95) 100%)'
                  : 'rgba(13,31,34,0.72)',
              }}
            />

            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p
                  className="font-body text-xs font-bold uppercase tracking-[0.14em] whitespace-nowrap"
                  style={{ color: 'rgba(255,255,255,0.45)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {meta.label}
                </p>
              </div>
            )}

            {/* Active content */}
            {isActive && (
              <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-8 md:pb-12">
                <ActivePanelContent panel={panel} i={i} />
              </div>
            )}

            {/* Progress bar */}
            {isActive && !reduced && (
              <div className="absolute bottom-0 inset-x-0 h-0.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  key={`bar-${progressKey}`}
                  className="h-full origin-left"
                  style={{ background: meta.accent, animation: `fillProgress ${INTERVAL}ms linear forwards` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Mobile: vertical accordion driven by scroll ──────────────────────────────

function MobileAccordion({ heroImages }: { heroImages: HeroImages }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const { top, height } = container.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -top / scrollable));
      setActiveIndex(Math.min(PANELS.length - 1, Math.floor(progress * PANELS.length)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPanel = useCallback((i: number) => {
    const container = containerRef.current;
    if (!container) return;
    const scrollable = container.offsetHeight - window.innerHeight;
    const target = container.offsetTop + (i / PANELS.length) * scrollable;
    window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  return (
    <div ref={containerRef} style={{ height: `${PANELS.length * 100}svh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex flex-col">
        {PANELS.map((panel, i) => {
          const meta = SOLUTION_META[panel.vertical];
          const isActive = i === activeIndex;

          return (
            <div
              key={panel.vertical}
              className="relative overflow-hidden transition-all duration-[600ms]"
              style={{
                flex: isActive ? 5 : 1,
                transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                borderBottom: i < PANELS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : undefined,
                cursor: isActive ? 'default' : 'pointer',
              }}
              onClick={() => !isActive && scrollToPanel(i)}
            >
              <PanelBackground
                img={heroImages[panel.vertical]}
                alt={panel.title}
                accent={meta.accent}
                isActive={isActive}
                sizes="100vw"
                priority={i === 0}
              />
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background: isActive
                    ? 'linear-gradient(180deg, rgba(13,31,34,0.15) 0%, rgba(13,31,34,0.72) 55%, rgba(13,31,34,0.95) 100%)'
                    : 'rgba(13,31,34,0.80)',
                }}
              />

              {/* Collapsed strip */}
              {!isActive && (
                <div className="absolute inset-0 flex items-center px-5 gap-3 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: meta.accent }} />
                  <p className="font-body text-xs font-bold uppercase tracking-[0.14em] truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {meta.label}
                  </p>
                </div>
              )}

              {/* Active content */}
              {isActive && (
                <div className="absolute inset-x-0 bottom-0 px-5 pb-8">
                  <ActivePanelContent panel={panel} i={i} />
                </div>
              )}
            </div>
          );
        })}

        {/* Scroll indicator dots */}
        <div className="absolute bottom-5 right-5 flex flex-col items-center gap-1.5 z-20">
          {PANELS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPanel(i)}
              aria-label={`Go to panel ${i + 1}`}
              className="rounded-full transition-all duration-300 flex-shrink-0"
              style={{
                width: 4,
                height: i === activeIndex ? 18 : 4,
                background: i === activeIndex ? '#ffffff' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Public export — responsive wrapper ──────────────────────────────────────

export function HeroAccordion({ heroImages }: { heroImages: HeroImages }) {
  return (
    <>
      <div className="hidden xl:block">
        <DesktopAccordion heroImages={heroImages} />
      </div>
      <div className="xl:hidden">
        <MobileAccordion heroImages={heroImages} />
      </div>
    </>
  );
}

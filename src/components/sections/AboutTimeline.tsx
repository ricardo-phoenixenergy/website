'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const MILESTONES = [
  { date: '2019', title: 'Founded by Erin, Ricardo & Russel with a vision to transform African energy' },
  { date: '2020', title: 'First C&I solar installation commissioned in Gauteng' },
  { date: '2021', title: 'BESS offering launched — first battery + solar hybrid project delivered' },
  { date: '2022', title: 'Wheeling vertical launched — first PPA agreement signed' },
  { date: '2023', title: 'Carbon credits programme launched — Gold Standard certification achieved' },
  { date: '2024', title: 'EV Fleets & Infrastructure vertical launched — Transnet Phase 1 commissioned' },
  { date: '2025', title: 'WeBuySolar platform launched — 42 systems acquired in first 6 months' },
  { date: '2030 ✦', title: 'Vision: Net Zero roadmap delivered for 1,000+ Southern African businesses' },
];

const ADVANCE_MS = 2800;

export function AboutTimeline() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (isPaused || reduced) return;
    intervalRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % MILESTONES.length;
        const el = itemRefs.current[next];
        if (el && scrollRef.current) {
          scrollRef.current.scrollTo({ left: el.offsetLeft - 20, behavior: 'smooth' });
        }
        return next;
      });
    }, ADVANCE_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, reduced]);

  const goTo = (i: number) => {
    setActive(i);
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const el = itemRefs.current[i];
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({ left: el.offsetLeft - 20, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white px-6 py-[52px] overflow-hidden">
      <div className="max-w-[960px] mx-auto">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          Roadmap
        </p>
        <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2] mb-8">
          Our story{' '}
          <em style={{ color: '#709DA9', fontStyle: 'normal' }}>so far</em>
        </h2>

        {/* Track + scroll container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-none"
          style={{ borderTop: '2px solid #E5E7EB' }}
        >
          {MILESTONES.map((m, i) => {
            const isActive = i === active;
            const isDone = i < active;
            return (
              <div
                key={i}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="flex-shrink-0 pt-5 pr-4 relative cursor-pointer"
                style={{ width: 200 }}
                onClick={() => goTo(i)}
              >
                {/* Line fill */}
                <div
                  className="absolute top-[-2px] left-0 h-0.5 transition-all duration-[400ms]"
                  style={{
                    width: isActive || isDone ? '100%' : '0%',
                    background: isDone ? '#709DA9' : '#39575C',
                  }}
                />

                {/* Dot */}
                <div
                  className="absolute top-[-7px] left-5 w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    background: isActive ? '#39575C' : isDone ? '#709DA9' : '#E5E7EB',
                    border: `2px solid ${isActive ? '#39575C' : isDone ? '#709DA9' : '#E5E7EB'}`,
                  }}
                />

                {/* Placeholder image / gradient box */}
                <div
                  className="w-full rounded-[10px] mb-3 transition-transform duration-[400ms]"
                  style={{
                    height: 90,
                    background: isActive
                      ? 'linear-gradient(135deg, #39575C, #0d1f22)'
                      : 'linear-gradient(135deg, #E5E7EB, #F5F5F5)',
                    transform: isActive ? 'scale(1)' : 'scale(0.97)',
                  }}
                />

                {/* Date */}
                <p
                  className="font-body font-bold text-xs mb-1.5 transition-colors duration-300"
                  style={{ color: isActive ? '#39575C' : '#709DA9' }}
                >
                  {m.date}
                </p>

                {/* Title */}
                <p
                  className="font-display font-bold text-sm leading-[1.4] transition-all duration-300"
                  style={{
                    color: '#1A1A1A',
                    opacity: isActive ? 1 : 0.6,
                    transform: isActive ? 'translateY(0)' : 'translateY(4px)',
                  }}
                >
                  {m.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mt-6">
          {MILESTONES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to milestone ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 24 : 8,
                height: 8,
                background: i === active ? '#39575C' : '#E5E7EB',
                borderRadius: i === active ? 4 : 9999,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

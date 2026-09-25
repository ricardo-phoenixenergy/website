'use client';

import { useRef, useState, useEffect, useCallback, useId } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { MilestoneTimeline } from '@/types/sanity';
import { IconArrowLeft, IconArrowRight } from '../ui/Icons';
import { IconButton } from '../ui/IconButton';
import { ProgressDots } from '@/components/ui/ProgressDots';

interface Props {
  milestones: MilestoneTimeline[];
}

export function AboutTimeline({ milestones }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isProgrammaticScroll = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();
  const headingId = useId();

  // Derived — not separate state
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < milestones.length - 1;

  const scrollToCard = useCallback(
    (i: number) => {
      const el = itemRefs.current[i];
      if (el && scrollRef.current) {
        if (timerRef.current !== null) clearTimeout(timerRef.current);
        isProgrammaticScroll.current = true;
        scrollRef.current.scrollTo({
          left: el.offsetLeft - 20,
          behavior: reduced ? 'instant' : 'smooth',
        });
        timerRef.current = setTimeout(() => {
          isProgrammaticScroll.current = false;
          timerRef.current = null;
        }, 600);
      }
    },
    [reduced]
  );

  const goTo = useCallback(
    (i: number) => {
      setActiveIndex(i);
      scrollToCard(i);
    },
    [scrollToCard]
  );

  // Keeps activeIndex in sync with finger-swipe on mobile.
  // Gated by isProgrammaticScroll so desktop button/dot clicks don't conflict.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || milestones.length === 0) return;

    const els = itemRefs.current.filter((el): el is HTMLDivElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const i = els.indexOf(entry.target as HTMLDivElement);
            if (i !== -1) setActiveIndex(i);
          }
        }
      },
      { root: container, threshold: 0.5 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [milestones]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  if (milestones.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="page-container">

        {/* Heading row — prev/next buttons visible on md+ only */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-3">
              Roadmap
            </p>
            <h2 id={headingId} className="font-display font-extrabold text-3xl text-pe-text leading-[1.2]">
              Our story{' '}
              <em className="not-italic text-pe-secondary-ink">so far</em>
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <IconButton
              variant="outline"
              label="Previous milestone"
              onClick={() => goTo(activeIndex - 1)}
              disabled={!canGoPrev}
            >
              <IconArrowLeft />
            </IconButton>
            <IconButton
              variant="outline"
              label="Next milestone"
              onClick={() => goTo(activeIndex + 1)}
              disabled={!canGoNext}
            >
              <IconArrowRight />
            </IconButton>
          </div>
        </div>

        {/* Scroll track
            Mobile: scroll-snap, 80vw cards, swipe-driven
            Desktop: overflow scroll, 200px cards, button/click-driven
            A named, focusable region, so keyboard users can scroll it with the arrow keys too. */}
        <div
          ref={scrollRef}
          role="region"
          aria-labelledby={headingId}
          tabIndex={0}
          className="flex overflow-x-auto scrollbar-none [scroll-snap-type:x_mandatory] md:[scroll-snap-type:none] [-webkit-overflow-scrolling:touch]"
          style={{ borderTop: '2px solid #E5E7EB' }}
        >
          {milestones.map((m, i) => {
            const isActive = i === activeIndex;
            const isDone = i < activeIndex;

            return (
              <div
                key={m._id}
                ref={(el) => { itemRefs.current[i] = el; }}
                onClick={() => goTo(i)}
                className="flex-shrink-0 w-[80vw] md:w-[200px] pt-5 pr-4 relative cursor-pointer [scroll-snap-align:start]"
              >
                {/* Top line — historical milestone: fills left-to-right as active/done */}
                {!m.isFuture && (
                  <div
                    className="absolute top-[-2px] left-0 h-0.5 transition-all duration-[400ms]"
                    style={{
                      width: isActive || isDone ? '100%' : '0%',
                      background: isDone ? '#709DA9' : '#39575C',
                    }}
                  />
                )}

                {/* Top line — future milestone: static dashed pattern */}
                {m.isFuture && (
                  <div
                    className="absolute top-[-2px] left-0 right-0 h-0.5"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(to right, #709DA9 0, #709DA9 6px, transparent 6px, transparent 12px)',
                      opacity: 0.5,
                    }}
                  />
                )}

                {/* Dot */}
                <div
                  className="absolute top-[-7px] left-5 w-3 h-3 rounded-full transition-all duration-300"
                  style={
                    m.isFuture
                      ? { background: 'white', border: '2px dashed #709DA9', opacity: 0.7 }
                      : isActive
                      ? {
                          background: '#39575C',
                          border: '2px solid #39575C',
                          boxShadow: '0 0 0 3px rgba(57,87,92,0.15)',
                        }
                      : isDone
                      ? { background: '#709DA9', border: '2px solid #709DA9' }
                      : { background: '#E5E7EB', border: '2px solid #E5E7EB' }
                  }
                />

                {/* Gradient box */}
                <div
                  className="w-full rounded-[10px] mb-3"
                  style={{
                    height: 80,
                    background: m.isFuture
                      ? 'linear-gradient(135deg, #1a3a3e 0%, #0d1f22 100%)'
                      : isActive
                      ? 'linear-gradient(135deg, #39575C 0%, #0d1f22 100%)'
                      : 'linear-gradient(135deg, #E5E7EB 0%, #F5F5F5 100%)',
                    transform: isActive ? 'scale(1)' : m.isFuture ? 'scale(0.96)' : 'scale(0.97)',
                    opacity: m.isFuture ? (isActive ? 0.7 : 0.45) : 1,
                    border: m.isFuture ? '1px dashed rgba(112,157,169,0.4)' : 'none',
                    transition: 'transform 400ms cubic-bezier(0.4,0,0.2,1), opacity 300ms ease',
                  }}
                />

                {/* Vision badge — future milestones only */}
                {m.isFuture && (
                  <p
                    className="font-body text-xs font-bold uppercase tracking-[0.1em] mb-1 inline-flex items-center gap-1 rounded-full px-[7px] py-[2px]"
                    style={{
                      color: 'var(--color-pe-secondary-ink)',
                      background: 'rgba(112,157,169,0.1)',
                      border: '1px solid rgba(112,157,169,0.25)',
                    }}
                  >
                    ✦ Vision
                  </p>
                )}

                {/* Date */}
                <p
                  className="font-body font-bold text-xs mb-1.5 transition-colors duration-300"
                  style={{
                    color: isActive && !m.isFuture ? 'var(--color-pe-primary)' : 'var(--color-pe-secondary-ink)',
                    fontStyle: m.isFuture ? 'italic' : 'normal',
                  }}
                >
                  {m.date}
                </p>

                {/* Title */}
                <p
                  className="font-display font-bold text-sm leading-[1.4] transition-all duration-300"
                  style={{
                    color: isActive ? 'var(--color-pe-text)' : 'var(--color-pe-muted)',
                    transform: isActive ? 'translateY(0)' : 'translateY(4px)',
                    fontStyle: m.isFuture ? 'italic' : 'normal',
                  }}
                >
                  {m.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Progress dots — clickable on both desktop and mobile */}
        <ProgressDots
          count={milestones.length}
          active={activeIndex}
          onSelect={goTo}
          labelFor={(i) => `Go to milestone ${i + 1}`}
          activeColor="#39575C"
          doneColor="#C5D5D7"
          dotSize={6}
          activeWidth={20}
          className="mt-6 -ml-1"
        />

      </div>
    </section>
  );
}

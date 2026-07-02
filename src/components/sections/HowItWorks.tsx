'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { IconArrowRight } from '@/components/ui/Icons';

interface Step {
  label: string;
  description: string;
  tag?: string;
}

interface HowItWorksProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: Step[];
  autoAdvanceInterval?: number;
  showCTA?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  accent?: string;       // solution accent — themes the whole step track (default teal/dusty-blue)
  accentText?: string;   // legible text colour on top of the solid accent (default white)
  /** When true, sits flush under a same-background section: no top padding. Default: false */
  flushTop?: boolean;
}

// Perceived luminance of a #rrggbb hex (0 = black … 1 = white).
function luminance(hex: string): number {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function HowItWorks({
  eyebrow = 'How it works',
  title,
  subtitle,
  steps,
  autoAdvanceInterval = 2600,
  showCTA = true,
  ctaLabel = 'Get a Free Assessment',
  ctaHref = '/contact',
  accent,
  accentText,
  flushTop = false,
}: HowItWorksProps) {
  // Section theme: when an accent is passed, the whole step track adopts it;
  // otherwise the default teal (primary) / dusty-blue (secondary) palette is used.
  const PRIMARY = accent ?? '#39575C';
  const SECONDARY = accent ?? '#709DA9';
  const NUM_TEXT = accentText ?? '#ffffff';   // number colour inside filled circles
  // Readable accent ink for small text on white (step labels, pills, dots): use the dark
  // companion (accentText) when it's genuinely dark; otherwise the accent itself is dark enough.
  const INK = accentText && luminance(accentText) < 0.6 ? accentText : (accent ?? '#39575C');
  const [activeStep, setActiveStep] = useState(0);
  const [sparkVisible, setSparkVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sparkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();

  const advance = useCallback(() => {
    setActiveStep((prev) => {
      const next = (prev + 1) % steps.length;
      if (!reduced && next !== prev) {
        setSparkVisible(true);
        if (sparkTimer.current) clearTimeout(sparkTimer.current);
        sparkTimer.current = setTimeout(() => setSparkVisible(false), 800);
      }
      return next;
    });
  }, [steps.length, reduced]);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(advance, autoAdvanceInterval);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [advance, autoAdvanceInterval, isPaused]);

  const goTo = (i: number) => {
    setActiveStep(i);
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const fillPct = steps.length > 1 ? (activeStep / (steps.length - 1)) * 100 : 0;
  const sparkLeft = fillPct;

  // Parse title for <em> tags (rendered in the accent / secondary colour)
  const renderTitle = (raw: string) => {
    const parts = raw.split(/(<em>.*?<\/em>)/g);
    return parts.map((part, i) => {
      const match = part.match(/^<em>(.*)<\/em>$/);
      if (match) {
        return <em key={i} style={{ color: SECONDARY, fontStyle: 'normal' }}>{match[1]}</em>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <section className={`bg-[#F5F5F5] pb-16 md:pb-24 ${flushTop ? '' : 'pt-16 md:pt-24'}`}>
      <div className="page-container">
      {/* Section header */}
      <AnimatedSection className="text-center mb-11">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          {eyebrow}
        </p>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#1A1A1A] leading-[1.15] mb-2">
          {renderTitle(title)}
        </h2>
        {subtitle && (
          <p
            className="font-body text-base font-normal leading-[1.75] max-w-[600px] mx-auto"
            style={{ color: '#6B7280' }}
          >
            {subtitle}
          </p>
        )}
      </AnimatedSection>

      {/* Desktop 3+ column grid — width scales with the step count (≈220px each),
          centred, and capped at the page-container width so it fills the section
          like sibling sections once there are enough steps (≈6). */}
      <div
        className="hidden md:block mx-auto"
        style={{
          '--step-count': steps.length,
          maxWidth: `min(100%, ${steps.length * 220}px)`,
        } as React.CSSProperties}
      >
        <div
          className="relative"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: '0 16px' }}
        >
          {/* Connector track */}
          <div
            className="absolute top-[27px] h-0.5 rounded-sm overflow-hidden bg-[#E5E7EB]"
            style={{
              left: `calc(${100 / steps.length / 2}% + 4px)`,
              right: `calc(${100 / steps.length / 2}% + 4px)`,
            }}
          >
            {/* Fill */}
            <div
              className="absolute inset-y-0 left-0 origin-left"
              style={{
                background: `linear-gradient(90deg, ${PRIMARY}, ${SECONDARY})`,
                width: `${fillPct}%`,
                transition: reduced ? 'none' : 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
            {/* Spark */}
            {!reduced && sparkVisible && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white"
                style={{
                  left: `${sparkLeft}%`,
                  boxShadow: `0 0 0 3px ${SECONDARY}, 0 0 12px 4px ${SECONDARY}99`,
                  transition: 'left 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            )}
          </div>

          {/* Steps */}
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isDone = i < activeStep;
            return (
              <div key={i} className="flex flex-col items-center text-center max-w-[260px] mx-auto">
                {/* Number circle */}
                <div className="relative mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-display font-extrabold text-lg select-none transition-all duration-[400ms]"
                    style={{
                      background: isActive ? PRIMARY : isDone ? SECONDARY : '#ffffff',
                      border: `2px solid ${isActive ? PRIMARY : isDone ? SECONDARY : '#E5E7EB'}`,
                      color: isActive || isDone ? NUM_TEXT : '#6B7280',
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {/* Pulse ring */}
                  {isActive && !reduced && (
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        border: `2px solid ${PRIMARY}40`,
                        animation: 'pulseRing 1.8s ease-out infinite',
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <p
                  className="font-display font-bold text-base leading-tight mb-1.5 transition-colors duration-300"
                  style={{ color: isActive ? INK : '#1A1A1A' }}
                >
                  {step.label}
                </p>
                <p
                  className="font-body text-sm font-normal leading-[1.75] mb-2"
                  style={{ color: '#6B7280' }}
                >
                  {step.description}
                </p>
                {step.tag && (
                  <span
                    className="inline-block font-body font-semibold text-xs px-2.5 py-1 rounded-full transition-all duration-300"
                    style={{
                      background: `${PRIMARY}14`,
                      color: INK,
                      opacity: isActive || isDone ? 1 : 0,
                      transform: isActive || isDone ? 'translateY(0)' : 'translateY(4px)',
                      transitionDelay: '0.2s',
                    }}
                  >
                    {step.tag}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 justify-center mt-8">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              aria-label={`Go to step ${i + 1}`}
              style={{
                width: i === activeStep ? 24 : 8,
                height: 8,
                background: i === activeStep ? INK : '#E5E7EB',
                borderRadius: i === activeStep ? 4 : 9999,
              }}
            />
          ))}
        </div>

        {showCTA && (
          <div className="text-center mt-7">
            <Button variant="primary" href={ctaHref}>
              {ctaLabel} <IconArrowRight size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile vertical spine */}
      <div className="md:hidden max-w-[480px] mx-auto">
        <div className="relative flex flex-col">
          {/* Spine track */}
          <div
            className="absolute w-0.5 bg-[#E5E7EB] rounded-sm overflow-hidden"
            style={{ left: 21, top: 22, bottom: 22 }}
          >
            <div
              className="absolute inset-x-0 top-0 origin-top"
              style={{
                background: `linear-gradient(180deg, ${PRIMARY}, ${SECONDARY})`,
                height: `${fillPct}%`,
                transition: reduced ? 'none' : 'height 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>

          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isDone = i < activeStep;
            return (
              <div key={i} className="relative z-10 flex gap-4 py-[18px] items-start">
                {/* Circle */}
                <div
                  className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center font-display font-extrabold text-base transition-all duration-[400ms]"
                  style={{
                    background: isActive ? PRIMARY : isDone ? SECONDARY : '#ffffff',
                    border: `2px solid ${isActive ? PRIMARY : isDone ? SECONDARY : '#E5E7EB'}`,
                    color: isActive || isDone ? NUM_TEXT : '#6B7280',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                {/* Text */}
                <div className="pt-1">
                  <p
                    className="font-display font-bold text-base leading-tight mb-1 transition-colors duration-300"
                    style={{ color: isActive ? INK : '#1A1A1A' }}
                  >
                    {step.label}
                  </p>
                  <p className="font-body text-sm font-normal leading-[1.75] text-[#6B7280] mb-1.5">
                    {step.description}
                  </p>
                  {step.tag && (
                    <span
                      className="inline-block font-body font-semibold text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: `${PRIMARY}14`,
                        color: INK,
                        opacity: isActive || isDone ? 1 : 0,
                        transition: 'opacity 0.3s ease 0.2s',
                      }}
                    >
                      {step.tag}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile progress dots */}
        <div className="flex items-center gap-2 justify-center mt-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              aria-label={`Go to step ${i + 1}`}
              style={{
                width: i === activeStep ? 24 : 8,
                height: 8,
                background: i === activeStep ? INK : '#E5E7EB',
                borderRadius: i === activeStep ? 4 : 9999,
              }}
            />
          ))}
        </div>

        {showCTA && (
          <div className="text-center mt-7">
            <Button variant="primary" href={ctaHref}>
              {ctaLabel} <IconArrowRight size={14} />
            </Button>
          </div>
        )}
      </div>
      </div>
    </section>
  );
}

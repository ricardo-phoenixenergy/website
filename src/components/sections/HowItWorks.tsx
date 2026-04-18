'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Step {
  label: string;
  description: string;
  tag?: string;
}

interface HowItWorksProps {
  eyebrow?: string;
  title: string;
  steps: Step[];
  autoAdvanceInterval?: number;
  showCTA?: boolean;
}

export function HowItWorks({
  eyebrow = 'How it works',
  title,
  steps,
  autoAdvanceInterval = 2600,
  showCTA = true,
}: HowItWorksProps) {
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

  // Parse title for <em> tags (rendered as Dusty Blue)
  const renderTitle = (raw: string) => {
    const parts = raw.split(/(<em>.*?<\/em>)/g);
    return parts.map((part, i) => {
      const match = part.match(/^<em>(.*)<\/em>$/);
      if (match) {
        return <em key={i} style={{ color: '#709DA9', fontStyle: 'normal' }}>{match[1]}</em>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <section className="bg-[#F5F5F5] px-6 py-12 md:py-[48px]">
      {/* Section header */}
      <AnimatedSection className="text-center mb-11">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          {eyebrow}
        </p>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#1A1A1A] leading-[1.15] mb-2">
          {renderTitle(title)}
        </h2>
        <p
          className="font-body text-base font-normal leading-[1.75] max-w-[440px] mx-auto"
          style={{ color: '#6B7280' }}
        >
          A simple, transparent process — from first conversation to ongoing savings.
        </p>
      </AnimatedSection>

      {/* Desktop 3+ column grid */}
      <div
        className="hidden md:block max-w-[760px] mx-auto"
        style={{ '--step-count': steps.length } as React.CSSProperties}
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
                background: 'linear-gradient(90deg, #39575C, #709DA9)',
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
                  boxShadow: '0 0 0 3px #709DA9, 0 0 12px 4px rgba(112,157,169,0.6)',
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
              <div key={i} className="flex flex-col items-center text-center">
                {/* Number circle */}
                <div className="relative mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-display font-extrabold text-lg select-none transition-all duration-[400ms]"
                    style={{
                      background: isActive ? '#39575C' : isDone ? '#709DA9' : '#ffffff',
                      border: `2px solid ${isActive ? '#39575C' : isDone ? '#709DA9' : '#E5E7EB'}`,
                      color: isActive || isDone ? '#ffffff' : '#6B7280',
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
                        border: '2px solid rgba(57,87,92,0.25)',
                        animation: 'pulseRing 1.8s ease-out infinite',
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <p
                  className="font-display font-bold text-base leading-tight mb-1.5 transition-colors duration-300"
                  style={{ color: isActive ? '#39575C' : '#1A1A1A' }}
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
                      background: 'rgba(57,87,92,0.08)',
                      color: '#39575C',
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
                background: i === activeStep ? '#39575C' : '#E5E7EB',
                borderRadius: i === activeStep ? 4 : 9999,
              }}
            />
          ))}
        </div>

        {showCTA && (
          <div className="text-center mt-7">
            <Button variant="primary" href="/contact">
              Get a Free Assessment →
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
                background: 'linear-gradient(180deg, #39575C, #709DA9)',
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
                    background: isActive ? '#39575C' : isDone ? '#709DA9' : '#ffffff',
                    border: `2px solid ${isActive ? '#39575C' : isDone ? '#709DA9' : '#E5E7EB'}`,
                    color: isActive || isDone ? '#ffffff' : '#6B7280',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                {/* Text */}
                <div className="pt-1">
                  <p
                    className="font-display font-bold text-base leading-tight mb-1 transition-colors duration-300"
                    style={{ color: isActive ? '#39575C' : '#1A1A1A' }}
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
                        background: 'rgba(57,87,92,0.08)',
                        color: '#39575C',
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
                background: i === activeStep ? '#39575C' : '#E5E7EB',
                borderRadius: i === activeStep ? 4 : 9999,
              }}
            />
          ))}
        </div>

        {showCTA && (
          <div className="text-center mt-7">
            <Button variant="primary" href="/contact">
              Get a Free Assessment →
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

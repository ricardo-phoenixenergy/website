// src/components/sections/PullQuote.tsx
import type { ReactNode } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export interface PullQuoteProps {
  children: ReactNode;
  accent?: string;
}

export function PullQuote({ children, accent = '#C97A40' }: PullQuoteProps) {
  return (
    <AnimatedSection className="max-w-3xl mt-12">
      <blockquote
        className="font-display font-extrabold text-xl md:text-2xl text-[#1A1A1A] leading-[1.4] pl-5"
        style={{ borderLeft: `3px solid ${accent}` }}
      >
        {children}
      </blockquote>
    </AnimatedSection>
  );
}

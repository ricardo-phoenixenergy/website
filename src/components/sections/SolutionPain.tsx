// src/components/sections/SolutionPain.tsx
import type { ReactNode } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export interface SolutionPainProps {
  id?: string;
  eyebrow: string;
  headline: string;   // HTML with <em> tags → rendered in accent colour
  body: string;
  pills: string[];
  accent?: string;    // for em colour; defaults to #709DA9
  children: ReactNode;
}

function renderHeadline(raw: string, accent: string) {
  const parts = raw.split(/(<em>.*?<\/em>)/g);
  return parts.map((part, i) => {
    const match = part.match(/^<em>(.*)<\/em>$/);
    if (match) {
      return (
        <em key={i} style={{ color: accent, fontStyle: 'normal' }}>
          {match[1]}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function SolutionPain({
  id,
  eyebrow,
  headline,
  body,
  pills,
  accent = '#709DA9',
  children,
}: SolutionPainProps) {
  return (
    <section
      id={id}
      className="px-5"
      style={{ background: '#0d1f22', padding: '52px 20px' }}
    >
      <div className="max-w-[960px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left: copy */}
        <AnimatedSection>
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {eyebrow}
          </p>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white leading-[1.2] mb-4">
            {renderHeadline(headline, accent)}
          </h2>
          <p className="font-body text-sm md:text-base leading-[1.75] mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {body}
          </p>
          {/* Pills — hidden on mobile */}
          {pills.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-2">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="font-body text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.70)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          )}
        </AnimatedSection>

        {/* Right: calculator slot */}
        <AnimatedSection delay={0.1}>
          {children}
        </AnimatedSection>
      </div>
    </section>
  );
}

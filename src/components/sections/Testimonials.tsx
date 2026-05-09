// src/components/sections/Testimonials.tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Card, CardBody } from '@/components/ui/Card';

export interface TestimonialQuote {
  text: string;
  author: string;
  role: string;
  company: string;
}

export interface TestimonialsProps {
  quotes: TestimonialQuote[];
  accent: string;
  id?: string;
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function Testimonials({ quotes, accent, id }: TestimonialsProps) {
  return (
    <section id={id} className="bg-[#F5F5F5] py-16 md:py-24">
      <div className="page-container">
        <AnimatedSection className="text-center mb-10 md:mb-12">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
            What clients say
          </p>
          <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
            Results that{' '}
            <em style={{ color: accent, fontStyle: 'normal' }}>speak for themselves</em>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((q, i) => (
            <AnimatedSection key={`${q.author}-${i}`} delay={i * 0.07}>
              <Card variant="light" pattern={3} className="h-full">
                <CardBody padding="lg" className="h-full">
                  {/* Quote mark */}
                  <p
                    className="font-display font-extrabold leading-none mb-3 select-none"
                    style={{ fontSize: 44, color: accent, lineHeight: 1 }}
                  >
                    &ldquo;
                  </p>
                  <p className="font-body text-sm leading-[1.75] text-[#374151] flex-1 mb-5">
                    {q.text}
                  </p>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: '#39575C' }}
                    >
                      <span className="font-display font-bold text-xs text-white">
                        {initials(q.author)}
                      </span>
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-[#1A1A1A] leading-none mb-0.5">
                        {q.author}
                      </p>
                      <p className="font-body text-xs text-[#6B7280]">
                        {q.role} · {q.company}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

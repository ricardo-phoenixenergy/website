'use client';

import { useState } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { IconArrowRight } from '@/components/ui/Icons';

export interface FaqItem {
  question: string;
  answer: string;   // plain text — also used verbatim in FAQPage JSON-LD
}

export interface FaqAccordionProps {
  eyebrow?: string;
  heading?: string;
  items: FaqItem[];
  accent?: string;
  id?: string;
}

export function FaqAccordion({
  eyebrow,
  heading,
  items,
  accent = '#C97A40',
  id,
}: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };

  return (
    <section id={id} className="bg-white py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="page-container max-w-3xl">
        {(eyebrow || heading) && (
          <AnimatedSection className="mb-8">
            {eyebrow && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: accent }}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2]">
                {heading}
              </h2>
            )}
          </AnimatedSection>
        )}

        <dl className="flex flex-col">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.question} className="border-t border-[#E5E7EB] last:border-b">
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-bold text-base md:text-lg text-[#1A1A1A]">
                      {it.question}
                    </span>
                    <span
                      className="flex-shrink-0 transition-transform duration-200"
                      style={{ color: accent, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    >
                      <IconArrowRight size={18} />
                    </span>
                  </button>
                </dt>
                {isOpen && (
                  <dd className="pb-5 -mt-1 font-body text-sm md:text-base text-[#374151] leading-[1.75] max-w-[640px]">
                    {it.answer}
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

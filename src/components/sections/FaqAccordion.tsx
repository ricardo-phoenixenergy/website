'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { IconArrowRight } from '@/components/ui/Icons';
import { JsonLd } from '@/components/layout/JsonLd';
import { inkFor } from '@/types/solutions';

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
  /** When true, sits flush under a same-background section: no top padding. Default: false */
  flushTop?: boolean;
}

export function FaqAccordion({
  eyebrow,
  heading,
  items,
  accent = '#C97A40',
  id,
  flushTop = false,
}: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

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
    <section id={id} className={`bg-white pb-16 md:pb-24 ${flushTop ? '' : 'pt-16 md:pt-24'}`}>
      <JsonLd data={faqJsonLd} />
      <div className="page-container max-w-3xl">
        {(eyebrow || heading) && (
          <AnimatedSection className="mb-8">
            {eyebrow && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: inkFor(accent) }}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-pe-text leading-[1.2]">
                {heading}
              </h2>
            )}
          </AnimatedSection>
        )}

        <dl className="flex flex-col">
          {items.map((it, i) => {
            const isOpen = open === i;
            const answerId = `${baseId}-a${i}`;
            return (
              <div key={it.question} className="border-t border-pe-border last:border-b">
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <span className="font-display font-bold text-base md:text-lg text-pe-text">
                      {it.question}
                    </span>
                    <span
                      className="flex-shrink-0 transition-transform duration-200"
                      style={{ color: inkFor(accent), transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    >
                      <IconArrowRight size={18} />
                    </span>
                  </button>
                </dt>
                <FaqAnswer id={answerId} index={i} open={isOpen} onReveal={setOpen}>
                  {it.answer}
                </FaqAnswer>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

/** An answer that stays in the page while collapsed: hidden="until-found" keeps
 *  it findable, and the browser's beforematch event opens it. */
function FaqAnswer({ id, index, open, onReveal, children }: { id: string; index: number; open: boolean; onReveal: (index: number) => void; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // React 19.2 server-renders a string hidden value as hidden="", so the
    // until-found state is set here, after hydration and after every toggle.
    if (!open) el.setAttribute('hidden', 'until-found');
    const reveal = () => onReveal(index);
    el.addEventListener('beforematch', reveal);
    return () => el.removeEventListener('beforematch', reveal);
  }, [open, index, onReveal]);
  // The dd carries no padding or margin: until-found keeps the element's box,
  // so spacing sits on the inner div and closed rows collapse to zero height.
  return (
    <dd ref={ref} id={id} hidden={open ? undefined : true}>
      <div className="pb-5 -mt-1 font-body text-sm md:text-base text-pe-text-soft leading-[1.75] max-w-[60ch]">
        {children}
      </div>
    </dd>
  );
}

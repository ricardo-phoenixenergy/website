// src/components/sections/MunicipalityCards.tsx
// "Your municipality, your numbers" on a location page: one card per electricity
// supplier, with how a business tariff is built, how solar is registered, what
// changed lately, and when and where the facts were checked.
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { inkFor } from '@/types/solutions';
import type { MunicipalityCard } from '@/types/locations';

export interface MunicipalityCardsProps {
  eyebrow: string;
  heading: string;
  subtitle?: string;
  cards: MunicipalityCard[];
  accent: string;
}

/** "2026-10-12" as "12 October 2026". */
function checkedOn(asOf: string): string {
  return new Date(`${asOf}T00:00:00Z`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function MunicipalityCards({ eyebrow, heading, subtitle, cards, accent }: MunicipalityCardsProps) {
  return (
    <section className="bg-pe-bg py-16 md:py-24">
      <div className="page-container">
        <AnimatedSection className="max-w-2xl mb-9">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: inkFor(accent) }}>
            {eyebrow}
          </p>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-pe-text leading-[1.2] mb-3">{heading}</h2>
          {subtitle && <p className="font-body text-sm md:text-base leading-[1.75] text-pe-muted max-w-[60ch]">{subtitle}</p>}
        </AnimatedSection>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card, i) => (
            <AnimatedSection key={card.name} delay={i * 0.05} as="div">
              <article className="h-full rounded-2xl bg-white p-6 md:p-7 border-t-[3px]" style={{ borderTopColor: accent }}>
                <h3 className="font-display font-bold text-lg text-pe-text">{card.name}</h3>
                <p className="font-body text-sm text-pe-muted mb-4">{card.servesWhere}</p>

                <p className="font-body text-sm leading-[1.7] text-pe-text mb-4">{card.tariff}</p>

                <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted mb-2">Registering solar</p>
                <ul className="font-body text-sm leading-[1.7] text-pe-text list-disc pl-5 space-y-1 mb-4">
                  {card.solar.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                {card.recent && (
                  <p className="font-body text-sm leading-[1.7] text-pe-text mb-4">
                    <span className="font-semibold">Recently: </span>
                    {card.recent}
                  </p>
                )}

                {card.readMore && (
                  <ArrowLink href={card.readMore.href} className="mb-4">
                    {card.readMore.label}
                  </ArrowLink>
                )}

                <p className="font-body text-xs text-pe-muted">
                  Checked {checkedOn(card.asOf)}. Source:{' '}
                  {card.sources.map((source, j) => (
                    <span key={source.url}>
                      {j > 0 && ', '}
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-pe-text">
                        {source.label}
                      </a>
                    </span>
                  ))}
                  .
                </p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';
// src/components/sections/SupplierAccordion.tsx
// "Your municipality, your numbers" on a location page: one row per electricity
// supplier. A closed row is useful on its own (who it supplies, one key fact);
// opened, it leads with what Phoenix handles, then the tariff, the steps to
// register solar, what changed, and the dated sources. Every panel stays in the
// page (hidden="until-found") so search engines read it and find-in-page opens
// it; a URL hash such as #city-power opens and scrolls to its row.
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { IconArrowRight } from '@/components/ui/Icons';
import { inkFor } from '@/types/solutions';
import type { MunicipalityCard, SupplierHelp } from '@/types/locations';

export interface SupplierAccordionProps {
  eyebrow: string;
  heading: string;
  subtitle: string;
  cards: MunicipalityCard[];
  help: SupplierHelp;
  /** Row ids open on load. */
  defaultOpen?: string[];
  accent: string;
}

/** "2026-10-12" as "12 October 2026". */
function checkedOn(asOf: string): string {
  return new Date(`${asOf}T00:00:00Z`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** The row a URL hash names, or null when it names none or is malformed. */
export function rowIdFromHash(hash: string, ids: ReadonlySet<string>): string | null {
  let id: string;
  try {
    id = decodeURIComponent(hash.replace(/^#/, ''));
  } catch {
    return null;
  }
  return ids.has(id) ? id : null;
}

export function SupplierAccordion({ eyebrow, heading, subtitle, cards, help, defaultOpen = [], accent }: SupplierAccordionProps) {
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set(defaultOpen));
  const baseId = useId();
  const toggle = useCallback((id: string, force?: boolean) => {
    setOpen((prev) => {
      const next = new Set(prev);
      const shouldOpen = force ?? !next.has(id);
      if (shouldOpen) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  // A hash naming a row opens it and brings it into view.
  useEffect(() => {
    const ids = new Set(cards.map((c) => c.id));
    const openFromHash = () => {
      const id = rowIdFromHash(window.location.hash, ids);
      if (!id) return;
      toggle(id, true);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [cards, toggle]);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="page-container grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <AnimatedSection>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: inkFor(accent) }}>
              {eyebrow}
            </p>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-pe-text leading-[1.2] mb-3">{heading}</h2>
            <p className="font-body text-sm md:text-base leading-[1.75] text-pe-muted max-w-[60ch] mb-6">{subtitle}</p>
            <div className="rounded-2xl bg-pe-bg p-5">
              <p className="font-body text-sm leading-[1.7] text-pe-text mb-3">{help.text}</p>
              <ArrowLink href={help.href}>{help.linkLabel}</ArrowLink>
            </div>
          </AnimatedSection>
        </div>

        <div className="flex flex-col gap-3">
          {cards.map((card) => (
            <SupplierRow
              key={card.id}
              card={card}
              isOpen={open.has(card.id)}
              onToggle={toggle}
              onReveal={toggle}
              buttonId={`${baseId}-${card.id}-button`}
              panelId={`${baseId}-${card.id}-panel`}
              accent={accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface SupplierRowProps {
  card: MunicipalityCard;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onReveal: (id: string, force?: boolean) => void;
  buttonId: string;
  panelId: string;
  accent: string;
}

function SupplierRow({ card, isOpen, onToggle, onReveal, buttonId, panelId, accent }: SupplierRowProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    // React 19.2 server-renders a string hidden value as hidden="", so the
    // until-found state is set here, after hydration and after every toggle.
    if (!isOpen) el.setAttribute('hidden', 'until-found');
    const reveal = () => onReveal(card.id, true);
    el.addEventListener('beforematch', reveal);
    return () => el.removeEventListener('beforematch', reveal);
  }, [isOpen, card.id, onReveal]);

  return (
    <article id={card.id} className="scroll-mt-28 rounded-2xl bg-white border border-pe-border border-l-[3px] overflow-hidden" style={{ borderLeftColor: accent }}>
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(card.id)}
          className="w-full flex items-start justify-between gap-4 p-5 md:p-6 text-left"
        >
          <span className="flex flex-col gap-1">
            <span className="font-display font-extrabold text-xl text-pe-text">{card.name}</span>
            <span className="font-body text-sm text-pe-muted">{card.servesWhere}</span>
            <span className="mt-2 inline-flex w-fit rounded-full px-3 py-1 font-body text-xs font-semibold text-pe-text" style={{ background: `${accent}26` }}>
              {card.keyFact}
            </span>
          </span>
          <span className="mt-1 flex-shrink-0 motion-safe:transition-transform duration-200" style={{ color: inkFor(accent), transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} aria-hidden="true">
            <IconArrowRight size={18} />
          </span>
        </button>
      </h3>
      {/* The region carries no padding or margin: until-found keeps its box, so
          spacing sits on the inner div and closed rows collapse to zero height. */}
      <div ref={panelRef} id={panelId} role="region" aria-labelledby={buttonId} hidden={isOpen ? undefined : true}>
        <div className="px-5 md:px-6 pb-6">
          <p className="font-body text-sm md:text-base font-semibold leading-[1.7] text-pe-text mb-4">{card.weHandle}</p>
          <p className="font-body text-sm leading-[1.7] text-pe-text-soft mb-4">{card.tariff}</p>
          <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted mb-2">Registering solar</p>
          <ol className="font-body text-sm leading-[1.7] text-pe-text-soft list-decimal pl-5 space-y-1 mb-4">
            {card.solar.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          {card.recent && (
            <p className="font-body text-sm leading-[1.7] text-pe-text-soft mb-4">
              <span className="font-semibold text-pe-text">Recently: </span>
              {card.recent}
            </p>
          )}
          {card.readMore && (
            <p className="mb-4">
              <ArrowLink href={card.readMore.href}>{card.readMore.label}</ArrowLink>
            </p>
          )}
          <p className="font-body text-xs leading-[2] text-pe-muted">
            Checked {checkedOn(card.asOf)}. Source:{' '}
            {card.sources.map((source, j) => (
              <span key={source.url}>
                {j > 0 && ', '}
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-block py-1 underline underline-offset-2 hover:text-pe-text">
                  {source.label}
                </a>
              </span>
            ))}
            .
          </p>
        </div>
      </div>
    </article>
  );
}

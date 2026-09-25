'use client';

import { useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IconArrowRight } from '@/components/ui/Icons';
import type { Cta } from '@/config/ctas';
import type { Partner } from '@/types/sanity';

type Tab = 'investors' | 'partners';

const TABS: { value: Tab; label: string }[] = [
  { value: 'investors', label: 'Investors & Financiers' },
  { value: 'partners', label: 'Partners' },
];

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: [0.25, 0.1, 0.25, 1] as const } },
};

interface Props {
  partners: Partner[];
  /** When false, shows all partners in one flat grid with centred heading. Default: true */
  showTabs?: boolean;
  /** Alignment of the logo card row. Default: 'start' */
  justify?: 'center' | 'start';
  /** When true, sits flush under a same-background section: no top border, no top padding. Default: false */
  flushTop?: boolean;
  /** Routes for the audiences this section lists (About: partners and investors), shown under the logos. */
  ctas?: readonly Cta[];
}

export function AboutTrust({ partners, showTabs = true, justify = 'start', flushTop = false, ctas = [] }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('investors');
  const items = showTabs ? partners.filter((p) => p.category === activeTab) : partners;
  const uid = useId();
  const headingId = `${uid}-heading`;
  const panelId = `${uid}-panel`;
  const tabId = (tab: Tab) => `${uid}-tab-${tab}`;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // WAI-ARIA tabs, as in SolutionTabs: arrows move and select, Home and End jump to the ends.
  function onTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = TABS.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setActiveTab(TABS[next].value);
    tabRefs.current[next]?.focus();
  }

  const renderCard = (partner: Partner) => {
    const logoSrc = partner.logo?.asset?.url ?? null;

    const sharedMotionProps = {
      variants: cardVariants,
      whileHover: {
        y: -4,
        borderColor: '#709DA970',
        boxShadow: `0 10px 28px rgba(57,87,92,0.1), 0 1px 4px rgba(0,0,0,0.05)`,
        transition: { type: 'spring' as const, stiffness: 420, damping: 28 },
      },
      className: 'flex flex-col rounded-xl overflow-hidden w-[calc(50%-6px)] sm:w-[280px]',
      style: {
        borderWidth: 1,
        borderStyle: 'solid' as const,
        borderColor: '#E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        background: 'white',
      },
    };

    const cardInner = (
      <>
        {/* Logo zone */}
        <div
          className="relative w-full flex items-center justify-center px-6 pt-6 pb-5"
          style={{ background: 'rgba(245,245,245,0.55)', minHeight: 140 }}
        >
          {logoSrc ? (
            <div className="relative w-full h-24">
              <Image
                src={logoSrc}
                alt={partner.logo?.alt ?? partner.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 200px"
              />
            </div>
          ) : (
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-extrabold text-sm"
              style={{ background: 'rgba(57,87,92,0.08)', color: '#39575C' }}
            >
              {initials(partner.name)}
            </div>
          )}
        </div>

      </>
    );

    if (partner.website) {
      return (
        <motion.a
          key={partner._id}
          {...sharedMotionProps}
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cardInner}
        </motion.a>
      );
    }

    return (
      <motion.div key={partner._id} {...sharedMotionProps}>
        {cardInner}
      </motion.div>
    );
  };

  // Logo grid: server-rendered visible (initial={false}); tab switches animate.
  const grid = (
    <AnimatePresence mode="wait" initial={false}>
      {items.length > 0 ? (
        <motion.div
          key={activeTab}
          variants={gridVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className={`flex flex-wrap gap-3 ${justify === 'center' ? 'justify-center' : 'justify-start'}`}
        >
          {items.map((partner) => renderCard(partner))}
        </motion.div>
      ) : (
        <motion.div
          key={`empty-${activeTab}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          className="rounded-2xl py-16 text-center"
          style={{ border: '1px dashed #E5E7EB' }}
        >
          <p className="font-display font-bold text-base text-pe-text mb-1.5">
            Coming soon
          </p>
          <p className="font-body text-sm text-pe-muted">
            Our {TABS.find((t) => t.value === activeTab)?.label.toLowerCase()} will be listed here shortly.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section
      className={`bg-white pb-16 md:pb-24 ${flushTop ? '' : 'pt-16 md:pt-24'}`}
      style={flushTop ? undefined : { borderTop: '1px solid #E5E7EB' }}
    >
      <div className="page-container">

        {/* Heading */}
        <div className={showTabs ? '' : 'text-center mb-10 md:mb-12'}>
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-3">
            Partners and financiers
          </p>
          <h2 id={headingId} className="font-display font-extrabold text-3xl text-pe-text leading-[1.2]">
            Who we <em className="not-italic text-pe-secondary-ink">work with</em>
          </h2>
        </div>

        {/* Tabs, only shown when showTabs is true. Their ring is drawn inset
            (role="tab" in globals.css), so the scrolling strip can't clip it. */}
        {showTabs ? (
          <>
            <div
              role="tablist"
              aria-labelledby={headingId}
              className="flex overflow-x-auto scrollbar-none mt-7 mb-8"
              style={{ borderBottom: '1px solid #E5E7EB' }}
            >
              {TABS.map((tab, i) => {
                const count = partners.filter((p) => p.category === tab.value).length;
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    ref={(el) => { tabRefs.current[i] = el; }}
                    type="button"
                    role="tab"
                    id={tabId(tab.value)}
                    aria-selected={isActive}
                    aria-controls={panelId}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveTab(tab.value)}
                    onKeyDown={(e) => onTabKeyDown(e, i)}
                    className="cursor-pointer flex-shrink-0 flex items-center gap-2 font-body font-semibold text-sm px-5 py-3 transition-colors duration-150 whitespace-nowrap"
                    style={{
                      color: isActive ? '#39575C' : 'var(--color-pe-muted)',
                      borderBottom: isActive ? '2px solid #39575C' : '2px solid transparent',
                      marginBottom: -1,
                    }}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className="font-body font-semibold text-xs rounded-full px-1.5 py-0.5 leading-none"
                        style={{
                          background: isActive ? 'rgba(57,87,92,0.1)' : '#F5F5F5',
                          color: isActive ? '#39575C' : 'var(--color-pe-muted)',
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div role="tabpanel" id={panelId} aria-labelledby={tabId(activeTab)} tabIndex={0} className="rounded-xl">
              {grid}
            </div>
          </>
        ) : (
          grid
        )}

        {/* The audiences above, each with its own way in */}
        {ctas.length > 0 && (
          <ul className="mt-10 pt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8" style={{ borderTop: '1px solid #E5E7EB' }}>
            {ctas.map((cta) => (
              <li key={cta.href}>
                <Link
                  href={cta.href}
                  className="group inline-flex items-center gap-1.5 font-body text-sm font-semibold text-pe-primary hover:text-pe-primary-hover transition-colors rounded"
                >
                  {cta.label}
                  <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                    <IconArrowRight size={14} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

      </div>
    </section>
  );
}

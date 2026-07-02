'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Partner } from '@/types/sanity';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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
}

export function AboutTrust({ partners, showTabs = true, justify = 'start', flushTop = false }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('investors');
  const reduced = useReducedMotion();

  const items = showTabs ? partners.filter((p) => p.category === activeTab) : partners;

  const renderCard = (partner: Partner) => {
    const logoSrc = partner.logo?.asset?.url ?? null;

    const sharedMotionProps = {
      variants: reduced ? undefined : cardVariants,
      whileHover: reduced ? undefined : {
        y: -4,
        borderColor: '#709DA970',
        boxShadow: `0 10px 28px rgba(57,87,92,0.1), 0 1px 4px rgba(0,0,0,0.05)`,
        transition: { type: 'spring' as const, stiffness: 420, damping: 28 },
      },
      className: 'flex flex-col rounded-xl overflow-hidden w-[calc(33.333%-8px)] sm:w-[280px]',
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

  return (
    <section
      className={`bg-white pb-16 md:pb-24 ${flushTop ? '' : 'pt-16 md:pt-24'}`}
      style={flushTop ? undefined : { borderTop: '1px solid #E5E7EB' }}
    >
      <div className="page-container">

        {/* Heading */}
        <div className={showTabs ? '' : 'text-center mb-10 md:mb-12'}>
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
            Trusted by the best
          </p>
          <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
            Who we <em style={{ color: '#709DA9', fontStyle: 'normal' }}>work with</em>
          </h2>
        </div>

        {/* Tab strip — only shown when showTabs is true */}
        {showTabs && (
          <div
            className="flex overflow-x-auto scrollbar-none mt-7 mb-8"
            style={{ borderBottom: '1px solid #E5E7EB' }}
          >
            {TABS.map((tab) => {
              const count = partners.filter((p) => p.category === tab.value).length;
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className="cursor-pointer flex-shrink-0 flex items-center gap-2 font-body font-semibold text-sm px-5 py-3 transition-colors duration-150 whitespace-nowrap"
                  style={{
                    color: isActive ? '#39575C' : '#6B7280',
                    borderBottom: isActive ? '2px solid #39575C' : '2px solid transparent',
                    marginBottom: -1,
                  }}
                >
                  {tab.label}
                  {count > 0 && (
                    <span
                      className="font-body font-semibold text-[10px] rounded-full px-1.5 py-0.5 leading-none"
                      style={{
                        background: isActive ? 'rgba(57,87,92,0.1)' : '#F5F5F5',
                        color: isActive ? '#39575C' : '#9CA3AF',
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Logo grid */}
        <AnimatePresence mode="wait">
          {items.length > 0 ? (
            <motion.div
              key={activeTab}
              variants={reduced ? undefined : gridVariants}
              initial={reduced ? false : 'hidden'}
              animate={reduced ? undefined : 'show'}
              exit={reduced ? undefined : 'exit'}
              className={`flex flex-wrap gap-3 ${justify === 'center' ? 'justify-center' : 'justify-start'}`}
            >
              {items.map((partner) => renderCard(partner))}
            </motion.div>
          ) : (
            <motion.div
              key={`empty-${activeTab}`}
              initial={reduced ? false : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
              className="rounded-2xl py-16 text-center"
              style={{ border: '1px dashed #E5E7EB' }}
            >
              <p className="font-display font-bold text-base text-[#1A1A1A] mb-1.5">
                Coming soon
              </p>
              <p className="font-body text-sm text-[#6B7280]">
                Our {TABS.find((t) => t.value === activeTab)?.label.toLowerCase()} will be listed here shortly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

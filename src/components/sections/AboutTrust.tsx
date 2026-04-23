'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Partner } from '@/types/sanity';

type Tab = 'investors' | 'partners' | 'media';

const TABS: { value: Tab; label: string }[] = [
  { value: 'investors', label: 'Investors & Financiers' },
  { value: 'partners', label: 'Partners' },
  { value: 'media', label: 'Media & Press' },
];

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

interface Props {
  partners: Partner[];
}

export function AboutTrust({ partners }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('investors');

  const items = partners.filter((p) => p.category === activeTab);

  return (
    <section className="bg-white py-[52px]" style={{ borderTop: '1px solid #E5E7EB' }}>
      <div className="page-container">

        {/* Heading */}
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          Trusted by the best
        </p>
        <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
          Our <em style={{ color: '#709DA9', fontStyle: 'normal' }}>network</em>
        </h2>

        {/* Tab strip */}
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
                className="flex-shrink-0 flex items-center gap-2 font-body font-semibold text-sm px-5 py-3 transition-colors duration-150 whitespace-nowrap"
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

        {/* Logo grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((partner) => {
              const logoSrc = partner.logo?.asset?.url ?? null;

              const card = (
                <div
                  className="group flex flex-col items-center justify-center gap-3 rounded-2xl p-6 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ border: '1px solid #E5E7EB', minHeight: 120 }}
                >
                  {/* Logo or initials fallback */}
                  <div className="relative w-full flex items-center justify-center" style={{ height: 52 }}>
                    {logoSrc ? (
                      <Image
                        src={logoSrc}
                        alt={partner.logo?.alt ?? partner.name}
                        fill
                        className="object-contain transition-opacity duration-200 group-hover:opacity-80"
                        sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 200px"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-extrabold text-base"
                        style={{ background: 'rgba(57,87,92,0.08)', color: '#39575C' }}
                      >
                        {initials(partner.name)}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <p className="font-body text-xs text-[#6B7280] text-center leading-tight">
                    {partner.name}
                  </p>
                </div>
              );

              return partner.website ? (
                <a
                  key={partner._id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {card}
                </a>
              ) : (
                <div key={partner._id}>{card}</div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div
            className="rounded-2xl py-16 text-center"
            style={{ border: '1px dashed #E5E7EB' }}
          >
            <p className="font-display font-bold text-base text-[#1A1A1A] mb-1.5">
              Coming soon
            </p>
            <p className="font-body text-sm text-[#6B7280]">
              Our {TABS.find((t) => t.value === activeTab)?.label.toLowerCase()} will be listed here shortly.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

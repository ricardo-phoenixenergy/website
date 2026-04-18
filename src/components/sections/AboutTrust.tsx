'use client';

import { useState } from 'react';

type Tab = 'investors' | 'partners' | 'media';

const INVESTORS = [
  { mark: 'SB', bg: '#1a3a6e', name: 'Standard Bank', role: 'Finance partner' },
  { mark: 'WEG', bg: '#003087', name: 'WEG', role: 'Equipment financier' },
  { mark: 'CP', bg: '#39575C', name: 'Captive Power', role: 'Strategic investor' },
  { mark: 'BE', bg: '#5a3a1a', name: 'Blue Echo', role: 'Technology partner' },
];

const PARTNERS = [
  { mark: 'SB', bg: '#1a3a6e', name: 'Standard Bank', role: 'Finance partner' },
  { mark: 'WEG', bg: '#003087', name: 'WEG', role: 'Equipment partner' },
  { mark: 'BE', bg: '#5a3a1a', name: 'Blue Echo', role: 'Technology partner' },
  { mark: 'CP', bg: '#39575C', name: 'Captive Power', role: 'Strategic partner' },
];

const MEDIA = [
  { mark: 'BD', bg: '#6B7280', name: 'Business Day', role: 'Press' },
  { mark: 'F24', bg: '#6B7280', name: 'Fin24', role: 'Press' },
  { mark: 'EN', bg: '#6B7280', name: 'Engineering News', role: 'Press' },
  { mark: 'DM', bg: '#6B7280', name: 'Daily Maverick', role: 'Press' },
  { mark: 'ESI', bg: '#6B7280', name: 'ESI Africa', role: 'Press' },
  { mark: 'EE', bg: '#6B7280', name: 'EE Publishers', role: 'Press' },
];

const TABS: { value: Tab; label: string }[] = [
  { value: 'investors', label: 'Investors & Financiers' },
  { value: 'partners', label: 'Partners' },
  { value: 'media', label: 'Media & Press' },
];

export function AboutTrust() {
  const [activeTab, setActiveTab] = useState<Tab>('investors');

  const items =
    activeTab === 'investors' ? INVESTORS : activeTab === 'partners' ? PARTNERS : MEDIA;

  return (
    <section
      className="bg-white px-6 py-[52px]"
      style={{ borderTop: '1px solid #E5E7EB' }}
    >
      <div className="max-w-[960px] mx-auto">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          Trusted by the best
        </p>
        <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
          Our <em style={{ color: '#709DA9', fontStyle: 'normal' }}>network</em>
        </h2>

        {/* Tab nav */}
        <div
          className="flex overflow-x-auto scrollbar-none mt-7 mb-7"
          style={{ borderBottom: '1px solid #E5E7EB', WebkitOverflowScrolling: 'touch' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="flex-shrink-0 font-body font-semibold text-sm px-5 py-2.5 transition-colors duration-150"
              style={{
                color: activeTab === tab.value ? '#39575C' : '#6B7280',
                borderBottom: activeTab === tab.value ? '2px solid #39575C' : '2px solid transparent',
                marginBottom: -1,
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Logo grid */}
        <div className="flex flex-wrap">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center gap-1 p-4 md:p-6 cursor-default transition-colors duration-150 hover:bg-[#F5F5F5]"
              style={{
                flex: '1 1 140px',
                minWidth: '50%',
                maxWidth: 200,
                borderRight: '1px solid #E5E7EB',
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-extrabold text-sm text-white"
                style={{ background: item.bg }}
              >
                {item.mark}
              </div>
              <p className="font-display font-bold text-sm text-[#1A1A1A] text-center">{item.name}</p>
              <p className="font-body text-xs text-[#6B7280] text-center">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

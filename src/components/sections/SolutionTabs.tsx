// src/components/sections/SolutionTabs.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { FinancingCards } from './FinancingCards';

export interface TabItem {
  label: string;
  icon: string;
  iconBg: string;
  title: string;
  body: string;
  bullets: string[];
  imageBg: string;
  imageEmoji: string;
  type?: 'financing';
}

export interface SolutionTabsProps {
  tabs: TabItem[];
  accent: string;
  id?: string;
}

export function SolutionTabs({ tabs, accent, id }: SolutionTabsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activeItem = tabs[activeTab];

  function renderPanelBody(tab: TabItem) {
    if (tab.type === 'financing') return <FinancingCards />;
    return (
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        <div className="flex-1">
          <h3 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-3">{tab.title}</h3>
          <p className="font-body text-sm text-[#374151] leading-[1.75] mb-4">{tab.body}</p>
          <ul className="space-y-2">
            {tab.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 font-body text-sm text-[#374151]">
                <span style={{ color: accent }} className="mt-0.5 flex-shrink-0 font-bold">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        {tab.imageBg && (
          <div
            className="w-full md:w-[220px] h-[160px] md:h-[180px] rounded-2xl flex items-center justify-center flex-shrink-0 text-5xl"
            style={{ background: tab.imageBg }}
          >
            {tab.imageEmoji}
          </div>
        )}
      </div>
    );
  }

  return (
    <section id={id} className="bg-white px-5 py-12 md:py-[52px]">
      <div className="max-w-[960px] mx-auto">
        {/* Desktop tabs */}
        {!isMobile && (
          <>
            <div className="flex gap-1 border-b border-[#E5E7EB] mb-8 overflow-x-auto">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className="flex items-center gap-2 px-4 py-3 font-body text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2 -mb-px"
                  style={{
                    borderBottomColor: i === activeTab ? accent : 'transparent',
                    color: i === activeTab ? '#1A1A1A' : '#6B7280',
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                    style={{ background: tab.iconBg }}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>
            {renderPanelBody(activeItem)}
          </>
        )}

        {/* Mobile accordion */}
        {isMobile && (
          <div className="space-y-2">
            {tabs.map((tab, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={tab.label} className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 text-left"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                        style={{ background: tab.iconBg }}
                      >
                        {tab.icon}
                      </span>
                      <span className="font-body text-sm font-semibold text-[#1A1A1A]">{tab.label}</span>
                    </span>
                    <span
                      className="text-[#6B7280] transition-transform duration-300 text-xs"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    ref={(el: HTMLDivElement | null) => { contentRefs.current[i] = el; }}
                    style={{
                      maxHeight: isOpen
                        ? (contentRefs.current[i]?.scrollHeight ?? 1000) + 'px'
                        : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 350ms ease-in-out',
                    }}
                  >
                    <div className="px-4 pb-5">{renderPanelBody(tab)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

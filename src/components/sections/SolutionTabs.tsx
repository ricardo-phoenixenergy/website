'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { dlPush } from '@/lib/analytics';
import { FinancingCards } from './FinancingCards';
import {
  IconArrowRight,
  IconSun, IconBattery, IconDollarSign, IconLeaf, IconGlobe,
  IconActivity, IconThermometer, IconBuilding, IconMonitor,
  IconZap, IconClipboardCheck,
} from '@/components/ui/Icons';

export type IconName =
  | 'Sun' | 'Battery' | 'DollarSign' | 'Leaf' | 'Globe'
  | 'Activity' | 'Thermometer' | 'Building' | 'Monitor'
  | 'Zap' | 'ClipboardCheck';

const ICON_MAP: Record<IconName, (size: number) => React.ReactNode> = {
  Sun:           (s) => <IconSun size={s} />,
  Battery:       (s) => <IconBattery size={s} />,
  DollarSign:    (s) => <IconDollarSign size={s} />,
  Leaf:          (s) => <IconLeaf size={s} />,
  Globe:         (s) => <IconGlobe size={s} />,
  Activity:      (s) => <IconActivity size={s} />,
  Thermometer:   (s) => <IconThermometer size={s} />,
  Building:      (s) => <IconBuilding size={s} />,
  Monitor:       (s) => <IconMonitor size={s} />,
  Zap:           (s) => <IconZap size={s} />,
  ClipboardCheck:(s) => <IconClipboardCheck size={s} />,
};

export interface TabItem {
  key?: string;        // stable anchor for deep-linking, e.g. 'strategy-demand-shaving'
  label: string;
  icon: IconName;
  iconBg: string;
  title: string;
  body: string;
  bullets: string[];
  imageBg: string;
  imageEmoji: string;
  type?: 'financing';
  cta?: { label: string; href: string }; // optional conversion button inside the panel
}

export interface SolutionTabsProps {
  tabs: TabItem[];
  accent: string;
  id?: string;
  vertical?: string;
}

export function SolutionTabs({ tabs, accent, id, vertical = '' }: SolutionTabsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Deep-link: when the URL hash matches a tab's key, open it and scroll into view.
  useEffect(() => {
    function applyHash() {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const idx = tabs.findIndex((t) => t.key === hash);
      if (idx === -1) return;
      setActiveTab(idx);
      setOpenIndex(idx);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      sectionRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [tabs]);

  const activeItem = tabs[activeTab];

  function renderPanelBody(tab: TabItem) {
    if (tab.type === 'financing') return <FinancingCards />;
    return (
      <div className="max-w-[640px]">
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
        {tab.cta && (
          <Link
            href={tab.cta.href}
            className="inline-flex items-center gap-2 mt-6 rounded-full px-6 py-3 font-display font-bold text-sm text-white transition-transform duration-200 hover:-translate-y-px"
            style={{ background: '#39575C' }}
          >
            {tab.cta.label}
            <IconArrowRight size={15} />
          </Link>
        )}
      </div>
    );
  }

  return (
    <section ref={sectionRef} id={id} className="bg-white py-12 md:py-[52px]">
      <div className="page-container">
        {/* Desktop tabs */}
        {!isMobile && (
          <>
            <div className="flex gap-1 border-b border-[#E5E7EB] mb-8">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => {
                    setActiveTab(i);
                    dlPush({ event: 'tab_change', vertical, tab_label: tab.label });
                  }}
                  className="flex items-center gap-2 px-4 py-3 font-body text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2 -mb-px"
                  style={{
                    borderBottomColor: i === activeTab ? accent : 'transparent',
                    color: i === activeTab ? '#1A1A1A' : '#6B7280',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: tab.iconBg, color: accent }}
                  >
                    {ICON_MAP[tab.icon](15)}
                  </div>
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
                    onClick={() => {
                      const next = openIndex === i ? -1 : i;
                      setOpenIndex(next);
                      if (next !== -1) {
                        dlPush({ event: 'tab_change', vertical, tab_label: tabs[i].label });
                      }
                    }}
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: tab.iconBg, color: accent }}
                      >
                        {ICON_MAP[tab.icon](16)}
                      </div>
                      <span className="font-body text-sm font-semibold text-[#1A1A1A]">{tab.label}</span>
                    </span>
                    <span
                      className="text-[#6B7280] transition-transform duration-300 flex-shrink-0"
                      style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    >
                      <IconArrowRight size={14} />
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

'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { dlPush } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { FinancingCards } from './FinancingCards';

// Charts are CI-only and pull in chart.js — load on the client, only when a tab has one.
const StrategyProfileChart = dynamic(
  () => import('./StrategyProfileChart').then((m) => m.StrategyProfileChart),
  { ssr: false, loading: () => <div className="h-[296px] rounded-xl bg-[#F5F5F5] animate-pulse" /> },
);
import {
  IconArrowRight,
  IconSun, IconBattery, IconDollarSign, IconLeaf, IconGlobe,
  IconActivity, IconThermometer, IconBuilding, IconMonitor,
  IconZap, IconClipboardCheck, IconSliders,
} from '@/components/ui/Icons';

export type IconName =
  | 'Sun' | 'Battery' | 'DollarSign' | 'Leaf' | 'Globe'
  | 'Activity' | 'Thermometer' | 'Building' | 'Monitor'
  | 'Zap' | 'ClipboardCheck' | 'Sliders';

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
  Sliders:       (s) => <IconSliders size={s} />,
};

export interface TabItem {
  key?: string;        // stable anchor for deep-linking, e.g. 'strategy-demand-shaving'
  label: string;
  icon: IconName;
  iconBg: string;
  title: string;
  body: string;
  bullets: string[];
  bulletsLabel?: string;                  // optional kicker above the bullets, e.g. 'Best suited for'
  benefits?: string[];                    // optional second bullet group (e.g. 'Benefits')
  benefitsLabel?: string;                 // kicker above the second group
  imageBg: string;
  imageEmoji: string;
  type?: 'financing';
  cta?: { label: string; href: string }; // optional conversion button inside the panel
  chartKey?: string;                      // optional strategy daily-profile chart
}

export interface SolutionTabsProps {
  tabs: TabItem[];
  accent: string;
  id?: string;
  vertical?: string;
  eyebrow?: string;    // small uppercase kicker above the heading
  heading?: string;    // section headline — supports <em> for accent colour
  subtitle?: string;   // optional supporting line beneath the heading
}

/* Splits a heading string on <em>…</em> and renders those parts in the accent colour. */
function renderHeading(raw: string, accent: string) {
  return raw.split(/(<em>.*?<\/em>)/g).map((part, i) => {
    const match = part.match(/^<em>(.*)<\/em>$/);
    return match
      ? <em key={i} style={{ color: accent, fontStyle: 'normal' }}>{match[1]}</em>
      : <span key={i}>{part}</span>;
  });
}

export function SolutionTabs({
  tabs, accent, id, vertical = '', eyebrow, heading, subtitle,
}: SolutionTabsProps) {
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
    const textBlock = (
      <div>
        <h3 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-3">{tab.title}</h3>
        <p className="font-body text-sm text-[#374151] leading-[1.75] mb-4">{tab.body}</p>
        {tab.bulletsLabel && (
          <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-2.5">
            {tab.bulletsLabel}
          </p>
        )}
        <ul className="space-y-2">
          {tab.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 font-body text-sm text-[#374151]">
              <span style={{ color: accent }} className="mt-0.5 flex-shrink-0 font-bold">✓</span>
              {b}
            </li>
          ))}
        </ul>
        {tab.benefits && tab.benefits.length > 0 && (
          <div className="mt-4">
            {tab.benefitsLabel && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-2.5">
                {tab.benefitsLabel}
              </p>
            )}
            <ul className="space-y-2">
              {tab.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 font-body text-sm text-[#374151]">
                  <span style={{ color: accent }} className="mt-0.5 flex-shrink-0 font-bold">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}
        {tab.cta && (
          <Button variant="primary" href={tab.cta.href} className="mt-6">
            {tab.cta.label}
          </Button>
        )}
      </div>
    );

    // With a chart: side-by-side on large screens (text left, chart right), stacked on mobile.
    if (tab.chartKey) {
      return (
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {textBlock}
          <StrategyProfileChart strategyKey={tab.chartKey} />
        </div>
      );
    }

    return <div className="max-w-[640px]">{textBlock}</div>;
  }

  return (
    <section ref={sectionRef} id={id} className="bg-white py-12 md:py-[52px]">
      <div className="page-container">
        {/* Section header — matches How It Works / Financing pattern */}
        {heading && (
          <div className="max-w-2xl mb-8 md:mb-10">
            {eyebrow && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280] mb-2">
                {eyebrow}
              </p>
            )}
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2]">
              {renderHeading(heading, accent)}
            </h2>
            {subtitle && (
              <p className="font-body text-sm md:text-base text-[#6B7280] leading-[1.7] mt-3">
                {subtitle}
              </p>
            )}
          </div>
        )}

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

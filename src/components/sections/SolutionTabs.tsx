'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { MountWhenVisible } from '@/components/ui/MountWhenVisible';
import dynamic from 'next/dynamic';
import { dlPush } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { FinancingCards } from './FinancingCards';

// Charts are CI-only and pull in chart.js — load on the client, only when a tab has one.
const CHART_PLACEHOLDER = <div className="h-[296px] rounded-xl bg-pe-bg" />;
const StrategyProfileChart = dynamic(
  () => import('./StrategyProfileChart').then((m) => m.StrategyProfileChart),
  { ssr: false, loading: () => CHART_PLACEHOLDER },
);
import {
  IconArrowRight, IconCheck,
  IconSun, IconBattery, IconDollarSign, IconLeaf, IconGlobe,
  IconActivity, IconThermometer, IconBuilding, IconMonitor,
  IconZap, IconClipboardCheck, IconSliders,
  IconTruck, IconLayers, IconUsers, IconTrendingUp,
} from '@/components/ui/Icons';
import { inkFor } from '@/types/solutions';

export type IconName =
  | 'Sun' | 'Battery' | 'DollarSign' | 'Leaf' | 'Globe'
  | 'Activity' | 'Thermometer' | 'Building' | 'Monitor'
  | 'Zap' | 'ClipboardCheck' | 'Sliders'
  | 'Truck' | 'Layers' | 'Users' | 'TrendingUp';

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
  Truck:         (s) => <IconTruck size={s} />,
  Layers:        (s) => <IconLayers size={s} />,
  Users:         (s) => <IconUsers size={s} />,
  TrendingUp:    (s) => <IconTrendingUp size={s} />,
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
  diagram?: React.ReactNode;              // optional visual rendered right of the panel text (two-column on lg)
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
      ? <em key={i} style={{ color: inkFor(accent), fontStyle: 'normal' }}>{match[1]}</em>
      : <span key={i}>{part}</span>;
  });
}

export function SolutionTabs({
  tabs, accent, id, vertical = '', eyebrow, heading, subtitle,
}: SolutionTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const headingId = `${uid}-heading`;
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = (i: number) => `${uid}-panel-${i}`;
  const accordionButtonId = (i: number) => `${uid}-acc-${i}`;
  const accordionPanelId = (i: number) => `${uid}-acc-panel-${i}`;

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

  function selectTab(i: number, moveFocus = false) {
    setActiveTab(i);
    dlPush({ event: 'tab_change', vertical, tab_label: tabs[i].label });
    const tab = tabRefs.current[i];
    if (moveFocus) tab?.focus();
    // Every strip fits from 1280px, but a larger default text size can still
    // push the last tab out of view: bring the selected one in.
    tab?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  // WAI-ARIA tabs: arrows move and select, Home and End jump to the ends.
  function onTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    selectTab(next, true);
  }

  // `chartsEnabled` is false for closed accordion panels, so their charts (and
  // chart.js) load only when opened.
  function renderPanelBody(tab: TabItem, chartsEnabled: boolean) {
    if (tab.type === 'financing') return <FinancingCards />;
    const textBlock = (
      <div>
        <h3 className="font-display font-extrabold text-xl text-pe-text mb-3">{tab.title}</h3>
        <p className="font-body text-base text-pe-text-soft leading-[1.75] mb-4">{tab.body}</p>
        {tab.bulletsLabel && (
          <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted mb-2.5">
            {tab.bulletsLabel}
          </p>
        )}
        <ul className="space-y-2">
          {tab.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 font-body text-sm text-pe-text-soft">
              <span aria-hidden="true" style={{ color: accent }} className="mt-[3px] flex-shrink-0">
                <IconCheck size={14} />
              </span>
              {b}
            </li>
          ))}
        </ul>
        {tab.benefits && tab.benefits.length > 0 && (
          <div className="mt-4">
            {tab.benefitsLabel && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted mb-2.5">
                {tab.benefitsLabel}
              </p>
            )}
            <ul className="space-y-2">
              {tab.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 font-body text-sm text-pe-text-soft">
                  <span aria-hidden="true" style={{ color: accent }} className="mt-[3px] flex-shrink-0">
                    <IconCheck size={14} />
                  </span>
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
          {chartsEnabled && (
            <MountWhenVisible placeholder={CHART_PLACEHOLDER}>
              <StrategyProfileChart strategyKey={tab.chartKey} />
            </MountWhenVisible>
          )}
        </div>
      );
    }

    // With a diagram (e.g. wheeling flow): text left, diagram right, top-aligned (panels have long lists).
    if (tab.diagram) {
      return (
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {textBlock}
          {tab.diagram}
        </div>
      );
    }

    return <div className="max-w-[640px]">{textBlock}</div>;
  }

  return (
    <section ref={sectionRef} id={id} className="bg-white py-16 md:py-24">
      <div className="page-container">
        {/* Section header — matches How It Works / Financing pattern */}
        {heading && (
          <div className="max-w-2xl mb-8 md:mb-10">
            {eyebrow && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-pe-muted mb-2">
                {eyebrow}
              </p>
            )}
            <h2 id={headingId} className="font-display font-extrabold text-2xl md:text-3xl text-pe-text leading-[1.2]">
              {renderHeading(heading, accent)}
            </h2>
            {subtitle && (
              <p className="font-body text-sm md:text-base text-pe-muted leading-[1.7] mt-3 max-w-[60ch]">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Both layouts render on the server; CSS picks one, so the page never
            depends on a JS width check. Tabs from 1280px: at 1024px the C&I,
            Energy Optimisation and EV strips need 993 to 1,085px in a 960px row
            and their last tab was cut off. The strip scrolls rather than
            widening the page. */}
        <div className="hidden xl:block">
          <div
            role="tablist"
            aria-labelledby={heading ? headingId : undefined}
            aria-label={heading ? undefined : 'Options'}
            className="flex gap-1 mb-8 overflow-x-auto overscroll-x-contain [scrollbar-width:thin] shadow-[inset_0_-1px_0_var(--color-pe-border)]"
          >
            {tabs.map((tab, i) => {
              const selected = i === activeTab;
              return (
                <button
                  key={tab.label}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  type="button"
                  role="tab"
                  id={tabId(i)}
                  aria-selected={selected}
                  aria-controls={selected ? panelId(i) : undefined}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectTab(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className="flex flex-shrink-0 items-center gap-2 px-4 py-3 font-body text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2 rounded-t-lg"
                  style={{
                    borderBottomColor: selected ? accent : 'transparent',
                    color: selected ? 'var(--color-pe-text)' : 'var(--color-pe-muted)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: tab.iconBg, color: accent }}
                  >
                    {ICON_MAP[tab.icon](15)}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div
            role="tabpanel"
            id={panelId(activeTab)}
            aria-labelledby={tabId(activeTab)}
            tabIndex={0}
            className="rounded-xl"
          >
            {renderPanelBody(activeItem, true)}
          </div>
        </div>

        {/* Accordion below 1280px */}
        <div className="xl:hidden space-y-2">
          {tabs.map((tab, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={tab.label} className="border border-pe-border rounded-xl overflow-hidden">
                <button
                  type="button"
                  id={accordionButtonId(i)}
                  aria-controls={accordionPanelId(i)}
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
                    <span
                      aria-hidden="true"
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: tab.iconBg, color: accent }}
                    >
                      {ICON_MAP[tab.icon](16)}
                    </span>
                    <span className="font-body text-sm font-semibold text-pe-text">{tab.label}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-pe-muted transition-transform duration-300 flex-shrink-0"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  >
                    <IconArrowRight size={14} />
                  </span>
                </button>
                {/* Closed panels are inert so their links can't take focus while hidden. */}
                <div
                  id={accordionPanelId(i)}
                  inert={!isOpen}
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 350ms ease-in-out',
                  }}
                >
                  <div style={{ overflow: 'hidden', minHeight: 0 }}>
                    <div className="px-4 pb-5">{renderPanelBody(tab, isOpen)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// src/components/sections/ExplainerCards.tsx
import type { ReactNode } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import {
  IconSun, IconBattery, IconDollarSign, IconLeaf, IconGlobe,
  IconActivity, IconThermometer, IconBuilding, IconMonitor, IconZap,
  IconClipboardCheck, IconTrendingUp, IconUsers, IconLayers, IconClock,
  IconTrendingDown, IconHourglass, IconSliders, IconUserTie, IconAward,
} from '@/components/ui/Icons';

export type ExplainerIcon =
  | 'Sun' | 'Battery' | 'DollarSign' | 'Leaf' | 'Globe' | 'Activity'
  | 'Thermometer' | 'Building' | 'Monitor' | 'Zap' | 'ClipboardCheck'
  | 'TrendingUp' | 'Users' | 'Layers' | 'Clock'
  | 'TrendingDown' | 'Hourglass' | 'Sliders' | 'UserTie' | 'Award';

const ICONS: Record<ExplainerIcon, (s: number) => ReactNode> = {
  Sun: (s) => <IconSun size={s} />,
  Battery: (s) => <IconBattery size={s} />,
  DollarSign: (s) => <IconDollarSign size={s} />,
  Leaf: (s) => <IconLeaf size={s} />,
  Globe: (s) => <IconGlobe size={s} />,
  Activity: (s) => <IconActivity size={s} />,
  Thermometer: (s) => <IconThermometer size={s} />,
  Building: (s) => <IconBuilding size={s} />,
  Monitor: (s) => <IconMonitor size={s} />,
  Zap: (s) => <IconZap size={s} />,
  ClipboardCheck: (s) => <IconClipboardCheck size={s} />,
  TrendingUp: (s) => <IconTrendingUp size={s} />,
  Users: (s) => <IconUsers size={s} />,
  Layers: (s) => <IconLayers size={s} />,
  Clock: (s) => <IconClock size={s} />,
  TrendingDown: (s) => <IconTrendingDown size={s} />,
  Hourglass: (s) => <IconHourglass size={s} />,
  Sliders: (s) => <IconSliders size={s} />,
  UserTie: (s) => <IconUserTie size={s} />,
  Award: (s) => <IconAward size={s} />,
};

export interface ExplainerCardItem {
  icon: ExplainerIcon;
  title: string;
  body: string;
}

export interface ExplainerCardsProps {
  eyebrow?: string;
  heading?: string;   // supports <em> for accent
  subtitle?: string;
  cards: ExplainerCardItem[];
  columns?: 3 | 4;
  accent?: string;
  background?: 'gray' | 'white';
  /** Optional rich content rendered between the header and the card grid (e.g. a diagram). */
  lead?: ReactNode;
  /** Optional content rendered after the card grid (e.g. a pull-quote). */
  footer?: ReactNode;
  id?: string;
}

function renderHeading(raw: string, accent: string) {
  return raw.split(/(<em>.*?<\/em>)/g).map((part, i) => {
    const m = part.match(/^<em>(.*)<\/em>$/);
    return m
      ? <em key={i} style={{ color: accent, fontStyle: 'normal' }}>{m[1]}</em>
      : <span key={i}>{part}</span>;
  });
}

export function ExplainerCards({
  eyebrow,
  heading,
  subtitle,
  cards,
  columns = 3,
  accent = '#C97A40',
  background = 'gray',
  lead,
  footer,
  id,
}: ExplainerCardsProps) {
  return (
    <section
      id={id}
      className={`${background === 'white' ? 'bg-white' : 'bg-[#F5F5F5]'} py-16 md:py-24`}
    >
      <div className="page-container">
        {(eyebrow || heading || subtitle) && (
          <AnimatedSection className="max-w-2xl mb-9">
            {eyebrow && (
              <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: accent }}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2] mb-3">
                {renderHeading(heading, accent)}
              </h2>
            )}
            {subtitle && (
              <p className="font-body text-sm md:text-base leading-[1.75] text-[#6B7280]">
                {subtitle}
              </p>
            )}
          </AnimatedSection>
        )}

        {lead}

        <div className={`grid gap-4 ${columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
          {cards.map((c, i) => (
            <AnimatedSection key={c.title} delay={i * 0.08}>
              <Card variant="light" pattern={3} className="h-full">
                <div className="h-[3px]" style={{ background: accent }} />
                <CardBody padding="lg">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${accent}1F`, color: accent }}
                  >
                    {ICONS[c.icon](20)}
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-[#1A1A1A] mb-2 leading-tight">
                    {c.title}
                  </h3>
                  <p className="font-body text-sm text-[#374151] leading-[1.7]">
                    {c.body}
                  </p>
                </CardBody>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        {footer}
      </div>
    </section>
  );
}

// src/components/sections/FinancingCards.tsx
import { Card, CardBody } from '@/components/ui/Card';
import { IconCheck, IconClipboardCheck, IconDollarSign, IconBuilding } from '@/components/ui/Icons';

export type FinancingIconName = 'agreement' | 'purchase' | 'lease';

const FINANCING_ICONS: Record<FinancingIconName, (size: number) => React.ReactNode> = {
  agreement: (s) => <IconClipboardCheck size={s} />,
  purchase:  (s) => <IconDollarSign size={s} />,
  lease:     (s) => <IconBuilding size={s} />,
};

export interface FinancingOption {
  icon: FinancingIconName;
  title: string;
  description: string;
  benefits: string[];
  tag?: string; // optional accent pill, e.g. a contract term like '10–20 year term'
}

interface FinancingCardsProps {
  /**
   * When provided, renders rich option cards (icon, description, benefits).
   * When omitted, renders the legacy CapEx vs OpEx comparison used on the
   * financing tab of other solution verticals.
   */
  options?: FinancingOption[];
}

export function FinancingCards({ options }: FinancingCardsProps = {}) {
  if (options && options.length > 0) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {options.map((opt) => (
          <Card key={opt.title} variant="light" pattern={2} className="flex-1">
            {/* 3px dusty-blue accent bar */}
            <div className="h-[3px]" style={{ background: '#709DA9' }} />
            <CardBody padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(112,157,169,0.12)', color: '#39575C' }}
                >
                  {FINANCING_ICONS[opt.icon](20)}
                </div>
                {opt.tag && (
                  <span
                    className="font-body text-[0.7rem] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(57,87,92,0.10)', color: '#39575C' }}
                  >
                    {opt.tag}
                  </span>
                )}
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-2 leading-tight">
                {opt.title}
              </h3>
              <p className="font-body text-sm text-[#374151] leading-[1.7] mb-5">
                {opt.description}
              </p>
              <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-2.5">
                Benefits
              </p>
              <ul className="space-y-2.5">
                {opt.benefits.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 font-body text-sm font-semibold text-[#1A1A1A]"
                  >
                    <span className="mt-0.5 flex-shrink-0" style={{ color: '#39575C' }}>
                      <IconCheck size={16} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  // Legacy CapEx vs OpEx comparison — financing tab on other verticals
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* CapEx — light card */}
      <Card variant="light" pattern={2} className="flex-1">
        {/* 3px dusty-blue accent bar */}
        <div className="h-[3px]" style={{ background: '#709DA9' }} />
        <CardBody padding="lg">
          <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280] mb-1">
            CapEx
          </p>
          <h3 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-3">
            Purchase outright
          </h3>
          <ul className="space-y-2">
            {[
              'Full asset ownership from day one.',
              'Section 12B tax depreciation (125%).',
              'Highest long-term ROI.',
              'No monthly payment obligations.',
              'Balance-sheet asset.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 font-body text-sm text-[#374151]">
                <span className="mt-0.5 text-[#39575C] flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {/* OpEx — dark card */}
      <Card variant="dark" pattern={2} className="flex-1">
        {/* 3px dusty-blue accent bar */}
        <div className="h-[3px]" style={{ background: '#709DA9' }} />
        <CardBody padding="lg">
          <p
            className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-1"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            OpEx
          </p>
          <h3 className="font-display font-extrabold text-xl text-white mb-3">PPA or lease</h3>
          <ul className="space-y-2">
            {[
              'R0 capital — no upfront cost.',
              'Fixed tariff below grid rate.',
              'Operations & maintenance included.',
              'Off-balance-sheet financing.',
              '10–25 year agreement, purchase option.',
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 font-body text-sm"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                <span className="mt-0.5 text-[#709DA9] flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}

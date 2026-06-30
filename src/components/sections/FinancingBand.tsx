import { FinancingCards, type FinancingOption } from './FinancingCards';
import { SOLUTION_META } from '@/types/solutions';

const CI_META = SOLUTION_META['ci-solar-storage'];

const CI_FINANCING: FinancingOption[] = [
  {
    icon: 'purchase',
    title: 'Outright Purchase',
    description:
      'Own the system from day one for the strongest lifetime returns. You capture every rand of savings, claim the full Section 12B tax allowance, and typically reach payback in 3–5 years.',
    benefits: ['Maximum savings & ROI.', 'Full ownership from day one.', 'Section 12B tax benefit.'],
  },
  {
    icon: 'lease',
    title: 'Power Lease Agreement (PLA)',
    tag: '5–10 year term',
    description:
      'Spread the cost over fixed monthly payments while you start saving from month one. At the end of the term the system is yours — ownership without the upfront outlay.',
    benefits: ['Predictable monthly payments.', 'Off-balance-sheet financing.', 'Ownership at end of term.', 'Immediate net savings.', 'Maintenance & monitoring included.'],
  },
  {
    icon: 'agreement',
    title: 'Power Purchase Agreement (PPA)',
    tag: '10–20 year term',
    description:
      'We design, fund, install and maintain the system on your roof at zero upfront cost. You simply buy the clean power it generates — at a tariff below your current grid rate.',
    benefits: ['No upfront capital.', 'Off-balance-sheet financing.', 'Immediate net savings.', 'Maintenance & monitoring included.'],
  },
];

interface FinancingBandProps {
  eyebrow?: string;
  heading?: string;
  options?: FinancingOption[];
  accent?: string;
  accentText?: string;
}

export function FinancingBand({
  eyebrow = 'How to fund it',
  heading = 'Three ways to fund it — pick what suits your balance sheet',
  options = CI_FINANCING,
  accent = CI_META.accent,
  accentText = CI_META.accentText,
}: FinancingBandProps = {}) {
  return (
    <section className="bg-[#F5F5F5] py-12 md:py-[52px]">
      <div className="page-container">
        <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280] mb-2">
          {eyebrow}
        </p>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] mb-6 max-w-xl">
          {heading}
        </h2>
        <FinancingCards options={options} accent={accent} accentText={accentText} />
      </div>
    </section>
  );
}

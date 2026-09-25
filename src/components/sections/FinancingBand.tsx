import { FinancingCards, type FinancingOption } from './FinancingCards';
import { SOLUTION_META, inkFor } from '@/types/solutions';

const CI_META = SOLUTION_META['ci-solar-storage'];

const CI_FINANCING: FinancingOption[] = [
  {
    icon: 'purchase',
    title: 'Outright Purchase',
    description:
      'Own the system from day one for the strongest lifetime returns. You capture every rand of savings, claim the full Section 12B tax allowance, and typically reach payback in 3 to 5 years.',
    benefits: ['Maximum savings & ROI.', 'Full ownership from day one.', 'Section 12B tax benefit.'],
  },
  {
    icon: 'lease',
    title: 'Power Lease Agreement (PLA)',
    tag: '5 to 10 years',
    description:
      'Spread the cost over fixed monthly payments while you start saving from month one. At the end of the term the system is yours, and you never paid for it up front.',
    benefits: ['Predictable monthly payments.', 'Off-balance-sheet financing.', 'Ownership at end of term.', 'Immediate net savings.', 'Maintenance & monitoring included.'],
  },
  {
    icon: 'agreement',
    title: 'Power Purchase Agreement (PPA)',
    tag: '10 to 20 years',
    description:
      'We design, fund, install and maintain the system on your roof at zero upfront cost. You simply buy the clean power it generates at a tariff below your current grid rate.',
    benefits: ['No upfront capital.', 'Off-balance-sheet financing.', 'Immediate net savings.', 'Maintenance & monitoring included.'],
  },
];

interface FinancingBandProps {
  eyebrow?: string;
  heading?: string;
  options?: FinancingOption[];
  accent?: string;
  accentText?: string;
  /** When true, sits flush under a same-background section: no top padding. Default: false */
  flushTop?: boolean;
}

/* Splits a heading on <em>…</em> and renders those parts in the accent colour. */
function renderHeading(raw: string, accent: string) {
  return raw.split(/(<em>.*?<\/em>)/g).map((part, i) => {
    const m = part.match(/^<em>(.*)<\/em>$/);
    return m
      ? <em key={i} style={{ color: inkFor(accent), fontStyle: 'normal' }}>{m[1]}</em>
      : <span key={i}>{part}</span>;
  });
}

export function FinancingBand({
  eyebrow = 'How to fund it',
  heading = 'Three ways to fund it to suit your balance sheet',
  options = CI_FINANCING,
  accent = CI_META.accent,
  accentText = CI_META.accentText,
  flushTop = false,
}: FinancingBandProps = {}) {
  return (
    <section className={`bg-pe-bg pb-16 md:pb-24 ${flushTop ? '' : 'pt-16 md:pt-24'}`}>
      <div className="page-container">
        <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-pe-muted mb-2">
          {eyebrow}
        </p>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-pe-text mb-6 max-w-xl">
          {renderHeading(heading, accent)}
        </h2>
        <FinancingCards options={options} accent={accent} accentText={accentText} />
      </div>
    </section>
  );
}

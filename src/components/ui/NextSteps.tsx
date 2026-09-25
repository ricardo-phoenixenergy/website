export interface NextStep {
  key: string;
  /** Optional bold lead-in, e.g. a process step's name. */
  label?: string | null;
  text: string;
}

interface NextStepsProps {
  steps: readonly NextStep[];
  heading?: string;
  /** Keeps the page outline in order: h2 in a side column, h4 inside a form. */
  headingAs?: 'h2' | 'h3' | 'h4';
  /** `panel`: a tinted box inside a form. `card`: a white card in a side column. */
  variant?: 'panel' | 'card';
  className?: string;
}

const STYLES = {
  panel: {
    box: 'rounded-xl p-5',
    boxStyle: { background: 'rgba(57,87,92,0.06)', border: '1px solid rgba(57,87,92,0.15)' },
    heading: 'font-display font-bold text-sm text-pe-primary mb-3',
    text: 'font-body text-xs text-pe-muted leading-[1.65]',
  },
  card: {
    box: 'rounded-2xl p-6 bg-white',
    boxStyle: { border: '1px solid var(--color-pe-border)' },
    heading: 'font-display font-bold text-base text-pe-text mb-4',
    text: 'font-body text-sm text-pe-muted leading-relaxed',
  },
} as const;

/**
 * "What happens next": the steps after a form is sent, in order. The numbers
 * are drawn for sighted readers; the ordered list gives them to screen readers.
 */
export function NextSteps({
  steps,
  heading = 'What happens next',
  headingAs: Heading = 'h4',
  variant = 'panel',
  className = '',
}: NextStepsProps) {
  const s = STYLES[variant];
  return (
    <div className={`${s.box} text-left ${className}`} style={s.boxStyle}>
      <Heading className={s.heading}>{heading}</Heading>
      <ol className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step.key} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'var(--color-pe-primary)' }}
            >
              <span className="font-display font-bold text-xs text-white">{i + 1}</span>
            </span>
            <p className={s.text}>
              {step.label && <span className="font-semibold text-pe-text">{step.label}. </span>}
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

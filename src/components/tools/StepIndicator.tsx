'use client';

interface StepIndicatorProps {
  current: 1 | 2 | 3;
}

const STEPS: { n: 1 | 2 | 3; label: string }[] = [
  { n: 1, label: 'System details' },
  { n: 2, label: 'Condition' },
  { n: 3, label: 'Your details' },
];

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <ol aria-label="Progress" className="flex items-start justify-center mb-8">
      {STEPS.map((step, i) => {
        const isDone = current > step.n;
        const isActive = current === step.n;
        return (
          <li key={step.n} className="flex items-start" aria-current={isActive ? 'step' : undefined}>
            <div className="flex flex-col items-center">
              <div
                aria-hidden="true"
                className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                style={{
                  background: isActive ? 'var(--color-pe-primary)' : isDone ? 'var(--color-pe-bg)' : 'white',
                  color: isActive ? 'white' : 'var(--color-pe-muted)',
                  border: isActive ? 'none' : '0.5px solid var(--color-pe-border)',
                }}
              >
                {step.n}
              </div>
              <span
                className="font-body text-xs mt-1.5 whitespace-nowrap text-center"
                style={{
                  color: isActive ? 'var(--color-pe-text)' : 'var(--color-pe-muted)',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                <span className="sr-only">Step {step.n}: </span>
                {step.label}
                {isDone && <span className="sr-only"> (done)</span>}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                aria-hidden="true"
                className="w-6 sm:w-12 h-px mt-4 mx-1 flex-shrink-0"
                style={{ background: 'var(--color-pe-border)' }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

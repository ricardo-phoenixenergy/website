'use client';

interface StepIndicatorProps {
  current: 1 | 2 | 3;
}

const STEPS: { n: 1 | 2 | 3; label: string }[] = [
  { n: 1, label: 'System details' },
  { n: 2, label: 'Condition' },
  { n: 3, label: 'Your valuation' },
];

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-center mb-8">
      {STEPS.map((step, i) => {
        const isDone = current > step.n;
        const isActive = current === step.n;
        return (
          <div key={step.n} className="flex items-start">
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                style={{
                  background: isActive ? '#39575C' : isDone ? '#F5F5F5' : 'white',
                  color: isActive ? 'white' : '#6B7280',
                  border: isActive ? 'none' : '0.5px solid #E5E7EB',
                }}
              >
                {step.n}
              </div>
              <span
                className="font-body text-[10px] mt-1.5 whitespace-nowrap text-center"
                style={{
                  color: isActive ? '#1A1A1A' : '#9CA3AF',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-12 h-px mt-4 mx-1 flex-shrink-0"
                style={{ background: '#E5E7EB' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

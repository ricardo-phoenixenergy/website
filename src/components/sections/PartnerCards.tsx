import { AnimatedSection } from '@/components/ui/AnimatedSection';

const PARTNERS = [
  {
    initials: 'SB',
    bg: '#1a3a6e',
    name: 'Standard Bank',
    role: 'Finance partner',
  },
  {
    initials: 'WEG',
    bg: '#003087',
    name: 'WEG',
    role: 'Equipment partner',
  },
] as const;

export function PartnerCards() {
  return (
    <section
      className="bg-white px-5 py-8"
      style={{ borderBottom: '1px solid #E5E7EB' }}
    >
      <AnimatedSection>
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] text-center mb-4">
          Our energy partners
        </p>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-200 cursor-default bg-[#F5F5F5] border border-[#E5E7EB] hover:bg-white hover:border-[#709DA9]"
              style={{
                flex: '1 1 160px',
                maxWidth: '200px',
                minWidth: '160px',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-extrabold text-sm text-white flex-shrink-0"
                style={{ background: p.bg }}
              >
                {p.initials}
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-[#1A1A1A] leading-tight">
                  {p.name}
                </span>
                <span className="font-body text-xs font-normal text-[#6B7280] mt-px">
                  {p.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}

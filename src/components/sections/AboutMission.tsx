import { AnimatedSection } from '@/components/ui/AnimatedSection';

export function AboutMission() {
  return (
    <section className="bg-[#0d1f22] px-6 py-[52px]">
      <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-center max-w-[960px] mx-auto">
        {/* Left */}
        <AnimatedSection delay={0}>
          <p
            className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            What drives us
          </p>
          <h2
            className="font-display font-extrabold text-3xl text-white leading-[1.2]"
          >
            Mission &{'\n'}
            <em style={{ color: '#709DA9', fontStyle: 'normal' }}>vision</em>
          </h2>
        </AnimatedSection>

        {/* Right — 2-col split */}
        <AnimatedSection delay={0.08}>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                title: 'Our mission',
                text: 'Deliver bespoke solutions that propel businesses toward Net Zero Carbon Emissions, optimise efficiency, and unlock new revenue streams. Clean energy. Thriving enterprises. A prosperous, resilient Africa.',
              },
              {
                title: 'Our vision',
                text: 'An Africa where renewable energy fuels unstoppable growth and lasting sustainability — where every business has access to a fullstack clean energy solution.',
              },
            ].map((col) => (
              <div
                key={col.title}
                className="pl-4"
                style={{ borderLeft: '2px solid rgba(255,255,255,0.08)' }}
              >
                <p className="font-display font-bold text-base text-white mb-1.5">
                  {col.title}
                </p>
                <p
                  className="font-body text-sm font-normal leading-[1.75]"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {col.text}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

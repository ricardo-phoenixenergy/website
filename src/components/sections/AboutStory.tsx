import { AnimatedSection } from '@/components/ui/AnimatedSection';

export function AboutStory() {
  return (
    <section className="bg-white px-6 py-[52px]">
      <div className="grid gap-11 md:grid-cols-2 md:items-start max-w-[960px] mx-auto">
        {/* Left — image with badge */}
        <AnimatedSection delay={0}>
          <div className="relative rounded-2xl overflow-hidden" style={{ height: 230 }}>
            {/* Placeholder gradient until real photo */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #1a3a3e 0%, #0d1f22 100%)' }}
            />
            {/* Floating badge */}
            <div
              className="absolute bottom-4 left-4 rounded-[10px] px-3.5 py-2.5"
              style={{ background: '#39575C', border: '3px solid #fff' }}
            >
              <p className="font-display font-extrabold text-base text-white leading-none">Pan-Africa</p>
              <p
                className="font-body text-xs font-normal uppercase mt-1"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Our vision
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Right — copy */}
        <AnimatedSection delay={0.08}>
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
            Our story
          </p>
          <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2] mb-4">
            Built to make clean energy{' '}
            <em style={{ color: '#709DA9', fontStyle: 'normal' }}>accessible</em>{' '}
            across Africa
          </h2>
          <p className="font-body text-sm leading-[1.8] text-[#6B7280] mb-3">
            Phoenix Energy was created to make renewable energy both accessible and transformative across Africa. We set ourselves apart by providing bespoke, turnkey solutions that go beyond conventional energy savings.
          </p>

          {/* Pull quote */}
          <blockquote
            className="my-3.5 rounded-r-lg px-4 py-3"
            style={{
              borderLeft: '3px solid #709DA9',
              background: 'rgba(112,157,169,0.07)',
            }}
          >
            <p className="font-display font-bold text-base text-[#1A1A1A] leading-[1.5] italic">
              "For us, it's not just about saving — it's about empowering businesses to earn, grow, and thrive sustainably."
            </p>
            <p className="font-body text-xs text-[#6B7280] mt-1.5">
              — Phoenix Energy founding vision
            </p>
          </blockquote>

          <p className="font-body text-sm leading-[1.8] text-[#6B7280]">
            Our approach gives businesses a comprehensive roadmap designed to drive Net Zero Carbon Emissions, enhance efficiency, and unlock new revenue streams across Southern Africa and beyond.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

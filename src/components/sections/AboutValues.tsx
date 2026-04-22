import { AnimatedSection } from '@/components/ui/AnimatedSection';

const VALUES = [
  {
    num: '01',
    title: 'Empathy',
    text: "We put people first, understanding our clients' unique needs to create meaningful, impactful solutions.",
  },
  {
    num: '02',
    title: 'Pioneering',
    text: 'We break new ground with advanced renewable solutions, setting new standards for sustainable growth in business.',
  },
  {
    num: '03',
    title: 'Trust',
    text: 'We build lasting partnerships rooted in integrity, transparency, and unwavering reliability.',
  },
  {
    num: '04',
    title: 'Conscience',
    text: 'Everything we do is driven by our commitment to creating positive change for the planet and future generations.',
  },
  {
    num: '05',
    title: 'Inspiration',
    text: 'We inspire businesses by creating new opportunities to deliver efficient, sustainable services — empowering them to inspire their own customers.',
  },
  {
    num: '06',
    title: 'Ubuntu',
    text: 'We are rooted in the African belief that we grow stronger together — alongside our clients, our communities, and our continent.',
  },
];

export function AboutValues() {
  return (
    <section className="bg-[#F5F5F5] py-[52px]">
      <AnimatedSection className="page-container text-center mb-8">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          What we stand for
        </p>
        <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
          Our <em style={{ color: '#709DA9', fontStyle: 'normal' }}>values</em>
        </h2>
      </AnimatedSection>

      <div className="page-container grid gap-3 grid-cols-1 md:grid-cols-3">
        {VALUES.map((v, i) => (
          <AnimatedSection key={v.num} delay={i * 0.04} as="div">
            <div
              className="rounded-2xl p-[22px] h-full cursor-default transition-all duration-200 hover:-translate-y-[3px]"
              style={{ background: '#0d1f22' }}
            >
              <p
                className="font-display font-extrabold text-4xl leading-none mb-3"
                style={{ color: 'rgba(255,255,255,0.08)' }}
              >
                {v.num}
              </p>
              <p className="font-display font-bold text-base text-white mb-2">{v.title}</p>
              <p
                className="font-body text-sm leading-[1.75]"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {v.text}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

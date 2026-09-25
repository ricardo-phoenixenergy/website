// src/components/sections/AboutValues.tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Card, CardBody } from '@/components/ui/Card';

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
    text: 'We inspire businesses by creating new opportunities to deliver efficient, sustainable services that help them inspire their own customers.',
  },
  {
    num: '06',
    title: 'Ubuntu',
    text: 'We are rooted in the African belief that we grow stronger together with our clients, our communities and our continent.',
  },
];

export function AboutValues() {
  return (
    <section className="bg-pe-bg py-16 md:py-24">
      <AnimatedSection className="page-container text-center mb-10 md:mb-12">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-3">
          What we stand for
        </p>
        <h2 className="font-display font-extrabold text-3xl text-pe-text leading-[1.2]">
          Our <em className="not-italic text-pe-secondary-ink">values</em>
        </h2>
      </AnimatedSection>

      <div className="page-container grid gap-3 grid-cols-1 md:grid-cols-3">
        {VALUES.map((v, i) => (
          <AnimatedSection key={v.num} delay={i * 0.04} as="div">
            <Card variant="dark" pattern={3} className="h-full">
              <CardBody padding="lg" className="h-full">
                <h3 className="font-display font-bold text-lg text-white mb-2">{v.title}</h3>
                <p className="font-body text-sm leading-[1.75]" style={{ color: 'var(--color-on-dark-subtle)' }}>
                  {v.text}
                </p>
              </CardBody>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

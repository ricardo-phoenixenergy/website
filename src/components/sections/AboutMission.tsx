import { AnimatedSection } from '@/components/ui/AnimatedSection';

export function AboutMission() {
  return (
    <section className="bg-pe-nav-dark py-16 md:py-24">
      <div className="page-container">
        <AnimatedSection delay={0} className="text-center max-w-3xl mx-auto">
          <p
            className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3"
            style={{ color: 'var(--color-on-dark-subtle)' }}
          >
            What drives us
          </p>
          <h2 className="font-display font-extrabold text-3xl text-white leading-[1.2]">
            Our <em className="not-italic text-pe-secondary">mission</em>
          </h2>

          {/* Decorative opening quotation mark */}
          <span
            aria-hidden
            className="font-display block leading-none mt-8 mb-1 select-none"
            style={{ color: '#709DA9', fontSize: 72 }}
          >
            &ldquo;
          </span>

          <blockquote className="font-display font-bold italic text-lg md:text-2xl text-white leading-[1.5]">
            To become the long-term energy partner for South African businesses, one that
            takes over, optimises and manages their energy strategy so they never have to
            think about it again.
          </blockquote>
        </AnimatedSection>
      </div>
    </section>
  );
}

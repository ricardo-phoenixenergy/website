import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export interface CTAStat { value: string; label: string; }

const DEFAULT_STATS: CTAStat[] = [
  { value: '120+', label: 'Projects completed' },
  { value: '48 MW', label: 'Deployed' },
  { value: '12k t', label: 'CO₂ saved / yr' },
  { value: 'R380M', label: 'Client savings' },
];

interface CTABannerProps {
  eyebrow?: string;
  heading?: string;
  body?: string;
  primaryCta?: { label: string; href: string; };
  stats?: CTAStat[];
}

export function CTABanner({
  eyebrow    = 'Start today',
  heading    = "Ignite what's possible for your business",
  body       = "Get a free energy assessment from Phoenix Energy's certified engineers — no commitment, no cost, results delivered in 48 hours.",
  primaryCta = { label: 'Get a Free Quote', href: '/contact' },
  stats      = DEFAULT_STATS,
}: CTABannerProps = {}) {
  return (
    <section
      className="py-12 md:py-[48px]"
      style={{ background: 'linear-gradient(135deg, #39575C 0%, #0d1f22 100%)' }}
    >
      <div className="page-container grid gap-10 md:grid-cols-2 md:items-center">

        {/* Left — copy */}
        <AnimatedSection delay={0}>
          <p
            className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            {eyebrow}
          </p>
          <h2 className="font-display font-extrabold text-3xl text-white leading-[1.2] mb-4">
            {heading}
          </h2>
          <p
            className="font-body text-sm leading-[1.75] mb-6"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            {body}
          </p>
          <Button variant="light" href={primaryCta.href}>
            {primaryCta.label}
          </Button>
        </AnimatedSection>

        {/* Right — stats grid */}
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-2 gap-2.5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-3.5 flex flex-col gap-1"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span className="font-display font-extrabold text-2xl text-white leading-none">
                  {stat.value}
                </span>
                <span
                  className="font-body text-xs font-normal uppercase tracking-[0.08em]"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}

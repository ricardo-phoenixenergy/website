// src/components/sections/PartnerBand.tsx
// A partner as proof on a location page: who stands behind the equipment for
// the life of the system. Dark band between the municipal facts and funding.
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import type { PartnerBandContent } from '@/config/wegPartner';
import type { PartnerLogo } from '@/lib/partnerData';

export interface PartnerBandProps {
  content: PartnerBandContent;
  logo: PartnerLogo | null;
}

export function PartnerBand({ content, logo }: PartnerBandProps) {
  return (
    <section className="focus-on-dark bg-gradient-to-br from-pe-band-from to-pe-nav-dark text-white py-16 md:py-24">
      <div className="page-container grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
        <AnimatedSection>
          {logo && (
            <div className="inline-flex rounded-2xl bg-white p-3 mb-6">
              <Image
                src={logo.url}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-12 w-12 object-contain"
                {...(logo.blur ? { placeholder: 'blur' as const, blurDataURL: logo.blur } : {})}
              />
            </div>
          )}
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'var(--color-on-dark-subtle)' }}>
            {content.eyebrow}
          </p>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl leading-[1.2] mb-4">{content.heading}</h2>
          <p className="font-body text-sm md:text-base leading-[1.75] mb-6" style={{ color: 'rgba(255,255,255,0.78)' }}>{content.lead}</p>
          <dl className="grid grid-cols-2 gap-4 mb-2">
            {content.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.78)' }}>{s.label}</dt>
                <dd className="font-display font-extrabold text-3xl md:text-4xl">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="font-body text-xs mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>{content.statsSource}</p>
          <a href={content.link.href} target="_blank" rel="noopener noreferrer" className="inline-block py-1 font-body text-sm font-semibold underline underline-offset-4 hover:no-underline">
            {content.link.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </AnimatedSection>

        <div className="grid gap-4">
          {content.points.map((p, i) => (
            <AnimatedSection key={p.title} as="div" delay={i * 0.06}>
              <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <h3 className="font-display font-bold text-lg mb-2">{p.title}</h3>
                <p className="font-body text-sm leading-[1.75]" style={{ color: 'rgba(255,255,255,0.78)' }}>{p.body}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

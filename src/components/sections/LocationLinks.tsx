// src/components/sections/LocationLinks.tsx
// "Where we install" on the C&I solution page: a link to each location page.
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ArrowLink } from '@/components/ui/ArrowLink';

export interface LocationLinksProps {
  heading: string;
  links: { label: string; href: string; line: string }[];
  accent: string;
}

export function LocationLinks({ heading, links, accent }: LocationLinksProps) {
  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="page-container">
        <AnimatedSection>
          <h2 className="font-display font-extrabold text-xl md:text-2xl text-pe-text leading-[1.2] mb-5">{heading}</h2>
        </AnimatedSection>
        <div className="grid gap-4 md:grid-cols-2">
          {links.map((link) => (
            <AnimatedSection key={link.href} as="div">
              <div className="rounded-2xl bg-pe-bg p-6 border-l-[3px]" style={{ borderLeftColor: accent }}>
                <ArrowLink href={link.href} size="lg">{link.label}</ArrowLink>
                <p className="font-body text-sm leading-[1.7] text-pe-muted mt-2">{link.line}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

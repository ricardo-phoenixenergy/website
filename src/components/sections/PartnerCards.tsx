// src/components/sections/PartnerCards.tsx
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import type { Partner } from '@/types/sanity';

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

interface PartnerCardsProps {
  partners: Partner[];
}

export function PartnerCards({ partners }: PartnerCardsProps) {
  if (partners.length === 0) return null;

  return (
    <section className="bg-white py-12 md:py-16" style={{ borderBottom: '1px solid #E5E7EB' }}>
      <div className="page-container">
        <AnimatedSection>
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] text-center mb-8">
            Trusted by leading energy businesses
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {partners.map((p) =>
              p.logo ? (
                <Image
                  key={p._id}
                  src={p.logo.asset.url}
                  alt={p.logo.alt ?? p.name}
                  height={64}
                  width={240}
                  className="h-12 md:h-16 w-auto max-w-[180px] md:max-w-[240px] object-contain opacity-50 hover:opacity-80 transition-opacity duration-200"
                />
              ) : (
                <span
                  key={p._id}
                  className="font-body font-bold text-sm text-[#6B7280] opacity-50"
                >
                  {getInitials(p.name)}
                </span>
              )
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

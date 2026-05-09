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
    <section className="bg-white py-10 md:py-12" style={{ borderBottom: '1px solid #E5E7EB' }}>
      <div className="page-container">
        <AnimatedSection>
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] text-center mb-6">
            Trusted by leading energy businesses
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14">
            {partners.map((p) =>
              p.logo ? (
                <Image
                  key={p._id}
                  src={p.logo.asset.url}
                  alt={p.logo.alt ?? p.name}
                  height={32}
                  width={140}
                  className="h-8 w-auto max-w-[140px] object-contain opacity-50 hover:opacity-80 transition-opacity duration-200"
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

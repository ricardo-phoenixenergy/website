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
    <section className="bg-white px-5 py-8" style={{ borderBottom: '1px solid #E5E7EB' }}>
      <AnimatedSection>
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] text-center mb-4">
          Our energy partners
        </p>
        <div className="flex flex-wrap gap-12 justify-center items-center">
          {partners.map((p) => (
            <div key={p._id}>
              {p.logo ? (
                <Image
                  src={p.logo.asset.url}
                  alt={p.logo.alt ?? p.name}
                  height={40}
                  width={120}
                  className="object-contain h-32 w-auto max-w-[120px]"
                />
              ) : (
                <div className="w-32 h-32 rounded-lg flex items-center justify-center font-display font-extrabold text-sm text-white flex-shrink-0 bg-[#1a3a6e]">
                  {getInitials(p.name)}
                </div>
              )}
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}

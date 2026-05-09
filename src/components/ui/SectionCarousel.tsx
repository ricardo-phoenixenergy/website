import Link from 'next/link';
import { AnimatedSection } from './AnimatedSection';
import { IconArrowRight } from './Icons';

interface SectionCarouselProps {
  label: string;
  title: React.ReactNode;
  viewAllHref: string;
  viewAllLabel: string;
  bg?: 'white' | 'gray';
  children: React.ReactNode;
}

export function SectionCarousel({
  label,
  title,
  viewAllHref,
  viewAllLabel,
  bg = 'white',
  children,
}: SectionCarouselProps) {
  return (
    <section className={`${bg === 'gray' ? 'bg-[#F5F5F5]' : 'bg-white'} py-16 md:py-24`}>
      <AnimatedSection>
        <div className="page-container flex items-end justify-between mb-6">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
              {label}
            </p>
            <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
              {title}
            </h2>
          </div>
          <Link
            href={viewAllHref}
            className="group flex items-center gap-1.5 font-body text-sm font-medium text-[#39575C] hover:text-[#2a4045] transition-colors flex-shrink-0 ml-4"
          >
            {viewAllLabel}
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              <IconArrowRight size={14} />
            </span>
          </Link>
        </div>
      </AnimatedSection>

      <div className="page-container">
        <div className="flex gap-3.5 overflow-x-auto scrollbar-none pt-3 -mt-3 pb-4">
          {children}
        </div>
      </div>
    </section>
  );
}

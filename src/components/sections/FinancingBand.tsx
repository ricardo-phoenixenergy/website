import { FinancingCards } from './FinancingCards';

export function FinancingBand() {
  return (
    <section className="bg-[#F5F5F5] py-12 md:py-[52px]">
      <div className="page-container">
        <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280] mb-2">
          How to fund it
        </p>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] mb-6 max-w-xl">
          Own it, or zero upfront — works with any strategy
        </h2>
        <FinancingCards />
      </div>
    </section>
  );
}

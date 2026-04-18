import Link from 'next/link';

export function CareersBand() {
  return (
    <section
      className="bg-white px-6 py-7"
      style={{ borderTop: '1px solid #E5E7EB' }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 max-w-[960px] mx-auto">
        <div>
          <p className="font-body font-bold text-xs uppercase tracking-[0.12em] mb-1.5" style={{ color: '#709DA9' }}>
            Join us
          </p>
          <p className="font-display font-bold text-lg text-[#1A1A1A]">
            Become a part of our journey
          </p>
          <p className="font-body text-sm text-[#6B7280] mt-0.5 max-w-[480px] leading-[1.7]">
            We're always looking for passionate, ambitious and like-minded individuals who share our vision for a prosperous Africa.
          </p>
        </div>
        <Link
          href="https://linkedin.com/company/105465145"
          target="_blank"
          rel="noopener noreferrer"
          className="md:flex-shrink-0 flex items-center justify-center rounded-full px-5 py-2.5 bg-[#39575C] text-white font-body font-semibold text-base hover:bg-[#2a4045] transition-colors duration-200"
          style={{ whiteSpace: 'nowrap' }}
        >
          See career opportunities →
        </Link>
      </div>
    </section>
  );
}

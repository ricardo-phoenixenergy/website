// src/app/tools/solar-valuation/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { SolarValuationTool } from '@/components/tools/SolarValuationTool';
import { CTABanner } from '@/components/sections/CTABanner';

export const metadata: Metadata = {
  title: 'Solar Asset Valuation Tool — What Is Your System Worth? | Phoenix Energy',
  description:
    'Get an instant indicative buyback valuation for your solar system and BESS. Based on DCF analysis, SA market rates, and WeBuySolar transaction data.',
  openGraph: {
    images: [{ url: '/og-tools-valuation.jpg' }],
  },
  alternates: {
    canonical: 'https://phoenixenergy.solutions/tools/solar-valuation',
  },
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to value a solar system in South Africa',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Enter system details',
      text: 'Input your installed kWp, year, panel tier and inverter type.',
    },
    {
      '@type': 'HowToStep',
      name: 'Describe system condition',
      text: 'Rate condition, warranty status, monitoring, and COC certificate.',
    },
    {
      '@type': 'HowToStep',
      name: 'Receive your valuation',
      text: 'Get a DCF-based indicative buyback range from WeBuySolar.',
    },
  ],
};

export default function SolarValuationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-[960px] mx-auto px-6 pt-4">
        <nav
          aria-label="Breadcrumb"
          className="font-body text-[10px] text-[#6B7280] flex items-center gap-1"
        >
          <Link href="/" className="hover:text-[#39575C] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/tools" className="hover:text-[#39575C] transition-colors">
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#1A1A1A]">Solar Asset Valuation</span>
        </nav>
      </div>

      {/* Page header */}
      <section className="max-w-[600px] mx-auto px-6 py-10 text-center">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
          WeBuySolar Tool
        </p>
        <h1 className="font-display font-extrabold text-3xl text-[#1A1A1A] mb-3 leading-tight">
          What is your solar system{' '}
          <span style={{ color: '#709DA9' }}>worth?</span>
        </h1>
        <p className="font-body text-sm text-[#6B7280] leading-[1.75]">
          Get an indicative buyback valuation in under 2 minutes. Based on real SA market
          data, DCF analysis, and WeBuySolar transaction comparables.
        </p>
      </section>

      {/* Tool */}
      <section className="px-6 pb-16" style={{ background: '#F5F5F5' }}>
        <SolarValuationTool />
      </section>

      <CTABanner />
    </>
  );
}

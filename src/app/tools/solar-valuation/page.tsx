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

      <main className="bg-[#F5F5F5] min-h-screen">
        <div className="page-container pt-24 pb-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 font-body text-sm text-[#6B7280] mb-6">
            <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-[#39575C] transition-colors">Tools</Link>
            <span>/</span>
            <span className="font-semibold text-[#39575C]">Solar Asset Valuation</span>
          </nav>

          {/* Page header — centred for tool pages */}
          <div className="max-w-[600px] mx-auto text-center mb-10">
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
              WeBuySolar Tool
            </p>
            <h1 className="font-display font-extrabold text-4xl text-[#1A1A1A] leading-[1.2] mb-3">
              What is your solar system{' '}
              <em style={{ color: '#709DA9', fontStyle: 'normal' }}>worth?</em>
            </h1>
            <p className="font-body text-base text-[#6B7280] leading-[1.75]">
              Get an indicative buyback valuation in under 2 minutes. Based on real SA market
              data, DCF analysis, and WeBuySolar transaction comparables.
            </p>
          </div>

        </div>

        {/* Tool */}
        <div className="page-container pb-16">
          <SolarValuationTool />
        </div>
      </main>

      <CTABanner />
    </>
  );
}

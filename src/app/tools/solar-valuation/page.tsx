// src/app/tools/solar-valuation/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { SolarValuationTool } from '@/components/tools/SolarValuationTool';

export const metadata: Metadata = {
  title: 'Solar Asset Valuation Tool — What Is Your System Worth? | Phoenix Energy',
  description:
    'Tell us about your solar system and battery storage, and the WeBuySolar team will prepare an indicative buyback valuation based on current South African market data and comparable solar transactions.',
  openGraph: {
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
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
      text: 'Input your installed kWp, year of installation, brands and inverter type.',
    },
    {
      '@type': 'HowToStep',
      name: 'Describe system condition',
      text: 'Rate condition, monitoring, documentation and province.',
    },
    {
      '@type': 'HowToStep',
      name: 'Submit your details',
      text: 'Share your contact details and the WeBuySolar team prepares your indicative valuation.',
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
              Tell us about your solar system and our WeBuySolar team will prepare an indicative
              buyback valuation, informed by current South African market data and comparable
              commercial solar transactions.
            </p>
          </div>

        </div>

        {/* Tool */}
        <div className="page-container pb-16">
          <SolarValuationTool />
        </div>
      </main>
    </>
  );
}

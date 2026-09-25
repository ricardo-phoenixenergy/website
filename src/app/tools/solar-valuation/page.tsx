// src/app/tools/solar-valuation/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { SolarValuationTool } from '@/components/tools/SolarValuationTool';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { WEBUYSOLAR_OFFER } from '@/config/webuysolarOffer';
import { SOLUTION_META } from '@/types/solutions';

// A request form, not a calculator: the WeBuySolar team prepares the valuation
// after a free on-site audit, so nothing here promises an on-screen figure.
export const metadata: Metadata = {
  title: 'Solar System Valuation Request',
  description:
    'Request a valuation of your solar system and battery storage. Our WeBuySolar team prepares it after a free on-site audit, with no obligation.',
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
  name: 'How to request a solar system valuation in South Africa',
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
      text: `Share your contact details. ${WEBUYSOLAR_OFFER.firstContact}`,
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

      <div className="bg-pe-bg min-h-screen">
        <div className="page-container pt-24 pb-6">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-body text-sm text-pe-muted mb-6">
            <Link href="/" className="hover:text-pe-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-pe-primary transition-colors">Tools</Link>
            <span>/</span>
            <span className="font-semibold text-pe-primary" aria-current="page">Solar Valuation Request</span>
          </nav>

          {/* Page header — centred for tool pages */}
          <div className="max-w-[600px] mx-auto text-center mb-10">
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-2">
              WeBuySolar
            </p>
            <h1 className="font-display font-extrabold text-4xl text-pe-text leading-[1.2] mb-3 text-balance">
              Request a <em className="not-italic text-pe-secondary-ink">valuation</em> of your
              solar system
            </h1>
            <p className="font-body text-base text-pe-muted leading-[1.75]">
              Tell us about your system in three short steps. Our WeBuySolar team prepares your
              valuation after a free on-site audit, so you won&rsquo;t see a figure on this page.
            </p>
            <p className="font-body text-sm text-pe-text-soft leading-[1.6] mt-3 max-w-[52ch] mx-auto text-balance">
              {WEBUYSOLAR_OFFER.eligibility}
            </p>
            {/* The full process and FAQ live on the WeBuySolar page. */}
            <ArrowLink href={SOLUTION_META.webuysolar.slug} className="mt-2">
              How WeBuySolar works
            </ArrowLink>
          </div>

        </div>

        {/* Tool */}
        <div className="page-container pb-16">
          <SolarValuationTool />
        </div>
      </div>
    </>
  );
}

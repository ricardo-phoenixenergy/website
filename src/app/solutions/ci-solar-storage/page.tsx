// src/app/solutions/ci-solar-storage/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { CTABanner } from '@/components/sections/CTABanner';
import { SolarCalculator } from '@/components/sections/calculators/SolarCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';

const vertical = 'ci-solar-storage' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}`, images: [{ url: 'https://phoenixenergy.solutions/og-solutions-ci-solar.png', width: 1200, height: 630 }] },
};

const tabs: TabItem[] = [
  {
    label: 'Solar Technology',
    icon: 'Sun',
    iconBg: 'rgba(227,197,141,0.18)',
    title: 'Tier 1 Panels & Hybrid Inverters',
    body: 'We specify Tier 1 monocrystalline panels with string or hybrid inverters sized to your load profile, ensuring maximum yield and full NERSA grid compliance.',
    bullets: ['Tier 1 monocrystalline panels (JA, Longi, Jinko)', 'Hybrid inverters — battery-ready from day one', 'NERSA-compliant single-line diagram', 'Remote performance monitoring via web portal'],
    imageBg: 'linear-gradient(135deg, rgba(227,197,141,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🔆',
  },
  {
    label: 'Battery Storage',
    icon: 'Battery',
    iconBg: 'rgba(227,197,141,0.18)',
    title: 'BESS — Energy Without Limits',
    body: 'Battery Energy Storage Systems extend your solar window through peak tariff hours, eliminate demand charges, and provide seamless UPS failover during loadshedding.',
    bullets: ['LFP chemistry for 6 000+ cycle life', 'Peak-shaving algorithms cut demand charges', 'Sub-20ms UPS failover — zero disruption', 'Scalable — add capacity as demand grows'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(227,197,141,0.15) 100%)',
    imageEmoji: '⚡',
  },
  {
    label: 'Financing',
    icon: 'DollarSign',
    iconBg: 'rgba(227,197,141,0.18)',
    title: 'Financing Options',
    body: '',
    bullets: [],
    imageBg: '',
    imageEmoji: '',
    type: 'financing',
  },
];

const steps = [
  { label: 'Site Assessment', description: 'We audit your consumption data, roof or ground area, and grid connection details.', tag: 'Free' },
  { label: 'System Design', description: 'Our engineers produce a yield simulation and NERSA-compliant single-line diagram.', tag: '5–7 days' },
  { label: 'Installation', description: 'SAPVIA-certified teams install and commission with zero business disruption.', tag: '1–3 weeks' },
  { label: 'Monitoring', description: '24/7 remote monitoring with monthly generation reports and annual preventive maintenance.', tag: 'Ongoing' },
];

export default function CiSolarStoragePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: meta.label,
    provider: { '@type': 'Organization', name: 'Phoenix Energy' },
    description: cfg.seoDescription,
    url: `https://phoenixenergy.solutions/solutions/${vertical}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SolutionHero
        title="Cut your electricity bill by <em>up to 60%</em>"
        subtitle="Commercial and industrial solar and battery storage — zero upfront capital with our PPA model."
        accent={meta.accent}
        badge={meta.label}
        heroImage="/hero-solar.png"
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1a3a3f 50%, #2d5c63 100%)"
        primaryCta={{ label: 'Get a Free Assessment', href: '/contact' }}
      >
        <SolarCalculator />
      </SolutionHero>
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} vertical="ci-solar-storage" />
      <div id="how-it-works">
        <HowItWorks
          title="From assessment to <em>savings in weeks</em>"
          steps={steps}
          showCTA
          ctaLabel="Get a Free Assessment"
          ctaHref="/contact"
        />
      </div>
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
      <RelatedArticles vertical={vertical} />
      <CTABanner
        eyebrow="Start saving"
        heading="Cut your electricity bill — permanently"
        body="Get a free site assessment and energy yield simulation from our certified engineers. No commitment required — results delivered within 48 hours."
        primaryCta={{ label: 'Get a Free Assessment', href: '/contact' }}
        stats={[
          { value: '80+',   label: 'Solar installations' },
          { value: '48 MW', label: 'Peak capacity' },
          { value: '60%',   label: 'Avg bill reduction' },
          { value: 'R280M', label: 'Client savings' },
        ]}
      />
    </>
  );
}

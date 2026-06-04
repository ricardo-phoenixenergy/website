// src/app/solutions/energy-optimisation/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { OptimisationCalculator } from '@/components/sections/calculators/OptimisationCalculator';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';

const vertical = 'energy-optimisation' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}`, images: [{ url: 'https://phoenixenergy.solutions/og-solutions-energy-optimisation.png', width: 1200, height: 630 }] },
};

export const revalidate = 3600;

const tabs: TabItem[] = [
  {
    label: 'Real-Time Monitoring',
    icon: 'Activity',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Sub-Meter Visibility at Every Circuit',
    body: 'Phoenix installs sub-metering at circuit level and streams data to our cloud dashboard. Anomalies trigger instant alerts — before they become costly bills.',
    bullets: ['Circuit-level sub-metering', 'Real-time cloud dashboard', 'Anomaly detection alerts via SMS/email', 'Monthly benchmarking reports'],
    imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '📊',
  },
  {
    label: 'HVAC Optimisation',
    icon: 'Thermometer',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Smart HVAC Control',
    body: 'HVAC typically accounts for 40–60% of commercial energy use. Our BMS integration and schedule tuning reduces run-time waste without sacrificing occupant comfort.',
    bullets: ['BMS integration (any brand)', 'Occupancy-based scheduling', 'Setpoint optimisation algorithms', 'Demand response pre-cooling'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(112,157,169,0.15) 100%)',
    imageEmoji: '❄️',
  },
  {
    label: 'Load Shifting',
    icon: 'Zap',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Peak Demand Reduction',
    body: 'Demand charges often make up 30–40% of your electricity bill. We identify shiftable loads and automate them to avoid peak periods — cutting demand charges without touching production.',
    bullets: ['Automated load-shift scheduling', 'Demand charge analysis and reduction', 'Loadshedding-aware scheduling', 'ROI dashboard with savings attribution'],
    imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.18) 0%, rgba(57,87,92,0.22) 100%)',
    imageEmoji: '⏱️',
  },
];

export default async function EnergyOptimisationPage() {
  const howItWorks = await getHowItWorks(vertical);

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
        title="Stop paying for energy <em>you are wasting</em>"
        subtitle="Real-time monitoring, smart HVAC control, and load-shifting — 28% average waste identified with zero capital outlay."
        accent={meta.accent}
        badge={meta.label}
        heroImage="/hero-optimisation.png"
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1c3540 50%, #2a4a58 100%)"
        primaryCta={{ label: 'Book a Free Audit', href: '/contact' }}
      >
        <OptimisationCalculator />
      </SolutionHero>
      <SolutionTabs tabs={tabs} accent={meta.accent} vertical="energy-optimisation" />
      {howItWorks && <HowItWorks {...howItWorks} />}
      <FeaturedProjects vertical={vertical} />
      <RelatedArticles vertical={vertical} />
      <PageFooter
        eyebrow="Stop overpaying"
        heading="Reduce your energy costs without replacing your infrastructure"
        body="Our engineers analyse your load profile, identify hidden inefficiencies, and deliver a savings roadmap in 5 business days — at no cost to you."
        primaryCta={{ label: 'Book a Free Energy Audit', href: '/contact' }}
        stats={[
          { value: '200+', label: 'Audits completed' },
          { value: '35%',  label: 'Avg cost reduction' },
          { value: 'R95M', label: 'Savings identified' },
          { value: '48h',  label: 'Report turnaround' },
        ]}
      />
    </>
  );
}

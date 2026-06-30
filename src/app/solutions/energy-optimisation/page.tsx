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
import { getHeroImages } from '@/lib/getHeroImages';
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
    label: 'Energy Efficiency & Process Optimisation',
    icon: 'Sliders',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Use Less Energy for the Same Output',
    body: 'The cheapest kilowatt-hour is the one you never consume. We upgrade the equipment that drives your consumption — motors, drives, power factor and lighting — so every process delivers the same output on materially less energy.',
    bullets: [
      'High-efficiency motors on your biggest electrical loads.',
      'Variable speed drives (VSDs) that match motor speed to real demand.',
      'Power-factor correction (PFC) to avoid penalties and free up capacity.',
      'LED efficient lighting with smart controls.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.18) 0%, rgba(57,87,92,0.22) 100%)',
    imageEmoji: '⚙️',
  },
  {
    label: 'Demand Side Management',
    icon: 'Zap',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Move and Automate Demand Away from Peaks',
    body: 'Demand and Time-of-Use charges reward you for when you use energy, not just how much. We shift flexible loads off peak periods and put your building under intelligent, automated control — cutting demand charges without touching production.',
    bullets: [
      'Load shifting to dodge peak-demand and Time-of-Use charges.',
      'Smart building management — HVAC, lighting and plant on optimised schedules.',
      'Automated controls that react to tariffs, occupancy and loadshedding in real time.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(112,157,169,0.15) 100%)',
    imageEmoji: '🔀',
  },
  {
    label: 'Real-Time Monitoring',
    icon: 'Activity',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Sub-Meter Visibility at Every Circuit',
    body: 'Phoenix installs sub-metering at circuit level and streams data to our cloud dashboard. Anomalies trigger instant alerts — before they become costly bills.',
    bullets: ['Circuit-level sub-metering.', 'Real-time cloud dashboard.', 'Anomaly detection alerts via SMS/email.', 'Monthly benchmarking reports.'],
    imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '📊',
  },
];

export default async function EnergyOptimisationPage() {
  const howItWorks = await getHowItWorks(vertical);
  const hero = (await getHeroImages())[vertical];

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
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1c3540 50%, #2a4a58 100%)"
        primaryCta={{ label: 'Book a Free Audit', href: '/contact' }}
      >
        <OptimisationCalculator />
      </SolutionHero>
      <SolutionTabs
        tabs={tabs}
        accent={meta.accent}
        vertical="energy-optimisation"
        eyebrow="The levers"
        heading="Where the <em>savings come from</em>"
        subtitle="The monitoring, equipment tuning and load strategies we use to cut your energy spend — without new generation."
      />
      {howItWorks && <HowItWorks {...howItWorks} accent={meta.accent} accentText={meta.accentText} />}
      <FeaturedProjects vertical={vertical} />
      <RelatedArticles vertical={vertical} />
      <PageFooter
        ctaVariant="centered"
        eyebrow="Stop overpaying"
        heading="Reduce your energy costs without replacing your infrastructure"
        body="Our engineers analyse your load profile, identify hidden inefficiencies, and deliver a savings roadmap in 5 business days — at no cost to you."
        primaryCta={{ label: 'Book a Free Energy Audit', href: '/contact' }}
      />
    </>
  );
}

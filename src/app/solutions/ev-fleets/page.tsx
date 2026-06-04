// src/app/solutions/ev-fleets/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { EvFleetsCalculator } from '@/components/sections/calculators/EvFleetsCalculator';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';

const vertical = 'ev-fleets' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}`, images: [{ url: 'https://phoenixenergy.solutions/og-solutions-ev-fleets.png', width: 1200, height: 630 }] },
};

export const revalidate = 3600;

const tabs: TabItem[] = [
  {
    label: 'Charging Infrastructure',
    icon: 'Zap',
    iconBg: 'rgba(169,214,203,0.20)',
    title: 'SANS-Certified EV Chargers',
    body: 'Phoenix supplies and installs AC and DC fast chargers compliant with SANS 1017 and SANS 60309. We design depot layouts that maximise vehicle throughput and minimise grid connection costs.',
    bullets: ['AC Level 2 (22 kW) and DC fast (150 kW+)', 'SANS 1017 & SANS 60309 certified', 'Load management to avoid demand spikes', 'Solar integration — charge from your own generation'],
    imageBg: 'linear-gradient(135deg, rgba(169,214,203,0.18) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '⚡',
  },
  {
    label: 'Fleet Dashboard',
    icon: 'Monitor',
    iconBg: 'rgba(169,214,203,0.20)',
    title: 'Real-Time Fleet Management',
    body: 'Our fleet dashboard gives operations managers live visibility into vehicle state-of-charge, charging status, range, and energy cost per kilometre — all in one place.',
    bullets: ['Live state-of-charge per vehicle', 'Route planning with charge stops', 'Energy cost per km vs diesel baseline', 'Driver behaviour scoring'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(169,214,203,0.18) 100%)',
    imageEmoji: '📱',
  },
  {
    label: 'Financing',
    icon: 'DollarSign',
    iconBg: 'rgba(169,214,203,0.20)',
    title: 'Financing Options',
    body: '',
    bullets: [],
    imageBg: '',
    imageEmoji: '',
    type: 'financing',
  },
];

export default async function EvFleetsPage() {
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
        title="Electrify your fleet and cut fuel costs <em>by 60%</em>"
        subtitle="SANS-certified EV charging infrastructure, fleet management dashboard, and full depot design — built for South African conditions."
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #0f2a28 50%, #1a4040 100%)"
        primaryCta={{ label: 'Get a Fleet Assessment', href: '/contact' }}
      >
        <EvFleetsCalculator />
      </SolutionHero>
      <SolutionTabs tabs={tabs} accent={meta.accent} vertical="ev-fleets" />
      {howItWorks && <HowItWorks {...howItWorks} />}
      <FeaturedProjects vertical={vertical} />
      <RelatedArticles vertical={vertical} />
      <PageFooter
        eyebrow="Electrify your fleet"
        heading="Future-proof your operations with clean charging infrastructure"
        body="From feasibility study to full commissioning — we design, fund, and operate EV charging networks for commercial and industrial fleets across Southern Africa."
        primaryCta={{ label: 'Get a Fleet Assessment', href: '/contact' }}
        stats={[
          { value: '200+', label: 'Chargers installed' },
          { value: '15+',  label: 'Fleet clients' },
          { value: '8 MW', label: 'Charging capacity' },
          { value: '5',    label: 'Provinces covered' },
        ]}
      />
    </>
  );
}

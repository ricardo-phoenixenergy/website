// src/app/solutions/wheeling/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { WheelingCalculator } from '@/components/sections/calculators/WheelingCalculator';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';

const vertical = 'wheeling' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}`, images: [{ url: 'https://phoenixenergy.solutions/og-solutions-wheeling.png', width: 1200, height: 630 }] },
};

export const revalidate = 3600;

const tabs: TabItem[] = [
  {
    label: 'Direct Wheeling',
    icon: 'Zap',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Generator-to-Consumer Wheeling',
    body: 'Phoenix Energy connects your facility directly to a renewable generator using the Eskom transmission grid. You pay the generator a fixed tariff below the Eskom rate — no infrastructure investment required.',
    bullets: ['Fixed tariff below Eskom rate.', 'Renewable energy certificates (RECs) included.', 'NERSA-licensed trading desk.', 'Transparent monthly settlement statements.'],
    imageBg: 'linear-gradient(135deg, rgba(217,124,118,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🔌',
  },
  {
    label: 'Aggregated Pool',
    icon: 'Globe',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Multi-Generator Pool Access',
    body: 'For consumers who want supply security, Phoenix aggregates multiple generators into a single pooled agreement. Your volume is matched dynamically to maintain consistent supply.',
    bullets: ['Supply security from multiple generators.', 'Volume-matched dynamically.', 'Single contract, single invoice.', 'Scales with your consumption growth.'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(217,124,118,0.15) 100%)',
    imageEmoji: '🌐',
  },
  {
    label: 'Financing',
    icon: 'DollarSign',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Financing Options',
    body: '',
    bullets: [],
    imageBg: '',
    imageEmoji: '',
    type: 'financing',
  },
];

export default async function WheelingPage() {
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
        title="Buy renewable energy <em>directly from the source</em>"
        subtitle="Wheel clean power through the Eskom grid to your facility — fixed tariff, no infrastructure, 32% average saving."
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #1a0f0f 0%, #3a1a18 50%, #5a2a28 100%)"
        primaryCta={{ label: 'Get a Wheeling Quote', href: '/contact' }}
      >
        <WheelingCalculator />
      </SolutionHero>
      <SolutionTabs
        tabs={tabs}
        accent={meta.accent}
        vertical="wheeling"
        eyebrow="The models"
        heading="Two ways to <em>wheel clean power</em>"
        subtitle="Direct or aggregated wheeling agreements — and the financing structures that make each one work."
      />
      {howItWorks && <HowItWorks {...howItWorks} accent={meta.accent} accentText={meta.accentText} />}
      <FeaturedProjects vertical={vertical} />
      <RelatedArticles vertical={vertical} />
      <PageFooter
        ctaVariant="centered"
        eyebrow="Start wheeling"
        heading="Access wholesale renewable energy without owning a single panel"
        body="Connect to Phoenix Energy's wheeling network and start purchasing clean energy at rates below Eskom's tariff — fully managed from PPA agreement to delivery."
        primaryCta={{ label: 'Explore a Wheeling Agreement', href: '/contact' }}
      />
    </>
  );
}

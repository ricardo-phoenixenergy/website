// src/app/solutions/wheeling/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { CTABanner } from '@/components/sections/CTABanner';
import { WheelingCalculator } from '@/components/sections/calculators/WheelingCalculator';
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

const tabs: TabItem[] = [
  {
    label: 'Direct Wheeling',
    icon: 'Zap',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Generator-to-Consumer Wheeling',
    body: 'Phoenix Energy connects your facility directly to a renewable generator using the Eskom transmission grid. You pay the generator a fixed tariff below the Eskom rate — no infrastructure investment required.',
    bullets: ['Fixed tariff below Eskom rate', 'Renewable energy certificates (RECs) included', 'NERSA-licensed trading desk', 'Transparent monthly settlement statements'],
    imageBg: 'linear-gradient(135deg, rgba(217,124,118,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🔌',
  },
  {
    label: 'Aggregated Pool',
    icon: 'Globe',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Multi-Generator Pool Access',
    body: 'For consumers who want supply security, Phoenix aggregates multiple generators into a single pooled agreement. Your volume is matched dynamically to maintain consistent supply.',
    bullets: ['Supply security from multiple generators', 'Volume-matched dynamically', 'Single contract, single invoice', 'Scales with your consumption growth'],
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

const steps = [
  { label: 'Consumption Audit', description: 'We analyse 12 months of interval meter data to quantify your wheeling opportunity.', tag: 'Free' },
  { label: 'Generator Matching', description: 'Phoenix matches your load profile to available generators on our licensed platforms.', tag: '5–10 days' },
  { label: 'Agreement Sign-off', description: 'NERSA-compliant wheeling agreement executed between generator, Eskom, and consumer.', tag: '2–4 weeks' },
  { label: 'Live Settlement', description: 'T-day energy accounting with monthly consolidated invoicing and REC delivery.', tag: 'Ongoing' },
];

export default function WheelingPage() {
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
        heroImage="/hero-wheeling.png"
        heroBg="linear-gradient(135deg, #1a0f0f 0%, #3a1a18 50%, #5a2a28 100%)"
        primaryCta={{ label: 'Get a Wheeling Quote', href: '/contact' }}
      >
        <WheelingCalculator />
      </SolutionHero>
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} vertical="wheeling" />
      <div id="how-it-works">
        <HowItWorks
          title="Wheeling made <em>straightforward</em>"
          steps={steps}
          showCTA
          ctaLabel="Get a Wheeling Quote"
          ctaHref="/contact"
        />
      </div>
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
      <RelatedArticles vertical={vertical} />
      <CTABanner
        eyebrow="Start wheeling"
        heading="Access wholesale renewable energy without owning a single panel"
        body="Connect to Phoenix Energy's wheeling network and start purchasing clean energy at rates below Eskom's tariff — fully managed from PPA agreement to delivery."
        primaryCta={{ label: 'Explore a Wheeling Agreement', href: '/contact' }}
        stats={[
          { value: '15+',   label: 'PPAs signed' },
          { value: '12 MW', label: 'Wheeled capacity' },
          { value: '20%',   label: 'Below Eskom tariff' },
          { value: '8',     label: 'Corporate clients' },
        ]}
      />
    </>
  );
}

// src/app/solutions/wheeling/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { WheelingEligibility } from '@/components/sections/WheelingEligibility';
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
    key: 'model-direct',
    label: 'Direct Wheeling',
    icon: 'Zap',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Direct Wheeling',
    body: 'If Eskom supplies your business directly, we connect you to an independent renewable generator and wheel that power to you across the Eskom transmission grid. You pay a fixed tariff below your current Eskom rate — with no capital outlay and nothing installed on site.',
    bullets: [
      'Fixed tariff below your Eskom rate.',
      'Renewable energy certificates (RECs) included.',
      'NERSA-licensed trading and settlement.',
      'No infrastructure or capital required.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(217,124,118,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🔌',
  },
  {
    key: 'model-virtual',
    label: 'Virtual Wheeling',
    icon: 'Globe',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Virtual Wheeling',
    body: 'If your business buys electricity from a municipality that supports virtual wheeling, we wheel renewable generation into the grid on your behalf and the municipality nets it off against your consumption — cleaner power at a lower effective rate, without leaving your municipal supply.',
    bullets: [
      'For supported metros — Johannesburg, Cape Town, Tshwane, Ekurhuleni, eThekwini and Nelson Mandela Bay.',
      'Municipality nets wheeled generation against your bill.',
      'Fixed, below-tariff pricing on wheeled energy.',
      'Fully managed agreements and settlement.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(217,124,118,0.15) 100%)',
    imageEmoji: '🌐',
  },
  {
    key: 'model-micro',
    label: 'Micro-wheeling',
    icon: 'Sun',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Micro-wheeling',
    body: 'A specialised solution for mid-sized consumers who want to own their generation. You purchase a dedicated solar plant — typically around 1 MW — that wheels its output directly to your site. Built for businesses with base loads between 500 kW and 1 MW that want the long-term returns of ownership.',
    bullets: [
      'Own a dedicated ~1 MW solar plant.',
      'Ideal for base loads of 500 kW–1 MW.',
      'Wheels directly to your point of consumption.',
      'Maximum lifetime returns through ownership.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(217,124,118,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🏭',
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
        subtitle="Buy renewable energy directly from independent generators and wheel it to your site across the grid — no panels, no capital. Check whether your business qualifies in two questions."
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #1a0f0f 0%, #3a1a18 50%, #5a2a28 100%)"
        primaryCta={{ label: 'Get a Wheeling Quote', href: '/contact' }}
      >
        <WheelingEligibility />
      </SolutionHero>
      <SolutionTabs
        tabs={tabs}
        accent={meta.accent}
        vertical="wheeling"
        eyebrow="The models"
        heading="Three ways to <em>wheel clean power</em>"
        subtitle="Direct, virtual or owned — the right structure depends on who supplies your business and how you want to participate."
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

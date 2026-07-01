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
    title: 'Secure lower-cost renewable electricity.',
    body: "Direct Wheeling gives your business access to renewable electricity generated off-site and delivered through Eskom's transmission network. Electricity is supplied under a bilateral Power Purchase Agreement (PPA) between your business and an independent power producer (IPP), while we manage the trading, settlement and compliance — helping you reduce electricity costs without investing in on-site generation.",
    bulletsLabel: 'Suited for',
    bullets: [
      'Businesses billed directly by Eskom.',
      'Medium-voltage (MV) and higher-voltage connections on Time-of-Use tariffs.',
      'Sites with limited space for on-site solar PV.',
      'Existing solar PV systems that have reached their practical capacity but require greater renewable energy penetration.',
    ],
    benefitsLabel: 'Benefits',
    benefits: [
      'No on-site infrastructure or upfront capital investment.',
      'Complements on-site battery arbitrage by supplying lower-cost energy for battery charging.',
      'Flexible contract terms — from annual subscriptions to 25+ year PPAs.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(217,124,118,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🔌',
  },
  {
    key: 'model-virtual',
    label: 'Virtual Wheeling',
    icon: 'Globe',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Access renewable electricity through your municipal supply.',
    body: 'Virtual Wheeling enables businesses supplied by participating municipalities to purchase renewable electricity generated off-site without installing solar on their premises. We manage the energy trading, agreements, and settlement while renewable generation is virtually allocated against your electricity consumption — reducing energy costs while increasing your renewable energy usage without changing your existing supply connection.',
    bulletsLabel: 'Suited for',
    bullets: [
      'Businesses supplied by participating municipalities with approved virtual wheeling programmes.',
      'Sites with limited space for on-site solar PV.',
      'Existing solar PV systems looking to increase renewable energy penetration.',
      'Businesses seeking lower-cost renewable electricity without investing in on-site infrastructure.',
    ],
    benefitsLabel: 'Benefits',
    benefits: [
      'No on-site infrastructure or upfront capital investment.',
      'Continue purchasing electricity through your existing municipal connection.',
      'Complements on-site battery storage by reducing battery charging costs.',
      'Flexible contract terms — from annual subscriptions to 25+ year Power Purchase Agreements.',
      'Longer-term agreements unlock more favourable electricity pricing.',
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

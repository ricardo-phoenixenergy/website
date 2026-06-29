// src/app/solutions/webuysolar/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { WeBuySolarCalculator } from '@/components/sections/calculators/WeBuySolarCalculator';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';

const vertical = 'webuysolar' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}`, images: [{ url: 'https://phoenixenergy.solutions/og-solutions-webuysolar.png', width: 1200, height: 630 }] },
};

export const revalidate = 3600;

const tabs: TabItem[] = [
  {
    label: 'Rooftop Systems',
    icon: 'Building',
    iconBg: 'rgba(201,122,64,0.18)',
    title: 'Commercial Rooftop Solar',
    body: 'We purchase rooftop solar installations of any size from commercial and industrial facilities. Reason for selling does not matter — relocation, upgrade, closure, or portfolio rationalisation all qualify.',
    bullets: ['Systems from 10 kWp to 10 MWp.', 'All major inverter brands accepted.', 'Panels up to 15 years old considered.', 'Roof structural assessment included.'],
    imageBg: 'linear-gradient(135deg, rgba(201,122,64,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🏭',
  },
  {
    label: 'Ground-Mount',
    icon: 'Sun',
    iconBg: 'rgba(201,122,64,0.18)',
    title: 'Ground-Mount & Farm Systems',
    body: 'Agricultural and ground-mount solar installations are assessed on a case-by-case basis. We handle all decommissioning, transport, and repowering logistics.',
    bullets: ['Single-axis tracker systems accepted.', 'Agricultural installations welcome.', 'DC and AC-coupled systems.', 'Full decommissioning by our certified teams.'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(201,122,64,0.15) 100%)',
    imageEmoji: '🌾',
  },
  {
    label: 'Battery Storage',
    icon: 'Battery',
    iconBg: 'rgba(201,122,64,0.18)',
    title: 'BESS & Hybrid Systems',
    body: 'Battery systems paired with solar installations are purchased as a bundle. We assess state-of-health and offer fair buyback based on remaining capacity.',
    bullets: ['LFP and NMC chemistries.', 'State-of-health assessment included.', 'Bundle pricing for solar + BESS.', 'Inverter and BMS included in offer.'],
    imageBg: 'linear-gradient(135deg, rgba(201,122,64,0.18) 0%, rgba(57,87,92,0.22) 100%)',
    imageEmoji: '🔋',
  },
];

export default async function WeBuySolarPage() {
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
        title="We buy your solar system — <em>cash in 14 days</em>"
        subtitle="Fast valuation, fair price, full decommissioning. Any brand, any size, any reason for selling."
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #1a0f00 0%, #3a2000 50%, #5a3a10 100%)"
        primaryCta={{ label: 'Get a Valuation', href: '/contact' }}
      >
        <WeBuySolarCalculator />
      </SolutionHero>
      <SolutionTabs
        tabs={tabs}
        accent={meta.accent}
        vertical="webuysolar"
        eyebrow="What we buy"
        heading="The solar assets <em>we acquire</em>"
        subtitle="Rooftop, ground-mount or storage — see the systems we purchase and how we value them."
      />
      {howItWorks && <HowItWorks {...howItWorks} />}
      <FeaturedProjects vertical={vertical} />
      <RelatedArticles vertical={vertical} />
      <PageFooter
        eyebrow="Sell today"
        heading="Get paid for your solar asset within 5 business days"
        body="Receive a fair-market offer on your existing solar or BESS system. No agents, no delays — just a transparent valuation and fast settlement."
        primaryCta={{ label: 'Get an Asset Valuation', href: '/tools/solar-asset-valuation' }}
        stats={[
          { value: '42',   label: 'Systems acquired' },
          { value: 'R85M', label: 'Assets purchased' },
          { value: '5d',   label: 'Avg settlement' },
          { value: '98%',  label: 'Offer acceptance rate' },
        ]}
      />
    </>
  );
}

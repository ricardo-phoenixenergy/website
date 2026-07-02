// src/app/solutions/energy-optimisation/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { FinancingBand } from '@/components/sections/FinancingBand';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { PageFooter } from '@/components/layout/PageFooter';
import { getHowItWorks } from '@/lib/getHowItWorks';
import { getHeroImages } from '@/lib/getHeroImages';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { FinancingOption } from '@/components/sections/FinancingCards';

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

const AUDIT_MESSAGE = "I'd like to book a free energy audit of my facility.";
const AUDIT_HREF = `/contact?intent=client&message=${encodeURIComponent(AUDIT_MESSAGE)}`;
const AUDIT_CTA = { label: 'Book an Energy Audit', href: AUDIT_HREF };

const tabs: TabItem[] = [
  {
    label: 'Energy Efficiency & Process Optimisation',
    icon: 'Sliders',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Deliver the same output using less energy.',
    body: 'The cheapest kilowatt-hour is the one you never consume. We design, supply, install and finance complete energy efficiency upgrades that target your biggest electrical loads, ensuring the same operational output with significantly lower energy consumption.',
    bullets: [
      'High-efficiency IE3 & IE4 motors for major electrical loads.',
      'Variable speed drives (VSDs) to match motor speed to actual demand.',
      'Power factor correction (PFC) to reduce penalties and free up electrical capacity.',
      'Energy-efficient LED lighting with smart control systems.',
      'Full turnkey delivery — engineering, supply, installation and financing options available.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.18) 0%, rgba(57,87,92,0.22) 100%)',
    imageEmoji: '⚙️',
    cta: AUDIT_CTA,
  },
  {
    label: 'Demand Side Management',
    icon: 'Zap',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Eliminate costly peak demand charges.',
    body: "Electricity costs aren't only determined by how much energy you use, but when you use it. We reduce your exposure to peak demand and Time-of-Use charges by intelligently shifting flexible loads away from expensive periods and optimising how your facility consumes energy in real time.",
    bullets: [
      'Automated load shifting to avoid peak demand and high-cost tariff periods.',
      'Smart control of HVAC, lighting, and plant systems based on demand, occupancy, and tariffs.',
      'Real-time automation that responds to energy prices and grid conditions.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(112,157,169,0.15) 100%)',
    imageEmoji: '🔀',
    cta: AUDIT_CTA,
  },
  {
    key: 'lever-tariff',
    label: 'Tariff Optimisation',
    icon: 'DollarSign',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Stop overpaying for electricity.',
    body: 'Your electricity tariff has a significant impact on your energy costs. We identify the most cost-effective tariff for your business, optimise your Notified Maximum Demand (NMD), and align your tariff structure with how your facility actually consumes electricity — unlocking savings without changing your operations.',
    bullets: [
      'Independent review of your current tariff and billing structure.',
      'Comparison across all available Eskom and municipal tariffs.',
      'NMD optimisation to reduce unnecessary demand charges.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.16) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '💸',
    cta: AUDIT_CTA,
  },
  {
    label: 'Real-Time Monitoring',
    icon: 'Activity',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Turn energy data into lower energy costs.',
    body: "You can't optimise what you can't see. Our real-time monitoring platform gives you complete visibility into your facility's energy consumption, helping you identify waste, detect faults early, and continuously improve performance through data-driven insights.",
    bullets: [
      'Facility-wide energy visibility at circuit level.',
      'Real-time cloud monitoring and analytics.',
      'Proactive alerts before small issues become costly problems.',
      'Monthly optimisation reports with actionable recommendations.',
    ],
    imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '📊',
    cta: AUDIT_CTA,
  },
];

const EO_FINANCING: FinancingOption[] = [
  {
    icon: 'purchase',
    title: 'Outright Purchase',
    description:
      'Invest in your efficiency upgrade for maximum long-term return. Purchase your energy efficiency solution outright — covering motors, variable speed drives, power factor correction, and smart lighting systems — and capture 100% of the energy savings from day one. This option delivers the highest lifetime return and full ownership of all future savings.',
    benefits: [
      'Full ownership of the system from day one.',
      'Maximum lifetime energy cost savings.',
      'Eligible for Section 12L energy efficiency tax incentive.',
    ],
  },
  {
    icon: 'lease',
    title: 'Energy Efficiency Asset Lease',
    tag: 'Zero capex',
    description:
      'Upgrade your facility with no upfront capital. We design, supply, install and maintain your energy efficiency upgrades, with the entire solution funded through fixed monthly payments structured around your energy savings. In most cases, the savings generated from reduced energy consumption offset the monthly cost from day one — making the system cashflow-neutral or positive.',
    benefits: [
      'No upfront capital required.',
      'Savings-funded monthly payments.',
      'Full turnkey delivery — supply, installation and maintenance included.',
      'Ownership transfers to you at the end of the term.',
    ],
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
        title="Reduce energy. <em>Increase performance.</em>"
        subtitle={"Reduce your facility’s energy consumption without impacting productivity.\nWe deliver efficiency upgrades and smart energy optimisation that lower costs from day one, with zero-capex funding options available."}
        accent={meta.accent}
        badge={meta.label}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1c3540 50%, #2a4a58 100%)"
        primaryCta={{ label: 'Book a Free Energy Audit', href: AUDIT_HREF }}
        primaryCtaArrow
        copyOnly
      />
      <SolutionTabs
        tabs={tabs}
        accent={meta.accent}
        vertical="energy-optimisation"
        eyebrow="The levers"
        heading="How we <em>reduce your energy costs</em>"
        subtitle="We reduce your energy costs through a structured combination of efficiency upgrades, load optimisation, and real-time monitoring — forming the first phase of your energy roadmap, before additional generation is introduced."
      />
      <FinancingBand
        eyebrow="How to fund it"
        heading="Two ways to fund it — buy outright or start with zero capex"
        options={EO_FINANCING}
        accent={meta.accent}
        accentText="#39575C"
      />
      {howItWorks && <HowItWorks {...howItWorks} accent={meta.accent} accentText={meta.accentText} flushTop />}
      <FeaturedProjects vertical={vertical} />
      <RelatedArticles vertical={vertical} />
      <PageFooter
        ctaVariant="centered"
        eyebrow="Get started"
        heading="Stop overpaying for energy."
        body="We analyse your energy use, identify inefficiencies, and deliver a prioritised energy efficiency roadmap so you know exactly where to reduce costs. Free. No obligation."
        primaryCta={{ label: 'Book a Free Energy Audit', href: AUDIT_HREF }}
      />
    </>
  );
}

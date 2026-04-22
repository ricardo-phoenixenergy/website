// src/app/solutions/energy-optimisation/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionSubNav } from '@/components/sections/SolutionSubNav';
import { SolutionPain } from '@/components/sections/SolutionPain';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTABanner } from '@/components/sections/CTABanner';
import { StatsStrip } from '@/components/ui/StatsStrip';
import { OptimisationCalculator } from '@/components/sections/calculators/OptimisationCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { TestimonialQuote } from '@/components/sections/Testimonials';

const vertical = 'energy-optimisation' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}` },
};

const subNavLinks = [
  { label: 'Overview', href: '#pain' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Our Approach', href: '#tabs' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
];

const tabs: TabItem[] = [
  {
    label: 'Real-Time Monitoring',
    icon: '📊',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Sub-Meter Visibility at Every Circuit',
    body: 'Phoenix installs sub-metering at circuit level and streams data to our cloud dashboard. Anomalies trigger instant alerts — before they become costly bills.',
    bullets: ['Circuit-level sub-metering', 'Real-time cloud dashboard', 'Anomaly detection alerts via SMS/email', 'Monthly benchmarking reports'],
    imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '📊',
  },
  {
    label: 'HVAC Optimisation',
    icon: '❄️',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Smart HVAC Control',
    body: 'HVAC typically accounts for 40–60% of commercial energy use. Our BMS integration and schedule tuning reduces run-time waste without sacrificing occupant comfort.',
    bullets: ['BMS integration (any brand)', 'Occupancy-based scheduling', 'Setpoint optimisation algorithms', 'Demand response pre-cooling'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(112,157,169,0.15) 100%)',
    imageEmoji: '❄️',
  },
  {
    label: 'Load Shifting',
    icon: '⚡',
    iconBg: 'rgba(112,157,169,0.18)',
    title: 'Peak Demand Reduction',
    body: 'Demand charges often make up 30–40% of your electricity bill. We identify shiftable loads and automate them to avoid peak periods — cutting demand charges without touching production.',
    bullets: ['Automated load-shift scheduling', 'Demand charge analysis and reduction', 'Loadshedding-aware scheduling', 'ROI dashboard with savings attribution'],
    imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.18) 0%, rgba(57,87,92,0.22) 100%)',
    imageEmoji: '⏱️',
  },
];

const steps = [
  { label: 'Energy Audit', description: 'A certified energy auditor walks your facility and identifies top waste sources.', tag: 'Free' },
  { label: 'Sub-Meter Install', description: 'Circuit-level sub-meters and IoT sensors installed within 2–5 days.', tag: '2–5 days' },
  { label: 'Tuning & Automation', description: 'BMS integration and load-shift automations deployed — savings start immediately.', tag: '1–2 weeks' },
  { label: 'Continuous Reporting', description: 'Monthly savings reports with attributed ROI. We review and retune quarterly.', tag: 'Ongoing' },
];

const testimonials: TestimonialQuote[] = [
  { text: "Phoenix's energy audit found R180k/year in waste we didn't know we had. Their HVAC optimisation alone paid for the entire engagement in four months.", author: 'Gugu Sithole', role: 'Facilities Manager', company: 'Sithole Commercial Properties' },
  { text: 'The sub-metering dashboard changed how we manage energy. We can see exactly where every rand is going and we have cut our bill by 24% without any capital spend.', author: 'André du Plessis', role: 'Operations Manager', company: 'Du Plessis Food Group' },
  { text: 'Load-shifting kept us off Eskom demand charges through the entire winter peak season. Phoenix saved us R340k in a single quarter.', author: 'Nomsa Khumalo', role: 'CFO', company: 'Khumalo Logistics' },
];

export default function EnergyOptimisationPage() {
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
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1c3540 50%, #2a4a58 100%)"
        primaryCta={{ label: 'Book a Free Audit', href: '/contact' }}
        secondaryCta={{ label: 'Our Approach', href: '#tabs' }}
      />
      <SolutionSubNav links={subNavLinks} />
      <StatsStrip stats={cfg.stats} />
      <SolutionPain
        id="pain"
        eyebrow="The problem"
        headline="Up to <em>28% of your energy bill</em> is waste"
        body="Most commercial facilities waste between 20–35% of their electricity through inefficient HVAC scheduling, unmonitored equipment, and avoidable demand charges. Without sub-meter visibility, you are guessing — and paying for it."
        pills={['Demand Charges', 'HVAC Inefficiency', 'No Sub-Meter Data', 'Unmonitored Equipment']}
        accent={meta.accent}
      >
        <OptimisationCalculator />
      </SolutionPain>
      <div id="how-it-works">
        <HowItWorks
          title="From audit to savings <em>in two weeks</em>"
          steps={steps}
          showCTA
          ctaLabel="Book a Free Audit →"
          ctaHref="/contact"
        />
      </div>
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} />
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
      <Testimonials id="testimonials" quotes={testimonials} accent={meta.accent} />
      <CTABanner />
    </>
  );
}

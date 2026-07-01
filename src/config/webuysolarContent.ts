import type { ExplainerCardItem } from '@/components/sections/ExplainerCards';
import type { ComparisonRow } from '@/components/sections/ComparisonTable';
import type { FaqItem } from '@/components/sections/FaqAccordion';

interface ProcessStep {
  label: string;
  description: string;
  tag?: string;
}

interface WebuysolarContent {
  hero: { title: string; subtitle: string };
  auditPrefill: string;
  whyNow: { eyebrow: string; heading: string; intro: string; cards: ExplainerCardItem[] };
  valueLost: { heading: string; intro: string; cards: ExplainerCardItem[]; pullQuote: string };
  comparison: { heading: string; columns: [string, string, string]; rows: ComparisonRow[] };
  howItWorks: { eyebrow: string; title: string; steps: ProcessStep[] };
  audit: { heading: string; subtitle: string; deliverables: string[] };
  faq: { heading: string; items: FaqItem[] };
}

export const WEBUYSOLAR: WebuysolarContent = {
  hero: {
    title: "You own the solar asset.<br /><em>But you're missing the upside.</em>",
    subtitle:
      "Most commercial solar was designed before batteries, wheeling and energy trading were viable — so it captures only a fraction of what's now possible. We will acquire your system at fair market value. It stays exactly where it is, you keep buying its power for well below your utility tariff, and we take over running, optimising and evolving it to unlock the value it was never initially designed to.",
  },

  auditPrefill:
    "I'd like to book a free WeBuySolar audit of my existing solar / battery system.",

  whyNow: {
    eyebrow: 'Why now',
    heading: 'The economics of C&I solar have changed.',
    intro:
      "Commercial solar has been a sound investment for a decade. But three structural shifts have changed what your asset is worth — and who's positioned to capture that value.",
    cards: [
      {
        icon: 'Battery',
        title: 'Battery economics flipped.',
        body: 'C&I battery prices are down ~40% in two years, and the same hardware bought for backup now earns daily through time-of-use arbitrage, peak shaving and solar-consumption optimisation. Systems without batteries leave value on the table; systems using batteries only for backup leave even more.',
      },
      {
        icon: 'Globe',
        title: 'The market liberalised.',
        body: 'Wheeling, multi-site aggregation, licensed traders and the upcoming SAWEM wholesale market (Q3 2026) turn business energy from a passive grid bill into an active, optimisable position. A standalone system is now just one node in a much bigger picture.',
      },
      {
        icon: 'Sliders',
        title: 'Operations became the differentiator.',
        body: "Active battery dispatch, performance benchmarking, energy trading and tariff optimisation are how value is captured now — and they need dedicated expertise that didn't exist in deployable form when most systems were installed.",
      },
    ],
  },

  valueLost: {
    heading: "The cost of running yesterday's system in today's market.",
    intro:
      "Across the C&I solar owners we work with, three patterns recur. None are technology failures — they're failures of operational context.",
    cards: [
      {
        icon: 'TrendingDown',
        title: 'Silent underperformance.',
        body: 'Systems can underperform without obvious symptoms. Inverter clipping, soiling losses and poor inverter configuration compound quietly. Without specialist monitoring and benchmarking, a system producing 78% of its potential looks identical to one producing 92%.',
      },
      {
        icon: 'Award',
        title: 'No one owns the energy strategy.',
        body: 'O&M contracts cover uptime and basic maintenance, and a site manager keeps the lights on — but neither owns the financial performance or the energy strategy, and neither is an energy specialist. Energy this valuable needs to be managed by energy experts.',
      },
      {
        icon: 'Hourglass',
        title: 'Designed for a market that no longer exists.',
        body: 'Many existing systems were likely sized for self-consumption in a world without wheeling, without affordable storage, and without smart optimisation tools. The design assumptions were correct at the time. They are no longer correct. Every month a system operates under outdated assumptions, it forfeits revenue it could be earning.',
      },
    ],
    pullQuote:
      "The investment was right. The question now is who's positioned to operate it for the market that exists.",
  },

  comparison: {
    heading: "Your solar asset hasn't changed. <em>Everything around it has.</em>",
    columns: ['Dimension', 'The old model', 'The new model'],
    rows: [
      {
        dimension: 'Where value is created',
        oldModel: 'The technology brand. Selecting premium hardware was treated as the decisive value lever.',
        newModel: 'Configuration and operation. A well-configured system delivers materially better lifetime savings than the same hardware poorly configured.',
      },
      {
        dimension: 'Supplier relationship',
        oldModel: "Transactional installer. 'You buy from me, I install, the transaction closes.'",
        newModel: 'Energy-as-a-Service (EaaS) provider. Install the system, supply the power, and take responsibility for energy as an ongoing function.',
      },
      {
        dimension: 'System management',
        oldModel: 'Static. Size the system once at purchase; run it as designed for the life of the asset.',
        newModel: 'Dynamic. Continuously responsive to tariffs, load shifts, market signals, and new capabilities as they enter the market.',
      },
      {
        dimension: 'Capital structure',
        oldModel: 'Outright capital purchase. Cash on the balance sheet, depreciation on the books.',
        newModel: 'Zero-capex Power Purchase Agreement (PPA) or lease. Recoup original capital today; access cheaper, more flexible terms.',
      },
      {
        dimension: 'Market integration',
        oldModel: 'Standalone behind-the-meter solar. A single asset operating in isolation from the wider energy market.',
        newModel: 'An integrated energy position. Solar, storage, wheeling, and trading layers operating as one optimised whole.',
      },
    ],
  },

  howItWorks: {
    eyebrow: 'How it works',
    title: 'The path from <em>owned to operated</em>',
    steps: [
      {
        label: 'Free expert audit',
        description: 'On-site inspection: drone scan, string-level review, inverter config audit, opportunity mapping. Written report within 10 business days.',
        tag: 'Free · no obligation',
      },
      {
        label: 'Preliminary offer & valuation',
        description: 'Fair market valuation, indicative PPA or lease, and a forecasted savings model with an optimisation roadmap.',
        tag: 'Indicative',
      },
      {
        label: 'Due diligence',
        description: 'At our cost: financials, asset docs, contracts, operational data.',
        tag: 'At our cost',
      },
      {
        label: 'Final offer & contracting',
        description: 'Binding term sheet, PPA/lease and sale agreement. Either side can step back here, no obligation.',
        tag: 'No obligation',
      },
      {
        label: 'Acquisition & handover',
        description: 'Ownership transfers, the acquisition value is paid out, and we take operational responsibility from day one with monthly reporting. Settlement on the agreed date in the sale agreement.',
        tag: 'Settlement on agreed date',
      },
      {
        label: 'Ongoing optimisation',
        description: 'We operate and upgrade as economics evolve. Each upgrade is justified by its own ROI; none committed upfront.',
        tag: 'ROI-justified',
      },
    ],
  },

  audit: {
    heading: 'Start with the audit. Decide everything else later.',
    subtitle: 'A free, independent, operator-grade audit of your existing system. No cost. No commitment.',
    deliverables: [
      'Inverter configuration & clipping review.',
      'System production review.',
      'Battery dispatch analysis (where applicable).',
      'Tariff structure & electricity bill review.',
      'System valuation quote.',
      'Preliminary PPA/lease commercial offer.',
      'Tailored energy optimisation roadmap.',
    ],
  },

  faq: {
    heading: 'Questions, answered.',
    items: [
      {
        question: 'Do you remove the system, or does it stay where it is?',
        answer: "It stays at your site — we're acquiring a working asset, not removing it. As we operate and optimise it we may upgrade or replace parts of the system over time, but it keeps powering your operations throughout. If you're relocating or closing the site and genuinely need it removed, we'll discuss a removal or buyout separately.",
      },
      {
        question: 'What brands and sizes do you accept?',
        answer: 'We acquire systems built on BloombergNEF Tier 1 equipment — from small commercial arrays up to multi-megawatt systems, with or without battery storage. Condition and configuration are confirmed in the audit.',
      },
      {
        question: 'How do you calculate the valuation?',
        answer: "Fair market value based on the system's condition, production and the savings it can generate under active operation — not an inflated headline buyback funded by a high PPA tariff.",
      },
      {
        question: 'What does it cost me?',
        answer: 'The audit is free. Due diligence is at our cost. You only commit at final contracting, and either side can step back before then.',
      },
      {
        question: "How long until I'm paid?",
        answer: 'On the settlement date agreed in the sale agreement, once contracting and handover are complete.',
      },
      {
        question: 'Is there any obligation after the audit?',
        answer: 'None. The audit and its report are yours to keep, with no obligation to proceed.',
      },
    ],
  },
};

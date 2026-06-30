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
  howItWorks: { eyebrow: string; title: string; subtitle: string; steps: ProcessStep[] };
  audit: { heading: string; subtitle: string; deliverables: string[] };
  faq: { heading: string; items: FaqItem[] };
}

export const WEBUYSOLAR: WebuysolarContent = {
  hero: {
    title: "You own the solar asset.<br />But you're missing <em>the upside.</em>",
    subtitle:
      "Most commercial solar was designed before batteries, wheeling and energy trading existed — so it captures only a fraction of what's now possible. Sell yours to Phoenix at fair market value. It stays exactly where it is, you keep buying its power for well below your utility tariff, and we take over running, optimising and evolving it to unlock the value it was never designed to.",
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
        icon: 'Activity',
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
        icon: 'Activity',
        title: 'Silent underperformance.',
        body: 'Inverter clipping, soiling, module mismatch and suboptimal tilt compound quietly. Without operator-grade monitoring, a system producing 78% of its potential looks identical to one at 92%. The difference is enormous.',
      },
      {
        icon: 'Users',
        title: 'No one owns the solar asset.',
        body: "It's usually run by a site manager whose real job is something else, or by the installer under an uptime-focused O&M contract. Both leave value on the table — for different reasons.",
      },
      {
        icon: 'Clock',
        title: 'Designed for a market that no longer exists.',
        body: 'Systems sized in 2021–22 assumed no wheeling, no affordable storage, no smart optimisation. The assumptions were right then. Every month they run unchanged now, they forfeit revenue.',
      },
    ],
    pullQuote:
      "The investment was right. The question now is who's positioned to operate it for the market that exists.",
  },

  comparison: {
    heading: "Your solar asset hasn't changed. Everything around it has.",
    columns: ['Dimension', 'The old model', 'The new model'],
    rows: [
      {
        dimension: 'Where value is created',
        oldModel: 'The technology brand on the spec sheet',
        newModel: 'Configuration & operation — same hardware, materially better lifetime savings',
      },
      {
        dimension: 'Supplier relationship',
        oldModel: 'Transactional installer ("I install, the deal closes")',
        newModel: 'Energy-as-a-Service provider — we supply the power and own energy as an ongoing function',
      },
      {
        dimension: 'System management',
        oldModel: 'Static — sized once, run as designed',
        newModel: 'Dynamic — responsive to tariffs, load shifts and market signals',
      },
      {
        dimension: 'Capital structure',
        oldModel: 'Outright cash purchase',
        newModel: 'Zero-capex PPA or lease — recoup your capital today',
      },
      {
        dimension: 'Market integration',
        oldModel: 'Standalone behind-the-meter',
        newModel: 'Integrated: solar, storage, wheeling and trading as one optimised whole',
      },
    ],
  },

  howItWorks: {
    eyebrow: 'How it works',
    title: 'Built for the new energy market',
    subtitle:
      "We acquire, operate and continuously optimise existing solar assets — fair-market valuations, no inflated 100% or 110% buybacks. Here's the path from owned to operated.",
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
      'Quantified estimate of unrealised value.',
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
        answer: "It stays on your roof and keeps operating exactly as before — that's the whole point. If you're relocating or closing the site and genuinely need it removed, we'll discuss a removal or buyout separately.",
      },
      {
        question: 'What brands and sizes do you accept?',
        answer: 'All major inverter and module brands, from small commercial arrays up to multi-megawatt systems, with or without battery storage. Condition and configuration are assessed in the audit.',
      },
      {
        question: 'How do you calculate the valuation?',
        answer: "Fair market value based on the system's condition, production and the savings it can generate under active operation — not an inflated headline buyback funded by a high PPA tariff.",
      },
      {
        question: 'PPA, lease or outright sale — which do I get?',
        answer: 'Whichever fits your balance sheet. We structure a fair-market sale with a flexible PPA or lease back; bespoke capex-free arrangements are available.',
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
        question: "What happens to my site manager's involvement?",
        answer: 'We take operational responsibility from day one, with monthly reporting. Your team stops managing something that was never their core job.',
      },
      {
        question: 'Is there any obligation after the audit?',
        answer: 'None. The audit and its report are yours to keep, with no obligation to proceed.',
      },
    ],
  },
};

import type { TabItem, IconName } from '@/components/sections/SolutionTabs';
import type { StrategyKey } from '@/lib/strategy/types';

export interface StrategyDef {
  key: StrategyKey;
  label: string;            // tab label + reveal name
  icon: IconName;
  bestFor: string;
  contactSentence: string;  // pre-fills the contact "Tell us more" box
  tab: {
    iconBg: string;
    title: string;
    body: string;
    bullets: string[];
    bulletsLabel?: string;
    imageBg: string;
    imageEmoji: string;
  };
}

const ICON_BG = 'rgba(227,197,141,0.18)';

export const STRATEGIES: Record<StrategyKey, StrategyDef> = {
  'self-consumption': {
    key: 'self-consumption',
    label: 'Solar Self-Consumption',
    icon: 'Sun',
    bestFor: 'Flat or tiered tariffs — use your own solar',
    contactSentence:
      "I used the Strategy Finder on your C&I Solar & Storage page — my recommended strategy is Solar Self-Consumption (PV, with a battery if I run after dark). I'd like to book a discovery meeting.",
    tab: {
      iconBg: ICON_BG,
      title: 'The simplest way to reduce your electricity costs',
      body: 'The most effective way to lower your electricity bill is to buy less electricity from the grid. Self-consumption is the foundation of every successful energy cost reduction strategy. By reducing the amount of electricity your business purchases from the grid, it delivers immediate savings on its own while creating the platform for more advanced optimisation strategies, such as battery arbitrage and demand shaving, to unlock even greater value.',
      bulletsLabel: 'Ideal for',
      bullets: [
        'Businesses looking to reduce electricity costs.',
        'Operations with high daytime energy use.',
      ],
      imageBg: 'linear-gradient(135deg, rgba(227,197,141,0.15) 0%, rgba(57,87,92,0.20) 100%)',
      imageEmoji: '🔆',
    },
  },
  'battery-arbitrage': {
    key: 'battery-arbitrage',
    label: 'Time-of-Use Optimisation',
    icon: 'Battery',
    bestFor: 'Time-of-Use tariffs — buy low, use high',
    contactSentence:
      "I used the Strategy Finder on your C&I Solar & Storage page — my recommended strategy is Time-of-Use Optimisation. I'd like to book a discovery meeting.",
    tab: {
      iconBg: ICON_BG,
      title: 'Shift your energy use to the lowest-cost hours',
      body: "Battery arbitrage is an energy cost optimisation strategy that takes advantage of Time-of-Use electricity tariffs. The battery charges when electricity is at its lowest cost — during off-peak periods or from surplus solar generation — and discharges during expensive peak tariff periods. By shifting when your business purchases and uses electricity, you reduce your reliance on the most expensive energy and significantly lower your electricity bill. This strategy can be implemented as a standalone battery system on sites without solar, or added to an existing grid-tied or solar PV installation to unlock additional savings beyond self-consumption. It's the natural next step for businesses looking to optimise their energy costs and maximise the value of their existing energy assets.",
      bulletsLabel: 'Ideal for',
      bullets: [
        'Businesses on Time-of-Use tariffs.',
        'Existing solar PV systems looking to unlock additional savings.',
        'Businesses seeking to optimise electricity costs that have limited space for Solar PV.',
        'Operations with significant evening or early-morning energy demand.',
      ],
      imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(227,197,141,0.15) 100%)',
      imageEmoji: '⚡',
    },
  },
  'demand-shaving': {
    key: 'demand-shaving',
    label: 'Demand Shaving',
    icon: 'Activity',
    bestFor: 'Bills with demand / kVA charges',
    contactSentence:
      "I used the Strategy Finder on your C&I Solar & Storage page — my recommended strategy is Demand Shaving. I'd like to book a discovery meeting.",
    tab: {
      iconBg: ICON_BG,
      title: 'Eliminate costly demand spikes',
      body: 'Many commercial electricity tariffs include demand charges based on your highest power draw during the month. A single short-lived spike can significantly increase your monthly bill. Battery systems respond instantly by supplying power during these peaks, reducing your maximum demand and lowering one of the most expensive components of your electricity bill.',
      bulletsLabel: 'Ideal for',
      bullets: [
        'Businesses with steep demand charges.',
        'Facilities operating heavy equipment, pumps or compressors.',
      ],
      imageBg: 'linear-gradient(135deg, rgba(112,157,169,0.20) 0%, rgba(227,197,141,0.15) 100%)',
      imageEmoji: '📉',
    },
  },
  'backup-resilience': {
    key: 'backup-resilience',
    label: 'Backup & Resilience',
    icon: 'Zap',
    bestFor: 'Uptime-critical sites; loadshedding hurts',
    contactSentence:
      "I used the Strategy Finder on your C&I Solar & Storage page — my priority is reliable backup / resilience. I'd like to book a discovery meeting.",
    tab: {
      iconBg: ICON_BG,
      title: 'Reduce your reliance on expensive diesel backup',
      body: 'Traditional backup power comes at a price — fuel, maintenance, servicing, noise, emissions and the ongoing cost of keeping generators ready for the next outage. Solar and battery storage provide automatic, uninterrupted backup power for critical operations, reducing generator runtime, lowering operating costs and improving business resilience during outages and load shedding.',
      bulletsLabel: 'Ideal for',
      bullets: [
        'Businesses where downtime is costly.',
        'Manufacturing and industrial facilities.',
        'Food processing and cold storage.',
        'Healthcare, logistics and data-driven operations.',
        'Sites looking to reduce diesel consumption and generator operating costs.',
      ],
      imageBg: 'linear-gradient(135deg, rgba(227,197,141,0.18) 0%, rgba(57,87,92,0.22) 100%)',
      imageEmoji: '🛡️',
    },
  },
  'off-grid': {
    key: 'off-grid',
    label: 'Off-Grid',
    icon: 'Globe',
    bestFor: 'Weak/no grid; full independence',
    contactSentence:
      "I used the Strategy Finder on your C&I Solar & Storage page — my priority is energy independence (off-grid). I'd like to book a discovery meeting.",
    tab: {
      iconBg: ICON_BG,
      title: 'Complete energy independence',
      body: 'An off-grid energy system combines solar generation, battery storage and often backup generation (e.g., diesel generators) to operate without a utility connection.',
      bulletsLabel: 'Ideal for',
      bullets: [
        'Mines, farms, lodges and remote industrial sites.',
        'Businesses with limited or unreliable grid access.',
        'Businesses seeking complete energy independence.',
      ],
      imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.22) 0%, rgba(112,157,169,0.18) 100%)',
      imageEmoji: '🔌',
    },
  },
};

export const STRATEGY_ORDER: StrategyKey[] = [
  'self-consumption',
  'battery-arbitrage',
  'demand-shaving',
  'backup-resilience',
  'off-grid',
];

/** Build the Solution-section tabs from the strategies, in display order. */
export function strategyTabs(): TabItem[] {
  return STRATEGY_ORDER.map((k) => {
    const s = STRATEGIES[k];
    return {
      key: `strategy-${s.key}`,
      label: s.label,
      icon: s.icon,
      ...s.tab,
      chartKey: s.key,
      cta: { label: 'Book a Discovery Meeting', href: `/contact?intent=client&strategy=${s.key}` },
    };
  });
}

/** Contact "Tell us more" prefill text for a strategy key, or undefined if unknown. */
export function contactMessageForStrategy(key: string): string | undefined {
  return (STRATEGIES as Record<string, StrategyDef>)[key]?.contactSentence;
}

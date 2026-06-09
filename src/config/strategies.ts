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
      "I used the Strategy Finder on your C&I Solar & Storage page — my recommended strategy is Solar Self-Consumption (PV, with a battery if I run after dark). I'd like a free assessment.",
    tab: {
      iconBg: ICON_BG,
      title: 'Use the Solar You Generate',
      body: 'Tier 1 panels sized to your load offset the power you use as you make it. Run mostly in daylight and a grid-tied PV system is enough; run after dark or around the clock and we add a battery so you still use your own solar at night.',
      bullets: [
        'Tier 1 monocrystalline panels (JA, Longi, Jinko)',
        'PV-only for daytime loads — lowest entry cost',
        'Add a battery (hybrid) to self-consume after dark',
        'Hybrid inverters — battery-ready from day one',
      ],
      imageBg: 'linear-gradient(135deg, rgba(227,197,141,0.15) 0%, rgba(57,87,92,0.20) 100%)',
      imageEmoji: '🔆',
    },
  },
  'battery-arbitrage': {
    key: 'battery-arbitrage',
    label: 'Battery Arbitrage',
    icon: 'Battery',
    bestFor: 'Time-of-Use tariffs — buy low, use high',
    contactSentence:
      "I used the Strategy Finder on your C&I Solar & Storage page — my recommended strategy is Battery Arbitrage. I'd like a free assessment.",
    tab: {
      iconBg: ICON_BG,
      title: 'BESS — Buy Low, Use High',
      body: 'On a Time-of-Use tariff, energy costs far more in peak windows. A Battery Energy Storage System stores cheap solar and off-peak power, then discharges when Eskom charges the most.',
      bullets: [
        'LFP chemistry for 6 000+ cycle life',
        'Automated daily charge/discharge scheduling',
        'Targets peak / standard / off-peak rate spreads',
        'Sub-20ms UPS failover during loadshedding',
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
      "I used the Strategy Finder on your C&I Solar & Storage page — my recommended strategy is Demand Shaving. I'd like a free assessment.",
    tab: {
      iconBg: ICON_BG,
      title: 'Peak-Shaving — Cut Your kVA Charge',
      body: 'Demand (kVA) charges are billed on your highest power draw and are often the biggest line on a C&I bill. A battery discharges during short demand spikes to cap your notified maximum demand.',
      bullets: [
        'Automatically caps demand peaks in real time',
        'Cuts the R/kVA charge without changing operations',
        'Stacks with arbitrage on the same battery',
        'Detailed demand profiling during the assessment',
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
      "I used the Strategy Finder on your C&I Solar & Storage page — my priority is reliable backup / resilience. I'd like a free assessment.",
    tab: {
      iconBg: ICON_BG,
      title: 'Keep Running Through Loadshedding',
      body: 'A grid-tied hybrid sized for resilience keeps your critical loads live through outages, with seamless failover — and trims your bill from solar self-consumption as a bonus.',
      bullets: [
        'Sub-20ms UPS failover — no disruption',
        'Battery sized to your critical loads and outage length',
        'Solar recharges the battery between outages',
        'Optional generator integration for extended events',
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
      "I used the Strategy Finder on your C&I Solar & Storage page — my priority is energy independence (off-grid). I'd like a free assessment.",
    tab: {
      iconBg: ICON_BG,
      title: 'Full Energy Independence',
      body: 'For remote sites or businesses wanting off the grid entirely, solar plus a large battery (and an optional generator) delivers full independence from Eskom tariffs and outages.',
      bullets: [
        'Sized for 24/7 autonomy from solar + storage',
        'Optional generator for worst-case backup',
        'Immune to tariff hikes and loadshedding',
        'Feasibility and sizing confirmed on site',
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
      cta: { label: 'Get a free assessment', href: `/contact?intent=client&strategy=${s.key}` },
    };
  });
}

/** Contact "Tell us more" prefill text for a strategy key, or undefined if unknown. */
export function contactMessageForStrategy(key: string): string | undefined {
  return (STRATEGIES as Record<string, StrategyDef>)[key]?.contactSentence;
}

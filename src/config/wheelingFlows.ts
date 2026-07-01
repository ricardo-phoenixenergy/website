export type FlowIcon = 'sun' | 'globe' | 'building';

export interface FlowNode {
  icon: FlowIcon;
  label: string;
  desc: string;          // one-line description of the node
  emphasis?: boolean;    // highlights the "Your site" node
}

export interface MoneyStep {
  from: string;
  to: string;
  label: string;
}

export interface WheelingFlow {
  energy: FlowNode[];   // vertical icon-node chain
  moneyTitle: string;   // kicker above the money rows
  money: MoneyStep[];   // dashed money arrows (1–3 rows)
  footer: string;       // footer pill — Phoenix's role / the key distinction
  summary: string;      // aria-label describing the whole flow
}

export const DIRECT_FLOW: WheelingFlow = {
  energy: [
    { icon: 'sun', label: 'IPP', desc: 'Independent renewable generator produces the power.' },
    { icon: 'globe', label: 'Eskom grid', desc: "Wheeled to you across Eskom's transmission grid." },
    { icon: 'building', label: 'Your site', desc: 'Uses the power at a fixed tariff below your Eskom rate.', emphasis: true },
  ],
  moneyTitle: 'How you pay',
  money: [
    { from: 'You', to: 'IPP', label: 'Fixed PPA tariff, below your Eskom rate' },
    { from: 'You', to: 'Eskom', label: 'Network / use-of-system charges' },
  ],
  footer: 'Managed by Phoenix — trading, settlement & compliance.',
  summary:
    'Energy flows from the IPP through the Eskom grid to your site. You pay the IPP a fixed PPA tariff below your Eskom rate, plus Eskom network charges.',
};

export const VIRTUAL_FLOW: WheelingFlow = {
  energy: [
    { icon: 'sun', label: 'IPP', desc: 'Independent renewable generator produces the power.' },
    { icon: 'globe', label: 'The grid', desc: 'Wheeled across the grid, virtually allocated to your meter.' },
    { icon: 'building', label: 'Your site', desc: 'Uses the power at a lower effective rate.', emphasis: true },
  ],
  moneyTitle: "How you're credited",
  money: [
    { from: 'You', to: 'Municipality', label: 'Pay your municipal bill as normal' },
    { from: 'Municipality', to: 'IPP', label: 'Wheeled generation credited to the IPP' },
    { from: 'IPP', to: 'You', label: 'PPA withheld, balance refunded to you' },
  ],
  footer: 'No change to your existing municipal connection.',
  summary:
    'Energy flows from the IPP through the grid and is virtually allocated to your site. You pay your municipal bill as normal, the municipality credits the IPP, and the IPP withholds its PPA amount and refunds the balance to you.',
};

export const MICRO_FLOW: WheelingFlow = {
  energy: [
    { icon: 'sun', label: 'Your ~1 MW plant', desc: 'A dedicated plant you own generates the power.' },
    { icon: 'globe', label: 'The grid', desc: 'Wheeled directly to your point of consumption.' },
    { icon: 'building', label: 'Your site', desc: 'Powered by your own asset — you keep the full value.', emphasis: true },
  ],
  moneyTitle: 'How you pay',
  money: [
    { from: 'You', to: 'Plant', label: 'Own the asset — buy or finance' },
    { from: 'You', to: 'Grid', label: 'Network / wheeling charges only' },
  ],
  footer: 'You own the plant — capture the full generation value.',
  summary:
    'You own a dedicated ~1 MW plant whose energy is wheeled through the grid to your site. You fund the plant and pay only network and wheeling charges — no third-party PPA.',
};

export type FlowIcon = 'solar' | 'pylon' | 'building';

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
  energyTitle: string;  // kicker above the energy nodes
  energy: FlowNode[];   // vertical icon-node chain
  moneyTitle: string;   // kicker above the money rows
  money: MoneyStep[];   // dashed money arrows (1–3 rows)
  summary: string;      // aria-label describing the whole flow
}

export const DIRECT_FLOW: WheelingFlow = {
  energyTitle: 'How it works',
  energy: [
    { icon: 'solar', label: 'Independent Power Producer (IPP)', desc: 'Generates renewable electricity at an off-site solar or wind facility.' },
    { icon: 'pylon', label: 'Eskom Grid', desc: 'The electricity is injected into the Eskom transmission network and virtually allocated to your business.' },
    { icon: 'building', label: 'Your Business', desc: 'You continue consuming electricity through your existing Eskom connection while receiving wheeling credits on your Eskom bill.', emphasis: true },
  ],
  moneyTitle: 'How billing works',
  money: [
    { from: 'You', to: 'IPP', label: 'Pay the agreed Power Purchase Agreement (PPA) tariff for the renewable electricity supplied.' },
    { from: 'You', to: 'Eskom', label: 'Pay your monthly Eskom bill, including network (use-of-system) charges, less the wheeling credits applied to your account.' },
  ],
  summary:
    'Renewable electricity from an independent power producer is injected into the Eskom grid and virtually allocated to your business. You pay the IPP the agreed PPA tariff, and pay your monthly Eskom bill including network use-of-system charges, less the wheeling credits applied to your account.',
};

export const VIRTUAL_FLOW: WheelingFlow = {
  energyTitle: 'How it works',
  energy: [
    { icon: 'solar', label: 'IPP', desc: 'Independent renewable generator produces the power.' },
    { icon: 'pylon', label: 'The grid', desc: 'Fed into the grid and virtually allocated to your account.' },
    { icon: 'building', label: 'Your site', desc: 'Credited on your municipal bill at a lower effective rate.', emphasis: true },
  ],
  moneyTitle: "How you're credited",
  money: [
    { from: 'You', to: 'Municipality', label: 'Pay your municipal bill as normal' },
    { from: 'Municipality', to: 'IPP', label: 'Wheeled generation credited to the IPP' },
    { from: 'IPP', to: 'You', label: 'PPA withheld, balance refunded to you' },
  ],
  summary:
    'Renewable energy from the IPP is fed into the grid and virtually allocated to your account. You pay your municipal bill as normal, the municipality credits the IPP, and the IPP withholds its PPA amount and refunds the balance to you.',
};

export const MICRO_FLOW: WheelingFlow = {
  energyTitle: 'How it works',
  energy: [
    { icon: 'solar', label: 'Your ~1 MW plant', desc: 'A dedicated plant you own generates the power.' },
    { icon: 'pylon', label: 'The grid', desc: 'Fed into the grid and virtually allocated to your supply.' },
    { icon: 'building', label: 'Your site', desc: 'Credited on your bill — you keep the full generation value.', emphasis: true },
  ],
  moneyTitle: 'How you pay',
  money: [
    { from: 'You', to: 'Plant', label: 'Own the asset — buy or finance' },
    { from: 'You', to: 'Grid', label: 'Network / wheeling charges only' },
  ],
  summary:
    'You own a dedicated ~1 MW plant whose output is fed into the grid and virtually allocated to your supply. You fund the plant and pay only network and wheeling charges — no third-party PPA.',
};

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
  stepped?: boolean;    // number the money rows as sequential steps
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
    { icon: 'solar', label: 'Independent Power Producer (IPP)', desc: 'Generates renewable electricity at an off-site solar or wind facility.' },
    { icon: 'pylon', label: 'Municipal Grid', desc: 'The energy is fed into the grid and virtually allocated to your municipal account under an approved virtual wheeling framework.' },
    { icon: 'building', label: 'Your Business', desc: 'You continue to receive electricity through your existing municipal supply. You will not see wheeling charges or credits on your municipal bill; these are settled separately through the wheeling/PPA arrangement.', emphasis: true },
  ],
  moneyTitle: "How you're credited",
  stepped: true,
  money: [
    { from: 'You', to: 'Municipality', label: 'You pay your municipal electricity bill as normal.' },
    { from: 'Municipality', to: 'IPP', label: 'The wheeled energy allocation is credited through the municipal settlement process to the IPP.' },
    { from: 'IPP', to: 'You', label: 'The IPP applies its PPA tariff and refunds or nets the remaining credit value back to you.' },
  ],
  summary:
    'Renewable electricity from an independent power producer is fed into the grid and virtually allocated to your municipal account. You pay your municipal bill as normal; the wheeled allocation is credited to the IPP through municipal settlement; the IPP applies its PPA tariff and refunds or nets the remaining credit back to you. Wheeling charges and credits are settled separately, not shown on your municipal bill.',
};

export const MICRO_FLOW: WheelingFlow = {
  energyTitle: 'How it works',
  energy: [
    { icon: 'solar', label: 'Your ~1 MW plant', desc: 'A dedicated renewable generation asset that you own produces electricity.' },
    { icon: 'pylon', label: 'The grid', desc: 'The energy is exported into the electricity grid and allocated to your business through the approved wheeling framework.' },
    { icon: 'building', label: 'Your site', desc: 'You receive bill credits reflecting the value of the energy generated. You retain the full economic benefit of the asset’s output.', emphasis: true },
  ],
  moneyTitle: 'How you pay',
  money: [
    { from: 'You', to: 'Plant', label: 'Own the asset — either through purchase or financing.' },
    { from: 'You', to: 'Grid', label: 'Pay network and wheeling (generator use-of-system) charges for transporting electricity through the grid.' },
  ],
  summary:
    'You own a dedicated ~1 MW renewable plant whose output is exported into the grid and allocated to your business under the approved wheeling framework. You receive bill credits for the energy generated and retain the full economic benefit; you fund the plant and pay only network and wheeling (generator use-of-system) charges.',
};

// Inputs the wizard collects.
export type Goal = 'cut-bill' | 'backup' | 'independence';
export type EnergyRate = 'flat' | 'tou' | 'block' | 'unknown';
export type DemandCharge = 'yes' | 'no' | 'unknown';
export type Usage = 'daytime' | 'around-clock' | 'evenings';

// The five strategies (also the Solution tab keys).
export type StrategyKey =
  | 'grid-tied-solar'
  | 'battery-arbitrage'
  | 'demand-shaving'
  | 'backup-resilience'
  | 'off-grid';

export type Topology = 'solar-only' | 'hybrid' | 'off-grid';

export interface StrategyAnswers {
  goal: Goal;
  energyRate?: EnergyRate;     // present only when goal === 'cut-bill'
  demandCharge?: DemandCharge; // present only when goal === 'cut-bill'
  usage: Usage;
}

export interface StrategyResult {
  primary: StrategyKey;
  secondary: StrategyKey[];
  topology: Topology;
  caveated: boolean;     // true for the "don't know" hybrid default
  tabAnchor: string;     // e.g. 'strategy-battery-arbitrage'
}

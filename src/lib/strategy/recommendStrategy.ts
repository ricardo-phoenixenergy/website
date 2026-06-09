import type { StrategyAnswers, StrategyResult, StrategyKey, Topology, Usage } from './types';

function deriveTopology(primary: StrategyKey, usage: Usage | undefined): Topology {
  if (primary === 'off-grid') return 'off-grid';
  if (primary === 'self-consumption') return usage === 'daytime' ? 'solar-only' : 'hybrid';
  // battery-arbitrage, demand-shaving, backup-resilience all require storage
  return 'hybrid';
}

export function recommendStrategy(answers: StrategyAnswers): StrategyResult {
  const { goal, energyRate = 'unknown', demandCharge = 'unknown', usage } = answers;

  let primary: StrategyKey;
  let secondary: StrategyKey[] = [];
  let caveated = false;

  if (goal === 'backup') {
    primary = 'backup-resilience';
  } else if (goal === 'independence') {
    primary = 'off-grid';
  } else {
    // goal === 'cut-bill' — pick the biggest lever first
    if (demandCharge === 'yes') {
      primary = 'demand-shaving';
      if (energyRate === 'tou') secondary = ['battery-arbitrage'];
    } else if (energyRate === 'tou') {
      primary = 'battery-arbitrage';
    } else if (energyRate === 'block' || energyRate === 'flat') {
      primary = 'self-consumption';
    } else {
      // energy rate unknown and no known demand charge → flexible hybrid default
      primary = 'self-consumption';
      caveated = true;
    }
  }

  return {
    primary,
    secondary,
    topology: deriveTopology(primary, usage),
    caveated,
    tabAnchor: `strategy-${primary}`,
  };
}

import type { StrategyAnswers, StrategyResult, Usage } from './types';

const USAGE_PHRASE: Record<Usage, string> = {
  daytime: 'mostly during the day',
  'around-clock': 'around the clock',
  evenings: 'mostly in the evenings',
};

export function buildRationale(answers: StrategyAnswers, result: StrategyResult): string {
  // usage is only collected on the cut-bill path, where these branches use it.
  const usage = answers.usage ? USAGE_PHRASE[answers.usage] : '';

  switch (result.primary) {
    case 'demand-shaving':
      return result.secondary.includes('battery-arbitrage')
        ? `You're on Time-of-Use and pay demand charges, running ${usage}. Solar covers your daytime load; a battery flattens the demand spikes driving your kVA charge and shifts energy into the expensive peak hours.`
        : `You pay demand charges, running ${usage}. Solar covers your daytime load while a battery flattens the demand spikes that drive your kVA charge — often the biggest line on the bill.`;
    case 'battery-arbitrage':
      return `Your Time-of-Use tariff makes power expensive at peak. Store cheap solar by day and use it when the rates bite, running ${usage}.`;
    case 'self-consumption': {
      if (result.caveated) {
        return `Based on what you've told us, a solar self-consumption system is the flexible starting point — a free assessment will confirm whether you need storage.`;
      }
      const base =
        answers.energyRate === 'block'
          ? 'On a block tariff every extra unit costs more, so self-generating shaves off your priciest units first'
          : `Solar offsets the power you use ${usage}`;
      return result.topology === 'hybrid'
        ? `${base}, and a battery stores the daytime surplus so you can keep using your own solar after dark.`
        : `${base}, with the grid staying as your simple backup.`;
    }
    case 'backup-resilience':
      return `Uptime is your priority. A grid-tied hybrid keeps you running through loadshedding and outages — and trims your bill from solar self-consumption as a bonus.`;
    case 'off-grid':
      return `You want full energy independence. Solar plus a large battery (and an optional generator) can take you off the grid for good.`;
    default:
      return '';
  }
}

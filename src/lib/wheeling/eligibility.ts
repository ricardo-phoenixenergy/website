import { supplyPointById } from '@/config/wheelingSupplyPoints';
import type { WheelingAnswers, WheelingOutcome } from './types';

export function evaluateWheeling(answers: WheelingAnswers): WheelingOutcome {
  const sp = answers.supplyPointId ? supplyPointById(answers.supplyPointId) : undefined;

  // Unknown / missing / unsupported supply point → not available.
  if (!sp || sp.model === 'none') {
    return { status: 'not-available' };
  }

  // Municipality that supports virtual wheeling → Virtual (no ToU gate).
  if (sp.model === 'virtual') {
    return { status: 'virtual', supplyPointLabel: sp.label };
  }

  // Eskom direct → qualifies for Direct Wheeling only on a Time-of-Use tariff.
  return answers.tou === 'yes'
    ? { status: 'direct' }
    : { status: 'not-eligible-tou' };
}

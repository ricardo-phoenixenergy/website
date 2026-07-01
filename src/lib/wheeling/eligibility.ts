import { supplyPointById } from '@/config/wheelingSupplyPoints';
import type { WheelingAnswers, WheelingOutcome } from './types';

export function evaluateWheeling(answers: WheelingAnswers): WheelingOutcome {
  const sp = answers.supplyPointId ? supplyPointById(answers.supplyPointId) : undefined;

  // Unsupported / unknown supplier → not available (Time-of-Use is not asked).
  if (!sp || sp.model === 'none') {
    return { status: 'not-available' };
  }

  // Eskom-direct and municipal supplies both require a Time-of-Use tariff.
  if (answers.tou !== 'yes') {
    return { status: 'not-eligible-tou' };
  }

  // Eskom-direct → Direct or Micro-Wheeling; municipality → Virtual Wheeling.
  if (sp.model === 'direct') {
    return { status: 'eskom' };
  }
  return { status: 'virtual', supplyPointLabel: sp.label };
}

import { supplyPointById } from '@/config/wheelingSupplyPoints';
import type { WheelingAnswers, WheelingOutcome } from './types';

export function evaluateWheeling(answers: WheelingAnswers): WheelingOutcome {
  // ToU gate: 'no' short-circuits regardless of supply point.
  if (answers.tou === 'no') {
    return { status: 'not-eligible-tou', verifyTariff: false };
  }

  const verifyTariff = answers.tou === 'unsure';
  const sp = answers.supplyPointId ? supplyPointById(answers.supplyPointId) : undefined;

  if (!sp || sp.model === 'none') {
    return { status: 'not-available', verifyTariff };
  }
  if (sp.model === 'direct') {
    return { status: 'direct', verifyTariff };
  }
  return { status: 'virtual', supplyPointLabel: sp.label, verifyTariff };
}

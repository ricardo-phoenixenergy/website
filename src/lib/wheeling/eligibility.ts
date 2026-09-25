import { supplyPointById } from '@/config/wheelingSupplyPoints';
import type { WheelingAnswers, WheelingOutcome } from './types';

export function evaluateWheeling(answers: WheelingAnswers): WheelingOutcome {
  const sp = answers.supplyPointId ? supplyPointById(answers.supplyPointId) : undefined;

  // A supplier the business has confirmed can't wheel (none is listed yet).
  if (sp?.model === 'none') {
    return { status: 'not-available' };
  }

  // Supplier not listed, not known, or not given: the check can't say no, only
  // that a bill will tell (Time-of-Use is not asked).
  if (!sp || sp.model === 'unlisted') {
    return { status: 'needs-check' };
  }

  // Eskom-direct and municipal supplies both require a Time-of-Use tariff. Only
  // a "No" rules it out: "I'm not sure" (or no answer) is for the bill to settle.
  if (answers.tou === 'no') {
    return { status: 'not-eligible-tou' };
  }
  if (answers.tou !== 'yes') {
    return { status: 'needs-check' };
  }

  // Eskom-direct → Direct or Micro-Wheeling; municipality → Virtual Wheeling.
  if (sp.model === 'direct') {
    return { status: 'eskom' };
  }
  return { status: 'virtual', supplyPointLabel: sp.label };
}

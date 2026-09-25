export type WheelingTou = 'yes' | 'no' | 'unsure';

/**
 * - `eskom`, `virtual`: eligible (Direct or Micro-Wheeling; Virtual Wheeling).
 * - `needs-check`: the answers can't settle it (supplier not listed, or not sure
 *   of the tariff); one electricity bill can.
 * - `not-eligible-tou`: an eligible supplier, but not on a Time-of-Use tariff.
 * - `not-available`: a supplier the business has confirmed can't wheel.
 */
export type WheelingStatus = 'eskom' | 'virtual' | 'needs-check' | 'not-eligible-tou' | 'not-available';

export interface WheelingAnswers {
  supplyPointId: string;
  tou?: WheelingTou; // only asked for Eskom-direct and metro supplies
}

export interface WheelingOutcome {
  status: WheelingStatus;
  supplyPointLabel?: string; // the metro's name, for 'virtual'
}

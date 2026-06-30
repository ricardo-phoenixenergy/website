export type WheelingTou = 'yes' | 'no' | 'unsure';

export type WheelingStatus = 'direct' | 'virtual' | 'not-available' | 'not-eligible-tou';

export interface WheelingAnswers {
  tou: WheelingTou;
  supplyPointId?: string; // absent when tou === 'no' (gate short-circuits)
}

export interface WheelingOutcome {
  status: WheelingStatus;
  supplyPointLabel?: string; // present for 'virtual' — the metro name
  verifyTariff: boolean;     // true when tou === 'unsure'
}

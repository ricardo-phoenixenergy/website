export type WheelingTou = 'yes' | 'no' | 'unsure';

export type WheelingStatus = 'direct' | 'virtual' | 'not-available' | 'not-eligible-tou';

export interface WheelingAnswers {
  supplyPointId: string;
  tou?: WheelingTou; // only collected/relevant when the supply point is Eskom (direct)
}

export interface WheelingOutcome {
  status: WheelingStatus;
  supplyPointLabel?: string; // present for 'virtual' — the metro name
}

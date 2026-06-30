export type WheelingModel = 'direct' | 'virtual' | 'none';

export interface WheelingSupplyPoint {
  id: string;
  label: string;
  model: WheelingModel;
}

export const WHEELING_SUPPLY_POINTS: WheelingSupplyPoint[] = [
  { id: 'eskom',      label: 'Eskom (direct)',                model: 'direct'  },
  { id: 'joburg',     label: 'City of Johannesburg',          model: 'virtual' },
  { id: 'cape-town',  label: 'City of Cape Town',             model: 'virtual' },
  { id: 'tshwane',    label: 'City of Tshwane',               model: 'virtual' },
  { id: 'ekurhuleni', label: 'City of Ekurhuleni',            model: 'virtual' },
  { id: 'ethekwini',  label: 'eThekwini (Durban)',            model: 'virtual' },
  { id: 'nmb',        label: 'Nelson Mandela Bay (Gqeberha)', model: 'virtual' },
  { id: 'other',      label: "My area isn't listed / other",  model: 'none'    },
];

export function supplyPointById(id: string): WheelingSupplyPoint | undefined {
  return WHEELING_SUPPLY_POINTS.find((s) => s.id === id);
}

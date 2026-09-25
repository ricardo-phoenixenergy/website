/**
 * - `direct`: Eskom direct supply (Direct or Micro-Wheeling).
 * - `virtual`: a metro that supports virtual wheeling.
 * - `unlisted`: the visitor's supplier isn't listed, or they don't know who bills
 *   them (a landlord, say). The check can't tell, so a bill has to.
 * - `none`: a supplier the business has confirmed can't wheel. None is listed
 *   yet, so the "Not available" result only appears once one is.
 */
export type WheelingModel = 'direct' | 'virtual' | 'unlisted' | 'none';

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
  { id: 'other',      label: "My supplier isn't listed, or I'm not sure", model: 'unlisted' },
];

export function supplyPointById(id: string): WheelingSupplyPoint | undefined {
  return WHEELING_SUPPLY_POINTS.find((s) => s.id === id);
}

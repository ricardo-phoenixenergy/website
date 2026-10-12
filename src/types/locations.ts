// src/types/locations.ts
// The shapes behind the location pages' own sections (src/config/locations.ts).

/** Where a fact came from. */
export interface FactSource {
  label: string;
  url: string;
}

/** One electricity supplier's card in "Your municipality, your numbers". */
export interface MunicipalityCard {
  /** The supplier, e.g. "City Power". */
  name: string;
  /** Where it supplies, e.g. "Most of Johannesburg". */
  servesWhere: string;
  /** How a business tariff is built, in two to four sentences. */
  tariff: string;
  /** Registering solar with this supplier. Each item ends with a full stop. */
  solar: string[];
  /** What changed recently, when something has. */
  recent?: string;
  /** A Phoenix article on the topic, once it is published. */
  readMore?: { label: string; href: string };
  sources: FactSource[];
  /** When the facts were checked, YYYY-MM-DD. */
  asOf: string;
}

/** A group of towns in "Areas we work in". */
export interface PlaceGroup {
  /** The municipality, e.g. "Ekurhuleni". */
  name: string;
  /** Towns and industrial areas. */
  places: string[];
}

/** The card that hands a reader to the other location page. */
export interface SisterLink {
  heading: string;
  body: string;
  label: string;
  href: string;
}

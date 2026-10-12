// src/types/locations.ts
// The shapes behind the location pages' own sections (src/config/locations.ts).

/** Where a fact came from. */
export interface FactSource {
  label: string;
  url: string;
}

/** One electricity supplier's row in the municipality accordion. */
export interface MunicipalityCard {
  /** The row's anchor, e.g. "city-power": /…/gauteng#city-power opens it. */
  id: string;
  /** The supplier, e.g. "City Power". */
  name: string;
  /** Where it supplies, e.g. "Most of Johannesburg". */
  servesWhere: string;
  /** One short fact for the closed row's chip, e.g. "Up 8.63% on average from 1 July 2026". */
  keyFact: string;
  /** What Phoenix does with this supplier, one sentence. Shown first when the row opens. */
  weHandle: string;
  /** How a business tariff is built, in two to four sentences. */
  tariff: string;
  /** Registering solar with this supplier, in order. Each item ends with a full stop. */
  solar: string[];
  /** What changed recently, when something has. */
  recent?: string;
  /** A Phoenix article on the topic, once it is published. */
  readMore?: { label: string; href: string };
  sources: FactSource[];
  /** When the facts were checked, YYYY-MM-DD. */
  asOf: string;
}

/** The box beside the accordion that helps a reader find their supplier. */
export interface SupplierHelp {
  text: string;
  linkLabel: string;
  href: string;
}

/** A group of towns in "Areas we work in". */
export interface PlaceGroup {
  /** The municipality, e.g. "Ekurhuleni". */
  name: string;
  /** Towns and industrial areas. */
  places: string[];
}

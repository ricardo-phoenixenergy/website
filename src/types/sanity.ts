import type { SolutionVertical } from './solutions';
import type { EquipmentComponent, FinancingMethod } from '@/lib/projectOptions';

/* ─── Shared primitives ─────────────────────────────────────────────────────── */

export interface SanitySlug {
  current: string;
}

export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: {
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio: number };
  };
}

export interface SanityImage {
  _type: 'image';
  asset: SanityImageAsset;
  alt?: string;
  /** A gallery photo's caption, shown under it in the photo viewer. */
  caption?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export type PortableTextBlock = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};

/* ─── Project ────────────────────────────────────────────────────────────────── */
// GROQ returns null, not undefined, for a field that isn't set, so code reads
// these with ?? and ?. and never compares them with undefined.

/** What a project's results rest on. Unset is treated as projected. */
export type ResultsBasis = 'projected' | 'measured';

export type ProjectStatus = 'completed' | 'in-progress' | 'planned';

/**
 * A project as the cards show it. The queries (src/lib/queries.ts) include the
 * client's name only while "Show client name" is on with a consent date set,
 * and never the project value, so whatever a card holds may show.
 */
export interface ProjectCard {
  _id: string;
  title: string;
  slug: SanitySlug;
  vertical: SolutionVertical;
  location?: string;
  /** Present only with the client's recorded consent. */
  clientName?: string;
  /** "Show rand amounts": with it off, discloseProject() drops every rand amount (src/lib/projectDisclosure.ts). */
  showRandAmounts?: boolean;
  heroImage?: SanityImage;
  status?: ProjectStatus;
  /** System facts (kWp, kWh, inverter), without rand amounts unless the switch is on. */
  metrics?: ProjectMetric[];
  /** Outcomes (payback, bill reduction), without rand amounts unless the switch is on; the first two lead the card. */
  results?: ProjectResult[];
  /** Projected (financial model) unless an editor marks the results measured. */
  resultsBasis?: ResultsBasis;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

/** A results figure, with an optional note on its period and baseline. */
export interface ProjectResult extends ProjectMetric {
  note?: string;
}

/** One main component, as installed. */
export interface ProjectEquipment {
  component: EquipmentComponent;
  brand: string;
  model?: string;
  /** A whole number, at least 1. */
  quantity?: number;
}

/** A project on /projects. */
export interface ProjectPreview extends ProjectCard {
  featured?: boolean;
  featuredOrder?: number;
  summary?: string;
}

/** A project page's data. */
export interface Project extends ProjectCard {
  /** When the project was added to the CMS; the Article's datePublished. */
  _createdAt: string;
  /** Its last change; the Article's dateModified and the sitemap's lastModified. */
  _updatedAt: string;
  /** The page heading (the H1, page title and sharing title); the title when empty. */
  headline?: string;
  /** What the site is, for example "Logistics warehouse". */
  siteType?: string;
  /** Free text, for example "Q3 2027": the target of a planned or in-progress project, or a completed one's date until commissionedOn is set. */
  completionDate?: string;
  /** ISO date (YYYY-MM-DD) of commissioning: shown as the month and year, and the order newest first. */
  commissionedOn?: string;
  financing?: FinancingMethod[];
  /** Present only while "Show rand amounts" is on. */
  projectValue?: string;
  gallery?: SanityImage[];
  summary?: string;
  challenge?: PortableTextBlock[];
  challengeHeadline?: string;
  solution?: PortableTextBlock[];
  solutionHeadline?: string;
  outcome?: PortableTextBlock[];
  outcomeHeadline?: string;
  /** ISO date (YYYY-MM-DD) of the model or the end of the measured period. */
  resultsAsOf?: string;
  /** Replaces the default note under the results. */
  resultsAssumptions?: string;
  /** "How we calculated this": the inputs behind the figures, without rand amounts unless the switch is on. */
  resultsInputs?: ProjectMetric[];
  equipment?: ProjectEquipment[];
  /** Weeks from starting on site to commissioning: a whole number, 1 to 104. */
  installationWeeks?: number;
  /** Each approval or certificate, one per line. */
  approvals?: string[];
  /** The meta description; the summary when empty. */
  seoDescription?: string;
  /** Other projects in the same service, newest first. */
  related?: ProjectCard[];
  /** Up to two from other services, shown only when `related` is empty. */
  otherProjects?: ProjectCard[];
}

/* ─── Blog ───────────────────────────────────────────────────────────────────── */

export type BlogCategory =
  | 'Industry Insights'
  | 'Project Spotlight'
  | 'Company News'
  | 'Press Release';

export interface AuthorPreview {
  name: string;
  slug: SanitySlug;
  photo?: SanityImage;
}

export interface Author extends AuthorPreview {
  _id: string;
  role: string;
  bio?: string;
  linkedin?: string;
}

export interface BlogPostCard {
  _id: string;
  title: string;
  slug: SanitySlug;
  category: BlogCategory;
  tags: string[];
  excerpt: string;
  readTime: number;
  publishedAt: string;
  heroImage: SanityImage;
  featured: boolean;
  author: AuthorPreview;
}

export interface BlogPost extends BlogPostCard {
  updatedAt?: string;
  body: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: SanityImage;
  canonicalUrl?: string;
  author: Author;
  related: BlogPostCard[];
}

/* ─── Team ───────────────────────────────────────────────────────────────────── */

export type TeamCategory = 'founders' | 'business' | 'technical';

export interface TeamMember {
  _id: string;
  name: string;
  slug: SanitySlug;
  photo?: SanityImage;
  role: string;
  category: TeamCategory;
  archetype?: string;
  bio?: string;
  linkedin?: string;
  order: number;
  active: boolean;
}

/* ─── Timeline ───────────────────────────────────────────────────────────────── */

export interface MilestoneTimeline {
  _id:      string;
  date:     string;   // display label — "2019", "March 2026", "2030"
  title:    string;
  isFuture: boolean;  // true = vision/aspirational; false = historical
  order:    number;
  active:   boolean;
}

/* ─── Company Stats ──────────────────────────────────────────────────────────── */

export interface CompanyStat {
  value: string;   // headline figure, e.g. "40+" or "10 MWp"
  label: string;   // short description beneath the value
  // Claims register fields, all optional. Only asOf renders ("As at …").
  definition?: string | null;  // what it counts and its scope
  basis?: string | null;       // how it was worked out
  source?: string | null;      // where the evidence is
  asOf?: string | null;        // YYYY-MM-DD, the date the figure was true
}

/* ─── Partner / Investor ─────────────────────────────────────────────────────── */

export interface Partner {
  _id:      string;
  name:     string;
  category: 'investors' | 'partners' | 'media';
  website?: string;
  order:    number;
  active:   boolean;
  logo?: {
    asset: SanityImageAsset;
    alt?: string;
  };
}

/* ─── How It Works ───────────────────────────────────────────────────────────── */

export interface HowItWorksStep {
  label: string;
  description: string;
  tag?: string;
}

export interface HowItWorksContent {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: HowItWorksStep[];
  showCTA?: boolean;
  // The CTA's label and link come from src/config/ctas.ts, not Sanity.
}

/* ─── Hero Images ───────────────────────────────────────────────────────────── */

export interface HeroImageAsset {
  url: string;
  lqip?: string;
}

export type HeroImages = Partial<Record<SolutionVertical, HeroImageAsset | null>>;

/* ─── Energy Prices ──────────────────────────────────────────────────────────── */

export interface EnergyPricesContent {
  dieselPricePerL?: number;
  petrol93PricePerL?: number;
  gridPricePerKwh?: number;
  solarPricePerKwh?: number;
  effectiveDate?: string;
  sourceLabel?: string;
}

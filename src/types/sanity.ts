import type { SolutionVertical } from './solutions';

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
 * A project as the cards show it. There's no client name or project value: the
 * queries leave them out until the CMS can record the client's consent
 * (src/lib/projectDisclosure.ts).
 */
export interface ProjectCard {
  _id: string;
  title: string;
  slug: SanitySlug;
  vertical: SolutionVertical;
  location?: string;
  heroImage?: SanityImage;
  status?: ProjectStatus;
  /** System facts (kWp, kWh, inverter), without rand amounts. */
  metrics?: ProjectMetric[];
  /** Outcomes (payback, bill reduction), without rand amounts; the first two lead the card. */
  results?: ProjectMetric[];
  /** Projected (financial model) unless an editor marks the results measured. */
  resultsBasis?: ResultsBasis;
}

export interface ProjectMetric {
  label: string;
  value: string;
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
  /** Free text, for example "Q2 2026": the completion date, or the target of a planned or in-progress project. */
  completionDate?: string;
  gallery?: SanityImage[];
  summary?: string;
  challenge?: PortableTextBlock[];
  solution?: PortableTextBlock[];
  outcome?: PortableTextBlock[];
  /** ISO date (YYYY-MM-DD) of the model or the end of the measured period. */
  resultsAsOf?: string;
  /** Replaces the default note under the results. */
  resultsAssumptions?: string;
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

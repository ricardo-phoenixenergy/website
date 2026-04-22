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

export interface ProjectCard {
  _id: string;
  title: string;
  slug: SanitySlug;
  vertical: SolutionVertical;
  location: string;
  systemSize?: string;
  heroImage?: SanityImage;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectPreview extends ProjectCard {
  featured: boolean;
  clientName?: string;
  completionDate?: string;
  projectValue?: string;
  status?: 'completed' | 'in-progress' | 'planned';
  metrics?: ProjectMetric[];
  summary?: string;
}

export interface Project extends ProjectCard {
  featured: boolean;
  clientName: string;
  completionDate: string;
  projectValue: string;
  status: 'completed' | 'in-progress' | 'planned';
  gallery: SanityImage[];
  summary: string;
  challenge: PortableTextBlock[];
  solution: PortableTextBlock[];
  outcome: PortableTextBlock[];
  metrics: ProjectMetric[];   // 4 items — stats strip
  results: ProjectMetric[];   // 4 items — results strip
  related: ProjectCard[];
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

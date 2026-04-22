// src/lib/blogUtils.ts
export const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  'Industry Insights':  { bg: 'rgba(57,87,92,0.10)',    color: '#39575C' },
  'Project Spotlight':  { bg: 'rgba(227,197,141,0.10)', color: '#6b4e10' },
  'Company News':       { bg: 'rgba(169,214,203,0.10)', color: '#1a5a48' },
  'Press Release':      { bg: 'rgba(217,124,118,0.10)', color: '#7a2a20' },
};

export function categoryStyle(cat: string): { bg: string; color: string } {
  return CATEGORY_STYLES[cat] ?? { bg: 'rgba(57,87,92,0.10)', color: '#39575C' };
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

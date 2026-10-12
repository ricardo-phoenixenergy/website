// FeaturedProjects picks its loader from its props, and hides itself when there is nothing to show.
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { byArea, byVertical, featured } = vi.hoisted(() => ({ byArea: vi.fn(), byVertical: vi.fn(), featured: vi.fn() }));
vi.mock('@/lib/projectData', () => ({
  getProjectsByArea: byArea,
  getProjectsByVertical: byVertical,
  getFeaturedProjects: featured,
}));

import { FeaturedProjects } from './FeaturedProjects';

beforeEach(() => {
  byArea.mockReset();
  byVertical.mockReset();
  featured.mockReset();
});

describe('FeaturedProjects', () => {
  it('keeps the solution page\'s behaviour without an area', async () => {
    byVertical.mockResolvedValueOnce([]);
    await FeaturedProjects({ vertical: 'ci-solar-storage' });
    expect(byVertical).toHaveBeenCalledWith('ci-solar-storage');
    expect(byArea).not.toHaveBeenCalled();
  });
});

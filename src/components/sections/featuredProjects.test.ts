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
  it('on a location page, loads only the area\'s projects', async () => {
    byArea.mockResolvedValueOnce([]);
    await FeaturedProjects({ vertical: 'ci-solar-storage', area: 'gauteng' });
    expect(byArea).toHaveBeenCalledWith('ci-solar-storage', 'gauteng');
    expect(byVertical).not.toHaveBeenCalled();
  });

  it('renders nothing when the area has no tagged projects', async () => {
    byArea.mockResolvedValueOnce([]);
    expect(await FeaturedProjects({ vertical: 'ci-solar-storage', area: 'pretoria-centurion' })).toBeNull();
  });

  it('renders nothing when the CMS cannot be reached', async () => {
    byArea.mockRejectedValueOnce(new Error('down'));
    expect(await FeaturedProjects({ vertical: 'ci-solar-storage', area: 'gauteng' })).toBeNull();
  });

  it('keeps the solution page\'s behaviour without an area', async () => {
    byVertical.mockResolvedValueOnce([]);
    await FeaturedProjects({ vertical: 'ci-solar-storage' });
    expect(byVertical).toHaveBeenCalledWith('ci-solar-storage');
    expect(byArea).not.toHaveBeenCalled();
  });
});

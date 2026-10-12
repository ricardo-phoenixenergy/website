import { beforeEach, describe, expect, it, vi } from 'vitest';

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));
vi.mock('@/lib/sanity.server', () => ({ sanityServerClient: { fetch: fetchMock } }));

import { getPartnerLogo } from './partnerData';
import { PARTNER_BY_NAME_QUERY } from './queries';

beforeEach(() => fetchMock.mockReset());

describe('getPartnerLogo', () => {
  it('returns the logo with its size and an alt naming the partner', async () => {
    fetchMock.mockResolvedValueOnce({ name: 'WEG', logo: { asset: { url: 'https://cdn.sanity.io/x.png', metadata: { dimensions: { width: 512, height: 512 } } } } });
    expect(await getPartnerLogo('WEG')).toEqual({ url: 'https://cdn.sanity.io/x.png', alt: 'WEG logo', width: 512, height: 512 });
    expect(fetchMock).toHaveBeenCalledWith(PARTNER_BY_NAME_QUERY, { name: 'WEG' });
  });

  it('carries the logo’s blur preview when the CMS has one', async () => {
    fetchMock.mockResolvedValueOnce({ name: 'WEG', logo: { asset: { url: 'https://cdn.sanity.io/x.png', metadata: { lqip: 'data:image/jpeg;base64,AAAA', dimensions: { width: 64, height: 32 } } } } });
    expect(await getPartnerLogo('WEG')).toEqual({ url: 'https://cdn.sanity.io/x.png', alt: 'WEG logo', width: 64, height: 32, blur: 'data:image/jpeg;base64,AAAA' });
  });

  it('returns null when the partner or its logo is missing, or the CMS fails', async () => {
    fetchMock.mockResolvedValueOnce(null);
    expect(await getPartnerLogo('WEG')).toBeNull();
    fetchMock.mockResolvedValueOnce({ name: 'WEG', logo: null });
    expect(await getPartnerLogo('WEG')).toBeNull();
    fetchMock.mockRejectedValueOnce(new Error('down'));
    expect(await getPartnerLogo('WEG')).toBeNull();
  });
});

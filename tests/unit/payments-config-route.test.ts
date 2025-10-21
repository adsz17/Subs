import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn()
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {}
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    paymentsConfig: {
      findUnique: vi.fn(),
      upsert: vi.fn()
    }
  }
}));

import { GET, PUT } from '@/app/api/admin/payments-config/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

const mockGetServerSession = vi.mocked(getServerSession);
const findUniqueMock = vi.mocked(prisma.paymentsConfig.findUnique);
const upsertMock = vi.mocked(prisma.paymentsConfig.upsert);

describe('payments config admin route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 403 for non admin users on GET', async () => {
    mockGetServerSession.mockResolvedValueOnce({ user: { role: 'USER' } } as any);

    const response = await GET();

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it('allows admins to fetch the config', async () => {
    const config = { id: 1, network: 'testnet' };
    mockGetServerSession.mockResolvedValueOnce({ user: { role: 'ADMIN' } } as any);
    findUniqueMock.mockResolvedValueOnce(config);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(config);
    expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('returns 403 for non admin users on PUT', async () => {
    mockGetServerSession.mockResolvedValueOnce({ user: { role: 'USER' } } as any);
    const request = new Request('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({ network: 'testnet' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await PUT(request);

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it('allows admins to update the config', async () => {
    const requestData = {
      network: 'mainnet',
      wallet: 'wallet',
      qrUrl: 'https://example.com/qr',
      provider: 'manual'
    };

    mockGetServerSession.mockResolvedValueOnce({ user: { role: 'ADMIN' } } as any);
    upsertMock.mockResolvedValueOnce({ id: 1, ...requestData });

    const request = new Request('http://localhost', {
      method: 'PUT',
      body: JSON.stringify(requestData),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await PUT(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 1, ...requestData });
    expect(upsertMock).toHaveBeenCalledWith({
      where: { id: 1 },
      update: requestData,
      create: {
        id: 1,
        network: requestData.network,
        wallet: requestData.wallet,
        qrUrl: requestData.qrUrl,
        provider: requestData.provider || 'manual'
      }
    });
  });
});

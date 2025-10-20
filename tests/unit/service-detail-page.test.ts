import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PurchaseStatus } from '@prisma/client';

const { serviceFindUnique, purchaseItemFindFirst } = vi.hoisted(() => ({
  serviceFindUnique: vi.fn(),
  purchaseItemFindFirst: vi.fn()
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn()
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  redirect: vi.fn()
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    service: { findUnique: serviceFindUnique },
    purchaseItem: { findFirst: purchaseItemFindFirst }
  }
}));

import ServiceDetailPage from '@/app/servicios/[id]/page';
import { getServerSession } from 'next-auth';

describe('ServiceDetailPage purchase gating', () => {
  beforeEach(() => {
    serviceFindUnique.mockReset();
    purchaseItemFindFirst.mockReset();
    vi.mocked(getServerSession).mockReset();
  });

  it('shows review message when the purchase is pending', async () => {
    serviceFindUnique.mockResolvedValue({
      id: 'service-1',
      name: 'Servicio Premium',
      content: 'Contenido privado',
      description: null
    });

    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1' }
    } as any);

    purchaseItemFindFirst.mockImplementation(async ({ where }) => {
      if (where?.purchase?.status === PurchaseStatus.APPROVED) {
        return null;
      }

      if (where?.purchase?.status === PurchaseStatus.PENDING) {
        return { id: 'pending-item' } as any;
      }

      return null;
    });

    const element = await ServiceDetailPage({ params: { id: 'service-1' } });
    const markup = renderToStaticMarkup(element);

    expect(markup).toContain('Tu compra está en revisión. Te avisaremos cuando sea aprobada.');
    expect(markup).not.toContain('Contenido privado');
  });

  it('renders the content when the purchase is approved', async () => {
    serviceFindUnique.mockResolvedValue({
      id: 'service-1',
      name: 'Servicio Premium',
      content: 'Contenido privado',
      description: null
    });

    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1' }
    } as any);

    purchaseItemFindFirst.mockImplementation(async ({ where }) => {
      if (where?.purchase?.status === PurchaseStatus.APPROVED) {
        return { id: 'approved-item' } as any;
      }

      return null;
    });

    const element = await ServiceDetailPage({ params: { id: 'service-1' } });
    const markup = renderToStaticMarkup(element);

    expect(markup).toContain('Contenido privado');
  });
});

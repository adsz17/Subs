import { describe, it, expect } from 'vitest';
import { buildDuplicatePayload, type ServiceWithPrices } from '@/app/admin/servicios/payloads';

describe('buildDuplicatePayload', () => {
  const baseService: ServiceWithPrices = {
    id: 'svc_123',
    name: 'Servicio con contenido',
    slug: 'servicio-contenido',
    description: 'Descripción del servicio',
    content: '<p>Contenido enriquecido</p>',
    imageUrl: 'https://example.com/image.png',
    isActive: true,
    prices: [],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  };

  it('preserves the content when duplicating a service', () => {
    const payload = buildDuplicatePayload(baseService, 'copy');

    expect(payload.content).toBe(baseService.content);
    expect(payload.name).toBe('Servicio con contenido (copia)');
    expect(payload.slug).toBe('servicio-contenido-copy');
    expect(payload.isActive).toBe(true);
  });
});

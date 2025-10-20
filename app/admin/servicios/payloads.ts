import type { Service, Price } from '@prisma/client';

export type ServiceWithPrices = Service & { prices: Price[] };

export const toPayload = (
  service: ServiceWithPrices,
  overrides?: Partial<Pick<Service, 'isActive'>>,
) => ({
  name: service.name,
  slug: service.slug,
  description: service.description ?? undefined,
  content: service.content ?? undefined,
  imageUrl: service.imageUrl ?? undefined,
  isActive: overrides?.isActive ?? service.isActive,
});

export const buildDuplicatePayload = (
  service: ServiceWithPrices,
  slugSuffix: string,
) => ({
  ...toPayload(service),
  name: `${service.name} (copia)`,
  slug: `${service.slug}-${slugSuffix}`,
});

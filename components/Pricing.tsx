import { prisma } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import { PricingGrid, PricingService } from '@/components/PricingGrid';

export async function Pricing() {
  noStore();
  let services: PricingService[] = [];
  try {
    const data = await prisma.service.findMany({
      where: { isActive: true },
      include: {
        prices: { where: { isCurrent: true }, take: 1, orderBy: { activeFrom: 'desc' } },
      },
      orderBy: { name: 'asc' },
    });
    services = data.map((service) => {
      const price = service.prices[0] || null;
      return {
        id: service.id,
        name: service.name,
        description: service.description,
        priceCents: price ? price.amountCents : null,
        currency: price ? price.currency : null,
      };
    });
  } catch (error) {
    services = [];
  }

  return (
    <section
      id="precios"
      className="mx-auto max-w-7xl px-4 pt-[var(--section-pt)] pb-[var(--section-pb)]"
    >
      <h2 className="mb-12 text-center text-3xl font-serif">Precios</h2>
      <PricingGrid services={services} />
    </section>
  );
}

import { prisma } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import { PricingGrid, PricingService } from '@/components/PricingGrid';

type RawPrice = {
  id: string;
  amountCents: number;
  currency: string;
  [key: string]: unknown;
};

function resolveBillingPeriod(price: RawPrice): PricingService['prices'][number]['period'] {
  const candidateKeys = [
    'billingPeriod',
    'billingFrequency',
    'interval',
    'period',
    'periodicity',
    'frequency',
  ];

  for (const key of candidateKeys) {
    const rawValue = price[key];
    if (typeof rawValue !== 'string') continue;
    const value = rawValue.toLowerCase();
    if (value.includes('month') || value.includes('mensual') || value.includes('mes')) {
      return 'monthly';
    }
    if (value.includes('year') || value.includes('annual') || value.includes('anual') || value.includes('año') || value.includes('anio')) {
      return 'annual';
    }
  }

  return null;
}

export async function Pricing() {
  noStore();
  let services: PricingService[] = [];
  try {
    const data = await prisma.service.findMany({
      where: { isActive: true },
      include: {
        prices: { where: { isCurrent: true }, orderBy: { activeFrom: 'desc' } },
      },
      orderBy: { name: 'asc' },
    });
    services = data.map((service) => {
      const recommended =
        'recommended' in service ? Boolean((service as { recommended?: boolean }).recommended) : false;
      const prices = service.prices.map((price) => ({
        id: price.id,
        amountCents: price.amountCents,
        currency: price.currency,
        period: resolveBillingPeriod(price as RawPrice),
      }));
      return {
        id: service.id,
        name: service.name,
        description: service.description,
        recommended,
        prices,
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

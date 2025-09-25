import { prisma } from '@/lib/db';
import { ServiceCard } from './ServiceCard';

export const revalidate = 0;

export default async function ServiciosPage() {
  const servicios = await prisma.service.findMany({
    where: { isActive: true },
    include: { prices: { where: { isCurrent: true }, take: 1, orderBy: { activeFrom: 'desc' } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Servicios</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {servicios.map((service) => {
          const price = service.prices[0] || null;
          return (
            <ServiceCard
              key={service.id}
              id={service.id}
              name={service.name}
              description={service.description}
              priceCents={price ? price.amountCents : null}
              currency={price ? price.currency : null}
            />
          );
        })}
        {servicios.length === 0 && <p>No hay servicios disponibles en este momento.</p>}
      </div>
    </div>
  );
}

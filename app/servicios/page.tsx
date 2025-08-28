import { prisma } from '@/lib/db';
import { ServiceCard } from './ServiceCard';

export const revalidate = 0;

export default async function ServiciosPage() {
  const servicios = await prisma.service.findMany({
    where: { isActive: true },
    include: { prices: { where: { isCurrent: true }, take: 1 } },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Servicios</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {servicios.map((s) => {
          const p = s.prices[0];
          const price = p ? `$${(p.amountCents / 100).toFixed(2)}` : 'Sin precio';
          return (
            <ServiceCard
              key={s.id}
              id={s.id}
              name={s.name}
              description={s.description}
              price={price}
            />
          );
        })}
      </div>
    </div>
  );
}

import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Tabs } from '@/components/admin/Tabs';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatMoney } from '@/lib/format';

export default async function ServicioDetail({ params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
    include: { prices: true }
  });
  if (!service) notFound();

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Servicios', href: '/admin/servicios' }, { label: service.name }]} />
      <Tabs
        tabs={[
          {
            label: 'Info',
            content: (
              <div className="space-y-4">
                <h1 className="text-2xl font-semibold">{service.name}</h1>
                <StatusBadge active={service.isActive} />
                {service.description && (
                  <p className="text-sm text-gray-700">{service.description}</p>
                )}
              </div>
            )
          },
          {
            label: 'Precios',
            content: (
              <ul className="space-y-2">
                {service.prices.map((p) => (
                  <li key={p.id} className="flex justify-between rounded-md bg-white p-2 shadow">
                    <span>{formatMoney(p.amountCents, p.currency)}</span>
                  </li>
                ))}
                {service.prices.length === 0 && (
                  <p className="text-sm text-gray-500">Sin precios</p>
                )}
              </ul>
            )
          },
          {
            label: 'Historial',
            content: <p className="text-sm text-gray-500">Sin historial</p>
          }
        ]}
      />
    </div>
  );
}

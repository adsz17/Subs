import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { ServiciosTable } from './ServiciosTable';

export const revalidate = 0;

export default async function ServiciosPage() {
  const services = await prisma.service.findMany({
    include: { prices: true },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Servicios' }]} />
      <ServiciosTable data={services} />
    </div>
  );
}

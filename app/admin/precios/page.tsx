import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { PreciosTable } from './PreciosTable';

export const revalidate = 0;

export default async function PreciosPage() {
  const prices = await prisma.price.findMany({ include: { service: true } });

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Precios' }]} />
      <PreciosTable data={prices} />
    </div>
  );
}

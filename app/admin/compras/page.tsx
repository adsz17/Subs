import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { ComprasTable } from './ComprasTable';

export const revalidate = 0;

export default async function ComprasPage() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div>
      <Breadcrumbs
        items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Compras' }]}
      />
      <ComprasTable data={purchases} />
    </div>
  );
}

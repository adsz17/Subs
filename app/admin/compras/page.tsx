import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { ComprasTable } from './ComprasTable';

export const revalidate = 0;

export default async function ComprasPage() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <div className="flex flex-col gap-2">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Compras' }]} />
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Compras</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gestiona las solicitudes de pago y actualiza su estado desde un solo lugar.</p>
        </div>
      </section>
      <ComprasTable data={purchases} />
    </div>
  );
}

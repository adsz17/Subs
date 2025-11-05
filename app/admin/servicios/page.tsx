import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ServiciosTable } from './ServiciosTable';

export const revalidate = 0;

export default async function ServiciosPage() {
  const services = await prisma.service.findMany({
    include: { prices: true },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Servicios' }]} />
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Servicios</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Administra el catálogo, actualiza visibilidad y duplica fichas fácilmente.</p>
          </div>
          <Button asChild>
            <Link href="/admin/servicios/nuevo">Nuevo servicio</Link>
          </Button>
        </div>
      </section>
      <ServiciosTable data={services} />
    </div>
  );
}

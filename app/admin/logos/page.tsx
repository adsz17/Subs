import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const revalidate = 0;

export default async function LogosPage() {
  const logos = await prisma.logo.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Logos' }]} />
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Logos</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Gestiona las marcas disponibles para tu portafolio y material comercial.</p>
          </div>
          <Button asChild>
            <Link href="/admin/logos/nuevo">Nuevo logo</Link>
          </Button>
        </div>
      </section>

      <Card className="border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <CardHeader className="flex flex-col gap-2 border-b border-white/10 pb-6 dark:border-slate-800/60">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Colección de logos</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">Organiza las identidades visuales de clientes y aliados.</p>
        </CardHeader>
        <CardContent className="pt-6">
          {logos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300/60 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No hay logos cargados todavía.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
              {logos.map((logo) => (
                <Link
                  key={logo.id}
                  href={`/admin/logos/${logo.id}`}
                  className="group flex h-24 flex-col items-center justify-center gap-3 rounded-3xl border border-white/20 bg-white/70 p-4 text-center shadow transition hover:-translate-y-1 hover:border-blue-200/60 hover:shadow-lg dark:border-slate-800/60 dark:bg-slate-950/60"
                >
                  <Image src={logo.imageUrl} alt="Logo" width={160} height={40} className="h-10 w-auto object-contain" />
                  <Badge className="bg-blue-500/90 text-white opacity-0 transition group-hover:opacity-100">Editar</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

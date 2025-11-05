import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const revalidate = 0;

export default async function ProyectosPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Proyectos' }]} />
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Proyectos</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Presenta tus casos de éxito y mantén al día tu portafolio.</p>
          </div>
          <Button asChild>
            <Link href="/admin/proyectos/nuevo">Nuevo proyecto</Link>
          </Button>
        </div>
      </section>

      <Card className="border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <CardHeader className="flex flex-col gap-2 border-b border-white/10 pb-6 dark:border-slate-800/60">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Últimos proyectos</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">Explora y edita rápidamente tus piezas destacadas.</p>
        </CardHeader>
        <CardContent className="pt-6">
          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300/60 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No hay proyectos registrados todavía.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/proyectos/${project.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow hover:-translate-y-1 hover:border-blue-200/60 hover:shadow-lg transition dark:border-slate-800/60 dark:bg-slate-950/60"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-900/30">
                    {project.imageUrl ? (
                      <Image src={project.imageUrl} alt={project.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-slate-400">Sin imagen</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                      <Badge className="bg-blue-500/90 text-white">Editar</Badge>
                    </div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Actualizado {project.createdAt.toISOString().slice(0, 10)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

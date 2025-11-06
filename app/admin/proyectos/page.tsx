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
      <section className="glass-panel p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Proyectos' }]} />
            <h1 className="text-2xl font-semibold text-ink">Proyectos</h1>
            <p className="text-sm text-muted-ink">Presenta tus casos de éxito y mantén al día tu portafolio.</p>
          </div>
          <Button asChild>
            <Link href="/admin/proyectos/nuevo">Nuevo proyecto</Link>
          </Button>
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-2 border-b border-[hsl(var(--color-muted-ink)/0.18)] pb-6">
          <CardTitle className="text-xl font-semibold text-ink">Últimos proyectos</CardTitle>
          <p className="text-sm text-muted-ink">Explora y edita rápidamente tus piezas destacadas.</p>
        </CardHeader>
        <CardContent className="pt-6">
          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[hsl(var(--color-muted-ink)/0.25)] bg-[hsl(var(--color-surface)/0.65)] p-10 text-center text-sm text-muted-ink">
              No hay proyectos registrados todavía.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/proyectos/${project.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[hsl(var(--color-muted-ink)/0.18)] bg-[hsl(var(--color-surface)/0.78)] shadow-soft transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="relative h-40 overflow-hidden bg-[hsl(var(--color-ink)/0.08)]">
                    {project.imageUrl ? (
                      <Image src={project.imageUrl} alt={project.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-muted-ink">Sin imagen</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-ink">{project.title}</h3>
                      <Badge className="bg-primary text-primary-foreground">Editar</Badge>
                    </div>
                    <p className="text-xs uppercase tracking-wide text-muted-ink">
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

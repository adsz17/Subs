import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const revalidate = 0;

export default async function MensajesPage() {
  const mensajes = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <div className="flex flex-col gap-2">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Mensajes' }]} />
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Mensajes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Consulta los leads entrantes a través del formulario de contacto.</p>
        </div>
      </section>

      <Card className="border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <CardHeader className="flex items-center justify-between border-b border-white/10 pb-6 dark:border-slate-800/60">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Bandeja de entrada</CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">Mensajes recibidos desde el sitio.</p>
          </div>
          <Badge className="bg-blue-500/90 text-white">{mensajes.length}</Badge>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {mensajes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300/60 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No hay mensajes registrados.
            </div>
          ) : (
            <ul className="space-y-4">
              {mensajes.map((mensaje) => (
                <li key={mensaje.id} className="rounded-3xl border border-white/20 bg-white/70 p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/60">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {mensaje.name} <span className="text-xs text-slate-400">({mensaje.email})</span>
                    </p>
                    <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {mensaje.createdAt.toISOString().slice(0, 16).replace('T', ' ')}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-200">{mensaje.message}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const revalidate = 0;

const STATUS_LABELS: Record<string, { label: string; badgeClass: string; description: string }> = {
  PENDING: {
    label: 'En revisión',
    badgeClass: 'bg-amber-100 text-amber-700',
    description: 'Estamos validando tu pago. Te notificaremos por correo apenas se confirme.',
  },
  APPROVED: {
    label: 'Completado',
    badgeClass: 'bg-green-100 text-green-700',
    description: 'La compra fue aprobada y los accesos están activos.',
  },
  REJECTED: {
    label: 'Rechazado',
    badgeClass: 'bg-red-100 text-red-700',
    description: 'El pago fue rechazado. Revisa el comprobante o contacta a soporte.',
  },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeStyle: 'short' }).format(date);
}

export default async function ComprasPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?next=/compras');
  }
  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { service: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-10 bg-slate-50 pb-16">
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white">
        <div className="container space-y-4 py-12">
          <Badge className="bg-white/20 text-white">Historial</Badge>
          <h1 className="text-4xl font-semibold tracking-tight">Mis compras</h1>
          <p className="max-w-2xl text-blue-100">
            Consulta el estado de tus órdenes, descarga comprobantes y vuelve a los servicios asociados en un solo lugar.
          </p>
        </div>
      </section>

      <div className="container space-y-6">
        {purchases.length === 0 ? (
          <Card className="border-dashed border-slate-200 bg-white">
            <CardContent className="py-12 text-center text-sm text-slate-500">
              Aún no registras compras. Explora el catálogo de servicios para comenzar.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {purchases.map(purchase => {
              const statusConfig = STATUS_LABELS[purchase.status] ?? STATUS_LABELS.PENDING;
              const subtotal = purchase.items.reduce((acc, item) => acc + item.unitPriceCents * item.quantity, 0) / 100;
              return (
                <Card key={purchase.id} className="border border-blue-100">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl text-slate-900">Orden #{purchase.id.slice(0, 8)}</CardTitle>
                      <Badge className={statusConfig.badgeClass}>{statusConfig.label}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">Realizada el {formatDate(purchase.createdAt)}</p>
                    <p className="text-sm text-slate-600">{statusConfig.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-lg border border-blue-50 bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-wide text-blue-500">Servicios incluidos</p>
                      <ul className="mt-2 space-y-2">
                        {purchase.items.map(item => (
                          <li key={item.id} className="flex items-start justify-between gap-4 text-sm text-slate-600">
                            <div>
                              <Link href={`/servicios/${item.serviceId}`} className="font-medium text-blue-700 hover:underline">
                                {item.service.name}
                              </Link>
                              <p className="text-xs text-slate-500">Cantidad: {item.quantity}</p>
                            </div>
                            <span className="whitespace-nowrap font-medium text-slate-900">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: item.currency }).format(
                                (item.unitPriceCents * item.quantity) / 100
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                      <span className="text-slate-500">Total abonado</span>
                      <span className="text-lg font-semibold text-slate-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: purchase.items[0]?.currency ?? 'USD' }).format(subtotal)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild size="sm">
                        <Link href={`/servicios/${purchase.items[0]?.serviceId ?? ''}`}>Volver al servicio</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/api/orders/${purchase.id}/receipt`} download>
                          Descargar comprobante
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

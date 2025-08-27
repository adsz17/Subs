import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export default async function CambiarPrecio({ params }: { params: { serviceId: string } }) {
  const s = await prisma.service.findUnique({ where: { id: params.serviceId }, include: { prices: { where: { isCurrent: true } } } });
  if (!s) return notFound();
  const current = s.prices[0];
  const serviceId = s.id;

  async function change(formData: FormData) {
    'use server';
    const currency = String(formData.get('currency') || 'USD');
    const amount = Number(formData.get('amount') || 0);
    const now = new Date();

    const prev = await prisma.price.findFirst({ where: { serviceId, isCurrent: true } });
    if (prev) {
      await prisma.price.update({ where: { id: prev.id }, data: { isCurrent: false, activeTo: now } });
    }
    await prisma.price.create({
      data: {
        serviceId,
        currency,
        amountCents: Math.round(amount * 100),
        activeFrom: now,
        isCurrent: true
      }
    });
    await prisma.auditLog.create({
      data: { action: 'CHANGE_PRICE', entity: 'Service', entityId: serviceId, diff: { from: prev?.amountCents ?? null, to: Math.round(amount*100) } as any }
    });
    redirect('/admin/precios');
  }

  return (
    <form action={change} className="max-w-sm space-y-3 bg-white p-4 text-black">
      <h1 className="text-xl font-bold">Cambiar precio - {s.name}</h1>
      <p>Actual: {current ? `${current.currency} ${(current.amountCents/100).toFixed(2)}` : 'No definido'}</p>
      <input className="border p-2 w-full" name="currency" defaultValue={current?.currency || 'USD'} />
      <input className="border p-2 w-full" name="amount" type="number" step="0.01" placeholder="Nuevo precio" />
      <button className="btn" type="submit">Guardar</button>
    </form>
  );
}

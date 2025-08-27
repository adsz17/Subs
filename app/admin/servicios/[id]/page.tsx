import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export default async function EditServicio({ params }: { params: { id: string } }) {
  const s = await prisma.service.findUnique({ where: { id: params.id }, include: { prices: { where: { isCurrent: true } } } });
  if (!s) return notFound();
  const current = s.prices[0];
  const serviceId = s.id;

  async function update(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '');
    const description = String(formData.get('description') || '');
    const imageUrl = String(formData.get('imageUrl') || '');
    const isActive = formData.get('isActive') === 'on';
    const currency = String(formData.get('currency') || 'USD');
    const amount = Number(formData.get('amount') || 0);
    await prisma.service.update({ where: { id: serviceId }, data: { name, description, imageUrl, isActive } });
    const now = new Date();
    const prev = await prisma.price.findFirst({ where: { serviceId, isCurrent: true } });
    if (amount > 0 && (prev?.amountCents !== Math.round(amount * 100) || prev?.currency !== currency)) {
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
        data: {
          action: 'CHANGE_PRICE',
          entity: 'Service',
          entityId: serviceId,
          diff: { from: prev?.amountCents ?? null, to: Math.round(amount * 100) } as any
        }
      });
    }
    redirect('/admin/servicios');
  }

  return (
    <form action={update} className="max-w-lg space-y-3 bg-white p-4 text-black">
      <h1 className="text-xl font-bold">Editar servicio</h1>
      <input className="border p-2 w-full" name="name" defaultValue={s.name} />
      <textarea className="border p-2 w-full" name="description" defaultValue={s.description || ''} />
      <input className="border p-2 w-full" name="imageUrl" defaultValue={s.imageUrl || ''} placeholder="URL de la imagen" />
      <div className="flex gap-2">
        <input className="border p-2 w-full" name="currency" defaultValue={current?.currency || 'USD'} />
        <input className="border p-2 w-full" name="amount" type="number" step="0.01" defaultValue={current ? (current.amountCents / 100).toString() : ''} />
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked={s.isActive} /> Activo</label>
      <button className="btn" type="submit">Guardar</button>
    </form>
  );
}

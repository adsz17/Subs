import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export default async function EditServicio({ params }: { params: { id: string } }) {
  const s = await prisma.service.findUnique({ where: { id: params.id } });
  if (!s) return notFound();

  async function update(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '');
    const description = String(formData.get('description') || '');
    const isActive = formData.get('isActive') === 'on';
    await prisma.service.update({ where: { id: s.id }, data: { name, description, isActive } });
    redirect('/admin/servicios');
  }

  return (
    <form action={update} className="max-w-lg space-y-3">
      <h1 className="text-xl font-bold">Editar servicio</h1>
      <input className="border p-2 w-full" name="name" defaultValue={s.name} />
      <textarea className="border p-2 w-full" name="description" defaultValue={s.description || ''} />
      <label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked={s.isActive} /> Activo</label>
      <button className="btn" type="submit">Guardar</button>
    </form>
  );
}

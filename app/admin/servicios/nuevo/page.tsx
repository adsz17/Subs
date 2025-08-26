import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export default function NuevoServicio() {
  async function create(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '');
    const slug = String(formData.get('slug') || '');
    const description = String(formData.get('description') || '');
    if (!name || !slug) return;
    await prisma.service.create({ data: { name, slug, description } });
    redirect('/admin/servicios');
  }

  return (
    <form action={create} className="max-w-lg space-y-3">
      <h1 className="text-xl font-bold">Nuevo servicio</h1>
      <input className="border p-2 w-full" name="name" placeholder="Nombre" />
      <input className="border p-2 w-full" name="slug" placeholder="slug-unico" />
      <textarea className="border p-2 w-full" name="description" placeholder="Descripción" />
      <button className="btn" type="submit">Crear</button>
    </form>
  );
}

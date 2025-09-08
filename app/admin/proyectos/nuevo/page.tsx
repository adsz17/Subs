import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export default function NuevoProyecto() {
  async function create(formData: FormData) {
    'use server';
    const title = String(formData.get('title') || '');
    const imageUrl = formData.get('imageUrl') as string | null;
    if (!title || !imageUrl) return;
    await prisma.project.create({ data: { title, imageUrl } });
    redirect('/admin/proyectos');
  }

  return (
    <form action={create} className="max-w-lg space-y-3 bg-white p-4">
      <h1 className="text-xl font-bold">Nuevo proyecto</h1>
      <input className="border p-2 w-full" name="title" placeholder="Título" />
      <ImageUploadField folder="projects" />
      <button className="btn" type="submit">Crear</button>
    </form>
  );
}

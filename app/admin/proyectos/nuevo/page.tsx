import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export default function NuevoProyecto() {
  async function create(formData: FormData) {
    'use server';
    const title = String(formData.get('title') || '');
    const image = formData.get('image') as File | null;
    if (!title) return;
    const project = await prisma.project.create({ data: { title, imageUrl: '' } });
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(image.name) || '.png';
      const filename = `${project.id}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'projects');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      await prisma.project.update({
        where: { id: project.id },
        data: { imageUrl: `/projects/${filename}` },
      });
    }
    redirect('/admin/proyectos');
  }

  return (
    <form action={create} encType="multipart/form-data" className="max-w-lg space-y-3 bg-white p-4">
      <h1 className="text-xl font-bold">Nuevo proyecto</h1>
      <input className="border p-2 w-full" name="title" placeholder="Título" />
      <input className="border p-2 w-full" type="file" accept="image/*" name="image" />
      <button className="btn" type="submit">Crear</button>
    </form>
  );
}

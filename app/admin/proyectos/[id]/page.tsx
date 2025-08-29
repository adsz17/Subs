import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export default async function EditProyecto({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  async function update(formData: FormData) {
    'use server';
    const title = String(formData.get('title') || '');
    await prisma.project.update({ where: { id: params.id }, data: { title } });
    const image = formData.get('image') as File | null;
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(image.name) || '.png';
      const filename = `${params.id}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'projects');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      await prisma.project.update({
        where: { id: params.id },
        data: { imageUrl: `/projects/${filename}` },
      });
    }
    redirect('/admin/proyectos');
  }

  async function remove() {
    'use server';
    await prisma.project.delete({ where: { id: params.id } });
    redirect('/admin/proyectos');
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Proyectos', href: '/admin/proyectos' },
          { label: 'Editar' },
        ]}
      />
      <form
        action={update}
        encType="multipart/form-data"
        className="mx-auto mt-4 max-w-lg space-y-4 rounded-md bg-white p-4 shadow"
      >
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Título
          </label>
          <input
            id="title"
            name="title"
            defaultValue={project.title}
            className="w-full rounded-md border p-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium">
            Imagen
          </label>
          {project.imageUrl && (
            <img
              src={project.imageUrl}
              alt=""
              className="mb-2 h-32 w-auto object-contain"
            />
          )}
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="w-full rounded-md border p-2"
          />
        </div>
        <Button type="submit">Guardar</Button>
      </form>
      <form action={remove} className="mx-auto mt-4 max-w-lg">
        <Button
          type="submit"
          variant="outline"
          className="w-full border-red-600 text-red-600 hover:bg-red-50"
        >
          Eliminar
        </Button>
      </form>
    </div>
  );
}

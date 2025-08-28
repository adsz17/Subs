import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export default async function EditServicio({
  params,
}: {
  params: { id: string };
}) {
  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) notFound();

  async function update(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '');
    const slug = String(formData.get('slug') || '');
    const description = String(formData.get('description') || '');
    const isActive = formData.get('isActive') === 'on';
    await prisma.service.update({
      where: { id: params.id },
      data: { name, slug, description, isActive },
    });
    const image = formData.get('image') as File | null;
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(image.name) || '.png';
      const filename = `${params.id}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'services');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      await prisma.service.update({
        where: { id: params.id },
        data: { imageUrl: `/services/${filename}` },
      });
    }
    redirect('/admin/servicios');
  }

  async function remove() {
    'use server';
    await prisma.service.delete({ where: { id: params.id } });
    redirect('/admin/servicios');
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Servicios', href: '/admin/servicios' },
          { label: 'Editar' },
        ]}
      />
      <form
        action={update}
        encType="multipart/form-data"
        className="mx-auto mt-4 max-w-lg space-y-4 rounded-md bg-white p-4 shadow dark:bg-gray-900"
      >
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            defaultValue={service.name}
            className="w-full rounded-md border p-2 bg-white dark:bg-gray-950 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-medium">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={service.slug}
            className="w-full rounded-md border p-2 bg-white dark:bg-gray-950 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={service.description || ''}
            className="w-full rounded-md border p-2 bg-white dark:bg-gray-950 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium">
            Imagen
          </label>
          {service.imageUrl && (
            <img
              src={service.imageUrl}
              alt=""
              className="mb-2 h-32 w-auto object-contain"
            />
          )}
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="w-full rounded-md border p-2 bg-white dark:bg-gray-950 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked={service.isActive}
          />
          <label htmlFor="isActive" className="text-sm">
            Activo
          </label>
        </div>
        <Button type="submit">Guardar</Button>
      </form>
      <form action={remove} className="mx-auto mt-4 max-w-lg">
        <Button
          type="submit"
          variant="outline"
          className="w-full border-red-600 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-600 dark:hover:bg-red-950"
        >
          Eliminar
        </Button>
      </form>
    </div>
  );
}

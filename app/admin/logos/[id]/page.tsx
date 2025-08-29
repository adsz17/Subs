import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export default async function EditLogo({ params }: { params: { id: string } }) {
  const logo = await prisma.logo.findUnique({ where: { id: params.id } });
  if (!logo) notFound();

  async function update(formData: FormData) {
    'use server';
    const image = formData.get('image') as File | null;
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(image.name) || '.png';
      const filename = `${params.id}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'logos');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      await prisma.logo.update({ where: { id: params.id }, data: { imageUrl: `/logos/${filename}` } });
    }
    redirect('/admin/logos');
  }

  async function remove() {
    'use server';
    await prisma.logo.delete({ where: { id: params.id } });
    redirect('/admin/logos');
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Logos', href: '/admin/logos' }, { label: 'Editar' }]} />
      <form
        action={update}
        encType="multipart/form-data"
        className="mx-auto mt-4 max-w-lg space-y-4 rounded-md bg-white p-4 shadow"
      >
        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium">
            Logo
          </label>
          {logo.imageUrl && (
            <img src={logo.imageUrl} alt="" className="mb-2 h-32 w-auto object-contain" />
          )}
          <input id="image" name="image" type="file" accept="image/*" className="w-full rounded-md border p-2" />
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

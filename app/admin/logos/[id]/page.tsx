import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { cloudinary } from '@/lib/cloudinary';

export default async function EditLogo({ params }: { params: { id: string } }) {
  const logo = await prisma.logo.findUnique({ where: { id: params.id } });
  if (!logo) notFound();

  async function update(formData: FormData) {
    'use server';
    const imageUrl = formData.get('imageUrl') as string | null;
    const imagePublicId = formData.get('imagePublicId') as string | null;
    if (imageUrl) {
      if (logo?.imagePublicId) {
        await cloudinary.uploader.destroy(logo.imagePublicId);
      }
      await prisma.logo.update({
        where: { id: params.id },
        data: { imageUrl, imagePublicId: imagePublicId || undefined },
      });
    }
    redirect('/admin/logos');
  }

  async function remove() {
    'use server';
    if (logo?.imagePublicId) {
      await cloudinary.uploader.destroy(logo.imagePublicId);
    }
    await prisma.logo.deleteMany({ where: { id: params.id } });
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
          <ImageUploadField
            folder="logos"
            initialUrl={logo.imageUrl}
            initialPublicId={logo.imagePublicId}
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

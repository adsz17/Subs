import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export default function NuevoLogo() {
  async function create(formData: FormData) {
    'use server';
    const imageUrl = formData.get('imageUrl') as string | null;
    const imagePublicId = formData.get('imagePublicId') as string | null;
    if (!imageUrl) return;
    await prisma.logo.create({
      data: { imageUrl, imagePublicId: imagePublicId || undefined },
    });
    redirect('/admin/logos');
  }

  return (
    <form action={create} encType="multipart/form-data" className="max-w-lg space-y-3 bg-white p-4">
      <h1 className="text-xl font-bold">Nuevo logo</h1>
      <ImageUploadField folder="logos" />
      <button className="btn" type="submit">Crear</button>
    </form>
  );
}

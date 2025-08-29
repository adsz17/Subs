import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export default function NuevoLogo() {
  async function create(formData: FormData) {
    'use server';
    const image = formData.get('image') as File | null;
    if (!image || image.size === 0) return;
    const logo = await prisma.logo.create({ data: { imageUrl: '' } });
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(image.name) || '.png';
    const filename = `${logo.id}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'logos');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
    await prisma.logo.update({ where: { id: logo.id }, data: { imageUrl: `/logos/${filename}` } });
    redirect('/admin/logos');
  }

  return (
    <form action={create} encType="multipart/form-data" className="max-w-lg space-y-3 bg-white p-4">
      <h1 className="text-xl font-bold">Nuevo logo</h1>
      <input className="border p-2 w-full" type="file" accept="image/*" name="image" />
      <button className="btn" type="submit">Crear</button>
    </form>
  );
}

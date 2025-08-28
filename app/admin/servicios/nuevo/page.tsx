import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export default function NuevoServicio() {
  async function create(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '');
    const slug = String(formData.get('slug') || '');
    const description = String(formData.get('description') || '');
    const image = formData.get('image') as File | null;
    const currency = String(formData.get('currency') || 'USD');
    const amount = Number(formData.get('amount') || 0);
    if (!name || !slug) return;
    const service = await prisma.service.create({ data: { name, slug, description } });
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(image.name) || '.png';
      const filename = `${service.id}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'services');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      await prisma.service.update({
        where: { id: service.id },
        data: { imageUrl: `/services/${filename}` }
      });
    }
    if (amount > 0) {
      const now = new Date();
      await prisma.price.create({
        data: {
          serviceId: service.id,
          currency,
          amountCents: Math.round(amount * 100),
          activeFrom: now,
          isCurrent: true
        }
      });
      await prisma.auditLog.create({
        data: {
          action: 'CHANGE_PRICE',
          entity: 'Service',
          entityId: service.id,
          diff: { from: null, to: Math.round(amount * 100) } as any
        }
      });
    }
    // Invalidate the home page so new services become visible immediately
    // after creation.
    revalidatePath('/');
    redirect('/admin/servicios');
  }

  return (
    <form action={create} encType="multipart/form-data" className="max-w-lg space-y-3 bg-white p-4 text-black">
      <h1 className="text-xl font-bold">Nuevo servicio</h1>
      <input className="border p-2 w-full" name="name" placeholder="Nombre" />
      <input className="border p-2 w-full" name="slug" placeholder="slug-unico" />
      <textarea className="border p-2 w-full" name="description" placeholder="Descripción" />
      <input className="border p-2 w-full" type="file" accept="image/*" name="image" />
      <div className="flex gap-2">
        <input className="border p-2 w-full" name="currency" defaultValue="USD" />
        <input className="border p-2 w-full" name="amount" type="number" step="0.01" placeholder="Precio" />
      </div>
      <button className="btn" type="submit">Crear</button>
    </form>
  );
}

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { ContentBuilder } from '@/components/admin/ContentBuilder';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

export default function NuevoServicio() {
  function parseContent(value: FormDataEntryValue | null): Prisma.JsonValue | null {
    if (!value || typeof value !== 'string' || !value.trim()) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      return {
        version: 1,
        metadata: { legacyMarkdown: true },
        sections: [
          {
            id: randomUUID(),
            layout: 'markdown',
            title: 'Contenido migrado',
            body: value,
          },
        ],
      } satisfies Prisma.JsonValue;
    }
  }

  async function create(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '');
    const slug = String(formData.get('slug') || '');
    const description = String(formData.get('description') || '');
    const content = parseContent(formData.get('content'));
    const imageUrl = formData.get('imageUrl') as string | null;
    const currency = String(formData.get('currency') || 'USD');
    const amount = Number(formData.get('amount') || 0);
    if (!name || !slug) return;
    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        content: content ?? undefined,
        imageUrl: imageUrl || undefined,
      },
    });
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
    <form action={create} className="max-w-lg space-y-3 bg-white p-4 text-black">
      <h1 className="text-xl font-bold">Nuevo servicio</h1>
      <input className="border p-2 w-full" name="name" placeholder="Nombre" />
      <input className="border p-2 w-full" name="slug" placeholder="slug-unico" />
      <textarea className="border p-2 w-full" name="description" placeholder="Descripción" />
      <div className="space-y-2">
        <label className="block text-sm font-medium">Contenido enriquecido</label>
        <ContentBuilder name="content" />
      </div>
      <ImageUploadField folder="services" />
      <div className="flex gap-2">
        <input className="border p-2 w-full" name="currency" defaultValue="USD" />
        <input className="border p-2 w-full" name="amount" type="number" step="0.01" placeholder="Precio" />
      </div>
      <button className="btn" type="submit">Crear</button>
    </form>
  );
}

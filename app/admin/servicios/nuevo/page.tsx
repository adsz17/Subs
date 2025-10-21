import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { ContentBuilder } from '@/components/admin/ContentBuilder';
import { randomUUID } from 'crypto';

export default function NuevoServicio() {
  function parseContent(value: FormDataEntryValue | null): string | null {
    if (!value || typeof value !== 'string' || !value.trim()) {
      return null;
    }
    try {
      return JSON.stringify(JSON.parse(value));
    } catch (error) {
      return JSON.stringify({
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
      });
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
    <form action={create} className="max-w-lg space-y-4 rounded-md bg-white p-4 text-black shadow">
      <h1 className="text-xl font-bold">Nuevo servicio</h1>
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          placeholder="Nombre"
          className="w-full rounded-md border p-2"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="slug" className="block text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          placeholder="slug-unico"
          className="w-full rounded-md border p-2"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Descripción"
          className="w-full rounded-md border p-2"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium">
          Contenido enriquecido
        </label>
        <ContentBuilder name="content" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Imagen</label>
        <ImageUploadField folder="services" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="currency" className="block text-sm font-medium">
            Moneda
          </label>
          <input
            id="currency"
            name="currency"
            defaultValue="USD"
            className="w-full rounded-md border p-2"
          />
          <p className="text-xs text-gray-500">Utiliza el código ISO de la divisa (p. ej. USD, EUR).</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-medium">
            Precio
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            min="0"
            className="w-full rounded-md border p-2"
          />
          <p className="text-xs text-gray-500">Introduce el precio utilizando punto para los decimales.</p>
        </div>
      </div>
      <button className="btn" type="submit">
        Crear
      </button>
    </form>
  );
}

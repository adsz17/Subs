import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { NuevoServicioForm } from './NuevoServicioForm';
import { initialFormState, type FormErrors, type FormState } from './formState';

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

function normalizeSlug(rawSlug: string): string {
  return rawSlug
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function create(prevState: FormState, formData: FormData): Promise<FormState> {
  'use server';
  const name = String(formData.get('name') || '').trim();
  const slugInput = String(formData.get('slug') || '');
  const normalizedSlug = slugInput ? normalizeSlug(slugInput) : '';
  const description = String(formData.get('description') || '');
  const content = parseContent(formData.get('content'));
  const imageUrl = formData.get('imageUrl') as string | null;
  const currency = String(formData.get('currency') || 'USD');
  const rawAmount = String(formData.get('amount') ?? '');
  const amount = rawAmount ? Number(rawAmount) : 0;

  const values: FormState['values'] = {
    name,
    slug: normalizedSlug,
    description,
    currency,
    amount: rawAmount,
  };

  const errors: FormErrors = {};

  if (!name) {
    errors.name = 'El nombre es obligatorio.';
  }

  if (!normalizedSlug) {
    errors.slug = 'El slug es obligatorio.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  try {
    const service = await prisma.service.create({
      data: {
        name,
        slug: normalizedSlug,
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
          isCurrent: true,
        },
      });
      await prisma.auditLog.create({
        data: {
          action: 'CHANGE_PRICE',
          entity: 'Service',
          entityId: service.id,
          diff: { from: null, to: Math.round(amount * 100) } as any,
        },
      });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return {
        errors: { ...errors, slug: 'El slug ya existe. Prueba con otro.' },
        values,
      };
    }

    return {
      errors: {
        ...errors,
        general: 'Ocurrió un error al crear el servicio. Inténtalo nuevamente.',
      },
      values,
    };
  }

  revalidatePath('/');
  redirect('/admin/servicios');
}

export default function NuevoServicio() {
  return <NuevoServicioForm action={create} initialState={initialFormState} />;
}

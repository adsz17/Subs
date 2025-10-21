import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { ContentBuilder } from '@/components/admin/ContentBuilder';
import { randomUUID } from 'crypto';
import { useFormState } from 'react-dom';
import { Prisma } from '@prisma/client';

type FormErrors = {
  name?: string;
  slug?: string;
  general?: string;
};

type FormValues = {
  name: string;
  slug: string;
  description: string;
  currency: string;
  amount: string;
};

type FormState = {
  errors: FormErrors;
  values: FormValues;
};

const initialState: FormState = {
  errors: {},
  values: {
    name: '',
    slug: '',
    description: '',
    currency: 'USD',
    amount: '',
  },
};

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

  const values: FormValues = {
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
  const [state, formAction] = useFormState(create, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-3 bg-white p-4 text-black">
      <h1 className="text-xl font-bold">Nuevo servicio</h1>
      {state.errors.general ? (
        <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
          {state.errors.general}
        </div>
      ) : null}
      <div>
        <input
          className="border p-2 w-full"
          name="name"
          placeholder="Nombre"
          defaultValue={state.values.name}
        />
        {state.errors.name ? (
          <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>
        ) : null}
      </div>
      <div>
        <input
          className="border p-2 w-full"
          name="slug"
          placeholder="slug-unico"
          defaultValue={state.values.slug}
        />
        {state.errors.slug ? (
          <p className="mt-1 text-sm text-red-600">{state.errors.slug}</p>
        ) : null}
      </div>
      <textarea
        className="border p-2 w-full"
        name="description"
        placeholder="Descripción"
        defaultValue={state.values.description}
      />
      <div className="space-y-2">
        <label className="block text-sm font-medium">Contenido enriquecido</label>
        <ContentBuilder name="content" />
      </div>
      <ImageUploadField folder="services" />
      <div className="flex gap-2">
        <input
          className="border p-2 w-full"
          name="currency"
          defaultValue={state.values.currency}
        />
        <input
          className="border p-2 w-full"
          name="amount"
          type="number"
          step="0.01"
          placeholder="Precio"
          defaultValue={state.values.amount}
        />
      </div>
      <button className="btn" type="submit">Crear</button>
    </form>
  );
}

'use client';

import { useFormState } from 'react-dom';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { ContentBuilder } from '@/components/admin/ContentBuilder';
import type { FormState } from './formState';

type NuevoServicioFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialState: FormState;
};

export function NuevoServicioForm({ action, initialState }: NuevoServicioFormProps) {
  const [state, formAction] = useFormState(action, initialState);

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
      <button className="btn" type="submit">
        Crear
      </button>
    </form>
  );
}

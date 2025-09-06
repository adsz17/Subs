'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { logoSchema } from '@/lib/validations';
import type { z } from 'zod';
import { useTransition } from 'react';

interface Props {
  onSubmit: (data: z.infer<typeof logoSchema>) => Promise<void>;
}

export function LogoForm({ onSubmit }: Props) {
  const form = useForm<z.infer<typeof logoSchema>>({
    resolver: zodResolver(logoSchema),
    defaultValues: { imageUrl: '', imagePublicId: '' },
    mode: 'onChange',
  });
  const [isPending, startTransition] = useTransition();

  const submit = (values: z.infer<typeof logoSchema>) => {
    startTransition(() => onSubmit(values));
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="max-w-lg space-y-3 bg-white p-4">
        <h1 className="text-xl font-bold">Nuevo logo</h1>
        <ImageUploadField folder="logos" />
        <button
          className="btn"
          type="submit"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? 'Creando...' : 'Crear'}
        </button>
      </form>
    </FormProvider>
  );
}

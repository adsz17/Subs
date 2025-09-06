import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { logoSchema } from '@/lib/validations';
import type { z } from 'zod';
import { LogoForm } from '../LogoForm';

export default function NuevoLogo() {
  async function create(data: z.infer<typeof logoSchema>) {
    'use server';
    const { imageUrl, imagePublicId } = data;
    if (!imageUrl) return;
    await prisma.logo.create({
      data: { imageUrl, imagePublicId: imagePublicId || undefined },
    });
    redirect('/admin/logos');
  }

  return <LogoForm onSubmit={create} />;
}

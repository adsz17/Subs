import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  message: z.string().min(1, 'Mensaje requerido')
});

export const serviceSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true)
});

export const logoSchema = z.object({
  imageUrl: z.string().url(),
  imagePublicId: z.string().optional()
});

export const priceSchema = z.object({
  serviceId: z.string().cuid(),
  amountCents: z.number().int().nonnegative(),
  currency: z.string().min(1)
});

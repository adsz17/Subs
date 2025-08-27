import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url().optional(),
  EMAIL_FROM: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  PAYMENT_PROVIDER: z.enum(['coinbase', 'stripe']).default('coinbase'),
  COINBASE_API_KEY: z.string().optional(),
  STRIPE_API_KEY: z.string().optional(),
  CLOUDINARY_URL: z.string().url().optional(),
  PUBLIC_BASE_URL: z.string().url().optional()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.flatten().fieldErrors);
  throw new Error('Invalid env');
}

export const env = _env.data;

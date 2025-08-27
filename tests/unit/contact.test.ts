import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/lib/validations';

describe('contactSchema', () => {
  it('accepts valid data', () => {
    const result = contactSchema.safeParse({
      name: 'Juan',
      email: 'juan@example.com',
      message: 'Hola'
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'Juan',
      email: 'no-email',
      message: 'Hola'
    });
    expect(result.success).toBe(false);
  });
});

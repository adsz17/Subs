import { describe, it, expect } from 'vitest';
import { logger } from '@/lib/logger';

describe('logger', () => {
  it('should have info level', () => {
    expect(logger.level).toBe('info');
  });
});

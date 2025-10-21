import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'react-markdown': path.resolve(__dirname, 'tests/__mocks__/react-markdown.ts'),
      'remark-gfm': path.resolve(__dirname, 'tests/__mocks__/remark-gfm.ts'),
      'rehype-sanitize': path.resolve(__dirname, 'tests/__mocks__/rehype-sanitize.ts')
    }
  }
});

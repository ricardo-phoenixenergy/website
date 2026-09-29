import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    // sanity/schemaTypes holds the Studio's schema and the rules behind its warnings, tested too.
    include: ['src/**/*.test.ts', 'sanity/**/*.test.ts'],
  },
});

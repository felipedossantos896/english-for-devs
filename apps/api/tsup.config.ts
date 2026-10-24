import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: 'esm',
  target: 'node22',
  // The shared package ships TypeScript source, so bundle it into the API.
  noExternal: ['@efd/shared'],
});

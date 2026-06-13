import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  noExternal: ['commander'],
  splitting: false,
  clean: true,
  platform: 'node',
  target: 'node18'
});

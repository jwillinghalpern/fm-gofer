import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    emptyOutDir: true,
    target: 'es2020',
    lib: {
      entry: 'src/index.ts',
      name: 'FMGofer',
      formats: ['es', 'umd'],
      // Pinned to match the artifact names referenced by the package `exports`
      // map, `main`/`module`/`types`, and the README.
      fileName: (format) =>
        format === 'es' ? 'fm-gofer.js' : 'fm-gofer.umd.cjs',
    },
  },
  test: {
    environment: 'jsdom',
    include: ['__tests__/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'html'],
    },
  },
});

import { resolve } from "path";
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FMGofer',
      fileName: 'fm-gofer'
    },
  },
  root: 'src',
  test: {
    environment: 'jsdom',
    include: ['**\/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    dir: '__tests__',
    cache: {
      dir: '../node_modules/.vitest',
    },
    coverage: {
      reportsDirectory: '../coverage'
    }
  },
});

import { resolve } from "path";
import { defineConfig } from 'vite';
// import typescript from 'rollup-plugin-typescript2';

// import { viteSingleFile } from 'vite-plugin-singlefile';
// import { ViteMinifyPlugin } from 'vite-plugin-minify';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FMGofer',
      fileName: 'fm-gofer'
    }
  },
  root: 'src',
});

import { resolve } from "path";
import { defineConfig } from 'vite';

import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [viteSingleFile({ useRecommendedBuildConfig: true })],
  root: 'example/src',
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'example/dist'),
  },
});

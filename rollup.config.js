import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: './dist/fm-gofer.js',
        format: 'umd',
        name: 'FMGofer',
      },
      {
        file: './dist/fm-gofer.mjs',
        format: 'es',
        name: 'FMGofer',
      },
    ],
    plugins: [babel({ babelHelpers: 'bundled' }), commonjs(), cleanup()],
  },
  {
    input: './node_modules/core-js/stable/promise/index.js',
    output: [
      {
        file: './dist/polyfill-ie11.js',
        format: 'umd',
        // I think this is right name to use for a polyfill of Promise.
        // Webpack lets you export a library without decalaring name, but rollup requires it.
        name: 'Promise',
      },
    ],
    plugins: [babel({ babelHelpers: 'bundled' }), commonjs(), terser()],
  },
];

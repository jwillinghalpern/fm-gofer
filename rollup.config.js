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
        file: './dist/fm-gofer.min.js',
        format: 'umd',
        name: 'FMGofer',
        plugins: [terser()],
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
        name: 'Promise',
      },
      {
        file: './dist/polyfill-ie11.min.js',
        format: 'umd',
        name: 'Promise',
        plugins: [terser()],
      },
    ],
    plugins: [babel({ babelHelpers: 'bundled' }), commonjs()],
  },
];

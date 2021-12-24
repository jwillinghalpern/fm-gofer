import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
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
    plugins: [
      babel({ babelHelpers: 'bundled' }),
      typescript({
        tsconfigDefaults: {
          compilerOptions: {
            declaration: true,
            declarationDir: './dist',
            emitDeclarationOnly: false,
          },
        },
      }),
      cleanup({
        extensions: ['js', 'mjs', 'ts'],
        exclude: ['.d.ts'],
      }),
    ],
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
    // commonjs plugin only needed for the IE11 polyfill
    plugins: [babel({ babelHelpers: 'bundled' }), commonjs()],
  },
];

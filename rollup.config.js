export default {
  input: 'src/index.js',
  output: [
    {
      file: './dist/fm-gofer-pack.js',
      format: 'umd',
      name: 'FMGofer',
    },
    {
      file: './dist/fm-gofer-pack.mjs',
      format: 'es',
      name: 'FMGofer',
    },
  ],
};

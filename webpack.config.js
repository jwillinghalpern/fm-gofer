const path = require('path');
const mode = 'production';

module.exports = [
  {
    entry: path.resolve(__dirname, 'src/index.js'),
    target: 'es5',
    output: {
      globalObject: 'this',
      path: path.resolve(__dirname, 'dist'),
      filename: 'fm-gofer.js',
      library: {
        name: 'FMGofer',
        type: 'umd',
      },
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
    mode: mode,
  },
  {
    // same as the umd above, but target es5 and polyfill promise for ie11
    entry: ['core-js/stable/promise'],
    target: 'es5',
    output: {
      globalObject: 'this',
      path: path.resolve(__dirname, 'dist'),
      filename: 'polyfill-ie11.js',
      library: {
        type: 'umd',
      },
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
    mode: mode,
  },
  {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      globalObject: 'this',
      path: path.resolve(__dirname, 'dist'),
      filename: 'fm-gofer.mjs',
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true,
    },
    mode: mode,
  },
];

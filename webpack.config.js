const path = require('path');
const mode = 'production';

module.exports = [
  {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      globalObject: 'this',
      path: path.resolve(__dirname, 'dist'),
      filename: 'fm-gofer.js',
      library: {
        name: 'FMGofer',
        type: 'umd',
        // export: 'default',
        // umdNamedDefine: true,
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

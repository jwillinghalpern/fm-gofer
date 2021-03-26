const path = require('path');
const distPath = path.resolve(__dirname, 'dist');
const mode = 'production';

const moduleRules = {
  rules: [
    {
      test: /\.(js)$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    },
  ],
};

const entry = path.resolve(__dirname, 'src/index.js');

module.exports = [
  {
    output: {
      path: distPath,
      filename: 'main-umd.js',
      library: {
        name: 'FMPromise',
        type: 'umd',
        export: 'FMPromise',
        umdNamedDefine: true,
      },
    },
    module: moduleRules,
    entry: entry,
    mode: mode,
  },
  {
    output: {
      path: distPath,
      filename: 'main-cjs.js',
      library: {
        name: 'FMPromise',
        type: 'commonjs',
        export: 'FMPromise',
      },
    },
    module: moduleRules,
    entry: entry,
    mode: mode,
  },
];

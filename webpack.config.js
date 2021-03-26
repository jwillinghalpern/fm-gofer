const path = require('path');
const distPath = path.resolve(__dirname, 'dist');
const mode = 'production';
const filname = 'fm-gofer';
const name = 'FMGofer';

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
      filename: `${filname}.umd.js`,
      library: {
        name: name,
        type: 'umd',
        export: 'FMGofer',
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
      filename: `${filname}.cjs.js`,
      library: {
        name: name,
        type: 'commonjs',
        export: 'FMGofer',
      },
    },
    module: moduleRules,
    entry: entry,
    mode: mode,
  },
];

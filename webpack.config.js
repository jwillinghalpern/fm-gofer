const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename: 'index_bundle.js',
    // libraryExport: 'default',
    library: {
      name: 'FMPromise',
      type: 'umd',
      export: 'FMPromise',
      umdNamedDefine: true,
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
};

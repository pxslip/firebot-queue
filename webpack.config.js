const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const packageJson = require('./package.json');

module.exports = {
  target: 'node',
  mode: 'production',
  devtool: false,
  entry: {
    main: './src/main.ts',
    startup: './src/startup.ts',
  },
  output: {
    libraryTarget: 'commonjs2',
    libraryExport: 'default',
    path: path.resolve(__dirname, './dist'),
    filename: `${packageJson.scriptOutputName}.[name].js`,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: false,
          minimize: true,
        },
      },
    ],
  },
  optimization: {
    minimize: true,

    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: /(?:main)|(?:startup)/,
          mangle: false,
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};

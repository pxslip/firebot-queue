const path = require('path');
const { config } = require('process');
const TerserPlugin = require('terser-webpack-plugin');
const packageJson = require('./package.json');
const postHtml = require('posthtml');
const postHtmlInlineAssets = require('posthtml-inline-assets');
const postHtmlPostCSS = require('posthtml-postcss');
const typescript = require('typescript');

const configuration = {
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
        exclude: /\.post.html$/i,
        loader: 'html-loader',
        options: {
          sources: false,
          minimize: true,
        },
      },
      {
        test: /\.post\.html$/i,
        loader: 'html-loader',
        options: {
          sources: true,
          minimize: true,
          preprocessor: async (content, loaderContext) => {
            try {
              result = await postHtml([
                postHtmlInlineAssets({
                  cwd: loaderContext.context,
                  transforms: {
                    script: {
                      resolve(node) {
                        return node.tag === 'script' && node.attrs && node.attrs.src;
                      },
                      transform(node, data) {
                        let content;
                        if (node.attrs.src.endsWith('.ts')) {
                          content = typescript.transpile(data.buffer.toString('utf8'));
                        } else {
                          content = data.buffer.toString('utf8');
                        }
                        delete node.attrs.src;
                        node.content = [content];
                      },
                    },
                  },
                }),
                postHtmlPostCSS(),
              ]).process(content);
              return result.html;
            } catch (exc) {
              loaderContext.emitError(exc);
              return content;
            }
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        type: 'asset/source',
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

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    configuration.optimization.minimize = false;
  }
  return configuration;
};

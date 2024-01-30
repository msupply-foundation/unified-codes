const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

class DummyWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap('DummyWebpackPlugin', () => {});
  }
}

module.exports = env => {
  const isProduction = !!env.production;
  const bundleAnalyzerPlugin = !!env.stats
    ? new BundleAnalyzerPlugin({
        /**
         * In "server" mode analyzer will start HTTP server to show bundle report.
         * In "static" mode single HTML file with bundle report will be generated.
         * In "json" mode single JSON file with bundle report will be generated
         */
        analyzerMode: 'disabled',
        generateStatsFile: true,
      })
    : new DummyWebpackPlugin();

  return {
    experiments: {
      syncWebAssembly: true,
    },
    entry: './src/index',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? undefined : 'source-map',
    devServer: {
      hot: true,
      static: isProduction
        ? path.join(__dirname, 'dist')
        : path.join(__dirname, 'public'),

      port: 4201,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      },
      open: true,
    },
    resolve: {
      extensions: ['.js', '.css', '.ts', '.tsx'],
      plugins: [new TsconfigPathsPlugin()],
    },
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      chunkFilename: '[contenthash].js',
      clean: {
        keep: asset => asset.includes('.gitignore'), // see dist/.gitignore for comments
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      usedExports: true,
    },
    module: {
      rules: [
        {
          test: /\.[t|j]sx?$/,
          loader: isProduction ? 'ts-loader' : 'swc-loader',
          exclude: /node_modules/,
          options: isProduction
            ? {
                /* ts-loader options */
              }
            : {
                /* swc-loader options */
                jsc: {
                  parser: {
                    dynamicImport: true,
                    syntax: 'typescript',
                    tsx: true,
                  },
                  target: 'es2015',
                },
              },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(woff(2)?|ttf|eot)$/,
          type: 'asset/resource',
          generator: {
            filename: './fonts/[name][ext]',
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new ReactRefreshWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new webpack.DefinePlugin({
        API_HOST: JSON.stringify(env.API_HOST),
        APP_BUILD_VERSION: JSON.stringify(env.APP_BUILD_VERSION),
        BUGSNAG_API_KEY: JSON.stringify(env.BUGSNAG_API_KEY),
        LANG_VERSION: Date.now(),
      }),
      bundleAnalyzerPlugin,
      new HtmlWebpackPlugin({
        favicon: './public/favicon.ico',
        template: './public/index.html',
      }),
      new CopyPlugin({
        patterns: [
          {
            context: path.resolve(
              __dirname,
              '..',
              'common',
              'src',
              'intl',
              'locales'
            ),
            from: '**/*.json',
            to: 'locales/',
          },
        ],
      }),
    ],
  };
};

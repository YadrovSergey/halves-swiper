const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { get } = require('lodash');

const packageJSON = require('../../package.json');

const getPackageConfig = (path, defaultValue = '') =>
  get(packageJSON, path, defaultValue);

const getConfig = require('../config');
const commonConfig = require('../common');

module.exports = merge(commonConfig, {
  entry: [getConfig('appIndex')],
  mode: 'production',
  output: {
    path: getConfig('appDist'),
    filename: '[name]-[fullhash].js',
    publicPath: '/',
    clean: true,
  },
  optimization: {
    runtimeChunk: true,
    minimize: true,
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 5,
    }),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 1000,
    }),
    new HtmlWebpackPlugin({
      template: getConfig('appHTMLTemplate'),
      title: getConfig('appName'),
      inject: true,
    }),
  ],
});

var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var StylelintPlugin = require('stylelint-webpack-plugin')
var AutoDllPlugin = require('autodll-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },

  profile: true,

  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  // devtool: '#source-map',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // css linting
    new StylelintPlugin({
      files: ['src/**/*.vue', 'src/**/*.scss']
    }),

    new webpack.PrefetchPlugin('vue'),
    new webpack.PrefetchPlugin('tinymce'),
    new webpack.PrefetchPlugin('materialize-css'),

    new AutoDllPlugin({
      inject: true, // will inject the DLL bundles to index.html
      filename: '[name]_[hash].js',
      entry: {
        vendor: [
          'autosize',
          'flatpickr',
          'materialize-css',
          'moment',
          'spin.js',
          'timeago.js',
          'tinymce',
          'vee-validate',
          'vue',
          'vue-i18n',
          'vue-multiselect',
          'vue-resource',
          'vue-router',
          'vue-swatches',
          'vue2-leaflet',
          'vuex'
        ]
      }
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})

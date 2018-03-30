'use strict'

const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')

module.exports = {
  module: {
    rules: [
      ...utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true }),
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  entry: {
    vendor: [
      'autosize',

      'flatpickr',
      'flatpickr/dist/themes/material_green.css',

      'materialize-css',
      'moment',
      'spin.js',
      'timeago.js',

      'tinymce',
      'tinymce/plugins/lists',
      'tinymce/plugins/link',
      'tinymce/plugins/code',
      'tinymce/plugins/wordcount',
      'tinymce/themes/modern/theme',
      //moved to ChapterEditor.vue
      //'tinymce/skins/lightgray/skin.min.css',

      'vee-validate',
      'vue',
      'vue/dist/vue.esm.js',
      'vue-i18n',

      'vue-multiselect',
      'vue-multiselect/dist/vue-multiselect.min.css',

      'vue-resource',
      'vue-router',

      'vue-swatches',
      'vue-swatches/dist/vue-swatches.min.css',

      'vue2-leaflet',
      'leaflet/dist/leaflet.css',

      'vuex'
    ],
  },
  output: {
    path: config.build.assetsRoot,
    filename: 'vendor.js',
    library: 'vendor',
  },
  plugins: [new webpack.DllPlugin({
    name: 'vendor',
    path: 'dist/vendor.manifest.json',
  })]
}

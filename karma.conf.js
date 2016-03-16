const path = require('path')
const webpack = require('webpack')

const EXT_REGEX = /.*\.(js|jsx)$/

module.exports = function (config) {

  config.set({
    singleRun: false,
    autoWatch: false,
    frameworks: ['mocha'],
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      type: 'text'
    },

    files: [
      // {pattern: 'tests.webpack.js', watched: false}
      {pattern: 'test/*.js', watched: true}
    ],

    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },

    webpack: {
      devtool: 'inline-source-map',

      resolve: {
        extensions: ['', '.js', '.jsx']
      },

      // Use shims/polyfills with Webpack
      plugins: [
        new webpack.ProvidePlugin({
          'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
      ],

      module: {
        loaders: [{
          test: EXT_REGEX,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }],
        preLoaders: [{
          test: EXT_REGEX,
          exclude: /node_modules/,
          include: path.resolve('test/'),
          loader: 'isparta'
        }]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    plugins: [
      require('karma-webpack'),
      require('isparta-loader'),
      require('karma-mocha'),
      require('karma-coverage'),
      require('karma-sourcemap-loader'),
      require('karma-mocha-reporter')
    ]
  })
}

'use strict';

const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'pdf-reports.min.js',
    libraryTarget: 'umd'
  },
  devServer: {
    static: path.resolve(__dirname, 'src'),
    port: 8000,
    client: {
      overlay: false,
    },
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: { minimize: true, esModule: false }
      }]
    }, {
      test: /\.scss$/,
      use: [{loader: 'css-loader', options: { esModule: false }}, 'sass-loader']
    }, {
      test: /\.svg$/,
      loader: 'svgo-loader',
      type: 'asset/inline',
      generator: {
        dataUrl: content => svgToMiniDataURI(String(content)),
      },
    }]
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
};

if (isProduction) {
  config.externals = ['angular'];
} else {
  config.devtool = 'source-map';
  config.plugins.push(new HtmlWebpackPlugin({
    template: 'index.html',
    chunks: ['app'],
    chunksSortMode: 'manual'
  }));
}

module.exports = config;

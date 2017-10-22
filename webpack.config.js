'use strict';

const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  devServer: {
    port: 8000,
    contentBase: path.resolve(__dirname, 'src')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules|bower_components/,
      use: [{
        loader: 'babel-loader',
        options: { presets: ['env'] }
      }]
    }, {
      test: /\.scss$/,
      use: [{
          loader: 'css-loader',
          options: { minimize: true }
        },
        {
          loader: 'postcss-loader'
        },
        {
          loader: 'sass-loader',
          options: { outputStyle: 'compressed' }
        }
      ]
    }, {
      test: /\.(png|svg|jpg|gif|ico)$/,
      loader: 'url-loader'
    }]
  },
  plugins: [
    new CleanWebpackPlugin('dist')
  ]
};

if (isProduction) {
  config.plugins.push(new UglifyjsWebpackPlugin());
} else {
  config.devtool = 'cheap-module-eval-source-map';
  config.plugins.push(new HtmlWebpackPlugin({
    template: 'index.html',
    chunks: ['app'],
    chunksSortMode: 'manual'
  }));
}

module.exports = config;

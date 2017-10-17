'use strict';

const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const extractScss = new ExtractTextWebpackPlugin({
  filename: '[name].[contenthash].css',
  disable: !isProduction
});

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
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: { minimize: isProduction }
        }
      ]
    }, {
      test: /\.scss$/,
      use: extractScss.extract({
        // in production only
        use: [{
            loader: 'css-loader',
            options: { minimize: true }
          },
          {
            loader: 'sass-loader',
            options: { outputStyle: 'compressed' }
          }
        ],
        fallback: 'style-loader'
      })
    }]
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    new CopyWebpackPlugin([
      { from: '**/*.{html,png,svg,jpg,gif,ico}' }
    ]),
    extractScss,
    new HtmlWebpackPlugin({
      template: 'index.html',
      chunks: ['app'],
      chunksSortMode: 'manual'
    })
  ]
};

if (isProduction) {
  // insert js minification right after sass compiling
  config.plugins.splice(config.plugins.indexOf(extractScss) + 1, 0, new UglifyjsWebpackPlugin());
} else {
  config.devtool = 'cheap-module-eval-source-map';
}

module.exports = config;

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './lib/index.ts',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    process.env.NODE_ENV === 'production' ? new CleanWebpackPlugin() : null
  ].filter(Boolean),
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: './alpha-video-player.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'AlphaVideoPlayer2D',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, './dist'),
        publicPath: '/dist',
      },
      {
        directory: path.join(__dirname, './example'),
      }
    ],
    compress: true,
    port: 9000,
    open: true
  }
};
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  watch: true,
  entry: {
    game: './src/server/index.js',
  },
  // devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist/server'),
    filename: '[name].bundle.js',
    publicPath: "/"
  },
  // target: 'node',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin()
  ],
};
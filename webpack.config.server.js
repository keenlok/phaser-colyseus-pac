const path = require('path')
const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  watch: true,
  entry: {
    server: './src/server/Server.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/server'),
    filename: '[name].js',
    publicPath: "/"
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: /colyseus/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    // new CopyWebpackPlugin([
    //   {
    //     from: 'src/practice_server/index.html',
    //     to: 'index.html',
    //     toType: 'file'
    //   }
    // ])
  ],
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this in, __dirname
    __filename: false // and __filename return blank or /
  },
  externals: [nodeExternals()]
};
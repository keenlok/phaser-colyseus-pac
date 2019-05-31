const path = require('path')
const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  watch: true,
  entry: {
    practice: './src/practice_server/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
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
    // new CopyWebpackPlugin([
    //   {
    //     from: 'src/index.html',
    //     to: 'index.html',
    //     toType: 'file'
    //   }
    // ]),
    new CleanWebpackPlugin()
  ],
  // node: {
  //   // Need this when working with express, otherwise the build fails
  //   __dirname: false, // if you don't put this in, __dirname
  //   __filename: false // and __filename return blank or /
  // },
  // externals: [nodeExternals()]
};
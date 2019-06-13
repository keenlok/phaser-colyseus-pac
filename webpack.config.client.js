const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  watch: true,
  entry: {
    client: './src/frontend/client/client.js',
  },
  // devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: '[name].js',
    publicPath: "/"
  },
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
    new CleanWebpackPlugin()
  ],
};
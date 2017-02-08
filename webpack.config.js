const path = require('path')

module.exports = {
  context: __dirname,
  entry: './client/app.js',
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  devServer: {
    publicPath: '/public/',
    historyApiFallback: true,
    contentBase: './'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        enforce: 'post'
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        enforce: 'post'
      }
    ]
  }
}

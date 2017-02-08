const path = require('path')

module.exports = {
  context: __dirname,
  entry: './client/app.js',
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  resolve: {
    extentions: ['.js', '.jsx', '.json']
  },
  devServer: {
    publicPath: '/public/'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }

    ]
  }
}

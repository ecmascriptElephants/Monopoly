const path = require('path')

module.exports = {
  context: __dirname,
  entry: './client/app.jsx',
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  devServer: {
    publicPath: '/public/',
    open: true,
    historyApiFallback: true,
    contentBase: './index'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.scss', '.css']
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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        enforce: 'post'
      }
    ]
  }
}

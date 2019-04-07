import GasPlugin from 'gas-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import Dotenv from 'dotenv-webpack'

export default {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].gs',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: './[name].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new GasPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new Dotenv({
      path: './.env'
    })
  ]
}
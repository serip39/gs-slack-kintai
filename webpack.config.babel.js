import GasPlugin from 'gas-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/lib/plugin'
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin'
import path from 'path'
import Dotenv from 'dotenv-webpack'

export default {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    server: './server/index.js',
    client: './client/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: (data) => data.chunk.name === 'server' ? 'main.gs' : 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: './[name].[ext]'
          },
        }
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src/client/')
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new GasPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      inlineSource: '.(js|css)$', // embed all javascript and css inline
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new Dotenv({
      path: './.env'
    })
  ]
}
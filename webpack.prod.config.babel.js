import GasPlugin from 'gas-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/lib/plugin'
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import path from 'path'
import Dotenv from 'dotenv-webpack'

export default {
  mode: 'production',
  entry: {
    server: './src/server/index.js',
    client: './src/client/index.js'
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
      template: './public_gas/index.html',
      inject: true,
      inlineSource: '.(js|css)$', // embed all javascript and css inline
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new CopyWebpackPlugin([
        {
          from: './public_gas/css.html',
          to: './',
          toType: 'dir'
        },
      ]
    ),
    new Dotenv({
      path: './.env'
    })
  ]
}

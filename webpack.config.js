const path = require('path')
const ENV = process.env.NODE_ENV

const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const sveltePreprocess = require('svelte-preprocess')

module.exports = {
  mode: ENV,
  devtool: (ENV === 'development') && 'inline-source-map',

  entry: {
    ui: './src/ui.ts',
    code: './src/code.ts'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      // TypeScript
      { test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/ },

      // Svelte
      { test: /\.svelte?$/, 
        use: {
          loader: 'svelte-loader',
          options: {
            preprocess: sveltePreprocess()
          }
        },
        exclude: /node_modules/ 
      },

      // SCSS
      { test: /\.scss?$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/ui.html',
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui']
    }),
    new HtmlWebpackInlineSourcePlugin()
  ],

  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'module', 'main']
  }
}
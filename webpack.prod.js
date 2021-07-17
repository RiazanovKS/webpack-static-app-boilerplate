const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].css',
  }),
]

const cssLoader = {
  test: /\.(s)?css$/,
  use: [MiniCssExtractPlugin.loader],
}

module.exports = merge.smart(
  {
    mode: 'production',
    module: {
      rules: [cssLoader],
    },
    plugins,
    optimization: {
      minimizer: [new OptimizeCssAssetsPlugin(), new UglifyJsPlugin()],
    },
  },
  commonConfig,
)

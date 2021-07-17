const commonConfig = require('./webpack.common')
const merge = require('webpack-merge')

const plugins = []

const styleLoader = {
  test: /\.(s)?css$/,
  use: ['style-loader'],
}

module.exports = merge.smart(
  {
    mode: 'development',
    module: {
      rules: [styleLoader],
    },
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      index: 'main.html',
      host: '0.0.0.0',
      port: 3000,
      overlay: {
        warnings: true,
        errors: true,
      },
    },
  },
  commonConfig,
)

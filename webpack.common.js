const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

const PATHS = {
  pug: path.resolve(__dirname, 'src/pug'),
  assets: path.resolve(__dirname, 'src/assets'),
  scss: path.resolve(__dirname, 'src/scss'),
  src: path.resolve(__dirname, 'src'),
  pages: path.resolve(__dirname, 'src/pug/pages'),
  static: path.resolve(__dirname, 'src/static'),
}

const plugins = [
  ...fs
    .readdirSync(PATHS.pages)
    .filter(fileName => fileName.endsWith('.pug'))
    .map(
      fileName =>
        new HtmlWebpackPlugin({
          template: path.resolve(PATHS.pages, fileName),
          filename: fileName.replace(path.extname(fileName), '.html'),
          templateParameters: {
            globals: {
              data: require(`${PATHS.static}/data.json`),
            },
          },
        }),
    ),
  new SpriteLoaderPlugin(),
]

const cssLoader = {
  test: /\.(s)?css$/,
  exclude: /node_modules/,
  use: [
    'css-loader',
    'postcss-loader',
    {
      loader: 'sass-loader',
      options: {
        prependData: fs
          .readdirSync(`${PATHS.scss}/utils`)
          .map(fileName => `@import \"${fileName}\";`)
          .toString()
          .replace(/\,/g, ''),
        sassOptions: {
          includePaths: [`${PATHS.scss}/utils`],
        },
      },
    },
  ],
}

const pugLoader = {
  test: /\.pug$/,
  use: {
    loader: 'pug-loader',
    options: {
      root: PATHS.pug,
      pretty: true,
    },
  },
}

const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
  },
}

const spriteLoader = {
  test: /\.svg$/,
  loaders: ['svg-sprite-loader', 'svgo-loader'],
}

const imageLoader = {
  test: /\.(jpg|png|gifblocks)$/,
  loader: 'file-loader',
  options: {
    name: 'assets/images/[name].[ext]',
    context: PATHS.assets,
  },
}

fontLoader = {
  test: /\.(woff(2)?|eot|ttf|otf)$/,
  loader: 'file-loader',
  options: {
    name: 'assets/fonts/[name].[ext]',
    context: PATHS.assets,
  },
}

const resolve = {
  modules: ['src', 'node_modules'],
  extensions: ['.js', '.json', '.scss', '.sass', 'css'],
  alias: {
    components: path.resolve(PATHS.pug, 'components'),
    fonts: path.join(PATHS.assets, '/fonts'),
  },
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/',
  },
  externals: PATHS,
  resolve,
  plugins,
  module: {
    rules: [
      cssLoader,
      jsLoader,
      imageLoader,
      spriteLoader,
      fontLoader,
      pugLoader,
    ],
  },
}

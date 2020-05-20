const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isProductionBuild = process.env.NODE_ENV === 'production';

module.exports = {
  node: {
    fs: 'empty'
  },
  mode: 'production',
  devtool: 'inline-source-map',
  resolve: {
    modules: ['node_modules', 'bower_components', 'frontend/components']
  },
  entry: {
    app: './frontend/app/index.js'
  },
  output: {
    filename: isProductionBuild ? '[name].[hash].js' : '[name].js',
    chunkFilename: isProductionBuild ? '[id].[hash]-chunk.js' : '[id]-chunk.js',
    path: path.resolve(__dirname, 'dist/')
  },
  module: {
    rules: [
      {
        test: /\.(pug|jade)$/,
        exclude: /(node_modules|bower_components|frontend\/components)/,
        use: [
          {
            loader: 'pug-loader'
          },
          {
            loader: 'pug-lint-loader',
            options: {
              disallowAttributeInterpolation: true,
              disallowLegacyMixinCall: true,
              validateExtensions: true,
              validateIndentation: 2
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|frontend\/components)/,
        use: [
          {
            loader: 'ng-annotate-loader',
            options: {
              ngAnnotate: 'ng-annotate-patched',
              es6: true,
              dynamicImport: true,
              explicitOnly: false
            }
          },
          {
            loader: 'babel-loader'
          }
          // {
          //   loader: 'eslint-loader',
          //   options: {
          //     fix: false
          //   }
          // }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: isProductionBuild ?
              MiniCssExtractPlugin.loader :
              'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                require('autoprefixer')({
                  browsers: [
                    'last 5 version',
                    'ie >= 11',
                    'Firefox ESR',
                    'Firefox >= 38',
                    'Edge >= 38'
                  ]
                })
              ]
            }
          }
          // {
          //   loader: 'less-loader',
          //   options: {
          //     sourceMap: true,
          //     includePaths: ['./frontend/component', './bower_components']
          //   }
          // }
        ]
      },
      // {
      //   test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
      //   use: ['file-loader'],
      //   options: {
      //     // the hash for when svgs have been found
      //     name: '[name]-[hash].[ext]'
      //   }
      // },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({ options: {} }),
    new CleanWebpackPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
    new ImageminPlugin({
      maxFileSize: 10000, // Only apply this one to files equal to or under 10kb
      disable: !isProductionBuild,
      test: /\.(png|jpg|jpeg|gif)$/,
      pngquant: {
        quality: '95-100'
      },
      jpegtran: {
        progressive: false
      },
      gifsicle: {
        interlaced: false,
        optimizationLevel: 1
      },
      svgo: {
        /* Available plugins for optimization: https://github.com/svg/svgo#what-it-can-do
           plugins:[]
        */
      }
    }),
    new ImageminPlugin({
      minFileSize: 10000, // Only apply this one to files over 10kb
      disable: !isProductionBuild,
      test: /\.(png|jpg|jpeg|gif)$/,
      pngquant: {
        quality: '95-100'
      },
      jpegtran: {
        progressive: true
      },
      gifsicle: {
        interlaced: true,
        optimizationLevel: 1
      },
      svgo: {}
    }),
    new CopyPlugin({
      patterns: [
        { from: 'frontend/images', to: 'images' }
      ]
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: !isProductionBuild
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default']
        },
        canPrint: true
      })
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};

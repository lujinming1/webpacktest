const path = require('path');
const uglify = require('uglifyjs-webpack-plugin'); // JS压缩插件
const htmlPlugin = require('html-webpack-plugin'); // 打包HTML文件
const extractTextPlugin = require('extract-text-webpack-plugin'); // CSS分离
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');
console.log( encodeURIComponent(process.env.type) );
var website = {
  publicPath: "http://127.0.0.1:1717/"
}
module.exports={
  // entry
  entry: {
    entry: './src/entry.js',
    entry2: './src/entry2.js'
  },
  // output config
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: website.publicPath
  },
  //module config
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
          ]
        })
      },{
        test:/\.(png|jpg|gif)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 500,
            outputPath: 'images/'
          }
        }]
      },{
        test: /\.(html|htm)$/i,
        use: ['html-withimg-loader']
      },{
        test: /\.less$/,
        use:extractTextPlugin.extract({
          use:[{
            loader: "css-loader"
          },{
            loader: "less-loader"
          }],
          fallback: "style-loader"
        })
      },{
        test: /\.(sass|scss)/,
        use: extractTextPlugin.extract({
          use: [{
            loader: 'css-loader'
          },{
            loader: 'sass-loader'
          }],
          fallback: 'style-loader'
        })
      },{
        test: /\.(jsx|js)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/
      }
    ]
  },
  // plugins config
  plugins: [
  //  new uglify(),
    new htmlPlugin({
      minify:{
        removeAttributeQuotes: true
      },
      hash: true,
      template: './src/index.html'
    }),
    new extractTextPlugin('css/index.css'),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
    })
  ],
  //webpack development server
  devServer: {
    // base path
    contentBase: path.resolve(__dirname, 'dist'),
    host: 'localhost',
    compress: true,
    port: 1717
  },

  // watch config
  watchOptions: {
    poll: 1000, // ms
    aggregateTimeout: 500,
    ignored: /node_modules/
  }

}

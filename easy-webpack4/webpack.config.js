const webpack = require('webpack');
const path = require('path');
const glob =require('glob');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const purifyCssPlugin =require('purifycss-webpack');
const CleanWebpackPlugin=require('clean-webpack-plugin');

// test you proxy url
const CrossDomainURL = "https://www.darlang.com";

let opt={
    filename: './js/[name].[hash].js',
    chunkFilename: './js/[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
}

if(process.env.NODE_ENV==='production'){
    //生产环境
    opt={
        filename: './js/[name].[hash].js',
        chunkFilename: './js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath:'./'
    }

}else {
    opt={
        filename: './js/[name].[hash].js',
        chunkFilename: './js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    }
}


// setting webpack config
const config = {
  target: "web",
  devtool: "#source-map", // output mode
  entry: {// multiple entry
    index: "./src/index.js",
    utils: "./src/js/utils.js"
  },
    output: opt,
    /* output: {// output config
       filename: './js/[name].[hash].js',
       chunkFilename: './js/[name].[hash].js',
       path: path.resolve(__dirname, 'dist')
     },*/
  module: {
    rules: [
        {// loader js
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: [
              ["env", {
                "targets": {
                  "browsers": ["last 15 versions", "safari >= 4","not ie < 9", "iOS >= 7"]
                }
              }],
            ],
          }
        }
      ]
    },
        {// loader sass and css
      test: /\.(scss|css)$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader?modules=false',
          options: {
            importLoaders: 1,
            minimize: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            config: {
              path: path.resolve(__dirname, './postcss.config.js')
            }
          },
        },
        "sass-loader"
      ]
    },
        {
      test: /\.(jpg|png|ico|jpeg|gif)$/,
      use: [{
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          // publicPath: "../images/",
          outputPath: "images/"
        }
      }]
    },
        {
      test: /\.(eot|svg|ttf|woff)$/,
      use: [{
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          publicPath: "./fonts/",
          outputPath: "fonts/"
        }
      }]
    },
        {
            test:/\.(htm|html)$/,
            use:'html-withimg-loader',
            include:path.join(__dirname,'./src'),
            exclude:/node_modules/
        }

    ]
  },
  devServer: {// location:8088 test
    port: 8088,
    overlay: {
      error: true
    },
    proxy: {// agent cross-domain interface
      "/api": {
        target: CrossDomainURL,
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    },
    hot: true,// hot loading
    clientLogLevel: "none", // cancel console client log
    open: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HTMLPlugin({// specify index.html file
      template: 'index.html'
    }),
    new purifyCssPlugin({
        paths:glob.sync(path.join(__dirname,'src/*.html'))
    }),
      new CleanWebpackPlugin(path.join(__dirname,'dist'))
  ]
};

module.exports = config;
const path =require('path');
const glob =require('glob');
const purifyCssPlugin =require('purifycss-webpack');
const uglify = require('uglifyjs-webpack-plugin');
const webpack=require('webpack');

const htmlPlugin =require('html-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin=require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const optimizeCss =require('optimize-css-assets-webpack-plugin');//压缩css


console.log(process.env.NODE_ENV,'-------------------');
let opt={
    filename:'bundle.js',
    path:path.resolve(__dirname,'dist')
}

if(process.env.NODE_ENV==='production'){
    //生产环境
    opt={
        // filename:'bundle.js',
        filename:  '[name].[chunkhash:10].js',// 这样写，也可以将js文件都放在dist/js文件夹里面
        path:path.resolve(__dirname,'dist'),
        publicPath:'./'
    }

}else {
    opt={
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    }
}

const config ={
    devtool: "#source-map", // output mode
    entry:{
        entry:'./src/index.js',
        // jquery:'jquery'
    },
    output:opt,
  /*  output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist'),
        // publicPath:PUBLIC_PATH
    }*/
    devServer:{
        contentBase:path.resolve(__dirname,'dist'),
        host:'192.168.50.73',
        compress:true,
        port:1717,
        // autoOpenBrowser: true,
    },
    module:{
        rules:[
           /* {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        'postcss-loader'
                    ]
                })

            },*/
            {
                test:/\.css$/,
                use: extractTextPlugin.extract({
                    use: [{
                         loader: 'css-loader',
                         options:{minimize:true}
                    },'postcss-loader']
                }),
            },
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },

            {
              test:/\.(jpeg|jpg|png|gif|svg)$/,
              use:[{
                  loader: 'url-loader',
                  options: {
                    limit: 10240,
                    outputPath:'img/',
                      name: '[name].[hash:7].[ext]'
                    }
              }],
                include:path.join(__dirname,'src'),
                exclude:/node_modules/
            },
            {
                test:/\.(htm|html)$/,
                use:'html-withimg-loader',
                include:path.join(__dirname,'./src'),
                exclude:/node_modules/
            },
            {
                test:/\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    //下面的配置写在了.babelrc中去了
                  /*  options: {
                        presets: ["env","stage-0","react"]
                    }*/
                },
                include:path.join(__dirname,'./src'),
                exclude:/node_modules/
            },
       /*     {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                },{
                    loader: 'expose-loader',
                    options: '$'
                }]
            }*/
        ]

    },
    plugins: [
        // new uglify(),
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true,
                minimize: true,
                removeConments: true,
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
            },
            hash:true,//防止缓存
            template:'./src/index.html',
            filename:'index.html'

        }),
        // new extractTextPlugin('index.css'),
        new extractTextPlugin('style.[chunkhash:10].css'),
        new CleanWebpackPlugin(path.join(__dirname,'dist')),
        new purifyCssPlugin({
            paths:glob.sync(path.join(__dirname,'src/*.html'))
        }),
   /*     new CopyWebpackPlugin([
            {
                from:__dirname+'/src/static',
                to:'./static'
            }
        ]),*/
    ],
    optimization:{
       /* splitChunks:{
            cacheGroups:{ // 单独提取JS文件引入html
                $:{ // 键值可以自定义
                    chunks:'initial', //
                    name:'jquery', // 入口的entry的key
                    filename:'assets/js/jquery.min.js',
                    enforce:true   // 强制
                }

            }
        },*/
        minimizer: [new optimizeCss({}),new uglify()]
        // minimizer: [new uglify()]


  /*  resolve: {
    //自动补全后缀，注意第一个必须是空字符串,后缀一定以点开头
      extensions: [" ",".js",".css",".json"],

     },*/



}
}

module.exports=config;
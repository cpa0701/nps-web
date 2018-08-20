1.creat-react-app 项目
2.yarn run eject
3.yarn add antd antd-pro react-router-dom mobx@4.3.1, bable-polyfill mockjs jquery babel-plugin-import axios mobx-react
4.yarn add less,less-loader --dev
5.在webpack中修改cssloader为(less模块加载)
{
   test: /\.less$/,
   exclude: [/node_modules/],
   use: [
       require.resolve('style-loader'),
       {
           loader: require.resolve('css-loader'),
           options: {
               modules: true,
               localIndexName:"[name]__[local]___[hash:base64:5]"
           },
       },
       {
           loader: require.resolve('less-loader'), // compiles Less to CSS
       },
   ],
},
{
   test: /\.css$/,
   exclude: /node_modules|antd\.css/,
   use: [
       require.resolve('style-loader'),
       {
           loader: require.resolve('css-loader'),
           options: {
               importLoaders: 1,
               // 改动
               modules: true,   // 新增对css modules的支持
               localIdentName: '[name]__[local]__[hash:base64:5]', //
           },
       },
       {
           loader: require.resolve('postcss-loader'),
           options: {
               ident: 'postcss',
               plugins: () => [
                   require('postcss-flexbugs-fixes'),
                   autoprefixer({
                       browsers: [
                           '>1%',
                           'last 4 versions',
                           'Firefox ESR',
                           'not ie < 9', // React doesn't support IE8 anyway
                       ],
                       flexbox: 'no-2009',
                   }),
               ],
           },
       },
   ],
},
//
{
   test: /\.css$/,
   include: /node_modules|antd\.css/,
   use: [
       require.resolve('style-loader'),
       {
           loader: require.resolve('css-loader'),
           options: {
               importLoaders: 1,
               // 改动
               // modules: true,   // 新增对css modules的支持
               // localIdentName: '[name]__[local]__[hash:base64:5]', //
           },
       },
       {
           loader: require.resolve('postcss-loader'),
           options: {
               ident: 'postcss',
               plugins: () => [
                   require('postcss-flexbugs-fixes'),
                   autoprefixer({
                       browsers: [
                           '>1%',
                           'last 4 versions',
                           'Firefox ESR',
                           'not ie < 9', // React doesn't support IE8 anyway
                       ],
                       flexbox: 'no-2009',
                   }),
               ],
           },
       },
   ],
},
6.在test为test: /\.(js|jsx|mjs)$/的option中添加
plugins: [
             //['react-html-attrs'],//添加babel-plugin-react-html-attrs组件的插件配置
             // 引入样式为 css
             ['import', {libraryName: 'antd', style: 'css'}],
             // 改动: 引入样式为 less
             //  ['import', { libraryName: 'antd', style: true }],
         ],
7.在webpack配置入口出添加"babel-polyfill"，——兼容ie
8.yarn add  babel-plugin-transform-decorators-legacy --dev
并在package.json的babel配置中添加"plugins": [
                               "transform-decorators-legacy"
                             ],——解决es7浏览器支持
9.在package.json中指定"homepage": "./",
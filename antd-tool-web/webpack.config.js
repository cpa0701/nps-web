// Learn more on how to config.
// - https://github.com/ant-tool/atool-build#配置扩展
const path = require('path');

function resolve1(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = function (webpackConfig) {
    console.log(webpackConfig);
    webpackConfig.babel.plugins.push('transform-runtime');
    webpackConfig.babel.plugins.push(['import', {
        libraryName: 'antd',
        style: 'css',
    }]);
    return webpackConfig;
};

const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}
module.exports = function override(config, env) {
    // do stuff with the webpack config...
    config = injectBabelPlugin(['import', {libraryName: 'antd', style: true}], config);
    config = rewireLess.withLoaderOptions({
        javascriptEnabled: true,
        modifyVars: {
            "@layout-header-background": "#0085d0",
            "@primary-color":"#5cbdf4"
        },
    })(config, env);
    config.resolve.alias = {
        '@frame': resolve('src/admin/base/frame')
    }
    return config;
};
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
var webpack = require('webpack');
// const isProd = process.env.MY_APP_ROLE === 'production';
const isProd = process.env.NODE_ENV == 'production';
const assets = ['img', 'data', 'css', 'js']; // asset directories
const arg = { patterns: [] };
assets.map(asset => {
  arg.patterns.push(((isProd) => {
    return (isProd) ? {
      from: path.resolve(__dirname, 'src', asset),
      to: path.resolve(__dirname, '.webpack', 'renderer', asset)
    } : {
      from: path.resolve(__dirname, 'src', asset),
      to: path.resolve(__dirname, '.webpack', 'renderer', asset)
    }
  })(isProd))
});
module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new CopyWebpackPlugin(arg),
  new webpack.ProvidePlugin({
    // inject ES5 modules as global vars
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
  })
];

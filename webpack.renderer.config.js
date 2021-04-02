const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
// const isProd = process.env.MY_APP_ROLE === 'production';
const isProd = process.env.NODE_ENV == 'production';
const assets = ['img', 'data', 'css', 'js']; // asset directories
rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.html']
  },
  plugins: assets.map(asset => {
    return new CopyWebpackPlugin({
      patterns: [((isProd) => {
        return (!isProd) ?
          {
            from: path.resolve(__dirname, 'src', asset),
            to: path.resolve(__dirname, '.webpack', 'renderer', asset)
          } :
          {
            from: path.resolve(__dirname, 'src', asset),
            to: path.resolve(__dirname, '.webpack', 'renderer', 'main_window', asset)
          }
      })(isProd)],
    });
  }),
  devtool: 'inline-source-map'
};

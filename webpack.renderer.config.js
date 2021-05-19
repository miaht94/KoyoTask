const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
// const isProd = process.env.MY_APP_ROLE === 'production';
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
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    modules: [path.resolve(__dirname, 'src/js'), 'node_modules']
  },

  devtool: 'inline-source-map',


  
};

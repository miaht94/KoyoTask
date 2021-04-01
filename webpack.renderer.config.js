const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const buildPath = path.resolve(__dirname, "./dist");

const renderer = {
  entry: "./src/renderer.ts",
  output: {
    filename: "renderer.js",
    path: buildPath,
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader"
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          // Disables attributes processing
          sources: true,
        },
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  target: "electron-renderer",
  externalsPresets: {
    electronRenderer: true
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin({/* options: see below */ })],
    extensions: ['.tsx', '.ts', '.js', '.html'],
  },
  devtool: 'inline-source-map'
};

module.exports = renderer;

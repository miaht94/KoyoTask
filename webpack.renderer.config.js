const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const buildPath = path.resolve(__dirname, "./dist");

const renderer = {
  entry: "./src/renderer.ts",
  output: {
    filename: "renderer.js",
    path: buildPath
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader"
      }
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
    extensions: ['.tsx', '.ts', '.js'],
  }
};

module.exports = renderer;

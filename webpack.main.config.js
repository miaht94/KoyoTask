const path = require("path");
const merge = require("webpack-merge");
const buildPath = path.resolve(__dirname, "./dist");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const main = {
  entry: "./src/main.ts",
  output: {
    filename: "main.js",
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
  node: {
    __dirname: false,
    __filename: false
  },
  target: "electron-main",
  resolve: {
    plugins: [new TsconfigPathsPlugin({/* options: see below */ })],
    extensions: ['.tsx', '.ts', '.js'],
  }
};

module.exports = main;

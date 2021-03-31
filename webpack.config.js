const mainConfig = require("./webpack.main.config");
const rendererConfig = require("./webpack.renderer.config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const config = [mainConfig, rendererConfig
];

module.exports = config;

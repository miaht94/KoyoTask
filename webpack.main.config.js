module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main_process/index.ts',
  // Put your normal webpack config below here
  // output: {
  //   devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  // },
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    mainFields: ['module', 'main']
  },
  devtool: 'inline-source-map'
};
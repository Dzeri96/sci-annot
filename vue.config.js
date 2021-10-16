const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

// The app version is available in the code
process.env.VUE_APP_VERSION = process.env.npm_package_version;

module.exports = {
  lintOnSave: false,
  css: {
    extract: false,
  },
  configureWebpack: {
    devtool: 'source-map',
    optimization: {
      minimize: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'output.html', // the output file name that will be created
        template: 'public/index.html', // this is important - a template file to use for insertion
        inlineSource: '.(js|css)$' // embed all javascript and css inline
      }),
      new HtmlWebpackInlineSourcePlugin()
    ]
  }
}
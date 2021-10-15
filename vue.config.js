
// The app version is available in the code
process.env.VUE_APP_VERSION = process.env.npm_package_version;

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devtool: 'source-map',
    optimization: {
      minimize: true
    }
  }
}
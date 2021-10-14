var WebpackAutoInject = require('webpack-auto-inject-version');

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devtool: 'source-map',
    optimization: {
      minimize: true
    },
    plugins: [
      new WebpackAutoInject({
        // options
        // example:
        components: {
          AutoIncreaseVersion: false,
          InjectAsComment: false
        }
      })
    ]
  }
}
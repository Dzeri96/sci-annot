var WebpackAutoInject = require('webpack-auto-inject-version');

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devtool: 'source-map',
    optimization: {
      minimize: true,
    },
    plugins: [
      new WebpackAutoInject({
        components: {
          AutoIncreaseVersion: false,
          InjectAsComment: false
        }
      })
    ]
  }
}
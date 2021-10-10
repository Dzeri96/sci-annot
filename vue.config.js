var WebpackAutoInject = require('webpack-auto-inject-version');

module.exports = {
  lintOnSave: false,
  configureWebpack: {
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
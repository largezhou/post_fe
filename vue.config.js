module.exports = {
  lintOnSave: false,
  devServer: {
    https: Boolean(process.env.VUE_APP_DEV_SSL),
  },
}

module.exports = {
  parser: 'babel-eslint',
  env: {
    'googleappsscript/googleappsscript': true,
    'browser': true,
    'node': true,
    'es6' : true
  },
  extends: 'standard',
  plugins: [
    'googleappsscript'
  ]
}

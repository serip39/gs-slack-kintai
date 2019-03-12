# Google Clasp + Babel + Webpack + ESLint


### Webpack + Babel

[gas-webpack-plugin](https://github.com/fossamagna/gas-webpack-plugin)

```
In Google Apps Script, it must be top level function declaration that entry point called from google.script.run. When gas-webpack-plugin detect a function assignment expression to global object. it generate a top level function declaration statement.
```

`global` オブジェクトに定義しなければ、scriptを実行することができない。

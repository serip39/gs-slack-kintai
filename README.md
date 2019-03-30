# Google Clasp + Babel + Webpack + ESLint


### Webpack + Babel

[gas-webpack-plugin](https://github.com/fossamagna/gas-webpack-plugin)

```
In Google Apps Script, it must be top level function declaration that entry point called from google.script.run. When gas-webpack-plugin detect a function assignment expression to global object. it generate a top level function declaration statement.
```

`global` オブジェクトに定義しなければ、scriptを実行することができない。

---

## 基本設計
- slack Botでは、Event API, Web APIを用いて送受信を行う
- データの登録は1つのスプレッドシートにログを残す形式で行う
- ログから実際に各個人のスプレッドシートに情報を転記する
- 表示はhtmlで表示する


#### log（timestamp/打刻用）
- 出勤 begin
- 退勤 finish
- 休憩開始 breat-start
- 休憩終了 break-finish

| parameter | memo |
|:-----|:-----|
| time | POSTされた時間 |
| user | POSTしたユーザー情報 |
| task | 出勤/退勤/休憩開始/休憩終了 |
| posted | 1:転記済み / 0:未転記 |


#### apply（申請/update用）
- 休暇申請 vacation
  - 有休 paid
    - 終日 all
    - 午前休 morning
    - 午後休 afternoon
  - 代休 compensation
  - 慶弔休暇 special
  - 欠勤 absence

- 遅刻申請 late
- 早退申請 early
- 残業申請 overtime

| parameter | memo |
|:-----|:-----|
| time | POSTされた時間 |
| user | POSTしたユーザー情報 |
| task | 休暇申請/遅刻申請/早退申請/残業申請 |
| from | いつから / 遅刻の場合はここに時刻記載（早退の場合、空欄） |
| to | いつまで / 早退の場合はここに時刻記載（遅刻の場合、空欄） |
| boss | 承認者 |
| approval | 1:許可 / 0:却下 |
| posted | 1:転記済み / 0:未転記 |

